"""Importe la version HD des cartes à partir du PDF d'imprimerie (46 cartes recto/verso, 70x100 mm avec fonds perdus).

Usage : python scripts/import-card-images-hd.py <PDF imprimeur> [dossier de sortie] [largeur px]

- Recto de la carte i = page 2*i (dans l'ordre de data/backup/textes-v1-originaux.json), verso = page 1.
- Rendu recadré sur la TrimBox (format 70x100 mm exact, sans fonds perdus ni traits de coupe).
- Les coins arrondis transparents sont repris des images actuelles (masque alpha agrandi).
- Sortie par défaut : public/cards/<id>.webp (FR). Miniatures (360 px) et JPEG du dossier imprimable régénérés aussi.
"""
import json
import sys
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ids = [c["id"] for c in json.loads((ROOT / "data/backup/textes-v1-originaux.json").read_text(encoding="utf-8"))]
doc = pymupdf.open(sys.argv[1])
out = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "public/cards"
W = int(sys.argv[3]) if len(sys.argv) > 3 else 1200
QUALITY = 80
(out / "thumbs").mkdir(parents=True, exist_ok=True)
(out / "print").mkdir(parents=True, exist_ok=True)


def render(page_no):
    page = doc[page_no]
    trim = page.trimbox
    zoom = W / trim.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), clip=trim, alpha=False)
    return Image.frombytes("RGB", (pix.width, pix.height), pix.samples)


def finish(img, mask_src, name):
    rgba = img.convert("RGBA")
    rgba.putalpha(mask_src.getchannel("A").resize(img.size, Image.LANCZOS))
    rgba.save(out / f"{name}.webp", "WEBP", quality=QUALITY, method=6)
    rgba.resize((360, round(360 * rgba.height / rgba.width)), Image.LANCZOS).save(
        out / "thumbs" / f"{name}.webp", "WEBP", quality=85, method=6)
    return rgba


for i, cid in enumerate(ids):
    mask = Image.open(ROOT / "public/cards" / f"{cid}.webp").convert("RGBA")
    rgba = finish(render(2 * i), mask, cid)
    flat = Image.new("RGB", rgba.size, (255, 255, 255))
    flat.paste(rgba, mask=rgba.getchannel("A"))
    flat.resize((560, round(560 * rgba.height / rgba.width)), Image.LANCZOS).save(
        out / "print" / f"{cid}.jpg", "JPEG", quality=82, optimize=True)
    print("OK", cid, rgba.size)

back_mask = Image.open(ROOT / "public/cards/card-back.webp").convert("RGBA")
finish(render(1), back_mask, "card-back")
print("OK card-back")
