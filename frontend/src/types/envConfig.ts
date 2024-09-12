interface Env {
    readonly BASE_URL?: string
    readonly AUTH?: string
    readonly VERSION: string
    readonly APP_NAME: string
    readonly KEYCLOAK_URL?: string
    readonly KEYCLOAK_REALM?: string
    readonly KEYCLOAK_CLIENT_ID?: string
    readonly NOTIFICATIONS_WEBSOCKET_URL?: string
    readonly SUPERSET_USERNAME?: string
    readonly SUPERSET_PASSWORD?: string
    readonly SELECT_ROLE_LOGO_TEXT?: string
    readonly LOGO_COLOR?: string
    readonly NOTIFICATIONS_SERVICE_PREFIX?: string
}

export interface EnvConfig extends Env {
    IS_AUTH?: boolean
}
