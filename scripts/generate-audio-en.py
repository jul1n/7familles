"""Génère la lecture audio anglaise (MP3) de chaque carte avec une voix neuronale d'Edge (edge-tts).

Usage :  python scripts/generate-audio-en.py [--voice NOM] [--force]

- Les fichiers sont écrits dans public/audio/en/<id-de-la-carte>.mp3
- data/audio-manifest-en.json garde l'empreinte du texte lu : seules les cartes modifiées sont régénérées.
- Le site anglais lit ces fichiers s'ils existent, sinon il retombe sur la voix du navigateur.
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
AUDIO_DIR = ROOT / "public" / "audio" / "en"
MANIFEST = ROOT / "data" / "audio-manifest-en.json"
DEFAULT_VOICE = "en-US-AvaMultilingualNeural"

# Prononciation : sigles épelés et noms propres que la synthèse lit mal.
PRONUNCIATION = [
    (r"\bEDF\b", "E D F"),
    (r"\bCFBR\b", "C F B R"),
    (r"\bICOLD\b", "I COLD"),
    (r"\bBCR\b", "B C R"),
    (r"\bRCC\b", "R C C"),
    (r"\bGPS\b", "G P S"),
    (r"\bPPI\b", "P P I"),
    (r"\bUNESCO\b", "Unesco"),
    (r"\bNASA\b", "Nasa"),
    (r"\bPSH\b", "pumped storage"),
    (r"\bExplore2\b", "Explore two"),
    (r"\bTakamaka II\b", "Takamaka two"),
    (r"\bTakamaka I\b", "Takamaka one"),
    (r"\bKembs\b", "Kemps"),
    (r"\bFessenheim\b", "Fessenhame"),
    (r"\bOttmarsheim\b", "Ottmarsame"),
    (r"\bVogelgrun\b", "Vogelgroon"),
    (r"\bMigouélou\b", "Mi-goo-ay-loo"),
    (r"\bRizzanese\b", "Rit-sa-nez"),
    (r"\bSerre-Ponçon\b", "Sair Pon-son"),
    (r"\bItaipu\b", "Eye-tie-poo"),
    (r"\bParaná\b", "Para-na"),
    (r"\bIguazu\b", "Ig-wa-soo"),
    (r"\bRance\b", "Rahnss"),
    (r"\bGolfech\b", "Gol-fesh"),
    (r"\bLesseps\b", "Le-seps"),
    (r"\bRiquet\b", "Ree-kay"),
    (r"\bUbaye\b", "Oo-bye"),
    (r"\bAix\b", "Ex"),
    (r"\bGaronne\b", "Ga-ron"),
    (r"\bDurance\b", "Dew-rahnss"),
    (r"\bVerdon\b", "Vair-don"),
    (r"\bNîmes\b", "Neem"),
    (r"\bUzès\b", "Oo-zez"),
    (r"\bGardon\b", "Gar-don"),
    (r"\bCévennes\b", "Say-ven"),
    (r"\bNyaminyami\b", "Nya-minya-mi"),
    (r"\bZambezi\b", "Zam-bee-zee"),
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
            ["node", "scripts/export-texts-en.mjs"], cwd=ROOT, check=True, capture_output=True, encoding="utf-8"
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
                print(f"  retry ({exc})")
                await asyncio.sleep(2)
        manifest[card["id"]] = {"hash": digest, "voice": args.voice}
        MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
        done += 1
        print(f"OK {card['id']} ({target.stat().st_size // 1024} KB)")

    print(f"Done: {done} generated, {skipped} unchanged.")


if __name__ == "__main__":
    asyncio.run(main())
