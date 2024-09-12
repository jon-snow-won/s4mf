import { List, Popover as PopoverMUI, PopoverProps } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import PostCommentDialog from '@components/PostCommentDialog'
import { CommentModeType } from '@hooks/useComments.types'
import { getPopoverPosition } from '@utils/comments'
import { getUuidv4 } from '@utils/common'

interface CommentsWidgetProps {
    popoverAnchor: Element
    handlePopoverClose: () => void
    popoverItems: any[]
    commentMode: CommentModeType
    onClosePostDialog: () => void
    onSubmitPostDialog: (value: string) => void
    selectedTextInfo: {
        nodeRect: DOMRect
    }
}

interface StyledPopoverProps extends PopoverProps {
    position: {
        left: number
        top: number
    }
}

const POPOVER_DIMENSIONS = {
    width: 242,
    height: 166,
}

const AddCommentWidget = (props: CommentsWidgetProps) => {
    const {
        popoverAnchor,
        handlePopoverClose,
        popoverItems,
        commentMode,
        onClosePostDialog,
        onSubmitPostDialog,
        selectedTextInfo,
    } = props

    const position = useMemo(() => {
        if (!selectedTextInfo.nodeRect) {
            return null
        }

        return getPopoverPosition(selectedTextInfo.nodeRect, POPOVER_DIMENSIONS, { shouldCalcHeight: true })
    }, [selectedTextInfo.nodeRect])

    return (
        <>
            {popoverAnchor && position && (
                <StyledPopover
                    className="fedapp-AddCommentWidget"
                    anchorEl={popoverAnchor}
                    // open={Boolean(popoverAnchor)}
                    open={Boolean(popoverAnchor) && Boolean(position)}
                    onClose={handlePopoverClose}
                    position={position}
                >
                    <List>
                        {popoverItems.map(({ icon: IconComponent, title, onClick }) => (
                            <ItemWrapper key={getUuidv4()}>
                                <ItemWrapperWrapper onClick={onClick}>
                                    <IconComponent
                                        sx={{
                                            display: 'flex',
                                            fontSize: '20px',
                                            color: '#000',
                                        }}
                                    />
                                    <StyledListItemText primary={title} />
                                </ItemWrapperWrapper>
                            </ItemWrapper>
                        ))}
                    </List>
                </StyledPopover>
            )}
            <PostCommentDialog open={Boolean(commentMode)} onClose={onClosePostDialog} onSubmit={onSubmitPostDialog} />
        </>
    )
}

export default AddCommentWidget

const StyledPopover = styled(PopoverMUI)<StyledPopoverProps>`
    & .MuiPaper-root {
        left: ${(props) => props.position?.left ?? 0}px !important;
        top: ${(props) => props.position?.top ?? 0}px !important;
        width: ${POPOVER_DIMENSIONS.width}px;
        height: ${POPOVER_DIMENSIONS.height}px;
    }
`

const ItemWrapper = styled.div<{
    isActive?: boolean
}>`
    cursor: pointer;
    display: flex;
    flex: 0 0 auto; /* Prevent shrinking and growing */
    min-width: 0; /* Allow content to shrink beyond its intrinsic width */

    gap: 6px;
    display: flex;
    flex-wrap: wrap;
    padding: 9px 16px;
    height: 100%;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    position: relative;
    flex-grow: 1;
    flex-flow: row nowrap;

    & div {
        width: 100%;
    }

    &:hover {
        background-color: rgba(0, 0, 0, 0.08);
    }
`

const ItemWrapperWrapper = styled.div`
    flex-direction: row;
    display: flex;
    width: 100%;
    gap: 6px;
    align-items: center;
`

const StyledListItemText = styled(ListItemText)`
    color: #000000;
`
