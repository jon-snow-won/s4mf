import { StateSchema } from '@providers/StoreProvider'

export const selectSetting = (state: StateSchema) => ({
    setting: state?.manifestSettings.setting,
    settingFetchPending: state?.manifestSettings.settingFetchPending,
    settingFetchSuccess: state?.manifestSettings.settingFetchSuccess,
})
