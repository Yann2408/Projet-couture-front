"use client";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from 'yup';

interface ValidationErrors {
    [key: string]: string;
}

interface ApiErrorResponse {
    errors: {
        [key: string]: string[];
    };
}

const LoginForm = () => {

    const router = useRouter()

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [errors, setErrors] = useState<ValidationErrors>({})
    const [tokenError, setTokenErrors] = useState<string>("")

    const loginSchema = Yup.object({
        email: Yup.string()
            .email()
            .required('L\'email est obligatoire'),
        password: Yup.string()
            .required('Le mot de passe est obligatoire'),
    });

    const handleLogin = async () => {

        setErrors({})
        setTokenErrors("")

        const data = {
            email: email,
            password: password
        }

        try {

            await axios.get('http://localhost:8000/sanctum/csrf-cookie')

            await loginSchema.validate(data, { abortEarly: false })

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
            router.push('/home');

        } 
        catch (error: unknown) {

            const validationErrors: ValidationErrors = {};

            if (error instanceof Yup.ValidationError) {
                error.inner.forEach((err) => {
                    if (err instanceof Yup.ValidationError && err.path !== undefined) {
                        validationErrors[err.path] = err.message;
                    }
                });

                setErrors(validationErrors);

            }
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ApiErrorResponse>;
                if (axiosError.response && axiosError.response.data) {

                    if (axiosError.response.request.status === 419) {
                        setTokenErrors("email ou mot de passe invalide")
                    }
                    const apiErrors = axiosError.response.data.errors;

                    if (apiErrors) {
                        Object.keys(apiErrors).forEach((key) => {
                            validationErrors[key] = apiErrors[key][0];
                        });
                    }
                }
                setErrors(validationErrors);
            }
            else {
                console.error('Une erreur s\'est produite:', error);
            }
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
            {errors.password && <p>{errors.password}</p>}
            {errors.email && <p>{errors.email}</p>}
            {tokenError && <p>{tokenError}</p>}
        </div>
    );
}
export default LoginForm