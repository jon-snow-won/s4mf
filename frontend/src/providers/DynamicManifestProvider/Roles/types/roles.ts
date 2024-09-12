import { Role } from '@src/vendor/bff-openapi-client'

export interface ManifestRolesSchema {
    roles: Role[]
    rolesFetchPending: boolean
    rolesFetchSuccess: boolean
}
