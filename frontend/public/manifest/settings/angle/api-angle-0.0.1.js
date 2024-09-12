const { settingsTypes } = require('../../util-tables/settings-types')

module.exports.settingsAngleApi = {
    name: "api-angle",
    version: "0.0.1",
    type: settingsTypes.api,
    extends: [],
    global: {},
    local: {
        prefixes: {
            API_PREFIX: "api/angle-service",
        },
        urls: {
            // FED_APP_URL и DICTIONARY_API берём из родителя
        },
        constants: {
            ANGLES_CODE_BY_TABLE_NAME: "wink_directory_code",
            ANGLES_DICTIONARY_CODE: "winkdirectory",
            ATTRIBUTES_CODE_BY_TABLE_NAME: "att_directory_code",
            ATTRIBUTES_DICTIONARY_CODE: "attdirectory",
            LINK_SCOPE_CODE: "winkcomposition",
        }
    },
}
