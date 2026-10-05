// Liste des fichiers à mettre en cache à l'installation de l'application (lue par public/sw.js).
// Miniatures des cartes (FR et EN), logos, polices, icônes. Les images pleine taille et l'audio se mettent
// en cache à l'usage. Usage : node scripts/make-precache.mjs  ->  public/precache.json
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const list = (dir, exts) =>
  readdirSync(join("public", dir))
    .filter((f) => exts.some((e) => f.endsWith(e)) && statSync(join("public", dir, f)).isFile())
    .map((f) => `/${dir}/${f}`)
    .sort();

const files = [
  ...list("cards/thumbs", [".webp"]),
  ...list("cards/thumbs/en", [".webp"]),
  ...list("logos", [".png"]),
  ...list("icons", [".png"]),
  ...list("fonts", [".ttf"]),
  "/cfbr-logo.png",
  "/regles/qr-ressources.png",
];
writeFileSync("public/precache.json", JSON.stringify({ files }, null, 1));
console.log(`${files.length} fichiers`);
