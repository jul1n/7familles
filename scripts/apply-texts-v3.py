"""Applique les corrections de la relecture (v3) aux textes des cartes dans data/cards.ts.

Usage : python scripts/apply-texts-v3.py <dossier contenant kids1-3.py et patch1-3.py>
Chaque correction vérifie que le texte à remplacer existe bien (sinon le script s'arrête).
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src_dir = Path(sys.argv[1])

K = {}
P = {}
for n in (1, 2, 3):
    ns = {}
    exec((src_dir / f"kids{n}.py").read_text(encoding="utf-8"), ns)
    K.update(ns["K"])
    ns = {}
    exec((src_dir / f"patch{n}.py").read_text(encoding="utf-8"), ns)
    P.update(ns["P"])

ids = [c["id"] for c in json.loads((ROOT / "data/backup/textes-v1-originaux.json").read_text(encoding="utf-8"))]
missing = [i for i in ids if i not in P]
assert not missing, f"cartes sans correction : {missing}"

result = {}
for cid in ids:
    short, md = K[cid]
    patch = P[cid]
    short = patch.get("short", short)
    for old, new in patch["rep"]:
        assert old in md, f"{cid} : texte introuvable -> {old[:70]!r}"
        md = md.replace(old, new, 1)
    md = md.rstrip() + "\n\n### Pour aller plus loin\n" + patch["more"].strip()
    result[cid] = (short, md)

(ROOT / "data/backup/textes-v3-corriges.json").write_text(
    json.dumps([{"id": i, "shortDescription": result[i][0], "contentMarkdown": result[i][1]} for i in ids], ensure_ascii=False, indent=2),
    encoding="utf-8",
)

s = (ROOT / "data/cards.ts").read_text(encoding="utf-8")
for cid in ids:
    short, md = result[cid]
    assert "`" not in md and "${" not in md
    p = s.index(f'id: "{cid}"')
    a = s.index("    shortDescription:", p)
    b = s.index("\n", a)
    s = s[:a] + "    shortDescription: " + json.dumps(short, ensure_ascii=False) + "," + s[b:]
    a = s.index("    contentMarkdown: `", p)
    e = s.index("`,\n", a) + 3
    s = s[:a] + "    contentMarkdown: `" + md + "`,\n" + s[e:]
(ROOT / "data/cards.ts").write_text(s, encoding="utf-8")
print("OK :", len(ids), "cartes mises à jour")
