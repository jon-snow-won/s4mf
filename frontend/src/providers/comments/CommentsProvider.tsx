import React, { createContext, useContext, useMemo, useState } from 'react'

type ProviderProps = {
    children: JSX.Element
}

interface CommentsContextProps {
    isShowComments: boolean
    setShowComments: React.Dispatch<React.SetStateAction<boolean>>
    toggleShowComments: () => void
    systems: string[]
    setSystems: React.Dispatch<React.SetStateAction<string[]>>
}

const CommentsContext = createContext<CommentsContextProps>({
    isShowComments: false,
    setShowComments: () => {},
    toggleShowComments: () => {},
    systems: [],
    setSystems: () => {},
})

export function CommentsProvider({ children }: ProviderProps) {
    const [isShowComments, setShowComments] = useState(false)
    const [systems, setSystems] = useState<string[]>([])

    const toggleShowComments = () => {
        setShowComments((prevState) => !prevState)
    }

    const contextValue = useMemo(
        () => ({
            isShowComments,
            setShowComments,
            toggleShowComments,
            systems,
            setSystems,
        }),
        [isShowComments, systems],
    )

    return <CommentsContext.Provider value={contextValue}>{children}</CommentsContext.Provider>
}

export function useCommentsContext(): CommentsContextProps {
    return useContext(CommentsContext)
}
