import { useCallback, useMemo, useState } from 'react'

import { getLogger } from '@utils/getLogger'

export const useLocalStorage = <T>(keyName: string, defaultValue: T) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const value = window.localStorage.getItem(keyName)

            if (value) {
                return JSON.parse(value)
            }
            window.localStorage.setItem(keyName, JSON.stringify(defaultValue))

            return defaultValue
        } catch (err) {
            return defaultValue
        }
    })

    const setValue = useCallback(
        (newValue: T) => {
            try {
                window.localStorage.setItem(keyName, JSON.stringify(newValue))
            } catch (err) {
                getLogger(err)
            }

            setStoredValue(newValue)
        },
        [keyName],
    )

    return useMemo(() => [storedValue, setValue] as [T, (v: T) => void], [setValue, storedValue])
}
