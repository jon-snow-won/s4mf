import { StateSchema } from '@providers/StoreProvider'

export const selectService = (state: StateSchema) => ({
    service: state?.manifestServices.service,
    serviceFetchPending: state?.manifestServices.serviceFetchPending,
    serviceFetchSuccess: state?.manifestServices.serviceFetchSuccess,
})
