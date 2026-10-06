import type { ExternalLink } from "./links";

// Liens « Learn more » de la version anglaise, choisis un par un pour chaque carte : organismes de référence
// du monde des barrages (ICOLD, USBR, ASDSO, USSD, AEG, exploitants officiels), institutions internationales
// (OMS, FAO, UNESCO, AIE, IHA, PIANC) et encyclopédies de référence (Britannica, Structurae pour les ouvrages).
// Les liens français (CFBR, EDF, Légifrance…) restent affichés ensuite, en référence secondaire (voir cardLinks).
// Liens vérifiés en octobre 2026 ; certains sites (Britannica, UNESCO, USGS, USBR, FEMA) refusent les robots mais
// répondent normalement dans un navigateur.

const l = (label: string, url: string): ExternalLink => ({ label, url });

const ICOLD = "https://www.icold-cigb.org/GB";
const ICOLD_SAFETY = l("ICOLD – Dams safety", `${ICOLD}/dams/dams_safety.asp`);
const ICOLD_TECHNOLOGY = l("ICOLD – Technology of dams", `${ICOLD}/dams/technology_of_dams.asp`);
const ICOLD_ROLE = l("ICOLD – Role of dams", `${ICOLD}/dams/role_of_dams.asp`);
const ICOLD_ENVIRONMENT = l("ICOLD – Dams and environment", `${ICOLD}/dams/dams_and_environment.asp`);
const ICOLD_DICTIONARY = l("ICOLD – Technical dictionary of dams", `${ICOLD}/publications/e-dictionnary.asp`);
const USSD_TYPES = l("USSD – Types of dams", "https://www.ussdams.org/types-of-damsv2/");
const ASDSO_DAMS101 = l("ASDSO – Dams 101", "https://damsafety.org/dams101");
const BRITANNICA_DAM = l("Britannica – Dam", "https://www.britannica.com/technology/dam-engineering");
const BRITANNICA_CANALS = l("Britannica – Canals and inland waterways", "https://www.britannica.com/technology/canal-waterway");
const PIANC = l("PIANC – World Association for Waterborne Transport Infrastructure", "https://www.pianc.org/");
const AEG_DAMS = l("AEG – Dams and levees (engineering geology)", "https://www.aegweb.org/dams-levees");
const USBR_DS14 = l(
  "USBR – Design standards: spillways and outlet works",
  "https://www.usbr.gov/tsc/techreferences/designstandards-datacollectionguides/finalds-pdfs/DS14-1.pdf"
);
const UNESCO = (label: string, id: number): ExternalLink => l(`UNESCO – ${label}`, `https://whc.unesco.org/en/list/${id}/`);
const structurae = (label: string, slug: string): ExternalLink => l(`Structurae – ${label}`, `https://structurae.net/en/structures/${slug}`);
const DOE_PSH = l("US Department of Energy – Pumped storage hydropower", "https://www.energy.gov/cmei/water/pumped-storage-hydropower");

export const CARD_LINKS_EN: Record<string, ExternalLink[]> = {
  // Jobs
  "metiers-proprietaire": [l("ASDSO – Resources for dam owners and operators", "https://damsafety.org/dam-owners"), ICOLD_SAFETY],
  "metiers-conceptrice": [
    l(
      "USBR – Design standards: embankment dams",
      "https://www.usbr.gov/tsc/techreferences/designstandards-datacollectionguides/finalds-pdfs/DS13-1.pdf"
    ),
    ICOLD_TECHNOLOGY,
  ],
  "metiers-constructeur": [BRITANNICA_DAM, l("USBR – Building Hoover Dam (history)", "https://usbr.gov/history/hooverdam.html")],
  "metiers-expert-securite": [ICOLD_SAFETY, ASDSO_DAMS101],
  "metiers-hydrologue": [
    l("USGS – What is hydrology?", "https://www.usgs.gov/water-science-school/science/what-hydrology"),
    l("WMO / APFM – Reservoir operations (flood management tool)", "http://www.floodmanagement.info/publications/tools/APFM_Tool_05.pdf"),
  ],
  "metiers-geologue": [
    AEG_DAMS,
    l("USGS – Interaction of dams and landslides", "https://www.usgs.gov/publications/interaction-dams-and-landslides-case-studies-and-mitigation"),
  ],
  // Uses
  "usages-eau-potable": [l("WHO – Drinking-water fact sheet", "https://www.who.int/news-room/fact-sheets/detail/drinking-water"), ICOLD_ROLE],
  "usages-hydroelectricite": [
    l("IEA – Hydropower", "https://www.iea.org/energy-system/renewables/hydroelectricity"),
    l("International Hydropower Association", "https://www.hydropower.org/"),
    l("US Department of Energy – Hydropower basics", "https://www.energy.gov/cmei/water/hydropower-basics"),
  ],
  "usages-irrigation": [
    l("FAO – Agricultural water management", "https://www.fao.org/land-water/water/agricultural-water-management/en"),
    l("FAO – AQUASTAT (global water and agriculture data)", "https://www.fao.org/aquastat/en/"),
  ],
  "usages-regulation-debit": [
    l("WMO / APFM – Reservoir operations (flood management tool)", "http://www.floodmanagement.info/publications/tools/APFM_Tool_05.pdf"),
    ICOLD_ROLE,
  ],
  "usages-transport": [PIANC, BRITANNICA_CANALS],
  "usages-tourisme": [
    l("USBR – Lake Mead recreation (Hoover Dam FAQs)", "https://www.usbr.gov/lc/hooverdam/faqs/lakefaqs.html"),
    ICOLD_ROLE,
  ],
  // Components
  "composants-corps": [USSD_TYPES, BRITANNICA_DAM],
  "composants-evacuateur": [l("ASDSO – Spillways: spilling the right way", "https://damsafety.org/reference/spillways-spilling-right-way"), USBR_DS14],
  "composants-fondation": [
    ICOLD_SAFETY,
    l("USGS – Geology of reservoir and dam sites", "https://pubs.usgs.gov/wsp/0597a/report.pdf"),
  ],
  "composants-prise-deau": [USBR_DS14, ICOLD_DICTIONARY],
  "composants-capteurs": [
    l(
      "USBR – Design standards: instrumentation and monitoring (embankment dams)",
      "https://www.usbr.gov/tsc/techreferences/designstandards-datacollectionguides/finalds-pdfs/DS13-11.pdf"
    ),
  ],
  "composants-riviere": [
    l("IUCN – Flow: the essentials of environmental flows", "https://portals.iucn.org/library/efiles/documents/2008-096.pdf"),
    ICOLD_ENVIRONMENT,
  ],
  // Types of structures
  "types-barrage-remblai": [USSD_TYPES, l("USBR – Design standards: embankment dams", "https://www.usbr.gov/tsc/techreferences/designstandards-datacollectionguides/finalds-pdfs/DS13-1.pdf")],
  "types-barrage-poids": [l("Britannica – Gravity dam", "https://www.britannica.com/technology/gravity-dam"), USSD_TYPES],
  "types-barrage-voute": [
    l("Britannica – Arch dam", "https://www.britannica.com/technology/arch-dam"),
    l("University of Queensland – Historical development of arch dams", "https://staff.civil.uq.edu.au/h.chanson/arch_dam.html"),
  ],
  "types-canaux": [BRITANNICA_CANALS, PIANC],
  "types-digue-protection": [l("US Army Corps of Engineers – National Levee Database", "https://levees.sec.usace.army.mil/"), AEG_DAMS],
  "types-step": [DOE_PSH, l("International Hydropower Association – Pumped storage explained", "https://www.hydropower.org/factsheets/pumped-storage")],
  // Around the world
  "monde-itaipu": [l("Itaipu Binacional – official site", "https://www.itaipu.gov.br/en")],
  "monde-canal-suez": [
    l("Suez Canal Authority – official site", "https://www.suezcanal.gov.eg/English/Pages/default.aspx"),
    l("Britannica – The Suez Canal", "https://www.britannica.com/technology/canal-waterway/The-Suez-Canal"),
  ],
  "monde-grande-dixence": [l("Grande Dixence SA – official site", "https://www.grande-dixence.ch/en/"), l("ERIH – Grande Dixence Dam", "https://www.erih.net/i-want-to-go-there/grande-dixence-dam")],
  "monde-kariba": [
    l("Zambezi River Authority – official site", "https://www.zambezira.org/"),
    l("Britannica – Kariba Dam", "https://www.britannica.com/topic/Kariba-Dam"),
    l("European Union – Kariba Dam Rehabilitation Project", "https://international-partnerships.ec.europa.eu/policies/programming/projects/kariba-dam-rehabilitation-project-kdrp_en"),
  ],
  "monde-trois-gorges": [
    l("Britannica – Three Gorges Dam", "https://www.britannica.com/summary/Three-Gorges-Dam"),
    structurae("Three Gorges Dam", "three-gorges-dam"),
  ],
  "monde-hoover-dam": [
    l("US Bureau of Reclamation – History of Hoover Dam", "https://usbr.gov/history/hooverdam.html"),
    l("Britannica – Hoover Dam", "https://www.britannica.com/topic/Hoover-Dam"),
  ],
  // In France
  "france-serre-poncon": [structurae("Serre-Ponçon Dam", "serre-poncon-dam")],
  "france-migouelou": [structurae("Migouélou Dam", "migouelou-dam")],
  "france-rance": [
    l("EDF – La Rance tidal power station (English guide, PDF)", "https://www.edf.fr/sites/groupe/files/2024-12/memoguide-la-rance-en.pdf"),
    l("PNNL Tethys – La Rance tidal barrage", "https://tethys.pnnl.gov/project-sites/la-rance-tidal-barrage"),
    l("ERIH – Rance Tidal Power Station", "https://www.erih.net/i-want-to-go-there/rance-tidal-power-station"),
  ],
  "france-canal-alsace": [
    structurae("Grand Canal d’Alsace", "grand-canal-d-alsace"),
    l("Britannica – The Rhine River", "https://www.britannica.com/place/Rhine-River/Hydrology"),
  ],
  "france-levees-loire": [
    UNESCO("The Loire Valley between Sully-sur-Loire and Chalonnes", 933),
    l("Mission Val de Loire – Risks and heritage in the Loire Valley", "https://loirevalley-worldheritage.org/News/Articles/All/Risques-et-patrimoines-The-Loire-Valley-UNESCO-site"),
  ],
  "france-takamaka": [
    l("VINCI Energies – The Takamaka project", "https://vinci-energies.com/?p=16025"),
    l("Renewable Energy World – Takamaka 1 turbines rehabilitation", "https://www.renewableenergyworld.com/hydro-power/technology-equipment/andritz-to-rehab-two-turbines-at-20-mw-takamaka-1-hydro/"),
  ],
  // Through time
  "temps-pont-du-gard": [
    UNESCO("Pont du Gard (Roman Aqueduct)", 344),
    l("Pont du Gard – official site", "https://www.pontdugard.fr/en"),
    l("Britannica – Pont du Gard", "https://www.britannica.com/topic/Pont-du-Gard"),
  ],
  "temps-canal-du-midi": [UNESCO("Canal du Midi", 770), l("Britannica – Canal du Midi", "https://www.britannica.com/topic/Canal-du-Midi")],
  "temps-barrage-zola": [
    structurae("François Zola Dam", "francois-zola-dam"),
    l("University of Queensland – Historical development of arch dams", "https://staff.civil.uq.edu.au/h.chanson/arch_dam.html"),
  ],
  "temps-barrage-dardennes": [
    l("Société du Canal de Provence – Safety works on the Dardennes dam", "https://canaldeprovence.com/en/references/management-of-safety-works-on-the-dardennes-dam-2/"),
    l("HAL – Dardennes dam: foundation investigations and diagnosis", "https://hal.archives-ouvertes.fr/hal-01301631"),
  ],
  "temps-barrage-rizzanese": [l("VINCI – Filling the Rizzanese dam in Corsica", "https://www.vinci.com/en/newsroom/news/filling-rizzanese-dam-corsica")],
  "temps-canal-seine-nord": [l("Canal Seine-Nord Europe – official site", "https://www.canal-seine-nord-europe.fr/en/")],
};
