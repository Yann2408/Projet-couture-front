"use client";

import { useState } from 'react';
import endpoints from '@/utils/endpoints';
import * as Yup from 'yup';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';


interface ValidationErrors {
    [key: string]: string;
}

interface ApiErrorResponse {
    errors: {
        [key: string]: string[];
    };
}

const RegisterForm = () => {

    const router = useRouter()

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<ValidationErrors | null>(null);

    const registerSchema = Yup.object({
        name: Yup.string().required('Le nom est obligatoire'),
        email: Yup.string()
            .email()
            .required('L\'email est obligatoire'),
        password: Yup.string()
            .required('Le mot de passe est obligatoire'),
    });

    const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        setErrors({})

        const data = {
            name: name,
            email: email,
            password: password
        }

        try {
            const token = await axios.get('http://localhost:8000/sanctum/csrf-cookie')

            await registerSchema.validate(data, { abortEarly: false })

            
                const response = await axios.post(endpoints.register, {
                name,
                email,
                password,
            });
            
            localStorage.setItem('authToken', response.data.access_token);
            
            router.push('/login');

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
    };

    return (
        <form onSubmit={registerUser}>
            <div>
                <label htmlFor="name">Nom :</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="email">Email :</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Mot de passe :</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            
            {errors && (
        <div>
          {Object.values(errors).map((messages, index) => (
            <p key={index}>{messages[0]}</p>
          ))}
        </div>
      )}
            <button type="submit">S'inscrire</button>
        </form>
    );
};

export default RegisterForm;
