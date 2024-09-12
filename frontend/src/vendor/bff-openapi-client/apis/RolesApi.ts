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
import type { Role } from '../models/index'
import { RoleFromJSON, RoleToJSON } from '../models/index'

/**
 *
 */
export class RolesApi extends runtime.BaseAPI {
    /**
     * Get all roles
     */
    async rolesControllerGetRolesRaw(
        initOverrides?: RequestInit | runtime.InitOverrideFunction,
    ): Promise<runtime.ApiResponse<Array<Role>>> {
        const queryParameters: any = {}

        const headerParameters: runtime.HTTPHeaders = {}

        const response = await this.request(
            {
                path: `/api/roles`,
                method: 'GET',
                headers: headerParameters,
                query: queryParameters,
            },
            initOverrides,
        )

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(RoleFromJSON))
    }

    /**
     * Get all roles
     */
    async rolesControllerGetRoles(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Role>> {
        const response = await this.rolesControllerGetRolesRaw(initOverrides)
        return await response.value()
    }
}
