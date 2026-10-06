import type { NextConfig } from "next";

// Déploiement GitHub Pages : export statique servi sous /<nom-du-dépôt>.
// NEXT_PUBLIC_BASE_PATH est défini par le workflow (.github/workflows/pages.yml) ; vide en local.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  // Imports nommés des gros paquets : seuls les éléments utilisés sont inclus dans le JavaScript envoyé
  experimental: { optimizePackageImports: ["@react-three/drei", "lucide-react", "three"] },
};

export default nextConfig;
