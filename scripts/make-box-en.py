"""Version anglaise des textures de la boîte de jeu (devant, arrière, dessus, dessous).

Source : public/box/*.webp (visuels FR extraits du gabarit d'impression CFBR-6oct.pdf, texte intégré à l'image).
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


def make_front():
    img = Image.open(os.path.join(ROOT, "front.webp")).convert("RGB")
    arr = np.array(img)
    # Bulle blanche (titre), ovale bleu marine (accroche), pastille blanche (joueurs / durée)
    erase_text_in_blob(arr, (300, 140), True, WHITE, roi=(90, 150, 590, 480))
    erase_text_in_blob(arr, (560, 540), False, (45, 49, 113), roi=(520, 480, 1000, 700))
    erase_text_in_blob(arr, (400, 1345), True, WHITE, roi=(165, 1345, 440, 1455))
    img = Image.fromarray(arr).convert("RGB")
    rotated_block(img, ["THE CFBR", "7 FAMILIES", "GAME"], (318, 312), 10, 88, NAVY, 90, 2)
    rotated_block(img, ["A GAME ABOUT THE", "WORLD OF DAMS & OTHER", "HYDRAULIC STRUCTURES"], (750, 570), -9, 40, WHITE, 52, 1)
    d = ImageDraw.Draw(img)
    put_lines(d, ["2 to 4 players", "15 to 20 min."], 0, 1375, 46, (31, 69, 123), 58, 1, align="left", x_left=172)
    return img


def make_back():
    img = Image.open(os.path.join(ROOT, "back.webp")).convert("RGB")
    d = ImageDraw.Draw(img)
    # Panneau blanc : tout le texte est effacé (le gâteau « 100 » est conservé)
    d.rectangle((100, 105, 990, 232), fill=WHITE)
    d.rectangle((268, 250, 990, 392), fill=WHITE)
    d.rectangle((100, 408, 990, 862), fill=WHITE)
    # Pastilles : texte effacé à droite des pictos
    pills = [(1002, 237), (1130, 237), (1257, 237), (1384, 237), (1002, 760), (1130, 760), (1257, 760)]
    arr = np.array(img)
    rights = []
    for y, x0 in pills:
        x = x0
        while arr[y + 28, x].min() > 235 and x < 1070:
            x += 1
        rights.append(x - 3)
    for (y, x0), r in zip(pills, rights):
        d.rectangle((x0 - 6, y - 27, r, y + 27), fill=WHITE)
    # Textes
    f = font(100)
    title = "THE CFBR 7 FAMILIES GAME"
    size = fit_size(d, [title], 830, 100, 2)
    d.text((543, 170), title, font=font(size), fill=NAVY, anchor="mm", stroke_width=2, stroke_fill=NAVY)
    put_lines(d, ["Discover dams and other", "hydraulic structures!"], 0, 288, 58, BLUE, 68, 1, align="left", x_left=275)
    p1 = "To mark its 100th anniversary, the French Committee on Large Dams invites you to explore the world of dams and other hydraulic structures through this game of 7 families."
    p2 = "Discover how they are used, part of their history, and the women and men who design them, in France and around the world!"
    for text, y0 in ((p1, 450), (p2, 705)):
        size = 50
        while True:
            lines = wrap(d, text, font(size), 840)
            if len(lines) <= (4 if text is p1 else 3) or size < 30:
                break
            size -= 1
        put_lines(d, lines, 543, y0, size, NAVY, 55, 1)
    labels = ["AROUND THE WORLD", "THROUGH TIME", "COMPONENTS", "TYPES OF STRUCTURES", "IN FRANCE", "JOBS", "USES"]
    for (y, x0), r, label in zip(pills, rights, labels):
        size = fit_size(d, [label], r - x0 - 8, 52, 1)
        d.text((x0, y), label, font=font(size), fill=NAVY, anchor="lm", stroke_width=1, stroke_fill=NAVY)
    return img


def make_top():
    img = Image.open(os.path.join(ROOT, "top.webp")).convert("RGB")
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, img.width, img.height), fill=BLUE)
    lines = ["THE FRENCH COMMITTEE", "ON LARGE DAMS"]
    size = fit_size(d, lines, 720, 92, 1)
    put_lines(d, lines, img.width / 2, img.height / 2 - 36, size, WHITE, 82, 1)
    return img


def make_bottom():
    img = Image.open(os.path.join(ROOT, "bottom.webp")).convert("RGB")
    d = ImageDraw.Draw(img)
    d.rectangle((560, 40, img.width, img.height - 40), fill=BLUE)
    lines = ["AUTHORS: CODOR of the CFBR,", "Franck Sfiligoï Taillandier", "ILLUSTRATIONS & GRAPHIC DESIGN:", "Hello bim bam boum"]
    size = fit_size(d, lines, 420, 46, 1)
    ys = [100, 143, 202, 245]
    f = font(size)
    for t, y in zip(lines, ys):
        d.text((625, y), t, font=f, fill=WHITE, anchor="lm", stroke_width=1, stroke_fill=WHITE)
    return img


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for name, fn in (("front", make_front), ("back", make_back), ("top", make_top), ("bottom", make_bottom)):
        fn().save(os.path.join(OUT, f"{name}.webp"), quality=82, method=6)
        print(name)
