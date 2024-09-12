import { Component, Role, Service, ServiceType, Setting, SettingType, Structure } from '@src/vendor/bff-openapi-client'

export interface ManifestTypesSchema {
    typesService: ServiceType[]
    typesServiceFetchPending: boolean
    typesServiceFetchSuccess: boolean

    typesSetting: SettingType[]
    typesSettingFetchPending: boolean
    typesSettingFetchSuccess: boolean
}
