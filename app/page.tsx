"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// _app.js
import '@fontsource/playfair-display/400.css' // Poids 400 (normal)
import '@fontsource/playfair-display/500.css' // Poids 500
import '@fontsource/playfair-display/900-italic.css' // Poids 900 italique


export default function Home() {

  const router = useRouter()

  useEffect(() => {
    router.push('/login')
  }, [router])

  return (
    <div></div>
  );
}
