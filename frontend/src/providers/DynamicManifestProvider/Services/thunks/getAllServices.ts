import { createAsyncThunk } from '@reduxjs/toolkit'

import { ThunkConfig } from '@providers/StoreProvider'
import { RejectWithValueType } from '@providers/StoreProvider/config/StateSchema'
import { ServicesControllerFindAll200Response, ServicesControllerFindAllRequest } from '@src/vendor/bff-openapi-client'
import { keycloakClient } from '@utils/keycloak'

export interface Props extends ServicesControllerFindAllRequest {}

export const getAllServices = createAsyncThunk<
    // ServicesControllerFindAll200Response,
    ServicesControllerFindAll200Response['data'],
    Props,
    ThunkConfig<RejectWithValueType>
>('manifest/getAllServices', async (params, thunkAPI) => {
    const { extra, rejectWithValue } = thunkAPI

    try {
        const token = keycloakClient?.token

        const resp0 = await extra.api.services
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
            .servicesControllerFindAll({ populateAll: true, take: 50, page: 1 })

        const resp1 = await extra.api.services
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
            .servicesControllerFindAll({ populateAll: true, take: 50, page: 2 })

        const resp2 = await extra.api.services
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
            .servicesControllerFindAll({ populateAll: true, take: 50, page: 3 })

        const resp3 = await extra.api.services
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
            .servicesControllerFindAll({ populateAll: true, take: 50, page: 4 })

        return [...resp0.data, ...resp1.data, ...resp2.data, ...resp3.data]
    } catch (error) {
        return rejectWithValue({ error })
    }
})
