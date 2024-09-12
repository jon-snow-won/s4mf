import { useEffect, useState } from 'react'

import { useCommentsContext } from '@providers/comments/CommentsProvider'
import { useDynamicManifest } from '@providers/WithDynamicManifest'

import { useManifest } from '../providers/WithManifest'
import { ManifestComponent } from '../types/manifest'

// ДЕЛО: is not good realization, refactor

export const useMappingComponents = (keys: string[]): ManifestComponent[] => {
    const { components, content } = useManifest()
    const { setSystems } = useCommentsContext()

    const [layoutContent, setLayoutContent] = useState<ManifestComponent[]>([])

    useEffect(() => {
        if (!keys.length) return

        const contentComponents = keys.map((key) => content[key].components)
        const flatContent = contentComponents.flatMap((item) => item)
        const items = flatContent.map((item) => components[item.name]).filter((item) => item)

        setLayoutContent(items)
        setSystems(keys)
    }, [keys])

    return layoutContent
}

export const useMappingComponentsDynamic = (keys: string[]): ManifestComponent[] => {
    const { pseudoComponents, pseudoContent } = useDynamicManifest()
    const { setSystems } = useCommentsContext()

    const [layoutContent, setLayoutContent] = useState<ManifestComponent[]>([])

    useEffect(() => {
        if (!keys.length) return

        // @ts-ignore
        const contentComponents = keys.map((key) => pseudoContent?.[key]?.components).filter((key) => key)

        if (!contentComponents.length) {
            console.error(
                'deb-useMappingComponentsDynamic-contentComponents, отсутствует contentComponents',
                keys,
                pseudoContent,
            )

            return
        }

        const flatContent = contentComponents.flatMap((item) => item)
        const items = flatContent.map((item) => pseudoComponents[item.name]).filter((item) => item)

        // @ts-ignore
        setLayoutContent(items)
        setSystems(keys)
    }, [keys])

    return layoutContent
}
