import { CARDS as FR_CARDS, type CardData } from "@/data/cards";
import type { Lang } from "./content";
import { CARD_LINKS } from "./card-links";

export interface ExternalLink {
  label: string;
  url: string;
}

export const CFBR_URL = "https://www.barrages-cfbr.eu/";
// Mentions légales et données personnelles : page de référence du site du CFBR (où le jeu sera hébergé à terme)
export const LEGAL_URL = "https://www.barrages-cfbr.eu/Mentions-legales.html";
export const CFBR_CONTACT_URL = "https://www.barrages-cfbr.eu/Contactez-nous.html";
export const GET_COPY_TEXT =
  "Le jeu est vendu à prix coûtant et n’a fait l’objet que d’une diffusion en petite quantité. Contactez le CFBR pour savoir où et comment vous en procurer un exemplaire.";
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

// --- Version anglaise des liens « En savoir plus » ---
const EN_LABELS: Record<string, string> = {
  "Alimentation en eau": "Water supply",
  "Auscultation des barrages et digues": "Monitoring of dams and levees",
  "Barrage": "Dam",
  "Barrage Hoover": "Hoover Dam",
  "Barrage Zola": "Zola Dam",
  "Barrage de Dardennes": "Dardennes Dam",
  "Barrage de Kariba": "Kariba Dam",
  "Barrage de Migouélou": "Migouélou Dam",
  "Barrage de Serre-Ponçon": "Serre-Ponçon Dam",
  "Barrage de la Grande-Dixence": "Grande Dixence Dam",
  "Barrage de la Rance": "Rance Dam",
  "Barrage des Trois-Gorges": "Three Gorges Dam",
  "Barrage du Rizzanese": "Rizzanese Dam",
  "Barrage d’Itaipu": "Itaipu Dam",
  "Barrage en remblai": "Embankment dam",
  "Barrage-poids": "Gravity dam",
  "Barrage-voûte": "Arch dam",
  "Barrages en terre": "Earth dams",
  "Barrages-poids": "Gravity dams",
  "Barrages-voûtes": "Arch dams",
  "Bulletin sur la surveillance": "Bulletin on dam surveillance",
  "Base documentaire": "Document library",
  "Statistiques nationales": "National statistics",
  "dimensionnement des évacuateurs de crues": "design of spillways",
  "E-Dictionnaire technique des barrages": "Technical dictionary of dams",
  "Registre mondial des barrages": "World Register of Dams",
  "Sécurité des barrages": "Dam safety",
  "Technologie des barrages": "Dam technology",
  "Canal": "Canal",
  "Canal Seine-Nord Europe": "Seine-Nord Europe Canal",
  "Canal Seine-Nord Europe – site officiel": "Seine-Nord Europe Canal – official site",
  "Canal de Suez": "Suez Canal",
  "Canal du Midi": "Canal du Midi",
  "Classes de barrages": "Dam classes",
  "Digue": "Levee",
  "Débit réservé": "Minimum flow",
  "Déversoir": "Weir",
  "E-Dictionnaire technique": "Technical dictionary",
  "Présentation du Rizzanese": "Presentation of the Rizzanese dam",
  "Usine marémotrice de la Rance": "Rance tidal power station",
  "Eau potable": "Drinking water",
  "Grand canal d’Alsace": "Grand Canal d'Alsace",
  "page officielle du barrage": "official page of the dam",
  "Géotechnique": "Geotechnical engineering",
  "Hydroélectricité": "Hydropower",
  "Hydroélectricité (Kembs et Grand Canal)": "Hydropower (Kembs and the Grand Canal)",
  "Irrigation": "Irrigation",
  "Irrigation et agriculture": "Irrigation and agriculture",
  "site officiel": "official site",
  "La conception des barrages": "The design of dams",
  "Les métiers de la conception": "Design jobs",
  "Levée de la Loire": "Loire levees",
  "PPI de certains aménagements hydrauliques (article R.741-18)": "emergency plans (PPI) for some hydraulic structures (article R.741-18)",
  "classement des barrages (article R.214-112)": "classification of dams (article R.214-112)",
  "Navigation": "Navigation",
  "Explore2, les futurs de l’eau": "Explore2, the futures of water",
  "Pompage-turbinage": "Pumped-storage hydropower",
  "Pont du Gard": "Pont du Gard",
  "Bilan électrique 2025 (production hydraulique)": "2025 electricity report (hydropower output)",
  "Retour d’expérience sur les levées de la Loire": "Lessons learned on the Loire levees",
  "Soutien d’étiage": "Low-flow support",
  "histoire du canal": "history of the canal",
  "Surveillance des barrages": "Dam surveillance",
  "Takamaka I": "Takamaka I",
  "Takamaka II": "Takamaka II",
  "Tourisme et barrages": "Tourism and dams",
  "Transport fluvial": "Inland waterway transport",
  "Travaux et références sur les digues": "Works and references on levees",
  "Canal du Midi, le génie de Pierre-Paul Riquet": "Canal du Midi, the genius of Pierre-Paul Riquet",
  "Écrêtement des crues": "Flood peak reduction",
  "Énergie hydroélectrique": "Hydroelectric power",
  "Évacuateurs de crue": "Spillways",
};

const EN_PREFIX: Record<string, string> = {
  Wikipédia: "Wikipedia (in French)",
  CIGB: "ICOLD",
  Légifrance: "Légifrance (in French)",
  OFB: "OFB (in French)",
  RTE: "RTE (in French)",
  VNF: "VNF (in French)",
  UNESCO: "UNESCO",
  "EDF Corse": "EDF Corsica (in French)",
  "EDF": "EDF (in French)",
  "Grande Dixence": "Grande Dixence",
};

function translateLabel(label: string): string {
  const i = label.indexOf(" – ");
  if (i < 0) {
    const whole = EN_LABELS[label];
    return whole ?? label;
  }
  const prefix = label.slice(0, i);
  const rest = label.slice(i + 3);
  const full = EN_LABELS[label];
  if (full) return `${EN_PREFIX[prefix] ?? prefix} – ${full}`;
  const restEn = EN_LABELS[rest] ?? rest;
  const prefixEn = EN_PREFIX[prefix] ?? (prefix === "CFBR" ? "CFBR (in French)" : prefix);
  return `${prefixEn} – ${restEn}`;
}

// Terme de la carte dans l'autre langue : l'anglais pour le site français, le français pour le site anglais
export function otherLanguageTerm(card: CardData, lang: Lang): { term: string; wiki?: ExternalLink } | undefined {
  if (lang === "fr") {
    const term = englishTerm(card);
    return term ? { term, wiki: englishWiki(card) } : undefined;
  }
  const fr = FR_CARDS.find((c) => c.id === card.id);
  const ref = CARD_REFS[card.id];
  if (!fr) return undefined;
  return {
    term: fr.title,
    wiki: ref ? { label: `Wikipédia – ${ref.wiki.replace(/_/g, " ")}`, url: `https://fr.wikipedia.org/wiki/${encodeURI(ref.wiki)}` } : undefined,
  };
}

// Terme anglais de la carte (pour savoir comment on le dit à l'international)
export function englishTerm(card: CardData): string | undefined {
  return CARD_REFS[card.id]?.en;
}

// Liens « pour aller plus loin » d'une carte : une sélection faite à la main (voir card-links.ts), sinon une
// recherche Wikipédia sur le titre de la carte.
export function cardLinks(card: CardData, lang: Lang = "fr"): ExternalLink[] {
  const fr = FR_CARDS.find((c) => c.id === card.id) ?? card;
  const links = CARD_LINKS[card.id] ?? [
    { label: "Wikipédia", url: `https://fr.wikipedia.org/w/index.php?search=${encodeURIComponent(fr.title)}` },
  ];
  if (lang === "fr") return links;
  // Version anglaise : pages Wikipédia anglaises quand elles existent, pages ICOLD en anglais, libellés traduits
  const enWikiLink = englishWiki(card);
  const out: ExternalLink[] = [];
  let wikiDone = false;
  for (const l of links) {
    if (l.label.startsWith("Wikipédia")) {
      if (enWikiLink && !wikiDone) {
        out.push(enWikiLink);
        wikiDone = true;
      } else if (!enWikiLink) {
        out.push({ label: translateLabel(l.label), url: l.url });
      }
      continue;
    }
    out.push({ label: translateLabel(l.label), url: l.url.replace("icold-cigb.org/FR/", "icold-cigb.org/GB/") });
  }
  return out;
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

// Auteurs du jeu (d'après la page « Auteurs du jeu » du jeu de cartes)
export const GAME_AUTHORS = [
  { name: "CODOR du CFBR", description: "" },
  {
    name: "Franck Sfiligoï Taillandier",
    description:
      "Chercheur à l’INRAE spécialisé en génie civil et gestion des risques, il développe des outils pour sensibiliser à la protection des écosystèmes.",
  },
  {
    name: "Hello bim bam boum",
    description:
      "Studio de graphisme spécialisé en vulgarisation scientifique et ludo-pédagogie, fondé par Coline Mestas et Marine Monseux.",
  },
];

// --- Textes communs dans les deux langues ---
export function getCopyText(lang: Lang): string {
  return lang === "fr"
    ? GET_COPY_TEXT
    : "The game is sold at cost price and was only distributed in small quantities. It is currently published in French only. Contact the CFBR to find out where and how to get a copy.";
}

export function gameAuthors(lang: Lang) {
  if (lang === "fr") return GAME_AUTHORS;
  return [
    { name: "CODOR of the CFBR", description: "" },
    {
      name: "Franck Sfiligoï Taillandier",
      description:
        "A researcher at INRAE specialized in civil engineering and risk management, he develops tools to raise awareness about protecting ecosystems.",
    },
    {
      name: "Hello bim bam boum",
      description:
        "A graphic design studio specialized in science communication and educational games, founded by Coline Mestas and Marine Monseux.",
    },
  ];
}
