import Keycloak from 'keycloak-js'

import { envConfigByManifestVersionService } from '@hooks/useManifestVersion'

const IS_FRONT_AUTH = envConfigByManifestVersionService.IS_AUTH

export const keycloakClient = IS_FRONT_AUTH
    ? new Keycloak({
          url: envConfigByManifestVersionService.KEYCLOAK_URL,
          realm: envConfigByManifestVersionService.KEYCLOAK_REALM,
          clientId: envConfigByManifestVersionService.KEYCLOAK_CLIENT_ID,
      })
    : null
