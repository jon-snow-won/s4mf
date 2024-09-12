import { createAsyncThunk } from '@reduxjs/toolkit'

import { ThunkConfig } from '@providers/StoreProvider'
import { RejectWithValueType } from '@providers/StoreProvider/config/StateSchema'
import {
    Component,
    ComponentsControllerCreateRequest,
    ComponentsControllerUpdateRequest,
    CreateComponentResponseDto,
} from '@src/vendor/bff-openapi-client'
import { keycloakClient } from '@utils/keycloak'

export interface Props extends ComponentsControllerCreateRequest {}

export const postComponent = createAsyncThunk<CreateComponentResponseDto, Props, ThunkConfig<RejectWithValueType>>(
    'manifest/postComponent',
    async (params, thunkAPI) => {
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
                .componentsControllerCreate(params)
        } catch (error) {
            return rejectWithValue({ error })
        }
    },
)
