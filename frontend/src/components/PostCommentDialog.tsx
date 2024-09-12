import {
    Breakpoint,
    Button,
    ButtonProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FilledInput,
    FormControl,
} from '@mui/material'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

interface PostCommentDialogProps {
    open: boolean
    onClose: () => void
    onSubmit: (value: any) => void
    maxWidth?: Breakpoint | false
}

const PostCommentDialog = (props: PostCommentDialogProps) => {
    const { open, onClose, onSubmit, maxWidth = 'md' } = props

    const [comment, setComment] = useState('')

    const onCloseDialog = () => {
        setComment('')
        onClose()
    }

    const onSubmitDialog = (value: any) => {
        setComment('')
        onSubmit(value)
    }

    const onEscapeKeyPress = useCallback((evt: KeyboardEvent) => {
        if (evt.key === 'Escape') {
            onCloseDialog()
        }
    }, [])

    useEffect(() => {
        if (!open) {
            document.removeEventListener('keydown', onEscapeKeyPress)

            return
        }

        document.addEventListener('keydown', onEscapeKeyPress)

        return () => {
            document.removeEventListener('keydown', onEscapeKeyPress)
        }
    }, [open])

    return (
        <Dialog onClose={onCloseDialog} open={open} maxWidth={maxWidth}>
            <DialogTitle style={{ width: '444px' }} id="alert-dialog-title">
                Добавление комментария
            </DialogTitle>
            <DialogContent>
                <FormControl fullWidth size="small">
                    <FilledInput
                        autoFocus
                        multiline
                        minRows={8}
                        maxRows={10}
                        placeholder="Введите"
                        value={comment}
                        onChange={(evt: ChangeEvent<HTMLTextAreaElement>) => {
                            setComment(evt.target.value)
                        }}
                        style={{ width: '100%' }}
                        inputProps={{ maxLength: 500 }}
                        sx={{
                            '&.MuiFilledInput-root::before': {
                                borderBottom: 'none', // Set your desired style here
                                content: '""', // Ensure content is set to trigger the ::after pseudo-element
                            },
                            '&.MuiFilledInput-root:hover::before': {
                                borderBottom: 'none', // Set your desired style here
                                content: '""', // Ensure content is set to trigger the ::after pseudo-element
                            },
                        }}
                    />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <StyledButton onClick={onCloseDialog}>Отмена</StyledButton>
                <StyledButton
                    variant="outlined"
                    onClick={() => {
                        if (comment.trim()) {
                            onSubmitDialog(comment)
                        }
                    }}
                >
                    Сохранить
                </StyledButton>
            </DialogActions>
        </Dialog>
    )
}

export default React.memo(PostCommentDialog)

const StyledButton = styled((props: ButtonProps) => <Button {...props} />)(({ theme }) => ({
    maxHeight: '32px',
    flexShrink: 0,
}))
