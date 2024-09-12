const { settingsTypes } = require('../../util-tables/settings-types')

module.exports.settingsFedAppDtpAuth = {
    name: 'auth-fedapp-dtp',
    version: "0.0.1",
    type: settingsTypes.auth,
    extends: [
        // ["auth-fedapp-dmp", "0.0.1"],
        // ["auth-fedapp-dmp", "0.0.2"],
    ],
    global: {
        AUTH: "front",
    },
    local: {
        KEYCLOAK_URL: 'http://dtp.rtk-element.ru/keycloakx/',
        KEYCLOAK_REALM: 'dtp',
        KEYCLOAK_CLIENT_ID: 'manifest-constructor', // здесь должен быть клиент fedapp-dtp
    },
}
