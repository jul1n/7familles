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
    shortDescription: "Il paie la construction du barrage, puis s'en occupe toute sa vie : entretien, surveillance, sécurité.",
    contentMarkdown: `# Le propriétaire

### En bref
Le propriétaire, c'est le **gardien du barrage**. Comme le propriétaire d'une maison, il paie pour qu'elle tienne debout et soit en bon état. Sauf que sa « maison » retient des millions de litres d'eau !

### Comment ça marche ?
En France, beaucoup de grands barrages appartiennent à **l'État**. Il en confie le fonctionnement à une entreprise, par un contrat appelé **concession** (EDF, par exemple, produit l'électricité avec). Les barrages qui servent à l'eau du robinet ou à arroser les champs appartiennent plutôt à des villes ou à des groupes de communes.

Le propriétaire doit :
- **payer** la surveillance et les réparations, année après année ;
- **imaginer le pire** : tous les dix ans, il rédige une étude des dangers (que se passerait-il en cas de très grosse crue, c'est-à-dire quand la rivière déborde, ou de tremblement de terre ?) ;
- **travailler avec l'État**, qui vérifie que tout est bien sûr pour les habitants en aval, c'est-à-dire plus bas dans la vallée.

### À retenir
- Les barrages français sont rangés en 3 catégories, **A, B et C**, selon leur taille.
- Les plus grands (classe A) ont plus de **20 mètres** de haut, soit un immeuble de 7 étages. Ils sont les plus contrôlés.

### Les mots à connaître
- **Concession** : autorisation donnée par l'État d'utiliser le barrage pendant des années.
- **Aval** : le côté du barrage où la rivière continue sa route.

> **Le saviez-vous ?**
> Chaque grand barrage a un plan d'alerte pour les habitants, avec des **sirènes**. Elles sont testées régulièrement, pour que tout le monde soit prêt si un jour il fallait évacuer.`,
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
    shortDescription: "Elle invente la forme du barrage et fait tous les calculs pour qu'il résiste à l'eau et au terrain.",
    contentMarkdown: `# La conceptrice

### En bref
La conceptrice est **l'architecte-ingénieure** du barrage. Avant la première pelleteuse, elle dessine le barrage et vérifie, avec des maths et des ordinateurs, qu'il ne cassera jamais.

### Comment ça marche ?
Elle travaille dans un bureau d'études, une équipe d'ingénieurs. Elle commence par se demander : *quelle forme va le mieux avec cette vallée ?* Un mur courbe ? Un énorme tas de pierres ? Un mur très lourd ?

Ensuite elle utilise des outils très malins :
- **Une maquette dans l'ordinateur** : elle fait « pousser » l'eau, le froid, le chaud et même les tremblements de terre contre un barrage virtuel, pour voir où il souffre.
- **Le calcul des crues** : elle prévoit la plus grosse crue possible, pour que le trop-plein s'évacue sans passer par-dessus.
- **Le choix des matériaux** : quel béton, quelle terre, quels cailloux.

### À retenir
Un barrage est calculé pour résister à une crue qui n'arrive qu'**une fois tous les 1 000 à 10 000 ans** !

### Les mots à connaître
- **Béton** : mélange de ciment, de sable, de cailloux et d'eau, qui durcit comme de la pierre.
- **Crue** : moment où la rivière gonfle très fort.

> **Le saviez-vous ?**
> Un ingénieur français, **André Coyne**, a inventé le barrage-voûte mince : un mur courbe, fin et solide. Ses barrages ont été construits sur plusieurs continents.`,
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
    shortDescription: "Il fait sortir le barrage de terre en suivant les plans, avec des centaines de personnes et des machines géantes.",
    contentMarkdown: `# Le constructeur

### En bref
Le constructeur est le **chef de chantier géant**. Il transforme les plans en vrai barrage, parfois en haute montagne, dans des gorges étroites ou au milieu d'un fleuve. Des centaines de personnes travaillent avec lui.

### Comment ça marche ?
Construire un barrage, c'est un grand jeu de patience, en plusieurs étapes :
1. **Détourner la rivière.** On ne peut pas bâtir les pieds dans l'eau ! La rivière passe d'abord dans un tunnel creusé dans la montagne, pendant qu'un petit mur provisoire (un *batardeau*) la tient à distance.
2. **Creuser jusqu'au rocher solide.** Comme pour les fondations d'une maison, il faut une base bien dure.
3. **Couler le béton**, par gros blocs. À l'intérieur, de petits tuyaux d'eau froide le refroidissent, car le béton chauffe en séchant et pourrait se fissurer.

### À retenir
- Un grand chantier dure en général **3 à 8 ans**.
- On installe sur place des **téléphériques** pour transporter le matériel, une usine à béton et des machines qui broient la roche.

### Les mots à connaître
- **Batardeau** : mur provisoire qui garde l'eau à l'écart pendant les travaux.
- **Fondation** : la partie qui s'enfonce dans le sol pour tenir le barrage.

> **Le saviez-vous ?**
> Le barrage Hoover, aux États-Unis, contient des kilomètres de tuyaux d'eau froide. Sans eux, le béton aurait mis **plus de 100 ans** à refroidir et se serait fissuré !`,
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
    shortDescription: "Il surveille la santé du barrage, comme un médecin, pour repérer le moindre problème très tôt.",
    contentMarkdown: `# L'expert sécurité

### En bref
L'expert sécurité est le **médecin du barrage**. Il l'écoute, le mesure et le surveille, jour et nuit, pour repérer un tout petit problème bien avant qu'il devienne grave. Ce travail s'appelle l'**auscultation**.

### Comment ça marche ?
Un barrage n'est pas complètement immobile : il bouge un tout petit peu ! Il se dilate (devient un peu plus grand) quand il fait chaud, et se rétracte quand il fait froid. L'expert :
- lit les mesures d'un **pendule** : un long fil tendu dans le barrage, qui montre de combien le mur se déplace, au dixième de millimètre près ;
- regarde la **pression de l'eau** qui s'infiltre sous le barrage ;
- envoie des **plongeurs** ou des petits robots sous-marins inspecter le mur côté lac.

### À retenir
Le barrage est inspecté **toutes les semaines** à l'œil, très précisément chaque année, puis à fond **tous les 10 ans**.

### Les mots à connaître
- **Auscultation** : examiner le barrage avec des instruments, comme un docteur avec un stéthoscope.
- **Infiltration** : de l'eau qui se glisse doucement dans la roche ou le sol.

> **Le saviez-vous ?**
> Le meilleur indice, c'est l'**eau des drains**, de petits tuyaux qui évacuent les infiltrations. Si elle est bien claire, tout va bien. Si elle devient trouble, c'est peut-être de la terre qui s'en va : il faut vite vérifier !`,
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
    shortDescription: "Elle étudie la pluie, les rivières et les crues pour savoir combien d'eau arrive, et quand.",
    contentMarkdown: `# L'hydrologue

### En bref
L'hydrologue est **la scientifique du voyage de l'eau**. Elle suit l'eau depuis la pluie ou la neige jusqu'à la rivière, pour prévoir les crues (trop d'eau) et les sécheresses (pas assez).

### Comment ça marche ?
Pour prévoir, elle mène l'enquête :
- **Elle mesure** : des stations placées dans les rivières mesurent le débit (la quantité d'eau qui passe) et des radars suivent la pluie.
- **Elle compare avec l'histoire** : quelle a été la plus grosse crue en 100 ans ? en 1 000 ans ? Le barrage doit pouvoir y faire face.
- **Elle regarde l'avenir** : avec le changement du climat, il y aura moins de neige et plus d'orages. Elle aide à bien gérer l'eau d'ici 2050.

### À retenir
Le débit se mesure en **mètres cubes par seconde** (m³/s). Un mètre cube, c'est 1 000 litres, comme 10 baignoires pleines. Lors des crues dans les Cévennes, une petite rivière peut devenir **mille fois plus puissante** en quelques heures !

### Les mots à connaître
- **Bassin versant** : toute la zone où la pluie finit dans la même rivière.
- **Évaporation** : quand l'eau d'un lac s'envole en vapeur, avec le soleil et le vent.

> **Le saviez-vous ?**
> Un grand lac peut perdre **plusieurs millimètres d'eau par jour** en été, rien que par évaporation. Les hydrologues le mesurent aussi !`,
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
    shortDescription: "Avant le chantier, elle étudie les roches et le sol pour vérifier que le terrain est assez solide.",
    contentMarkdown: `# La géologue

### En bref
Un barrage ne vaut que ce que vaut le sol sur lequel il repose ! La géologue est **la spécialiste des roches**. Elle explore le sous-sol de la vallée pour être sûre qu'il ne cédera pas, et qu'il ne laissera pas fuir l'eau.

### Comment ça marche ?
Dès les premières études, elle :
- **creuse des forages** et remonte des « carottes » : de longs cylindres de roche, pour repérer les fissures et les poches d'argile ;
- **teste l'étanchéité** : elle injecte de l'eau sous pression dans le trou et regarde si elle s'échappe ;
- **prévoit un « voile d'injection »** : un rideau de ciment liquide poussé dans les petites fissures, pour boucher les passages de l'eau.

### À retenir
Pour un barrage en forme de voûte, les falaises de chaque côté doivent supporter une poussée équivalente au poids de **plusieurs dizaines de tours Eiffel** !

### Les mots à connaître
- **Géologue** : personne qui étudie les roches et l'histoire de la Terre.
- **Faille** : grande fissure naturelle dans la roche.

> **Le saviez-vous ?**
> En 1959, le barrage de Malpasset (France) s'est rompu. Ce n'est pas le béton qui a cédé, mais la **roche** sur laquelle il s'appuyait. Depuis, on étudie la roche encore bien plus soigneusement.`,
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
    shortDescription: "Les barrages gardent de l'eau qu'on nettoie ensuite pour qu'elle soit bonne à boire, à cuisiner et pour se laver.",
    contentMarkdown: `# L'eau potable

### En bref
Quand tu ouvres le robinet, d'où vient l'eau ? Parfois d'un barrage ! Ces grands lacs sont comme des **châteaux d'eau géants**. Ils gardent de l'eau en réserve, même après des mois sans pluie.

### Comment ça marche ?
1. **Protéger le lac.** Autour, il est interdit de rejeter des produits polluants : l'eau doit rester propre dès le départ.
2. **Choisir la bonne eau.** La prise d'eau (l'entrée, comme une paille géante) peut puiser à plusieurs profondeurs, pour prendre l'eau la plus fraîche et la plus claire selon la saison.
3. **La nettoyer.** Dans une usine, elle est filtrée, on laisse les saletés tomber au fond (*décantation*), puis on la désinfecte. Elle part ensuite dans les tuyaux vers les maisons.

### À retenir
En France, environ **3 litres d'eau potable sur 10** viennent de l'eau de surface : des rivières et des barrages.

### Les mots à connaître
- **Potable** : bonne à boire, sans danger pour la santé.
- **Désinfecter** : tuer les microbes.

> **Le saviez-vous ?**
> À Marseille, l'eau du robinet vient des Alpes ! Elle voyage sur **plus de 100 kilomètres** dans des canaux, depuis des barrages comme Serre-Ponçon, en descendant simplement la pente.`,
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
    shortDescription: "L'eau du barrage fait tourner des turbines qui fabriquent de l'électricité, pour s'éclairer, se chauffer et se déplacer.",
    contentMarkdown: `# L'hydroélectricité

### En bref
Le mot est long, mais l'idée est simple : « hydro » veut dire *eau*. L'hydroélectricité, c'est de l'**électricité fabriquée avec de l'eau qui tombe**. C'est la première énergie renouvelable du monde (une énergie qui ne s'épuise pas).

### Comment ça marche ?
Imagine un toboggan géant :
1. L'eau est stockée **en hauteur**, dans le lac.
2. Elle dévale de gros tuyaux d'acier, les **conduites forcées**, de plus en plus vite.
3. Elle frappe les pales d'une **turbine**, une sorte de gros moulin, qui se met à tourner.
4. La turbine fait tourner un **alternateur**, qui fabrique l'électricité, envoyée dans les fils jusqu'à nos maisons.

### À retenir
- Un barrage peut démarrer à pleine puissance en **2 à 3 minutes** seulement !
- En France, l'hydroélectricité fournit environ **1 électricité sur 10**, sans presque rejeter de gaz qui réchauffent la planète.

### Les mots à connaître
- **Renouvelable** : qui se refait tout seul (l'eau revient avec la pluie).
- **Turbine** : roue à pales qu'un fluide fait tourner.

> **Le saviez-vous ?**
> Quand tout le monde allume la lumière le soir, ou que le soleil se couche et que les panneaux solaires s'arrêtent, les barrages **ouvrent leurs vannes en quelques secondes** pour éviter une panne générale !`,
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
    shortDescription: "Les barrages gardent l'eau pour arroser les champs et permettre aux plantes de pousser, même en été.",
    contentMarkdown: `# L'irrigation

### En bref
Sans eau, les plantes ne poussent pas ! L'**irrigation**, c'est apporter de l'eau aux champs, aux vergers et aux potagers. Les barrages mettent de côté l'eau de la pluie et de la neige de l'hiver, pour la donner aux cultures en été.

### Comment ça marche ?
- L'eau est lâchée dans la rivière, ou envoyée par des **canaux** et des tuyaux jusqu'aux champs.
- Elle arrive dans des systèmes d'arrosage malins, comme le **goutte-à-goutte**, qui donne à chaque plante juste ce qu'il lui faut, sans gaspiller.
- Grâce à ces réserves, on n'a pas besoin de trop pomper dans les rivières et les nappes souterraines (l'eau cachée dans le sol) quand elles sont presque à sec.

### À retenir
- Dans le monde, l'agriculture utilise environ **7 litres d'eau douce sur 10**.
- En France, on irrigue environ **1,6 million d'hectares** : l'équivalent de plus de 2 millions de terrains de foot.

### Les mots à connaître
- **Culture** : plantes qu'on fait pousser pour les récolter.
- **Nappe phréatique** : réserve d'eau cachée sous la terre.

> **Le saviez-vous ?**
> Le lac de Serre-Ponçon permet d'arroser **plus de 150 000 hectares** en Provence. Grâce à lui, on y cultive fruits et légumes même quand il ne pleut presque pas !`,
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
    shortDescription: "Le barrage garde ou lâche de l'eau pour éviter les inondations et pour que la rivière ne s'assèche pas.",
    contentMarkdown: `# La régulation du débit

### En bref
Le **débit**, c'est la quantité d'eau qui passe dans la rivière. Il n'est jamais tout à fait pareil : parfois la rivière déborde, parfois elle est presque à sec. Le barrage joue le rôle de **robinet géant** pour calmer tout ça.

### Comment ça marche ?
Il a deux missions :
1. **Couper la crue.** Quand il pleut très fort, le barrage garde une partie du lac vide, comme une grande baignoire. Il y stocke l'eau en trop, puis la relâche tout doucement. Les villes plus bas sont sauvées !
2. **Aider la rivière en été.** Quand la rivière manque d'eau (on appelle cela l'**étiage**), le barrage lâche un peu d'eau en continu. Les poissons survivent, les usines tournent et les centrales électriques restent refroidies.

### À retenir
Les 4 grands lacs-réservoirs en amont de Paris peuvent garder **810 millions de mètres cubes** d'eau, de quoi remplir 320 000 piscines olympiques, pour protéger la capitale des inondations.

### Les mots à connaître
- **Crue** : rivière qui gonfle et risque de déborder.
- **Étiage** : période où la rivière est au plus bas.

> **Le saviez-vous ?**
> Pendant la canicule de 2022, **jusqu'à 40 % de l'eau de la Loire**, à certains endroits, venait des barrages ! Sans eux, le plus long fleuve de France aurait été presque à sec.`,
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
    shortDescription: "Grâce aux barrages et aux écluses, les bateaux peuvent naviguer sur les rivières et les fleuves.",
    contentMarkdown: `# Le transport sur l'eau

### En bref
Un fleuve sauvage a des courants forts et des endroits trop peu profonds pour les bateaux. Les barrages et les canaux le transforment en **autoroute sur l'eau**, où des péniches transportent d'énormes chargements en consommant peu d'énergie.

### Comment ça marche ?
- Les barrages créent comme des **marches d'escalier d'eau calme**, qu'on appelle des *biefs*.
- Pour passer d'une marche à l'autre, le bateau entre dans une **écluse** : une grande boîte avec une porte à chaque bout. On ferme les portes, on remplit ou on vide la boîte, et le bateau **monte ou descend** comme dans un ascenseur.
- Le Rhin, le Rhône et la Seine relient ainsi les ports aux grandes villes et aux usines.

### À retenir
Un grand convoi de 4 400 tonnes transporte autant que **220 camions**, avec environ 4 fois moins de pollution (CO₂, le gaz qui réchauffe la planète).

### Les mots à connaître
- **Écluse** : ascenseur à bateaux qui fonctionne avec l'eau.
- **Péniche** : long bateau plat qui transporte des marchandises.

> **Le saviez-vous ?**
> Au barrage des Trois-Gorges, en Chine, un vrai **ascenseur à bateaux** soulève des navires de 3 000 tonnes sur **113 mètres** (presque autant qu'un immeuble de 35 étages), en moins de 40 minutes.`,
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
    shortDescription: "Les lacs de barrage attirent des visiteurs qui viennent s'amuser et admirer les paysages.",
    contentMarkdown: `# Le tourisme et les loisirs

### En bref
En retenant l'eau au creux d'une vallée, un barrage crée un **lac magnifique**, souvent turquoise. Ces lacs sont devenus des lieux de vacances très aimés : on s'y baigne, on y fait du bateau, on s'y promène.

### Comment ça marche ?
Un lac calme au milieu des montagnes ou des forêts permet plein d'activités :
- **Sports nautiques** : voile, planche à voile, paddle, canoë-kayak, aviron.
- **Baignade et détente** : plages surveillées, campings et chemins de randonnée autour du lac.
- **Pêche** : on y trouve des brochets, des perches et des truites.
- **Un accord en été** : l'entreprise qui produit l'électricité s'engage à garder assez d'eau dans le lac de juin à septembre, pour que tout le monde profite des activités.

### À retenir
Les lacs de Serre-Ponçon et de Sainte-Croix (dans les gorges du Verdon) accueillent chacun **plus d'un million de visiteurs** chaque été.

### Les mots à connaître
- **Nautique** : qui concerne les activités sur l'eau.
- **Randonnée** : longue promenade à pied dans la nature.

> **Le saviez-vous ?**
> Si l'eau de certains lacs de montagne est turquoise, c'est grâce à la **« farine de roche »** : de minuscules grains de roche, broyés par les glaciers, flottent dans l'eau et renvoient la lumière du soleil.`,
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
    shortDescription: "C'est le grand mur du barrage : il retient toute l'eau du lac et envoie la poussée vers le sol.",
    contentMarkdown: `# Le corps du barrage

### En bref
Le corps, c'est **le mur principal** du barrage, celui qu'on voit en travers de la vallée. Qu'il soit en béton ou en terre et en pierres, son travail est simple : **tenir bon** face à l'énorme poussée de l'eau.

### Comment ça marche ?
Plus on descend dans un lac, plus l'eau pousse fort (tu l'as senti dans les oreilles au fond d'une piscine !). Le corps du barrage est donc construit pour :
- **être plus large en bas qu'en haut**, là où la poussée est la plus forte ;
- **ne pas laisser passer l'eau** : grâce à la masse du béton, ou à un cœur d'argile (une terre très collante) ou à un revêtement spécial côté lac ;
- **être découpé en grands blocs** : un barrage en béton n'est jamais coulé d'une seule pièce, car il se dilate et se rétracte avec la température. Des joints souples entre les blocs gardent tout étanche.

### À retenir
La poussée de l'eau sur un grand barrage peut atteindre **plusieurs millions de tonnes**.

### Les mots à connaître
- **Étanche** : qui ne laisse pas passer l'eau.
- **Argile** : terre fine et collante qui bloque l'eau.

> **Le saviez-vous ?**
> Dans les grands barrages en béton, il y a des **galeries éclairées** à l'intérieur, comme des couloirs de sous-marin. Les techniciens y marchent pour inspecter le barrage de l'intérieur !`,
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
    shortDescription: "Il laisse passer l'eau en trop pour que le lac ne déborde pas par-dessus le barrage.",
    contentMarkdown: `# L'évacuateur de crues

### En bref
L'évacuateur de crues est la **soupape de sécurité** du barrage, comme le trop-plein d'une baignoire. Quand une très grosse crue arrive, il laisse partir l'eau en trop, pour éviter qu'elle passe par-dessus le barrage.

### Comment ça marche ?
Une eau qui tombe de très haut est très puissante. L'évacuateur la guide en trois étapes :
1. **Le seuil** : l'eau déborde au bon endroit, soit toute seule quand elle atteint un niveau précis (sans machine, donc ça ne tombe jamais en panne !), soit en ouvrant de grandes portes appelées *vannes*.
2. **Le coursier** : un énorme **toboggan en béton** qui descend l'eau en douceur.
3. **Le dissipateur d'énergie** : en bas, l'eau est projetée par un **tremplin de saut à ski** en grandes gerbes, ou tombe dans un bassin, pour perdre sa force.

### À retenir
L'évacuateur d'Itaipu (Brésil et Paraguay) peut laisser passer **62 000 mètres cubes par seconde**, soit 40 fois le débit moyen de la Seine à Paris.

### Les mots à connaître
- **Crue** : quand la rivière gonfle très fort.
- **Vanne** : grande porte qui s'ouvre ou se ferme pour contrôler l'eau.

> **Le saviez-vous ?**
> Certains évacuateurs ont la forme d'un **entonnoir géant** (on les appelle « marguerites »). L'eau y tourbillonne, plonge dans un grand trou, puis ressort plus bas, derrière le barrage.`,
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
    shortDescription: "Le terrain sur lequel s'appuie le barrage : il le tient debout et transmet son poids à la roche.",
    contentMarkdown: `# La fondation

### En bref
La fondation, c'est la **racine cachée** du barrage. Enfoncée dans le lit de la rivière et dans les flancs de la montagne, elle supporte le poids du barrage et la poussée du lac.

### Comment ça marche ?
Le grand ennemi, ce n'est pas seulement l'eau qu'on voit, c'est celle qui **se faufile sous le barrage** :
- **La sous-pression** : cette eau pousse vers le haut et voudrait soulever le barrage, comme un bouchon de liège !
- **Le voile d'injection** : on perce des milliers de trous et on y injecte du ciment liquide pour boucher toutes les fissures de la roche, sur 50 à 100 mètres de profondeur.
- **Les drains** : juste derrière, des petits tuyaux récupèrent l'eau qui passe quand même, pour faire baisser la pression sans danger.

### À retenir
Pour un grand barrage, on creuse souvent **20 à 30 mètres** sous le lit de la rivière pour trouver la roche solide.

### Les mots à connaître
- **Fondation** : base enfoncée dans le sol qui supporte un bâtiment ou un barrage.
- **Drain** : petit tuyau qui évacue l'eau.

> **Le saviez-vous ?**
> À Serre-Ponçon, le rocher se trouvait sous **plus de 100 mètres de sable et de graviers** ! Les ingénieurs ont d'abord fabriqué, sous terre, un mur étanche avec un mélange spécial d'argile, avant de poser le barrage dessus.`,
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
    shortDescription: "Elle prélève l'eau du lac pour l'envoyer là où on en a besoin, et permet de vider le lac si c'est nécessaire.",
    contentMarkdown: `# La prise d'eau

### En bref
La prise d'eau est le **robinet du barrage**. C'est la grande entrée par laquelle l'eau du lac part vers les turbines, les canaux d'arrosage ou les usines d'eau potable.

### Comment ça marche ?
Elle comprend plusieurs pièces :
- **Les grilles** : de gros barreaux d'acier arrêtent les troncs d'arbres, les branches et les débris, pour qu'ils n'abîment pas les turbines.
- **La vanne de tête** : une grande porte de sécurité, qui peut couper l'eau d'un coup en cas de problème ou pour une réparation.
- **La vidange de fond** : un énorme tuyau tout en bas du barrage. Il permet de **vider le lac** en cas d'urgence, ou de rejeter la vase (le sable et la boue) qui s'est accumulée au fond.

### À retenir
Dans une conduite forcée, l'eau peut dépasser **100 km/h** en arrivant sur la turbine, la vitesse d'une voiture sur route !

### Les mots à connaître
- **Turbine** : roue qui tourne sous la poussée de l'eau pour fabriquer de l'électricité.
- **Sédiments** : sable, boue et petits cailloux que la rivière transporte.

> **Le saviez-vous ?**
> On teste régulièrement la vidange de fond. Quand sa vanne s'ouvre, l'eau jaillit avec **tellement de force** qu'elle abîmerait n'importe quelle protection : mieux vaut ne pas se trouver devant !`,
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
    shortDescription: "Ils mesurent les mouvements, la pression de l'eau et les fuites pour surveiller la santé du barrage.",
    contentMarkdown: `# Les capteurs

### En bref
Les capteurs sont les **sens du barrage**. Cachés dans le béton et la roche, des centaines d'instruments mesurent jour et nuit les moindres mouvements, la pression de l'eau et les vibrations du sol.

### Comment ça marche ?
Les ingénieurs utilisent plein d'instruments surprenants :
- **Les pendules** : un long fil d'acier tendu dans un puits vertical de 50 à 100 mètres. Il montre, au centième de millimètre près, de combien le barrage bouge.
- **Les piézomètres** : ils mesurent la pression de l'eau dans le barrage et dans le sol.
- **Les bacs de mesure des fuites** : de petits bacs en forme de V mesurent le débit de l'eau qui s'écoule des drains.
- **Les visées par laser et le GPS** : ils vérifient que le haut du barrage ne se déplace pas.

### À retenir
Un barrage-voûte de 100 mètres de haut **avance de quelques millimètres à quelques centimètres** quand le lac se remplit, puis revient quand il se vide. On dit qu'il « respire » !

### Les mots à connaître
- **Capteur** : appareil qui mesure quelque chose (une pression, un mouvement, une température…).
- **Fibre optique** : fil très fin qui transporte la lumière.

> **Le saviez-vous ?**
> Dans certains barrages récents, on a noyé dans le béton **des kilomètres de fibres optiques**. Elles mesurent la température et les plus petits mouvements sur toute la longueur du barrage.`,
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
    shortDescription: "Elle apporte l'eau au lac, puis continue son chemin après le barrage : il faut la protéger, ainsi que ceux qui y vivent.",
    contentMarkdown: `# La rivière

### En bref
Un barrage ne supprime pas la rivière : il **vit avec elle** ! La rivière apporte l'eau (et du sable) jusqu'au lac, puis continue sa route derrière le barrage. Les animaux et les plantes qui y vivent doivent être protégés.

### Comment ça marche ?
Les ingénieurs s'occupent de la **continuité écologique** : la rivière doit rester un lieu de passage pour tout ce qui y vit. Pour cela :
- **Le débit réservé** : une quantité d'eau minimale doit couler en aval, 365 jours par an, pour les poissons, les insectes et les plantes.
- **Les passes à poissons** : des escaliers d'eau, des petits ruisseaux artificiels ou même des ascenseurs à poissons permettent aux truites, saumons et anguilles de franchir le barrage.
- **Le passage du sable** : on laisse descendre sable et graviers vers l'aval, pour que les poissons y trouvent des endroits où pondre.

### À retenir
En France, la loi impose qu'au moins **1/10 du débit moyen** de la rivière continue de couler après le barrage.

### Les mots à connaître
- **Amont / aval** : amont = avant le barrage, côté lac ; aval = après, côté rivière.
- **Poissons migrateurs** : poissons qui voyagent entre la mer et les rivières (saumon, anguille).

> **Le saviez-vous ?**
> Au barrage de Golfech, sur la Garonne, un courant d'eau attire les poissons migrateurs dans une grande cage. Elle les **fait monter en ascenseur** de l'autre côté du barrage !`,
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
    shortDescription: "Il est fait de terre et de roches tassées : une grosse « colline » qui retient l'eau.",
    contentMarkdown: `# Le barrage en remblai

### En bref
Le barrage en remblai ressemble à **une montagne construite par les humains**. Il est fait de terre ou de pierres empilées, avec des pentes douces. C'est le type de barrage le plus répandu au monde, car il s'adapte à presque toutes les vallées.

### Comment ça marche ?
Au lieu d'un mur droit, il a une forme de **grand triangle étalé** :
- **Les « épaulements »** : des millions de tonnes de cailloux et de graviers, qui donnent son poids et sa stabilité au barrage.
- **L'étanchéité** : comme les cailloux laissent passer l'eau, il faut une barrière. Soit un **cœur d'argile** (une terre collante) au milieu, soit un **masque** en béton ou en bitume sur la face côté lac.
- **Les filtres** : des couches de sable trié empêchent l'eau d'entraîner la terre.

### À retenir
- **3 barrages sur 4** dans le monde sont des barrages en remblai.
- **Mont-Cenis (Savoie)** : 120 mètres de haut, et un lac à 2 000 m d'altitude.

### Les mots à connaître
- **Remblai** : tas de terre ou de roches tassé pour former un mur ou une colline.
- **Crête** : le sommet du barrage.

> **Le saviez-vous ?**
> Un barrage en remblai ne doit **JAMAIS** être submergé : l'eau qui passerait par-dessus arracherait la terre en quelques minutes. C'est pourquoi son évacuateur de crues est toujours très grand.`,
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
    shortDescription: "Un mur de béton ou de pierre : c'est son énorme poids qui l'empêche d'être poussé par l'eau.",
    contentMarkdown: `# Le barrage poids

### En bref
Le barrage poids est **le champion de la force brute**. C'est un mur de béton ou de pierre si lourd que son poids seul le colle au sol et l'empêche de glisser ou de basculer sous la poussée de l'eau.

### Comment ça marche ?
Pense à un gros bloc de pierre au bord d'une table : pour le pousser, il faut beaucoup de force !
- L'eau **pousse** le barrage vers l'aval.
- Son **poids** le presse vers le sol, avec une force encore plus grande.
- Résultat : il reste en place. Sa forme, large en bas, plus étroite en haut, ressemble à un **triangle rectangle** : le côté lac est presque droit, le côté aval est en pente.

### À retenir
Le plus haut barrage poids du monde est **la Grande-Dixence** (Suisse) : **285 mètres** de haut, avec **15 millions de tonnes de béton**.

### Les mots à connaître
- **Maçonnerie** : construction en pierres assemblées avec du mortier.
- **BCR (béton compacté au rouleau)** : béton presque sec, étalé par des bulldozers et écrasé par des rouleaux.

> **Le saviez-vous ?**
> Aujourd'hui, de nombreux barrages poids sont faits en **béton compacté au rouleau** : on l'étale comme de la terre, puis on le tasse. On construit ainsi bien plus vite !`,
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
    shortDescription: "Sa forme courbée lui permet de retenir l'eau en s'appuyant sur les falaises de chaque côté.",
    contentMarkdown: `# Le barrage voûte

### En bref
Le barrage voûte est **le plus élégant**. Il est courbé vers le lac, comme un arc. Il ne résiste pas par son poids, mais en **repoussant la poussée de l'eau sur les falaises** de chaque côté de la vallée.

### Comment ça marche ?
C'est le même principe que les arches des vieux ponts ou des églises, mais couché à l'horizontale :
- L'eau pousse sur le mur courbe, qui **se serre sur lui-même** au lieu de plier.
- Le béton adore être serré ! La force suit la courbe, et vient s'appuyer sur la roche des deux côtés : on appelle ces appuis les **culées**.
- Les voûtes modernes sont courbées aussi de haut en bas (*double courbure*), comme la coque d'un bateau, ce qui les rend très fines.

### À retenir
- Un barrage voûte utilise **3 à 5 fois moins de béton** qu'un barrage poids de même hauteur.
- **Quinson (Verdon)** : une jolie voûte de 45 mètres de haut.

### Les mots à connaître
- **Voûte** : forme courbe, comme un arc.
- **Culée** : appui de roche ou de béton qui reçoit la poussée.

> **Le saviez-vous ?**
> Plus le lac est plein et plus l'eau pousse fort, **plus la voûte se serre sur elle-même** et devient solide. Un barrage voûte est donc plus rigide quand il est bien rempli !`,
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
    shortDescription: "Des rivières creusées par les humains pour amener l'eau d'un endroit à un autre et faire naviguer les bateaux.",
    contentMarkdown: `# Les canaux

### En bref
Un canal, c'est une **rivière fabriquée par les humains**. On le creuse à travers plaines et collines pour transporter des marchandises, apporter de l'eau aux villes ou irriguer les champs.

### Comment ça marche ?
Une rivière descend la pente toute seule. Un canal, lui, est plutôt un **escalier de plans d'eau plats** :
- **Le bief** : un tronçon bien étanche, où l'eau reste calme et à niveau constant, pour que les péniches avancent sans lutter contre un courant.
- **Les écluses** : pour monter une colline, les bateaux passent d'écluse en écluse, comme dans un ascenseur.
- **Les ponts-canaux** : pour traverser une rivière ou une vallée, on construit un pont qui porte un canal ! Le plus célèbre en France est celui de Briare, au-dessus de la Loire.

### À retenir
- **Canal d'Ille-et-Rance** (Bretagne) : 84 km et 48 écluses entre Rennes et Saint-Malo, ouvert en 1832.
- La France compte **8 500 km** de canaux et de rivières aménagées : le plus long réseau d'Europe.

### Les mots à connaître
- **Bief** : portion de canal entre deux écluses.
- **Péniche** : bateau long et plat pour transporter des marchandises.

> **Le saviez-vous ?**
> Le point le plus haut d'un canal manque toujours d'eau, car chaque éclusage en fait descendre. On le réapprovisionne avec des **barrages-réservoirs**, sinon le canal s'assécherait !`,
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
    shortDescription: "Une longue construction qui protège les habitants et les terres contre les inondations.",
    contentMarkdown: `# La digue de protection

### En bref
Un barrage barre la rivière pour faire un lac. Une digue, elle, est **un long mur qui longe la rivière ou la mer**, parfois sur des kilomètres, pour empêcher l'eau d'inonder les villes et les champs.

### Comment ça marche ?
- **Quand tout va bien** : la digue est au sec, ou l'eau touche à peine son pied.
- **Quand il y a une crue** : l'eau monte, et la digue la garde dans son lit.
- **Les risques surveillés** :
  - *la surverse* : l'eau passe par-dessus et ronge la digue par l'arrière ;
  - *le renard hydraulique* : l'eau se glisse sous la digue et emporte le sable, comme un petit tunnel qui s'agrandit ;
  - *le glissement* : la digue imbibée d'eau perd de sa solidité et glisse.
- **Une astuce** : on prévoit parfois un endroit volontairement plus bas où l'eau peut déborder, vers des champs, pour **protéger les maisons**.

### À retenir
En France, plus de **9 000 km de digues** protègent des millions de personnes, le long de la Loire, du Rhône, de la Seine et de la côte.

### Les mots à connaître
- **Inondation** : quand l'eau envahit des terres qui sont normalement sèches.
- **Digue** : long mur ou talus qui retient l'eau.

> **Le saviez-vous ?**
> Depuis la loi **GEMAPI**, les digues ne sont plus de simples buttes d'herbe : ce sont des « systèmes d'endiguement », surveillés de près par les communes et l'État.`,
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
    shortDescription: "Elle pompe l'eau vers le haut quand il y a trop d'électricité, puis la fait redescendre pour en produire quand il en manque.",
    contentMarkdown: `# La STEP

### En bref
STEP veut dire **Station de Transfert d'Énergie par Pompage**. C'est comme **une batterie géante** : on y stocke de l'électricité sous forme d'eau en hauteur, et on la récupère quand on en a besoin.

### Comment ça marche ?
Une STEP a deux lacs : un en haut, un en bas.
1. **S'il y a trop d'électricité** (la nuit, ou en plein soleil quand les panneaux solaires produisent beaucoup) : des pompes **montent l'eau** du lac du bas vers le lac du haut. L'électricité en trop est ainsi mise de côté !
2. **S'il en manque** (par exemple à 19 h en hiver, quand tout le monde allume la lumière) : on ouvre les vannes. L'eau **redescend** et fait tourner des turbines, qui fabriquent de l'électricité en moins de 3 minutes.

### À retenir
- **95 %** de l'électricité stockée dans le monde est conservée dans des STEP !
- **Grand'Maison** (Isère) : la plus puissante d'Europe, **1 800 MW**.
- **Revin** (Ardennes) : 800 MW.

### Les mots à connaître
- **MW (mégawatt)** : unité de puissance. 1 MW fait fonctionner environ 1 000 radiateurs électriques.
- **Rendement** : ce qu'on récupère par rapport à ce qu'on a mis.

> **Le saviez-vous ?**
> Une STEP récupère environ **75 à 80 %** de l'électricité utilisée pour pomper : sur 100 « unités » dépensées, on en retrouve près de 80 !`,
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
    shortDescription: "Construit sur le fleuve Paraná, il produit de l'électricité pour le Brésil et le Paraguay, qui se le partagent.",
    contentMarkdown: `# Le barrage d'Itaipu (Brésil et Paraguay)

### En bref
Itaipu est construit sur le fleuve Paraná, **à la frontière du Brésil et du Paraguay**, deux pays qui l'ont bâti ensemble. C'est l'un des **plus gros producteurs d'électricité du monde**, grâce à ses 20 énormes turbines.

### Comment ça marche ?
Itaipu mélange un grand barrage en béton et de longues digues de terre sur les côtés :
- **20 tuyaux géants** de 10,5 mètres de diamètre (un bus à deux étages y passerait !) envoient l'eau sur des turbines qui pèsent près de 300 tonnes chacune.
- **Deux « langues » électriques** : le Paraguay utilise un courant à 50 hertz et le Brésil à 60 hertz (le *hertz* mesure la vitesse à laquelle le courant « va et vient »). La moitié des turbines tourne donc d'une façon, l'autre moitié de l'autre.

### À retenir
- **Puissance** : 14 000 MW.
- En 2016, Itaipu a produit **103 milliards de kWh** : de quoi couvrir environ 85 % de l'électricité du Paraguay et 15 % de celle du Brésil.
- **Longueur** : 7,9 km. **Hauteur** : 196 m.

### Les mots à connaître
- **kWh (kilowattheure)** : quantité d'électricité. Un four électrique allumé 1 heure en consomme environ 2.
- **Binational** : qui appartient à deux pays.

> **Le saviez-vous ?**
> Avec le béton d'Itaipu, on aurait pu construire **210 stades de foot** comme le Maracanã (le célèbre stade de Rio) !`,
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
    shortDescription: "Il permet aux bateaux de passer de la Méditerranée à la mer Rouge, sans faire tout le tour de l'Afrique.",
    contentMarkdown: `# Le canal de Suez (Égypte)

### En bref
Creusé en plein désert, entre l'Afrique et l'Asie, le canal de Suez est un **raccourci géant** entre la mer Méditerranée et la mer Rouge. Sans lui, les bateaux devraient faire le tour de l'Afrique : plus de **7 000 km** en plus !

### Comment ça marche ?
Le canal de Suez a une particularité : **il n'a aucune écluse** !
- La Méditerranée et la mer Rouge sont presque au **même niveau**. L'eau de mer coule donc librement d'un bout à l'autre, comme dans une grande tranchée remplie d'eau.
- C'est un **chenal creusé et dragué** (nettoyé des sables qui s'y accumulent) dans le sable et l'argile. Il traverse un grand lac, où les bateaux peuvent se croiser.

### À retenir
- **Longueur** : 193 km, de Port-Saïd à Suez.
- **Inauguré** le 17 novembre 1869, après 10 ans de travaux, par le Français Ferdinand de Lesseps.
- Environ **12 %** du commerce mondial y passe.

### Les mots à connaître
- **Écluse** : ascenseur à bateaux qui rattrape une différence de niveau d'eau.
- **Porte-conteneurs** : très grand bateau qui transporte des caisses métalliques géantes.

> **Le saviez-vous ?**
> En mars 2021, un énorme porte-conteneurs de 400 mètres, l'*Ever Given*, s'est retrouvé **en travers du canal** à cause du vent. Il est resté coincé six jours, et plus de 400 bateaux ont dû attendre !`,
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
    shortDescription: "Il retient l'eau des montagnes suisses pour produire de l'électricité dans des centrales.",
    contentMarkdown: `# Le barrage de la Grande-Dixence (Suisse)

### En bref
À 2 365 mètres d'altitude, dans les Alpes suisses, la Grande-Dixence est **le plus haut barrage poids du monde**. Ce mur de béton gigantesque retient la fonte de dizaines de glaciers.

### Comment ça marche ?
Pour remplir ce lac de 400 millions de mètres cubes, les Suisses ont fait un travail de titan :
- Sous la montagne, **100 kilomètres de galeries** collectent l'eau de 35 glaciers, dont ceux près de Zermatt et du Cervin (une montagne en forme de dent), pour l'amener au lac.
- L'eau est ensuite envoyée dans la centrale de Bieudron par une chute de **1 883 mètres**, un record mondial ! Elle frappe des turbines parmi les plus puissantes du monde.

### À retenir
- **Hauteur** : 285 m, presque la tour Eiffel (330 m avec l'antenne).
- **Béton** : 15 millions de tonnes.
- Construit entre 1951 et 1965 ; chaque hiver, le chantier s'arrêtait pendant des mois à cause du gel et de la neige.

### Les mots à connaître
- **Glacier** : énorme masse de glace qui avance très lentement.
- **Altitude** : hauteur au-dessus du niveau de la mer.

> **Le saviez-vous ?**
> Au fond du lac se trouve **un ancien barrage**, celui de la Dixence, construit dans les années 1930. Quand le grand barrage a été rempli, le petit a été englouti, et il y dort toujours !`,
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
    shortDescription: "Il forme un immense lac en retenant le fleuve Zambèze, entre la Zambie et le Zimbabwe.",
    contentMarkdown: `# Le barrage de Kariba (Zambie et Zimbabwe)

### En bref
Construit dans les années 1950 sur le fleuve Zambèze, en Afrique, Kariba a donné naissance au **plus grand lac artificiel du monde en volume d'eau**. Le barrage est une grande voûte, dessinée par l'ingénieur français André Coyne.

### Comment ça marche ?
Kariba est un **barrage voûte** : il est courbé, et la poussée du fleuve est envoyée sur les parois rocheuses de la gorge.
- Deux centrales électriques, une de chaque côté du fleuve (une en Zambie, une au Zimbabwe), alimentent la région et ses mines de cuivre.

### À retenir
- Le lac contient **180 milliards de mètres cubes d'eau** : quatre fois plus que le lac des Trois-Gorges !
- **Hauteur** : 128 m. **Longueur** : 579 m.
- Le lac couvre plus de **5 500 km²**, à peu près la taille d'un département français.

### Les mots à connaître
- **Zambèze** : grand fleuve d'Afrique australe, célèbre pour les chutes Victoria.
- **Mine** : endroit où l'on extrait des minerais, comme le cuivre.

> **Le saviez-vous ?**
> Pendant le chantier, le fleuve a connu de très grosses crues. Les habitants de la région disaient que c'était la colère de **Nyaminyami**, le dieu-serpent du fleuve. Les ingénieurs ont tenu bon et ont terminé le barrage !`,
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
    shortDescription: "Sur le fleuve Yangtsé, c'est le barrage qui produit le plus d'électricité au monde.",
    contentMarkdown: `# Le barrage des Trois-Gorges (Chine)

### En bref
Sur le Yangtsé, le plus long fleuve de Chine, le barrage des Trois-Gorges est **la plus puissante centrale électrique du monde**. C'est l'un des plus grands chantiers jamais réalisés.

### Comment ça marche ?
Il remplit trois missions à la fois :
1. **Produire de l'électricité** : 32 énormes groupes de 700 MW chacun, plus deux petits.
2. **Protéger des crues** : avant le barrage, les inondations du Yangtsé faisaient des dizaines de milliers de victimes. Le lac peut retenir **22 milliards de mètres cubes** d'eau de crue.
3. **Permettre la navigation** : cinq écluses en escalier et un **ascenseur à bateaux** de 113 mètres de haut permettent aux cargos de 3 000 tonnes de remonter jusqu'à Chongqing.

### À retenir
- **Puissance** : 22 500 MW, l'équivalent d'une vingtaine de réacteurs nucléaires.
- **Longueur** : 2 335 m. **Hauteur** : 185 m.
- **Béton** : 28 millions de mètres cubes, coulés entre 1994 et 2009.

### Les mots à connaître
- **Réacteur nucléaire** : machine qui produit de l'électricité à partir de l'énergie de l'uranium.
- **Cargo** : gros bateau qui transporte des marchandises.

> **Le saviez-vous ?**
> L'eau du lac est si lourde (près de 40 milliards de tonnes) que, selon des calculs de la NASA, elle a **ralenti la rotation de la Terre de 0,06 microseconde** par jour. Autant dire presque rien, mais c'est vrai !`,
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
    shortDescription: "Il retient le fleuve Colorado pour produire de l'électricité et distribuer l'eau dans toute la région.",
    contentMarkdown: `# Le Hoover Dam (États-Unis)

### En bref
Dans un canyon, à la frontière du Nevada et de l'Arizona, le Hoover Dam est l'un des plus **célèbres barrages du monde**. Il a été construit dans les années 1930, pendant une période difficile pour les États-Unis (la « Grande Dépression »), et a aidé le pays à se relever. Les villes comme Las Vegas lui doivent beaucoup.

### Comment ça marche ?
C'est un **barrage voûte-poids** : il est courbé comme une voûte et aussi très lourd.
- Sa courbe renvoie la poussée du fleuve Colorado vers les parois du canyon, et sa base de 200 mètres d'épaisseur le rend lourd et stable.
- Il a créé le **lac Mead**, l'un des plus grands lacs artificiels des États-Unis. L'eau et l'électricité qu'il fournit servent plus de 20 millions de personnes, à Los Angeles, Las Vegas et Phoenix.
- Son style est l'**Art déco**, avec des tours sculptées.

### À retenir
- **Hauteur** : 221 m. **Longueur** : 379 m.
- **Puissance** : 2 080 MW.
- Inauguré en **1935**, avec plus de 2 ans d'avance sur le calendrier !

### Les mots à connaître
- **Canyon** : vallée très étroite et profonde, creusée par un fleuve.
- **Art déco** : style de décoration très à la mode dans les années 1920-1930.

> **Le saviez-vous ?**
> Près du barrage, deux grandes statues de bronze de 9 mètres de haut veillent sur le site. Leurs **orteils sont devenus brillants**, car les visiteurs les touchent pour porter chance !`,
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
    shortDescription: "Un barrage aux nombreux usages : il forme un lac touristique, produit de l'électricité, irrigue les champs et calme la Durance.",
    contentMarkdown: `# Le barrage de Serre-Ponçon (Alpes)

### En bref
À la rencontre de la Durance et de l'Ubaye, Serre-Ponçon est **le roi des barrages français**. Avant lui, la Durance était surnommée le « troisième fléau de la Provence », à cause de ses crues. Aujourd'hui, ce barrage en terre protège et alimente tout le Sud-Est.

### Comment ça marche ?
Serre-Ponçon est un **barrage en remblai**, avec une histoire d'ingéniosité :
- Sous la rivière, il y avait un canyon enfoui, rempli de **plus de 100 mètres de sable et de graviers** qui laissent passer l'eau.
- Les ingénieurs ont d'abord construit, sous terre, **un mur étanche de 100 mètres de profondeur**, puis monté dessus une montagne de **14 millions de mètres cubes** de terre et de roches.
- Son usine, creusée sous terre, produit de l'électricité, puis l'eau repart dans un canal qui alimente 15 autres centrales jusqu'à l'étang de Berre.

### À retenir
- **Le lac** : 1,27 milliard de mètres cubes, le plus grand lac artificiel de France.
- **Hauteur** : 123 m. **Mis en service** en 1960.

### Les mots à connaître
- **Confluence** : endroit où deux rivières se rejoignent.
- **Fléau** : grand malheur qui revient souvent.

> **Le saviez-vous ?**
> Au milieu du lac, on voit la minuscule **chapelle Saint-Michel**, sur un îlot. C'est la seule construction restée visible quand les villages de Savines et d'Ubaye ont été engloutis par la mise en eau du lac.`,
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
    shortDescription: "Il retient l'eau des montagnes dans les Pyrénées pour produire de l'électricité dans des centrales.",
    contentMarkdown: `# Le barrage de Migouélou (Pyrénées)

### En bref
À **2 278 mètres d'altitude**, dans le Parc national des Pyrénées, Migouélou est un barrage de haute montagne très original. Il est fait de **neuf petites voûtes en béton** qui suivent la forme du terrain.

### Comment ça marche ?
Construire si haut était un défi pour les ingénieurs. Comme tout le ciment devait être monté par **téléphérique**, ils ont choisi un barrage léger :
- **9 voûtes minces** qui s'appuient sur **8 contreforts** (des piliers de béton qui servent d'appuis).
- L'eau stockée alimente, par des galeries creusées dans la roche, une série de **sept centrales électriques** dans la vallée d'Azun.

### À retenir
- **Altitude** : 2 278 m, l'un des plus hauts grands barrages de France.
- **Hauteur** : 31 m. **Longueur** : 274 m.
- Construit entre 1956 et 1958.

### Les mots à connaître
- **Contrefort** : pilier qui soutient un mur par l'arrière ou le côté.
- **Téléphérique** : cabine ou benne suspendue à un câble.

> **Le saviez-vous ?**
> Aucune route ne monte jusqu'au barrage ! Ouvriers, machines (démontées en morceaux) et matériaux sont montés par **téléphérique**. Aujourd'hui, il faut **3 à 4 heures de randonnée** pour le visiter.`,
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
    shortDescription: "Entre Saint-Malo et Dinard, il utilise le mouvement des marées pour produire de l'électricité.",
    contentMarkdown: `# L'usine de la Rance (Bretagne)

### En bref
Entre Saint-Malo et Dinard, l'usine de la Rance a été la **première usine marémotrice du monde** à produire de l'électricité à grande échelle. Elle utilise la force des **marées**, c'est-à-dire de la mer qui monte et qui descend, à cause de l'attraction de la Lune et du Soleil.

### Comment ça marche ?
À Saint-Malo, la mer monte et descend d'une hauteur énorme :
- **Marée montante** : la mer entre dans l'estuaire (l'embouchure de la rivière) à travers les turbines du barrage.
- **Marée descendante** : le barrage retient l'eau. Quand la mer s'est retirée plus bas, on la laisse repartir, et elle fait tourner les turbines dans l'autre sens.
- **Des turbines très spéciales** : 24 turbines « bulbes », inventées pour la Rance, tournent dans les deux sens, et peuvent aussi pomper l'eau en renfort.

### À retenir
- **Marée maximale** : jusqu'à 13,5 m de différence entre marée haute et marée basse.
- **Puissance** : 240 MW.
- **Production** : environ 500 millions de kWh par an, de quoi alimenter une ville comme Rennes.
- Inaugurée en **1966** par le général de Gaulle.

### Les mots à connaître
- **Marée** : montée et descente régulière de la mer, deux fois par jour.
- **Estuaire** : grande embouchure où un fleuve se jette dans la mer.

> **Le saviez-vous ?**
> Le dessus du barrage est aussi **une route à 4 voies** : plus de 30 000 voitures l'empruntent chaque jour pour aller de Dinard à Saint-Malo sans faire le grand tour !`,
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
    shortDescription: "Il permet de naviguer sur le Rhin entre Bâle et Strasbourg et de produire de l'électricité.",
    contentMarkdown: `# Le Grand Canal d'Alsace

### En bref
Le Grand Canal d'Alsace est un **canal de plus de 50 kilomètres** qui longe le Rhin entre Bâle et Strasbourg. Il sert à la fois à **faire naviguer des bateaux** et à **produire de l'électricité**.

### Comment ça marche ?
Au XXe siècle, la France a décidé d'aménager le Rhin, un fleuve alors sauvage :
- Un barrage (à Kembs) **détourne une partie du fleuve** vers un canal très large, jusqu'à 150 mètres.
- Le long du canal, l'eau traverse **quatre usines-écluses** : Kembs, Ottmarsheim, Fessenheim et Vogelgrun.
- Chaque site possède une centrale électrique et **deux grandes écluses** pour laisser passer les bateaux sans interruption.

### À retenir
- **Longueur** : 52 km.
- **Production** : environ 4,5 milliards de kWh par an, sans presque aucune pollution de l'air.
- Des convois de **3 000 tonnes** peuvent relier Bâle à Rotterdam.

### Les mots à connaître
- **Convoi** : groupe de barges (bateaux plats) poussées ensemble par un seul bateau.
- **Rhin** : grand fleuve qui traverse la Suisse, la France, l'Allemagne et les Pays-Bas.

> **Le saviez-vous ?**
> Des **passes à poissons géantes** ont été installées sur le Rhin. Elles permettent au saumon atlantique de remonter le fleuve… jusqu'en Suisse !`,
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
    shortDescription: "Construites le long de la Loire, ces digues protègent les villes et les maisons contre les inondations.",
    contentMarkdown: `# Les levées de la Loire

### En bref
Sur plus de **600 kilomètres**, les levées de la Loire longent le « fleuve royal ». Ces digues, commencées au Moyen Âge, protègent des centaines de villes et villages contre les crues.

### Comment ça marche ?
La protection de la Loire a été construite petit à petit :
- Dès le XIIe siècle, on construit les premières digues de terre, appelées **turcies**.
- Aux XVIIe et XIXe siècles, on les remonte jusqu'à **plus de 6 mètres** au-dessus du val (la plaine où le fleuve peut déborder).
- Pour éviter que la digue casse en ville, on a prévu des **déversoirs** : des endroits plus bas, en maçonnerie, où l'eau déborde exprès vers des champs, pour sauver des villes comme Orléans, Blois ou Tours.

### À retenir
- **600 km** de levées le long du fleuve.
- Elles protègent près de **300 000 personnes** et le Val de Loire, classé au Patrimoine mondial de l'UNESCO (liste des lieux à protéger pour toute l'humanité).
- Grandes crues de référence : **1846, 1856 et 1866**.

### Les mots à connaître
- **Levée** : digue de terre qui longe un fleuve.
- **Déversoir** : endroit où l'eau peut déborder volontairement.

> **Le saviez-vous ?**
> Les levées de la Loire servent aussi de **chemin** : la célèbre véloroute « La Loire à Vélo » les emprunte souvent !`,
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
    shortDescription: "Il utilise l'eau des montagnes pour produire de l'électricité dans une centrale cachée sous terre.",
    contentMarkdown: `# Takamaka (La Réunion)

### En bref
Sur l'île de La Réunion, dans l'océan Indien, Takamaka est un site hydroélectrique spectaculaire, au fond d'un **canyon tropical**. Sa centrale est cachée **sous 300 mètres de roche volcanique**, pour résister aux cyclones.

### Comment ça marche ?
La vallée de la rivière des Marsouins est l'une des plus **pluvieuses du monde** :
- Deux petits barrages voûtes retiennent l'eau : **Takamaka I** (15 m) et **Takamaka II** (29 m).
- Pendant les cyclones, la rivière peut monter de **10 mètres en 2 heures** ! Pour protéger les turbines, l'usine a été **creusée sous terre**, dans la roche volcanique (le basalte).
- L'eau tombe de **270 mètres** de haut dans un puits vertical, avant d'arriver aux turbines.

### À retenir
- Il pleut jusqu'à **7 à 8 mètres d'eau par an** dans la région !
- **Puissance** : 43,4 MW, la première source d'électricité renouvelable de l'île.
- Mis en service en 1968 (Takamaka I) et 1989 (Takamaka II).

### Les mots à connaître
- **Cyclone** : tempête tropicale très violente, avec des vents et de la pluie énormes.
- **Basalte** : roche noire formée par un volcan.

> **Le saviez-vous ?**
> La vallée est si abrupte qu'aucun véhicule n'y descend ! Le matériel et les techniciens d'EDF y accèdent par un **téléphérique** qui survole des vides de plusieurs centaines de mètres.`,
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
    shortDescription: "Construit par les Romains il y a 2 000 ans, il portait le canal qui amenait l'eau d'Uzès à Nîmes sur 50 km.",
    contentMarkdown: `# Le Pont du Gard (Ier siècle)

### En bref
Le Pont du Gard a **2 000 ans** ! Construit par les Romains, c'est **le plus haut pont-aqueduc romain du monde**. Un *aqueduc*, c'est un pont qui transporte de l'eau. Il est classé par l'UNESCO, la liste des trésors à protéger pour tous les humains.

### Comment ça marche ?
Ce n'était pas un pont pour les voitures ou les chariots, mais un **morceau d'un long canal de 50 km** qui amenait l'eau jusqu'à la ville romaine de Nîmes :
- Il traverse la rivière Gardon pour amener l'eau de la source d'Eure, près d'Uzès, aux **fontaines, aux bains et aux maisons** de Nîmes.
- **Trois étages d'arches** : 6 au premier niveau, 11 au deuxième, 35 tout en haut, qui portent le canal.
- **Une pente ultra précise** : sur 50 km, l'eau ne descend que de **12,6 mètres** en tout. Il n'y a pas de pompe : l'eau coule toute seule, tout doucement, comme sur une très légère pente !

### À retenir
- **Hauteur** : 48,77 m. **Longueur** : 275 m.
- Construit vers l'an 40-50, avec des **blocs de pierre posés sans mortier** (sans colle).
- Classé à l'UNESCO en **1985**.

### Les mots à connaître
- **Aqueduc** : ouvrage qui transporte l'eau.
- **Mortier** : mélange qui colle les pierres entre elles.

> **Le saviez-vous ?**
> L'intérieur du canal était recouvert d'un enduit rouge fait de **chaux et de tuiles écrasées** pour l'étanchéité. Deux mille ans après, on le voit encore sur les parois !`,
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
    shortDescription: "Construit au XVIIe siècle, il relie la Garonne à la Méditerranée sur 240 km, grâce au lac de Saint-Ferréol.",
    contentMarkdown: `# Le canal du Midi (1667–1681)

### En bref
Le canal du Midi relie Toulouse à la mer Méditerranée sur **240 kilomètres**. Il a été imaginé par **Pierre-Paul Riquet** au temps de Louis XIV. Son secret : un **grand lac-réservoir**, Saint-Ferréol, retenu par l'un des plus anciens grands barrages encore en service en France.

### Comment ça marche ?
Depuis l'Antiquité, on rêvait de relier l'Atlantique à la Méditerranée sans contourner l'Espagne. Mais il y avait un gros problème : comment alimenter en eau le **point le plus haut du canal** (à 189 m d'altitude) en plein été ?
- Riquet a eu l'idée de récupérer l'eau des ruisseaux de la **Montagne Noire** et de la stocker dans un grand lac, **Saint-Ferréol**, fermé par une digue de 780 mètres.
- Quand le canal manque d'eau en été, on ouvre les vannes : l'eau descend par une **rigole** (un petit canal) jusqu'au point haut.
- Plus tard, Vauban, un célèbre ingénieur militaire, a inspecté et renforcé l'ouvrage.

### À retenir
- **240 km** et **63 écluses**, dont les célèbres écluses en escalier de Fonséranes, à Béziers.
- **Saint-Ferréol** : 780 m de long, 32 m de haut.
- Classé à l'UNESCO en **1996**.

### Les mots à connaître
- **Rigole** : petit canal qui amène l'eau.
- **Seuil** : point le plus haut où deux pentes se rejoignent.

> **Le saviez-vous ?**
> Pierre-Paul Riquet a dépensé toute sa fortune et sa santé pour son canal. Il est mort en 1680, **six mois avant son inauguration** : il ne l'a jamais vu terminé !`,
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
    shortDescription: "Construit au XIXe siècle, c'est l'un des tout premiers barrages en forme de voûte calculés scientifiquement.",
    contentMarkdown: `# Le barrage Zola (1847–1854)

### En bref
Au pied de la montagne Sainte-Victoire, près d'Aix-en-Provence, le barrage Zola est un **monument de l'histoire des barrages**. Il a été conçu par l'ingénieur **François Zola**, le père de l'écrivain Émile Zola. C'est l'un des **premiers barrages voûtes calculés avec les mathématiques**.

### Comment ça marche ?
Après une épidémie de choléra (une grave maladie causée par de l'eau sale) à Aix en 1835, la ville avait besoin d'eau propre. François Zola a proposé un barrage :
- Au lieu d'un mur de pierres très lourd, il a **calculé** la forme d'un arc en pierre, tourné vers le lac.
- La poussée de l'eau est envoyée sur les **deux rives rocheuses** de la gorge.
- François Zola est mort pendant le chantier, en 1847, mais ses plans ont été suivis à la lettre jusqu'à l'inauguration, en 1854.

### À retenir
- **Hauteur** : 36,5 m. **Longueur** : 66 m.
- Il a fourni l'eau potable d'Aix jusqu'en 1877, avant l'arrivée d'un autre barrage plus en amont, Bimont.

### Les mots à connaître
- **Choléra** : maladie grave qui se transmet par l'eau sale.
- **Résistance des matériaux** : science qui calcule ce que peut supporter une pierre ou un béton.

> **Le saviez-vous ?**
> Quand il était enfant, Émile Zola se promenait près du barrage de son père avec son ami **Paul Cézanne**, qui deviendra un grand peintre. Ils s'y baignaient, et Cézanne a même peint le barrage !`,
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
    shortDescription: "Près de Toulon, il stocke l'eau pour fournir l'eau potable de la ville.",
    contentMarkdown: `# Le barrage de Dardennes (1910–1912)

### En bref
Au pied du Mont Caume, au Revest-les-Eaux, le barrage de Dardennes est le **château d'eau centenaire de Toulon**. Construit juste avant la Première Guerre mondiale, il fournit encore de l'eau potable à la ville et à son port.

### Comment ça marche ?
C'est un **barrage poids** en maçonnerie et en béton, un peu courbé :
- Il barre la petite rivière **le Las**, et recueille l'eau de sources très abondantes (celles du Ragas et de la Foux), qui sortent d'une roche calcaire pleine de trous (on dit *karstique*).
- L'eau du lac du Revest est envoyée tout près, vers une usine où on la **filtre** et on la **désinfecte avec de l'ozone** avant de la distribuer.
- Entre 2020 et 2022, on a rénové les vidanges et l'étanchéité du barrage pour qu'il serve encore le siècle prochain.

### À retenir
- **Hauteur** : 31,6 m. **Longueur de crête** : 154 m.
- **Retenue** : 1,1 million de mètres cubes.
- Construit entre 1910 et 1912.

### Les mots à connaître
- **Karstique** : se dit d'une roche calcaire creusée de trous et de passages par l'eau.
- **Ozone** : gaz utilisé pour désinfecter l'eau.

> **Le saviez-vous ?**
> Dès 1924, l'eau de Dardennes a été désinfectée avec la méthode de **la « verdunisation »**, mise au point pendant la bataille de Verdun pour protéger les soldats contre la typhoïde, une maladie de l'eau sale.`,
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
    shortDescription: "Mis en service en 2013 en Corse, il produit de l'électricité pour tout le réseau de l'île.",
    contentMarkdown: `# Le barrage du Rizzanese (2007–2013)

### En bref
Inauguré en 2013 en Corse-du-Sud, le barrage du Rizzanese est **le plus haut barrage de Corse** et son plus puissant site hydroélectrique. C'est l'un des derniers grands barrages construits en France.

### Comment ça marche ?
C'est un **barrage poids** très moderne, en **béton compacté au rouleau (BCR)** : un béton presque sec, étalé en couches et écrasé par des rouleaux :
- Cette technique permet de construire **très vite**.
- L'eau, retenue à 530 m d'altitude, traverse la montagne dans un **tunnel de 5,7 km**, puis dévale une conduite jusqu'à la centrale de Sainte-Lucie-de-Tallano.
- La Corse est une île : son réseau électrique n'est pas relié directement à celui du continent. Les turbines du Rizzanese, qui démarrent très vite, aident donc à **équilibrer le réseau** matin et soir, quand tout le monde consomme beaucoup.

### À retenir
- **Hauteur** : 40,5 m. **Longueur** : 140 m.
- **Puissance** : 55 MW, soit environ 80 millions de kWh par an.
- Il produit près de **40 %** de l'électricité hydraulique de la Corse.

### Les mots à connaître
- **Réseau électrique** : l'ensemble des fils et des centrales qui livrent l'électricité partout.
- **Endémique** : qui n'existe qu'à un seul endroit du monde.

> **Le saviez-vous ?**
> Le chantier a protégé la **truite macrostigma**, un poisson qu'on ne trouve que dans les rivières de Corse, avec un débit d'eau minimal toujours garanti dans la rivière.`,
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
    shortDescription: "En construction, il reliera l'Oise au canal Dunkerque-Escaut pour faire circuler plus de bateaux.",
    contentMarkdown: `# Le canal Seine-Nord Europe (2022–2032)

### En bref
Le canal Seine-Nord Europe est **le plus grand chantier fluvial d'Europe** de ce siècle. Long de **107 kilomètres**, il reliera Compiègne au canal Dunkerque-Escaut, et connectera la France à 20 000 km de voies d'eau du nord de l'Europe.

### Comment ça marche ?
C'est un grand chantier plein d'idées modernes :
- **Un grand canal** : 54 m de large et 4,5 m de profondeur, pour des convois de **4 400 tonnes**.
- **6 grandes écluses avec « bassins d'épargne »** : ces bassins récupèrent l'eau à chaque passage de bateau, et en réutilisent **plus de 75 %**, pour ne pas vider les rivières voisines.
- **Un lac-réservoir** : à Louette, il contiendra 14 millions de mètres cubes d'eau pour alimenter le canal, même en cas de canicule.

### À retenir
- **Longueur** : 107 km.
- Chaque grand convoi remplacera **220 camions** sur l'autoroute A1.
- Travaux lancés en **2022**, mise en service prévue vers **2030-2032**.

### Les mots à connaître
- **Bassin d'épargne** : réservoir qui sert à économiser l'eau d'une écluse.
- **Grand gabarit** : se dit d'un canal assez grand pour de gros bateaux.

> **Le saviez-vous ?**
> Le canal passera au-dessus de la vallée de la Somme sur un **pont-canal de 1,3 km**, perché sur des piliers : les animaux et les rivières pourront continuer à passer dessous.`,
  },
];
