import { useEffect } from 'react'

import { useLocalStorage } from '@hooks/useLocalStorage'
import { ManifestOptionsIdEnum } from '@pages/AdminPage/AdminPage'
import type { Role } from '@pages/SelectRolePage/types/Role'
import { LocalStorageKey } from '@utils/localStorageConst'

export const useSearchParams = () => {
    const [, setManifestVersionLS] = useLocalStorage<string | null>(
        LocalStorageKey.app_manifest_version,
        JSON.stringify({
            id: ManifestOptionsIdEnum.STATIC,
            label: 'Статический манифест',
        }),
    )
    const [, setManifestStructureNameLS] = useLocalStorage<string | null>(
        LocalStorageKey.app_manifest_structure_name,
        null,
    )
    const [, setRole] = useLocalStorage<Role | null>(LocalStorageKey.app_role, null)

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search)
        const mv = searchParams.get('mv')
        const mn = searchParams.get('mn')

        if (mv === 'static') {
            setManifestVersionLS(
                JSON.stringify({
                    id: ManifestOptionsIdEnum.STATIC,
                    label: 'Статический манифест',
                }),
            )
        }

        if (mv === 'dynamic') {
            setManifestVersionLS(
                JSON.stringify({
                    id: ManifestOptionsIdEnum.DYNAMIC,
                    label: 'Динамический манифест',
                }),
            )
        }

        if (mn !== null) {
            if (mn === '') {
                setManifestStructureNameLS(null)
            } else {
                setManifestStructureNameLS(mn)
            }
        }
        console.log('deb-mv-mn', mv, mn)
        if (mv || mn !== null) {
            searchParams.delete('mv')
            searchParams.delete('mn')
            const newUrl = `${window.location.pathname}?${searchParams.toString()}`

            window.history.replaceState(null, '', newUrl)
        }

        if (mv) {
            setRole(null)
            window.location.reload()
        }

        if (mn !== null) {
            window.location.reload()
        }
    }, [setManifestVersionLS, setManifestStructureNameLS])
}
