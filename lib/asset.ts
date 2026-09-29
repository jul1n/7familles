// Préfixe des ressources statiques (public/) quand le site est servi sous un sous-chemin,
// par exemple GitHub Pages : https://<user>.github.io/7familles → NEXT_PUBLIC_BASE_PATH="/7familles".
// Vide en développement local.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${BASE}${path}`;
}

// Miniature d'une carte (360 px de large) : chargée pour le deck, l'éventail et la mosaïque.
// L'image pleine résolution n'est chargée que pour la carte ouverte.
export function thumb(path: string): string {
  return asset(path.replace("/cards/", "/cards/thumbs/"));
}
