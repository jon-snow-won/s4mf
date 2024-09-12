import { Scrollbars } from '@s4mf/uikit'
import { NotificationsNoneOutlined } from '@mui/icons-material'
import { Box, Button, CircularProgress, FormControlLabel, Popover, Switch, Typography } from '@mui/material'
import { format } from 'date-fns'
import { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useLocalStorage } from '@hooks/useLocalStorage'
import { useManifestVersion } from '@hooks/useManifestVersion'
import { useTestId } from '@hooks/useTestId'
import { useNotificationsCountFromWS } from '@providers/notifications/NotificationsProvider'
import { notificationService } from '@services/NotificationService'
import { DataTestIds } from '@utils/dataTestIdConst'
import { LocalStorageKey } from '@utils/localStorageConst'

import { Notification, NotificationsPopoverToggle, NotificationStatusText } from '../../types'
import { getStatus } from '../../utils/getStatus'

import './index.css'

type NotificationsPopoverPropsType = {
    handleClose: () => void
    anchorEl: HTMLElement
    notificationsUrl?: string | undefined
}

const previewLimits = {
    pageNum: 1,
    pageSize: 15,
}

export const NotificationsPopover: FC<NotificationsPopoverPropsType> = (props) => {
    const { handleClose, anchorEl, notificationsUrl } = props

    const [notifications, setPreviewNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)

    const { envConfigByManifestVersion } = useManifestVersion()

    const [, setNotificationInfo] = useLocalStorage<Notification | null>(LocalStorageKey.notification_info, null)

    const [notificationsPopoverToggleLS, setNotificationsPopoverToggleLS] =
        useLocalStorage<NotificationsPopoverToggle | null>(
            LocalStorageKey.notifications_popover_toggle,
            NotificationsPopoverToggle.all,
        )
    const [readUnreadToggleValue, setReadUnreadToggleValue] = useState<boolean>(
        notificationsPopoverToggleLS === NotificationsPopoverToggle.unread,
    )

    const notificationsCountFromWs = useNotificationsCountFromWS()

    const popoverToggleButtonTestId = useTestId(DataTestIds.popover_toggle)
    const popoverRegisterNotificationsButtonTestId = useTestId(DataTestIds.popover_register_notification)

    const getNotifications = () => {
        setLoading(true)
        notificationService
            .getNotificationsListWithoutCount({ ...previewLimits, unread: readUnreadToggleValue })
            .then(({ list }) => {
                setPreviewNotifications(list)

                return setLoading(false)
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        getNotifications()
    }, [])

    useEffect(() => {
        if (!notificationsCountFromWs) {
            return
        }

        getNotifications()
    }, [notificationsCountFromWs])

    const onFilterChange = async (unread: boolean) => {
        setLoading(true)
        const res = await notificationService.getNotificationsListWithoutCount({ ...previewLimits, unread })

        setPreviewNotifications(res.list)
        setLoading(false)
    }

    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined

    return (
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <div style={{ width: '444px' }}>
                <div
                    style={{
                        padding: '16px 24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                    }}
                >
                    <Typography variant="h6">Уведомления</Typography>
                    <FormControlLabel
                        checked={readUnreadToggleValue}
                        disabled={loading}
                        onChange={(_, checked) => {
                            setReadUnreadToggleValue(checked)
                            setNotificationsPopoverToggleLS(
                                checked ? NotificationsPopoverToggle.unread : NotificationsPopoverToggle.all,
                            )
                            onFilterChange(checked)
                        }}
                        label="Только непрочитанные"
                        control={<Switch size="small" />}
                        {...popoverToggleButtonTestId}
                    />
                </div>
                <div style={{ height: '500px' }}>
                    {loading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                    )}
                    {!loading && (
                        <Scrollbars>
                            {!notifications?.length ? (
                                <div style={{ padding: '16px 24px' }}>
                                    <Typography variant="subtitle2">Нет уведомлений</Typography>
                                </div>
                            ) : null}
                            {notifications?.map((entry) => {
                                const status = getStatus(entry)

                                let href

                                if (notificationsUrl) {
                                    href = `${envConfigByManifestVersion.BASE_URL}/${notificationsUrl}/${entry.id}`
                                } else {
                                    href = `${envConfigByManifestVersion.BASE_URL}${envConfigByManifestVersion.NOTIFICATIONS_SERVICE_PREFIX}/${entry.id}`
                                }

                                // TODO: pass notificationsUrl into href here. Only for HeaderDynamic
                                return (
                                    <a
                                        key={entry.id}
                                        href={href}
                                        rel="noreferrer"
                                        style={{ textDecoration: 'none' }}
                                        onClick={() => {
                                            setNotificationInfo(entry)
                                            notificationService.markAsRead(entry.id)
                                        }}
                                    >
                                        <div className="notification-item" key={entry.id}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <Typography variant="caption" color="gray">
                                                    {format(new Date(entry.creationDate), 'dd.MM.yyyy в H:mm')}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color={status === NotificationStatusText.new ? 'green' : 'gray'}
                                                >
                                                    {status}
                                                </Typography>
                                            </div>
                                            <Typography
                                                variant="subtitle2"
                                                color={status === NotificationStatusText.new ? 'black' : 'gray'}
                                            >
                                                {entry.title}
                                            </Typography>
                                        </div>
                                    </a>
                                )
                            })}
                        </Scrollbars>
                    )}
                </div>
                <div
                    style={{
                        padding: '16px 24px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                    }}
                >
                    <Link
                        to={notificationsUrl ?? envConfigByManifestVersion.NOTIFICATIONS_SERVICE_PREFIX}
                        onClick={handleClose}
                    >
                        <Button startIcon={<NotificationsNoneOutlined />} {...popoverRegisterNotificationsButtonTestId}>
                            Реестр уведомлений
                        </Button>
                    </Link>
                </div>
            </div>
        </Popover>
    )
}
