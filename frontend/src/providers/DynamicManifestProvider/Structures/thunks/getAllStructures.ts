import { createAsyncThunk } from '@reduxjs/toolkit'

import { ThunkConfig } from '@providers/StoreProvider'
import { RejectWithValueType } from '@providers/StoreProvider/config/StateSchema'
import {
    StructuresControllerFindAll200Response,
    StructuresControllerFindAllRequest,
} from '@src/vendor/bff-openapi-client'
import { keycloakClient } from '@utils/keycloak'

export interface Props extends StructuresControllerFindAllRequest {}

export const getAllStructures = createAsyncThunk<
    StructuresControllerFindAll200Response,
    Props,
    ThunkConfig<RejectWithValueType>
>('manifest/getAllStructures', async (params, thunkAPI) => {
    const { extra, rejectWithValue } = thunkAPI

    try {
        const token = keycloakClient?.token

        return await extra.api.structures
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
            .structuresControllerFindAll({
                populateAll: true,
            })
    } catch (error) {
        return rejectWithValue({ error })
    }
})
