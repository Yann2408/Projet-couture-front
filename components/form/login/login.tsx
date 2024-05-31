"use client";

import login from "@/utils/auth/login";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from 'yup';
import style from './login.module.css';


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

            await loginSchema.validate(data, { abortEarly: false })

            await login(data)

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
        <div className={style.body}>
            <div className={style.container}>
                <h1 className={style.title}>Connecte toi</h1>
                <input
                    className={style.input}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className={style.input}
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className={style.button} onClick={handleLogin}>Se connecter</button>
                {errors.password && <p className={style.error}>{errors.password}</p>}
                {errors.email && <p className={style.error}>{errors.email}</p>}
                {tokenError && <p className={style.error}>{tokenError}</p>}
            </div>
        </div>
    );
}
export default LoginForm