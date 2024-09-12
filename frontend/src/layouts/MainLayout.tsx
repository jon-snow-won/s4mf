import { SubMenu } from '@s4mf/uikit'
import { AddCommentOutlined, AddTaskOutlined, ContentCopy, PostAddOutlined } from '@mui/icons-material'
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'

import AddCommentWidget from '@components/comments/AddCommentWidget'
import ShowCommentsWidget from '@components/comments/ShowCommentsWidget'
import { GlobalModals } from '@components/GlobalModals'
import HeaderDynamic from '@components/HeaderDynamic'
import { RoutePath } from '@config/routeConfig/routeConfig'
import { useComments } from '@hooks/useComments'
import { useLocalStorage } from '@hooks/useLocalStorage'
import { useManifestLinks, useManifestLinksDynamic } from '@hooks/useManifestLinks/useManifestLinks'
import { Role } from '@pages/SelectRolePage/types/Role'
import { LocalStorageKey } from '@utils/localStorageConst'

import Header from '../components/Header'

interface WidgetItem {
    name: string
    routes: string[]
    icon: string | null
}

interface Props {
    widgets: {
        [key: string]: WidgetItem
    }
}

export function MainLayout({ widgets }: Props) {
    const [role] = useLocalStorage<Role | null>(LocalStorageKey.app_role, null)
    const { pathname } = useLocation()
    const { parentLinks, widgetLinks } = useManifestLinks()

    const settings = widgetLinks?.find((it) => it.key === 'settings')?.links

    const currentLocation = useLocation().pathname.split('/')[1]
    const isInSettings = settings?.find((link) => link.path.includes(currentLocation))

    const {
        popoverAnchor,
        handlePopoverClose,
        selectedTextInfo,
        commentMode,
        setCommentMode,
        setShouldPostComment,
        showCommentsPopoverAnchor,
        showCommentsData,
        handleCommentsPopoverClose,
        onDeleteComment,
    } = useComments({ disabled: !widgets.comments })

    const onClosePostDialog = () => {
        setCommentMode(null)
        setShouldPostComment('')
    }

    const onSubmitPostDialog = async (comment: string) => {
        setShouldPostComment(comment)
    }

    const popoverItems = [
        {
            icon: ContentCopy,
            title: 'Копировать',
            onClick: () => {
                navigator.clipboard.writeText(selectedTextInfo.selectedText)
                handlePopoverClose()
            },
        },
        {
            icon: AddCommentOutlined,
            title: 'Добавить комментарий',
            onClick: () => {
                setCommentMode('comment')
                handlePopoverClose()
            },
        },
        {
            icon: PostAddOutlined,
            title: 'Добавить в Глоссарий',
            onClick: () => {
                alert('Пока не реализовано')
            },
        },
        {
            icon: AddTaskOutlined,
            title: 'Создать задачу',
            onClick: () => {
                alert('Пока не реализовано')
            },
        },
    ]

    if (!role) {
        return <Navigate to={RoutePath.selectRole} />
    }

    if (pathname === '/' && parentLinks.length) {
        const firstApp = parentLinks?.[0].path ?? ''

        return <Navigate to={`/${firstApp}`} />
    }

    return (
        <>
            <Header />
            {isInSettings && <SubMenu linkComponent={NavLink} items={settings} />}
            <Outlet />
            {widgets.comments && (
                <>
                    <AddCommentWidget
                        popoverAnchor={popoverAnchor}
                        handlePopoverClose={handlePopoverClose}
                        commentMode={commentMode}
                        onClosePostDialog={onClosePostDialog}
                        onSubmitPostDialog={onSubmitPostDialog}
                        popoverItems={popoverItems}
                        selectedTextInfo={selectedTextInfo}
                    />
                    <ShowCommentsWidget
                        popoverAnchor={showCommentsPopoverAnchor}
                        handlePopoverClose={handleCommentsPopoverClose}
                        popoverItems={[
                            showCommentsData || { text: '', author: '', date: '', objectId: '', nodeRect: null },
                        ]}
                        onDelete={onDeleteComment}
                    />
                </>
            )}
            <GlobalModals />
        </>
    )
}

export function MainLayoutDynamic() {
    const [role] = useLocalStorage<Role | null>(LocalStorageKey.app_role, null)
    const { pathname } = useLocation()
    const { parentLinks, widgetLinks } = useManifestLinksDynamic()

    const settings = widgetLinks.find((it) => it.key === 'header-settings')?.links ?? []

    const currentLocation = useLocation().pathname.split('/')[1]
    const isInSettings = settings.find((link) => link.path.includes(currentLocation))

    const {
        popoverAnchor,
        handlePopoverClose,
        selectedTextInfo,
        commentMode,
        setCommentMode,
        setShouldPostComment,
        showCommentsPopoverAnchor,
        showCommentsData,
        handleCommentsPopoverClose,
        onDeleteComment,
    } = useComments({ disabled: true })

    const onClosePostDialog = () => {
        setCommentMode(null)
        setShouldPostComment('')
    }

    const onSubmitPostDialog = async (comment: string) => {
        setShouldPostComment(comment)
    }

    const popoverItems = [
        {
            icon: ContentCopy,
            title: 'Копировать',
            onClick: () => {
                navigator.clipboard.writeText(selectedTextInfo.selectedText)
                handlePopoverClose()
            },
        },
        {
            icon: AddCommentOutlined,
            title: 'Добавить комментарий',
            onClick: () => {
                setCommentMode('comment')
                handlePopoverClose()
            },
        },
        {
            icon: PostAddOutlined,
            title: 'Добавить в Глоссарий',
            onClick: () => {
                alert('Пока не реализовано')
            },
        },
        {
            icon: AddTaskOutlined,
            title: 'Создать задачу',
            onClick: () => {
                alert('Пока не реализовано')
            },
        },
    ]

    if (!role) {
        return <Navigate to={RoutePath.selectRole} />
    }

    if (pathname === '/' && parentLinks.length) {
        const firstApp = parentLinks?.[0].path ?? ''

        return <Navigate to={`/${firstApp}`} />
    }

    return (
        <>
            <HeaderDynamic />
            {isInSettings && (
                <SubMenu
                    linkComponent={NavLink}
                    items={[
                        ...settings,
                        {
                            path: 'dynamic-manifest/structures',
                            title: 'Структура сайта',
                        },
                    ]}
                />
            )}
            <Outlet />
            <AddCommentWidget
                popoverAnchor={popoverAnchor}
                handlePopoverClose={handlePopoverClose}
                commentMode={commentMode}
                onClosePostDialog={onClosePostDialog}
                onSubmitPostDialog={onSubmitPostDialog}
                popoverItems={popoverItems}
                selectedTextInfo={selectedTextInfo}
            />
            <ShowCommentsWidget
                popoverAnchor={showCommentsPopoverAnchor}
                handlePopoverClose={handleCommentsPopoverClose}
                popoverItems={[showCommentsData || { text: '', author: '', date: '', objectId: '', nodeRect: null }]}
                onDelete={onDeleteComment}
            />
            <GlobalModals />
        </>
    )
}
