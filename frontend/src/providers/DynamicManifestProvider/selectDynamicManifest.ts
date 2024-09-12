import { StateSchema } from '@providers/StoreProvider'

export const selectDynamicManifest = (state: StateSchema) => ({
    manifestComponents: state?.manifestComponents,
    manifestRoles: state?.manifestRoles,
    manifestServices: state?.manifestServices,
    manifestSettings: state?.manifestSettings,
    manifestStructures: state?.manifestStructures,
    manifestTypes: state?.manifestTypes,
})
