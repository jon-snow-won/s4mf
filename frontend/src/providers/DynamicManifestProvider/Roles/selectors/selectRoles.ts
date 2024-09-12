import { StateSchema } from '@providers/StoreProvider'

export const selectRoles = (state: StateSchema) => ({
    roles: state?.manifestRoles.roles,
    rolesFetchPending: state?.manifestRoles.rolesFetchPending,
    rolesFetchSuccess: state?.manifestRoles.rolesFetchSuccess,
})
