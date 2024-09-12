import { useMemo } from 'react'

import { EnvConfig } from '@src/types/envConfig'
import { dynamicEnvConfig } from '@config/envConfig/dynamicEnvConfig'
import { envConfig } from '@config/envConfig/envConfig'
import { useLocalStorage } from '@hooks/useLocalStorage'
import { ManifestOptionsIdEnum } from '@pages/AdminPage/AdminPage'
import { LocalStorageKey } from '@utils/localStorageConst'

// eslint-disable-next-line import/no-mutable-exports
export let envConfigByManifestVersionService: EnvConfig = { ...envConfig }

export const useManifestVersion = () => {
    const [manifestVersionLS] = useLocalStorage<string | null>(LocalStorageKey.app_manifest_version, null)

    let manifestVersionId = ManifestOptionsIdEnum.STATIC
    let envConfigByManifestVersion: EnvConfig

    try {
        // TODO: remove hardcode
        manifestVersionId = JSON.parse(manifestVersionLS).id
    } catch (e) {
        /* empty */
    }

    if (manifestVersionId === ManifestOptionsIdEnum.STATIC) {
        envConfigByManifestVersion = envConfig
        envConfigByManifestVersionService = { ...envConfig }
    } else if (manifestVersionId === ManifestOptionsIdEnum.DYNAMIC) {
        envConfigByManifestVersion = dynamicEnvConfig
        envConfigByManifestVersionService = { ...dynamicEnvConfig }
    }

    return useMemo(
        () => ({
            manifestVersionId,
            envConfigByManifestVersion,
        }),
        [manifestVersionId],
    )
}
