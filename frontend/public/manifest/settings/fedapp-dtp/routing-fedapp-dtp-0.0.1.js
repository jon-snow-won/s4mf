const { settingsTypes } = require('../../util-tables/settings-types')

module.exports.settingsFedAppDtpRouting = {
    name: 'routing-fedapp-dtp',
    version: "0.0.1",
    type: settingsTypes.routing,
    extends: [],
    global: {},
    local: {
        // При желании, в будущем, можно будет вложить один ФП в другой ФП. Р - Расширяемость :)
        parent_prefix: '',
        path: '/*',
        url: '/',
    },
}
