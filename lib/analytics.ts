// Statistiques de visite sans cookies (GoatCounter) : actives seulement si NEXT_PUBLIC_GOATCOUNTER_CODE est défini
// dans le workflow de déploiement. Aucune donnée personnelle : ni cookie, ni identifiant, ni texte de recherche.
declare global {
  interface Window {
    goatcounter?: { count?: (v: { path: string; title?: string; event?: boolean }) => void };
  }
}

export const ANALYTICS_CODE = process.env.NEXT_PUBLIC_GOATCOUNTER_CODE;

// Une page vue dans l'application (ex. : ouverture d'une fiche, qui ne recharge pas la page)
export function trackView(path: string, title?: string) {
  if (typeof window !== "undefined") window.goatcounter?.count?.({ path, title });
}

// Une action : partage, recherche, installation, écoute…
export function trackEvent(name: string) {
  if (typeof window !== "undefined") window.goatcounter?.count?.({ path: name, event: true });
}
