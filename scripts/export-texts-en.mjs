// Exporte le texte anglais à lire de chaque carte (même transformation que le bouton « Listen » du site anglais).
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

// Compile chaque fichier TypeScript nécessaire vers un fichier .mjs temporaire (les imports relatifs sont complétés)
const out = mkdtempSync(join(tmpdir(), "7familles-"));
const compile = (rel) => {
  const src = readFileSync(rel, "utf8");
  let js = ts.transpileModule(src, { compilerOptions: { module: "ESNext", target: "ES2022" } }).outputText;
  js = js.replace(/from "(\.[^"]+)"/g, 'from "$1.mjs"');
  const target = join(out, rel.replace(/\.ts$/, ".mjs"));
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, js);
  return target;
};

const files = ["data/cards.ts", "lib/speech.ts", ...readdirSync("data/en").map((f) => `data/en/${f}`)];
const targets = Object.fromEntries(files.map((f) => [f, compile(f)]));
const load = (f) => import(pathToFileURL(targets[f]).href);

const { EN_CARDS } = await load("data/en/index.ts");
const { CARDS } = await load("data/cards.ts");
const { markdownToSpeechEn } = await load("lib/speech.ts");

const result = CARDS.map((c) => {
  const en = EN_CARDS[c.id];
  return { id: c.id, text: markdownToSpeechEn(en.title, en.shortDescription, en.contentMarkdown) };
});
process.stdout.write(JSON.stringify(result));
