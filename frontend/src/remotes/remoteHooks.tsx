import { useContext } from 'react'

import { useManifestVersion } from '@hooks/useManifestVersion'
import { ProfileContext } from '@providers/profile/ProfileProvider'

export function useFederalAppToken(): string {
    const { envConfigByManifestVersion } = useManifestVersion()
    const IS_FRONT_AUTH = envConfigByManifestVersion.IS_AUTH

    if (!IS_FRONT_AUTH) {
        return null
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const profileContext = useContext(ProfileContext)

    return profileContext?.token
}
