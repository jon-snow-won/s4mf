const { settingsAngleEntrypoint } = require('../settings/angle/entrypoint-angle-0.0.1')
const { settingsLayoutFull } = require('../settings/common/layout-full-0.0.1')
const { settingsAngleRouting } = require('../settings/angle/routing-angle-0.0.1')
const { settingsAngleApi } = require('../settings/angle/api-angle-0.0.1')

module.exports.appAngle0360 = {
    name: "angle",
    version: "0.3.60",
    settings: { /* параметры загрузки и отрисовки приложения */
        // Массив structure — наполняется в интерфейсе, пользователем
        structure: [
            'api:api-angle@0.0.1',
            'entrypoint:entrypoint-angle@0.0.1',
            'layout:layout-angle@0.0.1',
            'routing:routing-angle@0.0.1',
            'view:view-angle@0.0.1',
        ],
        // Всё что ниже — формируется программно, исходя из содержимого массива structure
        api: settingsAngleApi,
        // свой auth отсутствует, берём из родителя
        entrypoint: settingsAngleEntrypoint,
        layout: settingsLayoutFull,
        routing: settingsAngleRouting,
        // свой view отсутствует, берём из родителя
    },
    applications: { /* список дочерних приложений */
        // Массив structure — наполняется в интерфейсе, пользователем
        structure: [
            // 'angle_widget_1@latest',
            // 'angle_widget_2@0.2.1',
        ],
        // Всё что ниже — формируется программно, исходя из содержимого массива structure
    },
}
