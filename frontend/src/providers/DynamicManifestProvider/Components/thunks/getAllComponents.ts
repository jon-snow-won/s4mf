import { createAsyncThunk } from '@reduxjs/toolkit'

import { ThunkConfig } from '@providers/StoreProvider'
import { RejectWithValueType } from '@providers/StoreProvider/config/StateSchema'
import {
    ComponentsControllerFindAll200Response,
    ComponentsControllerFindAllRequest,
} from '@src/vendor/bff-openapi-client'
import { keycloakClient } from '@utils/keycloak'

export interface Props extends ComponentsControllerFindAllRequest {}

export const getAllComponents = createAsyncThunk<
    ComponentsControllerFindAll200Response,
    Props,
    ThunkConfig<RejectWithValueType>
>('manifest/fetchComponents', async (params, thunkAPI) => {
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
            .componentsControllerFindAll({ populateAll: true })
    } catch (error) {
        return rejectWithValue({ error })
    }
})
