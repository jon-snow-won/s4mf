const { settingsTypes } = require('../../util-tables/settings-types')

module.exports.settingsAngleRouting = {
    name: "routing-angle-dtp",
    version: "0.0.1",
    type: settingsTypes.routing,
    extends: [],
    global: {},
    local: {
        parent_prefix: "angle",
        path: "/angle/*",
        url: "/angle",
        name: "Дизайнер ракурсов",
    },
}
