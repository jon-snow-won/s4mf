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
import type { SettingType } from './SettingType'
import { SettingTypeFromJSON, SettingTypeFromJSONTyped, SettingTypeToJSON } from './SettingType'
import type { User } from './User'
import { UserFromJSON, UserFromJSONTyped, UserToJSON } from './User'

/**
 *
 * @export
 * @interface Setting
 */
export interface Setting {
    /**
     *
     * @type {Date}
     * @memberof Setting
     */
    createdAt?: Date
    /**
     *
     * @type {Date}
     * @memberof Setting
     */
    updatedAt?: Date
    /**
     *
     * @type {number}
     * @memberof Setting
     */
    id: number
    /**
     *
     * @type {SettingType}
     * @memberof Setting
     */
    type: SettingType
    /**
     *
     * @type {Array<number>}
     * @memberof Setting
     */
    _extends: Array<number>
    /**
     *
     * @type {object}
     * @memberof Setting
     */
    properties: object
    /**
     *
     * @type {User}
     * @memberof Setting
     */
    user: User
    /**
     *
     * @type {string}
     * @memberof Setting
     */
    idx?: string
    /**
     *
     * @type {number}
     * @memberof Setting
     */
    revision: number
    /**
     *
     * @type {boolean}
     * @memberof Setting
     */
    isActive?: boolean
    /**
     *
     * @type {boolean}
     * @memberof Setting
     */
    isDeleted?: boolean
    /**
     *
     * @type {Date}
     * @memberof Setting
     */
    deletedAt?: Date
}

/**
 * Check if a given object implements the Setting interface.
 */
export function instanceOfSetting(value: object): boolean {
    if (!('id' in value)) return false
    if (!('type' in value)) return false
    if (!('_extends' in value)) return false
    if (!('properties' in value)) return false
    if (!('user' in value)) return false
    if (!('revision' in value)) return false
    return true
}

export function SettingFromJSON(json: any): Setting {
    return SettingFromJSONTyped(json, false)
}

export function SettingFromJSONTyped(json: any, ignoreDiscriminator: boolean): Setting {
    if (json == null) {
        return json
    }
    return {
        createdAt: json['createdAt'] == null ? undefined : new Date(json['createdAt']),
        updatedAt: json['updatedAt'] == null ? undefined : new Date(json['updatedAt']),
        id: json['id'],
        type: SettingTypeFromJSON(json['type']),
        _extends: json['extends'],
        properties: json['properties'],
        user: UserFromJSON(json['user']),
        idx: json['idx'] == null ? undefined : json['idx'],
        revision: json['revision'],
        isActive: json['isActive'] == null ? undefined : json['isActive'],
        isDeleted: json['isDeleted'] == null ? undefined : json['isDeleted'],
        deletedAt: json['deletedAt'] == null ? undefined : new Date(json['deletedAt']),
    }
}

export function SettingToJSON(value?: Setting | null): any {
    if (value == null) {
        return value
    }
    return {
        createdAt: value['createdAt'] == null ? undefined : value['createdAt'].toISOString(),
        updatedAt: value['updatedAt'] == null ? undefined : value['updatedAt'].toISOString(),
        id: value['id'],
        type: SettingTypeToJSON(value['type']),
        extends: value['_extends'],
        properties: value['properties'],
        user: UserToJSON(value['user']),
        idx: value['idx'],
        revision: value['revision'],
        isActive: value['isActive'],
        isDeleted: value['isDeleted'],
        deletedAt: value['deletedAt'] == null ? undefined : (value['deletedAt'] as any).toISOString(),
    }
}
