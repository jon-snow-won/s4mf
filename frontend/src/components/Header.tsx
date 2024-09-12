import { MiramedixIconButton, Navbar as MenuComponent, NavbarAddon, ProfileMenu } from '@s4mf/uikit'
import {
    ChangeCircleOutlined,
    CommentOutlined,
    CommentsDisabledOutlined,
    HelpOutlineOutlined,
    NotificationsNoneOutlined,
    PersonOutlined,
} from '@mui/icons-material'
import { Badge, ListItemIcon, MenuItem } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'
import React, { ElementType, useEffect, useMemo, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import HeaderPopup from '@components/HeaderPopup'
import sendLogoutPost from '@components/sendLogoutPost'
import { RoutePath } from '@config/routeConfig/routeConfig'
import { useAnchorPopup } from '@hooks/useAnchorPopup'
import { useManifestLinks } from '@hooks/useManifestLinks/useManifestLinks'
import { useTestId } from '@hooks/useTestId'
import { NotificationsPopover } from '@pages/notifications/components/popover'
import { useCommentsContext } from '@providers/comments/CommentsProvider'
import { useNotificationsCountFromWS } from '@providers/notifications/NotificationsProvider'
import { useProfile } from '@providers/profile/ProfileProvider'
import { notificationService } from '@services/NotificationService'
import { envConfig } from '@config/envConfig/envConfig'
import { DataTestIds } from '@utils/dataTestIdConst'
import './header.css'
import { ManifestOptionsIdEnum } from '@pages/AdminPage/AdminPage'
import { Manifest } from '@src/types/manifest'
import { useManifestVersion } from '@hooks/useManifestVersion'
import { useAxios } from '@providers/WithAxios'
import { useLocalStorage } from '@hooks/useLocalStorage'
import { LocalStorageKey } from '@utils/localStorageConst'
import { useAuthUser } from '@providers/authUserContext'

const APP_VERSION = envConfig.VERSION
const { APP_NAME } = envConfig

export default function Header() {
    const { AnchorPopup, showAnchorPopup, anchorPopupProps } = useAnchorPopup()

    const apiClient = useAxios()
    const navigate = useNavigate()
    const { manifestVersionId, envConfigByManifestVersion } = useManifestVersion()

    let userName = ''
    const userInfoFromContext = useAuthUser()

    const nameFormLocalStorage = localStorage.getItem('fed_app__app_username')
    const nameFromContext = userInfoFromContext?.name

    if (nameFormLocalStorage) {
        userName = nameFormLocalStorage.split('"').join('')
    } else if (nameFromContext) {
        const nameParts = nameFromContext.split(' ')

        userName = `${nameParts[0]} ${nameParts[2]}`
    }

    const { userProfile, logout } = useProfile()
    const { parentLinks, widgetLinks } = useManifestLinks()

    const notificationsButtonTestId = useTestId(DataTestIds.header_notifications)
    const headerCommentsButtonTestId = useTestId(DataTestIds.header_comments)
    const headerFaqButtonTestId = useTestId(DataTestIds.header_faq)
    const headerSettingsButtonTestId = useTestId(DataTestIds.header_settings)

    const logoColor = envConfigByManifestVersion.LOGO_COLOR
    const [svgLogo, setSvgLogo] = useLocalStorage(LocalStorageKey.header_logo, undefined)

    const { isShowComments, setShowComments, toggleShowComments } = useCommentsContext()

    const [notificationsCount, setNotificationsCount] = useState(0)
    const notificationsCountFromWs = useNotificationsCountFromWS()
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

    const [showWidgetMenu, setShowWidgetMenu] = useState(
        widgetLinks?.filter(({ key }) => key === 'settings').map(({ key }) => ({ key, anchorEl: null })),
    )
    const [profileWidgets] = useState(
        widgetLinks
            ?.filter(({ key }) => key === 'profile')?.[0]
            ?.links.map(({ path, title }) => ({ key: path, title, anchorEl: null })),
    )

    const getNotifications = () => {
        notificationService
            .getUnreadNotificationCount()
            .then((count: number) => setNotificationsCount(count))
            .catch((error) => console.log(error))
    }

    const getHeaderLogo = async () => {
        if (manifestVersionId === ManifestOptionsIdEnum.STATIC) {
            try {
                const { data } = await apiClient.get<Manifest>('public/header-logo.svg')

                if (data) {
                    setSvgLogo(data)
                }
            } catch (err) {
                setSvgLogo('logo')
            }
        } else if (manifestVersionId === ManifestOptionsIdEnum.DYNAMIC) {
            // @ts-ignore
            const selectRolesSvg = settingProperties?.properties?.SELECT_ROLE_LOGO

            if (selectRolesSvg) {
                setSvgLogo(selectRolesSvg)
            }
        }
    }

    useEffect(() => {
        getHeaderLogo()
        getNotifications()
    }, [])

    useEffect(() => {
        if (!isShowComments) {
            return
        }

        setShowComments(false)
    }, [navigate])

    useEffect(() => {
        if (!notificationsCountFromWs) {
            return
        }

        getNotifications()
    }, [notificationsCountFromWs])

    const handleLogoutClick = () => {
        sendLogoutPost()
        logout()
    }

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleCloseWidget = () => {
        setShowWidgetMenu((prevState) => prevState.map(({ key }) => ({ key, anchorEl: null })))
    }

    const renderCustomMenu = useMemo(
        () => [
            <>
                <MenuItem key={1} onClick={() => navigate(RoutePath.selectRole)}>
                    <ListItemIcon>
                        <ChangeCircleOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Сменить систему</ListItemText>
                </MenuItem>
                {profileWidgets.map(({ key, title }) => (
                    <MenuItem key={key} onClick={() => navigate(`/${key}`)}>
                        <ListItemIcon>
                            <PersonOutlined fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{title}</ListItemText>
                    </MenuItem>
                ))}
            </>,
        ],
        [profileWidgets],
    )

    const renderTableColumnsPopup = useMemo(
        () => (
            <AnchorPopup {...anchorPopupProps}>
                <ProfileMenu
                    role={{
                        fullName: userProfile.firstName
                            ? [userProfile.firstName, userProfile.lastName].filter(Boolean).join(' ')
                            : userName,
                        title: '',
                        description: '',
                    }}
                    onLogoutClick={handleLogoutClick}
                    version={APP_VERSION}
                    appName={APP_NAME}
                    customMenu={renderCustomMenu}
                />
            </AnchorPopup>
        ),
        [AnchorPopup, anchorPopupProps],
    )

    const SPECIAL_WIDGET_KEYS = ['profile', 'notifications', 'faq', 'comments']

    const renderWidgetLinks = () => {
        if (!widgetLinks || !widgetLinks.length) {
            return null
        }

        return widgetLinks
            .filter(({ key }) => !SPECIAL_WIDGET_KEYS.includes(key))
            .map(({ key, icon, name }) => (
                <MiramedixIconButton
                    key={key}
                    color="info"
                    icon={icon as ElementType}
                    tooltip={name}
                    onClick={(event) => {
                        setShowWidgetMenu((prevState) =>
                            prevState.map(({ key: prevKey }) => ({
                                key: prevKey,
                                anchorEl: prevKey === key ? event.currentTarget : null,
                            })),
                        )
                    }}
                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                    {...headerSettingsButtonTestId}
                />
            ))
    }

    const renderWidgetsPopup = useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        if (!widgetLinks?.length || !showWidgetMenu.filter(({ anchorEl }) => anchorEl).length) {
            return null
        }

        // eslint-disable-next-line @typescript-eslint/no-shadow
        const widget = showWidgetMenu.find(({ anchorEl }) => anchorEl)
        const anchorElement = widget?.anchorEl
        const links = widgetLinks.find(({ key }) => key === widget?.key)?.links

        return <HeaderPopup popoverAnchor={anchorElement} handlePopoverClose={handleCloseWidget} popoverItems={links} />
    }, [showWidgetMenu, widgetLinks])

    return (
        <>
            <MenuComponent
                linkComponent={NavLink}
                menuItems={parentLinks}
                logoIcon={
                    <div
                        dangerouslySetInnerHTML={{ __html: svgLogo }}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    />
                }
                logoColor={logoColor}
                addon={
                    <NavbarAddon
                        onlyIcon
                        fullName={userProfile.firstName ? `${userProfile.firstName} ${userProfile.lastName}` : userName}
                        onShowAnchorPopup={({ event }) => showAnchorPopup({ event })}
                        iconButtons={[
                            renderWidgetLinks(),
                            widgetLinks.some((link) => link.key === 'comments') && (
                                <MiramedixIconButton
                                    key="comments"
                                    color="info"
                                    icon={isShowComments ? CommentOutlined : CommentsDisabledOutlined}
                                    tooltip={isShowComments ? 'Скрыть комментарии' : 'Показать комментарии'}
                                    onClick={() => {
                                        toggleShowComments()
                                    }}
                                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                    {...headerCommentsButtonTestId}
                                />
                            ),
                            widgetLinks.some((link) => link.key === 'faq') && (
                                <MiramedixIconButton
                                    key={1}
                                    color="info"
                                    icon={HelpOutlineOutlined}
                                    tooltip="FAQ"
                                    onClick={() => {}}
                                    style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                    disabled
                                    {...headerFaqButtonTestId}
                                />
                            ),
                            widgetLinks.some((link) => link.key === 'notifications') && (
                                <Badge
                                    key={2}
                                    badgeContent={notificationsCount}
                                    color="error"
                                    className="header__notifications-popover"
                                >
                                    <MiramedixIconButton
                                        key={2}
                                        color="info"
                                        icon={NotificationsNoneOutlined}
                                        tooltip="Уведомления"
                                        onClick={handleClick}
                                        style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                                        {...notificationsButtonTestId}
                                    />
                                </Badge>
                            ),
                        ]}
                    />
                }
            />
            {renderTableColumnsPopup}
            {renderWidgetsPopup}
            {anchorEl && <NotificationsPopover anchorEl={anchorEl} handleClose={handleClose} />}
        </>
    )
}
