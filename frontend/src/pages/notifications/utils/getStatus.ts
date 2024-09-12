import { Notification, NotificationStatusText } from '../types'

export const getStatus = (notification: Notification) => {
    if (notification.readDate) {
        return NotificationStatusText.read
    }

    return NotificationStatusText.new
}
