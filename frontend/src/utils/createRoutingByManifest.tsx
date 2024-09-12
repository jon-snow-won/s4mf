import React from 'react'
import { RouteObject } from 'react-router-dom'

import { FullComponentLayout, FullComponentLayoutDynamic } from '../layouts/FullComponentLayout'
import GridLayout from '../layouts/GridLayout'
import { LAYOUT } from '../types/layout'
import { ManifestRoutes } from '../types/manifest'

export const getLayout = (layout: string, content: string[]) => {
    switch (layout) {
        case LAYOUT.GRID: {
            return <GridLayout layoutContentKeys={content} />
        }
        case LAYOUT.FULL: {
            return <FullComponentLayout content={content} />
        }

        default: {
            return null
        }
    }
}

export const getLayoutDynamic = (layout: string, content: string[]) => {
    switch (layout) {
        case LAYOUT.GRID: {
            return <GridLayout layoutContentKeys={content} />
        }
        case LAYOUT.FULL: {
            return <FullComponentLayoutDynamic content={content} />
        }

        default: {
            return null
        }
    }
}

export const createRoutingByManifest = (routes: ManifestRoutes): RouteObject[] =>
    Object.keys(routes)
        .filter((key) => key)
        .map((key) => {
            const { path, layout, content } = routes[key]

            return {
                path,
                element: getLayout(layout, content),
            }
        })
