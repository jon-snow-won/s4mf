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
import type { Component } from './Component'
import { ComponentFromJSON, ComponentFromJSONTyped, ComponentToJSON } from './Component'
import type { PageMetaDto } from './PageMetaDto'
import { PageMetaDtoFromJSON, PageMetaDtoFromJSONTyped, PageMetaDtoToJSON } from './PageMetaDto'

/**
 *
 * @export
 * @interface ComponentsControllerFindAll200Response
 */
export interface ComponentsControllerFindAll200Response {
    /**
     *
     * @type {Array<Component>}
     * @memberof ComponentsControllerFindAll200Response
     */
    data: Array<Component>
    /**
     *
     * @type {PageMetaDto}
     * @memberof ComponentsControllerFindAll200Response
     */
    meta: PageMetaDto
}

/**
 * Check if a given object implements the ComponentsControllerFindAll200Response interface.
 */
export function instanceOfComponentsControllerFindAll200Response(value: object): boolean {
    if (!('data' in value)) return false
    if (!('meta' in value)) return false
    return true
}

export function ComponentsControllerFindAll200ResponseFromJSON(json: any): ComponentsControllerFindAll200Response {
    return ComponentsControllerFindAll200ResponseFromJSONTyped(json, false)
}

export function ComponentsControllerFindAll200ResponseFromJSONTyped(
    json: any,
    ignoreDiscriminator: boolean,
): ComponentsControllerFindAll200Response {
    if (json == null) {
        return json
    }
    return {
        data: (json['data'] as Array<any>)?.map(ComponentFromJSON),
        meta: PageMetaDtoFromJSON(json['meta']),
    }
}

export function ComponentsControllerFindAll200ResponseToJSON(
    value?: ComponentsControllerFindAll200Response | null,
): any {
    if (value == null) {
        return value
    }
    return {
        data: (value['data'] as Array<any>)?.map(ComponentToJSON),
        meta: PageMetaDtoToJSON(value['meta']),
    }
}
