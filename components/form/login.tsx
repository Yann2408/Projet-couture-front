import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginForm = () => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const router = useRouter();

    console.log("email",email)
    console.log("password",password)

    const handleLogin = async () => {

        try {
            const token = await axios.get('http://localhost:8000/sanctum/csrf-cookie')

            console.log('token', token.data)

            const response = await axios.post('http://localhost:8000/api/login', {
            email,
            password
        }, {
            headers: {
                'X-CSRF-TOKEN': token.data
                // 'X-CSRF-TOKEN': window.Laravel.csrfToken
            }
        });

            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            router.push('/dashboard');

        } catch (error) {
            console.error(error);
            // Afficher un message d'erreur à l'utilisateur
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <input
                type="email"
                // placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                // placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}
export default LoginForm