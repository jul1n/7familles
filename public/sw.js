// Service worker du jeu des 7 familles : installation sur l'écran d'accueil et lecture hors ligne.
// - pages : réseau d'abord, copie en cache si on est hors ligne
// - fichiers de l'application (_next/static) : en cache dès qu'ils ont été vus (leur nom change à chaque version)
// - images, polices : cache d'abord, rafraîchies en arrière-plan
// - audio : mis en cache à la première écoute (les lectures par morceaux sont servies depuis le cache)
const VERSION = "v1";
const CACHE = `7familles-${VERSION}`;
const BASE = new URL(self.registration.scope).pathname.replace(/\/$/, ""); // "" ou "/7familles"
const PAGES = ["/", "/en/", "/regles/", "/en/rules/"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // Les pages d'accueil, puis les fichiers de l'application qu'elles référencent
      const statics = new Set();
      for (const p of PAGES) {
        try {
          const res = await fetch(BASE + p, { cache: "reload" });
          await cache.put(BASE + p, res.clone());
          const html = await res.text();
          for (const m of html.matchAll(/(?:\/_next\/static\/[^"'\\\s)]+\.(?:js|css|woff2?))/g)) statics.add(m[0].startsWith(BASE) ? m[0] : BASE + m[0]);
        } catch {
          /* hors ligne ou page absente : on continue */
        }
      }
      let files = [];
      try {
        files = (await (await fetch(BASE + "/precache.json", { cache: "reload" })).json()).files.map((f) => BASE + f);
      } catch {
        /* liste absente */
      }
      // addAll échoue en bloc : on ajoute fichier par fichier pour qu'un manquant ne bloque pas l'installation
      // Par lots, pour ne pas saturer la connexion (un téléphone en 4G ou un petit serveur)
      const todo = [...statics, ...files];
      for (let i = 0; i < todo.length; i += 8) {
        await Promise.all(todo.slice(i, i + 8).map((u) => cache.add(u).catch((e) => console.warn("sw: cache", u, String(e)))));
      }
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      for (const k of await caches.keys()) if (k.startsWith("7familles-") && k !== CACHE) await caches.delete(k);
      await self.clients.claim();
    })()
  );
});

// Réponse partielle (206) construite depuis une réponse complète en cache : nécessaire pour l'audio sur Safari
async function rangeFromCache(request, cached) {
  const m = /bytes=(\d+)-(\d*)/.exec(request.headers.get("range") || "");
  if (!m) return cached;
  const buf = await cached.arrayBuffer();
  const start = Number(m[1]);
  const end = m[2] ? Math.min(Number(m[2]), buf.byteLength - 1) : buf.byteLength - 1;
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      "Content-Type": cached.headers.get("Content-Type") || "audio/mpeg",
      "Content-Range": `bytes ${start}-${end}/${buf.byteLength}`,
      "Content-Length": String(end - start + 1),
      "Accept-Ranges": "bytes",
    },
  });
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE + "/")) return;
  const path = url.pathname.slice(BASE.length);

  // Pages
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        try {
          const res = await fetch(req);
          if (res.ok) cache.put(req, res.clone());
          return res;
        } catch {
          return (
            (await cache.match(req, { ignoreSearch: true })) ||
            (await cache.match(BASE + (path.startsWith("/en/") ? "/en/" : "/"))) ||
            Response.error()
          );
        }
      })()
    );
    return;
  }

  // Audio
  if (path.startsWith("/audio/")) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        const cached = await cache.match(url.pathname);
        if (cached) return rangeFromCache(req, cached);
        // Premier accès : on télécharge le fichier entier une fois (pour le garder), et on sert la demande
        try {
          const full = await fetch(url.pathname);
          if (full.ok) {
            cache.put(url.pathname, full.clone());
            return rangeFromCache(req, full);
          }
        } catch {
          /* hors ligne */
        }
        return fetch(req);
      })()
    );
    return;
  }

  // Fichiers de l'application, images, polices : cache d'abord (images rafraîchies en arrière-plan)
  const immutable = path.startsWith("/_next/static/");
  if (immutable || /\.(webp|png|jpg|jpeg|gif|ico|ttf|woff2?|json|svg)$/.test(path)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        const cached = await cache.match(req);
        if (cached && immutable) return cached; // le nom du fichier change à chaque version
        const refresh = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => undefined);
        if (cached) {
          event.waitUntil(refresh);
          return cached;
        }
        return (await refresh) || Response.error();
      })()
    );
  }
});
