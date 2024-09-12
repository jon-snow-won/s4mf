const { systems } = require('../../util-tables/systems')
const { settingsTypes } = require('../../util-tables/settings-types')

module.exports.settingsFedAppDtpView = {
    name: 'view-fedapp-dtp',
    version: "0.0.1",
    type: settingsTypes.view,
    extends: [],
    global: {},
    local: {
        systems: [
            systems.dtp,
            systems.dmp,
        ],
    },
}
