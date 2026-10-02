"""Importe les images des cartes traduites en anglais à partir du PDF anglais (scripts/translate-pdf-en.py).

Usage : python scripts/import-card-images-en.py <PDF anglais>

- public/cards/en/<id>.webp          pleine résolution (coins arrondis transparents repris du français)
- public/cards/thumbs/en/<id>.webp   miniature de 360 px
- public/cards/print/en/<id>.jpg     JPEG léger pour le dossier imprimable
- public/cards/print/en/regles-*.jpg cartes de règles (pages 43 à 48)
"""
import json
import sys
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ids = [c["id"] for c in json.loads((ROOT / "data/backup/textes-v1-originaux.json").read_text(encoding="utf-8"))]
RULES = ["regles-inventaire", "regles-infos", "regles-jeu-1", "regles-jeu-2", "regles-cfbr", "regles-auteurs"]
doc = pymupdf.open(sys.argv[1])
for d in ("", "thumbs", "print"):
    (ROOT / "public/cards" / d / "en").mkdir(parents=True, exist_ok=True)


def render(i, size):
    pix = doc[i].get_pixmap(dpi=520, alpha=False)
    return Image.frombytes("RGB", (pix.width, pix.height), pix.samples).resize(size, Image.LANCZOS)


for i, cid in enumerate(ids):
    old = Image.open(ROOT / "public/cards" / f"{cid}.webp").convert("RGBA")
    new = render(i, old.size).convert("RGBA")
    new.putalpha(old.getchannel("A"))
    new.save(ROOT / "public/cards/en" / f"{cid}.webp", "WEBP", quality=92, method=6)
    new.resize((360, round(360 * new.height / new.width)), Image.LANCZOS).save(
        ROOT / "public/cards/thumbs/en" / f"{cid}.webp", "WEBP", quality=85, method=6)
    flat = Image.new("RGB", new.size, (255, 255, 255))
    flat.paste(new, mask=new.getchannel("A"))
    flat.resize((560, round(560 * new.height / new.width)), Image.LANCZOS).save(
        ROOT / "public/cards/print/en" / f"{cid}.jpg", "JPEG", quality=82, optimize=True)
    print("OK", cid)

for k, name in enumerate(RULES):
    img = render(42 + k, (560, 801))
    img.save(ROOT / "public/cards/print/en" / f"{name}.jpg", "JPEG", quality=82, optimize=True)
    print("OK", name)
