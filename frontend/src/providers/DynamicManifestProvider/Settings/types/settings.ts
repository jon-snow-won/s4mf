import { Setting } from '@src/vendor/bff-openapi-client'

export interface ManifestSettingsSchema {
    settings: Setting[]
    settingsFetchPending: boolean
    settingsFetchSuccess: boolean

    setting: Setting
    settingFetchPending: boolean
    settingFetchSuccess: boolean
}
