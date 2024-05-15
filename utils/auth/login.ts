import axios from "axios";

interface LoginProps {
    email: string,
    password: string
}

const login = async (props: LoginProps) => {

    const { email, password } = props

    await axios.get('http://localhost:8000/sanctum/csrf-cookie')

    const response = await axios.post('http://localhost:8000/api/login', {
        email: email,
        password: password
    }, {
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
        withCredentials: true,
        withXSRFToken: true
    });

    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

}
export default login