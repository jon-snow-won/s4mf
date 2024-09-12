import { useSnackbar } from '@s4mf/uikit'
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Box, CircularProgress } from '@mui/material'

import { updateEnvConfig } from '@config/envConfig/dynamicEnvConfig'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { useLocalStorage } from '@hooks/useLocalStorage'
import type { Role } from '@pages/SelectRolePage/types/Role'
import { selectManifest } from '@providers/DynamicManifestProvider/Manifest/selectors/selectManifest'
import { getManifest } from '@providers/DynamicManifestProvider/Manifest/thunks/getManifest'
import { Service, Setting, Structure } from '@src/vendor/bff-openapi-client'
import { getLayoutDynamic } from '@utils/createRoutingByManifest'
import { LocalStorageKey } from '@utils/localStorageConst'

export type Props = Readonly<{
    children: ReactNode
}>

type ManifestRoutingType = {
    path: string
    element: JSX.Element
}

type PseudoContentType = {
    areaId: string
    name: string
}

type PseudoContentTab = {
    path: string
    title: string
    supersetParams: any
    source?: string
}

type PseudoComponentValueType = {
    url: string
    mode: string
    tabs?: PseudoContentTab[]
    scope?: string
    module?: string
    props?: {
        name: string
        url: string
    }
}

type PseudoComponentType = Record<string, PseudoComponentValueType>

type PseudoRoutesValueType = {
    path: string
    name: string
    layout: string
    icon: string
    content: string[]
}
type PseudoRoutesType = Record<string, PseudoRoutesValueType>

type PseudoAppValueType = {
    name: string
    isGroup: boolean
    routes: string[]
}

type PseudoAppType = Record<string, PseudoAppValueType>

type PseudoWidgetValueType = {
    name: string
    routes: string[]
    isGroup: boolean
    icon?: any
}

type PseudoWidgetType = Record<string, PseudoWidgetValueType>

export type DManifestType = {
    structure: Structure
    services: Service[]
    settings: Setting[]
    manifestRouting: ManifestRoutingType[]
    pseudoContent: PseudoContentType[]
    pseudoComponents: PseudoComponentType[]
    pseudoRoutes: PseudoRoutesType[]
    pseudoApps: PseudoAppType[]
    pseudoWidgets: PseudoWidgetType[]
}

const convertArrayToObject = (array: any) =>
    array.reduce((obj: any, item: any) => {
        if (!item) {
            console.error('deb-item into convertArrayToObject was not passed')

            return {}
        }
        const key = Object.keys(item)[0] // Get the key of the first (and only) property in the item object

        // eslint-disable-next-line no-param-reassign
        obj[key] = item[key] // Add this property to the accumulated object

        return obj
    }, {}) // Start with an empty object

const DynamicManifestContext = createContext<DManifestType | null>(null)

export function WithDynamicManifest({ children }: Props) {
    const dispatch = useAppDispatch()

    const { structure, services, settings, manifestFetchSuccess, manifestFetchPending } = useSelector(selectManifest)

    const [role] = useLocalStorage<Role | null>(LocalStorageKey.app_role, null)
    const [manifestStructureNameLS] = useLocalStorage<string | null>(LocalStorageKey.app_manifest_structure_name, null)

    const [currentService, setCurrentService] = useState<Service>(null)

    const didErrorShownRef = useRef(false)
    const snackbar = useSnackbar()

    useEffect(() => {
        if (!structure) {
            return
        }

        let roleString: string

        if (role) {
            roleString = role.level
        } else {
            roleString = structure?.services?.[0]?.name
        }

        const service = structure?.services?.find(({ name }) => name === roleString)

        if (service) {
            setCurrentService(service)
        }
    }, [structure, role])

    const manifestRouting: ManifestRoutingType[] = useMemo(() => {
        if (manifestFetchSuccess === false) {
            return []
        }

        if (!structure || !currentService || manifestFetchSuccess === null) {
            return
        }

        const currentServiceAndWidgets = [
            currentService,
            ...structure.services.filter(
                (service) =>
                    service.type.name === 'header-profile' ||
                    service.type.name === 'header-settings' ||
                    service.type.name === 'widget',
            ),
        ]

        const resultArr = currentServiceAndWidgets.map((service) =>
            service.descendants.map((descendant) => {
                const { name } = descendant
                const content = [name]

                const settingProperties = descendant.settings.find((setting) => setting.type.name === 'properties')
                // @ts-ignore
                const path = settingProperties?.properties.path

                const settingLayout = descendant.settings.find((setting) => setting.type.name === 'layout')
                // @ts-ignore
                const layout = settingLayout?.properties.layout

                return {
                    path,
                    element: getLayoutDynamic(layout, content),
                }
            }),
        )

        return resultArr.length ? resultArr.flat() : []
    }, [structure, currentService, manifestFetchSuccess])

    const pseudoContent: PseudoContentType[] = useMemo(() => {
        if (!structure || !currentService) {
            return
        }

        const widgets = structure.services.filter(
            (service) =>
                service.type.name === 'header-profile' ||
                service.type.name === 'header-settings' ||
                service.type.name === 'widget',
        )
        const currentServiceDescendants = currentService.descendants
        const widgetsDescendants = widgets.flatMap((widget) => widget.descendants)
        const fullArray = [...currentServiceDescendants, ...widgetsDescendants]

        const out = fullArray.map((descendant) => {
            const componentName = descendant.name

            const settingLayout = descendant.settings.find((setting) => setting.type.name === 'layout')
            // @ts-ignore
            const areaId = settingLayout?.properties?.areaId

            return {
                [componentName]: {
                    components: [
                        {
                            areaId,
                            name: componentName,
                        },
                    ],
                },
            }
        })

        const outObj = convertArrayToObject(out)

        return outObj
    }, [structure, currentService])

    const pseudoComponents: PseudoComponentType[] = useMemo(() => {
        if (!structure || !currentService) {
            return
        }

        const widgets = structure.services.filter(
            (service) =>
                service.type.name === 'header-profile' ||
                service.type.name === 'header-settings' ||
                service.type.name === 'widget',
        )
        const currentServiceDescendants = currentService.descendants
        const widgetsDescendants = widgets.flatMap((widget) => widget.descendants)
        const fullArray = [...currentServiceDescendants, ...widgetsDescendants]

        const out = fullArray.map((service) => {
            const componentName = service.name
            const settingProperties = service.settings.find((setting) => setting.type.name === 'properties')
            const type = service.type.name

            const settingEnv = service.settings.find((setting) => setting.type.name === 'env')
            const envs = settingEnv?.properties

            if (type === 'superset') {
                // @ts-ignore
                const url = settingProperties?.properties.url
                // @ts-ignore
                const title = settingProperties?.properties.name
                // @ts-ignore
                const supersetParams = settingProperties?.properties.supersetParams

                return {
                    [componentName]: {
                        url,
                        mode: type,
                        tabs: [
                            {
                                path: '',
                                title,
                                supersetParams,
                            },
                        ],
                    },
                }
            }

            if (type === 'iFrame') {
                // @ts-ignore
                const url = settingProperties?.properties.url
                // @ts-ignore
                const title = settingProperties?.properties.name
                // @ts-ignore
                const tabs = settingProperties?.properties.tabs

                return {
                    [componentName]: {
                        url,
                        mode: type,
                        tabs,
                    },
                }
            }

            if (type === 'remote') {
                // @ts-ignore
                const url = settingProperties?.properties.url
                // @ts-ignore
                const title = settingProperties?.properties.name

                // @ts-ignore
                const scope = settingProperties?.properties.scope
                // @ts-ignore
                const module = settingProperties?.properties.module

                // @ts-ignore
                const envUrl = settingProperties?.properties.envUrl

                // @ts-ignore
                const settingProps = settingProperties?.properties.props ?? {}

                const props = {
                    ...settingProps,
                    envs,
                }

                return {
                    [componentName]: {
                        url,
                        envUrl,
                        mode: type,
                        scope,
                        module,
                        props,
                    },
                }
            }

            return null
        })

        const outObj = convertArrayToObject(out)

        return outObj
    }, [structure, currentService])

    const pseudoRoutes: PseudoRoutesType[] = useMemo(() => {
        if (!structure || !currentService) {
            return
        }

        const out = currentService.descendants // current chosen system
            .map((descendant) => {
                const componentName = descendant.name
                const type = descendant.type.name

                const settingProperties = descendant.settings.find((setting) => setting.type.name === 'properties')
                // @ts-ignore
                const path = settingProperties?.properties.path
                // @ts-ignore
                const title = settingProperties?.properties.name
                // @ts-ignore
                const icon = settingProperties?.properties.icon

                const settingLayout = descendant.settings.find((setting) => setting.type.name === 'layout')
                // @ts-ignore
                const layout = settingLayout?.properties.layout

                return {
                    [componentName]: {
                        path,
                        name: title,
                        layout,
                        icon,
                        content: [componentName],
                    },
                }
            })

        const widgets = structure.services
            .filter((service) => service.type.name === 'header-profile' || service.type.name === 'header-settings')
            .map((widgetService) => {
                const out = widgetService.descendants.map((descendant) => {
                    const descendantName = descendant.name
                    const settingProperties = descendant.settings.find((setting) => setting.type.name === 'properties')
                    // @ts-ignore
                    const path = settingProperties?.properties.path
                    // @ts-ignore
                    const title = settingProperties?.properties.name
                    // @ts-ignore
                    const icon = settingProperties?.properties.icon

                    const settingLayout = descendant.settings.find((setting) => setting.type.name === 'layout')
                    // @ts-ignore
                    const layout = settingLayout?.properties.layout

                    return {
                        [descendantName]: {
                            path,
                            name: title,
                            layout,
                            icon,
                            content: [descendantName],
                        },
                    }
                })

                return out
            })

        const resultArr = [...widgets.flat(), ...out]

        const outObj = convertArrayToObject(resultArr)

        return outObj
    }, [structure, currentService])

    const pseudoApps: PseudoAppType[] = useMemo(() => {
        if (!structure) {
            return
        }

        const out = structure.services.map((service) => {
            const serviceTitle = service.name
            const routes = service.descendants.map((descendant) => descendant.name)

            return {
                [serviceTitle]: {
                    name: serviceTitle,
                    isGroup: Boolean(routes.length),
                    routes,
                },
            }
        })

        const outObj = convertArrayToObject(out)

        return outObj
    }, [structure])

    const pseudoWidgets: PseudoWidgetType[] = useMemo(() => {
        if (!structure) {
            return
        }

        const out = structure.services
            .filter(
                (service) =>
                    service.type.name === 'header-profile' ||
                    service.type.name === 'header-settings' ||
                    service.type.name === 'widget',
            )
            // .filter((service) => service.type.name === 'header-profile' || service.type.name === 'header-settings')
            .map((service) => {
                const widgetName = service.name
                const widgetDescription = service.description
                const routes = service.descendants.map((descendant) => descendant.name)

                const icon = // @ts-ignore
                    service.settings.find((setting) => setting.type.name === 'properties')?.properties?.MUI_ICON

                return {
                    [widgetName]: {
                        name: widgetDescription,
                        isGroup: Boolean(routes.length),
                        routes,
                        icon,
                    },
                }
            })

        const outObj = convertArrayToObject(out)

        return outObj
    }, [structure])

    const fetchManifest = async () => {
        dispatch(getManifest({ structureName: manifestStructureNameLS }))
    }

    useEffect(() => {
        fetchManifest()
    }, [])

    useEffect(() => {
        if (!settings.length) {
            return
        }

        const envSettings = settings.find((it) => it.type.name === 'env')
        const envsObj = envSettings?.properties ?? {}

        updateEnvConfig(envsObj)

        // @ts-ignore
        const appTitle = envsObj?.APP_TITLE

        if (appTitle) {
            document.title = appTitle
        }

        // @ts-ignore
        const appFaviconSVG = envsObj?.APP_FAVICON

        if (appFaviconSVG) {
            const encodedSVG = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(appFaviconSVG)}`

            const faviconLink = document.querySelector("link[rel*='icon']") || document.createElement('link')

            // @ts-ignore
            faviconLink.type = 'image/svg+xml'
            // @ts-ignore
            faviconLink.rel = 'icon'
            // @ts-ignore
            faviconLink.href = encodedSVG

            document.getElementsByTagName('head')[0].appendChild(faviconLink)
        }
    }, [settings])

    const contextValue = useMemo(
        () => ({
            structure,
            services,
            settings,
            manifestRouting,
            pseudoContent,
            pseudoComponents,
            pseudoRoutes,
            pseudoApps,
            pseudoWidgets,
        }),
        [
            structure,
            services,
            settings,
            manifestRouting,
            pseudoRoutes,
            pseudoContent,
            pseudoComponents,
            pseudoApps,
            pseudoWidgets,
        ],
    )

    if (manifestFetchPending || !manifestRouting) {
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

    if (manifestFetchSuccess === false && !didErrorShownRef.current) {
        console.error('Ошибка при загрузке динамического манифеста')

        snackbar.show({
            title: 'Ошибка при загрузке динамического манифеста',
            description: 'Обратитесь к администратору',
            timeout: 3000,
            severity: 'error',
            variant: 'outlined',
        })

        didErrorShownRef.current = true
    }

    return <DynamicManifestContext.Provider value={contextValue}>{children}</DynamicManifestContext.Provider>
}

export function useDynamicManifest(): DManifestType | null {
    const manifest = useContext(DynamicManifestContext)

    if (!manifest) {
        throw new Error('Dynamic Manifest Context: Dynamic Manifest Provider not in tree')
    }

    return useMemo(() => manifest, [manifest])
}
