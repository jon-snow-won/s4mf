import { ApiErrorMessage } from '@services/ApiService.types'
import { parseJson } from '@utils/parseJson'

import { ApiError, AuthError } from './errors'

const AUTH_ERROR_STATUSES = new Set([401, 403])

export const checkApiError = (response: Response) => {
    const { status } = response

    // if status 4xx
    if (status >= 400 && status < 500 && !AUTH_ERROR_STATUSES.has(status)) {
        throw new ApiError({ status, message: ApiErrorMessage.client })
    }
    // if status 5xx
    if (status >= 500) {
        throw new ApiError({ status, message: ApiErrorMessage.server })
    }
    // if status 401 or 403
    if (AUTH_ERROR_STATUSES.has(status)) {
        throw new AuthError({ status, message: ApiErrorMessage.auth })
    }
}

export const handleApiError = async (response: Response) => {
    checkApiError(response)
    // checks body type is JSON
    try {
        const value = (await response?.json()) || (await response?.text())

        return parseJson(value)
    } catch (e) {
        return null
    }
}
