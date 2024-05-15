import axios from "axios"
import endpoints from "../endpoints";

interface RegisterProps {
    name: string
    email: string
    password: string
}

const register = async (props: RegisterProps) => {

    const { name, email, password } = props

    await axios.get('http://localhost:8000/sanctum/csrf-cookie')

    const response = await axios.post(endpoints.register, {
        name,
        email,
        password,
    });

    localStorage.setItem('authToken', response.data.access_token);

}
export default register