import type { MetadataRoute } from "next";
import { asset } from "./asset";
import { paths, type Lang } from "./content";
import { UI } from "./ui";

// Manifeste de l'application installable, dans la langue du site (l'installation depuis /en/ ouvre la version anglaise)
export function buildManifest(lang: Lang): MetadataRoute.Manifest {
  const t = UI[lang];
  const home = asset(paths.home(lang));
  return {
    id: home,
    name: t.siteName,
    short_name: t.siteNameShort,
    description: t.siteDescription,
    lang,
    start_url: home,
    scope: home,
    display: "standalone",
    orientation: "any",
    categories: ["education", "games"],
    background_color: "#F7F5F0",
    theme_color: "#1b5d78",
    icons: [
      { src: asset("/icons/icon-192.png"), sizes: "192x192", type: "image/png", purpose: "any" },
      { src: asset("/icons/icon-512.png"), sizes: "512x512", type: "image/png", purpose: "any" },
      { src: asset("/icons/icon-maskable-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
