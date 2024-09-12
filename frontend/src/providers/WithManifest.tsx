import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'

import { Manifest } from '../types/manifest'

import { useAxios } from './WithAxios'

export type Props = Readonly<{
    children: ReactNode
}>

const ManifestContext = createContext<Manifest | null>(null)

export function WithManifest({ children }: Props) {
    const [manifest, setManifest] = useState<Manifest | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const apiClient = useAxios()
    const getManifest = async () => {
        const getManifestPath = () => {
            if (process.env.environment === undefined) {
                return 'public/manifest.json'
            }

            if (process.env.environment === 'dmp') {
                return 'public/manifest-dmp.json'
            }

            if (process.env.environment === 'dtp') {
                return 'public/manifest-dtp.json'
            }

            throw Error('Unknown manifest path')
        }

        try {
            setError(false)
            setLoading(true)
            const { data } = await apiClient.get<Manifest>(getManifestPath())

            /* @ts-ignore */
            // try {JSON.parse(data)
            // TODO: сделать проверку на парсинг data

            setManifest(data)
            // } catch (error) {
            //     throw Error('Unable to parse manifest.json')
            // }
        } catch (e) {
            console.error(e)
            setError(true)
            setManifest(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getManifest()
    }, [])

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return <div>Ошибка загрузки манифеста</div>
    }

    return <ManifestContext.Provider value={manifest}>{children}</ManifestContext.Provider>
}

export function useManifest(): Manifest | null {
    const manifest = useContext(ManifestContext)

    if (!manifest) {
        throw new Error('ManifestContex: Manifest Provider not in tree')
    }

    return useMemo(() => manifest, [manifest])
}
