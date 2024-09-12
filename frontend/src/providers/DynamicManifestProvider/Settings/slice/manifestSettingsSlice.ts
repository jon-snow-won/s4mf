import { createSlice } from '@reduxjs/toolkit'

import { postSetting } from '@providers/DynamicManifestProvider/Settings/thunks/postSetting'
import { getAllSettings } from '@providers/DynamicManifestProvider/Settings/thunks/getAllSettings'
import { getSettingById } from '@providers/DynamicManifestProvider/Settings/thunks/getSettingById'
import { ManifestSettingsSchema } from '@providers/DynamicManifestProvider/Settings/types/settings'

const initialState: ManifestSettingsSchema = {
    settings: [],
    settingsFetchPending: null,
    settingsFetchSuccess: null,

    setting: null,
    settingFetchPending: null,
    settingFetchSuccess: null,
}

export const manifestSettingsSlice = createSlice({
    name: 'manifestSettings',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getAllSettings.pending, (state) => {
            state.settingsFetchPending = true
            state.settingsFetchSuccess = null
        })
        builder.addCase(getAllSettings.fulfilled, (state, action) => {
            // state.settings = action.payload.data
            state.settings = action.payload
            state.settingsFetchPending = false
            state.settingsFetchSuccess = true
        })
        builder.addCase(getAllSettings.rejected, (state, action) => {
            state.settingsFetchPending = false
            state.settingsFetchSuccess = false
        })

        builder.addCase(getSettingById.pending, (state) => {
            state.settingFetchPending = true
            state.settingFetchSuccess = null
        })
        builder.addCase(getSettingById.fulfilled, (state, action) => {
            state.setting = action.payload
            state.settingFetchPending = false
            state.settingFetchSuccess = true
        })
        builder.addCase(getSettingById.rejected, (state, action) => {
            state.settingFetchPending = false
            state.settingFetchSuccess = false
        })

        builder.addCase(postSetting.pending, (state) => {
            state.settingFetchPending = true
            state.settingFetchSuccess = null
        })
        builder.addCase(postSetting.fulfilled, (state, action) => {
            state.setting = action.payload
            state.settingFetchPending = false
            state.settingFetchSuccess = true
        })
        builder.addCase(postSetting.rejected, (state, action) => {
            state.settingFetchPending = false
            state.settingFetchSuccess = false
        })
    },
})

export const { actions: manifestSettingsActions } = manifestSettingsSlice
export const { reducer: manifestSettingsReducer } = manifestSettingsSlice
