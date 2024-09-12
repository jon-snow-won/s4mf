import { useEffect, useRef, DependencyList } from 'react'

type DependencyChange<T> = {
    before: T
    after: T
}

type EffectHook = () => void

type UsePrevious<T> = (value: T, initialValue: T) => T

export const usePrevious: UsePrevious<DependencyList> = (value, initialValue) => {
    const ref = useRef(initialValue)

    useEffect(() => {
        ref.current = value
    })

    return ref.current
}

type UseEffectDebugger = (effectHook: EffectHook, dependencies: DependencyList, dependencyNames?: string[]) => void

export const useEffectDebugger: UseEffectDebugger = (effectHook, dependencies, dependencyNames = []) => {
    const previousDeps = usePrevious(dependencies, [])

    const changedDeps = dependencies.reduce<Record<string, DependencyChange<any>>>((accum, dependency, index) => {
        if (dependency !== previousDeps[index]) {
            const keyName = dependencyNames[index] || index.toString()

            return {
                ...accum,
                [keyName]: {
                    before: previousDeps[index],
                    after: dependency,
                } as DependencyChange<any>, // Adjust type here based on your use case
            }
        }

        return accum
    }, {})

    if (Object.keys(changedDeps).length) {
        console.log('deb-[use-effect-debugger] ', changedDeps)
    }

    useEffect(effectHook, dependencies)
}
