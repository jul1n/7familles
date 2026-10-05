// Statistiques de visite sans cookies (GoatCounter) : actives sur le site publié uniquement. Aucune donnée personnelle : ni cookie, ni identifiant, ni texte de recherche.
declare global {
  interface Window {
    goatcounter?: { count?: (v: { path: string; title?: string; event?: boolean }) => void };
  }
}

// Compteur du CFBR (https://cfbr.goatcounter.com) ; la variable NEXT_PUBLIC_GOATCOUNTER_CODE permet d'en utiliser un autre
export const ANALYTICS_CODE = process.env.NEXT_PUBLIC_GOATCOUNTER_CODE || "cfbr";

// Une page vue dans l'application (ex. : ouverture d'une fiche, qui ne recharge pas la page)
export function trackView(path: string, title?: string) {
  if (typeof window !== "undefined") window.goatcounter?.count?.({ path, title });
}

// Une action : partage, recherche, installation, écoute…
export function trackEvent(name: string) {
  if (typeof window !== "undefined") window.goatcounter?.count?.({ path: name, event: true });
}
