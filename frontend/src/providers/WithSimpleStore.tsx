import React from 'react'

import { CommentsProvider } from '@providers/comments/CommentsProvider'
import { NotificationsProvider } from '@providers/notifications/NotificationsProvider'

type ProviderProps = {
    children: JSX.Element
}

export function WithSimpleStore({ children }: ProviderProps) {
    return (
        <CommentsProvider>
            <NotificationsProvider>{children}</NotificationsProvider>
        </CommentsProvider>
    )
}
