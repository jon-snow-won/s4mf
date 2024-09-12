import { StateSchema } from '@providers/StoreProvider'

export const selectTypesSetting = (state: StateSchema) => ({
    typesSetting: state?.manifestTypes.typesSetting,
    typesSettingFetchPending: state?.manifestTypes.typesSettingFetchPending,
    typesSettingFetchSuccess: state?.manifestTypes.typesSettingFetchSuccess,
})
