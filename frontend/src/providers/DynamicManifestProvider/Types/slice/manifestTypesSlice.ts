import { createSlice } from '@reduxjs/toolkit'

import { fetchTypesService } from '@providers/DynamicManifestProvider/Types/thunks/fetchTypesService'
import { fetchTypesSetting } from '@providers/DynamicManifestProvider/Types/thunks/fetchTypesSetting'
import { ManifestTypesSchema } from '@providers/DynamicManifestProvider/Types/types/manifestTypes'

const initialState: ManifestTypesSchema = {
    typesService: [],
    typesServiceFetchPending: null,
    typesServiceFetchSuccess: null,

    typesSetting: [],
    typesSettingFetchPending: null,
    typesSettingFetchSuccess: null,
}

export const manifestTypesSlice = createSlice({
    name: 'manifestTypes',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(fetchTypesService.pending, (state) => {
            state.typesServiceFetchPending = true
            state.typesServiceFetchSuccess = null
        })
        builder.addCase(fetchTypesService.fulfilled, (state, action) => {
            state.typesService = action.payload
            state.typesServiceFetchPending = false
            state.typesServiceFetchSuccess = true
        })
        builder.addCase(fetchTypesService.rejected, (state, action) => {
            state.typesServiceFetchPending = false
            state.typesServiceFetchSuccess = false
        })

        builder.addCase(fetchTypesSetting.pending, (state) => {
            state.typesSettingFetchPending = true
            state.typesSettingFetchSuccess = null
        })
        builder.addCase(fetchTypesSetting.fulfilled, (state, action) => {
            state.typesSetting = action.payload
            state.typesSettingFetchPending = false
            state.typesSettingFetchSuccess = true
        })
        builder.addCase(fetchTypesSetting.rejected, (state, action) => {
            state.typesSettingFetchPending = false
            state.typesSettingFetchSuccess = false
        })
    },
})

export const { actions: manifestTypesActions } = manifestTypesSlice
export const { reducer: manifestTypesReducer } = manifestTypesSlice
