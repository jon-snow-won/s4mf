import { Role } from '@pages/SelectRolePage/types/Role'

export interface ManifestContentComponent {
    name: string
    areaId: string
}

export interface ManifestContentWidget {
    components: ManifestContentComponent[]
}

export interface ManifestComponentSupersetParams {
    domain: string
    dashboardId: string
    accessUsername: string
    accessPassword: string
    guestUsername: string
    guestFirstname: string
    guestLastname: string
}

export interface ManifestComponentTabs {
    path: string
    title: string
    source: string
    supersetParams?: ManifestComponentSupersetParams
}

export interface ManifestComponent {
    url: string
    scope: string
    module: string
    props: any
    mode?: 'iFrame' | 'blazor' | 'superset' | 'remote'
    tabs?: ManifestComponentTabs[]
}

export interface WidgetParams {
    allowedParams: string[]
    paramsTypes: Record<string, unknown>
    defaultParams: Record<string, unknown>
}

// eslint-disable-next-line import/export
export interface ManifestWidgetMetadata {
    name: string
    path: string | null
    widgetId: string
    areaId: string
    params: WidgetParams
    readParams: string[]
    writeParams: string[]
    events: any
    actions: any
}

export interface ManifestServiceAuth {
    url: string
}

export interface ManifestServicesData {
    [key: string]: ManifestServiceAuth
}

export interface ManifestRouteMetadata {
    name: string
    path: string | null
    layout: string
    content: string[]
    icon: string
}

export interface ManifestAppMetadata {
    name: string
    routes: string[]
    isGroup: boolean
}

// eslint-disable-next-line import/export
export interface ManifestWidgetMetadata extends ManifestAppMetadata {
    icon: string
}

export interface ManifestApp {
    [key: string]: ManifestAppMetadata
}

export interface ManifestWidget {
    [key: string]: ManifestWidgetMetadata
}

export interface ManifestRemote {
    url: string
    scope: string
    module: string
    props?: any
}

export type ManifestContent = Record<string, ManifestContentWidget>
export type ManifestRoutes = Record<string, ManifestRouteMetadata>
export type ManifestComponents = Record<string, ManifestComponent>

export interface Manifest {
    version: string
    name: string
    description: string
    services: {
        [key: string]: ManifestServicesData
    }
    routes: {
        [key: string]: ManifestRouteMetadata
    }
    content: ManifestContent
    components: ManifestComponents
    remotes: ManifestRemote[]
    apps: ManifestApp
    widgets: ManifestWidget
    roles: Role[]
}
