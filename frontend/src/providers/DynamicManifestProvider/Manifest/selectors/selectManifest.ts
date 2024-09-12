import { StateSchema } from '@providers/StoreProvider'

export const selectManifest = (state: StateSchema) => ({
    structure: state?.manifest.structure,
    services: state?.manifest.services,
    settings: state?.manifest.settings,
    manifestFetchPending: state?.manifest.manifestFetchPending,
    manifestFetchSuccess: state?.manifest.manifestFetchSuccess,
})
