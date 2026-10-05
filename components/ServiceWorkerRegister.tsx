"use client";

import { useEffect } from "react";
import { asset } from "@/lib/asset";

// Enregistre le service worker (installation sur l'écran d'accueil, lecture hors ligne) sur le site publié uniquement
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(asset("/sw.js"), { scope: asset("/") }).catch(() => undefined);
  }, []);
  return null;
}
