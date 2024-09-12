// Запуск:
// npx ts-node ./public/manifest/applications/fedapp-dtp-0.0.1.js
const util = require('util')
const fs = require('fs')
const path = require('path')

const { settingsLayoutFull } = require('../settings/common/layout-full-0.0.1')
const { settingsFedAppDtpRouting } = require('../settings/fedapp-dtp/routing-fedapp-dtp-0.0.1')
const { settingsFedAppDtpView } = require('../settings/fedapp-dtp/view-fedapp-dtp-0.0.1')
const { settingsFedAppDtpAuth } = require('../settings/fedapp-dtp/auth-fedapp-dtp-0.0.1')
const { settingsFedAppDtpApi } = require('../settings/fedapp-dtp/api-fedapp-dtp-0.0.1')

const { appAngle0359 } = require('../applications/angle-0.3.59')
const { appConstructor0048 } = require('../applications/constructor-0.0.48')
const { appDictionary001 } = require('../applications/dictionary-0.0.1')

const manifest = {
    name: 'fedapp-dtp',
    version: '0.0.1',
    settings: {
        // Массив structure — наполняется в интерфейсе, пользователем. Порядок в массиве НЕ важен
        structure: [
            'api:api-fedapp-dtp@0.0.1',
            'auth:auth-fedapp-dtp@0.0.1',
            'layout:layout-fedapp-dtp@0.0.1',
            'routing:routing-fedapp-dtp@0.0.1',
            'view:view-fedapp-dtp@0.0.1',
        ],
        // Всё что ниже — формируется программно, исходя из содержимого массива structure
        api: settingsFedAppDtpApi,
        auth: settingsFedAppDtpAuth,
        // свой entrypoint отсутствует, ибо это точка входа (ФП)
        layout: settingsLayoutFull,
        routing: settingsFedAppDtpRouting,
        view: settingsFedAppDtpView,
    },
    applications: {
        // Массив structure — наполняется в интерфейсе, пользователем. Порядок в массиве важен!
        structure: [
            'dtp:dictionary@0.0.1',
            'dtp:constructor@0.0.48',
            'dtp:angle@0.3.59',
        ],
        // Всё что ниже — формируется программно, исходя из содержимого массива structure
        angle: appAngle0359,
        constructor: appConstructor0048,
        dictionary: appDictionary001,
    },
}

const manifestFilePath = path.join(__dirname, '..', 'build', 'fedapp-dtp-0.0.1.json')
const manifestJson = JSON.stringify(manifest, null, 4)
fs.writeFileSync(manifestFilePath, manifestJson)

console.log('Manifest saved to:', manifestFilePath)
console.log(util.inspect(manifest, {
    showHidden: false,
    depth: null,
}))

