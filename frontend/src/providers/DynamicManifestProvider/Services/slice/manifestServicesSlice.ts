import { createSlice } from '@reduxjs/toolkit'

import { postService } from '@providers/DynamicManifestProvider/Services/thunks/postService'
import { getServiceById } from '@providers/DynamicManifestProvider/Services/thunks/getServiceById'
import { getAllServices } from '@providers/DynamicManifestProvider/Services/thunks/getAllServices'
import { ManifestServicesSchema } from '@providers/DynamicManifestProvider/Services/types/services'

const initialState: ManifestServicesSchema = {
    services: [],
    servicesFetchPending: null,
    servicesFetchSuccess: null,

    service: null,
    serviceFetchPending: null,
    serviceFetchSuccess: null,
}

export const manifestServicesSlice = createSlice({
    name: 'manifestServices',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getAllServices.pending, (state) => {
            state.servicesFetchPending = true
            state.servicesFetchSuccess = null
        })
        builder.addCase(getAllServices.fulfilled, (state, action) => {
            // state.services = action.payload.data
            state.services = action.payload
            state.servicesFetchPending = false
            state.servicesFetchSuccess = true
        })
        builder.addCase(getAllServices.rejected, (state, action) => {
            state.servicesFetchPending = false
            state.servicesFetchSuccess = false
        })

        builder.addCase(getServiceById.pending, (state) => {
            state.serviceFetchPending = true
            state.serviceFetchSuccess = null
        })
        builder.addCase(getServiceById.fulfilled, (state, action) => {
            state.service = action.payload
            state.serviceFetchPending = false
            state.serviceFetchSuccess = true
        })
        builder.addCase(getServiceById.rejected, (state, action) => {
            state.serviceFetchPending = false
            state.serviceFetchSuccess = false
        })

        builder.addCase(postService.pending, (state) => {
            state.serviceFetchPending = true
            state.serviceFetchSuccess = null
        })
        builder.addCase(postService.fulfilled, (state, action) => {
            state.service = action.payload
            state.serviceFetchPending = false
            state.serviceFetchSuccess = true
        })
        builder.addCase(postService.rejected, (state, action) => {
            state.serviceFetchPending = false
            state.serviceFetchSuccess = false
        })
    },
})

export const { actions: manifestServicesActions } = manifestServicesSlice
export const { reducer: manifestServicesReducer } = manifestServicesSlice
