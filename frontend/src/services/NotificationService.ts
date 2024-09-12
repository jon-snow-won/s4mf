import { RouteApiPath } from '@config/apiConfig/apiConfig'
import { envConfigByManifestVersionService } from '@hooks/useManifestVersion'
import { NotificationsListResponseWithoutCount } from '@pages/notifications/types'

import { ApiService } from './ApiService'
import { handleApiError } from './handleApiError'

export type GetNotificationsQueryType = {
    sources?: string[]
    unread?: boolean
    pageNum?: number
    pageSize?: number
    count?: boolean
}

class NotificationService extends ApiService {
    async getUnreadNotificationCount() {
        const response = await this.request({
            url: '/v1/unread-count',
            method: 'GET',
        })

        return handleApiError(response)
    }

    getNotificationsListWithoutCount(
        query: GetNotificationsQueryType = {},
    ): Promise<NotificationsListResponseWithoutCount> {
        return this.getNotificationsList({ ...query, count: false })
    }

    private async getNotificationsList(query: GetNotificationsQueryType) {
        const response = await this.request({
            url: '/v1/list',
            data: { ...query },
            method: 'GET',
        })

        return handleApiError(response)
    }

    async markAsRead(id: number) {
        const response = await this.request({
            url: `/v1/read?id=${id}`,
            data: null,
            method: 'POST',
        })

        return handleApiError(response)
    }
}

export const notificationService = new NotificationService({
    baseUrl: `${envConfigByManifestVersionService.BASE_URL}${RouteApiPath.notifications}`,
})
