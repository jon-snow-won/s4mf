import { Service } from '@src/vendor/bff-openapi-client'

export interface ManifestServicesSchema {
    services: Service[]
    servicesFetchPending: boolean
    servicesFetchSuccess: boolean

    service: Service
    serviceFetchPending: boolean
    serviceFetchSuccess: boolean
}
