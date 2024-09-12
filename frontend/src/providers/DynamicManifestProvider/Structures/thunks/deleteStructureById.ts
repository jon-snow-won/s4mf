import { createAsyncThunk } from '@reduxjs/toolkit'

import { ThunkConfig } from '@providers/StoreProvider'
import { RejectWithValueType } from '@providers/StoreProvider/config/StateSchema'
import {
    Structure,
    StructuresControllerFindOneRequest,
    StructuresControllerRemoveRequest,
} from '@src/vendor/bff-openapi-client'
import { keycloakClient } from '@utils/keycloak'

export interface Props extends StructuresControllerRemoveRequest {}

export const deleteStructureById = createAsyncThunk<Structure, Props, ThunkConfig<RejectWithValueType>>(
    'manifest/deleteStructureById',
    async (params, thunkAPI) => {
        const { id } = params
        const { extra, rejectWithValue } = thunkAPI

        try {
            const token = keycloakClient?.token

            return await extra.api.structures
                .withPreMiddleware(async (context) => {
                    if (token) {
                        // eslint-disable-next-line no-param-reassign
                        context.init.headers = {
                            ...context.init.headers,
                            Authorization: `Bearer ${token}`,
                        }
                    }

                    return context
                })
                .structuresControllerRemove({
                    id: String(id),
                    isHardDelete: false,
                })
        } catch (error) {
            return rejectWithValue({ error })
        }
    },
)
