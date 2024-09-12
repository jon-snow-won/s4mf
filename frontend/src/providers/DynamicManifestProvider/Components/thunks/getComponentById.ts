import { createAsyncThunk } from '@reduxjs/toolkit'

import { ThunkConfig } from '@providers/StoreProvider'
import { RejectWithValueType } from '@providers/StoreProvider/config/StateSchema'
import { Component, ComponentsControllerFindOneRequest } from '@src/vendor/bff-openapi-client'
import { keycloakClient } from '@utils/keycloak'

export interface Props extends ComponentsControllerFindOneRequest {}

export const getComponentById = createAsyncThunk<Component, Props, ThunkConfig<RejectWithValueType>>(
    'manifest/getComponentById',
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
                .componentsControllerFindOne({ id: String(id) })
        } catch (error) {
            return rejectWithValue({ error })
        }
    },
)
