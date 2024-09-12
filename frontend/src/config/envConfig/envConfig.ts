// @ts-nocheck

import { EnvConfig } from '@src/types/envConfig'

function config() {
    if (process.env.DEPLOY_STAGE === 'k8s') {
        return {
            BASE_URL: window.env.BASE_URL,
            API_URL: window.env.API_URL,
            KEYCLOAK_URL: window.env.KEYCLOAK_URL,
            KEYCLOAK_REALM: window.env.KEYCLOAK_REALM,
            KEYCLOAK_CLIENT_ID: window.env.KEYCLOAK_CLIENT_ID,
            NOTIFICATIONS_WEBSOCKET_URL: window.env.NOTIFICATIONS_WEBSOCKET_URL,
            IS_AUTH: window.env.AUTH === 'front',
            VERSION: process.env.reactAppVersion,
            APP_NAME: process.env.reactAppName,
            SUPERSET_USERNAME: window.env.SUPERSET_USERNAME,
            SUPERSET_PASSWORD: window.env.SUPERSET_PASSWORD,
            SELECT_ROLE_LOGO_TEXT: window.env.SELECT_ROLE_LOGO_TEXT,
            LOGO_COLOR: window.env.LOGO_COLOR,
            NOTIFICATIONS_SERVICE_PREFIX: window.env.NOTIFICATIONS_SERVICE_PREFIX,
        }
    }

    return {
        BASE_URL: process.env.BASE_URL,
        API_URL: process.env.API_URL,
        KEYCLOAK_URL: process.env.KEYCLOAK_URL,
        KEYCLOAK_REALM: process.env.KEYCLOAK_REALM,
        KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
        NOTIFICATIONS_WEBSOCKET_URL: process.env.NOTIFICATIONS_WEBSOCKET_URL,
        IS_AUTH: process.env.AUTH === 'front',
        VERSION: process.env.reactAppVersion,
        APP_NAME: process.env.reactAppName,
        SUPERSET_USERNAME: process.env.SUPERSET_USERNAME,
        SUPERSET_PASSWORD: process.env.SUPERSET_PASSWORD,
        SELECT_ROLE_LOGO_TEXT: process.env.SELECT_ROLE_LOGO_TEXT,
        LOGO_COLOR: process.env.LOGO_COLOR,
        NOTIFICATIONS_SERVICE_PREFIX: process.env.NOTIFICATIONS_SERVICE_PREFIX,
    }
}

// @ts-expect-error
export const envConfig: EnvConfig = config()
