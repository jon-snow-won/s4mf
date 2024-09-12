import styled from '@emotion/styled'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import IFrameComponent from '@components/IFrameComponent'
import SupersetDashboards from '@components/SupersetDashboards'
import { useMappingComponents, useMappingComponentsDynamic } from '@hooks/useMappingComponents'

import FederatedComponent from '../components/FederatedComponent'
import { ManifestComponent } from '../types/manifest'

type FullComponentLayoutProps = {
    content: string[]
}

export function FullComponentLayout({ content }: FullComponentLayoutProps) {
    const components = useMappingComponents(content)
    const [component, setComponent] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()
    const previousPath = useRef(location.pathname)
    const previousComponent = useRef(null)

    useEffect(() => {
        if (components.length) {
            setComponent(components[0])
        }
    }, [components])

    useEffect(() => {
        const currentPathParts = location.pathname.split('/').filter(Boolean)
        const previousPathParts = previousPath.current.split('/').filter(Boolean)

        const newMicroFrontend = currentPathParts[0]
        const oldMicroFrontend = previousPathParts[0]

        if (newMicroFrontend !== oldMicroFrontend) {
            navigate(location.pathname + location.hash, { replace: true })
        }

        previousPath.current = location.pathname
    }, [location.pathname, navigate])

    useEffect(() => {
        if (component && previousComponent.current && component.mode !== previousComponent.current.mode) {
            window.history.replaceState({}, '', location.pathname)
        }
        previousComponent.current = component
    }, [component, location.pathname])

    if (!component) {
        return null
    }

    if (component.mode === 'iFrame') {
        return (
            <Wrapper>
                <IFrameComponent {...component} />
            </Wrapper>
        )
    }

    if (component.mode === 'superset') {
        return (
            <Wrapper>
                <SupersetDashboards {...component} />
            </Wrapper>
        )
    }

    return (
        <Wrapper>
            <FederatedComponent {...component} />
        </Wrapper>
    )
}

export function FullComponentLayoutDynamic({ content }: FullComponentLayoutProps) {
    const components = useMappingComponentsDynamic(content)
    const [component, setComponent] = useState<ManifestComponent | null>(null)

    const didMount = useRef(false) // не костылим маршрут в том случае, если это первый заход в апп, чтобы прямые точные урлы не терялись
    const navigate = useNavigate()

    useEffect(() => {
        if (components.length) {
            setComponent(components[0])
        }
    }, [components])

    useEffect(() => {
        if (!component) {
            return
        }

        // Костыль, решающий проблему со сбросом урла в тот, который является корневым для работы микрофронта
        //
        // ДЕЛО: Исправить это поведение, т.к. оно не будет работать в том случае, если мы в одном микрофронте
        // кликнем по ссылке, ведущей на конкретное место в другом микрофронте

        if (didMount.current && component.mode === 'remote' && component?.props?.url) {
            navigate(component.props.url, { replace: true })
        }

        if ((didMount.current && component.mode === 'superset') || (component.mode === 'iFrame' && component?.url)) {
            navigate(component.url, { replace: true })
        }

        didMount.current = true
    }, [component])

    if (!component) {
        return null
    }

    if (component.mode === 'iFrame') {
        return (
            <Wrapper>
                <IFrameComponent {...component} />
            </Wrapper>
        )
    }

    if (component.mode === 'superset') {
        return (
            <Wrapper>
                <SupersetDashboards {...component} />
            </Wrapper>
        )
    }

    return (
        <Wrapper>
            <FederatedComponent {...component} />
        </Wrapper>
    )
}

const Wrapper = styled.div`
    height: calc(100vh - 36px);
    background-color: #f1f4f6;
    display: flex;
    flex-direction: column;
`
