import { createAsyncThunk } from '@reduxjs/toolkit'

import { ThunkConfig } from '@providers/StoreProvider'
import { RejectWithValueType } from '@providers/StoreProvider/config/StateSchema'
import {
    Service,
    ServicesControllerCreateRequest,
    ServicesControllerFindAll200Response,
} from '@src/vendor/bff-openapi-client'
import { keycloakClient } from '@utils/keycloak'

export interface Props extends ServicesControllerCreateRequest {}

export const postService = createAsyncThunk<Service, Props, ThunkConfig<RejectWithValueType>>(
    'manifest/postService',
    async (params, thunkAPI) => {
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
                .servicesControllerCreate(params)
        } catch (error) {
            return rejectWithValue({ error })
        }
    },
)
