import React, { createContext, useState, useContext, ReactNode, SetStateAction, Dispatch, useMemo } from 'react'

interface AuthUserInfo {
    email: string
    name: string
    family: string
    login: string
    permissions: []
    roles: []
    sub: string
}

type AuthUserContextProps = {
    authUser: AuthUserInfo
    setAuthUser: Dispatch<SetStateAction<AuthUserInfo | null>>
}

const AuthUserContext = createContext<AuthUserContextProps>(undefined)

type AuthUserProviderProps = {
    children: ReactNode
}

const AuthUserProvider = ({ children }: AuthUserProviderProps) => {
    const [authUser, setAuthUser] = useState<AuthUserInfo | null>(null)

    const value = useMemo(() => ({ authUser, setAuthUser }), [authUser, setAuthUser])

    return <AuthUserContext.Provider value={value}>{children}</AuthUserContext.Provider>
}

const useAuthUser = () => {
    const context = useContext(AuthUserContext)

    if (context === undefined) {
        throw new Error('useAuthUser must be used within a AuthUserProvider')
    }

    return context.authUser
}

const useSetAuthUser = () => {
    const context = useContext(AuthUserContext)

    if (context === undefined) {
        throw new Error('useSetAuthUser must be used within a AuthUserProvider')
    }

    return context.setAuthUser
}

export { AuthUserProvider, useAuthUser, useSetAuthUser }
