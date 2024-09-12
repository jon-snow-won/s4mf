import { Autocomplete, AutocompleteItem, Button, MainLayout, TextField } from '@s4mf/uikit'
import { Stack } from '@mui/material'
import React, { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { RoutePath } from '@config/routeConfig/routeConfig'
import { useLocalStorage } from '@hooks/useLocalStorage'
import { useManifestVersion } from '@hooks/useManifestVersion'
import type { Role } from '@pages/SelectRolePage/types/Role'
import { LocalStorageKey } from '@utils/localStorageConst'

export const enum ManifestOptionsIdEnum {
    STATIC = 'static',
    DYNAMIC = 'dynamic',
}

export type ManifestOptionsType = {
    id: ManifestOptionsIdEnum
    label: string
}

export const manifestOptions: ManifestOptionsType[] = [
    {
        id: ManifestOptionsIdEnum.STATIC,
        label: 'Статический манифест',
    },
    {
        id: ManifestOptionsIdEnum.DYNAMIC,
        label: 'Динамический манифест',
    },
]

interface AdminPageProps {
    mode: 'static' | 'dynamic'
}

export const AdminPage = ({ mode }: AdminPageProps) => {
    const navigate = useNavigate()
    const [accessTokenPvk, setAccessTokenPvk] = useState('')
    const [manifestVersionLS, setManifestVersionLS] = useLocalStorage<string | null>(
        LocalStorageKey.app_manifest_version,
        null,
    )

    const initialManifestVersion = JSON.parse(manifestVersionLS)
    const [, setRole] = useLocalStorage<Role | null>(LocalStorageKey.app_role, null)
    const [manifestVersion, setManifestVersion] = useState<AutocompleteItem | null>(initialManifestVersion)

    const { manifestVersionId } = useManifestVersion()

    const Wrapper = mode === 'static' ? MainLayout : Fragment

    return (
        <Wrapper>
            <div style={{ margin: 20, display: 'flex', flexDirection: 'column' }}>
                <div style={{ width: 400 }}>
                    <h1>Админ-панель</h1>
                    <Stack direction="column" gap="16px">
                        <TextField
                            label="Значение Access Token ПВК"
                            value={accessTokenPvk}
                            onChange={(evt) => {
                                setAccessTokenPvk(evt.target.value)
                            }}
                        />
                        <Autocomplete
                            value={manifestVersion}
                            options={manifestOptions}
                            label="Версия манифеста"
                            onChange={(_, value) => {
                                setManifestVersion(value)
                            }}
                        />
                    </Stack>
                    <Button
                        onClick={() => {
                            window.localStorage.setItem(
                                'OIDC-MIF:access_token:https://ia.test.egisz.rosminzdrav.ru/realms/dev/:dev_pvk',
                                accessTokenPvk,
                            )
                            setManifestVersionLS(JSON.stringify(manifestVersion))
                            if (initialManifestVersion?.id !== manifestVersion.id) {
                                setRole(null)
                            }

                            window.location.reload()
                        }}
                        style={{ marginTop: 20 }}
                    >
                        Сохранить
                    </Button>
                    {manifestVersionId === ManifestOptionsIdEnum.DYNAMIC && (
                        <>
                            <h1 style={{ marginTop: 30 }}>Скрытые разделы</h1>
                            <Stack direction="column" gap="16px">
                                <Button
                                    onClick={() => {
                                        navigate(RoutePath.manifest)
                                    }}
                                >
                                    UI Динамического манифеста
                                </Button>
                            </Stack>
                        </>
                    )}
                </div>
            </div>
        </Wrapper>
    )
}
