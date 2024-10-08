/* tslint:disable */
/* eslint-disable */
/**
 * El Aggregate BFF
 * Бэкенд для федеративного приложения
 *
 * The version of the OpenAPI document: 0.9.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import * as runtime from '../runtime'
import type {
    ConflictResourceException,
    CreateServiceDto,
    DetailedBadRequestException,
    DetailedNotFoundException,
    Service,
    ServicesControllerFindAll200Response,
    UpdateServiceDto,
} from '../models/index'
import {
    ConflictResourceExceptionFromJSON,
    ConflictResourceExceptionToJSON,
    CreateServiceDtoFromJSON,
    CreateServiceDtoToJSON,
    DetailedBadRequestExceptionFromJSON,
    DetailedBadRequestExceptionToJSON,
    DetailedNotFoundExceptionFromJSON,
    DetailedNotFoundExceptionToJSON,
    ServiceFromJSON,
    ServiceToJSON,
    ServicesControllerFindAll200ResponseFromJSON,
    ServicesControllerFindAll200ResponseToJSON,
    UpdateServiceDtoFromJSON,
    UpdateServiceDtoToJSON,
} from '../models/index'

export interface ServicesControllerCreateRequest {
    createServiceDto: CreateServiceDto
}

export interface ServicesControllerFindAllRequest {
    order?: ServicesControllerFindAllOrderEnum
    page?: number
    take?: number
    populateAll?: boolean
    populateItems?: string
    withDeleted?: boolean
    minimalFields?: boolean
}

export interface ServicesControllerFindOneRequest {
    id: string
    populateAll?: boolean
    populateItems?: string
    minimalFields?: boolean
}

export interface ServicesControllerFindRevisionsRequest {
    id: string
    order?: ServicesControllerFindRevisionsOrderEnum
    page?: number
    take?: number
    populateAll?: boolean
    populateItems?: string
    withDeleted?: boolean
    minimalFields?: boolean
}

export interface ServicesControllerGetRevisionRequest {
    id: string
    revision: string
    populateAll?: boolean
    populateItems?: string
    minimalFields?: boolean
}

export interface ServicesControllerRemoveRequest {
    id: string
    isHardDelete: boolean
}

export interface ServicesControllerRestoreRequest {
    id: string
}

export interface ServicesControllerUpdateRequest {
    id: string
    toReplace: boolean
    updateServiceDto: UpdateServiceDto
}

/**
 *
 */
export class ServicesApi extends runtime.BaseAPI {
    /**
     * Create service
     */
    async servicesControllerCreateRaw(
        requestParameters: ServicesControllerCreateRequest,
        initOverrides?: RequestInit | runtime.InitOverrideFunction,
    ): Promise<runtime.ApiResponse<Service>> {
        if (requestParameters['createServiceDto'] == null) {
            throw new runtime.RequiredError(
                'createServiceDto',
                'Required parameter "createServiceDto" was null or undefined when calling servicesControllerCreate().',
            )
        }

        const queryParameters: any = {}

        const headerParameters: runtime.HTTPHeaders = {}

        headerParameters['Content-Type'] = 'application/json'

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken
            const tokenString = await token('bearer', [])

            if (tokenString) {
                headerParameters['Authorization'] = `Bearer ${tokenString}`
            }
        }
        const response = await this.request(
            {
                path: `/api/services`,
                method: 'POST',
                headers: headerParameters,
                query: queryParameters,
                body: CreateServiceDtoToJSON(requestParameters['createServiceDto']),
            },
            initOverrides,
        )

        return new runtime.JSONApiResponse(response, (jsonValue) => ServiceFromJSON(jsonValue))
    }

    /**
     * Create service
     */
    async servicesControllerCreate(
        requestParameters: ServicesControllerCreateRequest,
        initOverrides?: RequestInit | runtime.InitOverrideFunction,
    ): Promise<Service> {
        const response = await this.servicesControllerCreateRaw(requestParameters, initOverrides)
        return await response.value()
    }

    /**
     * Get all services
     */
    async servicesControllerFindAllRaw(
        requestParameters: ServicesControllerFindAllRequest,
        initOverrides?: RequestInit | runtime.InitOverrideFunction,
    ): Promise<runtime.ApiResponse<ServicesControllerFindAll200Response>> {
        const queryParameters: any = {}

        if (requestParameters['order'] != null) {
            queryParameters['order'] = requestParameters['order']
        }

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page']
        }

        if (requestParameters['take'] != null) {
            queryParameters['take'] = requestParameters['take']
        }

        if (requestParameters['populateAll'] != null) {
            queryParameters['populateAll'] = requestParameters['populateAll']
        }

        if (requestParameters['populateItems'] != null) {
            queryParameters['populateItems'] = requestParameters['populateItems']
        }

        if (requestParameters['withDeleted'] != null) {
            queryParameters['withDeleted'] = requestParameters['withDeleted']
        }

        if (requestParameters['minimalFields'] != null) {
            queryParameters['minimalFields'] = requestParameters['minimalFields']
        }

        const headerParameters: runtime.HTTPHeaders = {}

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken
            const tokenString = await token('bearer', [])

            if (tokenString) {
                headerParameters['Authorization'] = `Bearer ${tokenString}`
            }
        }
        const response = await this.request(
            {
                path: `/api/services`,
                method: 'GET',
                headers: headerParameters,
                query: queryParameters,
            },
            initOverrides,
        )

        return new runtime.JSONApiResponse(response, (jsonValue) =>
            ServicesControllerFindAll200ResponseFromJSON(jsonValue),
        )
    }

    /**
     * Get all services
     */
    async servicesControllerFindAll(
        requestParameters: ServicesControllerFindAllRequest = {},
        initOverrides?: RequestInit | runtime.InitOverrideFunction,
    ): Promise<ServicesControllerFindAll200Response> {
        const response = await this.servicesControllerFindAllRaw(requestParameters, initOverrides)
        return await response.value()
    }

    /**
     * Get one service
     */
    async servicesControllerFindOneRaw(
        requestParameters: ServicesControllerFindOneRequest,
        initOverrides?: RequestInit | runtime.InitOverrideFunction,
    ): Promise<runtime.ApiResponse<Service>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling servicesControllerFindOne().',
            )
        }

        const queryParameters: any = {}

        if (requestParameters['populateAll'] != null) {
            queryParameters['populateAll'] = requestParameters['populateAll']
        }

        if (requestParameters['populateItems'] != null) {
            queryParameters['populateItems'] = requestParameters['populateItems']
        }

        if (requestParameters['minimalFields'] != null) {
            queryParameters['minimalFields'] = requestParameters['minimalFields']
        }

        const headerParameters: runtime.HTTPHeaders = {}

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken
            const tokenString = await token('bearer', [])

            if (tokenString) {
                headerParameters['Authorization'] = `Bearer ${tokenString}`
            }
        }
        const response = await this.request(
            {
                path: `/api/services/{id}`.replace(`{${'id'}}`, encodeURIComponent(String(requestParameters['id']))),
                method: 'GET',
                headers: headerParameters,
                query: queryParameters,
            },
            initOverrides,
        )

        return new runtime.JSONApiResponse(response, (jsonValue) => ServiceFromJSON(jsonValue))
    }

    /**
     * Get one service
     */
    async servicesControllerFindOne(
        requestParameters: ServicesControllerFindOneRequest,
        initOverrides?: RequestInit | runtime.InitOverrideFunction,
    ): Promise<Service> {
        const response = await this.servicesControllerFindOneRaw(requestParameters, initOverrides)
        return await response.value()
    }

    /**
     * Get all service revisions
     */
    async servicesControllerFindRevisionsRaw(
        requestParameters: ServicesControllerFindRevisionsRequest,
        initOverrides?: RequestInit | runtime.InitOverrideFunction,
    ): Promise<runtime.ApiResponse<ServicesControllerFindAll200Response>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling servicesControllerFindRevisions().',
            )
        }

        const queryParameters: any = {}

        if (requestParameters['order'] != null) {
            queryParameters['order'] = requestParameters['order']
        }

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page']
        }

        if (requestParameters['take'] != null) {
            queryParameters['take'] = requestParameters['take']
        }

        if (requestParameters['populateAll'] != null) {
            queryParameters['populateAll'] = requestParameters['populateAll']
        }

        if (requestParameters['populateItems'] != null) {
            queryParameters['populateItems'] = requestParameters['populateItems']
        }

        if (requestParameters['withDeleted'] != null) {
            queryParameters['withDeleted'] = requestParameters['withDeleted']
        }

        if (requestParameters['minimalFields'] != null) {
            queryParameters['minimalFields'] = requestParameters['minimalFields']
        }

        const headerParameters: runtime.HTTPHeaders = {}

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken
            const tokenString = await token('bearer', [])

            if (tokenString) {
                headerParameters['Authorization'] = `Bearer ${tokenString}`
            }
        }
        const response = await this.request(
            {
                path: `/api/services/{id}/revisions`.replace(
                    `{${'id'}}`,
                    encodeURIComponent(String(requestParameters['id'])),
                ),
                method: 'GET',
                headers: headerParameters,
                query: queryParameters,
            },
            initOverrides,
        )

        return new runtime.JSONApiResponse(response, (jsonValue) =>
            ServicesControllerFindAll200ResponseFromJSON(jsonValue),
        )
    }

    /**
     * Get all service revisions
     */
    async servicesControllerFindRevisions(
        requestParameters: ServicesControllerFindRevisionsRequest,
        initOverrides?: RequestInit | runtime.InitOverrideFunction,
    ): Promise<ServicesControllerFindAll200Response> {
        const response = await this.servicesControllerFindRevisionsRaw(requestParameters, initOverrides)
        return await response.value()
    }

    /**
     * Get one service revision
     */
    async servicesControllerGetRevisionRaw(
        requestParameters: ServicesControllerGetRevisionRequest,
        initOverrides?: RequestInit | runtime.InitOverrideFunction,
    ): Promise<runtime.ApiResponse<Service>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling servicesControllerGetRevision().',
            )
        }

        if (requestParameters['revision'] == null) {
            throw new runtime.RequiredError(
                'revision',
                'Required parameter "revision" was null or undefined when calling servicesControllerGetRevision().',
            )
        }

        const queryParameters: any = {}

        if (requestParameters['populateAll'] != null) {
            queryParameters['populateAll'] = requestParameters['populateAll']
        }

        if (requestParameters['populateItems'] != null) {
            queryParameters['populateItems'] = requestParameters['populateItems']
        }

        if (requestParameters['minimalFields'] != null) {
            queryParameters['minimalFields'] = requestParameters['minimalFields']
        }

        const headerParameters: runtime.HTTPHeaders = {}

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken
            const tokenString = await token('bearer', [])

            if (tokenString) {
                headerParameters['Authorization'] = `Bearer ${tokenString}`
            }
        }
        const response = await this.request(
            {
                path: `/api/services/{id}/revisions/{revision}`
                    .replace(`{${'id'}}`, encodeURIComponent(String(requestParameters['id'])))
                    .replace(`{${'revision'}}`, encodeURIComponent(String(requestParameters['revision']))),
                method: 'GET',
                headers: headerParameters,
                query: queryParameters,
            },
            initOverrides,
        )

        return new runtime.JSONApiResponse(response, (jsonValue) => ServiceFromJSON(jsonValue))
    }

    /**
     * Get one service revision
     */
    async servicesControllerGetRevision(
        requestParameters: ServicesControllerGetRevisionRequest,
        initOverrides?: RequestInit | runtime.InitOverrideFunction,
    ): Promise<Service> {
        const response = await this.servicesControllerGetRevisionRaw(requestParameters, initOverrides)
        return await response.value()
    }

    /**
     * Delete service
     */
    async servicesControllerRemoveRaw(
        requestParameters: ServicesControllerRemoveRequest,
        initOverrides?: RequestInit | runtime.InitOverrideFunction,
    ): Promise<runtime.ApiResponse<Service>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling servicesControllerRemove().',
            )
        }

        if (requestParameters['isHardDelete'] == null) {
            throw new runtime.RequiredError(
                'isHardDelete',
                'Required parameter "isHardDelete" was null or undefined when calling servicesControllerRemove().',
            )
        }

        const queryParameters: any = {}

        if (requestParameters['isHardDelete'] != null) {
            queryParameters['isHardDelete'] = requestParameters['isHardDelete']
        }

        const headerParameters: runtime.HTTPHeaders = {}

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken
            const tokenString = await token('bearer', [])

            if (tokenString) {
                headerParameters['Authorization'] = `Bearer ${tokenString}`
            }
        }
        const response = await this.request(
            {
                path: `/api/services/{id}`.replace(`{${'id'}}`, encodeURIComponent(String(requestParameters['id']))),
                method: 'DELETE',
                headers: headerParameters,
                query: queryParameters,
            },
            initOverrides,
        )

        return new runtime.JSONApiResponse(response, (jsonValue) => ServiceFromJSON(jsonValue))
    }

    /**
     * Delete service
     */
    async servicesControllerRemove(
        requestParameters: ServicesControllerRemoveRequest,
        initOverrides?: RequestInit | runtime.InitOverrideFunction,
    ): Promise<Service> {
        const response = await this.servicesControllerRemoveRaw(requestParameters, initOverrides)
        return await response.value()
    }

    /**
     * Restore service
     */
    async servicesControllerRestoreRaw(
        requestParameters: ServicesControllerRestoreRequest,
        initOverrides?: RequestInit | runtime.InitOverrideFunction,
    ): Promise<runtime.ApiResponse<Service>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling servicesControllerRestore().',
            )
        }

        const queryParameters: any = {}

        const headerParameters: runtime.HTTPHeaders = {}

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken
            const tokenString = await token('bearer', [])

            if (tokenString) {
                headerParameters['Authorization'] = `Bearer ${tokenString}`
            }
        }
        const response = await this.request(
            {
                path: `/api/services/{id}/restore`.replace(
                    `{${'id'}}`,
                    encodeURIComponent(String(requestParameters['id'])),
                ),
                method: 'POST',
                headers: headerParameters,
                query: queryParameters,
            },
            initOverrides,
        )

        return new runtime.JSONApiResponse(response, (jsonValue) => ServiceFromJSON(jsonValue))
    }

    /**
     * Restore service
     */
    async servicesControllerRestore(
        requestParameters: ServicesControllerRestoreRequest,
        initOverrides?: RequestInit | runtime.InitOverrideFunction,
    ): Promise<Service> {
        const response = await this.servicesControllerRestoreRaw(requestParameters, initOverrides)
        return await response.value()
    }

    /**
     * Update service
     */
    async servicesControllerUpdateRaw(
        requestParameters: ServicesControllerUpdateRequest,
        initOverrides?: RequestInit | runtime.InitOverrideFunction,
    ): Promise<runtime.ApiResponse<Service>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
                'id',
                'Required parameter "id" was null or undefined when calling servicesControllerUpdate().',
            )
        }

        if (requestParameters['toReplace'] == null) {
            throw new runtime.RequiredError(
                'toReplace',
                'Required parameter "toReplace" was null or undefined when calling servicesControllerUpdate().',
            )
        }

        if (requestParameters['updateServiceDto'] == null) {
            throw new runtime.RequiredError(
                'updateServiceDto',
                'Required parameter "updateServiceDto" was null or undefined when calling servicesControllerUpdate().',
            )
        }

        const queryParameters: any = {}

        if (requestParameters['toReplace'] != null) {
            queryParameters['toReplace'] = requestParameters['toReplace']
        }

        const headerParameters: runtime.HTTPHeaders = {}

        headerParameters['Content-Type'] = 'application/json'

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken
            const tokenString = await token('bearer', [])

            if (tokenString) {
                headerParameters['Authorization'] = `Bearer ${tokenString}`
            }
        }
        const response = await this.request(
            {
                path: `/api/services/{id}`.replace(`{${'id'}}`, encodeURIComponent(String(requestParameters['id']))),
                method: 'PATCH',
                headers: headerParameters,
                query: queryParameters,
                body: UpdateServiceDtoToJSON(requestParameters['updateServiceDto']),
            },
            initOverrides,
        )

        return new runtime.JSONApiResponse(response, (jsonValue) => ServiceFromJSON(jsonValue))
    }

    /**
     * Update service
     */
    async servicesControllerUpdate(
        requestParameters: ServicesControllerUpdateRequest,
        initOverrides?: RequestInit | runtime.InitOverrideFunction,
    ): Promise<Service> {
        const response = await this.servicesControllerUpdateRaw(requestParameters, initOverrides)
        return await response.value()
    }
}

/**
 * @export
 */
export const ServicesControllerFindAllOrderEnum = {
    Asc: 'ASC',
    Desc: 'DESC',
} as const
export type ServicesControllerFindAllOrderEnum =
    (typeof ServicesControllerFindAllOrderEnum)[keyof typeof ServicesControllerFindAllOrderEnum]
/**
 * @export
 */
export const ServicesControllerFindRevisionsOrderEnum = {
    Asc: 'ASC',
    Desc: 'DESC',
} as const
export type ServicesControllerFindRevisionsOrderEnum =
    (typeof ServicesControllerFindRevisionsOrderEnum)[keyof typeof ServicesControllerFindRevisionsOrderEnum]
