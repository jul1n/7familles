import type { CardData } from "@/data/cards";
import { CARD_LINKS } from "./card-links";

export interface ExternalLink {
  label: string;
  url: string;
}

export const CFBR_URL = "https://www.barrages-cfbr.eu/";
export const ARCHITECTES_URL = "https://architectesdeleau.com/";

// Liens « en savoir plus » communs à toute l'application
export const GLOBAL_LINKS: ExternalLink[] = [
  { label: "Site du CFBR", url: CFBR_URL },
  { label: "Les Architectes de l’Eau", url: ARCHITECTES_URL },
];

// Pour chaque carte : titre de l'article Wikipédia français (wiki) et terme anglais (en),
// avec éventuellement la page Wikipédia anglaise (enWiki). Propositions à vérifier une par une.
interface CardRef {
  wiki: string;
  en: string;
  enWiki?: string;
}

const CARD_REFS: Record<string, CardRef> = {
  "metiers-proprietaire": { wiki: "Hydroélectricité_en_France", en: "Dam owner / concession holder" },
  "metiers-conceptrice": { wiki: "Ingénieur_civil", en: "Dam design engineer", enWiki: "Civil_engineer" },
  "metiers-constructeur": { wiki: "Travaux_publics", en: "Construction contractor", enWiki: "General_contractor" },
  "metiers-expert-securite": { wiki: "Barrage", en: "Dam safety engineer", enWiki: "Dam_safety" },
  "metiers-hydrologue": { wiki: "Hydrologie", en: "Hydrologist", enWiki: "Hydrology" },
  "metiers-geologue": { wiki: "Géologie", en: "Geologist", enWiki: "Engineering_geology" },
  "usages-eau-potable": { wiki: "Eau_potable", en: "Drinking water", enWiki: "Drinking_water" },
  "usages-hydroelectricite": { wiki: "Énergie_hydroélectrique", en: "Hydropower", enWiki: "Hydroelectricity" },
  "usages-irrigation": { wiki: "Irrigation", en: "Irrigation", enWiki: "Irrigation" },
  "usages-regulation-debit": { wiki: "Étiage", en: "Flow regulation / low-flow support", enWiki: "Flood_management" },
  "usages-transport": { wiki: "Transport_fluvial", en: "Inland waterway transport", enWiki: "Inland_navigation" },
  "usages-tourisme": { wiki: "Tourisme_fluvial", en: "Tourism and recreation" },
  "composants-corps": { wiki: "Barrage", en: "Dam body", enWiki: "Dam" },
  "composants-evacuateur": { wiki: "Déversoir", en: "Spillway", enWiki: "Spillway" },
  "composants-fondation": { wiki: "Fondation_(construction)", en: "Foundation", enWiki: "Foundation_(engineering)" },
  "composants-prise-deau": { wiki: "Prise_d'eau", en: "Intake / water intake" },
  "composants-capteurs": { wiki: "Barrage", en: "Instrumentation and monitoring sensors", enWiki: "Structural_health_monitoring" },
  "composants-riviere": { wiki: "Cours_d'eau", en: "River", enWiki: "River" },
  "types-barrage-remblai": { wiki: "Barrage_en_remblai", en: "Embankment dam", enWiki: "Embankment_dam" },
  "types-barrage-poids": { wiki: "Barrage-poids", en: "Gravity dam", enWiki: "Gravity_dam" },
  "types-barrage-voute": { wiki: "Barrage-voûte", en: "Arch dam", enWiki: "Arch_dam" },
  "types-canaux": { wiki: "Canal_(voie_d'eau)", en: "Canal", enWiki: "Canal" },
  "types-digue-protection": { wiki: "Digue", en: "Flood protection levee / dike", enWiki: "Levee" },
  "types-step": { wiki: "Pompage-turbinage", en: "Pumped-storage hydroelectricity (PSH)", enWiki: "Pumped-storage_hydroelectricity" },
  "monde-itaipu": { wiki: "Barrage_d'Itaipu", en: "Itaipu Dam", enWiki: "Itaipu_Dam" },
  "monde-canal-suez": { wiki: "Canal_de_Suez", en: "Suez Canal", enWiki: "Suez_Canal" },
  "monde-grande-dixence": { wiki: "Barrage_de_la_Grande-Dixence", en: "Grande Dixence Dam", enWiki: "Grande_Dixence_Dam" },
  "monde-kariba": { wiki: "Barrage_de_Kariba", en: "Kariba Dam", enWiki: "Kariba_Dam" },
  "monde-trois-gorges": { wiki: "Barrage_des_Trois-Gorges", en: "Three Gorges Dam", enWiki: "Three_Gorges_Dam" },
  "monde-hoover-dam": { wiki: "Barrage_Hoover", en: "Hoover Dam", enWiki: "Hoover_Dam" },
  "france-serre-poncon": { wiki: "Barrage_de_Serre-Ponçon", en: "Serre-Ponçon Dam" },
  "france-migouelou": { wiki: "Lac_de_Migouélou", en: "Migouélou Dam" },
  "france-rance": { wiki: "Usine_marémotrice_de_la_Rance", en: "Rance Tidal Power Station", enWiki: "Rance_Tidal_Power_Station" },
  "france-canal-alsace": { wiki: "Grand_canal_d'Alsace", en: "Grand Canal d'Alsace", enWiki: "Grand_Canal_of_Alsace" },
  "france-levees-loire": { wiki: "Levée_de_la_Loire", en: "Loire levees", enWiki: "Levee" },
  "france-takamaka": { wiki: "Barrage_hydroélectrique_de_Takamaka_II", en: "Takamaka hydroelectric plant" },
  "temps-pont-du-gard": { wiki: "Pont_du_Gard", en: "Pont du Gard (Roman aqueduct)", enWiki: "Pont_du_Gard" },
  "temps-canal-du-midi": { wiki: "Canal_du_Midi", en: "Canal du Midi", enWiki: "Canal_du_Midi" },
  "temps-barrage-zola": { wiki: "Barrage_Zola", en: "Zola Dam", enWiki: "Zola_Dam" },
  "temps-barrage-dardennes": { wiki: "Lac_du_Revest", en: "Dardennes Dam" },
  "temps-barrage-rizzanese": { wiki: "Barrage_du_Rizzanese", en: "Rizzanese Dam", enWiki: "Rizzanese_Reservoir" },
  "temps-canal-seine-nord": { wiki: "Canal_Seine-Nord_Europe", en: "Seine-Nord Europe Canal", enWiki: "Seine–Nord_Europe_Canal" },
};

// Terme anglais de la carte (pour savoir comment on le dit à l'international)
export function englishTerm(card: CardData): string | undefined {
  return CARD_REFS[card.id]?.en;
}

// Liens « pour aller plus loin » d'une carte : une sélection faite à la main (voir card-links.ts), sinon une
// recherche Wikipédia sur le titre de la carte.
export function cardLinks(card: CardData): ExternalLink[] {
  return (
    CARD_LINKS[card.id] ?? [
      { label: "Wikipédia", url: `https://fr.wikipedia.org/w/index.php?search=${encodeURIComponent(card.title)}` },
    ]
  );
}

// Page Wikipédia anglaise exacte de la carte, quand il en existe une pertinente (affichée sur le terme anglais)
export function englishWiki(card: CardData): ExternalLink | undefined {
  const title = CARD_REFS[card.id]?.enWiki;
  if (!title) return undefined;
  return { label: `Wikipedia EN – ${title.replace(/_/g, " ")}`, url: `https://en.wikipedia.org/wiki/${encodeURI(title)}` };
}

// Agence de design des cartes (illustrations et mise en page)
export const BIMBAMBOUM = {
  name: "Hello Bim Bam Boum",
  linkedin: "https://www.linkedin.com/company/hello-bim-bam-boum/",
  instagram: "https://www.instagram.com/hello.bimbamboum/",
  handle: "@hello.bimbamboum",
  description:
    "Studio de design fondé par Marine Monseux et Coline Mestas, graphistes et didacticiennes diplômées de la Haute école des arts du Rhin (Strasbourg). Il transmet des savoirs par le design graphique, l’illustration et les jeux sérieux, entre vulgarisation, pédagogie, ludisme et médiation, avec curiosité, engagement et une touche d’humour. Basé entre Strasbourg, Paris, Marseille et Nancy.",
};
