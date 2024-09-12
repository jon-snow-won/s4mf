import { Component } from '@src/vendor/bff-openapi-client'

export interface ManifestComponentsSchema {
    components: Component[]
    componentsFetchPending: boolean
    componentsFetchSuccess: boolean

    component: Component
    componentFetchPending: boolean
    componentFetchSuccess: boolean
}
