import { AnyAction, CombinedState, Reducer, ReducersMapObject } from '@reduxjs/toolkit'
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'

import { ManifestSchema } from '@providers/DynamicManifestProvider/Manifest/types/manifest'
import { ManifestTypesSchema } from '@providers/DynamicManifestProvider/Types/types/manifestTypes'
import { ManifestStructuresSchema } from '@providers/DynamicManifestProvider/Structures/types/structures'
import { ManifestSettingsSchema } from '@providers/DynamicManifestProvider/Settings/types/settings'
import { ManifestServicesSchema } from '@providers/DynamicManifestProvider/Services/types/services'
import { ManifestRolesSchema } from '@providers/DynamicManifestProvider/Roles/types/roles'
import { ManifestComponentsSchema } from '@providers/DynamicManifestProvider/Components/types/components'
import { ThunkExtraArg } from '@providers/StoreProvider/config/store'

export interface StateSchema {
    manifest: ManifestSchema
    manifestComponents: ManifestComponentsSchema
    manifestRoles: ManifestRolesSchema
    manifestServices: ManifestServicesSchema
    manifestSettings: ManifestSettingsSchema
    manifestStructures: ManifestStructuresSchema
    manifestTypes: ManifestTypesSchema
    extra: ThunkExtraArg
}

export type StateSchemaKey = keyof StateSchema

export interface ReducerManager {
    getReducerMap: () => ReducersMapObject<StateSchema>
    reduce: (state: StateSchema, action: AnyAction) => CombinedState<StateSchema>
    add: (key: StateSchemaKey, reducer: Reducer) => void
    remove: (key: StateSchemaKey) => void
}

export interface ReduxStoreWithManager extends ToolkitStore<StateSchema> {
    reducerManager: ReducerManager
}

export interface ThunkConfig<RejectValue = unknown> {
    rejectValue: RejectValue
    extra: ThunkExtraArg
}

export type RejectWithValueType = {
    type?: 'success' | 'info' | 'warning' | 'error'
    title?: string
    error: any
    fallbackErrorMessage?: string
}
