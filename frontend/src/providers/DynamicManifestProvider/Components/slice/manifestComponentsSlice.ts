import { createSlice } from '@reduxjs/toolkit'

import { postComponent } from '@providers/DynamicManifestProvider/Components/thunks/postComponent'
import { deleteComponentById } from '@providers/DynamicManifestProvider/Components/thunks/deleteComponentById'
import { patchComponentById } from '@providers/DynamicManifestProvider/Components/thunks/patchComponentById'
import { getComponentById } from '@providers/DynamicManifestProvider/Components/thunks/getComponentById'
import { getAllComponents } from '@providers/DynamicManifestProvider/Components/thunks/getAllComponents'
import { ManifestComponentsSchema } from '@providers/DynamicManifestProvider/Components/types/components'

const initialState: ManifestComponentsSchema = {
    components: [],
    componentsFetchPending: null,
    componentsFetchSuccess: null,

    component: null,
    componentFetchPending: null,
    componentFetchSuccess: null,
}

export const manifestComponentsSlice = createSlice({
    name: 'manifestComponents',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getAllComponents.pending, (state) => {
            state.componentsFetchPending = true
            state.componentsFetchSuccess = null
        })
        builder.addCase(getAllComponents.fulfilled, (state, action) => {
            state.components = action.payload.data
            state.componentsFetchPending = false
            state.componentsFetchSuccess = true
        })
        builder.addCase(getAllComponents.rejected, (state, action) => {
            state.componentsFetchPending = false
            state.componentsFetchSuccess = false
        })

        builder.addCase(getComponentById.pending, (state) => {
            state.componentFetchPending = true
            state.componentFetchSuccess = null
        })
        builder.addCase(getComponentById.fulfilled, (state, action) => {
            state.component = action.payload
            state.componentFetchPending = false
            state.componentFetchSuccess = true
        })
        builder.addCase(getComponentById.rejected, (state, action) => {
            state.componentFetchPending = false
            state.componentFetchSuccess = false
        })

        builder.addCase(patchComponentById.pending, (state) => {
            state.componentFetchPending = true
            state.componentFetchSuccess = null
        })
        builder.addCase(patchComponentById.fulfilled, (state, action) => {
            state.component = action.payload
            state.componentFetchPending = false
            state.componentFetchSuccess = true
        })
        builder.addCase(patchComponentById.rejected, (state, action) => {
            state.componentFetchPending = false
            state.componentFetchSuccess = false
        })

        builder.addCase(deleteComponentById.pending, (state) => {
            state.componentFetchPending = true
            state.componentFetchSuccess = null
        })
        builder.addCase(deleteComponentById.fulfilled, (state, action) => {
            state.component = action.payload
            state.componentFetchPending = false
            state.componentFetchSuccess = true
        })
        builder.addCase(deleteComponentById.rejected, (state, action) => {
            state.componentFetchPending = false
            state.componentFetchSuccess = false
        })

        builder.addCase(postComponent.pending, (state) => {
            state.componentFetchPending = true
            state.componentFetchSuccess = null
        })
        builder.addCase(postComponent.fulfilled, (state, action) => {
            state.component = action.payload.component
            state.componentFetchPending = false
            state.componentFetchSuccess = true
        })
        builder.addCase(postComponent.rejected, (state, action) => {
            state.componentFetchPending = false
            state.componentFetchSuccess = false
        })
    },
})

export const { actions: manifestComponentsActions } = manifestComponentsSlice
export const { reducer: manifestComponentsReducer } = manifestComponentsSlice
