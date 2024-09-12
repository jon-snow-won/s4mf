import { ManifestApp } from '../../types/manifest'

const getAppNameByPath = (path = '') => {
    if (path === null) {
        return path
    }

    const arr = path?.replace(/\\/g, '/')?.split('/')

    return arr?.[1]
}

export const getGroupByPath = (path: string, groups: ManifestApp) => {
    if (!groups) {
        return null
    }
    const fallbackGroupName = Object.keys(groups)?.[0]

    if (path === '/') {
        return fallbackGroupName
    }

    const appName = getAppNameByPath(path)
    const groupNameByLocation = Object.entries(groups).find(([_, entry]) => entry.routes.includes(appName))?.[0]

    return groupNameByLocation ?? fallbackGroupName
}
