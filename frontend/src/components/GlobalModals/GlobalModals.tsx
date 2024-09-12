import React, { useContext } from 'react'
import styled from 'styled-components'

import { Confirm } from './Confirm'
import { GlobalModalsContext } from './GlobalModalsProvider'
import { Notification } from './Notification'
import { ConfirmModal, NotificationModal } from './types'

export function GlobalModals() {
    const { modals } = useContext(GlobalModalsContext)

    return (
        <>
            {modals.confirm.map((confirm: ConfirmModal) =>
                React.createElement(Confirm, { key: confirm.id, ...confirm }),
            )}

            <NotificationsWrapper>
                {modals.notification.map((notification: NotificationModal) =>
                    React.createElement(Notification, { key: notification.id, ...notification }),
                )}
            </NotificationsWrapper>
        </>
    )
}

const NotificationsWrapper = styled.div`
    position: absolute;
    top: calc(36px + 13px);
    right: 16px;

    z-index: 10001;
`
