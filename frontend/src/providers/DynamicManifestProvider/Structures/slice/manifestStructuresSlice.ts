import { createSlice } from '@reduxjs/toolkit'

import { postStructure } from '@providers/DynamicManifestProvider/Structures/thunks/postStructure'
import { getStructureById } from '@providers/DynamicManifestProvider/Structures/thunks/getStructureById'
import { getAllStructures } from '@providers/DynamicManifestProvider/Structures/thunks/getAllStructures'
import { ManifestStructuresSchema } from '@providers/DynamicManifestProvider/Structures/types/structures'

const initialState: ManifestStructuresSchema = {
    structures: [],
    structuresFetchPending: null,
    structuresFetchSuccess: null,

    structure: null,
    structureFetchPending: null,
    structureFetchSuccess: null,
}

export const manifestStructuresSlice = createSlice({
    name: 'manifestStructures',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getAllStructures.pending, (state) => {
            state.structuresFetchPending = true
            state.structuresFetchSuccess = null
        })
        builder.addCase(getAllStructures.fulfilled, (state, action) => {
            state.structures = action.payload.data
            state.structuresFetchPending = false
            state.structuresFetchSuccess = true
        })
        builder.addCase(getAllStructures.rejected, (state, action) => {
            state.structuresFetchPending = false
            state.structuresFetchSuccess = false
        })

        builder.addCase(getStructureById.pending, (state) => {
            state.structureFetchPending = true
            state.structureFetchSuccess = null
        })
        builder.addCase(getStructureById.fulfilled, (state, action) => {
            state.structure = action.payload
            state.structureFetchPending = false
            state.structureFetchSuccess = true
        })
        builder.addCase(getStructureById.rejected, (state, action) => {
            state.structureFetchPending = false
            state.structureFetchSuccess = false
        })

        builder.addCase(postStructure.pending, (state) => {
            state.structureFetchPending = true
            state.structureFetchSuccess = null
        })
        builder.addCase(postStructure.fulfilled, (state, action) => {
            state.structure = action.payload
            state.structureFetchPending = false
            state.structureFetchSuccess = true
        })
        builder.addCase(postStructure.rejected, (state, action) => {
            state.structureFetchPending = false
            state.structureFetchSuccess = false
        })
    },
})

export const { actions: manifestStructuresActions } = manifestStructuresSlice
export const { reducer: manifestStructuresReducer } = manifestStructuresSlice
