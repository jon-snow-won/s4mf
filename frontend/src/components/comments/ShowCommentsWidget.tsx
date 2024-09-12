import { MiramedixIconButton } from '@s4mf/uikit'
import { DeleteOutline } from '@mui/icons-material'
import { List, Popover as PopoverMUI, PopoverProps } from '@mui/material'
import React, { useMemo } from 'react'
import styled from 'styled-components'

import { convertDigitsDateToStringDate, getPopoverPosition } from '@utils/comments'
import { getUuidv4 } from '@utils/common'
import { CommentModifyType } from '@hooks/useComments.types'

interface ShowCommentsWidgetProps {
    popoverAnchor: Element
    handlePopoverClose: () => void
    popoverItems: CommentModifyType[]
    onDelete: (objectId: string) => void
}

interface StyledPopoverProps extends PopoverProps {
    position: {
        left: number
        top: number
    }
}

const POPOVER_DIMENSIONS = {
    width: 411,
    height: 325,
}

const ShowCommentsWidget = (props: ShowCommentsWidgetProps) => {
    const { popoverAnchor, handlePopoverClose, popoverItems, onDelete } = props

    const nodeRect = popoverItems?.[0]?.nodeRect

    const position = useMemo(() => {
        if (!nodeRect) {
            return null
        }

        return getPopoverPosition(nodeRect, POPOVER_DIMENSIONS, { shouldCalcHeight: true })
    }, [nodeRect])

    if (!popoverAnchor || !position.top || !position.left) {
        return null
    }

    return (
        <StyledPopover
            className="fedapp-ShowCommentsWidget"
            open={Boolean(popoverAnchor)}
            anchorEl={popoverAnchor}
            onClose={handlePopoverClose}
            position={position}
            sx={{
                fontSize: '14px',
            }}
        >
            <Wrapper>
                {popoverItems.map(({ author, date, text, objectId }) => (
                    <ItemWrapper key={getUuidv4()}>
                        <Comment>
                            <Body>{text}</Body>
                            <Footer>
                                <FooterLeft>{author}</FooterLeft>
                                <FooterCenter>{convertDigitsDateToStringDate(date)}</FooterCenter>
                                <FooterRight>
                                    <MiramedixIconButton
                                        icon={DeleteOutline}
                                        tooltip="Удалить комментарий"
                                        onClick={() => {
                                            onDelete(objectId)
                                        }}
                                    />
                                </FooterRight>
                            </Footer>
                        </Comment>
                    </ItemWrapper>
                ))}
            </Wrapper>
        </StyledPopover>
    )
}

export default ShowCommentsWidget

const StyledPopover = styled(PopoverMUI)<StyledPopoverProps>`
    & .MuiPaper-root {
        left: ${(props) => props.position?.left ?? 0}px !important;
        top: ${(props) => props.position?.top ?? 0}px !important;
    }
`

const Wrapper = styled(List)`
    width: 411px;
    max-height: 325px;
    //overflow-y: scroll;
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
`

const Comment = styled.div`
    flex-direction: column;
    display: flex;
    width: 100%;
    gap: 6px;
    align-items: center;
`

const Body = styled.div`
    line-height: 143%;
    letter-spacing: 0.17px;
    word-wrap: break-word;
`

const Footer = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`

const FooterLeft = styled.div`
    font-size: 12px;
    font-weight: 500;
    flex: 1;
    max-width: 380px;
    white-space: break-spaces;
`

const FooterCenter = styled.div`
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    flex: 1;
`

const FooterRight = styled.div`
    margin-left: auto;
    flex: 0;
`
