import { createAsyncThunk } from '@reduxjs/toolkit'

import { ThunkConfig } from '@providers/StoreProvider'
import { RejectWithValueType } from '@providers/StoreProvider/config/StateSchema'
import { ServiceType, SettingType } from '@src/vendor/bff-openapi-client'
import { keycloakClient } from '@utils/keycloak'

export interface Props {}

export const fetchTypesService = createAsyncThunk<ServiceType[], Props, ThunkConfig<RejectWithValueType>>(
    'manifest/fetchServiceTypes',
    async (params, thunkAPI) => {
        const { extra, rejectWithValue } = thunkAPI

        try {
            const token = keycloakClient?.token

            return await extra.api.types
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
                .typesControllerGetServiceTypes()
        } catch (error) {
            return rejectWithValue({ error })
        }
    },
)
