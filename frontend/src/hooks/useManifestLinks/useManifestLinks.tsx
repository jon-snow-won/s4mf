import { NotificationsNoneOutlined, SettingsOutlined } from '@mui/icons-material'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { useLocalStorage } from '@hooks/useLocalStorage'
import { Role, RoleLevel } from '@pages/SelectRolePage/types/Role'
import { useDynamicManifest } from '@providers/WithDynamicManifest'
import { useManifest } from '@providers/WithManifest'
import { getIconByRouteName } from '@utils/icons'
import { LocalStorageKey } from '@utils/localStorageConst'

import { getGroupByPath } from './utils'

interface SubItemLink {
    title: string
    path: string | undefined
    icon: any
}

export interface WidgetItem {
    title: string
    path: string | undefined
    icon: ReactNode
}

interface ParentItemLink extends SubItemLink {
    navigationKey: string
    onClick: () => void
    isParentItem?: boolean
    hasSubItems?: boolean
}

interface WidgetLink {
    key: string
    name: string
    icon: ReactNode
    links: WidgetItem[]
}

interface UseManifestLinksInterface {
    activeParentLink: string
    parentLinks: ParentItemLink[]
    subLinks?: SubItemLink[]
    widgetLinks: WidgetLink[]
    profileLinks: WidgetLink[]
}

const getIconsFromMui = (iconName: string) => {
    if (iconName === 'SettingsOutlinedIcon') {
        return SettingsOutlined as unknown as ReactNode
    }

    if (iconName === 'NotificationsNoneOutlined') {
        return NotificationsNoneOutlined as unknown as ReactNode
    }
}

export const useManifestLinks = (): UseManifestLinksInterface => {
    const { routes, apps, widgets } = useManifest()
    const location = useLocation()
    const { pathname } = location
    const groupNameByLocation = getGroupByPath(pathname, apps)

    const [selectedApp, setSelectedApp] = useLocalStorage<string | null>(LocalStorageKey.app_selectedApp, null)

    const [activeParentLink] = useState(selectedApp || groupNameByLocation)

    const [roles] = useLocalStorage<Role | null>(LocalStorageKey.app_role, null)

    const allowedApp: RoleLevel = useMemo(() => {
        if (!roles) {
            return null
        }

        return roles.level
    }, [roles])

    const parentLinks = useMemo(() => {
        if (!apps || !roles) {
            return []
        }

        const app = Object.keys(apps).find((it) => it.includes(allowedApp))

        if (!app) {
            return []
        }

        const appRoutes = apps[app]?.routes

        return Object.keys(routes)
            .filter((key) => appRoutes.includes(key))
            .map((key) => ({
                path: key,
                title: routes[key].name,
                icon: getIconByRouteName(routes[key].icon),
            }))
    }, [apps])

    const widgetLinks = useMemo(() => {
        if (!widgets) {
            return []
        }

        const getWidgetLinks = (routeKeys: string[]) =>
            Object.keys(routes)
                .filter((key) => routeKeys.includes(key))
                .map((key) => ({
                    path: key,
                    title: routes[key].name,
                    icon: getIconsFromMui(routes[key].icon),
                })) ?? []

        return Object.entries(widgets).map(([key, value]) => ({
            key,
            name: value.name,
            links: getWidgetLinks(value.routes),
            icon: getIconsFromMui(widgets[key].icon),
        }))
    }, [widgets])

    useEffect(() => {
        if (!activeParentLink) {
            return
        }

        setSelectedApp(activeParentLink)
    }, [activeParentLink])

    return {
        activeParentLink,
        parentLinks,
        widgetLinks,
    } as UseManifestLinksInterface
}

export const useManifestLinksDynamic = (): UseManifestLinksInterface => {
    const { pseudoRoutes: routes, pseudoApps: apps, pseudoWidgets: widgets } = useDynamicManifest()

    const location = useLocation()
    const { pathname } = location
    // @ts-ignore
    const groupNameByLocation = getGroupByPath(pathname, apps)

    const [selectedApp, setSelectedApp] = useLocalStorage<string | null>(LocalStorageKey.app_selectedApp, null)

    const [activeParentLink] = useState(selectedApp || groupNameByLocation)

    const [roles] = useLocalStorage<Role | null>(LocalStorageKey.app_role, null)

    // @ts-ignore
    const allowedApp: RoleLevel = useMemo(() => {
        if (!roles) {
            return null
        }

        return roles.description
    }, [roles])

    const parentLinks = useMemo(() => {
        if (!apps || !roles) {
            return []
        }

        const app = Object.keys(apps).find((it) => it.includes(allowedApp))

        if (!app) {
            return []
        }
        // @ts-ignore
        const appRoutes = apps[app]?.routes

        // @ts-ignore
        return Object.keys(routes)
            .filter((key) => appRoutes.includes(key))
            .map((key) => ({
                path: key,
                // @ts-ignore
                title: routes[key].name,
                // @ts-ignore
                icon: getIconByRouteName(routes[key].icon),
            }))
    }, [apps])

    const widgetLinks = useMemo(() => {
        if (!widgets) {
            return []
        }

        // eslint-disable-next-line sonarjs/no-identical-functions
        const getWidgetLinks = (routeKeys: string[]) =>
            Object.keys(routes)
                .filter((key) => routeKeys.includes(key))
                .map((key) => ({
                    path: key,
                    // @ts-ignore
                    title: routes[key].name,
                    // @ts-ignore
                    icon: getIconsFromMui(routes[key].icon),
                })) ?? []

        return Object.entries(widgets).map(([key, value]) => ({
            key,
            name: value.name,
            // @ts-ignore
            links: getWidgetLinks(value.routes),
            // @ts-ignore
            icon: getIconsFromMui(widgets[key].icon),
        }))
    }, [widgets])

    useEffect(() => {
        if (!activeParentLink) {
            return
        }

        setSelectedApp(activeParentLink)
    }, [activeParentLink])

    return {
        activeParentLink,
        parentLinks,
        widgetLinks,
    } as unknown as UseManifestLinksInterface
}
