import type { CardData } from "@/data/cards";

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
  "metiers-proprietaire": { wiki: "Concession_hydroélectrique_en_France", en: "Dam owner / concession holder" },
  "metiers-conceptrice": { wiki: "Ingénieur_en_génie_civil", en: "Dam design engineer", enWiki: "Civil_engineering" },
  "metiers-constructeur": { wiki: "Entreprise_de_bâtiment_et_travaux_publics", en: "Construction contractor", enWiki: "General_contractor" },
  "metiers-expert-securite": { wiki: "Sûreté_des_barrages", en: "Dam safety engineer", enWiki: "Dam_safety_program" },
  "metiers-hydrologue": { wiki: "Hydrologie", en: "Hydrologist", enWiki: "Hydrology" },
  "metiers-geologue": { wiki: "Géologie", en: "Geologist", enWiki: "Geology" },
  "usages-eau-potable": { wiki: "Eau_potable", en: "Drinking water", enWiki: "Drinking_water" },
  "usages-hydroelectricite": { wiki: "Énergie_hydroélectrique", en: "Hydropower", enWiki: "Hydroelectricity" },
  "usages-irrigation": { wiki: "Irrigation", en: "Irrigation", enWiki: "Irrigation" },
  "usages-regulation-debit": { wiki: "Débit_(cours_d'eau)", en: "Flow regulation / low-flow support", enWiki: "Streamflow" },
  "usages-transport": { wiki: "Transport_fluvial", en: "Inland waterway transport", enWiki: "Inland_waterways_of_Europe" },
  "usages-tourisme": { wiki: "Tourisme_fluvial", en: "Tourism and recreation", enWiki: "Reservoir_recreation" },
  "composants-corps": { wiki: "Barrage", en: "Dam body", enWiki: "Dam" },
  "composants-evacuateur": { wiki: "Évacuateur_de_crues", en: "Spillway", enWiki: "Spillway" },
  "composants-fondation": { wiki: "Fondation_(construction)", en: "Foundation", enWiki: "Foundation_(engineering)" },
  "composants-prise-deau": { wiki: "Prise_d'eau", en: "Intake / water intake", enWiki: "Intake_tower" },
  "composants-capteurs": { wiki: "Auscultation_des_barrages", en: "Instrumentation and monitoring sensors", enWiki: "Dam_safety_program" },
  "composants-riviere": { wiki: "Cours_d'eau", en: "River", enWiki: "River" },
  "types-barrage-remblai": { wiki: "Barrage_en_remblai", en: "Embankment dam", enWiki: "Embankment_dam" },
  "types-barrage-poids": { wiki: "Barrage-poids", en: "Gravity dam", enWiki: "Gravity_dam" },
  "types-barrage-voute": { wiki: "Barrage_voûte", en: "Arch dam", enWiki: "Arch_dam" },
  "types-canaux": { wiki: "Canal_(voie_navigable)", en: "Canal", enWiki: "Canal" },
  "types-digue-protection": { wiki: "Digue", en: "Flood protection levee / dike", enWiki: "Levee" },
  "types-step": { wiki: "Station_de_transfert_d'énergie_par_pompage", en: "Pumped-storage hydroelectricity (PSH)", enWiki: "Pumped-storage_hydroelectricity" },
  "monde-itaipu": { wiki: "Barrage_d'Itaipu", en: "Itaipu Dam", enWiki: "Itaipu_Dam" },
  "monde-canal-suez": { wiki: "Canal_de_Suez", en: "Suez Canal", enWiki: "Suez_Canal" },
  "monde-grande-dixence": { wiki: "Barrage_de_la_Grande-Dixence", en: "Grande Dixence Dam", enWiki: "Grande_Dixence_Dam" },
  "monde-kariba": { wiki: "Barrage_de_Kariba", en: "Kariba Dam", enWiki: "Kariba_Dam" },
  "monde-trois-gorges": { wiki: "Barrage_des_Trois-Gorges", en: "Three Gorges Dam", enWiki: "Three_Gorges_Dam" },
  "monde-hoover-dam": { wiki: "Barrage_Hoover", en: "Hoover Dam", enWiki: "Hoover_Dam" },
  "france-serre-poncon": { wiki: "Barrage_de_Serre-Ponçon", en: "Serre-Ponçon Dam", enWiki: "Serre-Pon%C3%A7on_Dam" },
  "france-migouelou": { wiki: "Barrage_de_Migouélou", en: "Migouélou Dam" },
  "france-rance": { wiki: "Usine_marémotrice_de_la_Rance", en: "Rance Tidal Power Station", enWiki: "Rance_Tidal_Power_Station" },
  "france-canal-alsace": { wiki: "Grand_Canal_d'Alsace", en: "Grand Canal d'Alsace", enWiki: "Grand_Canal_d%27Alsace" },
  "france-levees-loire": { wiki: "Levées_de_la_Loire", en: "Loire levees", enWiki: "Levee" },
  "france-takamaka": { wiki: "Usine_hydroélectrique_de_Takamaka", en: "Takamaka hydroelectric plant" },
  "temps-pont-du-gard": { wiki: "Pont_du_Gard", en: "Pont du Gard (Roman aqueduct)", enWiki: "Pont_du_Gard" },
  "temps-canal-du-midi": { wiki: "Canal_du_Midi", en: "Canal du Midi", enWiki: "Canal_du_Midi" },
  "temps-barrage-zola": { wiki: "Barrage_Zola", en: "Zola Dam", enWiki: "Zola_Dam" },
  "temps-barrage-dardennes": { wiki: "Barrage_de_Dardennes", en: "Dardennes Dam" },
  "temps-barrage-rizzanese": { wiki: "Barrage_du_Rizzanese", en: "Rizzanese Dam" },
  "temps-canal-seine-nord": { wiki: "Canal_Seine-Nord_Europe", en: "Seine-Nord Europe Canal", enWiki: "Seine%E2%80%93Nord_Europe_Canal" },
};

// Terme anglais de la carte (pour savoir comment on le dit à l'international)
export function englishTerm(card: CardData): string | undefined {
  return CARD_REFS[card.id]?.en;
}

// Liens d'approfondissement d'une carte : Wikipédia (français, puis anglais si connu),
// puis les sites de référence.
export function cardLinks(card: CardData): ExternalLink[] {
  const ref = CARD_REFS[card.id];
  const links: ExternalLink[] = [];
  if (ref) {
    links.push({ label: "Wikipédia", url: `https://fr.wikipedia.org/wiki/${ref.wiki}` });
    if (ref.enWiki) links.push({ label: "Wikipedia (EN)", url: `https://en.wikipedia.org/wiki/${ref.enWiki}` });
  } else {
    links.push({ label: "Wikipédia", url: `https://fr.wikipedia.org/w/index.php?search=${encodeURIComponent(card.title)}` });
  }
  links.push({ label: "Les Architectes de l’Eau", url: ARCHITECTES_URL }, { label: "Site du CFBR", url: CFBR_URL });
  return links;
}
