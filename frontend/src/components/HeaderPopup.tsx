import { List, Popover as PopoverMUI } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'
import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'

import { getUuidv4 } from '@utils/common'

interface HeaderPopupProps {
    popoverAnchor: Element
    handlePopoverClose: () => void
    popoverItems: any[]
}

const HeaderPopup = (props: HeaderPopupProps) => {
    const { popoverAnchor, handlePopoverClose, popoverItems } = props

    const navigate = useNavigate()

    return (
        <PopoverMUI
            open={Boolean(popoverAnchor)}
            anchorEl={popoverAnchor}
            onClose={handlePopoverClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <List>
                {popoverItems.map(({ icon: IconComponent, title, path }) => (
                    <ItemWrapper key={getUuidv4()}>
                        <ItemWrapperWrapper
                            to={`/${path}`}
                            onClick={() => {
                                handlePopoverClose()
                            }}
                        >
                            {IconComponent && (
                                <IconComponent
                                    sx={{
                                        display: 'flex',
                                        fontSize: '20px',
                                        color: '#000',
                                    }}
                                />
                            )}
                            <StyledListItemText primary={title} />
                        </ItemWrapperWrapper>
                    </ItemWrapper>
                ))}
            </List>
        </PopoverMUI>
    )
}

export default HeaderPopup

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

const ItemWrapperWrapper = styled(Link)`
    text-decoration: none;
    flex-direction: row;
    display: flex;
    width: 100%;
    gap: 6px;
    align-items: center;
`

const StyledListItemText = styled(ListItemText)`
    color: #000000;
`
