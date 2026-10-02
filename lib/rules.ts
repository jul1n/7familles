// Règles du jeu et présentation du CFBR : textes des cartes « Règles du jeu », « Infos complémentaires »
// et « Le CFBR » du jeu imprimé (7familles-VF.pdf), regroupés pour la page de lecture et le dossier PDF.

export const RULES_URL = "https://www.barrages-cfbr.eu/jeu-7-familles/"; // adresse du QR code de la carte « Infos complémentaires »

export const RULES_META = [
  { label: "À partir de", value: "4 ans" },
  { label: "Joueurs", value: "2 à 4" },
  { label: "Durée", value: "15 à 20 min" },
];

export const RULES_MATERIAL = [
  "42 cartes réparties en 7 familles de 6 cartes",
  "1 carte règles du jeu et 1 carte informations",
  "1 carte présentation des auteurs du jeu",
];

export const RULES_GOAL =
  "L’objectif du jeu est de parvenir à réunir le plus de familles avant la fin de la partie.";

export const RULES_FLOW = [
  "Battez les cartes puis distribuez-en 7 à chacun ; le reste est retourné sur la table et sert de pioche. La personne à gauche du joueur qui a distribué commence la partie en demandant une carte à la personne de son choix pour compléter une famille (par exemple : « Dans la famille MÉTIERS, je voudrais la carte Propriétaire. »). Pour demander une carte, le joueur doit en avoir au moins une de cette famille en main.",
  "Si l’autre joueur a cette carte, il doit la donner ; sinon, le demandeur doit piocher. Si la pioche est bonne, le demandeur annonce « bonne pioche » et il continue jusqu’à ce qu’il n’arrive plus à obtenir la carte désirée, soit auprès d’un autre joueur, soit dans la pioche : dans ce cas, son tour prend fin.",
  "C’est ensuite au joueur à sa gauche de demander les cartes qu’il souhaite. Lorsqu’un joueur possède une famille complète (les 6 cartes), il la pose devant lui, côté visible, et la partie continue jusqu’à ce qu’il n’y ait plus de familles à compléter.",
];

export const RULES_END =
  "Si la pioche est vide, le jeu continue jusqu’à ce que toutes les familles soient réunies. Le vainqueur est celui qui aura réuni le plus de familles à la fin de la partie, devant lui.";

export const RULES_MORE = [
  "Curieux d’en savoir plus ? Explorez les ressources proposées pour découvrir des informations complémentaires sur chacun des membres de nos sept familles.",
  "Quels sont les différents types d’ouvrages et leurs principaux composants ? Qui les construit et les exploite ? À quoi servent-ils ? Scannez le QR code de la carte « Infos complémentaires » pour approfondir vos connaissances sur l’univers des barrages et autres ouvrages hydrauliques.",
];

export const CFBR_HISTORY = [
  "Créé en 1926, le Comité Français des Barrages et Réservoirs (CFBR) est une association qui regroupe environ 580 membres actifs, choisis pour leurs compétences dans le domaine des barrages et des ouvrages hydrauliques. En 1928, il a œuvré à la création de la Commission Internationale des Grands Barrages, à laquelle il est affilié.",
  "En 2026, le CFBR célèbre 100 ans d’expertise et de passion partagée ! Pour cette occasion, le Comité a décidé de créer ce jeu de 7 familles pour rendre hommage à cette histoire collective, marquée par de grandes réalisations techniques, des avancées scientifiques déterminantes et une collaboration étroite entre professionnels du secteur.",
];

export const CFBR_MISSIONS =
  "Le CFBR s’est donné la mission de favoriser les progrès dans la conception, la construction, l’entretien et l’exploitation des barrages et des ouvrages hydrauliques. Il favorise l’échange d’informations, organise chaque année un Colloque Technique et anime des groupes de réflexion chargés d’élaborer des recommandations.";

// --- English version ---
export const RULES_EN = {
  meta: [
    { label: "Age", value: "4 and up" },
    { label: "Players", value: "2 to 4" },
    { label: "Time", value: "15 to 20 min" },
  ],
  material: [
    "42 cards split into 7 families of 6 cards",
    "1 rules card and 1 information card",
    "1 card presenting the authors of the game",
  ],
  goal: "The goal of the game is to collect as many complete families as possible before the end of the game.",
  flow: [
    "Shuffle the cards and deal 7 to each player; the rest is placed face down on the table and forms the draw pile. The player to the left of the dealer starts by asking any player of their choice for a card to complete a family (for example: “In the JOBS family, I would like the Owner card.”). To ask for a card, the player must already hold at least one card of that family.",
    "If the other player has that card, they must hand it over; otherwise, the asker must draw from the pile. If the drawn card is the right one, the asker says “good draw” and keeps going until they can no longer get the card they want, either from another player or from the pile: then their turn ends.",
    "It is then the turn of the player on the left to ask for the cards they want. When a player holds a complete family (all 6 cards), they lay it face up in front of them, and the game goes on until there are no more families left to complete.",
  ],
  end: "If the draw pile is empty, the game goes on until all the families have been collected. The winner is the player who has gathered the most families in front of them at the end of the game.",
  more: [
    "Curious to learn more? Explore the resources offered to discover additional information about each member of our seven families.",
    "What are the different types of structures and their main parts? Who builds and runs them? What are they used for? Scan the QR code on the “Additional information” card to deepen your knowledge of the world of dams and other hydraulic structures.",
  ],
  history: [
    "Founded in 1926, the French Committee on Large Dams (CFBR) is an association of about 580 active members, chosen for their expertise in the field of dams and hydraulic structures. In 1928, it helped create the International Commission on Large Dams, to which it is affiliated.",
    "In 2026, the CFBR celebrates 100 years of expertise and shared passion! For the occasion, the Committee decided to create this game of 7 families as a tribute to this collective history, marked by great technical achievements, decisive scientific advances and close collaboration between professionals of the sector.",
  ],
  missions:
    "The CFBR has set itself the mission of promoting progress in the design, construction, maintenance and operation of dams and hydraulic structures. It encourages the exchange of information, organizes a Technical Colloquium every year and runs working groups in charge of drawing up recommendations.",
};
