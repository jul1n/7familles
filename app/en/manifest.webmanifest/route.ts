import { buildManifest } from "@/lib/manifest";

// Next ne gère le fichier « manifest » qu'à la racine de app/ : la version anglaise passe par une route statique
export const dynamic = "force-static";

export function GET() {
  return new Response(JSON.stringify(buildManifest("en")), {
    headers: { "Content-Type": "application/manifest+json" },
  });
}
