import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'

import { ConfirmProps } from './types'

// ДЕЛО: Я не проверял, не тестировал, не стилизовал этот компонент

export function Confirm({ id, title, description, onConfirm, ...props }: ConfirmProps) {
    const handleConfirm: React.MouseEventHandler = () => {
        if (typeof onConfirm === 'function') {
            onConfirm()
        }

        props.onClose()
    }

    return (
        <Dialog {...props} open>
            {title ? <DialogTitle>{title}</DialogTitle> : null}

            {description ? <DialogContent>{description}</DialogContent> : null}

            <DialogActions>
                <Button variant="text" onClick={handleConfirm}>
                    Да
                </Button>
                <Button onClick={props.onClose}>Нет</Button>
            </DialogActions>
        </Dialog>
    )
}
