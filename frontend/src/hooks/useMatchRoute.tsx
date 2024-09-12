import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

import { useManifest } from '../providers/WithManifest'

// ДЕЛО: перевести на baseUrl и проверять
export const useMatchRoute = () => {
    const location = useLocation()
    const locationArr = location.pathname.split('/')
    const { routes } = useManifest()

    return useMemo(
        () =>
            Object.keys(routes)
                .filter((route) => locationArr.includes(route) && route)
                .toString(),
        [location],
    )
}
