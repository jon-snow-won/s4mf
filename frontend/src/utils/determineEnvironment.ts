export function determineEnvironment() {
    const url = window.location.host

    if (url.includes('svc-internal') || url.includes('dmp')) {
        return 'dmp'
    }
    if (url.includes('dtp')) {
        return 'dtp'
    }
}
