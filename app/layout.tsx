import type { Metadata } from "next";
import { Playfair_Display, Lato } from 'next/font/google'
import "./globals.css";


export const playfairDisplay = Playfair_Display({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--typo-title',
})

export const lato = Lato({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
})

export const metadata: Metadata = {
  title: "Projet couture",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${playfairDisplay.variable} ${lato.variable}`}>{children}</body>
    </html>
  );
}
