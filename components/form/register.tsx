"use client";

import { useState } from 'react';
import router from "next/router";
import axios from '../../lib/axios'


interface ValidationErrors {
    [key: string]: string[];
}

const RegisterForm = () => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    //   const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<ValidationErrors | null>(null);

    const registerUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const token = await axios.get('http://localhost:8000/sanctum/csrf-cookie')

            // const response = await axios.post(`${process.env.API_URL}/api/register`, {
                const response = await axios.post(`http://localhost:8000/api/register`, {
                name,
                email,
                password,
                // confirmPassword,
            });
            // Stocker le token d'authentification
            localStorage.setItem('authToken', response.data.access_token);
            // Rediriger l'utilisateur
            router.push('/login');

        } catch (error) {
            // Gérer les erreurs de validation
            if (error instanceof Error) {
                console.log(error)
                // setError(error)      
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
            {/* <div>
        <label htmlFor="confirmPassword">Confirmer le mot de passe :</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div> */}
            {/* {error && (
        <div>
          {Object.values(error).map((messages, index) => (
            <p key={index}>{messages[0]}</p>
          ))}
        </div>
      )} */}
            <button type="submit">S'inscrire</button>
        </form>
    );
};

export default RegisterForm;
