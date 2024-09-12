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
import type { User } from './User'
import { UserFromJSON, UserFromJSONTyped, UserToJSON } from './User'

/**
 *
 * @export
 * @interface Component
 */
export interface Component {
    /**
     *
     * @type {Date}
     * @memberof Component
     */
    createdAt?: Date
    /**
     *
     * @type {Date}
     * @memberof Component
     */
    updatedAt?: Date
    /**
     *
     * @type {Array<any>}
     * @memberof Component
     */
    files: Array<any>
    /**
     *
     * @type {string}
     * @memberof Component
     */
    name: string
    /**
     *
     * @type {string}
     * @memberof Component
     */
    description: string
    /**
     *
     * @type {User}
     * @memberof Component
     */
    user: User
    /**
     *
     * @type {string}
     * @memberof Component
     */
    idx?: string
    /**
     *
     * @type {number}
     * @memberof Component
     */
    revision: number
    /**
     *
     * @type {boolean}
     * @memberof Component
     */
    isActive?: boolean
    /**
     *
     * @type {boolean}
     * @memberof Component
     */
    isDeleted?: boolean
    /**
     *
     * @type {Date}
     * @memberof Component
     */
    deletedAt?: Date
    /**
     *
     * @type {number}
     * @memberof Component
     */
    id: number
}

/**
 * Check if a given object implements the Component interface.
 */
export function instanceOfComponent(value: object): boolean {
    if (!('files' in value)) return false
    if (!('name' in value)) return false
    if (!('description' in value)) return false
    if (!('user' in value)) return false
    if (!('revision' in value)) return false
    if (!('id' in value)) return false
    return true
}

export function ComponentFromJSON(json: any): Component {
    return ComponentFromJSONTyped(json, false)
}

export function ComponentFromJSONTyped(json: any, ignoreDiscriminator: boolean): Component {
    if (json == null) {
        return json
    }
    return {
        createdAt: json['createdAt'] == null ? undefined : new Date(json['createdAt']),
        updatedAt: json['updatedAt'] == null ? undefined : new Date(json['updatedAt']),
        files: json['files'],
        name: json['name'],
        description: json['description'],
        user: UserFromJSON(json['user']),
        idx: json['idx'] == null ? undefined : json['idx'],
        revision: json['revision'],
        isActive: json['isActive'] == null ? undefined : json['isActive'],
        isDeleted: json['isDeleted'] == null ? undefined : json['isDeleted'],
        deletedAt: json['deletedAt'] == null ? undefined : new Date(json['deletedAt']),
        id: json['id'],
    }
}

export function ComponentToJSON(value?: Component | null): any {
    if (value == null) {
        return value
    }
    return {
        createdAt: value['createdAt'] == null ? undefined : value['createdAt'].toISOString(),
        updatedAt: value['updatedAt'] == null ? undefined : value['updatedAt'].toISOString(),
        files: value['files'],
        name: value['name'],
        description: value['description'],
        user: UserToJSON(value['user']),
        idx: value['idx'],
        revision: value['revision'],
        isActive: value['isActive'],
        isDeleted: value['isDeleted'],
        deletedAt: value['deletedAt'] == null ? undefined : (value['deletedAt'] as any).toISOString(),
        id: value['id'],
    }
}
