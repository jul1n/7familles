# Migration vers le site du CFBR

Le jeu est aujourd'hui publié sur GitHub Pages (`https://jul1n.github.io/7familles/`). Il doit être installé à terme sur le site du CFBR (`https://www.barrages-cfbr.eu/`). Le site est un export statique : il suffit de déposer le contenu du dossier `out/` sur un hébergement web, après l'avoir construit avec la bonne adresse.

## 1. Choisir l'adresse

| Option | Exemple | Remarques |
|---|---|---|
| Sous-domaine (recommandé) | `https://jeu.barrages-cfbr.eu/` | `robots.txt` et `sitemap.xml` à la racine, pas de sous-dossier, en-têtes dédiés, cache long possible. |
| Sous-dossier du site actuel | `https://www.barrages-cfbr.eu/jeu-7-familles/` | Adresse déjà imprimée sur la carte « Infos complémentaires » (QR code). Le site du CFBR est un site SPIP : vérifier que le dossier est servi tel quel. |

L'adresse du QR code des règles est `https://www.barrages-cfbr.eu/jeu-7-familles/` (page encore inexistante au 6 octobre 2026). Si le jeu est installé ailleurs, y placer une redirection.

## 2. Construire pour la nouvelle adresse

Variables à définir avant `pnpm build` :

```bash
# Sous-domaine : pas de sous-dossier
NEXT_PUBLIC_BASE_PATH=""
NEXT_PUBLIC_SITE_ORIGIN="https://jeu.barrages-cfbr.eu"

# Sous-dossier : indiquer le chemin, sans barre finale
NEXT_PUBLIC_BASE_PATH="/jeu-7-familles"
NEXT_PUBLIC_SITE_ORIGIN="https://www.barrages-cfbr.eu"

pnpm install && pnpm build     # résultat dans out/
```

Ces variables alimentent les liens, le manifeste, le service worker (son périmètre suit l'adresse), les balises canonical et hreflang, le sitemap et les images de partage.

## 3. Déposer les fichiers

Copier tout le contenu de `out/` à la racine de l'hébergement (ou du sous-dossier). Vérifier :

- `/` et `/en/` répondent (les dossiers contiennent des `index.html`) ;
- `/sw.js` est servi avec le type `text/javascript` et **sans** cache long (le navigateur doit pouvoir détecter les mises à jour) ;
- `/manifest.webmanifest` est servi en `application/manifest+json`, `/en/manifest.webmanifest` aussi ;
- les fichiers `.webp`, `.mp3` (lecture par morceaux : `Accept-Ranges: bytes`), `.ttf` et `.json` ont le bon type ;
- la page `404.html` est utilisée pour les adresses inconnues.

## 4. En-têtes recommandés (à poser sur le serveur du CFBR)

GitHub Pages ne permet pas d'en définir ; un hébergement du CFBR (Apache/Nginx, OVH) le permet :

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
X-Frame-Options: SAMEORIGIN
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://gc.zgo.at; connect-src 'self' https://cfbr.goatcounter.com; img-src 'self' data: https://gc.zgo.at; style-src 'self' 'unsafe-inline'; font-src 'self'; media-src 'self'; worker-src 'self'; manifest-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'
```

Cache :

- `/_next/static/*` : `Cache-Control: public, max-age=31536000, immutable` (les noms de fichiers changent à chaque version) ;
- `/cards/*`, `/audio/*`, `/icons/*`, `/og/*`, `/logos/*`, `/fonts/*` : `max-age=2592000` (30 jours) ;
- pages `.html`, `sw.js`, `manifest.webmanifest`, `sitemap.xml`, `robots.txt` : `max-age=300` ou `no-cache`.

Activer la compression (gzip ou Brotli) pour le texte, le JavaScript et le CSS.

## 5. Référencement

- `robots.txt` et `sitemap.xml` doivent être à la racine **du domaine** utilisé (ce qui est automatique avec un sous-domaine). Avec un sous-dossier, ajouter la ligne `Sitemap: https://www.barrages-cfbr.eu/jeu-7-familles/sitemap.xml` au `robots.txt` du site principal.
- Déclarer le site dans Google Search Console et Bing Webmaster Tools, puis soumettre le sitemap.
- Mettre en place une redirection permanente (301) de `https://jul1n.github.io/7familles/` vers la nouvelle adresse, pour conserver le référencement et les liens déjà partagés. GitHub Pages ne sait pas rediriger : ajouter dans le dépôt une page `index.html` de redirection (`<meta http-equiv="refresh">` et `<link rel="canonical">`) ou supprimer le déploiement une fois la nouvelle adresse indexée.
- Les utilisateurs ayant installé l'application depuis l'ancienne adresse devront la réinstaller (l'installation est liée au domaine).

## 6. Mentions légales et données personnelles

Les pages du jeu renvoient vers la page « Mentions légales » du site du CFBR (`https://www.barrages-cfbr.eu/Mentions-legales.html`, constante `LEGAL_URL` dans `lib/links.ts`). Si le jeu change de domaine ou si cette page est déplacée, mettre à jour cette constante.

Le jeu ne dépose aucun cookie. Le compteur GoatCounter (`https://cfbr.goatcounter.com`) mesure les visites sans cookie ni identifiant ; il est chargé depuis `https://gc.zgo.at`. Pour le désactiver, construire avec `NEXT_PUBLIC_GOATCOUNTER_CODE=off` ; une autre valeur désigne un autre compteur GoatCounter. À signaler dans les mentions légales du CFBR (mesure d'audience sans cookie).

## 7. Vérifications après mise en ligne

- [ ] Accueil FR et EN, une carte, une famille, les règles
- [ ] Recherche, quiz (jeu et PDF), partage, lecture audio sur téléphone
- [ ] Installation sur Android (Chrome) et iPhone (Safari), ouverture hors ligne
- [ ] `https://…/sitemap.xml` et `https://…/robots.txt`
- [ ] Un test Lighthouse (performance, accessibilité, SEO) et [securityheaders.com](https://securityheaders.com)
- [ ] Le QR code de la carte « Infos complémentaires » ouvre la bonne page
