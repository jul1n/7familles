import type { Metadata } from "next";
import { asset } from "./asset";
import { getContent, paths, type Lang } from "./content";
import { SITE_URL, absoluteUrl } from "./site";
import { UI } from "./ui";

// Les images de partage et les liens utilisent des chemins relatifs à metadataBase (qui contient déjà le préfixe du site)
const ogImage = (lang: Lang, name: string) => (lang === "fr" ? `/og/${name}.jpg` : `/og/en/${name}.jpg`);

// Liens entre les deux versions d'une même page (hreflang)
function alternates(frPath: string, enPath: string, current: Lang): Metadata["alternates"] {
  return {
    canonical: absoluteUrl(current === "fr" ? frPath : enPath),
    languages: { fr: absoluteUrl(frPath), en: absoluteUrl(enPath), "x-default": absoluteUrl(frPath) },
  };
}

export function rootMetadata(lang: Lang): Metadata {
  const t = UI[lang];
  const title = lang === "fr" ? "7 Familles des Barrages – CFBR" : "The 7 Families of Dams – CFBR";
  return {
    metadataBase: new URL(SITE_URL + "/"),
    title: { default: title, template: `%s – ${t.siteName}` },
    description: t.siteDescription,
    applicationName: t.siteName,
    alternates: alternates("/", "/en/", lang),
    icons: {
      icon: [
        { url: asset("/icons/icon-192.png"), sizes: "192x192", type: "image/png" },
        { url: asset("/icons/icon-512.png"), sizes: "512x512", type: "image/png" },
      ],
      apple: asset("/icons/apple-touch-icon.png"),
    },
    openGraph: {
      type: "website",
      locale: lang === "fr" ? "fr_FR" : "en_GB",
      alternateLocale: lang === "fr" ? ["en_GB"] : ["fr_FR"],
      siteName: t.siteName,
      title,
      description: t.siteDescription,
      url: absoluteUrl(paths.home(lang)),
      images: [{ url: ogImage(lang, "accueil"), width: 1200, height: 630, alt: t.siteName }],
    },
    twitter: { card: "summary_large_image", title, description: t.siteDescription, images: [ogImage(lang, "accueil")] },
  };
}

export function cardMetadata(lang: Lang, id: string): Metadata {
  const card = getContent(lang).CARDS.find((c) => c.id === id);
  if (!card) return {};
  const t = UI[lang];
  const title = `${card.title} – ${card.familyName}`;
  return {
    title,
    description: card.shortDescription,
    alternates: alternates(paths.card("fr", id), paths.card("en", id), lang),
    openGraph: {
      type: "article",
      locale: lang === "fr" ? "fr_FR" : "en_GB",
      siteName: t.siteName,
      title,
      description: card.shortDescription,
      url: absoluteUrl(paths.card(lang, id)),
      images: [{ url: ogImage(lang, id), width: 1200, height: 630, alt: card.title }],
    },
    twitter: { card: "summary_large_image", title, description: card.shortDescription, images: [ogImage(lang, id)] },
  };
}

export function familyMetadata(lang: Lang, id: string): Metadata {
  const fam = getContent(lang).FAMILIES.find((f) => f.id === id);
  if (!fam) return {};
  const t = UI[lang];
  const title = t.familyOf(fam.name);
  return {
    title,
    description: fam.description,
    alternates: alternates(paths.family("fr", id), paths.family("en", id), lang),
    openGraph: {
      type: "website",
      locale: lang === "fr" ? "fr_FR" : "en_GB",
      siteName: t.siteName,
      title,
      description: fam.description,
      url: absoluteUrl(paths.family(lang, id)),
      images: [{ url: ogImage(lang, "accueil"), width: 1200, height: 630, alt: t.siteName }],
    },
  };
}

export function rulesMetadata(lang: Lang): Metadata {
  const t = UI[lang];
  const description =
    lang === "fr"
      ? "Règles du jeu des 7 familles des barrages : matériel, but du jeu, déroulement d’une partie, fin de partie, liste des 42 cartes, présentation du CFBR et des auteurs."
      : "Rules of the 7 Families of Dams card game: contents, goal, how to play, end of the game, the list of the 42 cards, and the CFBR and authors of the game.";
  return {
    title: t.rulesTitle,
    description,
    alternates: alternates("/regles/", "/en/rules/", lang),
    openGraph: {
      type: "article",
      locale: lang === "fr" ? "fr_FR" : "en_GB",
      siteName: t.siteName,
      title: `${t.rulesTitle} – ${t.siteName}`,
      description,
      url: absoluteUrl(paths.rules(lang)),
      images: [{ url: ogImage(lang, "accueil"), width: 1200, height: 630, alt: t.siteName }],
    },
  };
}
