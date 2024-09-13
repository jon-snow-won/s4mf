const { settingsTypes } = require('../../util-tables/settings-types')

module.exports.settingsAngleEntrypoint = {
    name: "entrypoint-angle",
    version: "0.0.1",
    type: settingsTypes.entrypoint,
    extends: [],
    global: {},
    local: {
        type: "microfront", /* microfront | iframe | blazor */
        url: "http://svc-internal.s4mf.com/test/el-angle-front/el-angle-front.js",
        scope: "angle",
        module: "./Angle",
        props: {
            "url": "/angle",
            "name": "Ракурсы"
        }
    },
}
