import { CARDS, FAMILIES, type CardData, type FamilyData } from "@/data/cards";
import { EN_CARDS, EN_FAMILIES } from "@/data/en";

export type Lang = "fr" | "en";

export const LANGS: Lang[] = ["fr", "en"];

// Textes des cartes et des familles dans la langue demandée (les identifiants, images et crédits ne changent pas).
export function getContent(lang: Lang): { FAMILIES: FamilyData[]; CARDS: CardData[] } {
  if (lang === "fr") return { FAMILIES, CARDS };
  return {
    FAMILIES: FAMILIES.map((f) => ({ ...f, ...(EN_FAMILIES[f.id] ?? {}) })),
    CARDS: CARDS.map((c) => {
      const en = EN_CARDS[c.id];
      return en
        ? {
            ...c,
            frontImage: c.frontImage.replace("/cards/", "/cards/en/"),
            title: en.title,
            shortDescription: en.shortDescription,
            contentMarkdown: en.contentMarkdown,
            location: en.location ?? c.location,
            period: en.period ?? c.period,
            familyName: EN_FAMILIES[c.familyId]?.name ?? c.familyName,
          }
        : c;
    }),
  };
}

// Chemins des pages selon la langue (le français garde ses adresses historiques)
export const paths = {
  home: (lang: Lang) => (lang === "fr" ? "/" : "/en/"),
  card: (lang: Lang, id: string) => (lang === "fr" ? `/carte/${id}/` : `/en/card/${id}/`),
  family: (lang: Lang, id: string) => (lang === "fr" ? `/famille/${id}/` : `/en/family/${id}/`),
  rules: (lang: Lang) => (lang === "fr" ? "/regles/" : "/en/rules/"),
};
