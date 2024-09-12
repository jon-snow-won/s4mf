import { useContext } from 'react'

import { GlobalModalsContext } from '@components/GlobalModals'

export const useNotification = () => {
    const { notification } = useContext(GlobalModalsContext)

    return notification
}
