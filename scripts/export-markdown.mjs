// Exporte le jeu (règles, familles, 42 cartes) en un fichier Markdown par langue, à déposer sur GDrive / OneDrive
// pour la relecture collégiale. Usage : node scripts/export-markdown.mjs  ->  exports/7familles-FR.md et 7familles-EN.md
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

// Compile à la volée les fichiers TypeScript du projet (imports relatifs et alias « @/ » compris)
const out = mkdtempSync(join(tmpdir(), "7familles-md-"));
const done = new Map();
const resolveTs = (spec, fromRel) => {
  const base = spec.startsWith("@/") ? spec.slice(2) : join(dirname(fromRel), spec).replaceAll("\\", "/");
  for (const c of [`${base}.ts`, `${base}/index.ts`, `${base}.json`]) if (existsSync(c)) return c;
  throw new Error(`Introuvable : ${spec} (depuis ${fromRel})`);
};
const compile = (rel) => {
  if (done.has(rel)) return done.get(rel);
  const target = join(out, rel.replace(/\.(ts|json)$/, ".mjs"));
  done.set(rel, target);
  let js;
  if (rel.endsWith(".json")) js = `export default ${readFileSync(rel, "utf8")};`;
  else {
    js = ts.transpileModule(readFileSync(rel, "utf8"), { compilerOptions: { module: "ESNext", target: "ES2022" } }).outputText;
    js = js.replace(/from "((?:\.|@\/)[^"]+)"/g, (_, spec) => `from "${pathToFileURL(compile(resolveTs(spec, rel))).href}"`);
  }
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, js);
  return target;
};
const load = (rel) => import(pathToFileURL(compile(rel)).href);

const { getContent, paths } = await load("lib/content.ts");
const { UI } = await load("lib/ui.ts");
const R = await load("lib/rules.ts");
const { gameAuthors, getCopyText } = await load("lib/links.ts");

const BASE = "https://jul1n.github.io/7familles";
const shiftHeadings = (md, by) =>
  md.replace(/^(#{1,6})(\s)/gm, (_, h, s) => "#".repeat(Math.min(6, h.length + by)) + s);
const bullets = (a) => a.map((x) => `- ${x}`).join("\n");

function build(lang) {
  const fr = lang === "fr";
  const t = UI[lang];
  const { FAMILIES, CARDS } = getContent(lang);
  const rules = fr
    ? { meta: R.RULES_META, material: R.RULES_MATERIAL, goal: R.RULES_GOAL, flow: R.RULES_FLOW, end: R.RULES_END, more: R.RULES_MORE, history: R.CFBR_HISTORY, missions: R.CFBR_MISSIONS }
    : R.RULES_EN;
  const L = fr
    ? { source: "Site", intro: "Présentation", sheet: "Fiche", location: "Lieu", period: "Période", credits: "Crédit photo", cardsOf: "Cartes de la famille" }
    : { source: "Website", intro: "About the game", sheet: "Fact sheet", location: "Location", period: "Period", credits: "Photo credit", cardsOf: "Cards of the family" };

  const p = [];
  p.push(`# ${t.siteName}`, `*${t.subtitle}*`, "", `${L.source} : ${BASE}${paths.home(lang)}`, "", t.siteDescription, "");
  if (t.gameIntro) p.push(`> ${t.gameIntro.text} ([${t.gameIntro.linkLabel}](${t.gameIntro.url}))`, "");

  p.push(`## ${t.rulesTitle}`, "", t.rulesIntro, "", rules.meta.map((m) => `**${m.label}** : ${m.value}`).join(" · "), "");
  p.push(`### ${t.rulesMaterial}`, "", bullets(rules.material), "");
  p.push(`### ${t.rulesGoal}`, "", rules.goal, "");
  p.push(`### ${t.rulesFlow}`, "", rules.flow.map((x, i) => `${i + 1}. ${x}`).join("\n"), "");
  p.push(`### ${t.rulesEnd}`, "", rules.end, "");
  p.push(`### ${t.rulesFurther}`, "", rules.more.join("\n\n"), "", `${t.rulesSite} : ${R.RULES_URL}`, "");
  p.push(`### ${t.rulesGetCopy}`, "", getCopyText(lang), "");
  p.push(`### ${t.rulesCfbr}`, "", rules.history.join("\n\n"), "", `**${t.rulesMissions}.** ${rules.missions}`, "");
  p.push(`### ${t.rulesAuthors}`, "", bullets(gameAuthors(lang).map((a) => `**${a.name}**${a.description ? ` : ${a.description}` : ""}`)), "");

  p.push(`## ${t.rulesCards}`, "", t.rulesCardsIntro, "");
  for (const f of FAMILIES) {
    const cards = CARDS.filter((c) => c.familyId === f.id);
    p.push(`## ${f.name}`, "", `*${f.description}*`, "");
    for (const c of cards) {
      p.push(`### ${c.num}. ${c.title}`, "", `*${c.shortDescription}*`, "");
      const meta = [c.location && `${L.location} : ${c.location}`, c.period && `${L.period} : ${c.period}`, c.credits && `${L.credits} : ${c.credits}`].filter(Boolean);
      if (meta.length) p.push(meta.join(" · "), "");
      // Le titre de la carte (# …) est déjà en titre de section : on le retire et on décale les sous-titres
      const body = shiftHeadings(c.contentMarkdown.replace(/^\s*#\s.*\n+/, "").trim(), 1);
      p.push(body, "", `${L.sheet} : ${BASE}${paths.card(lang, c.id)}`, "", "---", "");
    }
  }
  return p.join("\n").replace(/\n{3,}/g, "\n\n");
}

mkdirSync("exports", { recursive: true });
for (const lang of ["fr", "en"]) {
  const file = `exports/7familles-${lang.toUpperCase()}.md`;
  writeFileSync(file, build(lang), "utf8");
  console.log(file);
}
