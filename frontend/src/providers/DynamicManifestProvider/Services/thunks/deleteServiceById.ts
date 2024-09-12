import { createAsyncThunk } from '@reduxjs/toolkit'

import { ThunkConfig } from '@providers/StoreProvider'
import { RejectWithValueType } from '@providers/StoreProvider/config/StateSchema'
import { Component, Service, ServicesControllerRemoveRequest, UpdateServiceDto } from '@src/vendor/bff-openapi-client'
import { keycloakClient } from '@utils/keycloak'

export interface Props extends ServicesControllerRemoveRequest {}

export const deleteServiceById = createAsyncThunk<Service, Props, ThunkConfig<RejectWithValueType>>(
    'manifest/deleteServiceById',
    async (params, thunkAPI) => {
        const { id, isHardDelete } = params
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
                .servicesControllerRemove({
                    id: String(id),
                    isHardDelete,
                })
        } catch (error) {
            return rejectWithValue({ error })
        }
    },
)
