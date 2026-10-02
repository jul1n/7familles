import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { asset } from "@/lib/asset";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false, // uniquement utilisée par l'éditeur de développement
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL + "/"),
  title: { default: "7 Familles des Barrages – CFBR", template: "%s – 7 Familles des Barrages" },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: absoluteUrl("/") },
  icons: {
    icon: [
      { url: asset("/icons/icon-192.png"), sizes: "192x192", type: "image/png" },
      { url: asset("/icons/icon-512.png"), sizes: "512x512", type: "image/png" },
    ],
    apple: asset("/icons/apple-touch-icon.png"),
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE_NAME,
    title: "7 Familles des Barrages – CFBR",
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    images: [{ url: "/og/accueil.jpg", width: 1200, height: 630, alt: "7 Familles des Barrages, le jeu des 42 cartes du CFBR" }],
  },
  twitter: { card: "summary_large_image", title: "7 Familles des Barrages – CFBR", description: SITE_DESCRIPTION, images: ["/og/accueil.jpg"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F5F0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
