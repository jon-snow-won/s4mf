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
 * @interface PageMetaDto
 */
export interface PageMetaDto {
    /**
     *
     * @type {number}
     * @memberof PageMetaDto
     */
    page: number
    /**
     *
     * @type {number}
     * @memberof PageMetaDto
     */
    take: number
    /**
     *
     * @type {number}
     * @memberof PageMetaDto
     */
    itemCount: number
    /**
     *
     * @type {number}
     * @memberof PageMetaDto
     */
    pageCount: number
    /**
     *
     * @type {boolean}
     * @memberof PageMetaDto
     */
    hasPreviousPage: boolean
    /**
     *
     * @type {boolean}
     * @memberof PageMetaDto
     */
    hasNextPage: boolean
}

/**
 * Check if a given object implements the PageMetaDto interface.
 */
export function instanceOfPageMetaDto(value: object): boolean {
    if (!('page' in value)) return false
    if (!('take' in value)) return false
    if (!('itemCount' in value)) return false
    if (!('pageCount' in value)) return false
    if (!('hasPreviousPage' in value)) return false
    if (!('hasNextPage' in value)) return false
    return true
}

export function PageMetaDtoFromJSON(json: any): PageMetaDto {
    return PageMetaDtoFromJSONTyped(json, false)
}

export function PageMetaDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PageMetaDto {
    if (json == null) {
        return json
    }
    return {
        page: json['page'],
        take: json['take'],
        itemCount: json['itemCount'],
        pageCount: json['pageCount'],
        hasPreviousPage: json['hasPreviousPage'],
        hasNextPage: json['hasNextPage'],
    }
}

export function PageMetaDtoToJSON(value?: PageMetaDto | null): any {
    if (value == null) {
        return value
    }
    return {
        page: value['page'],
        take: value['take'],
        itemCount: value['itemCount'],
        pageCount: value['pageCount'],
        hasPreviousPage: value['hasPreviousPage'],
        hasNextPage: value['hasNextPage'],
    }
}
