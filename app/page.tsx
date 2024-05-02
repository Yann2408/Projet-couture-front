"use client";

import Image from "next/image";
import styles from "./page.module.css";
import Login from "../pages/login";
import RegisterForm from "@/components/form/register";
import Register from "./register";
import { useEffect } from "react";
import router, { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter()

  useEffect(() => {
    router.push('/login')
  }, [router])

  return (
    <div></div>
    // <div>Hello</div>
    // <Register/>
    // <Login/>
  );
}
