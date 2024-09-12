import { useKeycloak } from '@react-keycloak/web'
import axios from 'axios'
import Keycloak, { KeycloakResourceAccess } from 'keycloak-js'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { useLocalStorage } from '@hooks/useLocalStorage'
import { useManifestVersion } from '@hooks/useManifestVersion'
import { ManifestOptionsIdEnum } from '@pages/AdminPage/AdminPage'
import { profileMock } from '@providers/profile/profile.mock'
import { resourceAccessMock } from '@providers/profile/resourceAccess.mock'
import { useDynamicManifest } from '@providers/WithDynamicManifest'
import { useManifest } from '@providers/WithManifest'
import { KeycloakProfile } from '@src/types/keycloak'
import { LocalStorageKey } from '@utils/localStorageConst'

interface BffAuthUser {
    login: string
    email: string
    permissions: string[]
    roles: string[]
    family: string
    name: string
}

type ProviderProps = {
    children: JSX.Element
}

type TokenParsedRolesType = {
    roles?: string[]
    email_verified?: string
    name?: string
    preferred_username?: string
    given_name?: string
    family_name?: string
    email?: string
}

type TokenParsedType = {
    realm_access?: TokenParsedRolesType
    resource_access?: KeycloakResourceAccess
    username?: string
    email?: string
    emailVerified?: string
    firstName?: string
    lastName?: string
}

type MinimalKeycloakType = {
    authenticated?: boolean
    loadUserProfile: () => Promise<KeycloakProfile | void>
    logout: () => void
    tokenParsed: TokenParsedType
    token: string
}

export type UserProfileContextValueType = {
    userProfile: KeycloakProfile | Record<string, string> | null
    loadUser: () => Promise<KeycloakProfile | void>
    logout: () => void
    initialized: boolean
    authenticated: boolean
    keycloak: Keycloak | MinimalKeycloakType
    token: string | null
}

export const ProfileContext = createContext<UserProfileContextValueType | null>(null)

export function ProfileProvider({ children }: ProviderProps) {
    const { manifestVersionId, envConfigByManifestVersion } = useManifestVersion()
    const IS_FRONT_AUTH = envConfigByManifestVersion.IS_AUTH

    let services: any

    if (manifestVersionId === ManifestOptionsIdEnum.STATIC) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { services: oldServices } = useManifest()
        const services = oldServices
    } else if (manifestVersionId === ManifestOptionsIdEnum.DYNAMIC) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { settings } = useDynamicManifest()

        const propertiesSettings = settings.find(({ type }) => type.name === 'env')
        // @ts-ignore
        const iamAuthLink = propertiesSettings?.properties?.IAM_AUTH_URL

        if (iamAuthLink) {
            services = {
                auth: {
                    user: {
                        url: iamAuthLink,
                    },
                },
            }
        }
    }

    const { initialized, keycloak } = IS_FRONT_AUTH
        ? // eslint-disable-next-line react-hooks/rules-of-hooks
          useKeycloak()
        : {
              initialized: false,
              keycloak: {
                  authenticated: true,
                  loadUserProfile: async () => profileMock,
                  logout: () => {},
                  tokenParsed: {
                      resource_access: resourceAccessMock,
                  },
                  token: '',
                  profile: profileMock,
              },
          }

    const [userProfile, setUserProfile] = useState<KeycloakProfile | Record<string, string>>({})
    const [token, setToken] = useState<string | undefined>(keycloak.token)
    const [, setTokenLS] = useLocalStorage<string | null>('actual_jwt_token', keycloak.token)

    // eslint-disable-next-line sonarjs/cognitive-complexity
    const loadUser = useCallback(async () => {
        if (IS_FRONT_AUTH) {
            const onKeycloakAccountFetchFailed = () => {
                const parsedTokenForProfile = {
                    // @ts-expect-error
                    username: keycloak.tokenParsed.preferred_username,
                    // @ts-expect-error
                    email: keycloak.tokenParsed.email,
                    // @ts-expect-error
                    emailVerified: keycloak.tokenParsed.email_verified,
                    // @ts-expect-error
                    firstName: keycloak.tokenParsed.given_name,
                    // @ts-expect-error
                    lastName: keycloak.tokenParsed.family_name,
                }

                setUserProfile(parsedTokenForProfile)
            }

            try {
                const profile = await keycloak.loadUserProfile()

                if (profile) {
                    // @ts-expect-error
                    setUserProfile(profile)
                } else {
                    onKeycloakAccountFetchFailed()
                }
            } catch (e) {
                console.error(e)
                onKeycloakAccountFetchFailed()
            }
        } else if (services?.auth?.user?.url) {
            try {
                const response = await axios.get<BffAuthUser>(services.auth?.user?.url)
                const { data } = response

                if (!data) return

                setUserProfile({
                    username: data?.login ?? '',
                    email: data?.email ?? '',
                    emailVerified: false,
                    firstName: data?.name?.split(' ')?.[0] ?? '',
                    lastName: data?.name?.split(' ')?.[2] ?? data?.name?.split(' ')?.[1] ?? '',
                })

                return
            } catch (e) {
                console.error(e)
            }
            setUserProfile(profileMock)
        }
    }, [keycloak])

    useEffect(() => {
        if (IS_FRONT_AUTH) {
            // @ts-expect-error
            keycloak.onAuthRefreshSuccess = () => {
                console.info('token-Info-1: token in FED_APP was refreshed')
                setToken(keycloak.token)
                setTokenLS(keycloak.token)
            }
        }
    }, [])

    useEffect(() => {
        if (keycloak.authenticated) {
            loadUser()
        }
    }, [keycloak.authenticated])

    const contextValue: UserProfileContextValueType = useMemo(
        () => ({
            userProfile,
            loadUser,
            logout: keycloak.logout,
            initialized,
            authenticated: keycloak.authenticated,
            keycloak,
            token,
        }),
        [userProfile, loadUser, initialized, keycloak, token],
    )

    return <ProfileContext.Provider value={contextValue}>{children}</ProfileContext.Provider>
}

export function useProfile(): UserProfileContextValueType | null {
    return useContext(ProfileContext)
}
