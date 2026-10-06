import type { ExternalLink } from "./links";

// Liens « pour aller plus loin » choisis un par un pour chaque carte (un lien de référence CFBR / CIGB /
// exploitant, puis une page Wikipédia ou institutionnelle), à partir de la liste fournie par le CFBR.
// Deux liens au maximum par carte, sauf quand le texte cite deux notions distinctes.

const cfbr = (label: string, path: string): ExternalLink => ({ label: `CFBR – ${label}`, url: `https://www.barrages-cfbr.eu/${path}` });
const cigb = (label: string, path: string): ExternalLink => ({ label: `CIGB – ${label}`, url: `https://www.icold-cigb.org/${path}` });
const wiki = (label: string, title: string): ExternalLink => ({
  label: `Wikipédia – ${label}`,
  url: `https://fr.wikipedia.org/wiki/${encodeURI(title)}`,
});

const CIGB_TECHNOLOGIE = cigb("Technologie des barrages", "FR/barrages/technologie_des_barrages.asp");
const CIGB_SECURITE = cigb("Sécurité des barrages", "FR/barrages/securite_des_barrages.asp");
const CIGB_DICTIONNAIRE = cigb("E-Dictionnaire technique", "FR/publications/e-dictionnaire.asp");
const CFBR_METIERS = cfbr("Les métiers de la conception", "Metiers-40.html");

export const CARD_LINKS: Record<string, ExternalLink[]> = {
  // Métiers
  "metiers-proprietaire": [
    { label: "Légifrance – classement des barrages (article R.214-112)", url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000030594166/" },
    { label: "Légifrance – PPI de certains aménagements hydrauliques (article R.741-18)", url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000031625499" },
    cfbr("Classes de barrages", "classes-de-barrages.html"),
  ],
  "metiers-conceptrice": [
    cfbr("La conception des barrages", "Description-38.html"),
    { label: "CFBR – dimensionnement des évacuateurs de crues", url: "https://www.barrages-cfbr.eu/IMG/pdf/recommandations_cfbr_2013_evc.pdf" },
  ],
  "metiers-constructeur": [CIGB_TECHNOLOGIE, wiki("Barrage", "Barrage")],
  "metiers-expert-securite": [cfbr("Surveillance des barrages", "Surveillance.html"), CIGB_SECURITE],
  "metiers-hydrologue": [
    CFBR_METIERS,
    { label: "OFB – Explore2, les futurs de l’eau", url: "https://ofb.gouv.fr/explore2-des-futurs-de-eau" },
  ],
  "metiers-geologue": [CFBR_METIERS, wiki("Géotechnique", "Géotechnique")],
  // Usages
  "usages-eau-potable": [cfbr("Alimentation en eau", "Alimentation-en-eau.html"), wiki("Eau potable", "Eau_potable")],
  "usages-hydroelectricite": [
    cfbr("Hydroélectricité", "Hydroelectricite.html"),
    { label: "RTE – Bilan électrique 2025 (production hydraulique)", url: "https://assets.rte-france.com/prod/public/2026-02/Bilan-electrique-2025-principaux-resultats.pdf" },
    wiki("Énergie hydroélectrique", "Énergie_hydroélectrique"),
  ],
  "usages-irrigation": [cfbr("Irrigation et agriculture", "Irrigation-et-agriculture.html"), wiki("Irrigation", "Irrigation")],
  "usages-regulation-debit": [cfbr("Écrêtement des crues", "Ecretement-des-crues.html"), cfbr("Soutien d’étiage", "Soutien-d-etiage.html")],
  "usages-transport": [cfbr("Navigation", "Navigation.html"), wiki("Transport fluvial", "Transport_fluvial")],
  "usages-tourisme": [cfbr("Tourisme et barrages", "Tourisme.html")],
  // Composants
  "composants-corps": [CIGB_TECHNOLOGIE, wiki("Barrage", "Barrage")],
  "composants-evacuateur": [cfbr("Évacuateurs de crue", "Evacuateurs-de-crue.html"), wiki("Déversoir", "Déversoir")],
  "composants-fondation": [CIGB_SECURITE, CIGB_DICTIONNAIRE],
  "composants-prise-deau": [CIGB_DICTIONNAIRE],
  "composants-capteurs": [
    cfbr("Auscultation des barrages et digues", "2012-Auscultation-1022.html"),
    cigb("Bulletin sur la surveillance", "GB/publications/bulletins.asp?IDA=301"),
  ],
  "composants-riviere": [wiki("Débit réservé", "Débit_réservé")],
  // Types d'ouvrages
  "types-barrage-remblai": [cfbr("Barrages en terre", "Barrages-en-terre.html"), wiki("Barrage en remblai", "Barrage_en_remblai")],
  "types-barrage-poids": [cfbr("Barrages-poids", "Barrages-poids.html"), wiki("Barrage-poids", "Barrage-poids")],
  "types-barrage-voute": [cfbr("Barrages-voûtes", "Barrages-voutes.html"), wiki("Barrage-voûte", "Barrage-voûte")],
  "types-canaux": [wiki("Canal", "Canal_(voie_d'eau)")],
  "types-digue-protection": [
    cfbr("Travaux et références sur les digues", "IMG/pdf/recueil_confortement_digues_partie_1.pdf"),
    wiki("Digue", "Digue"),
  ],
  "types-step": [CIGB_TECHNOLOGIE, wiki("Pompage-turbinage", "Pompage-turbinage")],
  // Dans le monde
  "monde-itaipu": [
    { label: "Itaipu Binacional – site officiel", url: "https://www.itaipu.energy/" },
    wiki("Barrage d’Itaipu", "Barrage_d'Itaipu"),
  ],
  "monde-canal-suez": [
    { label: "Suez Canal Authority – histoire du canal", url: "https://www.suezcanal.gov.eg/french/About/SuezCanal/Pages/CanalHistory.aspx" },
    wiki("Canal de Suez", "Canal_de_Suez"),
  ],
  "monde-grande-dixence": [
    { label: "Grande Dixence – page officielle du barrage", url: "https://www.grande-dixence.ch/fr/amenagement/barrages/grande-dixence-76/" },
    wiki("Barrage de la Grande-Dixence", "Barrage_de_la_Grande-Dixence"),
  ],
  "monde-kariba": [
    { label: "Zambezi River Authority – site officiel", url: "https://www.zambezira.org/" },
    wiki("Barrage de Kariba", "Barrage_de_Kariba"),
  ],
  "monde-trois-gorges": [wiki("Barrage des Trois-Gorges", "Barrage_des_Trois-Gorges")],
  "monde-hoover-dam": [
    { label: "US Bureau of Reclamation – Hoover Dam", url: "https://www.usbr.gov/lc/hooverdam/lcdo.html" },
    wiki("Barrage Hoover", "Barrage_Hoover"),
  ],
  // En France
  "france-serre-poncon": [cfbr("Barrage de Serre-Ponçon", "Serre-Poncon.html"), wiki("Barrage de Serre-Ponçon", "Barrage_de_Serre-Ponçon")],
  "france-migouelou": [cfbr("Barrage de Migouélou", "Migouelou.html")],
  "france-rance": [
    { label: "EDF – Usine marémotrice de la Rance", url: "https://www.edf.fr/usine-maremotrice-rance/produire-de-lelectricite" },
    cfbr("Barrage de la Rance", "Rance.html"),
  ],
  "france-canal-alsace": [wiki("Grand canal d’Alsace", "Grand_canal_d'Alsace"), cfbr("Hydroélectricité (Kembs et Grand Canal)", "Hydroelectricite.html")],
  "france-levees-loire": [cfbr("Retour d’expérience sur les levées de la Loire", "doi_cfbr_shf_colloque2017_b05.html"), wiki("Levée de la Loire", "Levée_de_la_Loire")],
  "france-takamaka": [cfbr("Takamaka I", "Barrage-de-Takamaka-1.html"), cfbr("Takamaka II", "Takamaka-2.html")],
  // Dans le temps
  "temps-pont-du-gard": [{ label: "UNESCO – Pont du Gard", url: "https://whc.unesco.org/fr/list/344/" }, wiki("Pont du Gard", "Pont_du_Gard")],
  "temps-canal-du-midi": [
    { label: "VNF – Canal du Midi, le génie de Pierre-Paul Riquet", url: "https://www.vnf.fr/vnf/points-d-interetss/le-canal-du-midi-le-genie-de-pierre-paul-riquet/" },
    wiki("Canal du Midi", "Canal_du_Midi"),
  ],
  "temps-barrage-zola": [cfbr("Barrage Zola", "Zola.html"), wiki("Barrage Zola", "Barrage_Zola")],
  "temps-barrage-dardennes": [cfbr("Barrage de Dardennes", "Dardennes.html")],
  "temps-barrage-rizzanese": [
    cfbr("Barrage du Rizzanese", "Rizzanese.html"),
    { label: "EDF Corse – Présentation du Rizzanese", url: "https://corse.edf.fr/le-barrage-de-rizzanese/presentation-du-barrage" },
  ],
  "temps-canal-seine-nord": [
    { label: "Canal Seine-Nord Europe – site officiel", url: "https://www.canal-seine-nord-europe.fr/" },
    wiki("Canal Seine-Nord Europe", "Canal_Seine-Nord_Europe"),
  ],
};

// Ressources générales (une seule fois, page de crédits du PDF et pied de la mosaïque)
export interface ResourceLink extends ExternalLink {
  description: string;
}

export const RESOURCE_LINKS: ResourceLink[] = [
  { label: "CFBR – Base documentaire", url: "https://www.barrages-cfbr.eu/-Base-documentaire-205-.html", description: "Plus de 4 600 références CFBR / CIGB, un excellent point d’entrée technique." },
  { label: "CIGB – E-Dictionnaire technique des barrages", url: "https://www.icold-cigb.org/FR/publications/e-dictionnaire.asp", description: "Traductions français / anglais des composants, ouvrages et métiers." },
  { label: "CIGB – Registre mondial des barrages", url: "https://www.icold-cigb.org/article/FR/presentation-de-la-base-de-donnees-du-registre", description: "Référence internationale pour les caractéristiques des barrages." },
  { label: "CIGB – Technologie des barrages", url: "https://www.icold-cigb.org/FR/barrages/technologie_des_barrages.asp", description: "Types de barrages et fonctionnement général." },
  { label: "CIGB – Sécurité des barrages", url: "https://www.icold-cigb.org/FR/barrages/securite_des_barrages.asp", description: "Surveillance, ruptures, fondations, surverse, érosion interne." },
  { label: "CFBR – Statistiques nationales", url: "https://www.barrages-cfbr.eu/-Statistiques-nationales-.html", description: "Types, usages, dates et caractéristiques du parc français." },
];

// Version anglaise des ressources générales (pages ICOLD en anglais)
export const RESOURCE_LINKS_EN: ResourceLink[] = [
  { label: "CFBR – Document library (in French)", url: "https://www.barrages-cfbr.eu/-Base-documentaire-205-.html", description: "More than 4,600 CFBR / ICOLD references, an excellent technical starting point." },
  { label: "ICOLD – Technical dictionary of dams", url: "https://www.icold-cigb.org/GB/publications/e-dictionnary.asp", description: "Translations of components, structures and jobs." },
  { label: "ICOLD – World Register of Dams", url: "https://www.icold-cigb.org/GB/publications/world_register_of_dams.asp", description: "International reference for the characteristics of dams." },
  { label: "ICOLD – Dam technology", url: "https://www.icold-cigb.org/GB/dams/technology_of_dams.asp", description: "Types of dams and how they work." },
  { label: "ICOLD – Dam safety", url: "https://www.icold-cigb.org/GB/dams/dams_safety.asp", description: "Monitoring, failures, foundations, overtopping, internal erosion." },
  { label: "CFBR – National statistics (in French)", url: "https://www.barrages-cfbr.eu/-Statistiques-nationales-.html", description: "Types, uses, dates and characteristics of the French dam stock." },
];
