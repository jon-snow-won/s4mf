import { StateSchema } from '@providers/StoreProvider'

export const selectStructure = (state: StateSchema) => ({
    structure: state?.manifestStructures.structure,
    structureFetchPending: state?.manifestStructures.structureFetchPending,
    structureFetchSuccess: state?.manifestStructures.structureFetchSuccess,
})
