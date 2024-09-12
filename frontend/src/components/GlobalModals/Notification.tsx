import { Alert, AlertProps, AlertTitle, Snackbar } from '@mui/material'
import React, { useEffect } from 'react'
import styled from 'styled-components'

import { NotificationProps } from './types'

interface StyledAlertProps extends AlertProps {
    customSeverity: 'success' | 'info' | 'warning' | 'error' // Add more variants as needed
}

export function Notification({ title, description, timeout, variant, color, onClose, ...props }: NotificationProps) {
    useEffect(() => {
        if (timeout) {
            setTimeout(() => onClose(), timeout)
        }
    }, [])

    return (
        <StyledSnackbar
            open
            {...props}
            onClose={onClose}
            color={color}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <StyledAlert
                variant={variant}
                severity={color}
                color={color}
                customSeverity={color as StyledAlertProps['customSeverity']}
            >
                <AlertTitle>{title}</AlertTitle>
                <AlertBody>{description}</AlertBody>
            </StyledAlert>
        </StyledSnackbar>
    )
}

const StyledSnackbar = styled(Snackbar)`
    && {
        margin-bottom: 16px;
        position: static;

        border-radius: 4px;
    }
`

const StyledAlert = styled(Alert)<StyledAlertProps>`
    min-width: 288px;
    max-width: 450px;
    color: #000000;

    background-color: ${({ customSeverity }) => {
        switch (customSeverity) {
            case 'success':
                return '#E8F5E9' // success - зеленый
            case 'error':
                return '#FEEBEE' // error - красный
            case 'warning':
                return '#FFF3E0' // warning - желтый
            case 'info':
                return '#E1F5FE' // info - голубой
            default:
                return '#E1F5FE' // такой же, как для info
        }
    }};

    .MuiAlert-icon {
        color: ${({ customSeverity }) => {
            let iconColor

            switch (customSeverity) {
                case 'success':
                    iconColor = '#43A047' // success - зеленый

                    break
                case 'error':
                    iconColor = '#E53935' // error - красный

                    break
                case 'warning':
                    iconColor = '#ED6C02' // warning - желтый

                    break
                case 'info':
                    iconColor = '#0288D1' // info - голубой

                    break
                default:
                    iconColor = '#000000' // такой же, как для info
            }

            return iconColor
        }};
    }
`

const AlertBody = styled.div`
    font-weight: 400;
`
