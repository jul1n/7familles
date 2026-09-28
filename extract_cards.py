import os
import fitz # PyMuPDF
from PIL import Image

output_dir = os.path.join(os.getcwd(), "public", "cards")
os.makedirs(output_dir, exist_ok=True)

doc = fitz.open("CFBR-28sept.pdf")

# Familles et cartes associées (dans l'ordre 1..6 de la grille: ligne 1 [1, 2, 3], ligne 2 [4, 5, 6])
families_config = [
    {
        "page_idx": 3, # Page 4
        "family_id": "metiers",
        "family_name": "Métiers",
        "color": "#E67E22",
        "cards": [
            {"num": 1, "id": "metiers-proprietaire", "title": "Propriétaire"},
            {"num": 2, "id": "metiers-conceptrice", "title": "Conceptrice"},
            {"num": 3, "id": "metiers-constructeur", "title": "Constructeur"},
            {"num": 4, "id": "metiers-expert-securite", "title": "Expert sécurité"},
            {"num": 5, "id": "metiers-hydrologue", "title": "Hydrologue"},
            {"num": 6, "id": "metiers-geologue", "title": "Géologue"},
        ]
    },
    {
        "page_idx": 4, # Page 5
        "family_id": "usages",
        "family_name": "Usages",
        "color": "#F39C12",
        "cards": [
            {"num": 1, "id": "usages-eau-potable", "title": "Eau potable"},
            {"num": 2, "id": "usages-hydroelectricite", "title": "Hydroélectricité"},
            {"num": 3, "id": "usages-irrigation", "title": "Irrigation"},
            {"num": 4, "id": "usages-regulation-debit", "title": "Régulation du débit"},
            {"num": 5, "id": "usages-transport", "title": "Transport"},
            {"num": 6, "id": "usages-tourisme", "title": "Tourisme"},
        ]
    },
    {
        "page_idx": 5, # Page 6
        "family_id": "composants",
        "family_name": "Composants",
        "color": "#2980B9",
        "cards": [
            {"num": 1, "id": "composants-corps", "title": "Corps"},
            {"num": 2, "id": "composants-evacuateur", "title": "Évacuateur"},
            {"num": 3, "id": "composants-fondation", "title": "Fondation"},
            {"num": 4, "id": "composants-prise-deau", "title": "Prise d'eau"},
            {"num": 5, "id": "composants-capteurs", "title": "Capteurs"},
            {"num": 6, "id": "composants-riviere", "title": "Rivière"},
        ]
    },
    {
        "page_idx": 6, # Page 7
        "family_id": "types-ouvrages",
        "family_name": "Types d'ouvrages",
        "color": "#27AE60",
        "cards": [
            {"num": 1, "id": "types-barrage-remblai", "title": "Barrage en remblai"},
            {"num": 2, "id": "types-barrage-poids", "title": "Barrage poids"},
            {"num": 3, "id": "types-barrage-voute", "title": "Barrage voûte"},
            {"num": 4, "id": "types-canaux", "title": "Canaux"},
            {"num": 5, "id": "types-digue-protection", "title": "Digue de protection"},
            {"num": 6, "id": "types-step", "title": "Station de transfert d'énergie par pompage (STEP)"},
        ]
    },
    {
        "page_idx": 7, # Page 8
        "family_id": "dans-le-monde",
        "family_name": "Dans le monde",
        "color": "#16A085",
        "cards": [
            {"num": 1, "id": "monde-itaipu", "title": "Barrage d'Itaipu"},
            {"num": 2, "id": "monde-canal-suez", "title": "Canal de Suez"},
            {"num": 3, "id": "monde-grande-dixence", "title": "Barrage de la Grande-Dixence"},
            {"num": 4, "id": "monde-kariba", "title": "Barrage Kariba"},
            {"num": 5, "id": "monde-trois-gorges", "title": "Barrage des Trois-Gorges"},
            {"num": 6, "id": "monde-hoover-dam", "title": "Hoover Dam"},
        ]
    },
    {
        "page_idx": 8, # Page 9
        "family_id": "en-france",
        "family_name": "En France",
        "color": "#8E44AD",
        "cards": [
            {"num": 1, "id": "france-serre-poncon", "title": "Barrage de Serre-Ponçon"},
            {"num": 2, "id": "france-migouelou", "title": "Barrage de Migouélou"},
            {"num": 3, "id": "france-rance", "title": "Barrage de la Rance"},
            {"num": 4, "id": "france-canal-alsace", "title": "Grand Canal d'Alsace"},
            {"num": 5, "id": "france-levees-loire", "title": "Levées de la Loire"},
            {"num": 6, "id": "france-takamaka", "title": "Barrage de Takamaka"},
        ]
    },
    {
        "page_idx": 9, # Page 10
        "family_id": "dans-le-temps",
        "family_name": "Dans le temps",
        "color": "#D35400",
        "cards": [
            {"num": 1, "id": "temps-pont-du-gard", "title": "Pont du Gard"},
            {"num": 2, "id": "temps-canal-du-midi", "title": "Canal du Midi"},
            {"num": 3, "id": "temps-barrage-zola", "title": "Barrage Zola"},
            {"num": 4, "id": "temps-barrage-dardennes", "title": "Barrage de Dardennes"},
            {"num": 5, "id": "temps-barrage-rizzanese", "title": "Barrage du Rizzanese"},
            {"num": 6, "id": "temps-canal-seine-nord", "title": "Canal Seine Nord Europe"},
        ]
    },
]

# Les 6 positions sur chaque page (col: 0,1,2, row: 0,1)
x_coords = [343.75, 550.48, 757.20]
y_coords = [158.80, 442.23]
card_w = 179.05
card_h = 255.78

# Zoom factor pour une superbe définition WebP (3.5x donne ~630x895 px)
zoom = 4.0
mat = fitz.Matrix(zoom, zoom)

print("Extraction des 42 rectos...")
for fam in families_config:
    page = doc[fam["page_idx"]]
    card_idx = 0
    for row in range(2):
        for col in range(3):
            card_info = fam["cards"][card_idx]
            rect = fitz.Rect(
                x_coords[col],
                y_coords[row],
                x_coords[col] + card_w,
                y_coords[row] + card_h
            )
            pix = page.get_pixmap(matrix=mat, clip=rect)
            out_path = os.path.join(output_dir, f"{card_info['id']}.webp")
            
            # Sauvegarder via PIL pour WebP haute qualité
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            img.save(out_path, "WEBP", quality=92)
            print(f"Extrait: {out_path} ({pix.width}x{pix.height})")
            card_idx += 1

# Extraction du dos de carte (Page 13)
print("Extraction du dos de carte...")
p13 = doc[12]
back_rect = fitz.Rect(471.18, 195.90, 808.82, 676.10)
pix_back = p13.get_pixmap(matrix=mat, clip=back_rect)
back_out_path = os.path.join(output_dir, "card-back.webp")
img_back = Image.frombytes("RGB", [pix_back.width, pix_back.height], pix_back.samples)
img_back.save(back_out_path, "WEBP", quality=92)
print(f"Extrait dos: {back_out_path} ({pix_back.width}x{pix_back.height})")

print("Terminé avec succès !")
