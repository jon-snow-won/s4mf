import styled from '@emotion/styled'
import { MainLayout } from '@s4mf/uikit'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import { Typography } from '@mui/material'
import React from 'react'

interface PageErrorProps {
    errorMessage?: string
    errorPhone: string
    errorTitle: string
}

export default function ErrorPage({ errorPhone, errorMessage, errorTitle }: PageErrorProps) {
    return (
        <ErrorLayout>
            <ErrorContainer>
                <ErrorWrapper>
                    <ErrorTitle typography="h4">{errorTitle}</ErrorTitle>

                    <ErrorText typography="p">
                        Извините, на данный момент страница недоступна.
                        <br />
                        Вы можете связаться со службой поддержки по телефону
                    </ErrorText>

                    <ErrorPhoneContainer>
                        <PhoneIphoneIcon color="primary" fontSize="small" />
                        <ErrorPhoneText href={`tel:${errorPhone}`}>{errorPhone}</ErrorPhoneText>
                    </ErrorPhoneContainer>
                    {errorMessage && <Typography typography="p">ERROR: {errorMessage}</Typography>}
                </ErrorWrapper>
            </ErrorContainer>
        </ErrorLayout>
    )
}

const ErrorLayout = styled(MainLayout)`
    width: 100%;
    height: 100%;
`

const ErrorContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`

const ErrorWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    width: 469px;
    text-align: center;
`

const ErrorTitle = styled(Typography)`
    font-family: Roboto, sans-serif;
    font-size: 34px;
    font-weight: 400;
    line-height: 42px;
    letter-spacing: 0.25px;
`

const ErrorText = styled(Typography)`
    font-family: Roboto, sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 0.15px;
`

const ErrorPhoneContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`

const ErrorPhoneText = styled.a`
    font-family: Roboto, sans-serif;
    font-size: 20px;
    font-weight: 500;
    line-height: 32px;
    letter-spacing: 0.15px;
    text-decoration-line: underline;
    color: #546e7a;
`
