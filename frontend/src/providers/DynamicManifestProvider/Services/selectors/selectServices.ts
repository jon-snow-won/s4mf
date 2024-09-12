import { StateSchema } from '@providers/StoreProvider'

export const selectServices = (state: StateSchema) => ({
    services: state?.manifestServices.services,
    servicesFetchPending: state?.manifestServices.servicesFetchPending,
    servicesFetchSuccess: state?.manifestServices.servicesFetchSuccess,
})
