import { EnvConfig } from '@src/types/envConfig'

function getProcessEnvVariables() {
    if (process.env.DEPLOY_STAGE === 'k8s') {
        return {
            BASE_URL: window.env.BASE_URL,
            AUTH: window.env.AUTH,
            IS_AUTH: window.env.AUTH === 'front',
            VERSION: process.env.reactAppVersion,
            APP_NAME: process.env.reactAppName,
        }
    }

    return {
        BASE_URL: process.env.BASE_URL,
        AUTH: process.env.AUTH,
        IS_AUTH: process.env.AUTH === 'front',
        VERSION: process.env.reactAppVersion,
        APP_NAME: process.env.reactAppName,
    }
}

/* eslint-disable */
export let dynamicEnvConfig: EnvConfig = {
    ...getProcessEnvVariables(),
}
/* eslint-enable */
export function updateEnvConfig(updatedConfig: Partial<typeof dynamicEnvConfig>): void {
    dynamicEnvConfig = {
        ...dynamicEnvConfig,
        ...updatedConfig,
        BASE_URL: window.location.hostname === 'localhost' ? process.env.BASE_URL : dynamicEnvConfig.BASE_URL,
        IS_AUTH: (dynamicEnvConfig.AUTH ?? updatedConfig.AUTH) === 'front',
    }
}
