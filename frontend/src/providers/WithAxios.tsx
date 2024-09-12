import { useKeycloak } from '@react-keycloak/web'
import axios, { AxiosInstance } from 'axios'
import React, { createContext, ReactNode, useContext } from 'react'

import { useManifestVersion } from '@hooks/useManifestVersion'

export type Props = Readonly<{
    children: ReactNode
    isAuth?: boolean
}>

const AxiosContext = createContext<AxiosInstance | null>(null)

export function WithAxios({ children, isAuth = true }: Props) {
    const { envConfigByManifestVersion } = useManifestVersion()
    const baseURL = process.env.API_URL || envConfigByManifestVersion.BASE_URL

    const apiClient = axios.create({
        baseURL,
    })

    if (isAuth) {
        // eslint-disable-next-line
        const { keycloak } = useKeycloak() //NOSONAR

        // ДЕЛО refresh token
        apiClient.interceptors.request.use((config: any) => ({
            ...config,
            headers: {
                ...config.headers,
                Authorization: `Bearer ${keycloak?.token ?? ''}`,
            },
        }))
    }

    return <AxiosContext.Provider value={apiClient}>{children}</AxiosContext.Provider>
}

export function useAxios(): AxiosInstance {
    const apiClient = useContext(AxiosContext)

    if (!apiClient) {
        throw new Error('AxiosContext: Axios Provider not in tree')
    }

    return apiClient
}
