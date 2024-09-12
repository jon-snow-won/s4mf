import { createAsyncThunk } from '@reduxjs/toolkit'

import { ThunkConfig } from '@providers/StoreProvider'
import { RejectWithValueType } from '@providers/StoreProvider/config/StateSchema'
import { Component, ComponentsControllerRemoveRequest } from '@src/vendor/bff-openapi-client'
import { keycloakClient } from '@utils/keycloak'

export interface Props extends ComponentsControllerRemoveRequest {}

export const deleteComponentById = createAsyncThunk<Component, Props, ThunkConfig<RejectWithValueType>>(
    'manifest/deleteComponentById',
    async (params, thunkAPI) => {
        const { id } = params
        const { extra, rejectWithValue } = thunkAPI

        try {
            const token = keycloakClient?.token

            return await extra.api.components
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
                .componentsControllerRemove({
                    id: String(id),
                })
        } catch (error) {
            return rejectWithValue({ error })
        }
    },
)
