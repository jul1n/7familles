import Link from "next/link";
import { preload } from "react-dom";
import Experience7Familles from "@/components/Experience7Familles";
import { getContent, paths, type Lang } from "@/lib/content";
import { thumb } from "@/lib/asset";
import { UI } from "@/lib/ui";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

// Page d'accueil (jeu 3D / mosaïque) dans la langue demandée, avec les données structurées et le plan des fiches
export default function HomePageContent({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const { FAMILIES, CARDS } = getContent(lang);

  // Les couvertures des 7 paquets sont demandées dès le HTML, sans attendre le code de la scène 3D
  FAMILIES.forEach((f) => {
    const first = CARDS.find((c) => c.familyId === f.id && c.num === 1);
    if (first) preload(thumb(first.frontImage), { as: "image" });
  });
  preload(thumb("/cards/card-back.webp"), { as: "image" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: lang === "fr" ? SITE_NAME : t.siteName,
    url: absoluteUrl(paths.home(lang)),
    description: t.siteDescription,
    inLanguage: lang,
    publisher: {
      "@type": "Organization",
      name: lang === "fr" ? "Comité Français des Barrages et Réservoirs (CFBR)" : "French Committee on Large Dams (CFBR)",
      url: "https://www.barrages-cfbr.eu/",
      logo: absoluteUrl("/icons/icon-512.png"),
    },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Experience7Familles lang={lang} />
      {/* Plan du jeu : liens vers les fiches (utile aux moteurs de recherche et aux lecteurs d'écran, sans arrêt de tabulation) */}
      <nav className="sr-only" aria-label={t.sitemapNav}>
        <ul>
          <li>
            <Link href={paths.rules(lang)} tabIndex={-1}>
              {t.rulesTitle}
            </Link>
          </li>
          {FAMILIES.map((f) => (
            <li key={f.id}>
              <Link href={paths.family(lang, f.id)} tabIndex={-1}>
                {t.familyOf(f.name)}
              </Link>
              <ul>
                {CARDS.filter((c) => c.familyId === f.id).map((c) => (
                  <li key={c.id}>
                    <Link href={paths.card(lang, c.id)} tabIndex={-1}>
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
