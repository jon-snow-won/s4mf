export const getGluedURL = ({
    baseUrl,
    url = '',
    trailingSlash = false,
}: {
    baseUrl: string
    url?: string
    trailingSlash?: boolean
}): string => {
    const baseUrlWithoutSlash = baseUrl.replace(/\/+$/gi, '')

    if (trailingSlash) {
        return `${baseUrlWithoutSlash}/${url}/`
    }

    return `${baseUrlWithoutSlash}/${url}`
}
