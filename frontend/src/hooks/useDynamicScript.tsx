import { useEffect, useState } from 'react'

const urlCache = new Set()

export const useDynamicScript = (
    url?: string,
    isEnvFile: boolean = false,
): {
    ready: boolean
    failed: boolean
} => {
    const [ready, setReady] = useState(false)
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        if (!url) {
            if (isEnvFile) {
                setReady(true)
                setFailed(false)
            }

            return
        }

        setReady(false)
        setFailed(false)

        if (urlCache.has(url)) {
            setReady(true)

            return
        }

        const script = document.createElement('script')

        script.src = url
        script.type = 'text/javascript'
        script.async = true

        script.onload = () => {
            console.log(`Dynamic Script Loaded: ${url}`)
            urlCache.add(url)
            setReady(true)
        }

        script.onerror = () => {
            console.error(`Dynamic Script Error: ${url}`)
            setFailed(true)
        }

        document.head.appendChild(script)

        return () => {
            console.log(`Dynamic Script Removed: ${url}`)
            document.head.removeChild(script)

            if (failed) {
                urlCache.delete(url)
            }
        }
    }, [url])

    return {
        ready,
        failed,
    }
}
