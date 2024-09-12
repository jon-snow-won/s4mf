import { createAsyncThunk } from '@reduxjs/toolkit'

import { ThunkConfig } from '@providers/StoreProvider'
import { RejectWithValueType } from '@providers/StoreProvider/config/StateSchema'
import { Role } from '@src/vendor/bff-openapi-client'
import { keycloakClient } from '@utils/keycloak'

export interface Props {}

export const getAllRoles = createAsyncThunk<Role[], Props, ThunkConfig<RejectWithValueType>>(
    'manifest/fetchRoles',
    async (params, thunkAPI) => {
        const { extra, rejectWithValue } = thunkAPI

        try {
            const token = keycloakClient?.token

            return await extra.api.roles
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
                .rolesControllerGetRoles()
        } catch (error) {
            return rejectWithValue({ error })
        }
    },
)
