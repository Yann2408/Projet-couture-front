'use client'

import endpoints from '../endpoints'
import axios from 'axios'

const logout = async () => {

    const accessToken = localStorage.getItem('access_token')

    await axios.post(endpoints.logout, null, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
    })

    localStorage.removeItem('access_token')
    localStorage.removeItem('user')

}
export default logout

