"""Importe les images des cartes traduites en anglais, à partir du PDF d'imprimerie (recto/verso, 70x100 mm avec fonds perdus).

Étapes (le PDF d'imprimerie est d'abord recadré sur la TrimBox, ce qui redonne le format 198,4 x 283,5 pt attendu par
scripts/translate-pdf-en.py) :
    python scripts/import-card-images-en.py <PDF imprimeur> [largeur px, 800 par défaut]

- public/cards/en/<id>.webp          pleine résolution (coins arrondis transparents repris du français)
- public/cards/thumbs/en/<id>.webp   miniature de 360 px
- public/cards/print/en/<id>.jpg     JPEG léger pour le dossier imprimable
Les cartes de règles anglaises (public/cards/print/en/regles-*.jpg) ne sont pas régénérées ici.
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ids = [c["id"] for c in json.loads((ROOT / "data/backup/textes-v1-originaux.json").read_text(encoding="utf-8"))]
W = int(sys.argv[2]) if len(sys.argv) > 2 else 800
for d in ("", "thumbs", "print"):
    (ROOT / "public/cards" / d / "en").mkdir(parents=True, exist_ok=True)

tmp = Path(tempfile.mkdtemp())
src = pymupdf.open(sys.argv[1])
src.select(list(range(0, 2 * len(ids), 2)))  # recto des 42 cartes
for p in src:
    p.set_cropbox(p.trimbox)
src.save(tmp / "fr-trim.pdf", garbage=3, deflate=True)
subprocess.run([sys.executable, "-I", str(ROOT / "scripts/translate-pdf-en.py"), str(tmp / "fr-trim.pdf"), str(tmp / "en-trim.pdf")],
               check=True, env={**__import__("os").environ, "PYTHONIOENCODING": "utf-8"})
doc = pymupdf.open(tmp / "en-trim.pdf")

for i, cid in enumerate(ids):
    mask = Image.open(ROOT / "public/cards" / f"{cid}.webp").convert("RGBA")
    zoom = W / doc[i].rect.width
    pix = doc[i].get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
    new = Image.frombytes("RGB", (pix.width, pix.height), pix.samples).convert("RGBA")
    new.putalpha(mask.getchannel("A").resize(new.size, Image.LANCZOS))
    new.save(ROOT / "public/cards/en" / f"{cid}.webp", "WEBP", quality=80, method=6)
    new.resize((360, round(360 * new.height / new.width)), Image.LANCZOS).save(
        ROOT / "public/cards/thumbs/en" / f"{cid}.webp", "WEBP", quality=85, method=6)
    flat = Image.new("RGB", new.size, (255, 255, 255))
    flat.paste(new, mask=new.getchannel("A"))
    flat.resize((560, round(560 * new.height / new.width)), Image.LANCZOS).save(
        ROOT / "public/cards/print/en" / f"{cid}.jpg", "JPEG", quality=82, optimize=True)
    print("OK", cid, new.size, flush=True)
