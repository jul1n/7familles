// Vérifie la banque du quiz : mêmes cartes dans le même ordre en FR et EN, 2 questions par carte, cartes existantes.
import { readFileSync } from "node:fs";
const s = readFileSync("data/quiz.ts", "utf8");
const part = (a, b) => s.slice(s.indexOf(a), s.indexOf(b));
const ids = (t) => [...t.matchAll(/^\s+\["([a-z-]+)", "/gm)].map((m) => m[1]);
const fr = ids(part("const FR", "const EN"));
const en = ids(part("const EN", "export interface"));
const cards = new Set([...readFileSync("data/cards.ts", "utf8").matchAll(/id: "([a-z-]+)",\s*\n\s*familyId/g)].map((m) => m[1]));
const count = {};
fr.forEach((c) => (count[c] = (count[c] || 0) + 1));
console.log("FR", fr.length, "EN", en.length, "même ordre", fr.every((c, i) => c === en[i]));
console.log("cartes", Object.keys(count).length, "inconnues", Object.keys(count).filter((c) => cards.size && !cards.has(c)));
console.log("cartes sans 2 questions", Object.entries(count).filter(([, n]) => n !== 2));

// Chaque question a 4 réponses toutes différentes
const rows = [...s.matchAll(/^\s+\["[a-z-]+", (.*)\],$/gm)].map((m) => [...m[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((x) => x[1]));
const bad = rows.filter((r) => r.length !== 5 || new Set(r.slice(1)).size !== 4);
console.log("questions", rows.length, "avec 4 réponses distinctes:", rows.length - bad.length, "anomalies", bad.map((r) => r[0]));
