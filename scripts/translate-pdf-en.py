"""Traduit en anglais le PDF du jeu imprimé (7familles-VF.pdf), en conservant la mise en page d'origine.

Le texte du PDF est vectoriel : on le supprime (redaction, sans toucher aux images ni au dessin) puis on réécrit
la version anglaise au même endroit. Les polices d'origine (Anchor, Google Sans Flex) sont des sous-ensembles
qui ne contiennent pas tous les caractères nécessaires : on les remplace par des polices condensées de Windows.
Les formes qui épousent le texte (onglet blanc de l'en-tête, soulignés ondulés des titres, pastilles blanches
des légendes) sont redessinées à la nouvelle largeur du texte.

Usage : python scripts/translate-pdf-en.py <pdf source> <pdf sortie> [pages à traiter, ex. 0,23,44]
"""
import re
import sys

import pymupdf as fm

DIGITS = "➀➁➂➃➄➅➊➋➌➍➎➏"
W = "C:/Windows/Fonts/"
FONT_FILES = {"body": W + "FRAMDCN.TTF", "head": W + "FRAMDCN.TTF"}
MEASURE = {k: fm.Font(fontfile=v) for k, v in FONT_FILES.items()}

# --------------------------------------------------------------------------------------------------------------
# Traductions
# --------------------------------------------------------------------------------------------------------------
FAMILY = {
    "MÉTIERS": "JOBS",
    "USAGES": "USES",
    "COMPOSANTS": "COMPONENTS",
    "TYPES D’OUVRAGES": "TYPES OF STRUCTURES",
    "DANS LE MONDE": "AROUND THE WORLD",
    "EN FRANCE": "IN FRANCE",
    "DANS LE TEMPS": "THROUGH TIME",
}

# Noms courts des listes « membres de la famille » (clé normalisée : apostrophes droites)
NAMES = {
    "Propriétaire": "Owner", "Concepteur": "Designer", "Constructeur": "Builder", "Expert sécurité": "Safety expert",
    "Hydrologue": "Hydrologist", "Géologue": "Geologist",
    "Eau potable": "Drinking water", "Hydroélectricité": "Hydroelectricity", "Irrigation": "Irrigation",
    "Régulation débit": "Flow regulation", "Transport": "Transport", "Tourisme": "Tourism",
    "Corps": "Dam body", "Évacuateur": "Spillway", "Fondation": "Foundation", "Prise d'eau": "Water intake",
    "Capteurs": "Sensors", "Rivière": "River",
    "Remblai": "Embankment", "Poids": "Gravity", "Voûte": "Arch", "Canaux": "Canals",
    "Digue protection": "Flood levee", "STEP (Station…)": "PSH (Pumped…)",
    "Itaipu": "Itaipu", "Canal de Suez": "Suez Canal", "Grande-Dixence": "Grande-Dixence", "Kariba": "Kariba",
    "Trois-Gorges": "Three Gorges", "Hoover Dam": "Hoover Dam",
    "Serre-Ponçon": "Serre-Ponçon", "Migouélou": "Migouélou", "La Rance": "Rance", "Canal d'Alsace": "Alsace Canal",
    "Levées de la Loire": "Loire levees", "Takamaka": "Takamaka",
    "Pont du Gard": "Pont du Gard", "Canal du Midi": "Canal du Midi", "Zola": "Zola", "Dardennes": "Dardennes",
    "Rizzanese": "Rizzanese", "Seine Nord Europe": "Seine-Nord Europe",
}

# Titres des cartes : une liste de lignes (alignées en bas, comme dans le PDF)
TITLES = {
    "PROPRIÉTAIRE": ["OWNER"], "CONCEPTRICE": ["DESIGNER"], "CONSTRUCTEUR": ["BUILDER"],
    "EXPERT SÉCURITÉ": ["SAFETY EXPERT"], "HYDROLOGUE": ["HYDROLOGIST"], "GÉOLOGUE": ["GEOLOGIST"],
    "EAU POTABLE": ["DRINKING WATER"], "HYDROÉLECTRICITÉ": ["HYDROELECTRICITY"], "IRRIGATION": ["IRRIGATION"],
    "RÉGULATION DU DÉBIT": ["FLOW REGULATION"], "TRANSPORT": ["TRANSPORT"], "TOURISME": ["TOURISM"],
    "CORPS": ["DAM BODY"], "ÉVACUATEUR": ["SPILLWAY"], "FONDATION": ["FOUNDATION"], "PRISE D’EAU": ["WATER INTAKE"],
    "CAPTEURS": ["SENSORS"], "RIVIÈRE": ["RIVER"],
    "BARRAGE EN REMBLAI": ["EMBANKMENT DAM"], "BARRAGE POIDS": ["GRAVITY DAM"], "BARRAGE VOÛTE": ["ARCH DAM"],
    "CANAUX": ["CANALS"], "DIGUE DE PROTECTION": ["FLOOD LEVEE"],
    "STATION DE TRANSFERT D’ÉNERGIE PAR POMPAGE": ["PUMPED-STORAGE", "HYDROPOWER STATION"],
    "BARRAGE D’ITAIPU": ["ITAIPU DAM"], "CANAL DE SUEZ": ["SUEZ CANAL"],
    "BARRAGE LA GRANDE-DIXENCE": ["GRANDE-DIXENCE DAM"], "BARRAGE KARIBA": ["KARIBA DAM"],
    "BARRAGE DES TROIS-GORGES": ["THREE GORGES DAM"], "HOOVER DAM": ["HOOVER DAM"],
    "BARRAGE DE SERRE-PONÇON": ["SERRE-PONÇON DAM"], "BARRAGE DE MIGOUÉLOU": ["MIGOUÉLOU DAM"],
    "BARRAGE DE LA RANCE": ["RANCE TIDAL STATION"], "GRAND CANAL D’ALSACE": ["GRAND CANAL D’ALSACE"],
    "LEVÉES DE LA LOIRE": ["LOIRE LEVEES"], "BARRAGE DE TAKAMAKA": ["TAKAMAKA DAM"],
    "PONT DU GARD": ["PONT DU GARD"], "CANAL DU MIDI": ["CANAL DU MIDI"], "BARRAGE ZOLA": ["ZOLA DAM"],
    "BARRAGE DE DARDENNES": ["DARDENNES DAM"], "BARRAGE DU RIZZANESE": ["RIZZANESE DAM"],
    "CANAL SEINE NORD EUROPE": ["SEINE-NORD EUROPE CANAL"],
}

# Phrases descriptives des cartes, indexées par le début du texte français normalisé
DESCRIPTIONS = {
    "Il finance la construction": "He finances the construction of the structure and oversees its operation and upkeep over time.",
    "Elle dessine les plans": "She draws up the plans and chooses the materials and equipment so that the dam can withstand water and ground.",
    "Il réalise les travaux": "He carries out the works following the plans and oversees the quality of the materials and the safety of the site.",
    "Il surveille l'état du barrage": "He monitors the condition of the dam and makes sure it stays strong enough to withstand exceptional events.",
    "Elle étudie l'eau": "She studies water, rivers, rain and floods to anticipate the needs and risks linked to the dam.",
    "Avant la construction du barrage": "Before the dam is built, she studies the rocks and the subsoil to check that the ground is stable.",
    "Les barrages stockent de l'eau qui": "Dams store water that is then treated to make it safe to drink, cook with and wash with.",
    "L'eau des barrages fait tourner": "Dam water spins turbines and produces electricity for lighting, heating, getting around…",
    "Les barrages stockent de l'eau pour": "Dams store water to irrigate fields and let crops grow.",
    "Les barrages retiennent ou libèrent": "Dams hold back or release river water to control the flow and avoid surpluses or shortages.",
    "Les barrages permettent aux bateaux": "Dams let boats sail on rivers and waterways thanks to locks.",
    "Les lacs de barrage": "Dam lakes attract visitors who come to enjoy outdoor activities and admire the scenery.",
    "Partie principale du barrage": "Main part of the dam, it holds back the mass of water and transmits the forces to the foundations and the ground.",
    "Il permet de laisser passer": "It lets excess water pass to prevent a dangerous rise in the level of the reservoir.",
    "Terrains sur lesquels": "The ground the dam rests on, it ensures its stability and transmits the forces to the soil and the rock.",
    "Elle prélève l'eau": "It draws water from the reservoir, carries it to where it is used and drains it if necessary.",
    "Ils mesurent les mouvements": "They measure movements, pressures or leaks to monitor the condition of the dam.",
    "Cours d'eau naturel": "Natural watercourse that feeds the reservoir upstream and keeps flowing downstream of the dam.",
    "Il est fait de terre": "It is made of compacted earth and/or rock. It forms a large barrier that holds back the water.",
    "Ouvrage rigide": "A rigid structure of masonry or concrete, its weight lets it resist the thrust of the water.",
    "Sa forme courbée": "Its curved shape lets it hold back water by bracing against the rock walls around it.",
    "Ouvrages qui permettent": "Structures that guide water from one place to another, for its use and for navigation.",
    "Ouvrage de grande longueur": "A very long structure that protects residents and land against floods.",
    "Elle pompe l'eau": "It pumps water uphill, then lets it flow back down through turbines to produce electricity.",
    "Construit sur le fleuve Paraná": "Built on the Paraná River, it produces electricity for Brazil and Paraguay",
    "Il fait passer les bateaux": "It lets ships pass between the Mediterranean Sea and the Red Sea without having to sail around Africa.",
    "Il retient l'eau des montagnes suisses": "It holds back water from the Swiss mountains to produce electricity with hydroelectric power plants.",
    "Il forme un grand lac": "It forms a large lake by holding back the waters of the Zambezi River, between Zambia and Zimbabwe.",
    "Située sur le fleuve Yangtsé": "Located on the Yangtze River, it is one of the most powerful hydroelectric dams in the world.",
    "Il retient les eaux du fleuve Colorado": "It holds back the waters of the Colorado River to produce electricity and manage the region's water.",
    "Multi-usages": "Multi-purpose, it forms a tourist lake, produces electricity, irrigates and regulates the Durance.",
    "Il retient l'eau des montagnes dans": "It holds back mountain water in the Pyrenees to produce electricity with a power plant.",
    "Situé entre Saint-Malo": "Located between Saint-Malo and Dinard, it uses the movement of the tides to produce electricity.",
    "Il permet aux bateaux de naviguer": "It lets boats sail along the Rhine between Basel and Strasbourg, and produces electricity.",
    "Construites le long de la Loire": "Built along the Loire, these levees protect towns and homes against floods.",
    "Il utilise l'eau des montagnes": "It uses mountain water to produce electricity in an underground power plant.",
    "Construit par les Romains": "Built by the Romans 2,000 years ago, it supports the canal that carried water from Uzès to Nîmes over 50 km.",
    "Construit au XVIIe siècle": "Built in the 17th century, the Canal du Midi – Saint-Ferréol links the Garonne to the Mediterranean over 240 km.",
    "Construit au XIXe siècle": "Built in the 19th century, it is one of the very first arch dams of the industrial era.",
    "Situé près de Toulon": "Located near Toulon, it stores water to help supply the city with drinking water.",
    "Mis en service en 2013": "Commissioned in 2013 in Corsica, it produces hydroelectricity to supply the island's power grid.",
    "En construction": "Under construction, it will link the Oise to the Dunkirk–Scheldt canal to develop river transport.",
}

# Légendes en bas à droite de la carte (le texte non listé reste inchangé : noms propres, dates, régions)
CAPTIONS = {
    "Barrage du Mont-Cenis": "Mont-Cenis Dam", "Barrage du Moulin Neuf": "Moulin Neuf Dam", "Barrage de Quinson": "Quinson Dam",
    "Canal d'Ille et Rance": "Ille-et-Rance Canal", "Digue du Doménon": "Doménon levee", "STEP de Revin": "Revin PSH",
    "Brésil – Paraguay": "Brazil – Paraguay", "Égypte": "Egypt", "Suisse": "Switzerland", "Chine": "China",
    "États-Unis": "United States", "Bretagne": "Brittany", "La Réunion": "Réunion",
}

# Pages 42 à 47 : (début du texte français normalisé) -> anglais
INVENTORY_TITLE = ("INVENTAIRE 7 FAMILLES", "7 FAMILIES INVENTORY")
INVENTORY_GROUPS = {
    "MÉTIERS": "JOBS", "USAGES": "USES", "COMPOSANTS": "COMPONENTS", "DANS LE MONDE": "AROUND THE WORLD",
    "TYPES D'OUVRAGES": "TYPES OF STRUCTURES", "EN FRANCE": "IN FRANCE", "DANS LE TEMPS": "THROUGH TIME",
}

RULES = {
    # page 43
    "INFOS COMPLÉMENTAIRES": "ADDITIONAL INFORMATION",
    "CURIEUX D'EN SAVOIR PLUS": "WANT TO LEARN MORE?",
    "Explorez les ressources": "Explore the resources provided to discover additional information about each member of our seven families.",
    "Quels sont les différents types": "What are the different types of structures and their main components? Who builds and operates them? What are they used for?",
    "Scannez le": "Scan the QR code to deepen your knowledge of the world of dams and other hydraulic structures!",
    # page 44
    "RÈGLES DU JEU": "GAME RULES",
    "4 ANS ET +": "AGES 4+",
    "2 À 4 JOUEURS": "2 TO 4 PLAYERS",
    "DE 15 À 20 MIN.": "15 TO 20 MIN.",
    "MATÉRIEL": "MATERIAL",
    "• 42 cartes": "• 42 cards split into 7 families of 6 cards",
    "• 1 carte règles": "• 1 rules card and 1 information card",
    "• 1 carte présentation": "• 1 card presenting the authors of the game",
    "BUT DU JEU": "GOAL OF THE GAME",
    "L'objectif du jeu": "The goal is to gather the most families before the game ends.",
    "DÉROULEMENT": "HOW TO PLAY",
    "Battre les cartes": "Shuffle the cards and deal 7 to each player; the rest is placed face down on the table and forms the draw pile. The player to the left of the dealer starts the game by asking any player of their choice for a card to complete a family (for example: “In the JOBS family, I would like the Owner card.”).",
    # page 45
    "Pour demander une carte": "To ask for a card, the player must hold at least one card of that family in hand.",
    "Si l'autre joueur": "If the other player has that card, they must hand it over; otherwise, the asker must draw from the pile. If the drawn card is the right one, the asker says “good draw” and keeps going until they can no longer get the card they want, either from another player or from the pile: then their turn ends.",
    "C'est ensuite au joueur": "It is then the turn of the player on the left to ask for the cards they want. When a player holds a complete family (all 6 cards), they lay it face up in front of them, and the game goes on until there are no more families left to complete.",
    "FIN DE PARTIE": "END OF THE GAME",
    "Si la pioche est vide": "If the draw pile is empty, the game goes on until all the families have been collected. The winner is the player who has gathered the most families in front of them at the end of the game.",
    # page 46
    "LE CFBR": "THE CFBR",
    "HISTOIRE": "HISTORY",
    "Créé en 1926": "Founded in 1926, the French Committee on Large Dams (CFBR) is an association of about 580 active members, chosen for their expertise in the field of dams and hydraulic structures. In 1928, it helped create the International Commission on Large Dams, to which it is affiliated.",
    "En 2026": "In 2026, the CFBR celebrates 100 years of expertise and shared passion! For the occasion, the Committee decided to create this game of 7 families as a tribute to this collective history, marked by great technical achievements, decisive scientific advances and close collaboration between professionals of the sector.",
    # page 47
    "MISSIONS": "MISSIONS",
    "Le CFBR s'est donné": "The CFBR has set itself the mission of promoting progress in the design, construction, maintenance and operation of dams and hydraulic structures. It encourages the exchange of information, organizes a Technical Colloquium every year and runs working groups in charge of drawing up recommendations.",
    "AUTEURS DU JEU": "GAME AUTHORS",
    "• CODOR du CFBR": "• CODOR of the CFBR",
    "Chercheur à": "Researcher at INRAE specialized in civil engineering and risk management, he develops tools to raise awareness of the protection of ecosystems.",
    "Studio de graphisme": "Graphic design studio specializing in science communication and play-based learning, founded by Coline Mestas and Marine Monseux.",
}


# --------------------------------------------------------------------------------------------------------------
# Outils
# --------------------------------------------------------------------------------------------------------------
def norm(s):
    return re.sub(r"\s+", " ", s.replace("’", "'").replace(" ", " ").replace(" ", " ")).strip()


def rgb(c):
    return ((c >> 16 & 255) / 255, (c >> 8 & 255) / 255, (c & 255) / 255)


def tw(text, font, size):
    return MEASURE[font].text_length(text, size)


def read_page(page):
    """Lignes de texte de la page : liste de dicts {spans, text, bbox}. Texte horizontal uniquement."""
    out = []
    for b in page.get_text("rawdict")["blocks"]:
        if b["type"] != 0:
            continue
        for l in b["lines"]:
            if abs(l["dir"][0] - 1) > 0.01:  # texte tourné (crédits photo) : on n'y touche pas
                continue
            spans = []
            for s in l["spans"]:
                spans.append({
                    "text": "".join(c["c"] for c in s["chars"]), "font": s["font"].split("+")[-1], "size": s["size"],
                    "color": s["color"], "bbox": fm.Rect(s["bbox"]), "origin": s["origin"],
                    "chars": [(c["c"], fm.Rect(c["bbox"])) for c in s["chars"]],
                })
            out.append({"spans": spans, "text": "".join(s["text"] for s in spans), "bbox": fm.Rect(l["bbox"])})
    return out


def wrap(text, font, size, width):
    words, lines, cur = text.split(" "), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if cur and tw(t, font, size) > width:
            lines.append(cur)
            cur = w
        else:
            cur = t
    lines.append(cur)
    return lines


def fit_paragraph(text, font, size, width, max_lines, min_size=8.0):
    """Plus grande taille (<= size) pour laquelle le texte tient en max_lines lignes."""
    s = size
    while True:
        lines = wrap(text, font, s, width)
        if len(lines) == 2 and " " not in lines[1]:  # évite un mot seul sur la 2e ligne : on équilibre les deux lignes
            words = text.split(" ")
            best = min(range(1, len(words)), key=lambda k: max(tw(" ".join(words[:k]), font, s), tw(" ".join(words[k:]), font, s)))
            lines = [" ".join(words[:best]), " ".join(words[best:])]
        if len(lines) <= max_lines or s <= min_size:
            return s, lines
        s = round(s - 0.25, 2)


class Redo:
    """Opérations à appliquer sur une page, dans l'ordre : suppression du texte, suppression de formes, dessin."""

    def __init__(self, page):
        self.page = page
        self.kill_text = []
        self.kill_shapes = []
        self.draw = []  # fonctions (shape)
        self.texts = []  # (x, y, text, font, size, color)

    def text(self, x, y, text, font, size, color, bold=False):
        self.texts.append((x, y, text, font, size, color, 0.016 if bold else 0))

    def apply(self, xrefs):
        page = self.page
        if self.kill_text:
            for r in self.kill_text:
                page.add_redact_annot(r, fill=False)
            page.apply_redactions(images=fm.PDF_REDACT_IMAGE_NONE, graphics=fm.PDF_REDACT_LINE_ART_NONE,
                                  text=fm.PDF_REDACT_TEXT_REMOVE)
        if self.kill_shapes:
            for r in self.kill_shapes:
                page.add_redact_annot(r, fill=False)
            page.apply_redactions(images=fm.PDF_REDACT_IMAGE_NONE, graphics=fm.PDF_REDACT_LINE_ART_REMOVE_IF_COVERED,
                                  text=fm.PDF_REDACT_TEXT_NONE)
        for d in self.draw:
            d()
        for key in FONT_FILES:
            if key in xrefs:
                page.insert_font(fontname="F" + key, fontbuffer=None, fontfile=FONT_FILES[key])
            else:
                xrefs[key] = page.insert_font(fontname="F" + key, fontfile=FONT_FILES[key])
        for x, y, t, f, s, c, bw in self.texts:
            if bw:
                page.insert_text(fm.Point(x, y), t, fontname="F" + f, fontsize=s, color=rgb(c), fill=rgb(c), render_mode=2, border_width=bw)
            else:
                page.insert_text(fm.Point(x, y), t, fontname="F" + f, fontsize=s, color=rgb(c))


def redraw(page, dr, fx):
    """Redessine une forme vectorielle en appliquant fx à chaque abscisse."""
    sh = page.new_shape()

    def P(p):
        return fm.Point(fx(p.x), p.y)

    for it in dr["items"]:
        if it[0] == "l":
            sh.draw_line(P(it[1]), P(it[2]))
        elif it[0] == "c":
            sh.draw_bezier(P(it[1]), P(it[2]), P(it[3]), P(it[4]))
        elif it[0] == "re":
            r = it[1]
            sh.draw_rect(fm.Rect(fx(r.x0), r.y0, fx(r.x1), r.y1))
        else:
            raise ValueError(it[0])
    cap = (dr.get("lineCap") or (0,))[0]
    sh.finish(fill=dr.get("fill"), color=dr.get("color"), width=dr.get("width") or 0, closePath=bool(dr.get("closePath")),
              even_odd=bool(dr.get("even_odd")), lineCap=cap, lineJoin=dr.get("lineJoin") or 0,
              fill_opacity=dr.get("fill_opacity") or 1, stroke_opacity=dr.get("stroke_opacity") or 1)
    sh.commit()


def white_tab(page, x0, y0, x1, y1, r=6.0):
    """Onglet blanc sous le titre (coin supérieur droit arrondi), pour que le titre reste lisible sur l'illustration."""
    sh = page.new_shape()
    sh.draw_line(fm.Point(x0, y1), fm.Point(x0, y0))
    sh.draw_line(fm.Point(x0, y0), fm.Point(x1 - r, y0))
    sh.draw_bezier(fm.Point(x1 - r, y0), fm.Point(x1 - r * 0.45, y0), fm.Point(x1, y0 + r * 0.55), fm.Point(x1, y0 + r))
    sh.draw_line(fm.Point(x1, y0 + r), fm.Point(x1, y1))
    sh.finish(fill=(1, 1, 1), color=None, closePath=True)
    sh.commit()


def kill_rect(sp, name_from=0):
    """Rectangle de suppression d'un span (ou de sa fin à partir du caractère name_from), sans toucher aux lignes voisines."""
    chars = sp["chars"][name_from:]
    x0 = min(r.x0 for _, r in chars) + 0.35
    x1 = max(r.x1 for _, r in chars) - 0.35
    y0, y1 = sp["bbox"].y0, sp["bbox"].y1
    return fm.Rect(x0, y0 + (y1 - y0) * 0.28, x1, y1 - (y1 - y0) * 0.30)


def inside(r, big):
    return big.x0 - 0.6 <= r.x0 and r.x1 <= big.x1 + 0.6 and big.y0 - 0.6 <= r.y0 and r.y1 <= big.y1 + 0.6


# --------------------------------------------------------------------------------------------------------------
# Cartes (pages 0 à 41)
# --------------------------------------------------------------------------------------------------------------
def do_card(page, xrefs, warn):
    lines = read_page(page)
    drawings = page.get_drawings()
    R = Redo(page)
    entries = []  # (line, digit span index)

    # famille
    header = next(l for l in lines if l["spans"][0]["text"].startswith("Famille"))
    fam_fr = header["text"].replace("Famille", "").strip()
    fam_fr = re.sub(r"\s+", " ", fam_fr)
    fam_en = FAMILY[fam_fr]
    sp0, spl = header["spans"][0], header["spans"][-1]
    old_x0, old_x1 = sp0["bbox"].x0, spl["bbox"].x1
    w1, w2 = tw("Family ", "head", 12), tw(fam_en, "head", 12)
    new_w = w1 + w2
    centre = (old_x0 + old_x1) / 2
    delta = new_w - (old_x1 - old_x0)
    for sp in header["spans"]:
        R.kill_text.append(kill_rect(sp))
    strip = next((d for d in drawings if d["fill"] == (1.0, 1.0, 1.0) and abs(d["rect"].y0 - 8.5) < 0.3
                  and abs(d["rect"].y1 - 24.1) < 0.4 and d["rect"].x0 > 40 and d["rect"].x1 < 160), None)
    if strip:
        c = (strip["rect"].x0 + strip["rect"].x1) / 2
        R.kill_shapes.append(strip["rect"] + (-0.3, -0.3, 0.3, 0.3))
        R.draw.append(lambda d=strip, c=c, dl=delta: redraw(page, d, lambda x: x - dl / 2 if x < c else x + dl / 2))
    else:
        warn("pas d'onglet d'en-tête")
    y = sp0["origin"][1]
    R.text(centre - new_w / 2, y, "Family ", "head", 12, sp0["color"])
    R.text(centre - new_w / 2 + w1, y, fam_en, "head", 12, spl["color"], bold=True)

    # titre
    tl = sorted([l for l in lines if l["spans"][0]["font"] == "Anchor-Bold" and abs(l["spans"][0]["size"] - 13) < 0.1],
                key=lambda l: l["bbox"].y0)
    tab_right = 0
    if tl:
        fr = norm(" ".join(l["text"] for l in tl))
        en = TITLES.get(fr) or TITLES.get(fr.replace("'", "’"))
        if en is None:
            warn(f"titre non traduit: {fr}")
        else:
            assert len(en) <= len(tl), (fr, en)
            strokes = [d for d in drawings if d["color"] and not d["fill"] and d["rect"].height < 1 and 195 < d["rect"].y0 < 222
                       and d["rect"].x0 < 12]
            for l in tl:
                R.kill_text.append(kill_rect(l["spans"][0]))
            for d in strokes:
                R.kill_shapes.append(d["rect"] + (-0.4, -1.6, 0.4, 1.6))
            offset = len(tl) - len(en)
            # Cadre de la légende (carte du monde, de la France…) : l'onglet blanc du titre ne doit pas mordre dessus
            box = next((d["rect"] for d in drawings if d["fill"] == (1.0, 1.0, 1.0) and d["rect"].x0 > 120 and d["rect"].width > 40
                        and d["rect"].height > 30 and d["rect"].y0 > 150), None)
            for i, t in enumerate(en):
                src = tl[i + offset]
                size = 13.0
                width_max, size_min = 181.0, 9.0
                if box is not None and src["bbox"].y1 > box.y0:
                    width_max, size_min = min(width_max, box.x0 - 11.3 - src["spans"][0]["bbox"].x0), 8.5
                while tw(t, "head", size) > width_max and size > size_min:
                    size -= 0.25
                R.text(src["spans"][0]["bbox"].x0, src["spans"][0]["origin"][1], t, "head", size, src["spans"][0]["color"], bold=True)
                end_new = src["spans"][0]["bbox"].x0 + tw(t, "head", size)
                if end_new > src["bbox"].x1 - 0.5:
                    tab_right = max(tab_right, end_new + 6)
                # souligné ondulé : même forme, étirée à la nouvelle largeur
                stroke = min(strokes, key=lambda d: abs(d["rect"].y0 - (src["spans"][0]["origin"][1] + 0.1)), default=None)
                if stroke is not None:
                    x0s = stroke["rect"].x0
                    old_end = stroke["rect"].x1
                    text_end_old = src["bbox"].x1
                    # Le souligné d'origine peut être plus court que le texte (titre sur deux lignes) : on le cale sur le texte
                    extra = old_end - text_end_old if old_end >= text_end_old - 2 else 0.0
                    new_end = src["spans"][0]["bbox"].x0 + tw(t, "head", size) + extra
                    k = (new_end - x0s) / (old_end - x0s)
                    R.draw.append(lambda d=stroke, x0s=x0s, k=k: redraw(page, d, lambda x: x0s + (x - x0s) * k))

    if tab_right:
        top = min(l["bbox"].y0 for l in tl) - 2.8
        R.draw.insert(0, lambda r=tab_right, t=top: white_tab(page, 7.2, t, r, 218.4))

    # description
    dl = sorted([l for l in lines if l["spans"][0]["font"].startswith("GoogleSansFlex") and l["spans"][0]["size"] >= 9.5 and l["spans"][0]["size"] <= 10.6
                 and l["bbox"].y0 > 215 and l["bbox"].y0 < 250 and l["spans"][0]["text"][0] not in DIGITS],
                key=lambda l: l["bbox"].y0)
    if dl:
        fr = norm(" ".join(l["text"] for l in dl))
        key = next((k for k in DESCRIPTIONS if fr.startswith(k)), None)
        if key is None:
            warn(f"description non traduite: {fr}")
        else:
            for l in dl:
                R.kill_text.append(kill_rect(l["spans"][0]))
            size, wl = fit_paragraph(DESCRIPTIONS[key], "body", 10.0, 182.5, len(dl), min_size=8)
            for l, t in zip(dl, wl):
                R.text(8.5, l["spans"][0]["origin"][1], t, "body", size, l["spans"][0]["color"])

    # liste des six membres (le chiffre et le nom peuvent être dans le même span, dans deux spans ou dans deux lignes)
    low = [l for l in lines if l["bbox"].y0 > 245 and l["text"].strip()]
    digit_x = [(l["bbox"].x0 if l["text"].strip()[0] in DIGITS else l["bbox"].x0 - 7.3, l["bbox"].y0) for l in low]
    for l in low:
        t = l["text"].strip()
        if len(t) == 1 and t in DIGITS:
            continue  # chiffre seul
        spans = l["spans"]
        d = spans[0]
        if d["text"].strip()[0] in DIGITS:
            dx = d["bbox"].x0
            if len(d["text"].strip()) > 1:  # chiffre et nom dans le même span
                name_fr, name_start, name_spans = norm(d["text"][1:]), 1, [d]
                x = d["chars"][1][1].x1
            else:
                name_spans = spans[1:]
                name_fr, name_start = norm("".join(s_["text"] for s_ in name_spans)), 0
                x = name_spans[0]["bbox"].x0 + 1.5
        else:  # nom seul : le chiffre est dans une autre ligne
            dx = l["bbox"].x0 - 7.3
            name_spans, name_start = spans, 0
            name_fr = norm(l["text"])
            x = l["bbox"].x0 + 1.5
        en = NAMES.get(name_fr)
        if en is None:
            warn(f"nom non traduit: {name_fr}")
            continue
        for i, s_ in enumerate(name_spans):
            R.kill_text.append(kill_rect(s_, name_start if i == 0 else 0))
        right = [xx for xx, yy in digit_x if abs(yy - l["bbox"].y0) < 12 and xx > dx + 5]
        limit = (min(right) - 3) if right else 191.7
        size = 9.0
        while tw(en, "body", size) > limit - x and size > 6.5:
            size -= 0.25
        R.text(x, name_spans[0]["origin"][1], en, "body", size, name_spans[-1]["color"])

    # légende (nom de pays, région, structure photographiée…)
    for l in lines:
        s0 = l["spans"][0]
        if s0["font"].startswith("GoogleSansFlex") and 7.5 <= s0["size"] <= 8.1 and s0["color"] != 0xFFFFFF and l["bbox"].y0 > 190:
            fr = norm(l["text"])
            if re.fullmatch(r"1\s*e\s*siècle", fr):
                en_parts = [("1", 8.0, 0), ("st", 4.7, 3.0), (" century", 8.0, 0)]
            else:
                en = CAPTIONS.get(fr)
                if en is None:
                    continue
                en_parts = [(en, s0["size"], 0)]
            old = l["bbox"]
            total = sum(tw(t, "body", s) for t, s, _ in en_parts)
            dl_ = max(0.0, total - old.width)
            for s in l["spans"]:
                R.kill_text.append(kill_rect(s))
            pill = None if dl_ == 0 else next((d for d in drawings if d["fill"] == (1.0, 1.0, 1.0) and d["color"] == (1.0, 1.0, 1.0) and d["rect"].width < 80
                         and abs(d["rect"].x1 - old.x1) < 1.5 and old.y0 - 1 <= d["rect"].y0 and d["rect"].y1 <= old.y1 + 1), None)
            if dl_ and pill is None:
                # Pas de pastille blanche à élargir (légende posée sur la carte du monde, par exemple) :
                # on réduit la taille du texte pour qu'il tienne dans la place de l'original, centré
                f = max(0.8, old.width / total)
                en_parts = [(t, round(sz * f, 2), rise) for t, sz, rise in en_parts]
                total = sum(tw(t, "body", sz) for t, sz, _ in en_parts)
                if total > old.width + 0.5:
                    warn(f"légende trop large: {en_parts[0][0]!r}")
                dl_ = 0.0
            if pill is not None:
                c = (pill["rect"].x0 + pill["rect"].x1) / 2
                R.kill_shapes.append(pill["rect"] + (-2.6, -2.6, 2.6, 2.6))
                R.draw.append(lambda d=pill, c=c, dl=dl_: redraw(page, d, lambda x: x - dl if x < c else x))
            x = old.x1 - total if dl_ else old.x0 + (old.width - total) / 2
            for t, s, rise in en_parts:
                R.text(x, s0["origin"][1] - rise, t, "body", s, s0["color"])
                x += tw(t, "body", s)
    R.apply(xrefs)


# --------------------------------------------------------------------------------------------------------------
# Inventaire et cartes de règles (pages 42 à 47)
# --------------------------------------------------------------------------------------------------------------
def paragraphs(lines):
    """Regroupe les lignes d'une page en paragraphes (même police et même couleur, interligne régulier)."""
    paras = []
    for l in sorted(lines, key=lambda l: (round(l["bbox"].y0 / 2), l["bbox"].x0)):
        s0 = l["spans"][0]
        key = (s0["font"], round(s0["size"]), s0["color"])
        last = paras[-1] if paras else None
        if (last and last["key"] == key and not l["text"].lstrip().startswith("•") and 0 < l["bbox"].y0 - last["lines"][-1]["bbox"].y0 < 14.5
                and abs(last["lines"][-1]["bbox"].x0 - l["bbox"].x0) < 0.6 and not last["single"]):
            last["lines"].append(l)
        else:
            paras.append({"key": key, "lines": [l], "single": s0["font"].startswith("Anchor") or l["text"].lstrip().startswith("•")})
    return paras


def do_rules(page, xrefs, warn):
    lines = read_page(page)
    drawings = page.get_drawings()
    R = Redo(page)
    body = []  # (paragraphe, anglais) : taille commune calculée ensuite
    for para in paragraphs(lines):
        ls = para["lines"]
        s0 = ls[0]["spans"][0]
        fr = norm(" ".join(l["text"] for l in ls))
        fr = re.sub(r"-\s(?=[a-zé])", "", fr) if False else fr
        key = next((k for k in RULES if fr.startswith(norm(k))), None)
        if key is None:
            warn(f"non traduit: {fr[:50]}")
            continue
        en = RULES[key]
        for l in ls:
            for s in l["spans"]:
                R.kill_text.append(kill_rect(s))
        is_head = s0["font"].startswith("Anchor")
        x0 = ls[0]["bbox"].x0
        y = s0["origin"][1]
        if is_head:
            size = s0["size"]
            width_old = ls[0]["bbox"].width
            avail = 191.7 - x0
            if key in ("4 ANS ET +", "2 À 4 JOUEURS", "DE 15 À 20 MIN."):
                avail = 191.7 - x0
            while tw(en, "head", size) > avail and size > 8:
                size -= 0.25
            R.text(x0, y, en, "head", size, s0["color"], bold=True)
            # souligné ondulé des grands titres
            for d in drawings:
                if d["color"] and not d["fill"] and d["rect"].height < 1 and abs(d["rect"].y0 - (y + 2.5)) < 6 and d["rect"].x0 < 12 and s0["size"] > 15:
                    R.kill_shapes.append(d["rect"] + (-0.4, -1.6, 0.4, 1.6))
                    k = (x0 + tw(en, "head", size) + (d["rect"].x1 - ls[0]["bbox"].x1) - d["rect"].x0) / (d["rect"].x1 - d["rect"].x0)
                    R.draw.append(lambda d=d, k=k: redraw(page, d, lambda x: d["rect"].x0 + (x - d["rect"].x0) * k))
        else:
            body.append((ls, en))
    common = min([fit_paragraph(en, "body", ls[0]["spans"][0]["size"], 191.7 - ls[0]["bbox"].x0 - 0.5, len(ls), min_size=8)[0]
                  for ls, en in body] or [11.0])
    for ls, en in body:
        s0 = ls[0]["spans"][0]
        x0, y = ls[0]["bbox"].x0, s0["origin"][1]
        leading = ls[1]["bbox"].y0 - ls[0]["bbox"].y0 if len(ls) > 1 else 13.0
        wl = wrap(en, "body", common, 191.7 - x0 - 0.5)
        if len(wl) > len(ls):
            warn(f"trop long ({len(wl)} lignes pour {len(ls)}): {en[:40]}")
        for i, t in enumerate(wl):
            R.text(x0, y + i * leading, t, "body", common, s0["color"])
    R.apply(xrefs)


def do_inventory(page, xrefs, warn):
    lines = read_page(page)
    drawings = page.get_drawings()
    R = Redo(page)
    ents = [l for l in lines if l["text"] and l["text"][0] in DIGITS]
    for l in lines:
        s0 = l["spans"][0]
        t = norm(l["text"])
        if l in ents:
            d = s0
            if len(d["text"]) > 1:
                name_fr, name_start, name_spans = norm(d["text"][1:]), 1, [d]
                x = d["chars"][1][1].x1
            else:
                name_spans = l["spans"][1:]
                name_fr, name_start = norm("".join(s["text"] for s in name_spans)), 0
                x = name_spans[0]["bbox"].x0 + 1.5
            en = NAMES.get(name_fr)
            if en is None:
                warn(f"nom non traduit: {name_fr}")
                continue
            for i, s in enumerate(name_spans):
                R.kill_text.append(kill_rect(s, name_start if i == 0 else 0))
            col = [e for e in ents if abs(e["bbox"].y0 - l["bbox"].y0) < 12 and e["bbox"].x0 > l["bbox"].x0 + 5]
            limit = (min(e["bbox"].x0 for e in col) - 3) if col else 191.7
            size = 9.0
            while tw(en, "body", size) > limit - x and size > 6.5:
                size -= 0.25
            R.text(x, name_spans[0]["origin"][1], en, "body", size, name_spans[-1]["color"])
        elif s0["font"].startswith("Anchor"):
            if t == INVENTORY_TITLE[0]:
                en = INVENTORY_TITLE[1]
            else:
                en = INVENTORY_GROUPS.get(t)
            if en is None:
                warn(f"titre non traduit: {t}")
                continue
            R.kill_text.append(kill_rect(s0))
            right = [o["bbox"].x0 for o in lines if o is not l and o["spans"][0]["font"].startswith("Anchor")
                     and abs(o["bbox"].y0 - l["bbox"].y0) < 3 and o["bbox"].x0 > l["bbox"].x0 + 5]
            limit = (min(right) - 5) if right else 191.7
            hsize = s0["size"]
            while tw(en, "head", hsize) > limit - s0["bbox"].x0 and hsize > 7:
                hsize -= 0.25
            R.text(s0["bbox"].x0, s0["origin"][1], en, "head", hsize, s0["color"], bold=True)
            if t == INVENTORY_TITLE[0]:
                for d in drawings:
                    if d["color"] and not d["fill"] and d["rect"].height < 1:
                        R.kill_shapes.append(d["rect"] + (-0.4, -1.6, 0.4, 1.6))
                        k = (s0["bbox"].x0 + tw(en, "head", s0["size"]) + (d["rect"].x1 - s0["bbox"].x1) - d["rect"].x0) / (d["rect"].x1 - d["rect"].x0)
                        R.draw.append(lambda d=d, k=k: redraw(page, d, lambda x: d["rect"].x0 + (x - d["rect"].x0) * k))
    R.apply(xrefs)


def main():
    src, out = sys.argv[1], sys.argv[2]
    only = {int(x) for x in sys.argv[3].split(",")} if len(sys.argv) > 3 else None
    doc = fm.open(src)
    if only:
        doc.select(sorted(only))
        index = sorted(only)
    else:
        index = list(range(len(doc)))
    xrefs = {}
    for pos, i in enumerate(index):
        page = doc[pos]

        def warn(msg, i=i):
            print(f"  [page {i + 1}] {msg}")

        if i <= 41:
            do_card(page, xrefs, warn)
        elif i == 42:
            do_inventory(page, xrefs, warn)
        elif i <= 47:
            do_rules(page, xrefs, warn)
        print("ok", i + 1)
    doc.set_metadata({**doc.metadata, "title": "7 Families of Dams (English)", "language": "en"} if False else doc.metadata)
    doc.save(out, garbage=4, deflate=True)


if __name__ == "__main__":
    main()
