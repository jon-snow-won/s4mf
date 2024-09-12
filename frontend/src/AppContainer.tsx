import { MedkitTheme, MedkitThemeProvider, SnackbarsProvider } from '@s4mf/uikit'
import React from 'react'

import { useSearchParams } from '@hooks/useSearchParams'
import { GlobalModalsProvider } from '@components/GlobalModals'
import { useManifestVersion } from '@hooks/useManifestVersion'
import { ManifestOptionsIdEnum } from '@pages/AdminPage/AdminPage'
import { ProfileProvider } from '@providers/profile/ProfileProvider'
import { StoreProvider } from '@providers/StoreProvider'
import { WithAuth } from '@providers/WithAuth'
import { WithAxios } from '@providers/WithAxios'
import { WithDynamicManifest } from '@providers/WithDynamicManifest'
import { WithManifest } from '@providers/WithManifest'
import { WithSimpleStore } from '@providers/WithSimpleStore'
import { App, AppDynamic } from '@src/App'
import { AuthUserProvider } from '@providers/authUserContext'

function AppContainer() {
    useSearchParams()
    const { manifestVersionId, envConfigByManifestVersion } = useManifestVersion()
    const IS_FRONT_AUTH = envConfigByManifestVersion.IS_AUTH

    if (!IS_FRONT_AUTH) {
        if (manifestVersionId === ManifestOptionsIdEnum.STATIC) {
            return (
                <MedkitThemeProvider theme={MedkitTheme}>
                    <SnackbarsProvider>
                        <WithAxios isAuth={IS_FRONT_AUTH}>
                            <AuthUserProvider>
                                <WithManifest>
                                    <ProfileProvider>
                                        <GlobalModalsProvider>
                                            <WithSimpleStore>
                                                <App />
                                            </WithSimpleStore>
                                        </GlobalModalsProvider>
                                    </ProfileProvider>
                                </WithManifest>
                            </AuthUserProvider>
                        </WithAxios>
                    </SnackbarsProvider>
                </MedkitThemeProvider>
            )
        }

        if (manifestVersionId === ManifestOptionsIdEnum.DYNAMIC) {
            return (
                <MedkitThemeProvider theme={MedkitTheme}>
                    <SnackbarsProvider>
                        <StoreProvider>
                            <WithAxios isAuth={IS_FRONT_AUTH}>
                                <AuthUserProvider>
                                    <WithDynamicManifest>
                                        <ProfileProvider>
                                            <GlobalModalsProvider>
                                                <WithSimpleStore>
                                                    <AppDynamic />
                                                </WithSimpleStore>
                                            </GlobalModalsProvider>
                                        </ProfileProvider>
                                    </WithDynamicManifest>
                                </AuthUserProvider>
                            </WithAxios>
                        </StoreProvider>
                    </SnackbarsProvider>
                </MedkitThemeProvider>
            )
        }
    }

    if (IS_FRONT_AUTH) {
        if (manifestVersionId === ManifestOptionsIdEnum.STATIC) {
            return (
                <MedkitThemeProvider theme={MedkitTheme}>
                    <SnackbarsProvider>
                        <WithAuth>
                            <WithAxios isAuth={IS_FRONT_AUTH}>
                                <AuthUserProvider>
                                    <WithManifest>
                                        <ProfileProvider>
                                            <GlobalModalsProvider>
                                                <WithSimpleStore>
                                                    <App />
                                                </WithSimpleStore>
                                            </GlobalModalsProvider>
                                        </ProfileProvider>
                                    </WithManifest>
                                </AuthUserProvider>
                            </WithAxios>
                        </WithAuth>
                    </SnackbarsProvider>
                </MedkitThemeProvider>
            )
        }

        if (manifestVersionId === ManifestOptionsIdEnum.DYNAMIC) {
            return (
                <MedkitThemeProvider theme={MedkitTheme}>
                    <SnackbarsProvider>
                        <StoreProvider>
                            <WithAuth>
                                <WithAxios isAuth={IS_FRONT_AUTH}>
                                    <AuthUserProvider>
                                        <WithDynamicManifest>
                                            <ProfileProvider>
                                                <GlobalModalsProvider>
                                                    <WithSimpleStore>
                                                        <AppDynamic />
                                                    </WithSimpleStore>
                                                </GlobalModalsProvider>
                                            </ProfileProvider>
                                        </WithDynamicManifest>
                                    </AuthUserProvider>
                                </WithAxios>
                            </WithAuth>
                        </StoreProvider>
                    </SnackbarsProvider>
                </MedkitThemeProvider>
            )
        }
    }

    return null
}

export default AppContainer
