import { StateSchema } from '@providers/StoreProvider'

export const selectStructures = (state: StateSchema) => ({
    structures: state?.manifestStructures.structures,
    structuresFetchPending: state?.manifestStructures.structuresFetchPending,
    structuresFetchSuccess: state?.manifestStructures.structuresFetchSuccess,
})
