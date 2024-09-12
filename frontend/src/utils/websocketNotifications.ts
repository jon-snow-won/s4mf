// @ts-nocheck

import { envConfigByManifestVersionService } from '@hooks/useManifestVersion'
import { getGluedURL } from '@utils/getGluedURL'

type NotifyType = (params: object) => void | null
type WsType = WebSocket | null
type ReconnectIntervalType = NodeJS.Timer | null

type ConnectProps = {
    realm: string
    login: string
    notify: (params: object) => void | null
}

let localNotify: NotifyType = null
let localRealm: string = null
let localLogin: string = null

let ws: WsType = null
let reconnectInterval: ReconnectIntervalType = null
let isWebSocketOpen = false

function init(props: ConnectProps) {
    if (isWebSocketOpen || reconnectInterval) {
        // WebSocket is already open or reconnecting, no need to reconnect
        return
    }

    const { realm, login, notify } = props

    localRealm = realm
    localLogin = login.replaceAll(' ', '-')
    localNotify = notify

    if (envConfigByManifestVersionService.NOTIFICATIONS_WEBSOCKET_URL) connectWebSocket()
}

function connectWebSocket() {
    if (ws) {
        // Close the existing WebSocket connection if it exists
        ws.close()
        ws = null
    }

    const source = '*' // все модули - пустая строка

    const websocketHostUrl = envConfigByManifestVersionService.NOTIFICATIONS_WEBSOCKET_URL

    // ws = new WebSocket(`${websocketHostUrl}ws/notifications/` + localRealm + '/' + localLogin + '/' + source + '/unread-count')
    ws = new WebSocket(
        getGluedURL({
            baseUrl: websocketHostUrl,
            url: `ws/notifications/${localRealm}/${localLogin}/${source}/unread-count`,
        }),
    )

    ws.onmessage = function (event) {
        console.info('ws-message', event.data, event)
        localNotify(event.data)
    }

    ws.onerror = function (event) {
        console.error('ws-error', event)
    }

    ws.onopen = function (event) {
        console.info('ws-opened', event)
        isWebSocketOpen = true

        // Clear the reconnect interval if the connection is successful
        clearInterval(reconnectInterval)
        reconnectInterval = null
    }

    ws.onclose = function (event) {
        console.info('ws-closed', event)
        isWebSocketOpen = false

        // Attempt to reconnect when the connection is closed
        if (!reconnectInterval) {
            reconnectInterval = setInterval(connectWebSocket, 10000)
        }
    }
}

export const WebsocketNotifications = {
    init,
}
