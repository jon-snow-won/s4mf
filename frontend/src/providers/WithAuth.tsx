import { ReactKeycloakProvider, useKeycloak } from '@react-keycloak/web'
import React, { useEffect } from 'react'

import AuthLoader from '../components/AuthLoader'
import { keycloakClient } from '../utils/keycloak'

export type AuthProviderProps = {
    children: JSX.Element
}

function KeyCloakInitProvider({ children }: AuthProviderProps) {
    const { initialized, keycloak } = useKeycloak()

    const { authenticated } = keycloak

    useEffect(() => {
        if (initialized && !authenticated) {
            keycloak.login()
        }
    }, [authenticated, initialized, keycloak])

    if (authenticated) {
        return children
    }

    return <AuthLoader />
}

export function WithAuth({ children }: AuthProviderProps) {
    return (
        <ReactKeycloakProvider authClient={keycloakClient} initOptions={{ checkLoginIframe: false }}>
            <KeyCloakInitProvider>{children}</KeyCloakInitProvider>
        </ReactKeycloakProvider>
    )
}
