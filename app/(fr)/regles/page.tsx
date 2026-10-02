import type { Metadata } from "next";
import RulesArticle from "@/components/RulesArticle";
import { rulesMetadata } from "@/lib/seo";
import { UI } from "@/lib/ui";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = rulesMetadata("fr");

export default function ReglesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Règles du jeu des 7 familles des barrages",
    inLanguage: "fr",
    isPartOf: { "@type": "WebSite", name: UI.fr.siteName, url: absoluteUrl("/") },
    publisher: { "@type": "Organization", name: "Comité Français des Barrages et Réservoirs (CFBR)", url: "https://www.barrages-cfbr.eu/" },
    mainEntityOfPage: absoluteUrl("/regles/"),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <RulesArticle lang="fr" />
    </>
  );
}
