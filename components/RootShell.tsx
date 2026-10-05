import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import type { Lang } from "@/lib/content";
import { UI } from "@/lib/ui";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false, // uniquement utilisée par l'éditeur de développement
});

// Coque <html> partagée par les deux versions du site (une mise en page racine par langue, pour <html lang>)
export default function RootShell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return (
    <html lang={UI[lang].htmlLang} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
