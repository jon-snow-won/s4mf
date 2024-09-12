import React from 'react'
import { Box, CircularProgress, Container } from '@mui/material'

export default function AuthLoader() {
    return (
        <Container>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />

                <p>Идет авторизация в приложении...</p>
            </Box>
        </Container>
    )
}
