import React, { createContext, useContext, useEffect, useState } from 'react'

import { WebsocketNotifications } from '@utils/websocketNotifications'
import { useAuthUser } from '@providers/authUserContext'
import { envConfigByManifestVersionService } from '@hooks/useManifestVersion'
import { keycloakClient } from '@utils/keycloak'

type ProviderProps = {
    children: JSX.Element
}

const NotificationsContext = createContext<number | null>(null)

export function NotificationsProvider({ children }: ProviderProps) {
    const [notificationsCountFromWebSocket, setNotificationsCountFromWebSocket] = useState(null)
    const userInfoFromContext = useAuthUser()

    useEffect(() => {
        if (userInfoFromContext?.login || keycloakClient?.tokenParsed?.preferred_username) {
            WebsocketNotifications.init({
                realm: envConfigByManifestVersionService.KEYCLOAK_REALM ?? '',
                login: userInfoFromContext?.login || keycloakClient?.tokenParsed?.preferred_username || '',
                notify: setNotificationsCountFromWebSocket,
            })
        }
    }, [userInfoFromContext?.login, keycloakClient?.tokenParsed?.preferred_username])

    return (
        <NotificationsContext.Provider value={notificationsCountFromWebSocket}>
            {children}
        </NotificationsContext.Provider>
    )
}

export function useNotificationsCountFromWS(): number | null {
    return useContext(NotificationsContext)
}
