import { StateSchema } from '@providers/StoreProvider'

export const selectComponent = (state: StateSchema) => ({
    component: state?.manifestComponents.component,
    componentFetchPending: state?.manifestComponents.componentFetchPending,
    componentFetchSuccess: state?.manifestComponents.componentFetchSuccess,
})
