import { createAsyncThunk } from '@reduxjs/toolkit'

import { ThunkConfig } from '@providers/StoreProvider'
import { RejectWithValueType } from '@providers/StoreProvider/config/StateSchema'
import { Component, ComponentsControllerUpdateRequest } from '@src/vendor/bff-openapi-client'
import { keycloakClient } from '@utils/keycloak'

export interface Props extends ComponentsControllerUpdateRequest {}

export const patchComponentById = createAsyncThunk<Component, Props, ThunkConfig<RejectWithValueType>>(
    'manifest/patchComponentById',
    async (params, thunkAPI) => {
        const { id, updateComponentDto } = params
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
                .componentsControllerUpdate({
                    id: String(id),
                    updateComponentDto,
                })
        } catch (error) {
            return rejectWithValue({ error })
        }
    },
)
