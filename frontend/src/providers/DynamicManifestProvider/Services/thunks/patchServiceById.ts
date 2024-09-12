import { createAsyncThunk } from '@reduxjs/toolkit'

import { ThunkConfig } from '@providers/StoreProvider'
import { RejectWithValueType } from '@providers/StoreProvider/config/StateSchema'
import { Component, Service, ServicesControllerUpdateRequest, UpdateServiceDto } from '@src/vendor/bff-openapi-client'
import { keycloakClient } from '@utils/keycloak'

export interface Props extends ServicesControllerUpdateRequest {}

export const patchServiceById = createAsyncThunk<Service, Props, ThunkConfig<RejectWithValueType>>(
    'manifest/patchServiceById',
    async (params, thunkAPI) => {
        const { id, updateServiceDto } = params
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
                .servicesControllerUpdate({
                    id: String(id),
                    updateServiceDto,
                    toReplace: true,
                })
        } catch (error) {
            return rejectWithValue({ error })
        }
    },
)
