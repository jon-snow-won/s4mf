import axios from 'axios'
import { useCallback, useEffect } from 'react'
import { embedDashboard } from '@superset-ui/embedded-sdk'

import { ManifestComponentSupersetParams } from '@src/types/manifest'
import { useLocalStorage } from '@hooks/useLocalStorage'
import { LocalStorageKey } from '@utils/localStorageConst'

export const useSupersetDashboards = ({
    dashboardId,
    domain,
    accessUsername,
    accessPassword,
    guestUsername,
    guestLastname,
    guestFirstname,
}: ManifestComponentSupersetParams) => {
    const [, setUserName] = useLocalStorage(LocalStorageKey.app_username, null)

    const fetchGuestToken = useCallback(async () => {
        try {
            const { data: token } = await axios.post(`${domain}/api/v1/security/login`, {
                username: accessUsername,
                password: accessPassword,
                provider: 'db',
                refresh: false,
            })

            axios
                .get('http://client-test.svc-internal.element-lab.ru/test/el-aggregate-bff/api/auth/me', {
                    headers: { Authorization: `Bearer ${token.access_token}` },
                })
                .then((res) => {
                    const tokenInfo = res.data.tokenInfo
                    const name = tokenInfo.name

                    setUserName(name)
                })
                .catch((error) => {
                    console.error('Ошибка при выполнении запроса: api/auth/me', error)
                })

            if (!token) {
                console.error('Ошибка при получении superset access_token!')

                return
            }

            const { data } = await axios.post(
                `${domain}/api/v1/security/guest_token/`,
                {
                    user: {
                        username: guestUsername,
                        first_name: guestFirstname,
                        last_name: guestLastname,
                    },
                    rls: [],
                    resources: [
                        {
                            type: 'dashboard',
                            id: dashboardId,
                        },
                    ],
                },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token.access_token}`,
                    },
                },
            )

            if (!data) {
                console.error('Ошибка при получении superset guest_token!')

                return
            }

            return data.token
        } catch (error) {
            console.error(error)
        }
    }, [])

    useEffect(() => {
        embedDashboard({
            id: dashboardId,
            supersetDomain: domain,
            mountPoint: document?.getElementById('superset-dashboards'),
            fetchGuestToken: () => fetchGuestToken(),
            dashboardUiConfig: {
                hideTitle: true,
                filters: {
                    expanded: true,
                },
            },
        }).catch((error) => {
            console.error(error?.message)
        })
    }, [])
}
