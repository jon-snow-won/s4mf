import { MaybeNull } from '@src/types/helpers'

export type Notification = {
    content: string
    contentEmail: MaybeNull<string>
    contentEmailSafe: string
    contentPush: MaybeNull<string>
    contentPushSafe: string
    contentRocket: MaybeNull<string>
    contentRocketSafe: MaybeNull<string>
    contentSms: MaybeNull<string>
    contentSmsSafe: MaybeNull<string>
    contentTelegram: MaybeNull<string>
    contentTelegramSafe: MaybeNull<string>
    creationDate: number
    guid: string
    id: number
    params: string
    readDate: MaybeNull<number>
    recipientId: MaybeNull<number | string>
    source: NotificationSourceType
    templateCode: MaybeNull<number | string>
    title: string
    status: NotificationStatusType
}

export type NotificationsListResponseWithCount = {
    count: number
    list: Notification[]
}

export type NotificationsListResponseWithoutCount = {
    count: null
    list: Notification[]
}

export type NotificationStatusType = keyof typeof NotificationStatus

export enum NotificationSource {
    'dictionaryservice' = 'dictionaryservice',
}

export type NotificationSourceType = keyof typeof NotificationSource

export enum NotificationStatus {
    new = 'new',
    read = 'read',
    archive = 'archive',
}

export const NotificationStatusText = {
    [NotificationStatus.new]: 'Непрочитанное',
    [NotificationStatus.read]: 'Прочитанное',
    [NotificationStatus.archive]: 'Архивное',
}

export const NotificationColors = {
    [NotificationStatus.new]: 'rgb(46, 125, 50)',
    [NotificationStatus.read]: 'rgba(0, 0, 0, 0.87)',
    [NotificationStatus.archive]: 'rgba(0, 0, 0, 0.87)',
}

export enum NotificationsPopoverToggle {
    'all' = 'all',
    'unread' = 'unread',
}
