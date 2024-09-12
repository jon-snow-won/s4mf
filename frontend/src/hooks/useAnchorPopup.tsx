import { FC, MouseEvent, useCallback, useState } from 'react'
import { Menu } from '@mui/material'
import type { MenuProps } from '@mui/material'

interface AnchorPopupParams {
    event?: MouseEvent<any>
}

export interface UseAnchorPopupResult {
    isOpen: boolean
    showAnchorPopup: ({ event }: AnchorPopupParams) => void
    hideAnchorPopup: ({ event }: AnchorPopupParams) => void
    updatePosition: ({ event }: AnchorPopupParams) => void
    anchorPopupProps: MenuProps
    AnchorPopup: FC<MenuProps>
}

export const AnchorPopup: FC<MenuProps> = (anchorProps) => <Menu {...anchorProps} />

export const useAnchorPopup = () => {
    const [opened, setOpened] = useState<boolean>(false)
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

    const showAnchorPopup = useCallback(
        (params: AnchorPopupParams) => {
            params?.event?.stopPropagation()
            setOpened(!opened)
            if (!params?.event) return
            setAnchorEl(params.event.currentTarget)
        },
        [opened],
    )

    const hideAnchorPopup = useCallback((params: AnchorPopupParams) => {
        params?.event?.stopPropagation()
        setOpened(false)
        setAnchorEl(null)
    }, [])

    const updatePosition = useCallback((params: AnchorPopupParams) => {
        // ДЕЛО..
    }, [])

    return {
        isOpen: opened,
        showAnchorPopup,
        hideAnchorPopup,
        updatePosition,
        anchorPopupProps: {
            open: opened,
            anchorEl,
            onClose: hideAnchorPopup,
        },
        AnchorPopup,
    } as UseAnchorPopupResult
}
