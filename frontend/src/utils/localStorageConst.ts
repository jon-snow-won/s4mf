import { determineEnvironment } from '@utils/determineEnvironment'

const enum App {
    MANIFEST_VERSION = 'app_manifest_version',
    MANIFEST_STRUCTURE_NAME = 'app_manifest_structure_name',
    ROLE = 'app_role',
    SELECTED_APP = 'app_selectedApp',
    TOKEN = 'app_token',
    USER = 'app_user',
    HEADER_LOGO = 'header_logo',
    USERNAME = 'app_username',
    SELECT_ROLE_LOGO = 'select_role_logo',
}

const enum Notification {
    NOTIFICATION_INFO = 'notification_info',
    NOTIFICATIONS_POPOVER_TOGGLE = 'notifications_popover_toggle',
    NOTIFICATIONS_TABLE_PAGINATION = 'notifications_table_pagination',
}

const enum Profile {
    PROJECTS_MY_PROJECTS = 'projects_my_projects',
}

type Environment = 'dmp' | 'dtp' | ''

const environment: Environment = determineEnvironment()

type EnumKey<T extends `fed_app_username` | string> = {
    [key in T]: `fed_app_${Environment}_${key}`
}

type AllEnums = App | Notification | Profile

export const LocalStorageKey: EnumKey<AllEnums> = {
    [App.MANIFEST_VERSION]: `fed_app_${environment}_app_manifest_version`,
    [App.MANIFEST_STRUCTURE_NAME]: `fed_app_${environment}_app_manifest_structure_name`,
    [App.ROLE]: `fed_app_${environment}_app_role`,
    [App.SELECTED_APP]: `fed_app_${environment}_app_selectedApp`,
    [App.TOKEN]: `fed_app_${environment}_app_token`,
    [App.USER]: `fed_app_${environment}_app_user`,
    [App.HEADER_LOGO]: `fed_app_${environment}_header_logo`,
    [App.SELECT_ROLE_LOGO]: `fed_app_${environment}_select_role_logo`,
    [App.USERNAME]: `fed_app__app_username`,
    [Notification.NOTIFICATION_INFO]: `fed_app__notification_info`,
    [Notification.NOTIFICATIONS_POPOVER_TOGGLE]: `fed_app_${environment}_notifications_popover_toggle`,
    [Notification.NOTIFICATIONS_TABLE_PAGINATION]: `fed_app__notifications_table_pagination`,
    [Profile.PROJECTS_MY_PROJECTS]: `fed_app_${environment}_projects_my_projects`,
}
