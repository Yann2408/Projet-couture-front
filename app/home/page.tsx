"use client"

import logout from "@/utils/auth/logout";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

interface ValidationErrors {
    [key: string]: string;
}

interface ApiErrorResponse {
    errors: {
        [key: string]: string[];
    };
}

interface AuthProps {
    children: ReactNode;
}

const Home = () => {

    const router = useRouter()

    const [errors, setErrors] = useState<ValidationErrors>({})

    const handleLogout = async () => {

        try {
            await logout()

            router.push('/login')

        }
        catch (error) {

            const validationErrors: ValidationErrors = {};

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
    }

    return (
        <button onClick={handleLogout}>Se déconnecter</button>
    )
}
export default Home