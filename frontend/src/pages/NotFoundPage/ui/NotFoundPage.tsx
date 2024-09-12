import React from 'react'
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone'
import { Typography } from '@mui/material'
import styled from 'styled-components'
import { MainLayout } from '@s4mf/uikit'

import { NotFoundImage } from '@assets/NotFoundImage'

interface NotFoundPageProps {
    errorPhone: string
}

export default function NotFoundPage({ errorPhone }: NotFoundPageProps) {
    return (
        <NoyFoundLayout>
            <NotFoundContainer>
                <NotFoundWrapper>
                    <NotFoundImage />
                    <NotFoundText typography="p">
                        Извините, этой страницы не существует,
                        <br />
                        вы можете связаться со службой поддержки по телефону
                    </NotFoundText>
                    <NotFoundPhoneContainer>
                        <PhoneIphoneIcon color="primary" fontSize="small" />
                        <NotFoundPhoneText href={`tel:${errorPhone}`}>{errorPhone}</NotFoundPhoneText>
                    </NotFoundPhoneContainer>
                </NotFoundWrapper>
            </NotFoundContainer>
        </NoyFoundLayout>
    )
}

const NoyFoundLayout = styled(MainLayout)`
    width: 100%;
    height: 100%;
`

const NotFoundContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`

const NotFoundWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    width: 469px;
    text-align: center;
`

const NotFoundText = styled(Typography)`
    font-family: Roboto, sans-serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: 0.15px;
`

const NotFoundPhoneContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`

const NotFoundPhoneText = styled.a`
    font-family: Roboto, sans-serif;
    font-size: 20px;
    font-weight: 500;
    line-height: 32px;
    letter-spacing: 0.15px;
    text-decoration-line: underline;
    color: #546e7a;
`
