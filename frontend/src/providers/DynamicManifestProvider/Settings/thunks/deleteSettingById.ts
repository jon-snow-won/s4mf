import { createAsyncThunk } from '@reduxjs/toolkit'

import { ThunkConfig } from '@providers/StoreProvider'
import { RejectWithValueType } from '@providers/StoreProvider/config/StateSchema'
import { Setting, SettingsControllerRemoveRequest } from '@src/vendor/bff-openapi-client'
import { keycloakClient } from '@utils/keycloak'

export interface Props extends SettingsControllerRemoveRequest {}

export const deleteSettingById = createAsyncThunk<Setting, Props, ThunkConfig<RejectWithValueType>>(
    'manifest/deleteSettingById',
    async (params, thunkAPI) => {
        const { id } = params
        const { extra, rejectWithValue } = thunkAPI

        try {
            const token = keycloakClient?.token

            return await extra.api.settings
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
                .settingsControllerRemove({
                    id: String(id),
                    isHardDelete: false,
                })
        } catch (error) {
            return rejectWithValue({ error })
        }
    },
)
