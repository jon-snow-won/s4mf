import { lazy, useEffect, useRef, useState } from 'react'

import { useDynamicScript } from '@hooks/useDynamicScript'
import { useManifestVersion } from '@hooks/useManifestVersion'
import { loadComponent } from '@utils/loadComponent'

interface UseFederatedComponentProps {
    url: string
    scope: string
    module: string
    envUrl?: string
    isBlazorApp?: boolean
    componentProps?: any
}

const componentCache = new Map()

export const useFederatedComponent = (props: UseFederatedComponentProps) => {
    const { url, scope, module, envUrl, isBlazorApp, componentProps } = props

    const { envConfigByManifestVersion } = useManifestVersion()

    const modifiedUrl = isBlazorApp ? `${envConfigByManifestVersion.BASE_URL}${url}` : url
    const key = `${modifiedUrl}-${scope}-${module}}`

    const [Component, setComponent] = useState(null)
    const didMount = useRef(false)

    // если componentCache содержит уже key, то да, берем оттуда
    const { ready, failed } = useDynamicScript(modifiedUrl)

    const { ready: envReady, failed: envFailed } = useDynamicScript(envUrl, true)

    useEffect(() => {
        if (Component) {
            setComponent(null)
        }
    }, [key])

    useEffect(() => {
        if (ready && envReady && !Component) {
            const Comp = lazy(loadComponent(scope, module))

            componentCache.set(key, Comp)
            setComponent(Comp)

            didMount.current = true
        }
    }, [Component, ready, envReady, key])

    return { failed, envFailed, ready, envReady, Component }
}
