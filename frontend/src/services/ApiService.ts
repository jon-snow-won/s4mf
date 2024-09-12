import Keycloak from 'keycloak-js'

import { envConfigByManifestVersionService } from '@hooks/useManifestVersion'
import { keycloakClient } from '@utils/keycloak'

interface IHeaders {
    [key: string]: string
}

interface IApiServiceProps {
    baseUrl: string
    headers?: IHeaders
}

interface IRequestParams {
    method?: string
    url: string
    data?: Record<string, any>
    headers?: Record<string, any>
}

const DEFAULT_HEADERS: IHeaders = {}

const obj2qs = (data: Record<string, any>) => {
    const normalizedData = Object.entries(data).reduce(
        (memo, [key, value]) => (value === undefined ? memo : { ...memo, [key]: value }),
        {} as Record<string, any>,
    )
    const searchParams = new URLSearchParams(normalizedData)

    return searchParams.toString()
}

export class ApiService {
    private readonly authClient: Keycloak = keycloakClient

    private readonly headers: IHeaders = {}

    private readonly baseUrl: string

    constructor({ baseUrl, headers = {} }: IApiServiceProps) {
        this.baseUrl = baseUrl
        this.headers = { ...DEFAULT_HEADERS, ...headers }
    }

    protected get token() {
        return this.authClient?.token
    }

    protected async request({ method = 'GET', url, data, headers = {} }: IRequestParams): Promise<Response> {
        let body
        let fullUrl = this.baseUrl + url
        let queryString = ''

        if (envConfigByManifestVersionService.IS_AUTH && this.token) {
            // eslint-disable-next-line no-param-reassign
            headers.Authorization = `Bearer ${this.token}`
        }

        switch (method) {
            case 'POST':
            case 'PUT':
            case 'PATCH':
                body = JSON.stringify(data)
                // eslint-disable-next-line no-param-reassign
                headers['content-type'] = 'application/json'

                break

            case 'GET':
                queryString = data ? obj2qs(data) : ''
                fullUrl = `${fullUrl}?${queryString}`

                break
            default:
                if (data) {
                    fullUrl += `?${obj2qs(data)}`
                }
        }

        return fetch(fullUrl, {
            method,
            headers: { ...this.headers, ...headers },
            body,
        })
    }
}
