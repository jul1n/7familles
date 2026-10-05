// Affiche le texte brut des cartes (aide à la rédaction du quiz). Usage : node scripts/dump-cards.mjs [fr|en]
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
const out = mkdtempSync(join(tmpdir(), "7f-"));
const done = new Map();
const res = (spec, from) => {
  const base = spec.startsWith("@/") ? spec.slice(2) : join(dirname(from), spec).replaceAll("\\", "/");
  for (const c of [`${base}.ts`, `${base}/index.ts`]) if (existsSync(c)) return c;
  throw new Error(spec);
};
const compile = (rel) => {
  if (done.has(rel)) return done.get(rel);
  const target = join(out, rel.replace(/\.ts$/, ".mjs"));
  done.set(rel, target);
  let js = ts.transpileModule(readFileSync(rel, "utf8"), { compilerOptions: { module: "ESNext", target: "ES2022" } }).outputText;
  js = js.replace(/from "((?:\.|@\/)[^"]+)"/g, (_, s) => `from "${pathToFileURL(compile(res(s, rel))).href}"`);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, js);
  return target;
};
const { getContent } = await import(pathToFileURL(compile("lib/content.ts")).href);
const lang = process.argv[2] ?? "fr";
for (const c of getContent(lang).CARDS) {
  const body = c.contentMarkdown.replace(/^\s*#\s.*\n+/, "").replace(/[#*>_`]/g, "").replace(/\n{2,}/g, "\n");
  console.log(`=== ${c.id} | ${c.title}\n${body}\n`);
}
