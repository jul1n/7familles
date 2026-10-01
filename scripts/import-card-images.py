"""Remplace les images des 42 cartes à partir du PDF final des cartes (une carte par page, dans l'ordre des familles).

Usage : python scripts/import-card-images.py <chemin du PDF>

Pour chaque carte :
- public/cards/<id>.webp        image pleine résolution (même taille que l'ancienne, coins arrondis transparents conservés)
- public/cards/thumbs/<id>.webp miniature de 360 px
- public/cards/print/<id>.jpg   version JPEG légère pour le dossier imprimable
Les anciennes images pleine résolution sont sauvegardées dans data/backup/cards-v1/.
"""
import json
import sys
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ids = [c["id"] for c in json.loads((ROOT / "data/backup/textes-v1-originaux.json").read_text(encoding="utf-8"))]
doc = pymupdf.open(sys.argv[1])
assert len(doc) >= len(ids), "le PDF ne contient pas assez de pages"

for i, cid in enumerate(ids):
    target = ROOT / "public/cards" / f"{cid}.webp"
    old = Image.open(target).convert("RGBA")  # sert de modèle : taille et masque des coins arrondis
    pix = doc[i].get_pixmap(dpi=520, alpha=False)
    page = Image.frombytes("RGB", (pix.width, pix.height), pix.samples).resize(old.size, Image.LANCZOS)
    new = page.convert("RGBA")
    new.putalpha(old.getchannel("A"))
    new.save(target, "WEBP", quality=92, method=6)

    thumb = new.resize((360, round(360 * new.height / new.width)), Image.LANCZOS)
    thumb.save(ROOT / "public/cards/thumbs" / f"{cid}.webp", "WEBP", quality=85, method=6)

    flat = Image.new("RGB", new.size, (255, 255, 255))
    flat.paste(new, mask=new.getchannel("A"))
    flat.resize((560, round(560 * new.height / new.width)), Image.LANCZOS).save(
        ROOT / "public/cards/print" / f"{cid}.jpg", "JPEG", quality=82, optimize=True
    )
    print("OK", cid)
