// Exporte le texte à lire de chaque carte (même transformation que le bouton « Écouter » du site).
import { readFileSync } from "node:fs";
import ts from "typescript";

const load = async (file) => {
  const src = readFileSync(file, "utf8");
  const js = ts.transpileModule(src, { compilerOptions: { module: "ESNext", target: "ES2022" } }).outputText;
  return import("data:text/javascript;base64," + Buffer.from(js).toString("base64"));
};

const { CARDS } = await load("data/cards.ts");
const { markdownToSpeech } = await load("lib/speech.ts");

const out = CARDS.map((c) => ({
  id: c.id,
  text: markdownToSpeech(c.title, c.shortDescription, c.contentMarkdown),
}));
process.stdout.write(JSON.stringify(out));
