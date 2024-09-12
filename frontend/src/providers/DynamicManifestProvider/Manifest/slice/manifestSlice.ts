import { createSlice } from '@reduxjs/toolkit'

import { getManifest } from '@providers/DynamicManifestProvider/Manifest/thunks/getManifest'
import { ManifestSchema } from '@providers/DynamicManifestProvider/Manifest/types/manifest'

const initialState: ManifestSchema = {
    structure: null,
    settings: [],
    services: [],
    manifestFetchPending: null,
    manifestFetchSuccess: null,
}

export const manifestSlice = createSlice({
    name: 'manifest',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getManifest.pending, (state) => {
            state.manifestFetchPending = true
            state.manifestFetchSuccess = null
        })
        builder.addCase(getManifest.fulfilled, (state, action) => {
            state.structure = action.payload.structure
            state.settings = action.payload.settings
            state.services = action.payload.services
            state.manifestFetchPending = false
            state.manifestFetchSuccess = true
        })
        builder.addCase(getManifest.rejected, (state, action) => {
            state.manifestFetchPending = false
            state.manifestFetchSuccess = false
        })
    },
})

export const { actions: manifestActions } = manifestSlice
export const { reducer: manifestReducer } = manifestSlice
