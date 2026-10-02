"""Génère la lecture audio (MP3) de chaque carte avec les voix neuronales d'Edge (edge-tts).

Usage :  pip install edge-tts   puis   python scripts/generate-audio.py [--voice NOM] [--force]

- Les fichiers sont écrits dans public/audio/<id-de-la-carte>.mp3
- data/audio-manifest.json garde l'empreinte du texte lu : seules les cartes modifiées sont régénérées.
- Le site lit ces fichiers s'ils existent, sinon il retombe sur la voix du navigateur.
"""
import argparse
import asyncio
import hashlib
import json
import re
import subprocess
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
AUDIO_DIR = ROOT / "public" / "audio"
MANIFEST = ROOT / "data" / "audio-manifest.json"
DEFAULT_VOICE = "fr-FR-VivienneMultilingualNeural"

# Prononciation : sigles épelés, noms propres et mots que la synthèse lit mal.
# (Les unités, nombres et chiffres romains sont traités dans lib/speech.ts.)
PRONUNCIATION = [
    # sigles
    (r"\bEDF\b", "E D F"),
    (r"\bCFBR\b", "C F B R"),
    (r"\bCIGB\b", "C I G B"),
    (r"\bICOLD\b", "I COLD"),
    (r"\bBCR\b", "B C R"),
    (r"\bGPS\b", "G P S"),
    (r"\bPPI\b", "P P I"),
    (r"\bSTEP\b", "step"),
    (r"\bGEMAPI\b", "Jémapi"),
    (r"\bUNESCO\b", "Unesco"),
    (r"\bNASA\b", "Nasa"),
    (r"\bJAMAIS\b", "jamais"),
    # numéros (Takamaka I et II)
    (r"Takamaka II\b", "Takamaka deux"),
    (r"Takamaka I\b", "Takamaka un"),
    # mots piégeux
    (r"\bles fils\b", "les fil"),  # « fils » au sens de fils électriques
    # noms de lieux et de personnes
    (r"\bKembs\b", "Kemps"),
    (r"\bFessenheim\b", "Fessenème"),
    (r"\bOttmarsheim\b", "Ottmarsème"),
    (r"\bVogelgrun\b", "Vogelgrune"),
    # Pas de groupe de deux mots étrangers isolé (la voix multilingue hésite sur la langue) :
    # « Hoover Dam » est lu comme une expression française, « barrage Hoover ».
    (r"\bHoover Dam\b", "barrage Hoover"),
    (r"\bExplore2\b", "Explore deux"),
    (r"\bIguaçu\b", "Igoua-ssou"),
    (r"\bHoover\b", "Houvère"),
    (r"\bMead\b", "Mide"),
    (r"\bEver Given\b", "Évère Guivène"),
    (r"\bItaipu\b", "Itaï-pou"),
    (r"\bParaná\b", "Para-na"),
    (r"\bMaracanã\b", "Maracana"),
    (r"\bNyaminyami\b", "Nia-mi-nia-mi"),
    (r"\bZimbabwe\b", "Zim-bab-wé"),
    (r"\bChongqing\b", "Tchong-tching"),
    (r"\bYangtsé\b", "Yang-tsé"),
    (r"\bZermatt\b", "Zer-matte"),
    (r"\bBieudron\b", "Bieu-dron"),
    (r"\bRagas\b", "Ra-gasse"),
    (r"\bFoux\b", "Fou"),
    (r"\ble Las\b(?! Vegas)", "le Lasse"),
    (r"\bRizzanese\b", "Ritsa-nèze"),
    (r"\bMigouélou\b", "Mi-gou-é-lou"),
    (r"\bGolfech\b", "Golfèche"),
    (r"\bLesseps\b", "Lessepse"),
    (r"\bRiquet\b", "Riqué"),
    (r"\bUbaye\b", "Ubaille"),
    (r"\bEscaut\b", "Esco"),
    (r"\bAix\b", "Èx"),
]


def spoken(text: str) -> str:
    for pattern, repl in PRONUNCIATION:
        text = re.sub(pattern, repl, text)
    return text


async def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--voice", default=DEFAULT_VOICE)
    parser.add_argument("--force", action="store_true", help="régénérer toutes les cartes")
    args = parser.parse_args()

    cards = json.loads(
        subprocess.run(
            ["node", "scripts/export-texts.mjs"], cwd=ROOT, check=True, capture_output=True, encoding="utf-8"
        ).stdout
    )
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {}

    done = skipped = 0
    for card in cards:
        text = spoken(card["text"])
        digest = hashlib.sha256((args.voice + "\n" + text).encode("utf-8")).hexdigest()[:16]
        target = AUDIO_DIR / f"{card['id']}.mp3"
        if not args.force and target.exists() and manifest.get(card["id"], {}).get("hash") == digest:
            skipped += 1
            continue
        for attempt in range(3):
            try:
                await edge_tts.Communicate(text, args.voice, rate="-3%").save(str(target))
                break
            except Exception as exc:  # réseau : on réessaie
                if attempt == 2:
                    raise
                print(f"  nouvel essai ({exc})")
                await asyncio.sleep(2)
        manifest[card["id"]] = {"hash": digest, "voice": args.voice}
        MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
        done += 1
        print(f"OK {card['id']} ({target.stat().st_size // 1024} Ko)")

    print(f"Terminé : {done} généré(s), {skipped} inchangé(s).")


if __name__ == "__main__":
    asyncio.run(main())
