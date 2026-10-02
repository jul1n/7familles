import type { MetadataRoute } from "next";
import { asset } from "@/lib/asset";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "7 Familles",
    description: SITE_DESCRIPTION,
    lang: "fr",
    start_url: asset("/"),
    scope: asset("/"),
    display: "standalone",
    background_color: "#F7F5F0",
    theme_color: "#1b5d78",
    icons: [
      { src: asset("/icons/icon-192.png"), sizes: "192x192", type: "image/png" },
      { src: asset("/icons/icon-512.png"), sizes: "512x512", type: "image/png" },
    ],
  };
}
