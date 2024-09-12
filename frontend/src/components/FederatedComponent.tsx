import styled from '@emotion/styled'
import { SnackbarService, useSnackbar } from '@s4mf/uikit'
import { CircularProgress } from '@mui/material'
import React, { Suspense, useMemo } from 'react'

import { useFederatedComponent } from '@hooks/useFederatedComponent'
import { useManifestVersion } from '@hooks/useManifestVersion'
import ErrorPage from '@pages/ErrorPage/ui/ErrorPage'
import { useProfile } from '@providers/profile/ProfileProvider'

import { ErrorBoundary } from './ErrorBoundary'

type FederatedComponentProps = {
    url: string
    scope: string
    module: string
    props?: any
    envUrl?: string
    isBlazorApp?: boolean
}

export default function FederatedComponent({
    url,
    scope,
    module,
    props,
    envUrl,
    isBlazorApp,
}: FederatedComponentProps) {
    const { token } = useProfile()
    const { envConfigByManifestVersion } = useManifestVersion()
    const { Component, ready, failed, envReady, envFailed } = useFederatedComponent({
        url,
        scope,
        module,
        envUrl,
        isBlazorApp,
        componentProps: props,
    })

    const loadingNode = useMemo(
        () => (
            <CircularProgressWrapper>
                <CircularProgress color="primary" />
            </CircularProgressWrapper>
        ),
        [],
    )

    if (failed || envFailed) {
        return <ErrorPage errorTitle="Веб-страница недоступна" errorPhone="8800######7" />
    }

    if (!ready || !envReady || !Component) {
        return <LoadingNode>{loadingNode}</LoadingNode>
    }

    console.info('token-Info-2: token in FED_APP was passed to microfront. Actual token is:', { token })

    return (
        <ErrorBoundary>
            <Suspense fallback={loadingNode}>
                <div
                    id="app"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                    }}
                >
                    {Component && (
                        <Component
                            {...props}
                            token={token}
                            baseUrl={envConfigByManifestVersion.BASE_URL}
                            hooks={{ useSnackbar }}
                            services={{ SnackbarService }}
                        />
                    )}
                </div>
            </Suspense>
        </ErrorBoundary>
    )
}

const LoadingNode = styled.div`
    width: 100%;
    height: 100%;
`

const CircularProgressWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`
