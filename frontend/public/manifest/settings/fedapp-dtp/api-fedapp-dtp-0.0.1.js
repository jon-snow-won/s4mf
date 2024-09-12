const { settingsTypes } = require('../../util-tables/settings-types')

module.exports.settingsFedAppDtpApi = {
    name: 'api-fedapp-dtp',
    version: '0.0.1',
    type: settingsTypes.api,
    extends: [],
    global: {
        prefixes: {},
        urls: {
            FED_APP_URL: "http://dtp.rtk-element.ru/test/el-aggregate-front/",
            DICTIONARY_API: "http://dtp.rtk-element.ru/test/dictionary-service/",
        }
    },
    local: {
        prefixes: {},
        urls: {
            NOTIFICATIONS_WEBSOCKET_URL: 'ws://dtp.rtk-element.ru/test/notifications-service/',
        },
    },
}
