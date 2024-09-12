import { createSlice } from '@reduxjs/toolkit'

import { getAllRoles } from '@providers/DynamicManifestProvider/Roles/thunks/getAllRoles'
import { ManifestRolesSchema } from '@providers/DynamicManifestProvider/Roles/types/roles'

const initialState: ManifestRolesSchema = {
    roles: [],
    rolesFetchPending: null,
    rolesFetchSuccess: null,
}

export const manifestRolesSlice = createSlice({
    name: 'manifestRoles',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(getAllRoles.pending, (state) => {
            state.rolesFetchPending = true
            state.rolesFetchSuccess = null
        })
        builder.addCase(getAllRoles.fulfilled, (state, action) => {
            state.roles = action.payload
            state.rolesFetchPending = false
            state.rolesFetchSuccess = true
        })
        builder.addCase(getAllRoles.rejected, (state, action) => {
            state.rolesFetchPending = false
            state.rolesFetchSuccess = false
        })
    },
})

export const { actions: manifestRolesActions } = manifestRolesSlice
export const { reducer: manifestRolesReducer } = manifestRolesSlice
