import { Service, Setting, Structure } from '@src/vendor/bff-openapi-client'

export interface ManifestSchema {
    structure: Structure
    settings: Setting[]
    services: Service[]
    manifestFetchPending: boolean
    manifestFetchSuccess: boolean
}

export interface DynamicManifest {
    structure: Structure
    settings: Setting[]
    services: Service[]
}
