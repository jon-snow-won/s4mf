import { StateSchema } from '@providers/StoreProvider'

export const selectSettings = (state: StateSchema) => ({
    settings: state?.manifestSettings.settings,
    settingsFetchPending: state?.manifestSettings.settingsFetchPending,
    settingsFetchSuccess: state?.manifestSettings.settingsFetchSuccess,
})
