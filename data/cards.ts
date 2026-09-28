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
    contentMarkdown: `# Propriétaire / Concessionnaire

### En un coup d'œil
Le propriétaire ou concessionnaire est le **gardien légal et financier** du barrage. De la première goutte d'eau jusqu'à la fin de vie de l'ouvrage, il porte la responsabilité de son entretien, de sa sécurité publique et du respect de l'environnement.

### Comment ça marche ?
En France, les très grands barrages appartiennent le plus souvent à **l'État**, qui en confie l'exploitation sous forme de concession hydroélectrique à des opérateurs spécialisés (EDF, CNR, SHEM). Les barrages d'eau potable ou d'irrigation appartiennent quant à eux à des collectivités locales ou des syndicats des eaux.

Le propriétaire a l'obligation légale de :
- Financer la surveillance continue, la maintenance préventive et les rénovations périodiques.
- Établir et réviser tous les dix ans une **Étude de Dangers (EDD)** décortiquant chaque scénario de crue ou de séisme.
- Coopérer étroitement avec les services de contrôle de l'État (DREAL) pour garantir une sûreté maximale aux populations vivant en aval.

### Chiffres clés & Repères
- **Réglementation** : Les barrages français sont classés en 3 catégories (**A**, **B**, **C**) selon leur hauteur et le volume retenu.
- **Classe A** : Hauteur ≥ 20 m (ou produit H² × √V ≥ 200) — soumis aux contrôles d'État les plus stricts.

> **Le saviez-vous ?**
> La responsabilité pénale de l'exploitant est engagée 24h/24 : chaque barrage dispose d'un *Plan Particulier d'Intervention* (PPI) orchestré avec la préfecture et prévoyant l'alerte des populations grâce à un réseau de sirènes spécifiques.`,
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

### En un coup d'œil
La conceptrice en génie civil est la **bâtisseuse intellectuelle** du barrage. C'est elle qui invente la forme idéale (voûte, poids ou remblai) pour marier parfaitement l'ouvrage avec le relief de la vallée et résister aux forces colossales de la nature.

### Comment ça marche ?
Avant qu'un seul sac de ciment ne soit coulé, la conceptrice travaille en bureau d'études d'ingénierie (comme Tractebel, Artelia ou EDF Hydro). Elle utilise des outils de pointe :
- **Calculs aux éléments finis (EF)** : modélisation en 3D de chaque mètre cube de béton ou de terre sous la pression de l'eau, les variations de température et les ondes sismiques.
- **Dimensionnement hydraulique** : calcul des évacuateurs de crues pour évacuer des débits titanesques sans jamais submerger le sommet.
- **Choix des matériaux** : sélection des granulats locaux, formulation de bétons à faible chaleur d'hydratation et systèmes d'étanchéité multicouches.

### Chiffres clés & Repères
- **Marge de sécurité** : Les barrages sont calculés pour résister à des crues dites *millénales* ou *décamillénales* (probabilité de survenue d'une fois tous les 10 000 ans).

> **Le saviez-vous ?**
> La France a été la pionnière mondiale de la conception des barrages modernes grâce à des ingénieurs visionnaires comme **André Coyne**, inventeur du barrage-voûte mince à double courbure, qui a exporté son savoir-faire sur les cinq continents !`,
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
    contentMarkdown: `# Constructeur / Entreprise de travaux publics

### En un coup d'œil
Le constructeur est celui qui **donne corps aux plans** dans des conditions souvent extrêmes : fond de gorges abruptes, haute montagne battue par les neiges ou fleuves tumultueux. C'est un chef d'orchestre de millions de tonnes de matériaux et de centaines de compagnons.

### Comment ça marche ?
Bâtir un barrage est un exploit logistique unique divisé en plusieurs étapes critiques :
1. **La dérivation provisoire** : on ne peut pas construire les pieds dans l'eau ! La rivière est d'abord détournée à travers des tunnels percés dans la montagne grâce à des digues provisoires appelées *batardeaux*.
2. **L'excavation jusqu'au rocher sain** : décapage de dizaines de mètres d'alluvions pour ancrer l'ouvrage sur du solide.
3. **Le coulage du béton ou le compactage du remblai** : coulé en plots successifs refroidis par des serpentins d'eau pour éviter que le béton ne fissure sous sa propre chaleur chimique (*chaleur d'hydratation*).

### Chiffres clés & Repères
- **Durée de chantier** : De 3 à 8 ans en moyenne pour un grand aménagement.
- **Logistique** : Installation sur place de téléphériques de chantier (*blondins*), de centrales à béton géantes et de concasseurs de roche.

> **Le saviez-vous ?**
> Si le barrage Hoover aux États-Unis avait été coulé d'un seul bloc sans système de tuyaux réfrigérants intégrés, le béton aurait mis plus de **125 ans** à refroidir et se serait fissuré immédiatement sous l'effet du choc thermique !`,
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
    contentMarkdown: `# Expert sécurité & Auscultation

### En un coup d'œil
L'expert sécurité est le **médecin de garde permanent** du barrage. Armé d'instruments de mesure au micron près et de calculs poussés, il ausculte l'ouvrage pour détecter la moindre anomalie avant même qu'elle ne devienne visible à l'œil nu.

### Comment ça marche ?
Un barrage n'est jamais totalement inerte : il respire, s'incline légèrement selon la saison, se dilate au soleil d'été et se contracte en hiver. L'expert en auscultation :
- Analyse les signaux des **pendules inversés** scellés dans le rocher profond, qui mesurent le déplacement du barrage au dixième de millimètre.
- Surveille les **piézomètres** (pression de l'eau infiltrée sous les fondations) et le débit des **drains de fuite**.
- Pilote les inspections subaquatiques des parements amont à l'aide de plongeurs professionnels et de robots sous-marins téléguidés (*ROV*).

### Chiffres clés & Repères
- **Fréquence** : Visites visuelles hebdomadaires, contrôles approfondis annuels, et inspection complète obligatoire tous les 10 ans.

> **Le saviez-vous ?**
> L'indice le plus précieux pour un expert est la **limpidité de l'eau de drainage** : tant qu'une gouttelette d'infiltration sort parfaitement claire, le barrage est sain ; si l'eau se troublait de fines particules de terre, ce serait l'alerte d'un début d'érosion interne (*renard hydraulique*).`,
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

### En un coup d'œil
L'hydrologue est la **scientifique du voyage de l'eau**. Elle calcule les volumes de pluie tombant sur tout le bassin versant, modélise la fonte des neiges et anticipe les crues furieuses comme les sécheresses historiques.

### Comment ça marche ?
Pour dimensionner un réservoir et ses organes de vidange, l'hydrologue réalise un travail d'enquête minutieux :
- **Stations hydrométriques et radars de pluie** : mesure des débits en amont et analyse des précipitations en temps réel.
- **Statistiques des extrêmes** : détermination des débits de pointe que le barrage devra être capable d'évacuer sans danger (crue centennale, crue millénale).
- **Modélisation climatique** : projection de la baisse de l'enneigement alpin et de l'intensification des orages d'été pour adapter la gestion de l'eau jusqu'à l'horizon 2050-2100.

### Chiffres clés & Repères
- **Unité reine** : Le mètre cube par seconde ($m^3/s$). Lors des crues cévenoles, un cours d'eau d'apparence paisible peut voir son débit multiplié par mille en quelques heures !

> **Le saviez-vous ?**
> Les hydrologues ne s'intéressent pas seulement aux rivières : ils mesurent aussi précisément l'évaporation naturelle à la surface des grands lacs, qui peut faire perdre plusieurs millimètres d'eau par jour en plein été sous l'effet du vent et du soleil.`,
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
    contentMarkdown: `# Géologue & Géotechnicien

### En un coup d'œil
Un barrage ne vaut que ce que vaut son sous-sol ! La géologue est la **spécialiste de la roche et de la terre**. Elle sonde les entrailles de la vallée pour s'assurer que le sol ne cédera ni ne fuira sous la poussée titanesque de l'eau.

### Comment ça marche ?
Dès les premières études de faisabilité, la géologue explore le terrain :
- **Forages et carottages profonds** : prélèvement d'échantillons de roche cylindriques à des dizaines de mètres sous terre pour cartographier failles, fractures et poches d'argile.
- **Essais Lugeon d'étanchéité** : injection d'eau sous pression dans les forages pour mesurer la perméabilité du massif rocheux.
- **Conception du voile d'injection** : détermination de la profondeur à laquelle il faudra injecter un rideau de coulis de ciment liquide pour colmater les microfissures naturelles du rocher.

### Chiffres clés & Repères
- **Règle d'or** : Pour un barrage-voûte, les rives rocheuses doivent être capables d'encaisser une pression équivalente au poids de plusieurs dizaines de tours Eiffel !

> **Le saviez-vous ?**
> La catastrophe historique de Malpasset en 1959 en France n'était pas due à une défaillance du béton de la voûte, mais à un glissement de la roche d'appui de rive gauche sous l'effet des sous-pressions d'eau. Depuis, la géomécanique et l'auscultation des massifs rocheux sont devenues les piliers absolus de l'ingénierie des barrages.`,
  },
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
    contentMarkdown: `# Eau potable & Sécurité sanitaire

### En un coup d'œil
L'accès à une eau pure au robinet est le premier des besoins humains. Les barrages réservoirs constituent les **châteaux d'eau géants** de nos territoires, garantissant l'alimentation en eau potable des populations même après plusieurs mois d'intense sécheresse.

### Comment ça marche ?
L'eau de pluie et de fonte des neiges est stockée en altitude dans un environnement préservé :
- **Périmètres de protection sanitaire** : interdiction des rejets industriels ou agricoles polluants tout autour du plan d'eau pour maintenir une eau brute de qualité supérieure.
- **Prises d'eau étagées** : la prise d'eau prélève l'eau à différentes profondeurs selon la saison pour choisir l'eau la plus fraîche, la mieux oxygénée et la moins chargée en sédiments.
- **Traitement et acheminement** : filtration, décantation, ozonation et désinfection en usine de potabilisation avant distribution dans les réseaux sous pression.

### Chiffres clés & Repères
- En France, environ **30 % de l'eau potable** provient des eaux superficielles (rivières et barrages-réservoirs), particulièrement dans les régions montagneuses et l'Ouest armoricain.

> **Le saviez-vous ?**
> À Marseille et dans toute la Provence, l'eau du robinet provient directement des barrages alpins de Serre-Ponçon et de Sainte-Croix, acheminée gravitairement sur plus de 100 kilomètres à travers le canal de Marseille et le canal de Provence !`,
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
    contentMarkdown: `# Hydroélectricité & Énergie décarbonée

### En un coup d'œil
L'hydroélectricité est la **première énergie renouvelable de France et du monde**. En transformant l'énergie de la chute de l'eau en électricité propre, les centrales hydrauliques fournissent une électricité immédiatement disponible au moment exact où nous en avons besoin.

### Comment ça marche ?
C'est le principe de la gravité :
1. L'eau retenue en hauteur dans le lac possède une formidable énergie potentielle.
2. Elle s'engouffre dans des **conduites forcées** en acier descendant la montagne à toute allure.
3. La pression du jet percute les aubes d'une **turbine** (Pelton pour les hautes chutes, Francis pour les moyennes, Kaplan pour les fleuves) qui tourne à plusieurs centaines de tours par minute.
4. L'alternateur couplé à la turbine transforme l'énergie mécanique en électricité injectée sur le réseau haute tension.

### Chiffres clés & Repères
- **Temps de réaction record** : Une centrale de barrage peut passer de 0 à sa puissance maximale en **moins de 2 à 3 minutes** (contre plusieurs heures pour une centrale thermique).
- En France, l'hydroélectricité représente environ **10 à 12 % de la production électrique nationale**, tout en émettant quasiment zéro gaz à effet de serre.

> **Le saviez-vous ?**
> Les barrages hydroélectriques sont les « sauveteurs » du réseau électrique européen : quand tout le monde allume ses lumières ou que le soleil se couche sur les panneaux solaires, ce sont les vannes des barrages qui s'ouvrent en quelques secondes pour éviter le black-out !`,
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

### En un coup d'œil
Sans eau, pas d'agriculture ! Les barrages d'irrigation stockent les excédents pluvieux de l'hiver et de la fonte des neiges pour les restituer aux cultures maraîchères, céréalières et fruitières en plein cœur de l'été, lorsque la terre a soif.

### Comment ça marche ?
Le stockage hivernal permet d'éviter les prélèvements destructeurs dans les nappes phréatiques et les ruisseaux en période de sécheresse estivale :
- L'eau stockée est relarguée dans les rivières ou acheminée par un réseau de **canaux gravitaires** et de canalisations sous pression.
- Elle alimente des systèmes d'arrosage de précision (goutte-à-goutte, micro-aspersion) qui optimisent chaque litre d'eau consommé par la plante.
- En France, les grands canaux régionaux (comme la Compagnie Nationale du Rhône ou le Canal de Provence) sécurisent l'approvisionnement de dizaines de milliers d'exploitations agricoles.

### Chiffres clés & Repères
- À l'échelle mondiale, l'agriculture représente près de **70 % des prélèvements d'eau douce**.
- En France, les retenues permettent d'irriguer environ **1,6 million d'hectares**, garantissant la production locale de fruits, légumes et semences.

> **Le saviez-vous ?**
> Le lac de Serre-Ponçon dans les Alpes garantit à lui seul l'arrosage de plus de **150 000 hectares** de terres fertiles dans la basse vallée de la Durance, faisant de la Provence le premier verger de France même lors des pires sécheresses !`,
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
    contentMarkdown: `# Régulation du débit, Crues & Étiages

### En un coup d'œil
Les rivières ne coulent jamais à débit constant : elles alternent entre des crues violentes dévastatrices et des étiages sévères où le lit s'assèche. Les barrages agissent comme un **poumon régulateur** qui amortit les colères du ciel et maintient la vie dans le cours d'eau.

### Comment ça marche ?
Le barrage remplit une double mission vitale :
1. **L'écrêtement des crues** : lors d'un déluge ou d'un épisode cévenol, le réservoir garde une « tranche de sécurité » vide pour stocker le pic de crue destructeur. L'eau retenue n'est relâchée qu'à petit débit une fois le danger passé, sauvant les villes en aval.
2. **Le soutien d'étiage** : en été, le barrage lâche continuellement un débit de compensation. Cela évite que la rivière ne tombe à sec, préserve les poissons, permet aux usines de continuer à fonctionner et assure le refroidissement des centrales thermiques et nucléaires.

### Chiffres clés & Repères
- Les 4 grands lacs de réservoir du bassin de la Seine (Pannecière, Orient, Der-Chantecoq, Amance/Temple) peuvent stocker ensemble **810 millions de $m^3$** pour protéger Paris des inondations et soutenir le débit de la Seine en été.

> **Le saviez-vous ?**
> Lors de la canicule historique de 2022 en France, jusqu'à **40 % du débit de la Loire** à certains endroits provenait uniquement des lâchers d'eau programmés depuis les barrages de Naussac (Lozère) et de Villerest (Loire) ! Sans eux, le plus long fleuve de France aurait été transformé en bancs de sable.`,
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
    contentMarkdown: `# Transport fluvial & Voies navigables

### En un coup d'œil
Les barrages de navigation et les canaux transforment les fleuves capricieux en véritables **autoroutes fluviales écologiques**. Grâce aux écluses qui fonctionnent comme des ascenseurs à bateaux, les péniches transportent d'immenses tonnages en consommant très peu d'énergie.

### Comment ça marche ?
À l'état sauvage, un fleuve présente des hauts-fonds, des bancs de gravier et des courants trop violents pour la navigation commerciale :
- Les **barrages éclusés** créent une succession de marches d'escalier d'eau calme et profonde appelées *biefs*.
- Pour franchir la dénivellation créée par le barrage, le bateau entre dans une **écluse** : des portes étanches se ferment, et l'on remplit ou vide le sas par gravité pour hisser ou descendre le navire au niveau suivant.
- Les grands axes fluviaux (Rhin, Rhône, Seine) relient ainsi les ports maritimes aux grands cœurs industriels européens.

### Chiffres clés & Repères
- **Efficacité écologique** : Un seul grand convoi poussé fluvial de 4 400 tonnes équivaut à **220 camions semi-remorques** sur l'autoroute, avec une émission de $CO_2$ divisée par quatre !

> **Le saviez-vous ?**
> Pour franchir des dénivelés records sans consommer trop d'eau, les ingénieurs construisent des ascenseurs à bateaux monumentaux : celui du barrage des Trois-Gorges en Chine soulève des navires de 3 000 tonnes sur **113 mètres de haut** en moins de 40 minutes !`,
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
    contentMarkdown: `# Tourisme, Loisirs & Paysages

### En un coup d'œil
En retenant l'eau au creux des vallées, les barrages ont donné naissance à de splendides **mers intérieures aux eaux turquoise**. Ces lacs sont devenus des joyaux touristiques incontournables, dynamisant l'économie locale et offrant un terrain de jeu privilégié aux amoureux de nature.

### Comment ça marche ?
La présence d'un plan d'eau calme au cœur de massifs rocheux ou forestiers offre une multitude d'usages partagés :
- **Sports nautiques** : voile, planche à voile, paddle, canoë-kayak, aviron et navigation de plaisance sans vagues de courant.
- **Baignade et détente** : aménagement de plages surveillées, campings et sentiers de randonnée tout autour des rives.
- **Pêche récréative** : les retenues constituent des écosystèmes très poissonneux pour les carnassiers (brochets, sandres, perches) et les salmonidés.
- **Conventions d'exploitation** : pour permettre le tourisme estival, les producteurs d'hydroélectricité s'engagent par convention à maintenir une « cote touristique » minimale dans le lac de juin à septembre.

### Chiffres clés & Repères
- Le lac de Serre-Ponçon (Hautes-Alpes) ou le lac de Sainte-Croix dans les Gorges du Verdon accueillent chacun **plus d'un million de touristes** chaque été.

> **Le saviez-vous ?**
> La spectaculaire couleur bleu turquoise du lac de Sainte-Croix ou du lac de Roselend est due à la présence de « farine de roche » : de minuscules particules minérales microscopiques arrachées aux parois rocheuses par les glaciers, qui flottent dans l'eau et reflètent la lumière du soleil.`,
  },
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
    contentMarkdown: `# Le Corps du barrage

### En un coup d'œil
Le corps du barrage est le **rempart principal** dressé en travers de la vallée. Qu'il soit en béton compact ou en enrochements de pierre, son rôle est d'assurer l'étanchéité absolue et de résister vaillamment à la gigantesque pression de l'eau retenue dans le lac.

### Comment ça marche ?
La poussée de l'eau contre le corps de l'ouvrage augmente avec la profondeur : plus on descend vers le fond, plus la pression est formidable. Le corps du barrage doit donc être :
- **Plus large à la base qu'au sommet** : une géométrie trapézoïdale ou arquée pour résister à la poussée maximale en pied d'ouvrage.
- **Parfaitement étanche** : soit par la masse du béton lui-même, soit par un noyau étanche en argile ou un masque en béton bitumineux posé sur la face amont.
- **Segmenté en plots indépendants** : un barrage en béton n'est jamais coulé d'un seul bloc, mais découpé en tranches verticales séparées par des joints d'étanchéité munis de lames de cuivre et d'élastomère pour supporter les dilatations thermiques.

### Chiffres clés & Repères
- La poussée hydrostatique totale exercée sur le corps d'un grand barrage peut dépasser plusieurs **millions de tonnes** de force !

> **Le saviez-vous ?**
> Les grands barrages en béton sont parcourus à l'intérieur par des kilomètres de galeries de visite souterraines éclairées, permettant aux techniciens d'inspecter l'ouvrage de l'intérieur comme dans les coursives d'un sous-marin !`,
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
    contentMarkdown: `# L'Évacuateur de crues (Déversoir)

### En un coup d'œil
L'évacuateur de crues est la **soupape de sécurité suprême** du barrage. En cas de crue furieuse de la rivière, il permet d'évacuer l'eau excédentaire par-dessus ou à côté de l'ouvrage pour empêcher que le lac ne déborde par la crête, ce qui détruirait instantanément un barrage en terre.

### Comment ça marche ?
L'eau possède une énergie cinétique destructrice colossale quand elle chute de plusieurs dizaines de mètres. L'évacuateur combine :
- **Le seuil de décharge** : soit un seuil libre (l'eau déborde naturellement dès qu'elle atteint le niveau maximal, infaillible car 100 % passif), soit de grandes vannes mobiles motorisées (vannes segment).
- **Le coursier d'évacuation** : un grand toboggan en béton armé guidant le torrent d'eau.
- **Le dissipateur d'énergie** : en pied de chute, l'eau jaillit sur un tremplin en forme de **saut de ski** qui la projette en l'air en gerbes spectaculaires pour casser son énergie, ou plonge dans un bassin de tranquillisation où des blocs brise-charge amortissent le choc.

### Chiffres clés & Repères
- L'évacuateur de crues du barrage d'Itaipu peut cracher jusqu'à **62 000 $m^3/s$**, soit 40 fois le débit moyen de la Seine à Paris !

> **Le saviez-vous ?**
> Certains barrages disposent d'évacuateurs en forme de gigantesque entonnoir circulaire appelés « marguerites » ou *morning glory* : l'eau y tourbillonne et s'engouffre dans un gouffre vertical spectaculaire sous le lac avant de ressortir à l'aval.`,
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
    contentMarkdown: `# La Fondation & Le Voile d'étanchéité

### En un coup d'œil
La fondation est la **racine cachée** du barrage. Enfouie profondément sous le lit de la rivière et dans les flancs rocheux de la montagne, elle encaisse la totalité du poids de l'ouvrage et de la poussée du lac pour les transmettre au socle géologique de la Terre.

### Comment ça marche ?
L'ennemi juré d'un barrage n'est pas seulement l'eau visible en surface, mais l'eau invisible qui cherche à s'infiltrer sous l'ouvrage :
- **La sous-pression hydraulique** : l'eau infiltrée sous la semelle du barrage tente de le soulever comme un bouchon de liège !
- **Le voile d'injection** : pour stopper ces infiltrations, les ingénieurs percent des milliers de forages verticaux sous le barrage et y injectent sous très haute pression un coulis de ciment qui colmate chaque fissure du rocher jusqu'à 50 ou 100 mètres de profondeur.
- **Le rideau de drainage** : juste à l'arrière du voile d'étanchéité, une ligne de drains collecte l'eau résiduelle pour relâcher la pression sans danger.

### Chiffres clés & Repères
- La profondeur des fouilles dans la roche pour asseoir la fondation d'un grand barrage dépasse fréquemment **20 à 30 mètres** sous le lit naturel du cours d'eau.

> **Le saviez-vous ?**
> Pour le barrage de Serre-Ponçon, le rocher solide était enseveli sous plus de **100 mètres d'alluvions perméables** ! Pour réussir l'exploit de construire le barrage, les ingénieurs français ont inventé un coulis d'argile spécial injecté sous terre pour créer une digue étanche souterraine de 100 mètres de profondeur avant de poser le barrage par-dessus.`,
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
    contentMarkdown: `# La Prise d'eau & La Vidange de fond

### En un coup d'œil
La prise d'eau est le **robinet d'alimentation** du barrage. C'est la porte d'entrée par laquelle l'eau du lac est captée proprement pour être envoyée dans les conduites forcées vers les turbines électriques, les canaux d'irrigation ou les stations d'eau potable.

### Comment ça marche ?
Une prise d'eau d'ingénierie comprend plusieurs organes spécialisés :
- **Les grilles de protection (dégrilleurs)** : de grands barreaux d'acier empêchent les troncs d'arbres, branches et débris flottants d'entrer dans les tuyaux pour ne pas endommager les aubes des turbines.
- **La vanne de tête** : une vanne de sécurité capable de couper instantanément le flux d'eau dans la conduite en cas d'avarie ou pour maintenance.
- **La vidange de fond** : située tout au point le plus bas du barrage, cette conduite colossale permet de vider entièrement la retenue en cas d'urgence absolue, ou de chasser les sédiments accumulés au fond du lac lors des chasses décennales.

### Chiffres clés & Repères
- La vitesse de l'eau dans une conduite forcée alimentée par une prise d'eau peut dépasser **100 km/h** au moment où elle percute la turbine !

> **Le saviez-vous ?**
> La vidange de fond est soumise à des tests périodiques réguliers : l'ouverture de sa vanne sous plusieurs dizaines de mètres de hauteur d'eau projette un jet sous pression tellement surpuissant qu'il ferait voler en éclats n'importe quel blindage !`,
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
    contentMarkdown: `# Les Capteurs & L'Auscultation

### En un coup d'œil
Les capteurs sont les **organes sensoriels** du barrage. Invisibles depuis l'extérieur, des centaines d'instruments de haute précision mesurent nuit et jour le moindre battement de cœur de l'ouvrage : déformations microscopiques, pressions d'eau et vibrations du sol.

### Comment ça marche ?
Pour veiller sur le colosse, les ingénieurs déploient une panoplie d'instruments fascinants :
- **Les pendules directs et inversés** : de longs fils d'acier tendus verticalement dans des puits verticaux de 50 à 100 mètres de haut. Une table optique mesure le déplacement du fil au **centième de millimètre** près pour savoir de combien le barrage bouge sous la poussée de l'eau.
- **Les piézomètres** : ils mesurent la pression de l'eau dans le corps du barrage et dans les fondations rocheuses.
- **Les déversoirs de jaugeage de fuite** : des bacs en V mesurent le débit des eaux de drainage goutte par goutte.
- **La topographie de précision et le GPS millimétrique** : visées au théodolite laser sur des repères scellés sur le couronnement.

### Chiffres clés & Repères
- Un barrage-voûte de 100 m de haut avance naturellement vers l'aval de **quelques millimètres à quelques centimètres** lorsque le lac se remplit, puis recule lorsque le lac se vide : c'est sa respiration élastique normale !

> **Le saviez-vous ?**
> Aujourd'hui, de nombreux barrages modernes intègrent des kilomètres de **fibres optiques** coulées directement au cœur du béton ou des remblais pour mesurer en continu la température et les micro-déformations sur toute la structure !`,
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
    contentMarkdown: `# La Rivière & La Continuité écologique

### En un coup d'œil
Un barrage ne supprime pas la rivière : il dialogue avec elle ! Le cours d'eau apporte l'eau et les sédiments depuis l'amont et poursuit sa course vivante à l'aval du barrage, où la biodiversité aquatique doit être précieusement préservée.

### Comment ça marche ?
L'ingénierie moderne accorde une priorité absolue à la **continuité écologique** :
- **Le débit réservé (débit écologique)** : un débit d'eau minimal garanti obligatoirement 365 jours par an au pied de l'ouvrage pour assurer la survie des poissons, insectes aquatiques et de la végétation riveraine.
- **Les passes à poissons** : bassins successifs en escalier, rivières artificielles de contournement ou véritables ascenseurs à poissons qui permettent aux truites, saumons et anguilles de franchir la hauteur du barrage.
- **La transparence sédimentaire** : organisation de vidanges partielles ou de chasses douces pour permettre aux sables et graviers de descendre vers l'aval, évitant l'envasement du lac et rechargeant les frayères naturelles.

### Chiffres clés & Repères
- En France, la loi impose que le débit écologique réservé représente au minimum **10 % du débit moyen interannuel** naturel de la rivière.

> **Le saviez-vous ?**
> À la centrale hydroélectrique de Golfech sur la Garonne, les migrateurs (comme les aloses et les saumons) sont attirés par un courant d'eau dans une grande cage qui monte automatiquement en ascenseur pour les libérer au-dessus du barrage !`,
  },
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
    contentMarkdown: `# Le Barrage en remblai (Terre & Enrochements)

### En un coup d'œil
Le barrage en remblai est une **montagne artificielle** créée par la main de l'homme. Fait de terre compactée ou de blocs de roche empilés selon une pente douce, c'est le type de barrage le plus construit au monde car il s'adapte à presque toutes les vallées.

### Comment ça marche ?
Contrairement à un mur vertical de béton, le barrage en remblai a une section triangulaire très étalée :
- **Les recharges (ou épaulements)** : des millions de tonnes de cailloux, graviers et roches concassées qui apportent le poids et la stabilité mécanique à l'ensemble.
- **L'élément d'étanchéité** : les roches laissant passer l'eau, l'étanchéité est assurée soit au centre par un **noyau étanche en argile** compactée (comme à Serre-Ponçon), soit sur la face avant par un **masque amont** en béton bitumineux ou en béton armé (comme au Mont-Cenis).
- **Des filtres drainants** : des couches de sable calibré empêchent l'eau d'arracher les grains de terre à l'intérieur de la digue.

### Chiffres clés & Repères
- **75 % des barrages dans le monde** sont des barrages en remblai.
- **Mont-Cenis (Savoie)** : 120 m de haut, 1,4 km de long en crête, retenant un lac alpin de 320 millions de $m^3$ à 2 000 m d'altitude.

> **Le saviez-vous ?**
> Un barrage en remblai ne tolère **JAMAIS** d'être submergé par-dessus sa crête : le passage de l'eau arracherait la terre superficielle en créant une brèche en quelques minutes. C'est pourquoi leurs évacuateurs de crues sont dimensionnés avec les marges de sécurité les plus vastes du génie civil.`,
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
    contentMarkdown: `# Le Barrage poids (Béton & Maçonnerie)

### En un coup d'œil
Le barrage poids est le **champion de la force brute**. C'est un colosse de béton ou de pierre tellement lourd et massif que son seul poids propre plaque l'ouvrage sur le sol et suffit à empêcher l'eau de le faire glisser ou de le renverser.

### Comment ça marche ?
La conception d'un barrage poids repose sur une loi fondamentale de la mécanique statique :
- La poussée de l'eau pousse le barrage horizontalement vers l'aval et tente de le faire basculer vers l'avant.
- Le poids vertical colossal du béton crée une force dirigée droit vers le centre de la Terre.
- La résultante des forces est dirigée vers le bas et reste toujours à l'intérieur du tiers central de la base de l'ouvrage (*règle du tiers central*), interdisant tout décollement de la semelle.
- Sa section a la forme d'un **triangle rectangle** : la paroi côté eau est quasi verticale, tandis que la paroi vers l'aval est inclinée en pente régulière.

### Chiffres clés & Repères
- Le barrage poids le plus haut du monde est **la Grande-Dixence** en Suisse : 285 mètres de hauteur et 15 millions de tonnes de béton !

> **Le saviez-vous ?**
> Aujourd'hui, les barrages poids modernes ne sont plus coulés par banches traditionnelles mais construits en **Béton Compacté au Rouleau (BCR)** : un béton presque sec étalé par des bulldozers et compacté par des rouleaux compresseurs, ce qui permet de bâtir l'ouvrage à une vitesse record !`,
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
    contentMarkdown: `# Le Barrage voûte (L'Arc de cercle)

### En un coup d'œil
Le barrage voûte est le **chef-d'œuvre de l'élégance et de la finesse**. Courbé vers l'amont en forme d'arc, il ne retient pas l'eau par sa masse, mais reporte toute la force de poussée sur les falaises rocheuses des flancs de la vallée.

### Comment ça marche ?
C'est le principe de l'arc architectural et de la voûte romane, mais couché à l'horizontale :
- L'eau appuie sur la face convexe du barrage : au lieu de le faire plier, cette pression comprime le béton sur lui-même.
- Comme le béton adore être comprimé (il résiste à des pressions formidables en compression), l'effort est guidé le long de l'arc et vient s'écraser sur les **culées rocheuses** ancrées dans les berges de la gorge.
- Les barrages voûtes modernes ont même une **double courbure** (incurvés à l'horizontale et à la verticale), ce qui leur donne une allure de coque de navire ultramince.

### Chiffres clés & Repères
- **Économie de béton** : Un barrage voûte consomme **3 à 5 fois moins de béton** qu'un barrage poids pour une hauteur équivalente !
- **Quinson (Verdon)** : splendide voûte en béton de 45 m de haut fermant les basses gorges du Verdon.

> **Le saviez-vous ?**
> Plus le lac se remplit et plus l'eau pousse fort, plus les blocs de béton de la voûte se serrent les uns contre les autres : le barrage devient paradoxalement plus rigide et plus comprimé sous forte charge d'eau !`,
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
    contentMarkdown: `# Les Canaux & Voies d'eau

### En un coup d'œil
Les canaux sont des **fleuves façonnés par les humains**. Tracés à travers plaines, collines et montagnes, ils guident l'eau d'un bassin vers un autre pour permettre le transport de marchandises, sécuriser l'eau des villes ou irriguer les campagnes.

### Comment ça marche ?
Contrairement à une rivière naturelle qui suit la pente du terrain, un canal est une succession de plans d'eau horizontaux :
- **Le bief** : une tranchée étanchée (par de l'argile compactée ou du béton) où l'eau reste calme et à niveau constant pour que les péniches naviguent sans résistance de courant.
- **Les écluses** : pour gravir une colline ou franchir une ligne de crête (*bief de partage*), une série d'écluses hisse les bateaux étape par étape.
- **Les ponts-canaux** : lorsque le canal doit franchir une vraie rivière ou une vallée encaissée, les ingénieurs construisent un pont portant une rivière artificielle étanche (comme le célèbre pont-canal de Briare sur la Loire).

### Chiffres clés & Repères
- **Canal d'Ille-et-Rance (Bretagne)** : 84 km de voie navigable et 48 écluses reliant Rennes à Saint-Malo, inauguré en 1832.
- La France possède le plus long réseau de voies navigables d'Europe avec **8 500 kilomètres** de canaux et rivières aménagées.

> **Le saviez-vous ?**
> Le point le plus délicat d'un canal est son sommet (*bief de partage*) : comme chaque passage d'écluse fait perdre un volume d'eau vers l'aval, il faut alimenter en permanence ce point haut grâce à des barrages-réservoirs dédiés, sous peine de voir le canal s'assécher !`,
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
    contentMarkdown: `# Les Digues de protection contre les inondations

### En un coup d'œil
Contrairement à un barrage qui barre la rivière pour retenir un lac, la digue est un **ouvrage longitudinal** qui longe le cours d'eau ou le littoral sur des kilomètres pour empêcher les crues ou les marées de tempête d'envahir les villes et les champs.

### Comment ça marche ?
La digue est un ouvrage de génie civil de grande longueur construit en remblai :
- **En temps normal** : elle est à sec ou ne voit l'eau que le long de son pied.
- **En temps de crue** : le niveau du fleuve monte, et la digue retient la crue dans un lit majeur endigué.
- **Les modes de rupture sous surveillance** :
  - *La surverse* : l'eau passe par-dessus la crête et érode la face arrière.
  - *Le renard hydraulique* : l'eau s'infiltre sous la digue et emporte les sables jusqu'à l'effondrement.
  - *Le glissement de talus* : sous l'effet de la saturation en eau.
- Pour sécuriser le système, on aménage des **déversoirs de crue fusibles** : des zones volontairement plus basses où l'on choisit de faire déborder l'eau vers des champs agricoles pour épargner les zones habitées.

### Chiffres clés & Repères
- En France, plus de **9 000 km de digues** protègent des millions d'habitants le long de la Loire, du Rhône, de la Seine et des côtes maritimes.

> **Le saviez-vous ?**
> Depuis la loi GEMAPI (Gestion des Milieux Aquatiques et Prévention des Inondations), les digues ne sont plus gérées comme de simples talus d'herbe, mais comme des « systèmes d'endiguement » rigoureusement surveillés par l'État et les communautés de communes.`,
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
    contentMarkdown: `# La STEP (Station de Transfert d'Énergie par Pompage)

### En un coup d'œil
La STEP est la **batterie géante du réseau électrique**. C'est le moyen le plus puissant et le plus écologique jamais inventé par l'humanité pour stocker d'immenses quantités d'électricité renouvelable et les restituer en un clin d'œil.

### Comment ça marche ?
Une STEP relie deux bassins d'eau étanches situés à des altitudes différentes :
1. **Quand il y a trop d'électricité sur le réseau** (heures creuses de la nuit ou pic de production solaire/éolien à midi) : les groupes fonctionnent en **pompes**. Ils aspirent l'eau du bassin inférieur pour la remonter dans le bassin supérieur. L'électricité excédentaire est stockée sous forme d'eau perchée dans la montagne !
2. **Quand la France manque d'électricité** (pic de consommation de 19h en hiver) : on ouvre les vannes ! L'eau redescend à toute allure vers les turbines qui produisent des centaines de mégawatts en moins de 3 minutes.

### Chiffres clés & Repères
- **95 % du stockage mondial d'électricité** est assuré par des STEP !
- **STEP de Grand'Maison (Isère)** : la plus puissante d'Europe avec **1 800 MW**, capable de délivrer autant de puissance que deux réacteurs nucléaires en quelques minutes.
- **STEP de Revin (Ardennes)** : 800 MW installés dans les boucles de la Meuse.

> **Le saviez-vous ?**
> Une STEP a un rendement exceptionnel d'environ **75 à 80 %** : sur 100 kWh d'électricité consommés pour pomper l'eau en haut, on en récupère près de 80 lorsque l'eau retombe dans les turbines !`,
  },
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
    credits: "© Deni Williams",
    shortDescription: "Construit sur le fleuve Paraná, il produit de l’électricité à destination du Brésil et du Paraguay.",
    contentMarkdown: `# Barrage d'Itaipu (Brésil / Paraguay)

### En un coup d'œil
Érigé sur le fleuve Paraná à la frontière binationale du Brésil et du Paraguay, Itaipu est l'un des **géants absolus de l'hydroélectricité mondiale**. Ses 20 turbines colossales ont longtemps détenu le record planétaire absolu de production d'énergie propre.

### Comment ça marche ?
Itaipu est un gigantesque aménagement combinant un barrage poids à contreforts creux en béton et d'immenses digues de remblai latérales :
- **Les conduites d'alimentation** : 20 tubes géants de 10,5 mètres de diamètre (où passerait un bus à impériale !) précipitent l'eau sur des turbines Francis pesant près de 300 tonnes chacune.
- **La fréquence binationale** : le Paraguay utilise le 50 Hz et le Brésil le 60 Hz ! La moitié des turbines d'Itaipu tourne donc en 50 Hz et l'autre moitié en 60 Hz, avec de gigantesques stations de conversion de courant continu pour échanger l'énergie.

### Chiffres clés & Repères
- **Puissance installée** : **14 000 MW** (mégawatts).
- **Record d'énergie** : En 2016, Itaipu a produit **103,1 milliards de kWh** en une seule année, couvrant 85 % de l'électricité de tout le Paraguay et 15 % du Brésil.
- Longueur en crête : **7,9 kilomètres** — Hauteur : **196 mètres**.

> **Le saviez-vous ?**
> Le volume de béton utilisé pour couler le barrage d'Itaipu permettrait de construire **210 stades de football comme le Maracanã**, et le débit d'eau d'une seule de ses turbines équivaut au débit moyen des célèbres chutes d'Iguazú toutes proches !`,
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
    credits: "© Axelspace Corporation",
    shortDescription: "Il fait passer les bateaux entre la mer Méditerranée et la mer Rouge sans avoir à faire le tour de l’Afrique.",
    contentMarkdown: `# Le Canal de Suez (Égypte)

### En un coup d'œil
Percé en plein désert entre l'Afrique et l'Asie, le canal de Suez est le **verrou stratégique du commerce maritime mondial**. Il relie directement la mer Méditerranée à la mer Rouge, évitant aux navires marchands un périlleux détour de plus de 7 000 km autour de l'Afrique.

### Comment ça marche ?
Contrairement au canal de Panama, le canal de Suez a une particularité hydraulique unique au monde :
- **Il ne comporte AUCUNE écluse** : la mer Méditerranée et la mer Rouge étant rigoureusement au même niveau altimétrique, l'eau de mer y coule librement d'un bout à l'autre à niveau constant !
- **Tranchée navigable** : il s'agit d'un chenal géant dragué en continu dans les sables et argiles de l'isthme de Suez, traversant le grand lac Amer pour permettre le croisement des porte-conteneurs géants.

### Chiffres clés & Repères
- **Longueur** : **193,3 kilomètres** entre Port-Saïd au nord et Suez au sud.
- **Inauguration** : Le **17 novembre 1869**, sous la houlette du Français Ferdinand de Lesseps, après dix ans de travaux colossaux.
- Environ **12 % du commerce mondial** et 30 % du trafic mondial de conteneurs transitent par ce chenal.

> **Le saviez-vous ?**
> En mars 2021, le porte-conteneurs géant *Ever Given* (400 mètres de long) s'est retrouvé coincé en travers du canal sous l'effet d'une rafale de vent : son blocage pendant six jours a immobilisé plus de **400 navires** et gelé près de 10 milliards de dollars de marchandises par jour !`,
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
    credits: "© Jérémy Toma",
    shortDescription: "Il retient l’eau des montagnes suisses pour produire de l’électricité grâce aux centrales hydroélectriques.",
    contentMarkdown: `# Barrage de la Grande-Dixence (Suisse)

### En un coup d'œil
Dressé à 2 365 mètres d'altitude au cœur des Alpes valaisannes en Suisse, le barrage de la Grande-Dixence est le **plus haut barrage-poids du monde**. Ce mur de béton digne des pyramides retient les eaux de fonte de dizaines de glaciers alpins.

### Comment ça marche ?
Pour remplir un lac de 400 millions de mètres cubes dans une vallée alpine étroite, les Suisses ont accompli un travail de titan :
- Le barrage ne capte pas qu'un ruisseau : un réseau souterrain de **100 kilomètres de galeries** forées sous les sommets collecte les eaux de **35 glaciers valaisans** (dont Zermatt et le Cervin) pour les amener dans le lac de retenue.
- La pression est si grande que l'eau est envoyée vers la centrale souterraine de Bieudron sous une **haute chute de 1 883 mètres** (le record du monde !), où elle frappe les plus puissantes turbines Pelton de la planète.

### Chiffres clés & Repères
- **Hauteur** : **285 mètres** (presque aussi haut que la tour Eiffel sans son antenne !).
- **Masse** : **15 millions de tonnes de béton** — son emprise au sol est de 200 mètres de large à la base.
- Construit entre 1951 et 1965 dans des conditions météo extrêmes où le chantier devait s'arrêter 6 mois par an à cause du gel et de la neige.

> **Le saviez-vous ?**
> Au pied de la Grande-Dixence, sous le lac actuel, repose l'ancien barrage de la Dixence construit dans les années 1930 : lors de la mise en eau du géant en 1957, le premier barrage a été complètement submergé sous l'eau et y dort encore aujourd'hui !`,
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
    credits: "© Manfidza",
    shortDescription: "Il forme un grand lac en retenant les eaux du fleuve Zambèze, entre la Zambie et le Zimbabwe.",
    contentMarkdown: `# Barrage de Kariba (Zambie / Zimbabwe)

### En un coup d'œil
Construit au milieu du XXe siècle sur les gorges sauvages du puissant fleuve Zambèze, le barrage de Kariba a donné naissance au **plus grand réservoir d'eau artificiel de la planète**. C'est un chef-d'œuvre de l'ingénierie des voûtes conçu par l'ingénieur français André Coyne.

### Comment ça marche ?
Kariba est un barrage-voûte en béton à double courbure :
- Bâti dans les gorges de Kariba, il transfère l'immense poussée du fleuve Zambèze sur les parois rocheuses basaltiques de la gorge.
- Ses deux centrales hydroélectriques (l'une sur la rive zambienne, l'autre sur la rive zimbabwéenne) fournissent une énergie vitale au développement économique de l'Afrique australe et à ses mines de cuivre.

### Chiffres clés & Repères
- **Record du monde** : Le lac Kariba retient **180,6 milliards de $m^3$ d'eau** (180 $km^3$), soit le plus volumineux lac artificiel au monde (quatre fois plus d'eau que les Trois-Gorges !).
- **Hauteur** : **128 mètres** — Longueur de crête : **579 mètres**.
- Superficie du lac : plus de 5 500 $km^2$ (grand comme un département français).

> **Le saviez-vous ?**
> Pendant le chantier en 1957 et 1958, le fleuve Zambèze connut des crues millénales dévastatrices que les anciens attribuaient à la colère de **Nyaminyami**, le dieu-serpent du fleuve ! Malgré la destruction partielle des batardeaux, les ingénieurs surmontèrent les flots et menèrent l'ouvrage à son terme.`,
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
    credits: "© Claudio Carvajal",
    shortDescription: "Situé sur le fleuve Yangtsé, il est le plus puissant barrage hydroélectrique au monde.",
    contentMarkdown: `# Barrage des Trois-Gorges (Chine)

### En un coup d'œil
Érigé sur le majestueux fleuve Yangtsé dans la province du Hubei, le barrage des Trois-Gorges est la **plus puissante centrale électrique de la planète**, toutes énergies confondues. C'est l'un des plus grands chantiers de génie civil jamais réalisés par l'humanité.

### Comment ça marche ?
Cet ouvrage colossal cumule trois missions géantes :
1. **Production électrique record** : 32 turbo-alternateurs géants de 700 MW chacun, plus deux turbines de 50 MW, totalisant une puissance inouïe.
2. **Protection contre les crues dévastatrices** : le Yangtsé provoquait historiquement des inondations faisant des dizaines de milliers de victimes ; le barrage retient 22 milliards de $m^3$ de crue.
3. **Navigation fluviale** : un escalier monumental de 5 écluses à deux voies et un **ascenseur à bateaux vertical** de 113 m permettent aux cargos de 3 000 tonnes de remonter le fleuve jusqu'à la métropole de Chongqing.

### Chiffres clés & Repères
- **Puissance record** : **22 500 MW** (l'équivalent de 20 réacteurs nucléaires réunis !).
- **Dimensions** : **2 335 mètres de long** et **185 mètres de haut**.
- **Volume de béton** : 28 millions de mètres cubes coulés entre 1994 et 2009.

> **Le saviez-vous ?**
> La masse d'eau retenue dans le réservoir des Trois-Gorges (près de 40 milliards de tonnes perchées à 175 m au-dessus du niveau de la mer) a déplacé une telle masse par rapport à l'axe de rotation de la Terre que les scientifiques de la NASA ont calculé qu'elle a **ralenti la rotation de notre planète de 0,06 microseconde** !`,
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
    credits: "© USBR",
    shortDescription: "Il retient les eaux du fleuve Colorado pour produire de l’électricité et gérer l’eau de la région.",
    contentMarkdown: `# Hoover Dam (États-Unis)

### En un coup d'œil
Planté dans le Black Canyon à la frontière du Nevada et de l'Arizona, Hoover Dam est l'une des **sept merveilles du génie civil moderne**. Icône du renouveau américain pendant la Grande Dépression des années 1930, il a permis l'éclosion de Las Vegas et de l'agriculture de l'Ouest américain.

### Comment ça marche ?
Hoover Dam est un barrage voûte-poids en béton :
- Sa forme cintrée vers l'amont reporte la formidable pression du fleuve Colorado sur les parois de roche volcanique du canyon, tandis que sa base de 200 m d'épaisseur assure une résistance par son poids.
- Il a donné naissance au **lac Mead**, l'un des plus grands réservoirs des États-Unis, qui alimente les robinets et l'électricité de plus de 20 millions de personnes à Los Angeles, Las Vegas et Phoenix.
- Son architecture est célèbre pour son style **Art Déco**, avec ses tours d'admission sculptées et ses turbines monumentales.

### Chiffres clés & Repères
- **Hauteur** : **221,4 mètres** — Longueur de crête : **379 mètres**.
- **Puissance** : **2 080 MW**.
- Inauguré en **1935** par le président Franklin D. Roosevelt, avec plus de deux ans d'avance sur le calendrier prévu !

> **Le saviez-vous ?**
> Pour commémorer les ouvriers bâtisseurs, le site abrite deux sculptures monumentales en bronze de 9 mètres de haut, les *Winged Figures of the Republic*, dont les orteils en bronze ont été polis et rendus dorés brillants par les millions de touristes qui les touchent pour se porter chance !`,
  },
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
    location: "Provence-Alpes-Côte d'Azur",
    credits: "© Bernard Gaëtan",
    shortDescription: "Multi-usages, il forme un lac touristique, produit de l’électricité, irrigue et régule la Durance.",
    contentMarkdown: `# Barrage de Serre-Ponçon (Hautes-Alpes / 04)

### En un coup d'œil
Bâti à la confluence de la Durance et de l'Ubaye, Serre-Ponçon est le **roi des barrages français**. Ce géant en terre compactée a dompté la Durance — jadis surnommée le « troisième fléau de la Provence » pour ses crues ravageuses — pour en faire le château d'eau et d'électricité de tout le Sud-Est.

### Comment ça marche ?
Serre-Ponçon est un barrage en remblai d'une ingéniosité géotechnique historique :
- Sous le lit de la Durance se trouvait un canyon sous-fluvial rempli de plus de **100 mètres de sables et graviers perméables**, rendant impossible la construction d'un barrage en béton classique.
- Les ingénieurs ont injecté un **voile d'étanchéité vertical souterrain de 100 m de profondeur** avant d'édifier par-dessus une pyramide de 14 millions de $m^3$ de terre et de roches argileuses.
- Son usine hydroélectrique souterraine turbine l'eau avant de la restituer au canal usinier de la Durance, qui alimente 15 centrales en cascade jusqu'à l'étang de Berre.

### Chiffres clés & Repères
- **Retenue** : **1,27 milliard de mètres cubes** (le plus grand lac artificiel de France métropolitaine).
- **Dimensions** : **123 mètres de hauteur**, 600 mètres d'épaisseur à la base.
- Mis en service par EDF en **1960**.

> **Le saviez-vous ?**
> Au milieu des eaux turquoise du lac émerge la minuscule **chapelle Saint-Michel** : perchée sur un îlot, elle est le seul édifice épargné lors de l'engloutissement des villages de Savines et d'Ubaye lors de la mise en eau du barrage !`,
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
    location: "Occitanie (Hautes-Pyrénées)",
    credits: "© culture.gouv.fr / CFBR",
    shortDescription: "Il retient l’eau des montagnes dans les Pyrénées, pour produire de l’électricité grâce à une centrale.",
    contentMarkdown: `# Barrage de Migouélou (Hautes-Pyrénées)

### En un coup d'œil
Perché à **2 278 mètres d'altitude** au cœur du Parc National des Pyrénées, le barrage de Migouélou est un joyau d'architecture hydraulique de haute montagne. Ses neuf voûtes fines en béton armé épousent le relief accidenté pour rehausser un lac glaciaire d'altitude.

### Comment ça marche ?
Construire à plus de 2 200 m d'altitude dans le Val d'Azun a représenté un défi titanesque pour les ingénieurs du bureau Coyne et Bellier :
- Pour limiter le tonnage de ciment à hisser par téléphérique sur les sommets, ils ont choisi une structure à **voûtes multiples et contreforts** : 9 voûtes cylindriques minces qui s'appuient sur 8 contreforts de béton.
- L'eau stockée sous les neiges alimente par des galeries sous roche la cascade des **sept centrales hydroélectriques du Val d'Azun**, produisant une énergie de pointe précieuse.

### Chiffres clés & Repères
- **Altitude** : **2 278 mètres** — l'un des plus hauts grands barrages de France.
- **Dimensions** : **31 mètres de haut** pour **274 mètres de longueur** en crête.
- Construit entre 1956 et 1958, mis en service en 1959.

> **Le saviez-vous ?**
> Le chantier était si inaccessible qu'aucune route ne monte au barrage : tous les ouvriers, les machines démontées en pièces détachées et les matériaux furent transportés par un téléphérique de service depuis le fond de la vallée d'Arrens ! Aujourd'hui, on ne peut le visiter qu'après 3 à 4 heures d'une splendide randonnée montagnarde.`,
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
    location: "Bretagne (Ille-et-Vilaine)",
    credits: "© Yannick Le Gal",
    shortDescription: "Situé entre Saint-Malo et Dinard, il utilise le mouvement des marées pour produire de l’électricité.",
    contentMarkdown: `# L'Usine Marémotrice de la Rance (Bretagne)

### En un coup d'œil
Établi en travers de l'estuaire de la Rance entre Saint-Malo et Dinard, cet aménagement pionnier est la **première usine marémotrice industrielle au monde**. Depuis près de 60 ans, elle tire son électricité de la force gravitationnelle de la Lune et du Soleil en exploitant les marées de la Manche.

### Comment ça marche ?
La baie de Saint-Malo connaît l'un des marnages (différence de hauteur entre marée haute et marée basse) les plus puissants du globe :
- **À marée montante** : la mer monte et remplit l'estuaire à travers les vannes et les turbines du barrage.
- **À marée descendante** : le barrage retient l'eau dans l'estuaire ; dès que la mer s'est retirée en contrebas, on lâche l'eau retenue qui fait tourner les turbines dans l'autre sens.
- **Les groupes bulbes réversibles** : l'usine abrite 24 turbines sous-marines inventées spécialement pour la Rance, capables de turbiner dans les deux sens de circulation de l'eau, et même de pomper de l'eau en appoint !

### Chiffres clés & Repères
- **Marnage maximal** : jusqu'à **13,5 mètres** d'amplitude de marée !
- **Puissance** : **240 MW** (24 turbines bulbes de 10 MW).
- **Production** : environ **500 millions de kWh par an**, soit l'équivalent de la consommation électrique de la ville de Rennes.
- Inauguré le **26 novembre 1966** par le général de Gaulle.

> **Le saviez-vous ?**
> En plus de produire de l'électricité propre, le couronnement du barrage sert de pont routier à quatre voies (RD 168) franchi chaque jour par plus de 30 000 véhicules, reliant directement Dinard à Saint-Malo sans faire le tour de l'estuaire !`,
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
    credits: "© Didier Marc / EDF",
    shortDescription: "Il permet aux bateaux de naviguer le long du Rhin entre Bâle et Strasbourg, et de produire de l'électricité.",
    contentMarkdown: `# Le Grand Canal d'Alsace (Grand Est)

### En un coup d'œil
Dérivation artificielle longeant le Rhin sauvage sur plus de 50 kilomètres entre Bâle et Strasbourg, le Grand Canal d'Alsace est la **colonne vertébrale énergétique et fluviale de l'Alsace**. C'est le plus grand aménagement hydroélectrique et navigable de plaine en France.

### Comment ça marche ?
Après le traité de Versailles, la France s'est vu confier l'aménagement hydroélectrique du Rhin :
- Un barrage de dérivation (barrage de Kembs) dérive une grande partie des eaux du Rhin vers un canal d'une largeur impressionnante (jusqu'à 150 mètres).
- Sur son parcours, l'eau franchit **quatre usines-écluses monumentales** d'EDF : Kembs, Ottmarsheim, Fessenheim et Vogelgrun.
- Chaque site combine une puissante centrale électrique de basse chute et deux sas d'écluses géants permettant le passage ininterrompu des grands convois fluviaux européens.

### Chiffres clés & Repères
- **Longueur** : **52 kilomètres**.
- **Production d'énergie** : les 4 centrales d'EDF sur le canal produisent près de **4,5 milliards de kWh par an** (4,5 TWh) d'électricité décarbonée, soit la consommation de plusieurs millions d'habitants.
- Convois navigables jusqu'à **3 000 tonnes** reliant le port de Bâle à Rotterdam.

> **Le saviez-vous ?**
> Le Grand Canal d'Alsace fait l'objet d'un suivi environnemental exemplaire : des passes à poissons géantes ont été réaménagées sur le Rhin pour permettre le retour spectaculaire du grand saumon atlantique jusqu'en Suisse !`,
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
    contentMarkdown: `# Les Levées de la Loire (Val de Loire)

### En un coup d'œil
S'étirant majestueusement sur plus de 600 kilomètres le long du « fleuve royal », les levées de la Loire sont un **chef-d'œuvre patrimonial et défensif séculaire**. Édifiées depuis le Moyen Âge, ces digues protègent des centaines de villes historiques contre les crues redoutables de la Loire.

### Comment ça marche ?
Le système de protection de la Loire est un aménagement complexe et vivant :
- Dès le XIIe siècle, sous Henri II Plantagenêt, on érige les premières digues de terre et de fascines appelées *turcies*.
- Au XVIIe et XIXe siècles, les levées sont rehaussées pour atteindre plus de 6 mètres au-dessus du val inondable.
- Pour éviter qu'une crue exceptionnelle ne fasse éclater la digue en pleine zone urbaine, les ingénieurs ont aménagé des **déversoirs de sécurité maçonnés** (comme à Jargeau ou Montlivault) : l'eau y déborde volontairement à l'écart pour inonder des champs déserts et sauver Orléans, Blois et Tours.

### Chiffres clés & Repères
- Plus de **600 kilomètres de levées** le long du fleuve moyen.
- Protègent près de **300 000 personnes** et des trésors classés au patrimoine mondial de l'UNESCO dans le Val de Loire.
- Les grandes crues historiques de référence : 1846, 1856 et 1866.

> **Le saviez-vous ?**
> Les levées de la Loire ont servi de modèle à la plupart des systèmes d'endiguement modernes d'Europe, et font aujourd'hui partie intégrante du paysage culturel et touristique de la célèbre véloroute *La Loire à Vélo* !`,
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
    credits: "© EDF / BETCGB",
    shortDescription: "Il utilise l’eau des montagnes pour produire de l’électricité dans une centrale souterraine.",
    contentMarkdown: `# Aménagement de Takamaka (La Réunion)

### En un coup d'œil
Niché au fond d'un canyon tropical vertigineux sur l'île de La Réunion, l'aménagement de Takamaka est l'un des chantiers hydroélectriques les plus spectaculaires de France d'outre-mer. Sa centrale est entièrement **enfouie sous 300 mètres de roche volcanique** pour résister aux cyclones les plus furieux.

### Comment ça marche ?
La vallée de la rivière des Marsouins est l'un des endroits les plus arrosés de la planète :
- L'aménagement comprend deux barrages-voûtes : **Takamaka I** (barrage Gingembre, 15 m) et **Takamaka II** (barrage des Hirondelles, 29 m).
- Pour protéger les turbines des crues torrentielles générées par les cyclones tropicaux (qui peuvent faire monter la rivière de 10 mètres en deux heures !), l'usine hydroélectrique a été entièrement **creusée sous terre au cœur de la montagne basaltique**, 300 m sous la surface.
- Une chute d'eau verticale de 270 mètres précipite l'eau captée dans les galeries pour alimenter les turbines souterraines.

### Chiffres clés & Repères
- **Pluviométrie record** : la région reçoit jusqu'à **7 à 8 mètres de pluie par an** !
- **Puissance totale** : **43,4 MW**, représentant la première source d'électricité renouvelable de l'île de La Réunion.
- Mis en service par EDF en 1968 (Takamaka I) et 1989 (Takamaka II).

> **Le saviez-vous ?**
> La vallée est tellement abrupte et isolée qu'aucun véhicule terrestre ne peut y descendre : le ravitaillement des installations et le transport des techniciens d'EDF s'effectuent par un impressionnant téléphérique de service surplombant des gouffres de plusieurs centaines de mètres de vide !`,
  },
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
    location: "Occitanie (Gard)",
    period: "Ier siècle après J.-C.",
    credits: "© Gérard Degoutte",
    shortDescription: "Construit par les Romains il y a 2000 ans, il supporte le canal qui acheminait l’eau d’Uzès à Nîmes sur 50 km.",
    contentMarkdown: `# Le Pont du Gard (Ier siècle apr. J.-C.)

### En un coup d'œil
Dressé avec majesté au-dessus du Gardon depuis deux millénaires, le Pont du Gard est le **plus haut pont-aqueduc romain au monde**. Chef-d'œuvre absolu de l'Antiquité romaine classé à l'UNESCO, il témoigne de la maîtrise hydraulique et architecturale extraordinaire des bâtisseurs de l'Empire.

### Comment ça marche ?
Le Pont du Gard n'était pas un pont routier, mais le maillon d'un gigantesque aqueduc gravitaire de 50 km :
- Il franchissait la gorge escarpée du Gardon pour acheminer l'eau pure depuis la source d'Eure (près d'Uzès) jusqu'à la cité romaine de Nîmes (*Nemausus*) pour alimenter fontaines publiques, thermes et résidences.
- **Trois rangées d'arches superposées** : 6 arches au premier niveau, 11 arches au second, et 35 arches au niveau supérieur soutenant la canalisation d'eau couverte (*specus*).
- **Une pente d'une précision diabolique** : sur l'ensemble des 50 km du parcours, la pente moyenne n'est que de **25 centimètres par kilomètre** (seulement 12,6 mètres de dénivelé au total !). Le pont lui-même n'affiche que 2,5 cm de dénivellation sur ses 275 mètres de long !

### Chiffres clés & Repères
- **Hauteur** : **48,77 mètres** au-dessus de l'eau.
- **Longueur en crête** : **275 mètres**.
- Construit entre 40 et 50 apr. J.-C. en blocs de pierre calcaire du pays sans aucun mortier (pierres assemblées à sec taillées avec une précision millimétrique).
- Classé au **Patrimoine mondial de l'UNESCO** en 1985.

> **Le saviez-vous ?**
> Les Romains ont enduit l'intérieur du canal sommital d'un mortier d'étanchéité rougeâtre spécial à base de chaux et de débris de tuiles broyées appelé *tuileau*. Deux mille ans plus tard, l'étanchéité antique est encore visible le long des parois du canal !`,
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
    location: "Occitanie",
    period: "1667 – 1681",
    credits: "© Michèle Pinguet",
    shortDescription: "Construit au XVIIe siècle, le canal du Midi - Saint Ferréol relie la Garonne à la Méditerranée sur 240 km.",
    contentMarkdown: `# Canal du Midi & Bassin de Saint-Ferréol (1667–1681)

### En un coup d'œil
Reliant Toulouse à la mer Méditerranée sur 240 kilomètres, le canal du Midi conçu par **Pierre-Paul Riquet** sous le règne de Louis XIV est l'une des plus grandes réalisations de génie civil de l'histoire moderne. Son secret ? Le barrage de Saint-Ferréol, le plus ancien grand barrage encore en service en France.

### Comment ça marche ?
Le rêve de relier l'océan Atlantique à la Méditerranée sans contourner l'Espagne existait depuis l'Antiquité, mais butait sur un problème réputé insoluble : comment alimenter en eau le point culminant du canal (*le seuil de Naurouze*, à 189 m d'altitude) en plein été ?
- Riquet eut le coup de génie de capter les ruisseaux de la Montagne Noire et de créer à **Saint-Ferréol** un immense lac-réservoir artificiel retenu par une digue pionnière de 780 mètres de long.
- Lorsque le canal s'abaisse en été, les vannes de Saint-Ferréol s'ouvrent et déversent l'eau dans la rigole de la montagne pour abreuver le canal du Midi à Naurouze.
- L'ouvrage fut inspecté et encore rehaussé quelques années plus tard par le célèbre architecte militaire **Vauban**.

### Chiffres clés & Repères
- **Longueur du canal** : **240 kilomètres** et 63 écluses (dont les célèbres écluses étagées de Fonseranes à Béziers).
- **Le barrage de Saint-Ferréol** : 780 m de long, 32 m de haut, plus grand barrage d'Europe occidentale lors de sa construction.
- Inscrit au **Patrimoine mondial de l'UNESCO** en 1996.

> **Le saviez-vous ?**
> Pierre-Paul Riquet a investi toute sa fortune personnelle et sa santé dans cette aventure pharaonique : il est mort épuisé en 1680, seulement six mois avant l'inauguration triomphale de son canal !`,
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
    location: "Le Tholonet (Aix-en-Provence)",
    period: "1847 – 1854",
    credits: "© Camille Moirenc",
    shortDescription: "Construit au XIXe siècle, il est l’un des tout premiers barrages voûtes de l’ère industrielle.",
    contentMarkdown: `# Le Barrage Zola (1847–1854)

### En un coup d'œil
Niché au pied de la montagne Sainte-Victoire sur la commune du Tholonet, le barrage Zola est un monument d'histoire hydraulique. Conçu par l'ingénieur François Zola — le père du célèbre écrivain **Émile Zola** —, il est universellement reconnu comme **le premier barrage-voûte moderne au monde** calculé scientifiquement.

### Comment ça marche ?
Après la terrible épidémie de choléra qui frappa Aix-en-Provence en 1835 en raison du manque d'eau salubre, François Zola proposa d'édifier un barrage pour créer un réservoir d'eau potable sur le ruisseau de la Cause :
- Plutôt que d'amasser un mur de terre ou de pierres lourdes, Zola appliqua les lois mathématiques de la résistance des matériaux pour dessiner un arc en maçonnerie courbé vers l'eau.
- La poussée du lac est transmise radialement sur les deux rives rocheuses de la gorge étroite.
- Bien que François Zola soit mort d'une pneumonie au début du chantier en 1847, ses plans furent rigoureusement respectés jusqu'à l'inauguration de l'ouvrage en 1854.

### Chiffres clés & Repères
- **Hauteur** : **36,5 mètres** au-dessus du lit du ruisseau.
- **Longueur en crête** : **66 mètres**.
- A assuré l'alimentation en eau potable d'Aix-en-Provence jusqu'en 1877 avant d'être secondé par le barrage de Bimont situé en amont.

> **Le saviez-vous ?**
> Le jeune Émile Zola a passé son enfance à se promener autour du barrage conçu par son père en compagnie de son ami d'école... **Paul Cézanne** ! Les deux amis y passaient des journées entières à nager et philosopher, et Cézanne a peint le barrage Zola dans plusieurs de ses célèbres toiles.`,
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
    location: "Le Revest-les-Eaux (Var)",
    period: "1910 – 1912",
    credits: "© NGE / CFBR",
    shortDescription: "Situé près de Toulon, il stocke l’eau pour contribuer à l’approvisionnement en eau potable de la ville.",
    contentMarkdown: `# Barrage de Dardennes (1910–1912)

### En un coup d'œil
Bâti au pied des falaises calcaires du Mont Caume sur la commune du Revest-les-Eaux, le barrage de Dardennes est le **château d'eau centenaire de la métropole de Toulon**. Construit à la veille de la Première Guerre mondiale, il sécurise toujours aujourd'hui l'eau potable de la ville et de son port militaire.

### Comment ça marche ?
Le barrage de Dardennes est un barrage-poids en maçonnerie cyclopéenne et béton, légèrement incurvé :
- Il barre le cours du fleuve côtier le **Las** et recueille les eaux d'un réseau de sources sous-marines et karstiques très abondantes (les sources du Ragas et de la Foux).
- L'eau stockée dans le lac du Revest (1,1 million de $m^3$) est acheminée directement vers l'usine de potabilisation située immédiatement au pied de l'ouvrage, où elle est filtrée et ozonée avant distribution.
- Le barrage a fait l'objet d'un vaste programme de confortement et de modernisation de 2020 à 2022 pour renouveler ses organes de vidange et son étanchéité pour le siècle à venir.

### Chiffres clés & Repères
- **Hauteur** : **31,6 mètres** (près de 38 m au-dessus des fondations).
- **Longueur de crête** : **154 mètres**.
- **Superficie de la retenue** : environ 10 hectares sur la commune du Revest.
- Construit entre 1910 et 1912 par la Compagnie Générale des Eaux pour la ville de Toulon.

> **Le saviez-vous ?**
> La retenue de Dardennes a été l'un des premiers sites au monde à tester dès 1924 le procédé de désinfection de l'eau potable par « verdunisation » (mise au point par Philippe Bunau-Varilla lors de la bataille de Verdun pour protéger les poilus de la typhoïde), assurant à Toulon une sécurité sanitaire d'avant-garde.`,
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
    location: "Corse-du-Sud (Levie / Sorbollano)",
    period: "2007 – 2013",
    credits: "© Bruno Conty / EDF",
    shortDescription: "Mis en service en 2013 en Corse, il produit de l’hydroélectricité pour alimenter le réseau électrique de l’île.",
    contentMarkdown: `# Barrage du Rizzanese (2007–2013)

### En un coup d'œil
Inauguré en 2013 au cœur de l'Alta Rocca en Corse-du-Sud, le barrage du Rizzanese est le **plus haut barrage de Corse** et le plus puissant aménagement hydroélectrique de l'Île de Beauté. C'est l'un des derniers grands barrages construits en France au XXIe siècle.

### Comment ça marche ?
Le Rizzanese est un barrage-poids ultramoderne en **Béton Compacté au Rouleau (BCR)** :
- Sa structure a été érigée par couches horizontales compactées successives en un temps record grâce à ce matériau de pointe.
- L'eau retenue à 530 m d'altitude est acheminée à travers une galerie souterraine de 5,7 km sous la montagne, puis dévale une conduite forcée jusqu'à la centrale de Sainte-Lucie-de-Tallano.
- Sur une île non connectée au grand réseau électrique continental européen, le Rizzanese joue un rôle stratégique absolu : ses turbines de 55 MW fournissent une énergie ultra-réactive pour stabiliser le réseau corse lors des pics de consommation matin et soir.

### Chiffres clés & Repères
- **Hauteur** : **40,5 mètres** — Longueur de crête : **140 mètres**.
- **Puissance installée** : **55 MW** (produit environ 80 millions de kWh par an).
- Assure à lui seul près de **40 % de la production hydroélectrique de toute la Corse**.
- Mis en service complet en septembre 2013 par EDF.

> **Le saviez-vous ?**
> Le chantier du Rizzanese a été conçu avec des exigences environnementales de pointe : il comprend un débit écologique réservé en continu et des aménagements spécifiques pour préserver la truite macrostigma endémique des rivières corses.`,
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
    location: "Hauts-de-France",
    period: "2022 – 2030+",
    credits: "© Société du Canal Seine-Nord Europe",
    shortDescription: "En construction, il reliera l’Oise au canal Dunkerque-Escaut pour développer le transport fluvial.",
    contentMarkdown: `# Canal Seine-Nord Europe (2022–2032)

### En un coup d'œil
Le Canal Seine-Nord Europe (CSNE) est le **plus grand chantier d'infrastructure fluviale d'Europe du XXIe siècle**. Long de 107 kilomètres entre Compiègne et le canal Dunkerque-Escaut, il va désenclaver le réseau fluvial français en le reliant aux 20 000 km de voies navigables à grand gabarit du Benelux et d'Allemagne.

### Comment ça marche ?
Ce gigantesque corridor fluvial est un concentré d'innovations technologiques et écologiques :
- **Grand gabarit européen (classe Vb)** : le canal mesure 54 mètres de large et 4,5 mètres de profondeur, permettant le passage de convois poussés jaugeant jusqu'à **4 400 tonnes**.
- **6 écluses géantes à bassins d'épargne** : pour franchir des dénivellations record atteignant jusqu'à 25 mètres de hauteur (parmi les plus hautes d'Europe !), les écluses sont équipées de bassins d'épargne étagés qui récupèrent et recyclent **plus de 75 % de l'eau** à chaque sassement pour ne pas épuiser les rivières locales.
- **Un mégaréservoir dédié** : un lac-réservoir de 14 millions de $m^3$ à Louette sécurise l'alimentation en eau du canal même en cas d'été caniculaire.

### Chiffres clés & Repères
- **Longueur** : **107 kilomètres** à travers l'Oise, la Somme, le Pas-de-Calais et le Nord.
- **Report modal** : chaque grand convoi fluvial sur le canal retirera l'équivalent de **220 camions** sur l'autoroute A1 saturée, évitant l'émission de 50 millions de tonnes de $CO_2$.
- Chantier lancé en **2022**, mise en service prévue à l'horizon **2030–2032**.

> **Le saviez-vous ?**
> Pour ne pas couper la continuité des cours d'eau naturels et de la faune terrestre, le canal Seine-Nord Europe sera franchi par plus de 60 ponts routiers et ferroviaires, et traversera la vallée de la Somme grâce à un **pont-canal spectaculaire de 1,3 kilomètre de long** perché sur des piliers au-dessus des marais !`,
  },
];
