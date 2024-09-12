export enum AppRoutes {
    MAIN = 'main',
    SELECT_ROLE = 'selectRole',
    NOT_FOUND = 'notFound',
    ADMIN = 'admin',
    MANIFEST = 'manifest',
    PROFILE_INFO = 'profileInfo',
}

export const RoutePath: Record<AppRoutes, string> = {
    [AppRoutes.MAIN]: '/',
    [AppRoutes.SELECT_ROLE]: '/select-role',
    [AppRoutes.ADMIN]: '/admin',
    [AppRoutes.MANIFEST]: '/dynamic-manifest',
    [AppRoutes.PROFILE_INFO]: '/profile/info',
    [AppRoutes.NOT_FOUND]: '*',
}
