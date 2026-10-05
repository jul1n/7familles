import type { Lang } from "./content";

// Textes de l'interface dans chaque langue (les textes des cartes sont dans data/cards.ts et data/en/).
interface UiText {
  htmlLang: string;
  siteName: string;
  siteNameShort: string;
  siteDescription: string;
  seoKeywords: string[];
  // Présentation courte du jeu par analogie avec un jeu connu (version anglaise : « Happy Families »)
  gameIntro: { text: string; linkLabel: string; url: string } | null;
  subtitle: string;
  home: string;
  logoLabel: string;
  logoTip: string;
  loading3d: string;
  skipNav: string;
  skipToContent: string;
  skipToMosaic: string;
  mainLabel: string;
  displayMode: string;
  carousel: string;
  carouselHint: string;
  mosaic: string;
  mosaicHint: string;
  getCopy: string;
  getCopyLabel: string;
  contactCfbr: string;
  help: string;
  printAll: string;
  printAllHint: string;
  print: string;
  listen: string;
  stop: string;
  moreLinks: string;
  inOtherLang: string;
  otherLangName: string;
  switchLang: string;
  switchLangLabel: string;
  mosaicNotice: string;
  hintTouch: string;
  hintMouse: string;
  deckTitle: string;
  quickPick: string;
  openFamily: (n: string) => string;
  centerFamily: (n: string) => string;
  spreadOn: string;
  spreadOff: string;
  backToFamilies: string;
  backToFamiliesShort: string;
  familyLabel: (n: string) => string;
  sixCards: string;
  familyCardsNav: (n: string) => string;
  touchFamilyHint: string;
  backToMosaic: string;
  backToFamily: (n: string) => string;
  prevCard: string;
  nextCard: string;
  cardOf: (n: number) => string;
  sheetLabel: string;
  sheetExpand: string;
  sheetCollapse: string;
  sheetMoreShort: string;
  sheetLessShort: string;
  helpTitle: string;
  helpClose: string;
  helpItems: { k: string; v: string }[];
  helpRules: string;
  helpRulesLink: string;
  helpMosaic: string;
  installApp: string;
  installIos: string;
  liveCard: (num: number, title: string, fam: string) => string;
  liveFamily: (n: string) => string;
  liveDeck: string;
  allCards: string;
  filterByFamily: string;
  mosaicRegion: string;
  openCard: (num: number, title: string) => string;
  cardAlt: (num: number, title: string) => string;
  rules: string;
  resources: string;
  furtherReading: string;
  seeCard3d: string;
  seeFamily3d: string;
  discover: string;
  familyOf: (n: string) => string;
  cardNo: (n: number) => string;
  credit: string;
  creditPhoto: string;
  agencyCredit: string;
  agencyDesc: string;
  rulesTitle: string;
  rulesIntro: string;
  rulesMaterial: string;
  rulesGoal: string;
  rulesFlow: string;
  rulesEnd: string;
  rulesCards: string;
  rulesCardsIntro: string;
  rulesGetCopy: string;
  rulesCfbr: string;
  rulesMissions: string;
  rulesAuthors: string;
  rulesFurther: string;
  rulesSite: string;
  rulesQrAlt: string;
  rulesImagesNote: string;
  cfbrSite: string;
  prevNextNav: string;
  famNavLabel: string;
  sitemapNav: string;
  // dossier imprimable
  pdfCoverTagline: string;
  pdfCoverBody: string;
  pdfTocTitle: string;
  pdfTocSub: string;
  pdfOverviewTitle: (i: number) => string;
  pdfRuleCardsRow: string;
  pdfCardCaption: string;
  pdfCredits: string;
  pdfPhotoCredits: string;
  pdfIllustrations: string;
  pdfEdition: string;
  pdfEditionText: string;
  pdfFooter: string;
  pdfFamily: string;
  pdfCardNo: string;
  pdfOtherLangTerm: string;
  pdfMore: string;
  pdfAuthors: string;
}

const fr: UiText = {
  htmlLang: "fr",
  siteName: "7 Familles des Barrages",
  siteNameShort: "7 Familles",
  siteDescription:
    "Jeu des 7 familles des barrages du Comité Français des Barrages et Réservoirs (1926–2026) : explorez 42 cartes illustrées et leurs fiches pédagogiques.",
  seoKeywords: [
    "jeu des 7 familles",
    "jeu de familles",
    "barrages",
    "CFBR",
    "jeu de cartes pédagogique",
    "hydraulique",
    "ouvrages hydrauliques",
  ],
  gameIntro: null,
  subtitle: "Comité Français des Barrages et Réservoirs",
  home: "Retour à l'accueil du jeu des 7 familles (logo CFBR)",
  logoLabel: "Logo officiel CFBR",
  logoTip:
    "Le CFBR est le comité français de la CIGB, la Commission Internationale des Grands Barrages, connue dans le monde entier sous le nom d'ICOLD (International Commission on Large Dams).",
  loading3d: "Initialisation de la scène 3D continue...",
  skipNav: "Accès rapide",
  skipToContent: "Aller au contenu",
  skipToMosaic: "Afficher la mosaïque des 42 cartes (version sans animation)",
  mainLabel: "Espace de jeu interactif 3D",
  displayMode: "Mode d'affichage",
  carousel: "Carrousel",
  carouselHint: "Carrousel 3D : feuilleter les familles et les cartes",
  mosaic: "Mosaïque",
  mosaicHint: "Mosaïque : voir les 42 cartes d'un coup d'œil",
  getCopy: "Se procurer le jeu",
  getCopyLabel: "Se procurer un exemplaire du jeu",
  contactCfbr: "Contacter le CFBR",
  help: "Aide : gestes et raccourcis clavier",
  printAll: "Imprimer le dossier complet",
  printAllHint: "Imprimer le dossier complet (ou l'enregistrer en PDF) : page de garde, mosaïque, une page par carte",
  print: "Imprimer",
  listen: "Écouter",
  stop: "Arrêter",
  moreLinks: "En savoir plus",
  inOtherLang: "En anglais",
  otherLangName: "English",
  switchLang: "EN",
  switchLangLabel: "Read this site in English",
  mosaicNotice: "L'affichage 3D n'est pas disponible sur cet appareil : voici les 42 cartes à plat.",
  hintTouch: "Faites glisser • Touchez un paquet pour l'ouvrir",
  hintMouse: "Glissez ou survolez pour faire défiler les 7 familles • Cliquez sur un paquet pour l'ouvrir",
  deckTitle: "Les 7 familles du jeu",
  quickPick: "Sélection rapide des familles de barrages",
  openFamily: (n) => `Ouvrir la famille ${n}`,
  centerFamily: (n) => `Centrer la famille ${n}`,
  spreadOn: "Rassembler le paquet",
  spreadOff: "Déployer en éventail",
  backToFamilies: "Revenir aux 7 familles",
  backToFamiliesShort: "Revenir à la vue des 7 familles",
  familyLabel: (n) => `Famille ${n}`,
  sixCards: "• 6 cartes",
  familyCardsNav: (n) => `Cartes de la famille ${n}`,
  touchFamilyHint: "Touchez une carte pour l'ouvrir",
  backToMosaic: "Revenir à la mosaïque",
  backToFamily: (n) => `Revenir à la famille ${n}`,
  prevCard: "Carte précédente",
  nextCard: "Carte suivante",
  cardOf: (n) => `Carte numéro ${n} sur 6`,
  sheetLabel: "Fiche pédagogique de la carte",
  sheetExpand: "Développer la fiche pédagogique",
  sheetCollapse: "Réduire la fiche pédagogique",
  sheetMoreShort: "En savoir plus",
  sheetLessShort: "Réduire",
  helpTitle: "Comment jouer ?",
  helpClose: "Fermer l'aide",
  helpItems: [
    { k: "Souris ou doigt :", v: "faites glisser pour faire défiler les familles, cliquez sur un paquet pour l'ouvrir, puis sur une carte pour la lire." },
    { k: "Clavier :", v: "flèches gauche et droite pour naviguer, Entrée pour ouvrir, Échap pour revenir en arrière." },
    { k: "Sur téléphone :", v: "faites glisser la fiche vers le haut pour lire le texte en entier." },
  ],
  helpRules: "Règles :",
  helpRulesLink: "lire les règles du jeu et le détail des 42 cartes",
  installApp: "Installer l’application sur cet appareil",
  installIos: "Installer : dans Safari, touchez Partager puis « Sur l’écran d’accueil ».",
  helpMosaic: "Mosaïque : le bouton « Mosaïque » affiche les 42 cartes d'un coup, sans animation.",
  liveCard: (num, title, fam) =>
    `Carte ${num} sur 6 sélectionnée : ${title}, famille ${fam}. Flèches gauche et droite pour changer de carte.`,
  liveFamily: (n) => `Famille ${n} ouverte. 6 cartes disponibles. Utilisez les flèches pour prévisualiser.`,
  liveDeck: "Accueil : Vue des 7 familles des barrages.",
  allCards: "Toutes • 42",
  filterByFamily: "Filtrer par famille",
  mosaicRegion: "Mosaïque des 42 cartes",
  openCard: (num, title) => `Ouvrir la carte n°${num} : ${title}`,
  cardAlt: (num, title) => `Carte n°${num} : ${title}`,
  rules: "Règles du jeu",
  resources: "Ressources",
  furtherReading: "Pour aller plus loin",
  seeCard3d: "Voir la carte en 3D",
  seeFamily3d: "Voir la famille en 3D",
  discover: "Découvrir les cartes",
  familyOf: (n) => `Famille ${n}`,
  cardNo: (n) => `carte n°${n}`,
  credit: "Crédit",
  creditPhoto: "Crédit photo",
  agencyCredit: "Illustrations et design des cartes",
  agencyDesc: "",
  rulesTitle: "Règles du jeu",
  rulesIntro:
    "Le jeu des 7 familles des barrages se joue comme le jeu de familles que vous connaissez : on réunit des cartes pour former des familles complètes, et on apprend en chemin à connaître les barrages.",
  rulesMaterial: "Le matériel",
  rulesGoal: "But du jeu",
  rulesFlow: "Déroulement",
  rulesEnd: "Fin de partie",
  rulesCards: "Les 42 cartes",
  rulesCardsIntro: "Les 7 familles comptent chacune 6 cartes. Chaque carte a sa fiche de lecture.",
  rulesGetCopy: "Se procurer un exemplaire",
  rulesCfbr: "Le CFBR",
  rulesMissions: "Missions",
  rulesAuthors: "Auteurs du jeu",
  rulesFurther: "Pour aller plus loin",
  rulesSite: "Ressources du jeu sur le site du CFBR",
  rulesQrAlt: "QR code vers la page du jeu sur le site du CFBR",
  rulesImagesNote: "",
  cfbrSite: "Site du CFBR",
  prevNextNav: "Cartes de la famille",
  famNavLabel: "Toutes les fiches du jeu",
  sitemapNav: "Toutes les fiches du jeu",
  pdfCoverTagline: "Comité Français des Barrages et Réservoirs",
  pdfCoverBody:
    "Un jeu de 42 cartes réparties en 7 familles pour découvrir les barrages, leurs métiers, leurs usages, leurs composants, leurs types, et quelques ouvrages célèbres en France et dans le monde.",
  pdfTocTitle: "Sommaire",
  pdfTocSub: "7 familles de 6 cartes, soit 42 cartes.",
  pdfOverviewTitle: (i) => `Les 42 cartes (${i}/2)`,
  pdfRuleCardsRow: "Cartes règles du jeu et informations",
  pdfCardCaption: "Carte",
  pdfCredits: "Crédits",
  pdfPhotoCredits: "Crédits photos",
  pdfIllustrations: "Illustrations et design des cartes",
  pdfEdition: "Édition",
  pdfEditionText: "",
  pdfFooter: "7 Familles des Barrages • 1926–2026",
  pdfFamily: "Famille",
  pdfCardNo: "Carte n°",
  pdfOtherLangTerm: "En anglais :",
  pdfMore: "En savoir plus :",
  pdfAuthors: "Auteurs du jeu",
};

const en: UiText = {
  htmlLang: "en",
  siteName: "The 7 Families of Dams",
  siteNameShort: "7 Families",
  siteDescription:
    "A dam card game in the spirit of Happy Families (Quartett), by the French Committee on Large Dams (CFBR, 1926–2026): collect 7 families of 6 cards and explore 42 illustrated cards with their educational fact sheets. English edition of the website.",
  seoKeywords: [
    "Happy Families",
    "Happy Families card game",
    "Quartett",
    "Quartets",
    "Go Fish",
    "family card game",
    "dams",
    "dam card game",
    "educational card game",
    "CFBR",
    "ICOLD",
    "hydraulic structures",
  ],
  gameIntro: {
    text: "The 7 Families of Dams is a card game in the spirit of “Happy Families” (known as “Quartett” in German): you ask the other players for cards to complete whole families. It is similar, but a little different: each family has 6 cards instead of 4, there is a draw pile as in “Go Fish”, and every card teaches you something about dams.",
    linkLabel: "About Happy Families (Wikipedia)",
    url: "https://en.wikipedia.org/wiki/Happy_families",
  },
  subtitle: "French Committee on Large Dams (CFBR)",
  home: "Back to the home screen of the 7 Families game (CFBR logo)",
  logoLabel: "Official CFBR logo",
  logoTip:
    "The CFBR is the French committee of ICOLD, the International Commission on Large Dams, known worldwide by this name.",
  loading3d: "Loading the 3D scene...",
  skipNav: "Quick access",
  skipToContent: "Skip to content",
  skipToMosaic: "Show the mosaic of all 42 cards (no-animation version)",
  mainLabel: "Interactive 3D game area",
  displayMode: "Display mode",
  carousel: "Carousel",
  carouselHint: "3D carousel: browse the families and the cards",
  mosaic: "Mosaic",
  mosaicHint: "Mosaic: see all 42 cards at a glance",
  getCopy: "Get the game",
  getCopyLabel: "Get a copy of the game",
  contactCfbr: "Contact the CFBR",
  help: "Help: gestures and keyboard shortcuts",
  printAll: "Print the full booklet",
  printAllHint: "Print the full booklet (or save it as a PDF): cover, mosaic, one page per card",
  print: "Print",
  listen: "Listen",
  stop: "Stop",
  moreLinks: "Learn more",
  inOtherLang: "In French",
  otherLangName: "Français",
  switchLang: "FR",
  switchLangLabel: "Lire ce site en français",
  mosaicNotice: "The 3D view is not available on this device: here are the 42 cards laid out flat.",
  hintTouch: "Swipe • Tap a deck to open it",
  hintMouse: "Drag or hover to scroll through the 7 families • Click a deck to open it",
  deckTitle: "The 7 families of the game",
  quickPick: "Quick selection of the dam families",
  openFamily: (n) => `Open the ${n} family`,
  centerFamily: (n) => `Center the ${n} family`,
  spreadOn: "Gather the deck",
  spreadOff: "Fan out the decks",
  backToFamilies: "Back to the 7 families",
  backToFamiliesShort: "Back to the view of the 7 families",
  familyLabel: (n) => `${n} family`,
  sixCards: "• 6 cards",
  familyCardsNav: (n) => `Cards of the ${n} family`,
  touchFamilyHint: "Tap a card to open it",
  backToMosaic: "Back to the mosaic",
  backToFamily: (n) => `Back to the ${n} family`,
  prevCard: "Previous card",
  nextCard: "Next card",
  cardOf: (n) => `Card number ${n} of 6`,
  sheetLabel: "Educational fact sheet of the card",
  sheetExpand: "Expand the fact sheet",
  sheetCollapse: "Collapse the fact sheet",
  sheetMoreShort: "Learn more",
  sheetLessShort: "Collapse",
  helpTitle: "How to play?",
  helpClose: "Close the help",
  helpItems: [
    { k: "Mouse or finger:", v: "drag to scroll through the families, click a deck to open it, then a card to read it." },
    { k: "Keyboard:", v: "left and right arrows to browse, Enter to open, Escape to go back." },
    { k: "On a phone:", v: "swipe the fact sheet up to read the whole text." },
  ],
  helpRules: "Rules:",
  helpRulesLink: "read the rules of the game and the details of the 42 cards",
  installApp: "Install the app on this device",
  installIos: "To install: in Safari, tap Share, then “Add to Home Screen”.",
  helpMosaic: "Mosaic: the “Mosaic” button shows all 42 cards at once, with no animation.",
  liveCard: (num, title, fam) =>
    `Card ${num} of 6 selected: ${title}, ${fam} family. Left and right arrows to change card.`,
  liveFamily: (n) => `${n} family opened. 6 cards available. Use the arrows to preview them.`,
  liveDeck: "Home: view of the 7 dam families.",
  allCards: "All • 42",
  filterByFamily: "Filter by family",
  mosaicRegion: "Mosaic of the 42 cards",
  openCard: (num, title) => `Open card no. ${num}: ${title}`,
  cardAlt: (num, title) => `Card no. ${num}: ${title}`,
  rules: "Rules of the game",
  resources: "Resources",
  furtherReading: "Going further",
  seeCard3d: "See the card in 3D",
  seeFamily3d: "See the family in 3D",
  discover: "Discover the cards",
  familyOf: (n) => `${n} family`,
  cardNo: (n) => `card no. ${n}`,
  credit: "Credit",
  creditPhoto: "Photo credit",
  agencyCredit: "Card illustrations and design",
  agencyDesc:
    "Design studio founded by Marine Monseux and Coline Mestas, graphic designers and educators trained at the Haute école des arts du Rhin (Strasbourg). It shares knowledge through graphic design, illustration and serious games, mixing science communication, teaching, play and mediation, with curiosity, commitment and a touch of humor. Based between Strasbourg, Paris, Marseille and Nancy.",
  rulesTitle: "Rules of the game",
  rulesIntro:
    "You collect cards to form complete families, and you learn about dams along the way. The printed game is currently available in French only; this page is a translation of its rules.",
  rulesMaterial: "Contents",
  rulesGoal: "Goal of the game",
  rulesFlow: "How to play",
  rulesEnd: "End of the game",
  rulesCards: "The 42 cards",
  rulesCardsIntro: "Each of the 7 families has 6 cards. Every card has its own fact sheet.",
  rulesGetCopy: "Get a copy",
  rulesCfbr: "The CFBR",
  rulesMissions: "Missions",
  rulesAuthors: "Authors of the game",
  rulesFurther: "Going further",
  rulesSite: "Game resources on the CFBR website",
  rulesQrAlt: "QR code to the game page on the CFBR website",
  rulesImagesNote:
    "Note: the illustrations printed on the cards are in French; this website translates the texts, the fact sheets and the audio.",
  cfbrSite: "CFBR website",
  prevNextNav: "Cards of the family",
  famNavLabel: "All the game sheets",
  sitemapNav: "All the game sheets",
  pdfCoverTagline: "French Committee on Large Dams (CFBR)",
  pdfCoverBody:
    "A game of 42 cards split into 7 families to discover dams, the jobs around them, their uses, their parts, their types, and a few famous structures in France and around the world.",
  pdfTocTitle: "Contents",
  pdfTocSub: "7 families of 6 cards, 42 cards in all.",
  pdfOverviewTitle: (i) => `The 42 cards (${i}/2)`,
  pdfRuleCardsRow: "",
  pdfCardCaption: "Card",
  pdfCredits: "Credits",
  pdfPhotoCredits: "Photo credits",
  pdfIllustrations: "Card illustrations and design",
  pdfEdition: "Publisher",
  pdfEditionText:
    "CFBR – French Committee on Large Dams, created in 1926: an association of about 580 active members, chosen for their expertise in the field of dams and hydraulic structures. In 1928, it helped create the International Commission on Large Dams (ICOLD), to which it is affiliated. In 2026, it celebrates 100 years of expertise with this game of 7 families. Card texts: original version by the authors of the game, rewritten for a young audience and translated into English.",
  pdfFooter: "The 7 Families of Dams • 1926–2026",
  pdfFamily: "Family",
  pdfCardNo: "Card no. ",
  pdfOtherLangTerm: "In French:",
  pdfMore: "Learn more:",
  pdfAuthors: "Authors of the game",
};

export const UI: Record<Lang, UiText> = { fr, en };
export type { UiText };
