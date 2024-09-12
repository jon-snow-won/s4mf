const enum Header {
    NOTIFICATIONS = 'header_notifications',
    COMMENTS = 'header_comments',
    FAQ = 'header_faq',
    SETTINGS = 'header_settings',
}

const enum Notifications {
    INFO = 'notifications_info',
    TOGGLE = 'popover_toggle',
    REGISTER_NOTIFICATION = 'popover_register_notification',
    TITLE_FILTER_INPUT = 'title_filter_input',
    TYPE_NOTIFICATION_FILTER_INPUT = 'type_notification_filter_input',
    STATUS_FILTER_INPUT = 'status_filter_input',
}

const enum Profile {
    SOME_COMPONENT = 'profile_some_component',
    EDIT_PROFILE_BUTTON = 'edit_profile_button',
}

type EnumKey<T extends string> = {
    [key in T]: `fed_app_${key}`
}

type AllEnums = Header | Notifications | Profile

export const DataTestIds: EnumKey<AllEnums> = {
    [Header.NOTIFICATIONS]: 'fed_app_header_notifications',
    [Header.COMMENTS]: 'fed_app_header_comments',
    [Header.FAQ]: 'fed_app_header_faq',
    [Header.SETTINGS]: 'fed_app_header_settings',
    [Notifications.INFO]: 'fed_app_notifications_info',
    [Notifications.TOGGLE]: 'fed_app_popover_toggle',
    [Notifications.REGISTER_NOTIFICATION]: 'fed_app_popover_register_notification',
    [Notifications.TITLE_FILTER_INPUT]: 'fed_app_title_filter_input',
    [Notifications.TYPE_NOTIFICATION_FILTER_INPUT]: 'fed_app_type_notification_filter_input',
    [Notifications.STATUS_FILTER_INPUT]: 'fed_app_status_filter_input',
    [Profile.SOME_COMPONENT]: 'fed_app_profile_some_component',
    [Profile.EDIT_PROFILE_BUTTON]: 'fed_app_edit_profile_button',
}
