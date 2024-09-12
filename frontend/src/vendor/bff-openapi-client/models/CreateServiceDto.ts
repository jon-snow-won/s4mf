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

import { mapValues } from '../runtime'
/**
 *
 * @export
 * @interface CreateServiceDto
 */
export interface CreateServiceDto {
    /**
     *
     * @type {number}
     * @memberof CreateServiceDto
     */
    type: number
    /**
     *
     * @type {Array<number>}
     * @memberof CreateServiceDto
     */
    roles: Array<number>
    /**
     *
     * @type {Array<number>}
     * @memberof CreateServiceDto
     */
    settings: Array<number>
    /**
     *
     * @type {Array<number>}
     * @memberof CreateServiceDto
     */
    descendants?: Array<number>
    /**
     *
     * @type {string}
     * @memberof CreateServiceDto
     */
    name: string
    /**
     *
     * @type {string}
     * @memberof CreateServiceDto
     */
    description: string
}

/**
 * Check if a given object implements the CreateServiceDto interface.
 */
export function instanceOfCreateServiceDto(value: object): boolean {
    if (!('type' in value)) return false
    if (!('roles' in value)) return false
    if (!('settings' in value)) return false
    if (!('name' in value)) return false
    if (!('description' in value)) return false
    return true
}

export function CreateServiceDtoFromJSON(json: any): CreateServiceDto {
    return CreateServiceDtoFromJSONTyped(json, false)
}

export function CreateServiceDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateServiceDto {
    if (json == null) {
        return json
    }
    return {
        type: json['type'],
        roles: json['roles'],
        settings: json['settings'],
        descendants: json['descendants'] == null ? undefined : json['descendants'],
        name: json['name'],
        description: json['description'],
    }
}

export function CreateServiceDtoToJSON(value?: CreateServiceDto | null): any {
    if (value == null) {
        return value
    }
    return {
        type: value['type'],
        roles: value['roles'],
        settings: value['settings'],
        descendants: value['descendants'],
        name: value['name'],
        description: value['description'],
    }
}
