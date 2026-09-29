import type { NextConfig } from "next";

// Déploiement GitHub Pages : export statique servi sous /<nom-du-dépôt>.
// NEXT_PUBLIC_BASE_PATH est défini par le workflow (.github/workflows/pages.yml) ; vide en local.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
