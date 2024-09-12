import { StateSchema } from '@providers/StoreProvider'

export const selectComponents = (state: StateSchema) => ({
    components: state?.manifestComponents.components,
    componentsFetchPending: state?.manifestComponents.componentsFetchPending,
    componentsFetchSuccess: state?.manifestComponents.componentsFetchSuccess,
})
