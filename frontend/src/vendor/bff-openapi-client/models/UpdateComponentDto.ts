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
 * @interface UpdateComponentDto
 */
export interface UpdateComponentDto {
    /**
     * Description of component
     * @type {string}
     * @memberof UpdateComponentDto
     */
    description: string
}

/**
 * Check if a given object implements the UpdateComponentDto interface.
 */
export function instanceOfUpdateComponentDto(value: object): boolean {
    if (!('description' in value)) return false
    return true
}

export function UpdateComponentDtoFromJSON(json: any): UpdateComponentDto {
    return UpdateComponentDtoFromJSONTyped(json, false)
}

export function UpdateComponentDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): UpdateComponentDto {
    if (json == null) {
        return json
    }
    return {
        description: json['description'],
    }
}

export function UpdateComponentDtoToJSON(value?: UpdateComponentDto | null): any {
    if (value == null) {
        return value
    }
    return {
        description: value['description'],
    }
}
