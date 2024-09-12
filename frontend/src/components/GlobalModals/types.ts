import { PropsWithChildren, ReactNode } from 'react'
import { AlertProps } from '@mui/material'

export type ModalType = 'confirm' | 'notification'

export interface Modal {
    id: string
    type: ModalType
    onClose(): void
    title?: ReactNode
    description?: ReactNode
}

export interface ConfirmModal extends Modal {
    onConfirm?(): void
}

export interface NotificationModal extends Modal {
    timeout?: number
    variant?: AlertProps['variant']
    color?: AlertProps['color']
}

export type GlobalModal = ConfirmModal | NotificationModal

export type GlobalModalProps<TModal = GlobalModal> = TModal & {
    onClose(): void
}

export interface ConfirmProps extends GlobalModalProps<PropsWithChildren<ConfirmModal>> {}

export interface NotificationProps extends GlobalModalProps<NotificationModal> {}

export interface ModalState extends Record<ModalType, GlobalModal[]> {}

export type ConfirmFn = (
    description: string,
    onConfirm: () => void,
    props?: Omit<ConfirmModal, 'id' | 'type' | 'title' | 'onClose' | 'onConfirm'>,
) => void
export type NotificationFn = (
    color: NotificationModal['color'],
    title: string,
    description: string,
    props?: Omit<NotificationModal, 'id' | 'type' | 'description' | 'color' | 'onClose'>,
) => void

export interface GlobalModalsContextType {
    modals: ModalState
    confirm: ConfirmFn
    notification: NotificationFn
}
