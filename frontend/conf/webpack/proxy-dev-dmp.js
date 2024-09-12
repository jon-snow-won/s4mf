// DMP
const microFrontendEndpoints = [
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
    {
        context: ['/api/dictionary-service'],
        target: 'http' + '://192.168.100.72',
        changeOrigin: true,
        pathRewrite: { '^/api/dictionary-service': '/api/dictionary-service' },
    },
    {
        context: ['/api/dictionary-service/mapping-service'],
        target: 'http' + '://svc-internal.element-lab.ru',
        changeOrigin: true,
        pathRewrite: { '^/api/dictionary-service/mapping-service/': '/test/metadata-mapper/' },
    },
    {
        context: ['/api/dictionary-service/model-service'],
        target: 'http' + '://svc-internal.element-lab.ru',
        changeOrigin: true,
        pathRewrite: { '^/api/dictionary-service/model-service/': '/test/metamodel-designer/' },
    },
    {
        context: ['/feature-flags'],
        target: 'https://fe-feature-flags.s3.dtln.ru',
        changeOrigin: true,
        pathRewrite: { '^/feature-flags': '' },
    },
    {
        context: ['/api/constructor'],
        target: 'http' + '://192.168.100.25:8094',
        changeOrigin: true,
        pathRewrite: { '^/api/constructor': '/api' },
    },
    {
        context: ['/api/constructor/dictionary-widget'],
        target: 'http' + '://192.168.100.72',
        changeOrigin: true,
        pathRewrite: { '^/api/constructor/dictionary-widget': '/api' },
    },
    {
        context: ['/api/glossary/term'],
        target: 'http' + '://svc-internal.element-lab.ru/test/el-api-gateway/api/business-glossary',
        changeOrigin: true,
        pathRewrite: { '^/api/glossary': '' },
    },
    {
        context: ['/api/glossary/categories'],
        target: 'http' + '://svc-internal.element-lab.ru/test/el-api-gateway/api/business-glossary',
        changeOrigin: true,
        pathRewrite: { '^/api/glossary': '' },
    },
    {
        context: ['/api/glossary/domain'],
        target: 'http' + '://svc-internal.element-lab.ru/test/el-api-gateway/api/metamodel-designer',
        changeOrigin: true,
        pathRewrite: { '^/api/glossary': '' },
    },
    {
        context: ['/api/glossary/domainobject'],
        target: 'http' + '://svc-internal.element-lab.ru/test/el-api-gateway/api/metamodel-designer',
        changeOrigin: true,
        pathRewrite: { '^/api/glossary': '' },
    },
    {
        context: ['/api/manifest-constructor/graph'],
        target: 'http' + '://192.168.100.25:8090',
        changeOrigin: true,
        pathRewrite: { '^/api/manifest-constructor/graph': '' },
    },
    {
        context: ['/api/manifest-constructor/mapping'],
        target: 'http' + '://svc-internal.element-lab.ru',
        changeOrigin: true,
        pathRewrite: { '^/api/manifest-constructor/mapping': '/test/metadata-mapper/' },
    },
    {
        context: ['/api/manifest-constructor/manifest'],
        target: 'http' + '://svc-internal.element-lab.ru/test/el-manifest-service',
        changeOrigin: true,
        pathRewrite: { '^/api/manifest-constructor/manifest': '' },
    },
    {
        context: ['/api/proto-patient-view'],
        target: 'http' + '://192.168.100.25:8084',
        changeOrigin: true,
        pathRewrite: { '^/api/proto-patient-view': '' },
    },
    // Rule for static files from risk-calculator
    {
        context: function (pathname) {
            if (
                pathname.startsWith('/risk-calculator-client') &&
                /\.(json|css|js|dll|wasm|blat|dat)$/i.test(pathname)
                // || pathname.includes('authentication')
            ) {
                return true
            }
            return false
        },
        target: 'http' + '://svc-internal.element-lab.ru',
        changeOrigin: true,
        pathRewrite: { '^/risk-calculator-client': '/risk-calculator-server' },
    },
    {
        context: ['/risk-calculator-client/api/risk-calculator'],
        target: 'http' + '://svc-internal.element-lab.ru',
        changeOrigin: true,
        pathRewrite: { '^/risk-calculator-client/api/risk-calculator': '/risk-calculator-server/api/risk-calculator' },
    },
    {
        context: ['/risk-calculator-api/api'],
        target: 'http' + '://svc-internal.element-lab.ru',
        changeOrigin: true,
        pathRewrite: { ['^/risk-calculator-api/api']: 'risk-calculator-api/api' },
    },
    {
        context: function (pathname) {
            if (
                pathname.startsWith('/armrakursweb-client') &&
                (/\.(json|css|js|dll|wasm|blat|dat|woff|ttf|otf)$/i.test(pathname) ||
                    pathname.includes('authentication'))
            ) {
                return true
            }
            return false
        },
        target: 'http' + '://svc-internal.element-lab.ru',
        changeOrigin: true,
        pathRewrite: { '^/armrakursweb-client': '/test/armrakursweb' },
    },
    {
        context: ['/api/workflow-designer'],
        target: 'http' + '://192.168.100.72:8080',
        changeOrigin: true,
        pathRewrite: { '^/api/workflow-designer': '' },
    },
    {
        context: ['/ws/notifications'],
        target: 'ws://192.168.100.72:8880',
        changeOrigin: true,
        ws: true,
    },
    {
        context: ['/api/lab4oms'],
        target: 'http' + '://svc-internal.element-lab.ru',
        changeOrigin: true,
        pathRewrite: { '^/api/lab4oms': '/cmp/lab4oms-web-client' },
    },
    {
        context: ['/api/kmp'],
        target: 'http' + '://192.168.100.34',
        changeOrigin: true,
        pathRewrite: { '^/api/kmp': '' },
    },
    {
        context: ['/api/angle-service'],
        target: 'http' + '://192.168.100.72',
        changeOrigin: true,
        pathRewrite: { '^/api/angle-service': '/api/dictionary-service' },
    },
    {
        context: ['/api/comments'],
        target:
            'http' +
            '://dtp.rtk-element.ru/test/el-aggregate-front/api/process-digital-twin/constructor/api/v2/generation',
        changeOrigin: true,
        pathRewrite: { '^/api/comments': '' },
    },
    {
        context: ['/api/users-management-service'],
        target: 'http' + '://192.168.100.72:8190',
        changeOrigin: true,
        pathRewrite: { '^/api/users-management-service': '' },
    },
    {
        context: ['/api/digital-twin-bff'],
        target: 'http' + '://dtp.rtk-element.ru/test/el-process-digital-twin-bff',
        changeOrigin: true,
        pathRewrite: { '^/api/digital-twin-bff': '' },
    },
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
        target: 'http' + '://192.168.100.72:8190',
        changeOrigin: true,
        pathRewrite: { '^/api/profile': '/' },
    },
    {
        context: ['/api/notifications'],
        target: 'http' + '://192.168.100.72:8880',
        changeOrigin: true,
        pathRewrite: { '^/api/notifications': '/notifications' },
    },
    {
        context: ['/api/api-gateway'],
        target: 'http' + '://client-test.svc-internal.element-lab.ru',
        changeOrigin: true,
        pathRewrite: { '^/api/api-gateway': '' },
    },
    {
        context: ['/api/tasks-service'],
        target: 'http' + '://192.168.100.72:8290',
        changeOrigin: true,
        pathRewrite: { '^/api/tasks-service': '' },
    },
    {
        context: ['/aggregate-bff/api'],
        target: 'http' + '://svc-internal.element-lab.ru/test/el-aggregate-bff/api',
        changeOrigin: true,
        pathRewrite: { '^/aggregate-bff/api': '' },
    },
]

module.exports = [...microFrontendEndpoints]
