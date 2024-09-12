export enum AppApiRoutes {
    NOTIFICATIONS = 'notifications',
    PROFILE = 'profile',
    DIGITAL_TWIN_BFF = 'digital_twin_bff',
}

export const RouteApiPath: Record<AppApiRoutes, string> = {
    [AppApiRoutes.NOTIFICATIONS]: '/api/notifications',
    [AppApiRoutes.PROFILE]: '/api/profile',
    [AppApiRoutes.DIGITAL_TWIN_BFF]: '/api/digital-twin-bff',
}
