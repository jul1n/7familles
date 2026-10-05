import type { CardData } from "@/data/cards";

// Recherche dans les cartes : insensible aux majuscules et aux accents, tous les mots doivent être trouvés.
const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Texte brut d'une fiche (sans les symboles Markdown)
const plain = (md: string) =>
  md
    .replace(/[#>*_`|]/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

export interface SearchHit {
  card: CardData;
  snippet: string;
}

export function searchCards(cards: CardData[], query: string): SearchHit[] {
  const words = norm(query).split(/\s+/).filter((w) => w.length > 1);
  if (words.length === 0) return [];
  const hits: (SearchHit & { score: number })[] = [];
  for (const card of cards) {
    const title = norm(card.title);
    const head = norm(`${card.familyName} ${card.shortDescription} ${card.location ?? ""} ${card.period ?? ""}`);
    const body = plain(card.contentMarkdown);
    const bodyN = norm(body);
    let score = 0;
    let ok = true;
    for (const w of words) {
      if (title.includes(w)) score += title.startsWith(w) ? 12 : 8;
      else if (head.includes(w)) score += 4;
      else if (bodyN.includes(w)) score += 1;
      else {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    // Extrait autour du premier mot trouvé dans le texte (sinon la description courte)
    const at = bodyN.indexOf(words.find((w) => bodyN.includes(w)) ?? "");
    const inBody = at >= 0 && !words.every((w) => head.includes(w) || title.includes(w));
    const snippet = inBody
      ? `${at > 40 ? "… " : ""}${body.slice(Math.max(0, at - 40), at + 90).trim()} …`
      : card.shortDescription;
    hits.push({ card, snippet, score });
  }
  return hits.sort((a, b) => b.score - a.score || a.card.num - b.card.num).slice(0, 30);
}
