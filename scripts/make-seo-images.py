"""Génère les icônes du site (192, 512, apple-touch) et les images de partage 1200x630 (Open Graph)
de l'accueil et des 42 cartes, dans public/icons et public/og.

Usage : python scripts/make-seo-images.py
"""
import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
BG = (247, 245, 240)
TEAL = (27, 93, 120)
FONT = str(ROOT / "public/fonts/Geist-Regular.ttf")
logo = Image.open(ROOT / "public/logos/cfbr-hd.png").convert("RGBA")


def paste_fit(base, img, box):
    img = img.copy()
    img.thumbnail((box[2] - box[0], box[3] - box[1]), Image.LANCZOS)
    x = box[0] + (box[2] - box[0] - img.width) // 2
    y = box[1] + (box[3] - box[1] - img.height) // 2
    base.paste(img, (x, y), img)


(ROOT / "public/icons").mkdir(exist_ok=True)
(ROOT / "public/og").mkdir(exist_ok=True)
(ROOT / "public/og/en").mkdir(exist_ok=True)
for size, name in [(192, "icon-192.png"), (512, "icon-512.png"), (180, "apple-touch-icon.png")]:
    bg = Image.new("RGB", (size, size), BG)
    m = int(size * 0.1)
    paste_fit(bg, logo, (m, m, size - m, size - m))
    bg.save(ROOT / "public/icons" / name, optimize=True)


def wrap(draw, text, font, width):
    lines, cur = [], ""
    for w in text.split():
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=font) <= width:
            cur = t
        else:
            lines.append(cur)
            cur = w
    lines.append(cur)
    return lines


def og(path, title, subtitle, color, card_img=None):
    im = Image.new("RGB", (1200, 630), BG)
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, 1200, 10], fill=TEAL)
    paste_fit(im, logo, (60, 50, 260, 170))
    tx = 60
    avail = 700 if card_img else 1080
    d.text((tx, 215), subtitle.upper(), font=ImageFont.truetype(FONT, 28), fill=color)
    f = ImageFont.truetype(FONT, 76)
    y = 265
    for line in wrap(d, title, f, avail)[:3]:
        d.text((tx, y), line, font=f, fill=(28, 25, 23))
        y += 92
    d.text((tx, 560), "7 Familles des Barrages · CFBR", font=ImageFont.truetype(FONT, 30), fill=TEAL)
    if card_img:
        c = Image.open(card_img).convert("RGBA")
        paste_fit(im, c, (830, 40, 1160, 590))
    im.save(path, quality=88, optimize=True)


src = (ROOT / "data/cards.ts").read_text(encoding="utf-8")
og(ROOT / "public/og/accueil.jpg", "7 Familles des Barrages", "Le jeu des 42 cartes · 1926–2026", TEAL)
n = 0
for m in re.finditer(r'id: "([a-z0-9-]+)",\n    familyId: "[^"]+",\n    familyName: "([^"]+)",\n    familyColor: "(#[0-9A-Fa-f]{6})",\n    familyIcon: "[^"]+",\n    num: (\d+),\n    title: "([^"]+)"', src):
    cid, fam, col, num, title = m.groups()
    color = tuple(int(col[i:i + 2], 16) for i in (1, 3, 5))
    og(ROOT / f"public/og/{cid}.jpg", title, f"{fam} · carte n°{num}", color, ROOT / f"public/cards/{cid}.webp")
    n += 1
print("images :", n, "cartes")

# Version anglaise : titres tirés de data/en
en = {}
for f in (ROOT / "data/en").glob("*.ts"):
    t = f.read_text(encoding="utf-8")
    for m in re.finditer(r'"([a-z0-9-]+)": \{\s*title: "([^"]+)"', t):
        en[m.group(1)] = m.group(2)
fam_en = {
    "Métiers": "Jobs",
    "Usages": "Uses",
    "Composants": "Components",
    "Types d'ouvrages": "Types of structures",
    "Dans le monde": "Around the world",
    "En France": "In France",
    "Dans le temps": "Through time",
}
(ROOT / "public/og/en").mkdir(exist_ok=True)
og(ROOT / "public/og/en/accueil.jpg", "The 7 Families of Dams", "The 42-card game · 1926–2026", TEAL)
for m in re.finditer(r'id: "([a-z0-9-]+)",\n    familyId: "[^"]+",\n    familyName: "([^"]+)",\n    familyColor: "(#[0-9A-Fa-f]{6})",\n    familyIcon: "[^"]+",\n    num: (\d+),\n    title: "([^"]+)"', src):
    cid, fam, col, num, title = m.groups()
    color = tuple(int(col[i:i + 2], 16) for i in (1, 3, 5))
    og(ROOT / f"public/og/en/{cid}.jpg", en.get(cid, title), f"{fam_en.get(fam, fam)} · card no. {num}", color, ROOT / f"public/cards/{cid}.webp")
print("images EN OK")
