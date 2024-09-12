import { MainLayout, SubMenu } from '@s4mf/uikit'
import { Typography } from '@mui/material'
import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import styled from 'styled-components'

import { RoutePath } from '@config/routeConfig/routeConfig'
import { useManifestLinksDynamic } from '@src/hooks/useManifestLinks/useManifestLinks'

export const ManifestPage = () => {
    const { widgetLinks } = useManifestLinksDynamic()

    const settings = widgetLinks.find((it) => it.key === 'header-settings')?.links ?? []

    const menu = [
        {
            path: `${RoutePath.manifest}/components`,
            title: 'Components',
            // @ts-ignore
            icon: null,
        },
        {
            path: `${RoutePath.manifest}/services`,
            title: 'Services',
            // @ts-ignore
            icon: null,
        },
        {
            path: `${RoutePath.manifest}/settings`,
            title: 'Settings',
            // @ts-ignore
            icon: null,
        },
        {
            path: `${RoutePath.manifest}/structures`,
            title: 'Structures',
            // @ts-ignore
            icon: null,
        },
        {
            path: `${RoutePath.manifest}/admin_page`,
            title: 'Admin page',
            // @ts-ignore
            icon: null,
        },
    ]

    return (
        <>
            <SubMenu
                linkComponent={NavLink}
                items={[
                    ...settings.map((el) => ({ ...el, path: `../${el.path}` })),
                    {
                        path: '../dynamic-manifest',
                        title: 'Структура сайта',
                    },
                ]}
            />
            <SubMenu linkComponent={NavLink} items={menu} condensed />
            <MainLayout>
                <Outlet />
            </MainLayout>
        </>
    )
}

const PreformattedText = styled(Typography)({
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    fontSize: 'small',
})
