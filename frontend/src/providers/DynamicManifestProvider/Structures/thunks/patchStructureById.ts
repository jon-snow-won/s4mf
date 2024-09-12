import { createAsyncThunk } from '@reduxjs/toolkit'

import { ThunkConfig } from '@providers/StoreProvider'
import { RejectWithValueType } from '@providers/StoreProvider/config/StateSchema'
import { Structure, StructuresControllerUpdateRequest } from '@src/vendor/bff-openapi-client'
import { keycloakClient } from '@utils/keycloak'

export interface Props extends StructuresControllerUpdateRequest {}

export const patchStructureById = createAsyncThunk<Structure, Props, ThunkConfig<RejectWithValueType>>(
    'manifest/patchStructureById',
    async (params, thunkAPI) => {
        const { id, updateStructureDto } = params
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
                .structuresControllerUpdate({
                    id: String(id),
                    updateStructureDto,
                    toReplace: true,
                })
        } catch (error) {
            return rejectWithValue({ error })
        }
    },
)
