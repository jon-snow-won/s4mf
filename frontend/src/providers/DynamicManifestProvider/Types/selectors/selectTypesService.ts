import { StateSchema } from '@providers/StoreProvider'

export const selectTypesService = (state: StateSchema) => ({
    typesService: state?.manifestTypes.typesService,
    typesServiceFetchPending: state?.manifestTypes.typesServiceFetchPending,
    typesServiceFetchSuccess: state?.manifestTypes.typesServiceFetchSuccess,
})
