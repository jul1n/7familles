// Banque de questions du quiz : 2 questions par carte (84), rédigées d'après les fiches.
// Chaque entrée : [carte, question, bonne réponse, trois mauvaises réponses].
// Les listes FR et EN sont dans le même ordre : la question n° i est la même dans les deux langues.
// Les réponses sont mélangées à l'affichage.
type Row = [card: string, q: string, ok: string, w1: string, w2: string, w3: string];

const FR: Row[] = [
  ["metiers-proprietaire", "Comment s'appelle le contrat par lequel l'État confie un barrage à une entreprise ?", "Une concession", "Un abonnement", "Un héritage", "Un permis de construire"],
  ["metiers-proprietaire", "À partir de quelle hauteur commence la classe A, la plus contrôlée ?", "20 mètres", "5 mètres", "100 mètres", "50 mètres"],
  ["metiers-conceptrice", "Où la conceptrice fait-elle « pousser » l'eau et même les tremblements de terre pour tester son barrage ?", "Dans une maquette sur ordinateur", "Dans une piscine géante", "Dans la rivière", "Dans une soufflerie"],
  ["metiers-conceptrice", "Quel ingénieur français est l'un des grands pionniers des barrages-voûtes minces ?", "André Coyne", "Gustave Eiffel", "Pierre-Paul Riquet", "Ferdinand de Lesseps"],
  ["metiers-constructeur", "Comment s'appelle le petit mur provisoire qui garde la rivière à distance pendant les travaux ?", "Un batardeau", "Une écluse", "Un contrefort", "Un évacuateur"],
  ["metiers-constructeur", "Pourquoi fait-on circuler de l'eau froide dans de petits tuyaux à l'intérieur du béton ?", "Pour le refroidir, car il chauffe en séchant", "Pour le rendre plus lourd", "Pour le colorer", "Pour éviter qu'il gèle l'hiver"],
  ["metiers-expert-securite", "Comment s'appelle le travail qui consiste à surveiller le barrage avec des instruments ?", "L'auscultation", "La concession", "L'irrigation", "Le dragage"],
  ["metiers-expert-securite", "Que montre le pendule, ce long fil tendu dans le barrage ?", "De combien le mur se déplace", "La température de l'eau", "Le nombre de poissons", "La force du vent"],
  ["metiers-hydrologue", "En quelle unité mesure-t-on le débit d'une rivière ?", "En mètres cubes par seconde", "En kilomètres par heure", "En kilowattheures", "En degrés Celsius"],
  ["metiers-hydrologue", "Qu'est-ce qu'un bassin versant ?", "La zone où la pluie finit dans la même rivière", "Un grand lac artificiel", "Un type de barrage", "Le côté d'un barrage où la rivière continue sa route"],
  ["metiers-geologue", "Comment s'appellent les longs cylindres de roche remontés par les forages ?", "Des carottes", "Des piézomètres", "Des batardeaux", "Des vannes"],
  ["metiers-geologue", "En quelle année le barrage de Malpasset s'est-il rompu ?", "1959", "1859", "1989", "1929"],
  ["usages-eau-potable", "Quelle part de l'eau prélevée pour devenir potable vient des eaux de surface en France ?", "Environ un tiers", "Environ les trois quarts", "Presque rien", "Environ la moitié"],
  ["usages-eau-potable", "D'où vient l'eau du robinet à Marseille ?", "Des Alpes, par des canaux", "Des Pyrénées", "De la mer", "Du Massif central"],
  ["usages-hydroelectricite", "Quelle pièce tourne sous l'effet de l'eau et entraîne l'alternateur ?", "La turbine", "L'écluse", "Le batardeau", "Le coursier"],
  ["usages-hydroelectricite", "Que veut dire « hydro » dans le mot hydroélectricité ?", "Eau", "Vent", "Soleil", "Terre"],
  ["usages-irrigation", "Quelle part de l'eau douce prélevée dans le monde sert à l'agriculture ?", "Environ 70 %", "Environ 7 %", "Environ 25 %", "Environ 50 %"],
  ["usages-irrigation", "Quel système d'arrosage peut réduire les pertes d'eau ?", "Le goutte-à-goutte", "Le jet d'eau", "Le tourniquet", "L'arrosage par inondation"],
  ["usages-regulation-debit", "Comment s'appelle la période où la rivière est au plus bas ?", "L'étiage", "La crue", "L'aval", "La surverse"],
  ["usages-regulation-debit", "Que fait un barrage pour réduire une crue ?", "Il stocke l'eau en trop dans une partie vide du lac, puis la relâche doucement", "Il vide tout le lac d'un coup", "Il bloque complètement la rivière", "Il accélère l'écoulement de la rivière"],
  ["usages-transport", "Comment s'appelle l'« ascenseur à bateaux » qui fonctionne avec l'eau ?", "L'écluse", "Le bief", "La péniche", "Le batardeau"],
  ["usages-transport", "Un grand convoi de 4 400 tonnes transporte autant que combien de camions ?", "220", "22", "2 200", "100"],
  ["usages-tourisme", "Pourquoi l'eau de certains lacs glaciaires est-elle turquoise ?", "À cause de la « farine de roche » broyée par les glaciers", "Parce qu'on y verse de la peinture", "À cause de poissons bleus", "À cause de la pollution"],
  ["usages-tourisme", "Sur certains lacs, que s'engage à faire l'entreprise qui produit l'électricité de juin à septembre ?", "Garder assez d'eau pour les activités", "Fermer les plages", "Vider le lac", "Baisser le niveau du lac pour la pêche"],
  ["composants-corps", "Pourquoi le corps d'un barrage est-il souvent plus large en bas ?", "Parce que la poussée de l'eau y est la plus forte", "Pour qu'il soit plus facile à construire", "Pour laisser passer les bateaux", "Pour résister au gel"],
  ["composants-corps", "Que trouve-t-on à l'intérieur des grands barrages en béton ?", "Des galeries éclairées pour les inspecter", "Des piscines", "Des serres", "Des ascenseurs à bateaux"],
  ["composants-evacuateur", "À quoi sert l'évacuateur de crues ?", "À laisser partir l'eau en trop pour qu'elle ne passe pas par-dessus le barrage", "À produire de l'électricité", "À remplir le lac", "À laisser passer les bateaux"],
  ["composants-evacuateur", "Comment s'appelle le « toboggan » en béton de l'évacuateur ?", "Le coursier", "Le seuil", "La vanne", "Le dissipateur d'énergie"],
  ["composants-fondation", "Comment s'appelle l'eau qui passe sous le barrage et pousse vers le haut ?", "La sous-pression", "La surverse", "L'évaporation", "La turbidité"],
  ["composants-fondation", "À quoi servent les drains placés derrière le voile d'injection ?", "À récupérer l'eau qui passe quand même, pour faire baisser la pression", "À arroser les champs", "À refroidir le béton", "À faire monter le niveau du lac"],
  ["composants-prise-deau", "À quoi servent les grilles de la prise d'eau ?", "À arrêter les troncs et les débris avant les turbines", "À retenir les poissons pour les pêcheurs", "À décorer le barrage", "À mesurer la pression"],
  ["composants-prise-deau", "Quel ouvrage permet de baisser le niveau du lac, voire de le vider ?", "La vidange de fond", "La vanne de tête", "Le coursier", "La prise d'eau"],
  ["composants-capteurs", "Quels instruments mesurent la pression de l'eau dans le barrage et dans le sol ?", "Les piézomètres", "Les pendules", "Les bacs de mesure des fuites", "Les capteurs GPS"],
  ["composants-capteurs", "Que fait un barrage-voûte de 100 mètres quand le lac se remplit ?", "Il avance de quelques millimètres à quelques centimètres : il « respire »", "Il s'enfonce de dix mètres dans le sol", "Il ne bouge jamais", "Il recule de dix mètres"],
  ["composants-riviere", "Comment s'appelle la quantité d'eau minimale qui doit couler en aval toute l'année ?", "Le débit réservé", "Le débit maximal", "La crue", "Le débit moyen"],
  ["composants-riviere", "Quel dispositif aide les poissons migrateurs à franchir un barrage ?", "La passe à poissons", "Le batardeau", "Le voile d'injection", "L'évacuateur de crues"],
  ["types-barrage-remblai", "En quoi est fait un barrage en remblai ?", "De terre ou de pierres empilées", "D'acier", "De verre", "De bois"],
  ["types-barrage-remblai", "Qu'est-ce qui rend un barrage en remblai étanche ?", "Un cœur d'argile ou un masque côté lac", "Une couche de peinture", "Un grand rideau", "Une couche de sable sec"],
  ["types-barrage-poids", "Quel est le plus haut barrage poids du monde ?", "La Grande-Dixence", "Hoover Dam", "Itaipu", "Le barrage de Kariba"],
  ["types-barrage-poids", "Que veut dire BCR ?", "Béton compacté au rouleau", "Barrage à courbure renforcée", "Bassin de crue et de refroidissement", "Du béton coulé en rivière"],
  ["types-barrage-voute", "Comment un barrage voûte résiste-t-il à la poussée de l'eau ?", "En la transmettant aux falaises de chaque côté", "Par son seul poids", "Grâce à un cœur d'argile", "En l'évacuant par un tunnel"],
  ["types-barrage-voute", "Comment s'appellent les appuis de roche ou de béton qui reçoivent la poussée d'une voûte ?", "Les culées", "Les biefs", "Les turcies", "Les vannes"],
  ["types-canaux", "Comment s'appelle un tronçon de canal entre deux écluses ?", "Un bief", "Une rigole", "Une levée", "Un déversoir"],
  ["types-canaux", "Quel est le pont-canal le plus célèbre de France, au-dessus de la Loire ?", "Celui de Briare", "Celui de Nîmes", "Celui de Toulouse", "Celui d'Orléans"],
  ["types-digue-protection", "Comment appelle-t-on l'eau qui passe par-dessus une digue ?", "La surverse", "Le renard hydraulique", "Le glissement", "L'étiage"],
  ["types-digue-protection", "Quels animaux peuvent fragiliser une digue avec leurs terriers ?", "Les ragondins, les blaireaux et les renards", "Les truites", "Les saumons", "Les hérissons"],
  ["types-step", "À quoi ressemble une STEP, en version simple ?", "À une batterie géante", "À une fontaine géante", "À une piscine géante", "Une éolienne géante"],
  ["types-step", "Quand une STEP remonte-t-elle l'eau vers le lac du haut ?", "Quand il y a un surplus d'électricité", "Quand il manque d'électricité", "Quand il pleut", "Quand le lac du bas est vide"],
  ["monde-itaipu", "Quels pays ont construit Itaipu ensemble ?", "Le Brésil et le Paraguay", "La Chine et l'Inde", "La Suisse et la France", "Le Zimbabwe et la Zambie"],
  ["monde-itaipu", "Combien Itaipu a-t-il d'énormes turbines ?", "20", "2", "200", "32"],
  ["monde-canal-suez", "Combien d'écluses compte le canal de Suez ?", "Aucune", "Une", "Douze", "Trois"],
  ["monde-canal-suez", "Quel porte-conteneurs est resté coincé six jours dans le canal en 2021 ?", "L'Ever Given", "Le Titanic", "Le Queen Mary", "Le Costa Concordia"],
  ["monde-grande-dixence", "Quelle est la hauteur de la Grande-Dixence ?", "285 mètres", "85 mètres", "1 285 mètres", "185 mètres"],
  ["monde-grande-dixence", "Quel ancien barrage dort au fond du lac de la Grande-Dixence ?", "Celui de la Dixence", "Celui de Malpasset", "Celui de Zola", "Celui de Mont-Cenis"],
  ["monde-kariba", "Sur quel fleuve est construit le barrage Kariba ?", "Le Zambèze", "Le Nil", "Le Colorado", "Le Congo"],
  ["monde-kariba", "Quels pays se partagent le barrage Kariba ?", "La Zambie et le Zimbabwe", "Le Brésil et le Paraguay", "La Chine et le Japon", "L'Égypte et le Soudan"],
  ["monde-trois-gorges", "Sur quel fleuve se trouve le barrage des Trois-Gorges ?", "Le Yangtsé", "Le Danube", "Le Rhin", "Le fleuve Jaune"],
  ["monde-trois-gorges", "Quelle hauteur fait l'ascenseur à bateaux des Trois-Gorges ?", "113 mètres", "13 mètres", "313 mètres", "63 mètres"],
  ["monde-hoover-dam", "Quel lac le Hoover Dam a-t-il créé ?", "Le lac Mead", "Le lac Léman", "Le lac Kariba", "Le lac Powell"],
  ["monde-hoover-dam", "Quel est le style de décoration du Hoover Dam ?", "L'Art déco", "Le gothique", "Le baroque", "Le style romain classique"],
  ["france-serre-poncon", "Comment surnommait-on la Durance avant le barrage de Serre-Ponçon ?", "Le « troisième fléau de la Provence »", "Le « fleuve royal »", "Le « géant du Sud »", "Le « torrent des Alpes »"],
  ["france-serre-poncon", "Quelle chapelle voit-on sur un îlot au milieu du lac de Serre-Ponçon ?", "La chapelle Saint-Michel", "La chapelle Saint-Pierre", "La chapelle Sainte-Victoire", "La chapelle Notre-Dame"],
  ["france-migouelou", "Combien de voûtes compte le barrage de Migouélou ?", "9", "1", "20", "5"],
  ["france-migouelou", "Comment le ciment du barrage de Migouélou a-t-il été monté sur le chantier ?", "Par téléphérique", "Par une grande route", "Par hélicoptère", "Par bateau"],
  ["france-rance", "Quelle force utilise l'usine de la Rance pour produire de l'électricité ?", "Celle des marées", "Celle du vent", "Celle du soleil", "Celle des vagues"],
  ["france-rance", "Qui a inauguré l'usine de la Rance en 1966 ?", "Le général de Gaulle", "Napoléon", "Louis XIV", "François Mitterrand"],
  ["france-canal-alsace", "Quel fleuve longe le Grand Canal d'Alsace ?", "Le Rhin", "La Seine", "La Loire", "Le Rhône"],
  ["france-canal-alsace", "Combien d'usines-écluses compte le Grand Canal d'Alsace ?", "Quatre", "Deux", "Dix", "Six"],
  ["france-levees-loire", "Comment appelle-t-on les premières digues de terre de la Loire, construites dès le XIIe siècle ?", "Des turcies", "Des culées", "Des biefs", "Des déversoirs"],
  ["france-levees-loire", "À quoi servent les déversoirs des levées de la Loire ?", "À faire déborder l'eau exprès vers des champs pour sauver les villes", "À faire passer les bateaux", "À produire de l'électricité", "À retenir l'eau de pluie"],
  ["france-takamaka", "Sur quelle île se trouve Takamaka ?", "La Réunion", "La Corse", "Madagascar", "Tahiti"],
  ["france-takamaka", "Pourquoi la centrale de Takamaka est-elle creusée sous 300 mètres de roche ?", "Pour résister aux cyclones", "Pour la cacher aux touristes", "Pour la garder au chaud", "Pour l'éloigner de la rivière"],
  ["temps-pont-du-gard", "Quel âge a environ le Pont du Gard ?", "2 000 ans", "200 ans", "500 ans", "1 000 ans"],
  ["temps-pont-du-gard", "Vers quelle ville le Pont du Gard amenait-il l'eau ?", "Nîmes", "Rome", "Toulouse", "Marseille"],
  ["temps-canal-du-midi", "Qui a imaginé le canal du Midi ?", "Pierre-Paul Riquet", "Vauban", "François Zola", "Ferdinand de Lesseps"],
  ["temps-canal-du-midi", "Quel lac-réservoir alimente le point le plus haut du canal du Midi ?", "Saint-Ferréol", "Serre-Ponçon", "Sainte-Croix", "Le lac de Naussac"],
  ["temps-barrage-zola", "Qui a conçu le barrage Zola ?", "François Zola, le père de l'écrivain Émile Zola", "Émile Zola lui-même", "André Coyne", "Gustave Eiffel"],
  ["temps-barrage-zola", "Quel futur peintre se baignait près du barrage avec Émile Zola enfant ?", "Paul Cézanne", "Claude Monet", "Vincent van Gogh", "Auguste Renoir"],
  ["temps-barrage-dardennes", "Quelle grande ville est alimentée en eau potable par le barrage de Dardennes ?", "Toulon", "Marseille", "Lyon", "Nice"],
  ["temps-barrage-dardennes", "Avec quel gaz l'eau de Dardennes est-elle désinfectée ?", "L'ozone", "L'oxygène", "L'hélium", "Le gaz carbonique"],
  ["temps-barrage-rizzanese", "En quelle année le barrage du Rizzanese a-t-il été inauguré ?", "2013", "1913", "1983", "1993"],
  ["temps-barrage-rizzanese", "Quelle technique de construction a été utilisée pour le barrage du Rizzanese ?", "Le béton compacté au rouleau", "Le béton coloré", "Le béton flottant", "Le béton projeté"],
  ["temps-canal-seine-nord", "Quelle longueur fera le canal Seine-Nord Europe ?", "107 km", "7 km", "1 007 km", "207 km"],
  ["temps-canal-seine-nord", "À quoi servent les bassins d'épargne des écluses ?", "À récupérer une grande partie de l'eau de chaque passage de bateau", "À faire nager les poissons", "À garer les péniches", "À produire de l'électricité"],
];

const EN: Row[] = [
  ["metiers-proprietaire", "What is the contract called by which the State entrusts a dam to a company?", "A concession", "A subscription", "An inheritance", "A building permit"],
  ["metiers-proprietaire", "From what height does class A, the most closely inspected, begin?", "20 metres", "5 metres", "100 metres", "50 metres"],
  ["metiers-conceptrice", "Where does the designer make water, and even earthquakes, “push” on a dam to test it?", "In a computer model", "In a giant swimming pool", "In the river", "In a wind tunnel"],
  ["metiers-conceptrice", "Which French engineer was one of the great pioneers of thin arch dams?", "André Coyne", "Gustave Eiffel", "Pierre-Paul Riquet", "Ferdinand de Lesseps"],
  ["metiers-constructeur", "What is the small temporary wall that keeps the river away during construction?", "A cofferdam", "A lock", "A buttress", "A spillway"],
  ["metiers-constructeur", "Why does cold water flow through small pipes inside the concrete?", "To cool it, because it heats up as it sets", "To make it heavier", "To colour it", "To stop it freezing in winter"],
  ["metiers-expert-securite", "What is the job of watching over a dam with instruments called?", "Monitoring (auscultation)", "Concession", "Irrigation", "Dredging"],
  ["metiers-expert-securite", "What does the pendulum, that long wire hanging inside the dam, show?", "How far the wall moves", "The water temperature", "The number of fish", "The strength of the wind"],
  ["metiers-hydrologue", "In what unit is the flow of a river measured?", "Cubic metres per second", "Kilometres per hour", "Kilowatt-hours", "Degrees Celsius"],
  ["metiers-hydrologue", "What is a catchment area (drainage basin)?", "The area where rain ends up in the same river", "A big artificial lake", "A type of dam", "The side of a dam where the river carries on"],
  ["metiers-geologue", "What are the long cylinders of rock brought up by drilling called?", "Cores", "Piezometers", "Cofferdams", "Gates"],
  ["metiers-geologue", "In what year did the Malpasset dam fail?", "1959", "1859", "1989", "1929"],
  ["usages-eau-potable", "What share of the water taken to become drinkable comes from surface water in France?", "About one third", "About three quarters", "Almost none", "About half"],
  ["usages-eau-potable", "Where does tap water in Marseille come from?", "From the Alps, through canals", "From the Pyrenees", "From the sea", "From the Massif Central"],
  ["usages-hydroelectricite", "Which part spins under the force of water and drives the alternator?", "The turbine", "The lock", "The cofferdam", "The chute"],
  ["usages-hydroelectricite", "What does “hydro” mean in the word hydroelectricity?", "Water", "Wind", "Sun", "Earth"],
  ["usages-irrigation", "What share of the freshwater taken worldwide is used for agriculture?", "About 70%", "About 7%", "About 25%", "About 50%"],
  ["usages-irrigation", "Which watering system can reduce water losses?", "Drip irrigation", "A water jet", "A sprinkler wheel", "Flood irrigation"],
  ["usages-regulation-debit", "What is the period when the river is at its lowest called?", "Low-water period", "Flood", "Downstream", "Overtopping"],
  ["usages-regulation-debit", "What does a dam do to reduce a flood?", "It stores the extra water in an empty part of the lake, then releases it slowly", "It empties the whole lake at once", "It blocks the river completely", "It speeds up the flow of the river"],
  ["usages-transport", "What is the “boat elevator” that works with water called?", "A lock", "A reach", "A barge", "A cofferdam"],
  ["usages-transport", "A big 4,400-tonne convoy carries as much as how many trucks?", "220", "22", "2,200", "100"],
  ["usages-tourisme", "Why is the water of some glacial lakes turquoise?", "Because of “rock flour” ground by glaciers", "Because paint is poured in", "Because of blue fish", "Because of pollution"],
  ["usages-tourisme", "On some lakes, what does the company that produces electricity promise to do from June to September?", "Keep enough water for the activities", "Close the beaches", "Empty the lake", "Lower the lake level for fishing"],
  ["composants-corps", "Why is the body of a dam often wider at the bottom?", "Because the push of the water is strongest there", "To make it easier to build", "To let boats through", "To resist frost"],
  ["composants-corps", "What can be found inside large concrete dams?", "Lit galleries used to inspect them", "Swimming pools", "Greenhouses", "Boat lifts"],
  ["composants-evacuateur", "What is the spillway for?", "To let the extra water go so it does not flow over the dam", "To produce electricity", "To fill the lake", "To let boats through"],
  ["composants-evacuateur", "What is the concrete “slide” of the spillway called?", "The chute", "The sill", "The gate", "The energy dissipator"],
  ["composants-fondation", "What is the water that flows under the dam and pushes upward called?", "Uplift pressure", "Overtopping", "Evaporation", "Turbidity"],
  ["composants-fondation", "What are the drains behind the grout curtain for?", "To collect the water that gets through anyway, to lower the pressure", "To water the fields", "To cool the concrete", "To raise the lake level"],
  ["composants-prise-deau", "What are the screens of the water intake for?", "To stop tree trunks and debris before the turbines", "To keep fish for anglers", "To decorate the dam", "To measure the pressure"],
  ["composants-prise-deau", "Which structure lets the lake level be lowered, or even emptied?", "The bottom outlet", "The head gate", "The chute", "The water intake"],
  ["composants-capteurs", "Which instruments measure water pressure in the dam and in the ground?", "Piezometers", "Pendulums", "Leak-measuring boxes", "GPS sensors"],
  ["composants-capteurs", "What does a 100-metre arch dam do when the lake fills?", "It moves forward by a few millimetres to a few centimetres: it “breathes”", "It sinks ten metres into the ground", "It never moves", "It moves back ten metres"],
  ["composants-riviere", "What is the minimum amount of water that must flow downstream all year round called?", "The minimum flow", "The maximum flow", "The flood", "The average flow"],
  ["composants-riviere", "Which device helps migratory fish get past a dam?", "A fish pass", "A cofferdam", "A grout curtain", "The spillway"],
  ["types-barrage-remblai", "What is an embankment dam made of?", "Piled-up earth or rock", "Steel", "Glass", "Wood"],
  ["types-barrage-remblai", "What makes an embankment dam watertight?", "A clay core or a facing on the lake side", "A coat of paint", "A big curtain", "A layer of dry sand"],
  ["types-barrage-poids", "Which is the tallest gravity dam in the world?", "Grande-Dixence", "Hoover Dam", "Itaipu", "The Kariba dam"],
  ["types-barrage-poids", "What does RCC stand for?", "Roller-compacted concrete", "Reinforced curved concrete", "Reservoir and cooling channel", "Concrete poured in the river"],
  ["types-barrage-voute", "How does an arch dam resist the push of the water?", "By passing it on to the cliffs on each side", "By its weight alone", "Thanks to a clay core", "By draining it through a tunnel"],
  ["types-barrage-voute", "What are the rock or concrete supports that receive the push of an arch called?", "Abutments", "Reaches", "Turcies", "Gates"],
  ["types-canaux", "What is a section of canal between two locks called?", "A reach", "A feeder channel", "A levee", "A spillway"],
  ["types-canaux", "Which is the most famous canal bridge in France, over the Loire?", "The one at Briare", "The one at Nîmes", "The one at Toulouse", "The one at Orléans"],
  ["types-digue-protection", "What is it called when water flows over the top of a levee?", "Overtopping", "Piping", "Sliding", "Low-water period"],
  ["types-digue-protection", "Which animals can weaken a levee with their burrows?", "Coypus, badgers and foxes", "Trout", "Salmon", "Hedgehogs"],
  ["types-step", "What is a pumped-storage station like, in simple terms?", "A giant battery", "A giant fountain", "A giant swimming pool", "A giant wind turbine"],
  ["types-step", "When does a pumped-storage plant pump water up to the upper lake?", "When there is a surplus of electricity", "When there is a shortage of electricity", "When it rains", "When the lower lake is empty"],
  ["monde-itaipu", "Which countries built Itaipu together?", "Brazil and Paraguay", "China and India", "Switzerland and France", "Zimbabwe and Zambia"],
  ["monde-itaipu", "How many huge turbines does Itaipu have?", "20", "2", "200", "32"],
  ["monde-canal-suez", "How many locks does the Suez Canal have?", "None", "One", "Twelve", "Three"],
  ["monde-canal-suez", "Which container ship was stuck in the canal for six days in 2021?", "The Ever Given", "The Titanic", "The Queen Mary", "The Costa Concordia"],
  ["monde-grande-dixence", "How tall is Grande-Dixence?", "285 metres", "85 metres", "1,285 metres", "185 metres"],
  ["monde-grande-dixence", "Which old dam sleeps at the bottom of the Grande-Dixence lake?", "The Dixence dam", "The Malpasset dam", "The Zola dam", "The Mont-Cenis dam"],
  ["monde-kariba", "On which river is the Kariba dam built?", "The Zambezi", "The Nile", "The Colorado", "The Congo"],
  ["monde-kariba", "Which countries share the Kariba dam?", "Zambia and Zimbabwe", "Brazil and Paraguay", "China and Japan", "Egypt and Sudan"],
  ["monde-trois-gorges", "On which river is the Three Gorges dam?", "The Yangtze", "The Danube", "The Rhine", "The Yellow River"],
  ["monde-trois-gorges", "How tall is the ship lift of the Three Gorges?", "113 metres", "13 metres", "313 metres", "63 metres"],
  ["monde-hoover-dam", "Which lake did the Hoover Dam create?", "Lake Mead", "Lake Geneva", "Lake Kariba", "Lake Powell"],
  ["monde-hoover-dam", "What is the decorative style of the Hoover Dam?", "Art Deco", "Gothic", "Baroque", "Roman classicism"],
  ["france-serre-poncon", "What was the Durance nicknamed before the Serre-Ponçon dam?", "The “third scourge of Provence”", "The “royal river”", "The “giant of the South”", "The “torrent of the Alps”"],
  ["france-serre-poncon", "Which chapel can be seen on a small island in the middle of the Serre-Ponçon lake?", "The Saint-Michel chapel", "The Saint-Pierre chapel", "The Sainte-Victoire chapel", "The Notre-Dame chapel"],
  ["france-migouelou", "How many arches does the Migouélou dam have?", "9", "1", "20", "5"],
  ["france-migouelou", "How was the cement for the Migouélou dam brought to the site?", "By cable car", "By a big road", "By helicopter", "By boat"],
  ["france-rance", "What force does the Rance plant use to produce electricity?", "The tides", "The wind", "The sun", "The waves"],
  ["france-rance", "Who inaugurated the Rance plant in 1966?", "General de Gaulle", "Napoleon", "Louis XIV", "François Mitterrand"],
  ["france-canal-alsace", "Which river does the Grand Canal d'Alsace run alongside?", "The Rhine", "The Seine", "The Loire", "The Rhône"],
  ["france-canal-alsace", "How many lock-and-power stations does the Grand Canal d'Alsace have?", "Four", "Two", "Ten", "Six"],
  ["france-levees-loire", "What are the first earth levees of the Loire, built as early as the 12th century, called?", "Turcies", "Abutments", "Reaches", "Spillways"],
  ["france-levees-loire", "What are the spillways (déversoirs) of the Loire levees for?", "To let water overflow on purpose onto fields to save the towns", "To let boats through", "To produce electricity", "To hold back rainwater"],
  ["france-takamaka", "On which island is Takamaka?", "La Réunion", "Corsica", "Madagascar", "Tahiti"],
  ["france-takamaka", "Why is the Takamaka power station dug under 300 metres of rock?", "To withstand cyclones", "To hide it from tourists", "To keep it warm", "To keep it away from the river"],
  ["temps-pont-du-gard", "About how old is the Pont du Gard?", "2,000 years", "200 years", "500 years", "1,000 years"],
  ["temps-pont-du-gard", "To which city did the Pont du Gard carry water?", "Nîmes", "Rome", "Toulouse", "Marseille"],
  ["temps-canal-du-midi", "Who came up with the Canal du Midi?", "Pierre-Paul Riquet", "Vauban", "François Zola", "Ferdinand de Lesseps"],
  ["temps-canal-du-midi", "Which reservoir lake feeds the highest point of the Canal du Midi?", "Saint-Ferréol", "Serre-Ponçon", "Sainte-Croix", "Lake Naussac"],
  ["temps-barrage-zola", "Who designed the Zola dam?", "François Zola, father of the writer Émile Zola", "Émile Zola himself", "André Coyne", "Gustave Eiffel"],
  ["temps-barrage-zola", "Which future painter swam near the dam with the young Émile Zola?", "Paul Cézanne", "Claude Monet", "Vincent van Gogh", "Auguste Renoir"],
  ["temps-barrage-dardennes", "Which big city gets drinking water from the Dardennes dam?", "Toulon", "Marseille", "Lyon", "Nice"],
  ["temps-barrage-dardennes", "Which gas is used to disinfect the water from Dardennes?", "Ozone", "Oxygen", "Helium", "Carbon dioxide"],
  ["temps-barrage-rizzanese", "In what year was the Rizzanese dam inaugurated?", "2013", "1913", "1983", "1993"],
  ["temps-barrage-rizzanese", "Which construction technique was used for the Rizzanese dam?", "Roller-compacted concrete", "Coloured concrete", "Floating concrete", "Sprayed concrete"],
  ["temps-canal-seine-nord", "How long will the Seine-Nord Europe canal be?", "107 km", "7 km", "1,007 km", "207 km"],
  ["temps-canal-seine-nord", "What are the water-saving basins of the locks for?", "To recover a large part of the water of each boat passage", "To let fish swim", "To park barges", "To produce electricity"],
];

export interface QuizQuestion {
  id: string;
  card: string; // carte à revoir après la réponse
  q: string;
  answers: string[]; // la bonne réponse est toujours en premier ici ; elle est mélangée à l'affichage
}

export function getQuizBank(lang: "fr" | "en"): QuizQuestion[] {
  const rows = lang === "fr" ? FR : EN;
  return rows.map(([card, q, ok, w1, w2, w3], i) => ({ id: `${card}-${i % 2}`, card, q, answers: [ok, w1, w2, w3] }));
}

// Mélange de Fisher-Yates (un tri aléatoire avec sort() est biaisé)
function shuffle<T>(items: T[], random: () => number): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Tirage de n questions sur des cartes toutes différentes
export function drawQuestions(bank: QuizQuestion[], n: number, random: () => number = Math.random): QuizQuestion[] {
  const seen = new Set<string>();
  const picked: QuizQuestion[] = [];
  for (const q of shuffle(bank, random)) {
    if (seen.has(q.card)) continue;
    seen.add(q.card);
    picked.push(q);
    if (picked.length === n) break;
  }
  return picked;
}

// Mélange les réponses d'une question et renvoie l'index de la bonne
export function shuffleAnswers(q: QuizQuestion, random: () => number = Math.random): { answers: string[]; correct: number } {
  const order = shuffle(q.answers.map((_, i) => i), random);
  return { answers: order.map((i) => q.answers[i]), correct: order.indexOf(0) };
}

// 10 quiz de 5 questions pour le PDF imprimable : chaque question est utilisée au plus une fois quand la banque le permet
export function drawPrintQuizzes(bank: QuizQuestion[], count = 10, size = 5, random: () => number = Math.random): QuizQuestion[][] {
  let pool = shuffle(bank, random);
  const quizzes: QuizQuestion[][] = [];
  for (let k = 0; k < count; k++) {
    const quiz: QuizQuestion[] = [];
    const cards = new Set<string>();
    for (const q of pool) {
      if (cards.has(q.card)) continue;
      cards.add(q.card);
      quiz.push(q);
      if (quiz.length === size) break;
    }
    pool = pool.filter((q) => !quiz.includes(q));
    quizzes.push(quiz);
  }
  return quizzes;
}
