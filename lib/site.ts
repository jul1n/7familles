// Adresse publique du site (GitHub Pages par défaut). Pour un domaine personnalisé :
// définir NEXT_PUBLIC_SITE_URL (sans barre finale) dans le workflow de déploiement.
export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://jul1n.github.io";
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const SITE_URL = `${SITE_ORIGIN}${BASE}`;
export const SITE_NAME = "7 Familles des Barrages";
export const SITE_DESCRIPTION =
  "Jeu des 7 familles des barrages du Comité Français des Barrages et Réservoirs (1926–2026) : explorez 42 cartes illustrées et leurs fiches pédagogiques.";

// URL absolue d'un chemin du site (ex. "/carte/proprietaire/")
export const absoluteUrl = (path: string) => `${SITE_URL}${path}`;

// Quiz (bouton, fenêtre de jeu et PDF des 10 quiz) : mettre à false pour le masquer sans rien supprimer
export const QUIZ_ENABLED = true;
