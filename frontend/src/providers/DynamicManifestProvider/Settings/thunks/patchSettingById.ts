import { createAsyncThunk } from '@reduxjs/toolkit'

import { ThunkConfig } from '@providers/StoreProvider'
import { RejectWithValueType } from '@providers/StoreProvider/config/StateSchema'
import { Setting, SettingsControllerUpdateRequest } from '@src/vendor/bff-openapi-client'
import { keycloakClient } from '@utils/keycloak'

export interface Props extends SettingsControllerUpdateRequest {}

export const patchSettingById = createAsyncThunk<Setting, Props, ThunkConfig<RejectWithValueType>>(
    'manifest/patchSettingById',
    async (params, thunkAPI) => {
        const { id, updateSettingDto } = params
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
                .settingsControllerUpdate({
                    id: String(id),
                    updateSettingDto,
                    toReplace: true,
                })
        } catch (error) {
            return rejectWithValue({ error })
        }
    },
)
