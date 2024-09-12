import uniqueId from 'lodash.uniqueid'
import React, { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react'

import {
    ConfirmFn,
    ConfirmModal,
    GlobalModal,
    GlobalModalsContextType,
    ModalState,
    ModalType,
    NotificationFn,
    NotificationModal,
} from './types'

export const GlobalModalsContext = createContext<GlobalModalsContextType>({} as GlobalModalsContextType)

const initialState: ModalState = {
    confirm: [],
    notification: [],
}

export const GlobalModalsProvider = ({ children }: PropsWithChildren) => {
    const [modals, setModals] = useState<ModalState>(initialState)

    const closeModal = useCallback<(id: string) => void>(
        (id) =>
            setModals((prevModals) => {
                const newModals: ModalState = {
                    confirm: [],
                    notification: [],
                }

                for (const [type, objModals] of Object.entries<GlobalModal[]>(prevModals)) {
                    newModals[type as ModalType] = objModals.filter((modal) => modal.id !== id)
                }

                return newModals
            }),
        [],
    )

    const openModal = useCallback<(modal: Omit<GlobalModal, 'onClose'>) => void>(
        (modal) =>
            setModals((prevModals) => ({
                ...prevModals,
                [modal.type]: [...prevModals[modal.type], { ...modal, onClose: () => closeModal(modal.id) }],
            })),
        [closeModal],
    )

    const confirm = useCallback<ConfirmFn>(
        (title, onConfirm, props = {}) =>
            openModal({
                id: uniqueId('confirm'),
                type: 'confirm',
                title,
                onConfirm,
                ...props,
            } as ConfirmModal),
        [openModal],
    )

    const notification = useCallback<NotificationFn>(
        (color, title, description, props = {}) =>
            openModal({
                id: uniqueId('notification'),
                type: 'notification',
                description,
                title,
                color,
                variant: 'filled',
                timeout: 3000,
                // timeout: 200000,
                ...props,
            } as NotificationModal),
        [openModal],
    )

    const context = useMemo<GlobalModalsContextType>(
        () => ({
            modals,
            confirm,
            notification,
        }),
        [modals, confirm, notification],
    )

    return <GlobalModalsContext.Provider value={context}>{children}</GlobalModalsContext.Provider>
}
