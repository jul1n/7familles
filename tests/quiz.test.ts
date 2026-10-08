import { describe, expect, it } from "vitest";
import { quizBankForFamily } from "@/lib/quiz";
import { getContent } from "@/lib/content";
import { CARDS } from "@/data/cards";
import { drawPrintQuizzes, drawQuestions, getQuizBank, shuffleAnswers } from "@/data/quiz";

const ids = new Set(CARDS.map((c) => c.id));

// Générateur pseudo-aléatoire reproductible
const seeded = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

describe("banque de questions", () => {
  for (const lang of ["fr", "en"] as const) {
    const bank = getQuizBank(lang);

    it(`${lang} : 2 questions par carte, toutes les cartes existent`, () => {
      expect(bank).toHaveLength(84);
      const perCard = new Map<string, number>();
      for (const q of bank) perCard.set(q.card, (perCard.get(q.card) ?? 0) + 1);
      expect(perCard.size).toBe(42);
      expect([...perCard.values()].every((n) => n === 2)).toBe(true);
      expect(bank.every((q) => ids.has(q.card))).toBe(true);
    });

    it(`${lang} : 4 réponses distinctes par question`, () => {
      for (const q of bank) {
        expect(q.answers).toHaveLength(4);
        expect(new Set(q.answers).size).toBe(4);
        expect(q.q.trim().length).toBeGreaterThan(10);
      }
    });
  }

  it("les listes FR et EN restent alignées", () => {
    const fr = getQuizBank("fr");
    const en = getQuizBank("en");
    expect(en.map((q) => q.card)).toEqual(fr.map((q) => q.card));
  });
});

describe("tirages", () => {
  const bank = getQuizBank("fr");

  it("5 questions sur des cartes toutes différentes", () => {
    for (let s = 1; s <= 20; s++) {
      const quiz = drawQuestions(bank, 5, seeded(s));
      expect(quiz).toHaveLength(5);
      expect(new Set(quiz.map((q) => q.card)).size).toBe(5);
    }
  });

  it("le mélange des réponses garde la bonne réponse repérable", () => {
    for (let s = 1; s <= 50; s++) {
      const q = bank[s % bank.length];
      const { answers, correct } = shuffleAnswers(q, seeded(s));
      expect(answers).toHaveLength(4);
      expect(answers[correct]).toBe(q.answers[0]);
      expect([...answers].sort()).toEqual([...q.answers].sort());
    }
  });

  it("10 quiz de 5 questions, sans question répétée", () => {
    const quizzes = drawPrintQuizzes(bank, 10, 5, seeded(7));
    expect(quizzes).toHaveLength(10);
    const all = quizzes.flat();
    expect(all).toHaveLength(50);
    expect(new Set(all.map((q) => q.id)).size).toBe(50);
    for (const quiz of quizzes) expect(new Set(quiz.map((q) => q.card)).size).toBe(5);
  });
});

describe("quiz par famille", () => {
  for (const lang of ["fr", "en"] as const) {
    const { CARDS: cards, FAMILIES } = getContent(lang);
    const bank = getQuizBank(lang);
    it(`${lang} : chaque famille fournit cinq cartes distinctes sans question hors famille`, () => {
      for (const family of FAMILIES) {
        const filtered = quizBankForFamily(bank, cards, family.id);
        expect(filtered).toHaveLength(12);
        const allowed = new Set(cards.filter((c) => c.familyId === family.id).map((c) => c.id));
        for (let seed = 1; seed <= 20; seed++) {
          const drawn = drawQuestions(filtered, 5, seeded(seed));
          expect(drawn).toHaveLength(5);
          expect(new Set(drawn.map((q) => q.card)).size).toBe(5);
          expect(drawn.every((q) => allowed.has(q.card))).toBe(true);
        }
      }
      expect(quizBankForFamily(bank, cards, null)).toHaveLength(84);
      expect(quizBankForFamily(bank, cards, "unknown")).toEqual([]);
    });
  }
});
