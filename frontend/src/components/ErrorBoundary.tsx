import React, { Component, ErrorInfo, ReactNode } from 'react'

import { ErrorPage } from '@pages/ErrorPage'

interface ErrorBoundaryProps {
    children: ReactNode
    path?: string
    errors?: Error
    clearError?: () => void
}

interface ErrorBoundaryState {
    hasError: boolean
    errorText?: string
    previousPath?: string
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)

        this.state = {
            hasError: false,
            errorText: '',
            previousPath: props.path,
        }
    }

    static getDerivedStateFromProps(
        props: ErrorBoundaryProps,
        state: ErrorBoundaryState,
    ): Partial<ErrorBoundaryState> | null {
        const { path, errors, clearError } = props
        const { hasError, previousPath } = state

        const isPathChanged = path !== previousPath

        if (errors && isPathChanged && clearError) {
            clearError()
        }

        if (isPathChanged) {
            return {
                hasError: false,
                previousPath: path,
            }
        }

        return null
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(error, errorInfo)

        this.setState({ hasError: true, errorText: error.message })
    }

    render() {
        const { hasError, errorText } = this.state

        if (hasError) {
            return <ErrorPage errorMessage={errorText} errorTitle="Возникла ошибка !" errorPhone="8800######7" />
        }

        const { children } = this.props

        return children
    }
}
