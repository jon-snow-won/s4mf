import { RolesLayout } from '@s4mf/uikit'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { RoutePath } from '@config/routeConfig/routeConfig'
import { useLocalStorage } from '@hooks/useLocalStorage'
import { useManifestVersion } from '@hooks/useManifestVersion'
import { ManifestOptionsIdEnum } from '@pages/AdminPage/AdminPage'
import { useProfile } from '@providers/profile/ProfileProvider'
import { useAxios } from '@providers/WithAxios'
import { useDynamicManifest } from '@providers/WithDynamicManifest'
import { useManifest } from '@providers/WithManifest'
import { Manifest } from '@src/types/manifest'
import { Setting } from '@src/vendor/bff-openapi-client'
import { LocalStorageKey } from '@utils/localStorageConst'
import sendLogoutPost from '@src/components/sendLogoutPost'
import { useAuthUser } from '@providers/authUserContext'

import { type Role } from '../types/Role'

const greeting = 'Выберите систему'

export const RoleSelection = () => {
    const navigate = useNavigate()
    const { authenticated, userProfile, logout } = useProfile()
    const apiClient = useAxios()

    let userName = ''
    const userInfoFromContext = useAuthUser()
    const nameFormLocalStorage = localStorage.getItem('fed_app__app_username')
    const nameFromContext = userInfoFromContext?.name

    if (nameFormLocalStorage) {
        userName = nameFormLocalStorage.split('"').join('')
    } else if (nameFromContext) {
        const nameParts = nameFromContext.split(' ')

        userName = `${nameParts[0]} ${nameParts[2]}`
    }

    const { manifestVersionId, envConfigByManifestVersion } = useManifestVersion()
    let roles
    let settingProperties: Setting

    if (manifestVersionId === ManifestOptionsIdEnum.STATIC) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { roles: oldRoles } = useManifest()

        roles = oldRoles
    } else if (manifestVersionId === ManifestOptionsIdEnum.DYNAMIC) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const { settings } = useDynamicManifest()

        const propertiesSettings = settings.find(({ type }) => type.name === 'env')

        settingProperties = propertiesSettings
        // @ts-ignore
        const manifestRoles = propertiesSettings?.properties?.roles

        if (manifestRoles) {
            roles = manifestRoles
        }
    }

    const [, setRole] = useLocalStorage<Role | null>(LocalStorageKey.app_role, null)
    const [svgLogo, setSvgLogo] = useLocalStorage(LocalStorageKey.select_role_logo, undefined)

    const logoText = envConfigByManifestVersion.SELECT_ROLE_LOGO_TEXT

    const getRoleSelectionLogo = async () => {
        if (manifestVersionId === ManifestOptionsIdEnum.STATIC) {
            try {
                const { data } = await apiClient.get<Manifest>('public/select-role-logo.svg')

                if (data) {
                    setSvgLogo(data)
                }
            } catch (err) {
                setSvgLogo('logo')
            }
        } else if (manifestVersionId === ManifestOptionsIdEnum.DYNAMIC) {
            // @ts-ignore
            const selectRolesSvg = settingProperties?.properties?.SELECT_ROLE_LOGO

            if (selectRolesSvg) {
                setSvgLogo(selectRolesSvg)
            }
        }
    }

    const userFullName = useMemo(() => {
        if (!userProfile) {
            return
        }

        const fullName = [userProfile?.lastName, userProfile?.firstName].filter(Boolean).join(' ')
        const fallback = 'Константинопольский Константин Константинович'

        return fullName || (userName ?? fallback)
    }, [userProfile, userName])

    if (!authenticated) {
        navigate('/')

        return null
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        getRoleSelectionLogo()
    }, [])

    return (
        <div
            style={{
                minHeight: '100vh !important',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                backgroundColor: '#f1f4f6',
            }}
        >
            <RolesLayout
                roles={roles}
                userName={userFullName}
                logo={<div dangerouslySetInnerHTML={{ __html: svgLogo }} />}
                texts={{ greeting, logoText }}
                onRoleClick={(entry: any) => {
                    setRole(entry)
                    navigate(RoutePath.main)
                }}
                onLogoutClick={() => {
                    sendLogoutPost()
                    logout()
                }}
            />
        </div>
    )
}
