import React, { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import axios from 'axios'

import { dynamicEnvConfig } from '@config/envConfig/dynamicEnvConfig'
import { envConfig } from '@config/envConfig/envConfig'
import { RoutePath } from '@config/routeConfig/routeConfig'
import { MainLayout, MainLayoutDynamic } from '@layouts/MainLayout'
import { AdminPage } from '@pages/AdminPage/AdminPage'
import { ComponentsList } from '@pages/ManifestPage/components/ComponentsList'
import { ServicesList } from '@pages/ManifestPage/components/ServicesList'
import { SettingsList } from '@pages/ManifestPage/components/SettingsList'
import { StructuresList } from '@pages/ManifestPage/components/StructuresList'
import { ManifestPage } from '@pages/ManifestPage/ManifestPage'
import { NotFoundPage } from '@pages/NotFoundPage'
import { RoleSelectionPage } from '@pages/SelectRolePage'
import { useDynamicManifest } from '@providers/WithDynamicManifest'
import { useManifest } from '@providers/WithManifest'
import { createRoutingByManifest } from '@utils/createRoutingByManifest'
import { useAuthUser, useSetAuthUser } from '@providers/authUserContext'

export function App() {
    const { routes, services, widgets } = useManifest()
    const manifestRouting = createRoutingByManifest(routes)

    const authUser = useAuthUser()
    const setAuthUser = useSetAuthUser()

    useEffect(() => {
        if (!services.auth.user.url || authUser) {
            return
        }

        axios
            .get(services.auth.user.url)
            .then((res) => {
                if (res.status !== 200) {
                    console.error(`${res.status} - ${res.statusText}`)

                    return
                }

                setAuthUser(res.data)
            })
            .catch((error) => {
                console.error('error', error)
            })
    }, [authUser, setAuthUser, services])

    return (
        <BrowserRouter basename={envConfig.BASE_URL.replace(window.location.origin, '')}>
            <Routes>
                <Route path={RoutePath.selectRole} element={<RoleSelectionPage />} />
                <Route path={RoutePath.main} element={<MainLayout widgets={widgets} />}>
                    {manifestRouting.map(({ element, path }) => (
                        <Route key={`${path}`} element={element} path={path} />
                    ))}
                    <Route path={RoutePath.admin} element={<AdminPage mode="static" />} />
                    <Route path={RoutePath.notFound} element={<NotFoundPage errorPhone="8800######7" />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export function AppDynamic() {
    const { manifestRouting } = useDynamicManifest()

    return (
        <BrowserRouter basename={dynamicEnvConfig.BASE_URL.replace(window.location.origin, '')}>
            <Routes>
                <Route path={RoutePath.selectRole} element={<RoleSelectionPage />} />
                <Route path={RoutePath.main} element={<MainLayoutDynamic />}>
                    {manifestRouting.map(({ element, path }) => (
                        <Route key={`${path}`} element={element} path={path} />
                    ))}
                    <Route path={RoutePath.manifest} element={<ManifestPage />}>
                        <Route index element={<Navigate replace to={`${RoutePath.manifest}/components`} />} />
                        <Route path={`${RoutePath.manifest}/components`} element={<ComponentsList />} />
                        <Route path={`${RoutePath.manifest}/services`} element={<ServicesList />} />
                        <Route path={`${RoutePath.manifest}/settings`} element={<SettingsList />} />
                        <Route path={`${RoutePath.manifest}/structures`} element={<StructuresList />} />
                        <Route path={`${RoutePath.manifest}/admin_page`} element={<AdminPage mode="dynamic" />} />
                    </Route>
                    <Route
                        path={RoutePath.admin}
                        element={<Navigate replace to={`${RoutePath.manifest}/admin_page`} />}
                    />
                    <Route path={RoutePath.notFound} element={<NotFoundPage errorPhone="8800######7" />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
