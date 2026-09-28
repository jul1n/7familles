export interface CardData {
  id: string;
  familyId: string;
  familyName: string;
  familyColor: string;
  familyIcon: string;
  num: number;
  title: string;
  slug: string;
  frontImage: string;
  backImage: string;
  shortDescription: string;
  contentMarkdown: string;
  location?: string;
  period?: string;
  credits?: string;
}

export interface FamilyData {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  cardCount: number;
}

export const FAMILIES: FamilyData[] = [
  {
    id: "metiers",
    name: "Métiers",
    color: "#E67E22",
    icon: "HardHat",
    description: "Les femmes et les hommes qui conçoivent, bâtissent et surveillent les barrages.",
    cardCount: 6,
  },
  {
    id: "usages",
    name: "Usages",
    color: "#F39C12",
    icon: "Droplets",
    description: "De l'eau potable à la production électrique, les multiples missions indispensables des retenues.",
    cardCount: 6,
  },
  {
    id: "composants",
    name: "Composants",
    color: "#2980B9",
    icon: "Boxes",
    description: "Les éléments anatomiques essentiels assurant le fonctionnement et la sécurité de l'ouvrage.",
    cardCount: 6,
  },
  {
    id: "types-ouvrages",
    name: "Types d'ouvrages",
    color: "#27AE60",
    icon: "Landmark",
    description: "Remblai, poids, voûte, canaux ou STEP : les architectures adaptées à chaque vallée.",
    cardCount: 6,
  },
  {
    id: "dans-le-monde",
    name: "Dans le monde",
    color: "#16A085",
    icon: "Globe",
    description: "Les géants de l'hydroélectricité et des voies navigables à l'échelle planétaire.",
    cardCount: 6,
  },
  {
    id: "en-france",
    name: "En France",
    color: "#8E44AD",
    icon: "MapPin",
    description: "Les chefs-d'œuvre du patrimoine hydraulique français métropolitain et d'outre-mer.",
    cardCount: 6,
  },
  {
    id: "dans-le-temps",
    name: "Dans le temps",
    color: "#D35400",
    icon: "Clock",
    description: "2000 ans d'histoire hydraulique : de l'Antiquité romaine aux canaux du XXIe siècle.",
    cardCount: 6,
  },
];

export const CARDS: CardData[] = [
  // --- FAMILLE 1 : MÉTIERS ---
  {
    id: "metiers-proprietaire",
    familyId: "metiers",
    familyName: "Métiers",
    familyColor: "#E67E22",
    familyIcon: "HardHat",
    num: 1,
    title: "Propriétaire",
    slug: "proprietaire",
    frontImage: "/cards/metiers-proprietaire.webp",
    backImage: "/cards/card-back.webp",
    shortDescription: "Il finance la construction de l'ouvrage, veille à son bon fonctionnement et à son entretien dans le temps.",
    contentMarkdown: `# Propriétaire

## Définition
Le propriétaire ou concessionnaire d'un barrage (souvent un producteur d'énergie, une collectivité ou l'État) porte la responsabilité financière, juridique et environnementale de l'ouvrage tout au long de sa durée de vie.

## Missions principales
- **Financement** des études préalables, de la construction, des remises à niveau et des démantèlements éventuels.
- **Responsabilité civile et pénale** de la sécurité publique en aval.
- Mise en œuvre des programmes de maintenance pluriannuels dictés par la réglementation.

## Cadre réglementaire en France
En France, les barrages sont classés selon leur hauteur et le volume de la retenue (Classes A, B, C). Le propriétaire doit soumettre des rapports réguliers aux services de l'État (DREAL) et missionner des experts indépendants.`,
  },
  {
    id: "metiers-conceptrice",
    familyId: "metiers",
    familyName: "Métiers",
    familyColor: "#E67E22",
    familyIcon: "HardHat",
    num: 2,
    title: "Conceptrice",
    slug: "conceptrice",
    frontImage: "/cards/metiers-conceptrice.webp",
    backImage: "/cards/card-back.webp",
    shortDescription: "Elle dessine les plans, choisit matériaux et équipements afin que le barrage résiste à l’eau et au terrain.",
    contentMarkdown: `# Conceptrice / Ingénieure d'études

## Définition
L'ingénieure conceptrice traduit les contraintes géologiques, hydrologiques et environnementales en un ouvrage pérenne et stable. Elle conçoit la géométrie optimale (voûte, poids, remblai).

## Missions & Outils
- **Modélisation numérique** : calculs aux éléments finis des contraintes sous poussée d'eau, séismes et dilatations thermiques.
- **Dimensionnement des évacuateurs** pour laisser passer la crue millénale sans submersion de la crête.
- Sélection rigoureuse des bétons, granulats et dispositifs d'étanchéité.`,
  },
  {
    id: "metiers-constructeur",
    familyId: "metiers",
    familyName: "Métiers",
    familyColor: "#E67E22",
    familyIcon: "HardHat",
    num: 3,
    title: "Constructeur",
    slug: "constructeur",
    frontImage: "/cards/metiers-constructeur.webp",
    backImage: "/cards/card-back.webp",
    shortDescription: "Il réalise les travaux en suivant les plans, veille à la qualité des matériaux et à la sécurité du chantier.",
    contentMarkdown: `# Constructeur

## Définition
Le constructeur rassemble les compétences de génie civil et de travaux publics pour transformer les plans en réalité, souvent dans des gorges d'accès difficile ou en haute altitude.

## Défis de chantier
- **Dérivation provisoire de la rivière** à l'aide de batardeaux et galeries souterraines.
- **Coulage de béton de masse** avec maîtrise de la chaleur d'hydratation (refroidissement par serpentins).
- **Logistique alpine ou fluviale** pour acheminer des millions de tonnes de matériaux.`,
  },
  {
    id: "metiers-expert-securite",
    familyId: "metiers",
    familyName: "Métiers",
    familyColor: "#E67E22",
    familyIcon: "HardHat",
    num: 4,
    title: "Expert sécurité",
    slug: "expert-securite",
    frontImage: "/cards/metiers-expert-securite.webp",
    backImage: "/cards/card-back.webp",
    shortDescription: "Il surveille l’état du barrage et s’assure qu’il reste solide pour résister à des événements exceptionnels.",
    contentMarkdown: `# Expert sécurité / Auscultation

## Définition
L'expert en sécurité et auscultation analyse en continu la santé structurelle de l'ouvrage et valide sa capacité à affronter crues extrêmes et séismes.

## Méthodes
- Analyse des données des pendules inversés, piézomètres et clinomètres.
- Inspections subaquatiques par plongeurs ou robots sous-marins (ROV).
- Réalisation des études de dangers décennales exigées par l'État.`,
  },
  {
    id: "metiers-hydrologue",
    familyId: "metiers",
    familyName: "Métiers",
    familyColor: "#E67E22",
    familyIcon: "HardHat",
    num: 5,
    title: "Hydrologue",
    slug: "hydrologue",
    frontImage: "/cards/metiers-hydrologue.webp",
    backImage: "/cards/card-back.webp",
    shortDescription: "Elle étudie l’eau, les rivières, les pluies et les crues pour prévoir les besoins et les risques liés au barrage.",
    contentMarkdown: `# Hydrologue

## Définition
L'hydrologue est la spécialiste du cycle de l'eau sur le bassin versant : précipitations, fonte nivale, débits d'étiage et crues historiques.

## Enjeux majeurs
- Évaluation des apports en eau pour la rentabilité hydroélectrique ou l'irrigation.
- Calcul de la **crue de projet** et de la **crue de sûreté**.
- Anticipation des impacts du changement climatique sur les régimes hydrologiques alpins et fluviaux.`,
  },
  {
    id: "metiers-geologue",
    familyId: "metiers",
    familyName: "Métiers",
    familyColor: "#E67E22",
    familyIcon: "HardHat",
    num: 6,
    title: "Géologue",
    slug: "geologue",
    frontImage: "/cards/metiers-geologue.webp",
    backImage: "/cards/card-back.webp",
    shortDescription: "Avant la construction du barrage, elle étudie les roches et le sous-sol pour vérifier la stabilité du terrain.",
    contentMarkdown: `# Géologue & Géotechnicienne

## Définition
Le barrage ne vaut que ce que valent ses fondations. La géologue sonde les rives et le lit de la vallée pour cartographier failles, perméabilité et résistance du rocher.

## Activités clés
- Campagnes de carottages profonds, essais d'injection d'eau sous pression (Lugeon).
- Conception des voiles d'injection et de drainage sous l'assise du barrage.
- Surveillance des risques de glissements de berges dans le lac de retenue.`,
  },

  // --- FAMILLE 2 : USAGES ---
  {
    id: "usages-eau-potable",
    familyId: "usages",
    familyName: "Usages",
    familyColor: "#F39C12",
    familyIcon: "Droplets",
    num: 1,
    title: "Eau potable",
    slug: "eau-potable",
    frontImage: "/cards/usages-eau-potable.webp",
    backImage: "/cards/card-back.webp",
    shortDescription: "Les barrages stockent de l’eau qui est ensuite traitée afin de devenir potable pour boire, cuisiner et se laver.",
    contentMarkdown: `# Eau potable

## Rôle sanitaire vital
Les retenues réservoirs stockent l'eau brute lors des périodes pluvieuses pour alimenter les usines de potabilisation tout au long de l'année, même en période de sécheresse prolongée.

## Protection de la ressource
- Délimitation de périmètres de protection immédiats et rapprochés autour du plan d'eau.
- Préservation de la qualité physico-chimique de l'eau contre l'eutrophisation.`,
  },
  {
    id: "usages-hydroelectricite",
    familyId: "usages",
    familyName: "Usages",
    familyColor: "#F39C12",
    familyIcon: "Droplets",
    num: 2,
    title: "Hydroélectricité",
    slug: "hydroelectricite",
    frontImage: "/cards/usages-hydroelectricite.webp",
    backImage: "/cards/card-back.webp",
    shortDescription: "L’eau des barrages fait tourner les turbines et produit de l’électricité pour s'éclairer, se chauffer, se déplacer…",
    contentMarkdown: `# Hydroélectricité

## Première source d'électricité renouvelable
En faisant chuter l'eau sous pression dans des conduites forcées vers des turbines (Pelton, Francis, Kaplan), l'énergie potentielle est convertie en électricité décarbonée instantanément pilotable.

## Rôle clé dans le réseau électrique
Grâce à un démarrage en quelques minutes, l'hydroélectricité compense les variations brusques de consommation et stabilise la fréquence du réseau européen.`,
  },
  {
    id: "usages-irrigation",
    familyId: "usages",
    familyName: "Usages",
    familyColor: "#F39C12",
    familyIcon: "Droplets",
    num: 3,
    title: "Irrigation",
    slug: "irrigation",
    frontImage: "/cards/usages-irrigation.webp",
    backImage: "/cards/card-back.webp",
    shortDescription: "Les barrages stockent de l’eau pour arroser les champs et permettre aux cultures de pousser.",
    contentMarkdown: `# Irrigation & Souveraineté alimentaire

## Sécurité des récoltes
L'agriculture moderne nécessite un apport régulier en eau pendant la période estivale. Les barrages régulent les débits délivrés aux canaux et réseaux sous pression agricoles.

## Économie d'eau et modernisation
Le stockage hivernal permet d'éviter les pompages estivaux directement dans les nappes phréatiques en tension.`,
  },
  {
    id: "usages-regulation-debit",
    familyId: "usages",
    familyName: "Usages",
    familyColor: "#F39C12",
    familyIcon: "Droplets",
    num: 4,
    title: "Régulation du débit",
    slug: "regulation-debit",
    frontImage: "/cards/usages-regulation-debit.webp",
    backImage: "/cards/card-back.webp",
    shortDescription: "Les barrages retiennent ou libèrent l’eau de la rivière pour contrôler le débit et éviter surplus ou manques.",
    contentMarkdown: `# Régulation du débit & Soutien d'étiage

## Écrêtement des crues
Lors des pluies torrentielles, le barrage stocke les volumes d'eau exceptionnels et ne rejette qu'un débit compatible avec la capacité du cours d'eau à l'aval, protégeant les agglomérations.

## Soutien d'étiage
En été, le déstockage progressif permet de maintenir un niveau d'eau suffisant pour la survie des espèces aquatiques et le refroidissement des centrales.`,
  },
  {
    id: "usages-transport",
    familyId: "usages",
    familyName: "Usages",
    familyColor: "#F39C12",
    familyIcon: "Droplets",
    num: 5,
    title: "Transport",
    slug: "transport",
    frontImage: "/cards/usages-transport.webp",
    backImage: "/cards/card-back.webp",
    shortDescription: "Les barrages permettent aux bateaux de naviguer sur les rivières et les fleuves grâce aux écluses.",
    contentMarkdown: `# Navigation fluviale & Écluses

## Biefs navigables
Les barrages éclusés créent des plans d'eau profonds et calmes (biefs), effaçant les rapides et les hauts-fonds pour autoriser la navigation des péniches à grand gabarit.

## Fret écologique
Le transport par voie d'eau consomme 3 à 5 fois moins d'énergie par tonne-kilomètre que le transport routier.`,
  },
  {
    id: "usages-tourisme",
    familyId: "usages",
    familyName: "Usages",
    familyColor: "#F39C12",
    familyIcon: "Droplets",
    num: 6,
    title: "Tourisme",
    slug: "tourisme",
    frontImage: "/cards/usages-tourisme.webp",
    backImage: "/cards/card-back.webp",
    shortDescription: "Les lacs de barrage attirent des visiteurs qui viennent y pratiquer des activités et admirer les paysages.",
    contentMarkdown: `# Tourisme & Loisirs nautiques

## Attractivité des territoires
Les grands lacs de barrage (Serre-Ponçon, Sainte-Croix, Vouglans) sont devenus des pôles touristiques majeurs : voile, baignade, pêche, randonnée.

## Gestion concertée des cotes
En période estivale, les exploitants maintiennent des cotes touristiques garantissant l'accès aux plages et aux pontons.`,
  },

  // --- FAMILLE 3 : COMPOSANTS ---
  {
    id: "composants-corps",
    familyId: "composants",
    familyName: "Composants",
    familyColor: "#2980B9",
    familyIcon: "Boxes",
    num: 1,
    title: "Corps",
    slug: "corps",
    frontImage: "/cards/composants-corps.webp",
    backImage: "/cards/card-back.webp",
    shortDescription: "Partie principale du barrage, il retient la masse d’eau et transmet les efforts vers les fondations et le sol.",
    contentMarkdown: `# Corps du barrage

## Rôle structurel
Le corps de l'ouvrage constitue la barrière physique étanche et résistante érigée en travers de la vallée.

## Variété des matériaux
- Béton de masse ou béton compacté au rouleau (BCR).
- Noyau d'argile étanche épaulé par des recharges de roches ou de terre.`,
  },
  {
    id: "composants-evacuateur",
    familyId: "composants",
    familyName: "Composants",
    familyColor: "#2980B9",
    familyIcon: "Boxes",
    num: 2,
    title: "Évacuateur",
    slug: "evacuateur",
    frontImage: "/cards/composants-evacuateur.webp",
    backImage: "/cards/card-back.webp",
    shortDescription: "Il permet de laisser passer l’eau en excès afin d’éviter une montée dangereuse du niveau de la retenue.",
    contentMarkdown: `# Évacuateur de crues (Déversoir)

## Organe de sécurité suprême
L'évacuateur de crues empêche le déversement incontrôlé de l'eau par-dessus la crête, ce qui pourrait détruire un barrage en terre par érosion.

## Types d'évacuateurs
- Déversoir à seuil libre (sécurité passive sans action humaine).
- Vannes de crue télécommandées.
- Saut de ski dissipateur d'énergie en pied de barrage.`,
  },
  {
    id: "composants-fondation",
    familyId: "composants",
    familyName: "Composants",
    familyColor: "#2980B9",
    familyIcon: "Boxes",
    num: 3,
    title: "Fondation",
    slug: "fondation",
    frontImage: "/cards/composants-fondation.webp",
    backImage: "/cards/card-back.webp",
    shortDescription: "Terrains sur lesquels repose le barrage, elle assure sa stabilité et transmet les efforts au sol, au rocher.",
    contentMarkdown: `# Fondation & Ancrage

## L'assise rocheuse
La fondation reçoit l'intégralité du poids de l'ouvrage et de la poussée hydrostatique de l'eau.

## Traitements géotechniques
- Injections de coulis de ciment pour combler les fissures rocheuses.
- Réseau de forages de drainage pour éviter les sous-pressions d'eau sous l'ouvrage.`,
  },
  {
    id: "composants-prise-deau",
    familyId: "composants",
    familyName: "Composants",
    familyColor: "#2980B9",
    familyIcon: "Boxes",
    num: 4,
    title: "Prise d’eau",
    slug: "prise-deau",
    frontImage: "/cards/composants-prise-deau.webp",
    backImage: "/cards/card-back.webp",
    shortDescription: "Elle prélève l’eau de la retenue, l’achemine vers son usage et assure sa vidange si cela est nécessaire.",
    contentMarkdown: `# Prise d'eau & Vidange de fond

## Prélèvement et régulation
Équipée de grilles pour bloquer les débris et de vannes de garde, la prise d'eau alimente les galeries d'amenée d'eau vers les turbines ou les stations d'eau potable.

## Vidange de fond
Elle permet de baisser le niveau du lac en urgence ou pour des travaux d'inspection, et d'évacuer les sédiments accumulés au fond.`,
  },
  {
    id: "composants-capteurs",
    familyId: "composants",
    familyName: "Composants",
    familyColor: "#2980B9",
    familyIcon: "Boxes",
    num: 5,
    title: "Capteurs",
    slug: "capteurs",
    frontImage: "/cards/composants-capteurs.webp",
    backImage: "/cards/card-back.webp",
    shortDescription: "Ils mesurent les mouvements, les pressions ou les fuites pour surveiller l’état du barrage.",
    contentMarkdown: `# Capteurs & Auscultation

## Le stéthoscope de l'ouvrage
Un grand barrage est truffé de centaines de capteurs télémesurés en permanence :
- **Pendules directs et inversés** pour mesurer les déplacements millimétriques de la crête.
- **Piezomètres** pour contrôler les pressions d'eau interstitielles.
- **Canaux de mesure de débit de fuite** pour vérifier l'étanchéité globale.`,
  },
  {
    id: "composants-riviere",
    familyId: "composants",
    familyName: "Composants",
    familyColor: "#2980B9",
    familyIcon: "Boxes",
    num: 6,
    title: "Rivière",
    slug: "riviere",
    frontImage: "/cards/composants-riviere.webp",
    backImage: "/cards/card-back.webp",
    shortDescription: "Cours d’eau naturel qui alimente la retenue en amont et poursuit son écoulement en aval du barrage.",
    contentMarkdown: `# Rivière & Écosystème fluvial

## Continuité écologique
Un aménagement moderne veille à préserver le milieu naturel :
- **Débit réservé (débit écologique)** maintenu en continu à l'aval.
- **Passes à poissons** et ascenseurs à migrateurs pour permettre la montaison des saumons, truites ou aloses.
- Gestion du transport sédimentaire naturel.`,
  },

  // --- FAMILLE 4 : TYPES D'OUVRAGES ---
  {
    id: "types-barrage-remblai",
    familyId: "types-ouvrages",
    familyName: "Types d'ouvrages",
    familyColor: "#27AE60",
    familyIcon: "Landmark",
    num: 1,
    title: "Barrage en remblai",
    slug: "barrage-remblai",
    frontImage: "/cards/types-barrage-remblai.webp",
    backImage: "/cards/card-back.webp",
    location: "Barrage du Mont-Cenis",
    credits: "© Benoit Blancher",
    shortDescription: "Il est fait de terre et/ou de roches compactées. Il forme une grande barrière qui retient l’eau.",
    contentMarkdown: `# Barrage en remblai

## Définition
Ouvrage trapézoïdal composé de matériaux naturels meubles (terre, sable, gravier, enrochements) compactés par couches successives.

## Avantages
- S'adapte à des fondations rocheuses médiocres ou compressibles.
- Utilise les matériaux directement extraits sur le site du chantier.

## Exemple emblématique
Le barrage du Mont-Cenis (Savoie), digue de 120 m de hauteur retenant 320 millions de m³ d'eau.`,
  },
  {
    id: "types-barrage-poids",
    familyId: "types-ouvrages",
    familyName: "Types d'ouvrages",
    familyColor: "#27AE60",
    familyIcon: "Landmark",
    num: 2,
    title: "Barrage poids",
    slug: "barrage-poids",
    frontImage: "/cards/types-barrage-poids.webp",
    backImage: "/cards/card-back.webp",
    location: "Barrage du Moulin Neuf",
    credits: "© Rémy Tourment",
    shortDescription: "Ouvrage rigide en maçonnerie ou en béton, son poids lui permet de résister à la poussée de l’eau.",
    contentMarkdown: `# Barrage poids

## Principe mécanique
La masse colossale du béton suffit à elle seule à s'opposer au glissement et au basculement provoqués par la pression de l'eau. Sa section est triangulaire.

## Avantages & Limites
- Conception géométrique simple et robuste.
- Nécessite d'immenses volumes de béton et une fondation rocheuse très résistante pour supporter le poids.`,
  },
  {
    id: "types-barrage-voute",
    familyId: "types-ouvrages",
    familyName: "Types d'ouvrages",
    familyColor: "#27AE60",
    familyIcon: "Landmark",
    num: 3,
    title: "Barrage voûte",
    slug: "barrage-voute",
    frontImage: "/cards/types-barrage-voute.webp",
    backImage: "/cards/card-back.webp",
    location: "Barrage de Quinson",
    credits: "© Franck Oddoux, Parker Wayne Philips",
    shortDescription: "Sa forme courbée lui permet de retenir l’eau en s'appuyant sur les parois rocheuses autour de lui.",
    contentMarkdown: `# Barrage voûte

## L'élégance de l'arc
Courbé vers l'amont, le barrage voûte reporte l'effort de la poussée de l'eau sur les rives rocheuses de la vallée étroite (gorge).

## Caractéristiques
- Beaucoup plus mince et économe en béton qu'un barrage poids.
- Exige un rocher de rive d'une qualité géologique exceptionnelle pour résister aux poussées latérales.`,
  },
  {
    id: "types-canaux",
    familyId: "types-ouvrages",
    familyName: "Types d'ouvrages",
    familyColor: "#27AE60",
    familyIcon: "Landmark",
    num: 4,
    title: "Canaux",
    slug: "canaux",
    frontImage: "/cards/types-canaux.webp",
    backImage: "/cards/card-back.webp",
    location: "Canal d'Ille et Rance",
    credits: "© Chris De Lompret",
    shortDescription: "Ouvrages qui permettent de guider l’eau d’un endroit à un autre, pour son utilisation et la navigation.",
    contentMarkdown: `# Canaux artificiels

## Guidage et transfert
Voies navigables ou biefs d'amenée d'eau taillés par l'homme pour relier des bassins versants ou alimenter des centrales hydroélectriques de dérivation.

## Ouvrages d'art associés
Ponts-canaux, tranchées, écluses et déversoirs de sécurité jalonnent leur tracé.`,
  },
  {
    id: "types-digue-protection",
    familyId: "types-ouvrages",
    familyName: "Types d'ouvrages",
    familyColor: "#27AE60",
    familyIcon: "Landmark",
    num: 5,
    title: "Digue de protection",
    slug: "digue-protection",
    frontImage: "/cards/types-digue-protection.webp",
    backImage: "/cards/card-back.webp",
    location: "Digue du Doménon",
    credits: "© Rémy Tourment",
    shortDescription: "Ouvrage de grande longueur qui protège les habitants et les terres contre les inondations.",
    contentMarkdown: `# Digues de protection fluviale et maritime

## Défense contre les crues et la mer
Remblais longitudinaux surélevés longeant les fleuves ou le littoral pour contenir les crues décennales ou centennales et éviter la submersion des agglomérations.

## Surveillance continue
Lutte contre l'érosion interne par terriers d'animaux, surverses et vieillissement des palplanches.`,
  },
  {
    id: "types-step",
    familyId: "types-ouvrages",
    familyName: "Types d'ouvrages",
    familyColor: "#27AE60",
    familyIcon: "Landmark",
    num: 6,
    title: "Station de transfert d'énergie par pompage (STEP)",
    slug: "step",
    frontImage: "/cards/types-step.webp",
    backImage: "/cards/card-back.webp",
    location: "STEP de Revin",
    credits: "© Jean Louis Burnod",
    shortDescription: "Elle pompe l’eau en hauteur, puis la fait redescendre dans des turbines pour produire de l’électricité.",
    contentMarkdown: `# Station de Transfert d'Énergie par Pompage (STEP)

## La batterie géante du réseau électrique
Une STEP comprend un bassin inférieur et un bassin supérieur.
- **En heures creuses / surproduction solaire-éolienne** : l'eau est pompée vers le haut.
- **En heures de pointe** : l'eau redescend instantanément dans les turbines pour injecter des mégawatts sur le réseau.

## Exemple
La STEP de Revin (Ardennes) stocke plusieurs millions de mètres cubes d'eau pour fournir jusqu'à 800 MW en moins de deux minutes.`,
  },

  // --- FAMILLE 5 : DANS LE MONDE ---
  {
    id: "monde-itaipu",
    familyId: "dans-le-monde",
    familyName: "Dans le monde",
    familyColor: "#16A085",
    familyIcon: "Globe",
    num: 1,
    title: "Barrage d'Itaipu",
    slug: "barrage-itaipu",
    frontImage: "/cards/monde-itaipu.webp",
    backImage: "/cards/card-back.webp",
    location: "Brésil – Paraguay",
    credits: "© Axelspace Corporation",
    shortDescription: "Construit sur le fleuve Paraná, il produit de l’électricité à destination du Brésil et du Paraguay.",
    contentMarkdown: `# Barrage d'Itaipu (Brésil / Paraguay)

## Géant binational
Bâti sur le fleuve Paraná, Itaipu a longtemps été la centrale la plus puissante au monde (14 000 MW installés).

## Énergie record
Elle fournit près de 90 % de l'électricité consommée par le Paraguay et 15 % de celle du Brésil, avec des records réguliers de production annuelle dépassant les 100 TWh.`,
  },
  {
    id: "monde-canal-suez",
    familyId: "dans-le-monde",
    familyName: "Dans le monde",
    familyColor: "#16A085",
    familyIcon: "Globe",
    num: 2,
    title: "Canal de Suez",
    slug: "canal-suez",
    frontImage: "/cards/monde-canal-suez.webp",
    backImage: "/cards/card-back.webp",
    location: "Égypte",
    credits: "© Jérémy Tomacontacter",
    shortDescription: "Il fait passer les bateaux entre la mer Méditerranée et la mer Rouge sans avoir à faire le tour de l’Afrique.",
    contentMarkdown: `# Canal de Suez (Égypte)

## Le carrefour maritime mondial
Inauguré en 1869 sous la direction de Ferdinand de Lesseps, ce canal à niveau sans écluses de 193 km relie Port-Saïd à Suez.

## Impact économique
Près de 12 % du commerce maritime mondial transite par cette voie, raccourcissant le trajet Asie-Europe d'environ 7 000 km.`,
  },
  {
    id: "monde-grande-dixence",
    familyId: "dans-le-monde",
    familyName: "Dans le monde",
    familyColor: "#16A085",
    familyIcon: "Globe",
    num: 3,
    title: "Barrage de la Grande-Dixence",
    slug: "grande-dixence",
    frontImage: "/cards/monde-grande-dixence.webp",
    backImage: "/cards/card-back.webp",
    location: "Suisse",
    credits: "© Manfidza",
    shortDescription: "Il retient l’eau des montagnes suisses pour produire de l’électricité grâce aux centrales hydroélectriques.",
    contentMarkdown: `# Barrage de la Grande-Dixence (Suisse)

## Le plus haut barrage poids du monde
Culminant à 285 mètres dans le Val des Dix (Valais), cet ouvrage colossal contient 6 millions de m³ de béton.

## Réseau de captage d'altitude
Il draine l'eau de 35 glaciers valaisans à travers 100 kilomètres de galeries sous-glaciaires.`,
  },
  {
    id: "monde-kariba",
    familyId: "dans-le-monde",
    familyName: "Dans le monde",
    familyColor: "#16A085",
    familyIcon: "Globe",
    num: 4,
    title: "Barrage Kariba",
    slug: "barrage-kariba",
    frontImage: "/cards/monde-kariba.webp",
    backImage: "/cards/card-back.webp",
    location: "Zambie – Zimbabwe",
    credits: "© Claudio Carvajal",
    shortDescription: "Il forme un grand lac en retenant les eaux du fleuve Zambèze, entre la Zambie et le Zimbabwe.",
    contentMarkdown: `# Barrage de Kariba (Zambie / Zimbabwe)

## Le plus grand réservoir artificiel du monde
Ce barrage voûte double courbure sur le fleuve Zambèze retient le lac Kariba, contenant 180 milliards de mètres cubes d'eau.

## Conçu par André Coyne
Chef-d'œuvre de l'ingénierie hydraulique française des années 1950, il alimente les réseaux électriques zambien et zimbabwéen.`,
  },
  {
    id: "monde-trois-gorges",
    familyId: "dans-le-monde",
    familyName: "Dans le monde",
    familyColor: "#16A085",
    familyIcon: "Globe",
    num: 5,
    title: "Barrage des Trois-Gorges",
    slug: "trois-gorges",
    frontImage: "/cards/monde-trois-gorges.webp",
    backImage: "/cards/card-back.webp",
    location: "Chine",
    credits: "© USBR",
    shortDescription: "Situé sur le fleuve Yangtsé, il est l’un des plus puissants barrages hydroélectriques au monde.",
    contentMarkdown: `# Barrage des Trois-Gorges (Chine)

## La plus puissante centrale hydroélectrique
Avec 22 500 MW de puissance installée (32 turbo-alternateurs de 700 MW), ce barrage poids de 2 335 m de long barre le fleuve Yangtsé.

## Triple objectif
- Écrêter les crues dévastatrices du fleuve Bleu.
- Produire plus de 100 TWh d'électricité annuelle.
- Faciliter la navigation de navires de 10 000 tonnes jusqu'à Chongqing grâce à un ascenseur à bateaux géant.`,
  },
  {
    id: "monde-hoover-dam",
    familyId: "dans-le-monde",
    familyName: "Dans le monde",
    familyColor: "#16A085",
    familyIcon: "Globe",
    num: 6,
    title: "Hoover Dam",
    slug: "hoover-dam",
    frontImage: "/cards/monde-hoover-dam.webp",
    backImage: "/cards/card-back.webp",
    location: "États-Unis",
    credits: "© Deni Williams",
    shortDescription: "Il retient les eaux du fleuve Colorado pour produire de l’électricité et gérer l’eau de la région.",
    contentMarkdown: `# Hoover Dam (États-Unis)

## Monument du New Deal et de l'Ouest américain
Construit entre 1931 et 1936 dans le Black Canyon sur le fleuve Colorado, ce barrage poids-voûte de 221 m retient le lac Mead.

## Rôle pour la Californie et Las Vegas
Il assure la maîtrise des crues, l'irrigation des vallées agricoles impériales et l'eau potable de 20 millions d'habitants.`,
  },

  // --- FAMILLE 6 : EN FRANCE ---
  {
    id: "france-serre-poncon",
    familyId: "en-france",
    familyName: "En France",
    familyColor: "#8E44AD",
    familyIcon: "MapPin",
    num: 1,
    title: "Barrage de Serre-Ponçon",
    slug: "serre-poncon",
    frontImage: "/cards/france-serre-poncon.webp",
    backImage: "/cards/card-back.webp",
    location: "Provence-Alpes-Côte d’Azur",
    credits: "© Bernard Gaëtan",
    shortDescription: "Multi-usages, il forme un lac touristique, produit de l’électricité, irrigue et régule la Durance.",
    contentMarkdown: `# Barrage de Serre-Ponçon (Hautes-Alpes)

## Le colosse de terre sur la Durance
Digue en terre compactée de 123 mètres de haut avec un noyau étanche en argile, inaugurée en 1961.

## Le château d'eau de la Provence
Il stocke 1,2 milliard de m³ d'eau, alimente la chaîne hydroélectrique Durance-Verdon et sécurise l'alimentation en eau potable et agricole de toute la région jusqu'à Marseille.`,
  },
  {
    id: "france-migouelou",
    familyId: "en-france",
    familyName: "En France",
    familyColor: "#8E44AD",
    familyIcon: "MapPin",
    num: 2,
    title: "Barrage de Migouélou",
    slug: "migouelou",
    frontImage: "/cards/france-migouelou.webp",
    backImage: "/cards/card-back.webp",
    location: "Occitanie",
    credits: "© CFBR",
    shortDescription: "Il retient l’eau des montagnes dans les Pyrénées, pour produire de l’électricité grâce à une centrale.",
    contentMarkdown: `# Barrage de Migouélou (Hautes-Pyrénées)

## Barrage à voûtes multiples de haute montagne
Niché à 2 278 m d'altitude dans le val d'Azun, cet ouvrage spectaculaire est composé de 9 contreforts et voûtes minces en béton.

## Énergie pyrénéenne
Il turbine ses eaux vers la centrale de Migouélou, exploitant les chutes d'altitude du massif du Balaïtous.`,
  },
  {
    id: "france-rance",
    familyId: "en-france",
    familyName: "En France",
    familyColor: "#8E44AD",
    familyIcon: "MapPin",
    num: 3,
    title: "Barrage de la Rance",
    slug: "usine-maremotrice-rance",
    frontImage: "/cards/france-rance.webp",
    backImage: "/cards/card-back.webp",
    location: "Bretagne",
    credits: "© Yannick Le Gal",
    shortDescription: "Situé entre Saint-Malo et Dinard, il utilise le mouvement des marées pour produire de l’électricité.",
    contentMarkdown: `# Usine marémotrice de la Rance (Bretagne)

## Pionnier mondial de l'énergie des marées
Inauguré en 1966 entre Saint-Malo et Dinard, ce barrage de 750 mètres capte les marées records de la baie de Saint-Malo (marnage jusqu'à 13,5 m).

## Turbines bulbes réversibles
Ses 24 groupes bulbes produisent de l'électricité lors du flux (marée montante) et du reflux (marée descendante), générant environ 500 GWh/an d'électricité renouvelable prédictible.`,
  },
  {
    id: "france-canal-alsace",
    familyId: "en-france",
    familyName: "En France",
    familyColor: "#8E44AD",
    familyIcon: "MapPin",
    num: 4,
    title: "Grand Canal d’Alsace",
    slug: "grand-canal-alsace",
    frontImage: "/cards/france-canal-alsace.webp",
    backImage: "/cards/card-back.webp",
    location: "Grand Est",
    credits: "© Didier Marc, Parker Wayne Philips",
    shortDescription: "Il permet aux bateaux de naviguer le long du Rhin entre Bâle et Strasbourg, et de produire de l'électricité.",
    contentMarkdown: `# Grand Canal d'Alsace

## Artère fluviale et chaîne hydroélectrique
Canal latéral au Rhin long de plus de 50 kilomètres, équipé de multiples écluses et usines hydroélectriques (Kembs, Ottmarsheim, Fessenheim, Vogelgrun).

## Double vocation franco-allemande
Régule les crues du Rhin, rend la navigation possible toute l'année pour les péniches rhénanes et produit une énergie électrique décarbonée abondante.`,
  },
  {
    id: "france-levees-loire",
    familyId: "en-france",
    familyName: "En France",
    familyColor: "#8E44AD",
    familyIcon: "MapPin",
    num: 5,
    title: "Levées de la Loire",
    slug: "levees-loire",
    frontImage: "/cards/france-levees-loire.webp",
    backImage: "/cards/card-back.webp",
    location: "Centre-Val de Loire & Pays de la Loire",
    credits: "© Rémy Tourment",
    shortDescription: "Construites le long de la Loire, ces digues protègent les villes et les habitations contre les inondations.",
    contentMarkdown: `# Levées de la Loire (Val de Loire)

## Mille ans de protection contre le fleuve royal
Endiguement continu de plusieurs centaines de kilomètres initié dès le Moyen Âge et renforcé sous Henri II puis Colbert.

## Préservation du patrimoine habité
Les levées protègent les cités historiques (Orléans, Tours, Saumur, Angers) et font l'objet d'un suivi géotechnique strict contre le risque de brèche.`,
  },
  {
    id: "france-takamaka",
    familyId: "en-france",
    familyName: "En France",
    familyColor: "#8E44AD",
    familyIcon: "MapPin",
    num: 6,
    title: "Barrage de Takamaka",
    slug: "barrage-takamaka",
    frontImage: "/cards/france-takamaka.webp",
    backImage: "/cards/card-back.webp",
    location: "La Réunion",
    credits: "© BETCGB",
    shortDescription: "Il utilise l’eau des montagnes pour produire de l’électricité dans une centrale souterraine.",
    contentMarkdown: `# Barrage de Takamaka (Île de La Réunion)

## Au cœur de l'un des lieux les plus arrosés de la Terre
Implanté dans les gorges sauvages de la rivière des Marsouins où les précipitations dépassent 6 à 7 mètres par an.

## Centrale souterraine
Les eaux sont captées puis chutent de plus de 300 mètres vers une usine hydroélectrique creusée dans les entrailles volcaniques de l'île.`,
  },

  // --- FAMILLE 7 : DANS LE TEMPS ---
  {
    id: "temps-pont-du-gard",
    familyId: "dans-le-temps",
    familyName: "Dans le temps",
    familyColor: "#D35400",
    familyIcon: "Clock",
    num: 1,
    title: "Pont du Gard",
    slug: "pont-du-gard",
    frontImage: "/cards/temps-pont-du-gard.webp",
    backImage: "/cards/card-back.webp",
    period: "1er siècle",
    credits: "© Gérard Degoutte",
    shortDescription: "Construit par les Romains il y a 2000 ans, il supporte le canal qui acheminait l’eau d’Uzès à Nîmes sur 50 km.",
    contentMarkdown: `# Pont du Gard (1er siècle ap. J.-C.)

## Chef-d'œuvre de l'ingénierie hydraulique antique
Pont-aqueduc à trois niveaux d'arches enjambant le Gardon, culminant à 49 mètres de hauteur.

## Défi topographique romain
Il permettait à l'eau de franchir la vallée avec une pente infime de seulement 2,5 centimètres par kilomètre, alimentant les thermes, fontaines et demeures de Nemausus (Nîmes).`,
  },
  {
    id: "temps-canal-du-midi",
    familyId: "dans-le-temps",
    familyName: "Dans le temps",
    familyColor: "#D35400",
    familyIcon: "Clock",
    num: 2,
    title: "Canal du Midi",
    slug: "canal-du-midi",
    frontImage: "/cards/temps-canal-du-midi.webp",
    backImage: "/cards/card-back.webp",
    period: "1667 – 1681",
    credits: "© Michèle Pinguet",
    shortDescription: "Construit au XVIIe siècle, le canal du Midi - Saint Ferreol relie la Garonne à la Méditerranée sur 240 km.",
    contentMarkdown: `# Canal du Midi & Bassin de Saint-Ferréol

## Le rêve de Pierre-Paul Riquet sous Louis XIV
Liaison navigable reliant Toulouse à l'étang de Thau pour joindre l'Atlantique à la Méditerranée.

## La clé de voûte : le barrage de Saint-Ferréol
Plus grand barrage d'Europe à son époque (1672), il emmagasine les eaux de la Montagne Noire pour alimenter le canal au point de partage des eaux du seuil de Naurouze.`,
  },
  {
    id: "temps-barrage-zola",
    familyId: "dans-le-temps",
    familyName: "Dans le temps",
    familyColor: "#D35400",
    familyIcon: "Clock",
    num: 3,
    title: "Barrage Zola",
    slug: "barrage-zola",
    frontImage: "/cards/temps-barrage-zola.webp",
    backImage: "/cards/card-back.webp",
    period: "1847 – 1854",
    credits: "© Camille Moirenc",
    shortDescription: "Construit au XIXe siècle, il est l’un des tout premiers barrages voûtes de l’ère industrielle.",
    contentMarkdown: `# Barrage Zola (Aix-en-Provence)

## Conçu par François Zola (père d'Émile Zola)
Érigé pour alimenter la ville d'Aix-en-Provence en eau potable après la terrible épidémie de choléra de 1835.

## Pionnier mondial du barrage voûte
Haut de 36 mètres, il est l'un des premiers barrages d'Europe conçu selon la théorie mathématique de l'arc élastique reportant la poussée sur les flancs rocheux.`,
  },
  {
    id: "temps-barrage-dardennes",
    familyId: "dans-le-temps",
    familyName: "Dans le temps",
    familyColor: "#D35400",
    familyIcon: "Clock",
    num: 4,
    title: "Barrage de Dardennes",
    slug: "barrage-dardennes",
    frontImage: "/cards/temps-barrage-dardennes.webp",
    backImage: "/cards/card-back.webp",
    period: "1910 – 1912",
    credits: "© NGE",
    shortDescription: "Situé près de Toulon, il stocke l’eau pour contribuer à l’approvisionnement en eau potable de la ville.",
    contentMarkdown: `# Barrage de Dardennes (Var)

## Protection et alimentation de Toulon
Barrage poids en maçonnerie de 33 mètres retenant les eaux du Las dans les gorges du Revest.

## Modernisation continue
Renforcé par des tirants d'ancrage précontraints forés dans le substrat calcaire pour résister aux normes sismiques modernes.`,
  },
  {
    id: "temps-barrage-rizzanese",
    familyId: "dans-le-temps",
    familyName: "Dans le temps",
    familyColor: "#D35400",
    familyIcon: "Clock",
    num: 5,
    title: "Barrage du Rizzanese",
    slug: "barrage-rizzanese",
    frontImage: "/cards/temps-barrage-rizzanese.webp",
    backImage: "/cards/card-back.webp",
    period: "2007 – 2012",
    credits: "© Bruno Conty",
    shortDescription: "Mis en service en 2013 en Corse, il produit de l’hydroélectricité pour alimenter le réseau électrique de l’île.",
    contentMarkdown: `# Barrage du Rizzanese (Corse-du-Sud)

## Le plus récent des grands barrages français
Ouvrage en béton compacté au rouleau (BCR) de 40 mètres de hauteur, mis en service en 2013 dans l'Alta Rocca.

## Indépendance énergétique insulaire
Avec sa centrale de 55 MW, il produit près de 40 % de l'hydroélectricité corse, apportant une énergie verte cruciale pour l'île non connectée au réseau continental.`,
  },
  {
    id: "temps-canal-seine-nord",
    familyId: "dans-le-temps",
    familyName: "Dans le temps",
    familyColor: "#D35400",
    familyIcon: "Clock",
    num: 6,
    title: "Canal Seine Nord Europe",
    slug: "canal-seine-nord",
    frontImage: "/cards/temps-canal-seine-nord.webp",
    backImage: "/cards/card-back.webp",
    period: "2022 – 2032",
    credits: "© CSNE",
    shortDescription: "En construction, il reliera l’Oise au canal Dunkerque-Escaut pour développer le transport fluvial.",
    contentMarkdown: `# Canal Seine-Nord Europe (En chantier : 2022 – 2032)

## Le grand projet hydraulique du XXIe siècle
Canal à grand gabarit de 107 kilomètres reliant Compiègne (Oise) à Aubencheul-au-Bac (Nord).

## Enjeux écologiques majeurs
- Écluses monumentales dotées de bassins d'épargne d'eau recyclant jusqu'à 80 % des volumes de sassement.
- Remplacement équivalent à 500 000 camions par an sur les autoroutes du Nord de la France.`,
  },
];
