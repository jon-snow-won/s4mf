import { createAsyncThunk } from '@reduxjs/toolkit'

import { DynamicManifest } from '@providers/DynamicManifestProvider/Manifest/types/manifest'
import { fetchTypesService } from '@providers/DynamicManifestProvider/Types/thunks/fetchTypesService'
import { fetchTypesSetting } from '@providers/DynamicManifestProvider/Types/thunks/fetchTypesSetting'
import { ThunkConfig } from '@providers/StoreProvider'
import { RejectWithValueType } from '@providers/StoreProvider/config/StateSchema'
import { StructuresControllerFindAllRequest } from '@src/vendor/bff-openapi-client'
import { keycloakClient } from '@utils/keycloak'

export interface Props extends StructuresControllerFindAllRequest {
    structureName: string | null
}

export const getManifest = createAsyncThunk<DynamicManifest, Props, ThunkConfig<RejectWithValueType>>(
    'manifest/getManifest',
    async (params, thunkAPI) => {
        const { structureName } = params
        const { extra, rejectWithValue, dispatch } = thunkAPI

        try {
            const token = keycloakClient?.token

            const structuresResponse = await extra.api.structures
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

            const structureNameForFilter = structureName ?? 'fed-app-entry-structure'

            const structure = structuresResponse.data.filter(({ name }) => name === structureNameForFilter)?.[0]

            // const settingIds = structure.settings.map(({id}) => id)
            // const serviceIds = structure.services.map(({id}) => id)
            const serviceTypesAction = await dispatch(fetchTypesService({}))
            const settingTypesAction = await dispatch(fetchTypesSetting({}))

            if (
                serviceTypesAction.meta.requestStatus !== 'fulfilled' ||
                settingTypesAction.meta.requestStatus !== 'fulfilled'
            ) {
                return
            }

            const serviceTypes = serviceTypesAction.payload
            const settingTypes = settingTypesAction.payload

            return {
                structure,
                settings: structure.settings,
                services: structure.services,
            }
        } catch (error) {
            return rejectWithValue({ error })
        }
    },
)
