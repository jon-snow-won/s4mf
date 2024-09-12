import { createAsyncThunk } from '@reduxjs/toolkit'

import { ThunkConfig } from '@providers/StoreProvider'
import { RejectWithValueType } from '@providers/StoreProvider/config/StateSchema'
import { Structure, StructuresControllerCreateRequest } from '@src/vendor/bff-openapi-client'
import { keycloakClient } from '@utils/keycloak'

export interface Props extends StructuresControllerCreateRequest {}

export const postStructure = createAsyncThunk<Structure, Props, ThunkConfig<RejectWithValueType>>(
    'manifest/postStructure',
    async (params, thunkAPI) => {
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
                .structuresControllerCreate(params)
        } catch (error) {
            return rejectWithValue({ error })
        }
    },
)
