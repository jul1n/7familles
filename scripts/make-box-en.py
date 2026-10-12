"""Version anglaise des textures de la boîte de jeu (devant, arrière, dessus, dessous).

Source : public/box/*.webp (visuels FR extraits du gabarit d'impression de la boîte, texte intégré à l'image).
Sortie : public/box/en/{front,back,top,bottom}.webp. Les tranches (sans texte) restent celles de public/box/.
Le texte français est effacé (aplats blancs / bleu marine / bleu clair), puis le texte anglais est dessiné avec
Franklin Gothic Medium Condensed (substitut de la police d'origine, comme pour l'EN du PDF imprimé).
Usage : python scripts/make-box-en.py
"""
import math
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage as ndi

ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "box")
OUT = os.path.join(ROOT, "en")
FONT = "C:/Windows/Fonts/FRAMDCN.TTF"
NAVY = (31, 43, 107)
BLUE = (62, 169, 225)
BG = (64, 204, 254)
ROYAL = (1, 23, 168)  # bleu du titre et de l'ovale de la face avant
WHITE = (255, 255, 255)


def font(size):
    return ImageFont.truetype(FONT, int(size))


def text_w(draw, text, f, stroke=0):
    return draw.textlength(text, font=f) + 2 * stroke


def fit_size(draw, lines, max_w, max_size, stroke=0):
    size = max_size
    while size > 10:
        f = font(size)
        if max(text_w(draw, t, f, stroke) for t in lines) <= max_w:
            return size
        size -= 1
    return size


def wrap(draw, text, f, width):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if cur and draw.textlength(t, font=f) > width:
            lines.append(cur)
            cur = w
        else:
            cur = t
    lines.append(cur)
    return lines


def put_lines(draw, lines, cx, y0, size, color, line_h, stroke=0, align="center", x_left=None):
    f = font(size)
    for i, t in enumerate(lines):
        y = y0 + i * line_h
        if align == "center":
            draw.text((cx, y), t, font=f, fill=color, anchor="mm", stroke_width=stroke, stroke_fill=color)
        else:
            draw.text((x_left, y), t, font=f, fill=color, anchor="lm", stroke_width=stroke, stroke_fill=color)


def rotated_block(img, lines, center, angle, size, color, line_h, stroke=1):
    """Dessine un bloc de lignes centrées, puis le fait pivoter (angle en degrés, sens trigonométrique)."""
    w, h = 900, 500
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    top = h / 2 - (len(lines) - 1) * line_h / 2
    put_lines(d, lines, w / 2, top, size, color + (255,), line_h, stroke)
    layer = layer.rotate(angle, resample=Image.BICUBIC, center=(w / 2, h / 2))
    img.alpha_composite(layer, (int(center[0] - w / 2), int(center[1] - h / 2))) if img.mode == "RGBA" else img.paste(
        layer, (int(center[0] - w / 2), int(center[1] - h / 2)), layer
    )


def erase_text_in_blob(arr, seed, text_is_dark, fill, roi=None, grow=3):
    """Efface le texte d'un aplat : composante de couleur `fill` contenant `seed`, trous comblés
    (le texte y fait des trous), puis les pixels différents de l'aplat dans cette forme sont repeints."""
    near = np.all(np.abs(arr.astype(int) - np.array(fill)) < 28, axis=2)
    lab, _ = ndi.label(near)
    comp = lab == lab[seed[1], seed[0]]
    filled = ndi.binary_fill_holes(comp)
    text = filled & ~comp
    if roi:
        x0, y0, x1, y1 = roi
        keep = np.zeros_like(text)
        keep[y0:y1, x0:x1] = True
        text &= keep
    text = ndi.binary_dilation(text, iterations=grow)
    text &= ndi.binary_dilation(filled, iterations=grow) if False else filled
    arr[text] = fill


def nearest(arr, color, guess, tol=28):
    """Pixel de couleur `color` le plus proche de `guess` (x, y) : amorce pour erase_text_in_blob."""
    near = np.all(np.abs(arr.astype(int) - np.array(color)) < tol, axis=2)
    ys, xs = np.nonzero(near)
    i = np.argmin((xs - guess[0]) ** 2 + (ys - guess[1]) ** 2)
    return int(xs[i]), int(ys[i])


def make_front():
    img = Image.open(os.path.join(ROOT, "front.webp")).convert("RGB")
    arr = np.array(img)
    # Bulle blanche (titre) et ovale bleu marine (accroche)
    erase_text_in_blob(arr, nearest(arr, WHITE, (70, 250)), True, WHITE, roi=(40, 60, 340, 300))
    erase_text_in_blob(arr, nearest(arr, ROYAL, (470, 395), 40), False, ROYAL, roi=(310, 240, 620, 410))
    img = Image.fromarray(arr).convert("RGB")
    rotated_block(img, ["THE CFBR", "HAPPY FAMILIES", "GAME"], (172, 172), 10, 40, ROYAL, 50, 1)
    rotated_block(img, ["A GAME ABOUT THE", "WORLD OF DAMS & OTHER", "HYDRAULIC STRUCTURES"], (462, 324), -9, 24, WHITE, 31, 1)
    return img


# Pastilles de la zone bleue : x de début du texte, x de fin de la pastille, y du centre, libellé
PILLS = [
    (150, 312, 594, "AROUND THE WORLD"),
    (150, 307, 668, "THROUGH TIME"),
    (150, 288, 743, "COMPONENTS"),
    (150, 342, 818, "TYPES OF STRUCTURES"),
    (446, 563, 594, "IN FRANCE"),
    (446, 538, 668, "JOBS"),
    (446, 534, 743, "USES"),
]

PILL_TEXT = (62, 169, 225)
PANEL_WHITE = WHITE


def make_back():
    img = Image.open(os.path.join(ROOT, "back.webp")).convert("RGB")
    arr = np.array(img)
    # Pastille « joueurs » (la durée ne change pas) et pastilles de la zone bleue : le texte fait des trous dans
    # l'aplat blanc, repeints ; le picto (x < début du texte) est exclu de la zone
    arr[38:69, 88:214] = WHITE
    for x0, right, y, _ in PILLS:
        erase_text_in_blob(arr, nearest(arr, WHITE, (x0 + 4, y + 18)), True, WHITE, roi=(x0 - 2, y - 26, right, y + 26))
    img = Image.fromarray(arr).convert("RGB")
    d = ImageDraw.Draw(img)
    size = fit_size(d, ["2 - 4 players"], 116, 30)
    d.text((90, 53), "2 - 4 players", font=font(size), fill=PILL_TEXT, anchor="lm")
    # Panneau blanc : texte effacé (le gâteau « 100 » est conservé)
    d.rectangle((175, 128, 600, 225), fill=WHITE)
    d.rectangle((52, 240, 600, 378), fill=WHITE)
    d.rectangle((52, 398, 600, 505), fill=WHITE)
    put_lines(d, ["Discover dams and other", "hydraulic structures!"], 0, 155, 34, BLUE, 40, 0, align="left", x_left=188)
    p1 = "To mark its 100th anniversary, the French Committee on Large Dams invites you to explore the world of dams and other hydraulic structures through this game of 7 families."
    p2 = "Discover how they are used, part of their history, and the women and men who design them, in France and around the world!"
    for text, y0, n in ((p1, 259, 4), (p2, 417, 3)):
        size = 30
        while True:
            lines = wrap(d, text, font(size), 535)
            if len(lines) <= n or size < 16:
                break
            size -= 1
        put_lines(d, lines, 326, y0, size, NAVY, int(size * 1.22), 0)
    # Pastilles : textes anglais
    for x0, right, y, label in PILLS:
        r = right - 14
        size = fit_size(d, [label], r - x0 - 4, 30, 1)
        d.text((x0, y), label, font=font(size), fill=NAVY, anchor="lm")
    return img


def make_top():
    img = Image.open(os.path.join(ROOT, "top.webp")).convert("RGB")
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, img.width, img.height), fill=BG)
    lines = ["THE FRENCH COMMITTEE", "ON LARGE DAMS"]
    size = fit_size(d, lines, 400, 52, 1)
    put_lines(d, lines, img.width / 2, img.height / 2 - 20, size, WHITE, 44, 1)
    return img


def make_bottom():
    img = Image.open(os.path.join(ROOT, "bottom.webp")).convert("RGB")
    d = ImageDraw.Draw(img)
    d.rectangle((270, 8, 490, img.height - 8), fill=BG)
    lines = ["AUTHORS: CODOR of the CFBR,", "Franck Sfiligoï Taillandier", "ILLUSTRATION & GRAPHIC DESIGN:", "Hello bim bam boum", "(Marine Monseux, Coline Mestas)"]
    size = fit_size(d, lines, 205, 24, 1)
    f = font(size)
    for t, y in zip(lines, [31, 50, 69, 88, 107]):
        d.text((283, y), t, font=f, fill=WHITE, anchor="lm", stroke_width=0)
    return img


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for name, fn in (("front", make_front), ("back", make_back), ("top", make_top), ("bottom", make_bottom)):
        fn().save(os.path.join(OUT, f"{name}.webp"), quality=82, method=6)
        print(name)
