import { notFound } from "next/navigation";
import StaticArticle from "@/components/StaticArticle";
import { getContent, paths, type Lang } from "@/lib/content";
import { UI } from "@/lib/ui";
import { absoluteUrl } from "@/lib/site";

// Page de lecture d'une carte (texte complet, indexable) dans la langue demandée
export default function CardPageContent({ lang, id }: { lang: Lang; id: string }) {
  const { CARDS } = getContent(lang);
  const card = CARDS.find((c) => c.id === id);
  if (!card) notFound();
  const t = UI[lang];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: card.title,
    description: card.shortDescription,
    inLanguage: lang,
    image: absoluteUrl(card.frontImage),
    isPartOf: { "@type": "WebSite", name: t.siteName, url: absoluteUrl(paths.home(lang)) },
    publisher: {
      "@type": "Organization",
      name: lang === "fr" ? "Comité Français des Barrages et Réservoirs (CFBR)" : "French Committee on Large Dams (CFBR)",
      url: "https://www.barrages-cfbr.eu/",
    },
    mainEntityOfPage: absoluteUrl(paths.card(lang, card.id)),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <StaticArticle lang={lang} card={card} siblings={CARDS.filter((c) => c.familyId === card.familyId)} />
    </>
  );
}
