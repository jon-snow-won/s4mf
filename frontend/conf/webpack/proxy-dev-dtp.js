// DTP
const microFrontendEndpoints = [
    // Process digital twin (Цифровой Двойник Процессов)
    {
        context: ['/api/process-digital-twin/bff'],
        target: 'http' + '://dtp.rtk-element.ru',
        pathRewrite: { '^/api/process-digital-twin/bff': '/test/el-process-digital-twin-bff' },
        changeOrigin: true,
    },
    {
        context: ['/api/process-digital-twin/constructor'],
        target: 'http' + '://dtp.rtk-element.ru',
        pathRewrite: { '^/api/process-digital-twin/constructor': '/test/el-object-designer' },
        changeOrigin: true,
    },
    {
        context: ['/api/process-digital-twin/manifest-service'],
        target: 'http' + '://dtp.rtk-element.ru',
        pathRewrite: { '^/api/process-digital-twin/manifest-service': '/test/el-manifest-service' },
        changeOrigin: true,
    },
    {
        context: ['/api/process-digital-twin/dictionary'],
        target: 'http' + '://dtp.rtk-element.ru',
        pathRewrite: { '^/api/process-digital-twin/dictionary': '/test/dictionary-service' },
        changeOrigin: true,
    },
    {
        context: ['/api/process-digital-twin/pf-generator-service'],
        target: 'http' + '://dtp.rtk-element.ru',
        pathRewrite: { '^/api/process-digital-twin/pf-generator-service': '/test/el-pf-generator-service' },
        changeOrigin: true,
    },
    {
        context: ['/api/process-digital-twin/pdt-file-adapter'],
        target: 'http' + '://dtp.rtk-element.ru',
        pathRewrite: { '^/api/process-digital-twin/pdt-file-adapter': '/test/el-pdt-file-adapter' },
        changeOrigin: true,
    },

    // Dictionary service (Сервис справочников)
    {
        context: ['/api/dictionary-service'],
        target: 'http' + '://dtp.rtk-element.ru',
        pathRewrite: { '^/api/dictionary-service': '/test/dictionary-service' },
        changeOrigin: true,
    },
    {
        context: ['/api/dictionary-service/mapping-service'],
        target: 'http' + '://dtp.rtk-element.ru',
        pathRewrite: { '^/api/dictionary-service/mapping-service/': '/test/metadata-mapper/' },
        changeOrigin: true,
    },
    {
        context: ['/api/dictionary-service/model-service'],
        target: 'http' + '://dtp.rtk-element.ru',
        pathRewrite: { '^/api/dictionary-service/model-service/': '/test/metamodel-designer/' },
        changeOrigin: true,
    },

    // Other
    {
        context: ['/api/content-cms/mocks'],
        target: 'https://content-cms.svp.mmdx.ru',
        changeOrigin: true,
        pathRewrite: { '^/api/content-cms/mocks': '/mocks' },
    },
    {
        context: ['/api/lk-admin/mocks'],
        target: 'https://lk-admin.svp.mmdx.ru',
        changeOrigin: true,
        pathRewrite: { '^/api/lk-admin/mocks': '/mocks' },
    },
    {
        context: ['/api/crm-front/mocks'],
        target: 'https://crm-front.svp.mmdx.ru',
        changeOrigin: true,
        pathRewrite: { '^/api/crm-front/mocks': '/mocks' },
    },
    {
        context: ['/api/crm-ui'],
        target: 'https://crm-ui-api.svp.mmdx.ru',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
    },
    {
        context: ['/api/task-manager'],
        target: 'https://task-manager.svp.mmdx.ru',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
    },
    {
        context: ['/api/mobile'],
        target: 'https://svp-mobile-api.svp.mmdx.ru',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
    },
    {
        context: ['/api/user'],
        target: 'https://svp-user-api.svp.mmdx.ru',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
    },
    {
        context: ['/api/content'],
        target: 'https://content-api.svp.mmdx.ru',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
    },
    {
        context: ['/api/emd-streaming'],
        target: 'http' + '://192.168.100.29:8093',
        changeOrigin: true,
        pathRewrite: { '^/api/emd-streaming': '/api' },
    },
    {
        context: ['/api/oms-api'],
        target: 'http' + '://192.168.100.29:8081',
        changeOrigin: true,
        pathRewrite: { '^/api/oms-api': '' },
    },
    {
        context: ['/api/semd-api'],
        target: 'http' + '://192.168.100.29:8080',
        changeOrigin: true,
        pathRewrite: { '^/api/semd-api': '/api' },
    },

    //..
    {
        context: ['/feature-flags'],
        target: 'https://fe-feature-flags.s3.dtln.ru',
        changeOrigin: true,
        pathRewrite: { '^/feature-flags': '' },
    },

    // Constructor (Дизайнер моделей)
    {
        context: ['/api/constructor'],
        target: 'http' + '://dtp.rtk-element.ru',
        pathRewrite: { '^/api/constructor': '/test/el-api-gateway/api' },
        changeOrigin: true,
    },
    {
        context: ['/api/constructor/dictionary-widget'],
        target: 'http' + '://192.168.100.72',
        pathRewrite: { '^/api/constructor/dictionary-widget': '/api' },
        changeOrigin: true,
    },

    // Glossary (Глоссарий)
    {
        context: ['/api/glossary/term'],
        target: 'http' + '://dtp.rtk-element.ru',
        pathRewrite: { '^/api/glossary': '/test/business-glossary-service' },
        changeOrigin: true,
    },
    {
        context: ['/api/glossary/domain'],
        target: 'http' + '://dtp.rtk-element.ru',
        pathRewrite: { '^/api/glossary': '/test/metamodel-designer' },
        changeOrigin: true,
    },

    // Manifest constructor (Конструктор манифестов)
    {
        context: ['/api/manifest-constructor/graph'],
        target: 'http' + '://dtp.rtk-element.ru',
        pathRewrite: { '^/api/manifest-constructor/graph': '/test/metamodel-designer' },
        changeOrigin: true,
    },
    {
        context: ['/api/manifest-constructor/mapping'],
        target: 'http' + '://dtp.rtk-element.ru',
        pathRewrite: { '^/api/manifest-constructor/mapping': '/test/metadata-mapper' },
        changeOrigin: true,
    },

    // Workflow designer (Дизайнер процессов)
    {
        context: ['/api/workflow-designer'],
        target: 'http' + '://dtp.rtk-element.ru',
        pathRewrite: { '^/api/workflow-designer': '/test/dictionary-service' },
        changeOrigin: true,
    },

    {
        context: ['/api/comments'],
        target:
            'http' +
            '://dtp.rtk-element.ru/test/el-aggregate-front/api/process-digital-twin/constructor/api/v2/generation',
        changeOrigin: true,
        pathRewrite: { '^/api/comments': '' },
    },

    // Дизайнер ракурсов
    {
        context: ['/api/angle-service'],
        target: 'http' + '://dtp.rtk-element.ru',
        pathRewrite: { '^/api/angle-service': '/test/dictionary-service/' },
        changeOrigin: true,
    },

    // Users management service
    {
        context: ['/api/users-management-service'],
        target: 'http' + '://dtp.rtk-element.ru',
        changeOrigin: true,
        pathRewrite: { '^/api/users-management-service': '/test/users-management-service/' },
    },
    {
        context: ['/api/digital-twin-bff'],
        target: 'http' + '://dtp.rtk-element.ru/test/el-process-digital-twin-bff',
        changeOrigin: true,
        pathRewrite: { '^/api/digital-twin-bff': '' },
    },

    // Publications
    {
        context: ['/api/publications/dictionary'],
        target: 'http' + '://dtp.rtk-element.ru',
        changeOrigin: true,
        pathRewrite: { '^/api/publications/dictionary': '/test/dictionary-service/' },
    },
    {
        context: ['/api/publications/designer'],
        target: 'http' + '://dtp.rtk-element.ru',
        changeOrigin: true,
        pathRewrite: { '^/api/publications/designer': '/test/el-object-designer/' },
    },

    // PVK Widgets
    {
        context: ['/api/pvk-widget/auth'],
        target: 'https' + '://ia.test.egisz.rosminzdrav.ru/realms/dev',
        changeOrigin: true,
        secure: false, // avoid SELF_SIGNED_CERT_IN_CHAIN error
        pathRewrite: { '^/api/pvk-widget/auth': '' },
    },
    {
        context: ['/api/pvk-widget/main'],
        target: 'https' + '://pvk-egisz-dev.helpms.ru',
        changeOrigin: true,
        secure: true,
        pathRewrite: { '^/api/pvk-widget/main': '' },
    },

    {
        context: ['/api/profile'],
        target: 'http' + '://dtp.rtk-element.ru/test/users-management-service',
        changeOrigin: true,
        pathRewrite: { '^/api/profile': '/' },
    },
    {
        context: ['/api/notifications'],
        target: 'http' + '://dtp.rtk-element.ru/test/notifications',
        changeOrigin: true,
        pathRewrite: { '^/api/notifications': '/notifications' },
    },
    {
        context: ['/api/api-gateway'],
        target: 'http' + '://client-test.dtp.rtk-element.ru',
        changeOrigin: true,
        pathRewrite: { '^/api/api-gateway': '' },
    },
    {
        context: ['/api/tasks-service'],
        target: 'http' + '://dtp.rtk-element.ru/test/tasks-service',
        changeOrigin: true,
        pathRewrite: { '^/api/tasks-service': '' },
    },
    {
        context: ['/aggregate-bff/api'],
        target: 'http' + '://dtp.rtk-element.ru/test/el-aggregate-bff/api',
        changeOrigin: true,
        pathRewrite: { '^/aggregate-bff/api': '' },
    },
]

module.exports = [...microFrontendEndpoints]
