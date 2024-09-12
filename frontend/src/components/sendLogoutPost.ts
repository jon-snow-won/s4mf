import axios from 'axios'

export default async function sendLogoutPost() {
    try {
        await axios.post(`/logout?post_logout_redirect_uri=${window.location.origin}`, {})
    } catch (error) {
        console.error('Error during logout:', error)
    }
}
