// Préfixe des ressources statiques (public/) quand le site est servi sous un sous-chemin,
// par exemple GitHub Pages : https://<user>.github.io/7familles → NEXT_PUBLIC_BASE_PATH="/7familles".
// Vide en développement local.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${BASE}${path}`;
}
