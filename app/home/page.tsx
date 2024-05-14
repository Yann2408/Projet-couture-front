"use client"

import Logout from "@/utils/auth/logout";
import endpoints from "@/utils/endpoints";
import axios from "axios";
import { useRouter } from "next/navigation";

const Home = () => {

    const router = useRouter()

    const handleLogout = async () => {
        const accessToken = localStorage.getItem('access_token')

        try {
            await axios.post(endpoints.logout, null, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            })

            localStorage.removeItem('access_token')
            localStorage.removeItem('user')

            router.push('/login')
        } catch (error) {
            console.error('Erreur de déconnexion :', error)
        }
    }

    return (
        <button onClick={handleLogout}>Se déconnecter</button>
    )
}
export default Home