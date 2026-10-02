import Link from "next/link";
import { preload } from "react-dom";
import Experience7Familles from "@/components/Experience7Familles";
import { CARDS, FAMILIES } from "@/data/cards";
import { thumb } from "@/lib/asset";
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/site";

export default function Home() {
  // Les couvertures des 7 paquets sont demandées dès le HTML, sans attendre le code de la scène 3D
  FAMILIES.forEach((f) => {
    const first = CARDS.find((c) => c.familyId === f.id && c.num === 1);
    if (first) preload(thumb(first.frontImage), { as: "image" });
  });
  preload(thumb("/cards/card-back.webp"), { as: "image" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: SITE_DESCRIPTION,
    inLanguage: "fr",
    publisher: {
      "@type": "Organization",
      name: "Comité Français des Barrages et Réservoirs (CFBR)",
      url: "https://www.barrages-cfbr.eu/",
      logo: absoluteUrl("/icons/icon-512.png"),
    },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Experience7Familles />
      {/* Plan du jeu : liens vers les fiches (utile aux moteurs de recherche et aux lecteurs d'écran, sans arrêt de tabulation) */}
      <nav className="sr-only" aria-label="Toutes les fiches du jeu">
        <ul>
          {FAMILIES.map((f) => (
            <li key={f.id}>
              <Link href={`/famille/${f.id}/`} tabIndex={-1}>
                Famille {f.name}
              </Link>
              <ul>
                {CARDS.filter((c) => c.familyId === f.id).map((c) => (
                  <li key={c.id}>
                    <Link href={`/carte/${c.id}/`} tabIndex={-1}>
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
