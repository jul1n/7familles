# 7 Familles des Barrages

Jeu de 7 familles du Comité Français des Barrages et Réservoirs (CFBR, 1926–2026) en version web : 42 cartes illustrées, fiches pédagogiques, narration audio, recherche, quiz, version imprimable. Site en français et en anglais (`/en/`), installable sur mobile et utilisable hors ligne.

Next.js 16 (export statique), React 19, Tailwind 4, three.js (carrousel 3D). Aucune base de données ni API : tout est généré à la construction.

## Commandes

```bash
pnpm install            # dépendances (Node 22 ou plus)
pnpm dev                # serveur de développement (avec l'éditeur Markdown des fiches)
pnpm build              # export statique dans out/
pnpm typecheck          # tsc --noEmit
pnpm lint               # ESLint
pnpm test               # tests (recherche, quiz, contenus) avec Vitest
```

Variables d'environnement (toutes facultatives) :

| Variable | Rôle | Valeur actuelle |
|---|---|---|
| `NEXT_PUBLIC_BASE_PATH` | Sous-dossier de publication | `/7familles` (GitHub Pages), vide ailleurs |
| `NEXT_PUBLIC_SITE_ORIGIN` | Adresse publique (canonical, sitemap, partage) | `https://jul1n.github.io` |
| `NEXT_PUBLIC_GOATCOUNTER_CODE` | Compteur de visites sans cookie (`off` pour le désactiver) | `cfbr` |

## Organisation

| Dossier | Contenu |
|---|---|
| `app/(fr)`, `app/en` | Pages françaises et anglaises (accueil, cartes, familles, règles), manifeste, sitemap, robots |
| `components/` | Interface : `Experience7Familles` (accueil), `Unified3DScene` (3D), `MosaicView`, fenêtres (`QuizDialog`, `SearchDialog`, `HelpDialog`), pages de lecture, impression |
| `data/cards.ts`, `data/en/` | Textes des 42 cartes (français, anglais) |
| `data/quiz.ts` | 84 questions du quiz (2 par carte, FR et EN) |
| `lib/` | Contenus, textes d'interface (`ui.ts`), SEO, recherche, liens, outils |
| `public/` | Images des cartes, audio, icônes, `sw.js` (service worker), `precache.json` |
| `scripts/` | Outils de production (audio, images, PDF anglais, export Markdown, contrôle du quiz) |
| `tests/` | Tests unitaires |
| `docs/` | Documentation (migration vers le site du CFBR) |

## Mettre à jour les contenus

- **Textes des cartes** : `data/cards.ts` (FR, généré par `scripts/apply-texts-v4.py`) et `data/en/*.ts` (EN). Après modification, regénérer l'audio :
  `python scripts/generate-audio.py` (FR) et `python scripts/generate-audio-en.py` (EN) — seules les cartes dont le texte a changé sont refaites.
- **Quiz** : `data/quiz.ts` ; vérifier avec `node scripts/check-quiz.mjs` et `pnpm test`.
- **Export Markdown pour relecture** : `node scripts/export-markdown.mjs` → `exports/7familles-FR.md` et `-EN.md`.
- **Images des cartes anglaises** : `python scripts/translate-pdf-en.py <PDF français> <PDF anglais>` puis `python scripts/import-card-images-en.py <PDF anglais>`.
- **Images de partage et icônes** : `python scripts/make-seo-images.py`.
- **Liste du préchargement hors ligne** : `node scripts/make-precache.mjs` (après ajout ou retrait de miniatures).
- **Retirer le quiz** : mettre `QUIZ_ENABLED = false` dans `lib/site.ts`.

## Hors ligne et installation

`public/sw.js` précharge les pages d'accueil et de règles (FR et EN), le code de l'application et les miniatures, puis met en cache les images pleine taille et l'audio à l'usage (plafond de 450 entrées). Après un changement de la logique du service worker, incrémenter `VERSION` en tête du fichier.

## Déploiement

- **Actuel** : GitHub Pages, via `.github/workflows/pages.yml` à chaque envoi sur `main` (contrôles de types, lint et tests, puis construction et publication). Dependabot propose chaque semaine les mises à jour de dépendances et d'actions.
- **Cible** : hébergement sur le site du CFBR. Voir [docs/MIGRATION-CFBR.md](docs/MIGRATION-CFBR.md).

## Qualité

Audit du 6 octobre 2026 : sécurité, SEO, accessibilité, rapidité, mobile. Le rapport complet et son plan d'action sont dans `exports/AUDIT-2026-10-06.md`.
