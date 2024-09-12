import { CombinedState, configureStore, Reducer, ReducersMapObject } from '@reduxjs/toolkit'

import { manifestReducer } from '@providers/DynamicManifestProvider/Manifest/slice/manifestSlice'
import { manifestTypesReducer } from '@providers/DynamicManifestProvider/Types/slice/manifestTypesSlice'
import { manifestStructuresReducer } from '@providers/DynamicManifestProvider/Structures/slice/manifestStructuresSlice'
import { manifestSettingsReducer } from '@providers/DynamicManifestProvider/Settings/slice/manifestSettingsSlice'
import { manifestServicesReducer } from '@providers/DynamicManifestProvider/Services/slice/manifestServicesSlice'
import { manifestComponentsReducer } from '@providers/DynamicManifestProvider/Components/slice/manifestComponentsSlice'
import { manifestRolesReducer } from '@providers/DynamicManifestProvider/Roles/slice/manifestRolesSlice'
import {
    ComponentsApi,
    Configuration,
    RolesApi,
    ServicesApi,
    SettingsApi,
    StructuresApi,
    TypesApi,
} from '@src/vendor/bff-openapi-client'

import { createReducerManager } from './reducerManager'
import { StateSchema } from './StateSchema'

export interface ThunkExtraArg {
    api: {
        components: ComponentsApi
        roles: RolesApi
        services: ServicesApi
        settings: SettingsApi
        structures: StructuresApi
        types: TypesApi
    }
    navigate: undefined
}

const config = new Configuration({ basePath: '/aggregate-bff' })

export function createReduxStore(
    initialState?: StateSchema,
    asyncReducers?: ReducersMapObject<StateSchema>, // TODO: оптимизировать размер бандла приложения так, чтобы в нём были реализованы асинхронные (отключаемые) редьюсеры
) {
    // Синхронные редьюсеры
    const rootReducers: ReducersMapObject<StateSchema> = {
        ...asyncReducers,
        manifest: manifestReducer,
        manifestComponents: manifestComponentsReducer,
        manifestRoles: manifestRolesReducer,
        manifestServices: manifestServicesReducer,
        manifestSettings: manifestSettingsReducer,
        manifestStructures: manifestStructuresReducer,
        manifestTypes: manifestTypesReducer,
    }

    const reducerManager = createReducerManager(rootReducers)

    const componentsApiClient = new ComponentsApi(config)
    const rolesApiClient = new RolesApi(config)
    const servicesApiClient = new ServicesApi(config)
    const settingsApiClient = new SettingsApi(config)
    const structuresApiClient = new StructuresApi(config)
    const typesApiClient = new TypesApi(config)

    const extraArg: ThunkExtraArg = {
        api: {
            components: componentsApiClient,
            roles: rolesApiClient,
            settings: settingsApiClient,
            services: servicesApiClient,
            structures: structuresApiClient,
            types: typesApiClient,
        },
        navigate: undefined, // костыль, решающий проблему теряющегося стейта во время осуществления навигации
    }

    const store = configureStore({
        reducer: reducerManager.reduce as Reducer<CombinedState<StateSchema>>,
        // devTools: __IS_DEV__, // TODO: добавить отключение девтулзов
        devTools: true,
        preloadedState: initialState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                thunk: {
                    extraArgument: extraArg,
                },
            }),
    })

    // @ts-ignore
    store.reducerManager = reducerManager

    return store
}

export type AppDispatch = ReturnType<typeof createReduxStore>['dispatch']
