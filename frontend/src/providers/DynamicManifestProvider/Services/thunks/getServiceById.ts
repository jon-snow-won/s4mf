import { createAsyncThunk } from '@reduxjs/toolkit'

import { ThunkConfig } from '@providers/StoreProvider'
import { RejectWithValueType } from '@providers/StoreProvider/config/StateSchema'
import { Service, ServicesControllerFindOneRequest } from '@src/vendor/bff-openapi-client'
import { keycloakClient } from '@utils/keycloak'

export interface Props extends ServicesControllerFindOneRequest {}

export const getServiceById = createAsyncThunk<Service, Props, ThunkConfig<RejectWithValueType>>(
    'manifest/getServiceById',
    async (params, thunkAPI) => {
        const { id } = params
        const { extra, rejectWithValue } = thunkAPI

        try {
            const token = keycloakClient?.token

            return await extra.api.services
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
                .servicesControllerFindOne({ id: String(id) })
        } catch (error) {
            return rejectWithValue({ error })
        }
    },
)
