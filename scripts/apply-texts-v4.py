"""Applique la relecture « Cartes 2 » aux textes des cartes dans data/cards.ts.

- remplace le bloc « Pour aller plus loin » de chaque carte par une mini-information nouvelle (niveau 10-14 ans) ;
- corrige quelques phrases du corps du texte (notes de travail, doublons) ;
- les sources ne sont plus dans le texte : elles vivent dans lib/card-links.ts (liens « En savoir plus »).

Usage : python scripts/apply-texts-v4.py   (s'arrête si un texte à remplacer est introuvable)
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# id -> nouveau texte de « Pour aller plus loin » (None = on garde le bloc actuel)
MORE = {
    "metiers-proprietaire": """En France, les barrages sont classés A, B ou C surtout selon leur hauteur et la quantité d'eau qu'ils retiennent. Les barrages des classes les plus importantes font l'objet de contrôles et d'études plus poussés. Certains très grands aménagements disposent aussi d'un plan particulier d'intervention (PPI), qui organise l'alerte et la protection des habitants en cas d'accident.""",
    "metiers-conceptrice": """Pour les crues, les ingénieurs n'étudient pas seulement celles déjà observées. Ils calculent aussi des crues très rares pour vérifier que le barrage et son évacuateur peuvent y faire face. Une crue dite « millénale » correspond à environ une chance sur 1 000 de se produire chaque année : elle ne revient pas forcément tous les 1 000 ans.""",
    "metiers-constructeur": """Les machines dépendent du lieu et du barrage construit. En haute montagne, un téléphérique peut transporter les ouvriers et les matériaux lorsqu'aucune route n'arrive jusqu'au chantier. Pour un grand barrage en béton, on installe souvent une centrale à béton tout près afin d'en produire de très grandes quantités.""",
    "metiers-expert-securite": None,
    "metiers-hydrologue": """Les hydrologues ne font pas une seule prédiction du futur : ils comparent plusieurs modèles. Selon les régions, le changement climatique peut modifier différemment les pluies, la neige, les sécheresses et les crues. En France, le projet Explore2 étudie ces évolutions bassin par bassin et montre aussi ce que les scientifiques connaissent encore mal.""",
    "metiers-geologue": """Le choix du barrage dépend de plusieurs choses : la forme de la vallée, la solidité et l'étanchéité de la roche, les matériaux disponibles, les crues à évacuer et l'usage du barrage. Une vallée étroite avec une roche très solide peut bien convenir à une voûte ; une vallée plus large peut mieux convenir à un barrage en remblai.""",
    "usages-eau-potable": """L'eau d'un lac de barrage n'est jamais envoyée directement au robinet. Avant d'être distribuée, elle est traitée, puis contrôlée régulièrement : on vérifie qu'elle ne contient ni microbes ni produits dangereux. C'est la raison pour laquelle on protège aussi le lac lui-même : plus l'eau est propre au départ, plus elle est simple à rendre potable.""",
    "usages-hydroelectricite": """Une centrale hydroélectrique ne brûle aucun combustible : elle utilise seulement l'eau qui tombe, donc elle rejette très peu de gaz qui réchauffent la planète quand elle fonctionne. Mais la construction d'un barrage demande beaucoup de béton, d'acier et de travaux, ce qui laisse une empreinte sur l'environnement. C'est pourquoi on compare les sources d'électricité sur toute leur vie, de la construction jusqu'à la fin de l'ouvrage.""",
    "usages-irrigation": """Toute l'eau prélevée pour arroser n'est pas « consommée ». Une partie est bue par les plantes ou s'évapore dans l'air, alors qu'une autre retourne à la rivière ou s'infiltre dans le sol pour rejoindre les nappes. Les spécialistes distinguent donc l'eau **prélevée** (celle qu'on va chercher) de l'eau réellement **consommée** (celle qui ne revient pas).""",
    "usages-regulation-debit": """Pour atténuer une crue, un barrage doit avoir de la place libre dans son réservoir avant l'arrivée de l'eau : un lac déjà plein ne peut plus rien stocker. C'est pourquoi certains barrages gardent une partie de leur volume vide, ou baissent un peu leur niveau quand de grosses pluies sont annoncées. Même ainsi, un barrage réduit le risque d'inondation sans jamais le supprimer.""",
    "usages-transport": None,
    "usages-tourisme": """Le niveau d'un lac de barrage n'est pas fixe : il peut monter ou descendre de plusieurs mètres selon les saisons et les usages (stocker la fonte des neiges, produire de l'électricité, soutenir la rivière en été). Selon la période, une plage ou un ponton peut donc se retrouver loin de l'eau. Pour se baigner ou naviguer en sécurité, on suit toujours les consignes affichées sur place.""",
    "composants-corps": None,
    "composants-evacuateur": """Il existe deux grandes familles d'évacuateurs. Le **seuil libre** fonctionne sans moteur ni commande : dès que le lac dépasse un niveau précis, l'eau passe par-dessus, ce qui évite les pannes. L'évacuateur **vanné** possède de grandes portes qu'on peut ouvrir à la demande pour contrôler le niveau du lac, mais il demande de l'énergie et de l'entretien. De nombreux barrages combinent les deux.""",
    "composants-fondation": """L'eau qui passe sous un barrage ne fait pas que fuir : elle appuie vers le haut et « allège » le barrage, un peu comme un bateau qui flotte. Un barrage plus léger frotte moins sur son sol et résiste moins bien au glissement. C'est pour cela que les ingénieurs installent des drains et mesurent en permanence la pression de l'eau dans la fondation.""",
    "composants-prise-deau": None,
    "composants-capteurs": """Ce qui intéresse l'ingénieur, c'est surtout l'évolution d'une mesure dans le temps. Une valeur isolée dit peu de choses : un déplacement de quelques millimètres peut être tout à fait normal en été et inquiétant s'il apparaît en plein hiver. On compare donc chaque mesure à celles des années précédentes, pour repérer une dérive lente avant qu'elle devienne un problème.""",
    "composants-riviere": """Un barrage retient une partie du sable et des graviers que la rivière transporte : ils se déposent au fond du lac. En aval, la rivière peut alors en manquer, son lit se creuse peu à peu et les poissons trouvent moins d'endroits pour pondre. C'est pourquoi on organise parfois des opérations pour laisser repartir ces sédiments vers l'aval.""",
    "types-barrage-remblai": """Dans un barrage en terre, un peu d'eau finit toujours par traverser : l'important est qu'elle n'emporte pas la terre avec elle. Les **filtres**, des couches de sable et de graviers triés, laissent passer l'eau mais retiennent les grains de terre ; les **drains** récupèrent cette eau et la renvoient vers l'aval. Sans bons filtres, un minuscule passage pourrait s'agrandir de l'intérieur.""",
    "types-barrage-poids": """Dans un barrage-poids, la fondation et le drainage sont presque aussi importants que le poids du béton. Si l'eau s'infiltre sous le barrage, elle le soulève un peu et diminue le frottement qui le retient sur le sol. On perce donc des drains sous l'ouvrage, et on surveille la pression de l'eau pour s'assurer qu'elle reste faible.""",
    "types-barrage-voute": """Une voûte utilise peu de béton, mais elle a besoin en échange d'une vallée assez étroite et d'appuis rocheux très solides, car toute la poussée de l'eau finit dans les falaises. C'est pourquoi on la construit surtout dans des gorges. Dans une vallée large, un barrage en remblai ou un barrage-poids est souvent mieux adapté.""",
    "types-canaux": """Chaque passage d'écluse utilise de l'eau : comme une grande boîte qu'on remplit, tout le volume d'eau nécessaire pour monter un bateau repart ensuite vers l'aval. Il faut donc alimenter le canal en permanence, surtout à son point le plus haut. Certaines écluses ont des **bassins d'épargne**, des réservoirs voisins qui récupèrent une partie de cette eau pour la rendre au passage suivant.""",
    "types-digue-protection": """Une digue réduit un risque, mais elle ne le supprime pas : elle est conçue pour protéger jusqu'à un certain niveau de crue. Si une crue plus forte arrive, l'eau peut passer par-dessus ou la digue peut céder. C'est pourquoi on évite de construire juste derrière une digue, et pourquoi les habitants des zones protégées doivent rester informés des risques.""",
    "types-step": """Une STEP ne crée pas d'énergie : elle en consomme pour pomper l'eau vers le haut, puis en récupère environ 70 à 80 % quand l'eau redescend. Ce qu'elle apporte, c'est la possibilité de **stocker** de très grandes quantités d'électricité, pendant des heures, pour les rendre au moment où le réseau en a besoin.""",
    "monde-itaipu": """Itaipu est géré par une entreprise commune, Itaipu Binacional, détenue à parts égales par le Brésil et le Paraguay. L'électricité produite est partagée en deux moitiés égales. Comme le Paraguay en consomme moins que sa moitié, il vend le reste au Brésil : c'est ainsi que le barrage fournit beaucoup d'électricité aux deux pays.""",
    "monde-canal-suez": """Pas d'écluses, mais deux défis permanents. Le premier est le sable : le vent du désert en dépose sans cesse, et il faut draguer le canal en continu pour garder la profondeur. Le second est la circulation : sur une grande partie du canal, il n'y a qu'une seule voie, alors les navires circulent en convois et se croisent dans des zones élargies, comme le Grand Lac Amer.""",
    "monde-grande-dixence": """Le lac de la Grande-Dixence n'est pas rempli seulement par la vallée située juste derrière le barrage. Un réseau de galeries et de prises d'eau capte aussi l'eau de torrents de plusieurs vallées voisines, parfois en la pompant, et l'amène jusqu'au lac. Un barrage n'est donc pas toujours alimenté par « sa » seule rivière.""",
    "monde-kariba": """Kariba est exploité en commun par deux pays voisins séparés par le fleuve : la Zambie et le Zimbabwe. Une autorité commune, la Zambezi River Authority, gère le lac et le barrage. Chaque pays possède sa propre centrale, sur sa rive du Zambèze.""",
    "monde-trois-gorges": """La puissance installée dit ce qu'une centrale peut produire au maximum à un instant précis, un peu comme la vitesse maximale d'une voiture. L'énergie produite en un an dépend de l'eau disponible : une année sèche donne moins qu'une année humide. Une centrale ne tourne donc presque jamais à pleine puissance toute l'année.""",
    "monde-hoover-dam": """Quand le lac Mead baisse pendant une sécheresse, deux choses diminuent à la fois : la réserve d'eau, et la hauteur de chute. Or plus l'eau tombe de haut, plus elle donne d'énergie aux turbines. Avec un lac plus bas, la centrale produit donc moins d'électricité avec la même quantité d'eau.""",
    "france-serre-poncon": """Serre-Ponçon est le plus grand lac artificiel de France métropolitaine par son volume. Mais en Guyane, le lac de Petit-Saut est encore plus volumineux, avec environ 3,5 milliards de mètres cubes.""",
    "france-migouelou": """Un barrage à voûtes multiples n'est pas un grand arc unique : ce sont plusieurs voûtes minces, côte à côte, qui transmettent chacune la poussée de l'eau à des contreforts, les piliers de béton. Ces piliers envoient ensuite la poussée dans la roche. On économise ainsi du béton, ce qui était précieux quand tout devait monter par téléphérique.""",
    "france-rance": """Les marées sont prévisibles très longtemps à l'avance : on connaît l'heure et la hauteur de la marée pour les années à venir, car elles dépendent du mouvement de la Lune et du Soleil. Ce n'est pas le cas du vent ou du soleil, qui changent avec la météo. C'est un atout rare pour une énergie renouvelable.""",
    "france-canal-alsace": """Les passes à poissons améliorent la continuité du fleuve, mais elles ne suffisent pas à elles seules. Pour qu'un saumon remonte le Rhin, il doit franchir tous les obstacles du fleuve, depuis la mer jusqu'aux rivières où il pond. Le retour des poissons migrateurs dépend donc de l'ensemble du fleuve, pas d'un seul barrage.""",
    "france-levees-loire": """Quand une levée casse, l'eau peut envahir très vite la plaine derrière elle, car cette plaine est plus basse que le fleuve. C'est le grand danger de ces digues, et la raison pour laquelle on les surveille et on les entretient en permanence. Les déversoirs servent à choisir l'endroit où l'eau passera en cas de très grande crue, plutôt que de laisser la levée céder là où il y a des habitations.""",
    "france-takamaka": """En janvier 1966, le cyclone Denise a fait tomber à La Réunion plus de 1 800 millimètres de pluie en 24 heures, un record du monde : presque trois ans de pluie parisienne en une seule journée ! Voilà pourquoi la rivière peut monter si vite, et pourquoi les ingénieurs ont mis la centrale à l'abri sous la montagne.""",
    "temps-pont-du-gard": None,
    "temps-canal-du-midi": """Saint-Ferréol ne se remplit pas tout seul. Un réseau de rigoles, creusées sur les pentes de la Montagne Noire, capte l'eau de plusieurs ruisseaux et la conduit jusqu'au lac. Une autre rigole amène ensuite l'eau jusqu'au point le plus haut du canal.""",
    "temps-barrage-zola": """À l'époque, on construisait surtout des murs épais et lourds, en se fiant à l'expérience. François Zola, lui, a utilisé le calcul pour trouver la forme d'un arc qui renvoie la poussée de l'eau vers les rives rocheuses. Aujourd'hui, les ingénieurs font les mêmes raisonnements avec des ordinateurs.""",
    "temps-barrage-dardennes": """Une roche karstique est comme une éponge pleine de trous : la pluie s'y infiltre vite et ressort plus bas en sources très abondantes. Mais l'eau y est très peu filtrée par la roche, et elle peut emporter des impuretés. C'est pourquoi l'eau de Dardennes est filtrée et désinfectée à l'ozone avant d'arriver aux robinets.""",
    "temps-barrage-rizzanese": """Sur une île, le réseau électrique est petit et peu relié à d'autres : à chaque instant, la quantité d'électricité produite doit être égale à celle qui est consommée, sinon le réseau se dérègle. Une centrale hydraulique peut changer sa production en quelques minutes. Elle est donc précieuse pour compenser un pic de consommation le soir, ou un nuage qui fait chuter la production des panneaux solaires.""",
    "temps-canal-seine-nord": """Le principe des bassins d'épargne est simple. Quand un bateau descend, une partie de l'eau de l'écluse s'écoule d'abord dans de grands bassins voisins, sans aucune pompe, simplement grâce à la pente. Quand un bateau monte, on rend cette eau à l'écluse. L'eau qui manque encore est remplacée par pompage.""",
}

# Corrections dans le corps des textes : (id, ancien, nouveau)
BODY = [
    ("usages-tourisme", "Si l'eau de certains lacs de montagne est turquoise", "Si l'eau de certains lacs glaciaires est turquoise"),
    ("composants-evacuateur", "peut laisser passer environ **62 000 mètres cubes par seconde**, soit environ 40 fois le débit moyen des chutes d'Iguaçu, une immense chute d'eau toute proche.",
     "peut laisser passer environ **62 000 mètres cubes par seconde**, soit environ 40 fois le débit moyen des chutes d'Iguaçu, une immense chute d'eau toute proche."),
    ("types-canaux", "environ **8 500 à 8 600 km**", "environ **8 500 km**"),
    ("types-digue-protection",
     "> Depuis la loi **GEMAPI**, les communes et leurs groupements organisent la gestion des digues : celles qui sont retenues pour protéger la population forment des « systèmes d'endiguement », autorisés et surveillés.",
     "> Les terriers de ragondins, de blaireaux ou de renards peuvent fragiliser une digue. C'est pourquoi des agents la parcourent régulièrement, surtout après une crue, pour repérer et reboucher ces trous."),
    ("types-step",
     "> Une STEP récupère environ **70 à 80 %** de l'électricité utilisée pour pomper : sur 100 « unités » dépensées, on en retrouve de 70 à 80 !",
     "> L'idée n'est pas nouvelle : les premières STEP ont été construites en Italie et en Suisse à la fin du XIXe siècle, il y a plus de 120 ans !"),
    ("monde-canal-suez", "- Environ **10 à 12 %** du commerce maritime mondial y passe (selon les années et les sources).",
     "- Environ **un dixième** du commerce maritime mondial y passe."),
    ("monde-trois-gorges", " (attention : la puissance n'est pas l'énergie produite sur l'année)", ""),
    ("france-serre-poncon", "- **Le lac** : environ 1,2 milliard de mètres cubes (jusqu'à 1,27 selon les sources), le plus grand lac artificiel de France métropolitaine par volume.",
     "- **Le lac** : environ 1,2 milliard de mètres cubes, de quoi remplir près de 500 000 piscines olympiques."),
    ("france-levees-loire", "(environ 300 000 personnes selon certaines estimations)", "(de l'ordre de 300 000 personnes)"),
    ("france-takamaka", "de l'ordre de 40 MW pour l'ensemble des deux aménagements (selon les sources)", "environ 44 MW pour l'ensemble des deux aménagements"),
    ("temps-barrage-dardennes",
     "> Selon certaines sources, l'eau de Dardennes aurait été désinfectée très tôt avec la méthode de **la « verdunisation »**, mise au point pendant la bataille de Verdun pour protéger les soldats contre la typhoïde, une maladie de l'eau sale.",
     "> Dans une roche karstique, des **rivières entières peuvent couler sous terre** : l'eau disparaît dans un trou, voyage dans l'obscurité, puis ressort parfois à plusieurs kilomètres, sous forme de source."),
]

s = (ROOT / "data/cards.ts").read_text(encoding="utf-8")


def span(cid, key):
    p = s.index(f'id: "{cid}"')
    a = s.index(key, p)
    return p, a


for cid, more in MORE.items():
    if more is None:
        continue
    assert "`" not in more and "${" not in more
    p, a = span(cid, "    contentMarkdown: `")
    e = s.index("`,\n", a)
    md = s[a + len("    contentMarkdown: `"):e]
    h = md.index("### Pour aller plus loin\n")
    md = md[:h] + "### Pour aller plus loin\n" + more.strip() + "\n"
    s = s[:a] + "    contentMarkdown: `" + md + s[e:]

for cid, old, new in BODY:
    p, a = span(cid, "    contentMarkdown: `")
    e = s.index("`,\n", a)
    block = s[a:e]
    assert old in block, f"{cid} : texte introuvable -> {old[:60]!r}"
    s = s[:a] + block.replace(old, new, 1) + s[e:]

(ROOT / "data/cards.ts").write_text(s, encoding="utf-8")
print("OK :", sum(1 for v in MORE.values() if v), "blocs remplacés,", len(BODY), "corrections")
