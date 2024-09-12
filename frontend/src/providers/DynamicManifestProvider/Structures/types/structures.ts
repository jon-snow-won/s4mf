import { Structure } from '@src/vendor/bff-openapi-client'

export interface ManifestStructuresSchema {
    structures: Structure[]
    structuresFetchPending: boolean
    structuresFetchSuccess: boolean

    structure: Structure
    structureFetchPending: boolean
    structureFetchSuccess: boolean
}
