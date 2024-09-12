import { MedkitCssBaseline } from '@s4mf/uikit'
import React from 'react'
import ReactDOM from 'react-dom/client'

import AppContainer from './AppContainer'

import './root.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <>
        <MedkitCssBaseline />
        <AppContainer />
    </>,
)
