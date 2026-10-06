import { describe, expect, it } from "vitest";
import { getContent, paths } from "@/lib/content";
import { UI } from "@/lib/ui";
import audioFr from "@/data/audio-manifest.json";
import audioEn from "@/data/audio-manifest-en.json";

describe("contenus", () => {
  const fr = getContent("fr");
  const en = getContent("en");

  it("42 cartes et 7 familles dans les deux langues", () => {
    for (const c of [fr, en]) {
      expect(c.CARDS).toHaveLength(42);
      expect(c.FAMILIES).toHaveLength(7);
    }
  });

  it("chaque carte anglaise est traduite", () => {
    fr.CARDS.forEach((card, i) => {
      const e = en.CARDS[i];
      expect(e.id).toBe(card.id);
      expect(e.title.length).toBeGreaterThan(1);
      expect(e.contentMarkdown).not.toBe(card.contentMarkdown);
      expect(e.frontImage).toContain("/cards/en/");
    });
  });

  it("chaque carte a une narration audio dans les deux langues", () => {
    for (const card of fr.CARDS) {
      expect(audioFr).toHaveProperty([card.id]);
      expect(audioEn).toHaveProperty([card.id]);
    }
  });

  it("les textes de l'interface sont complets dans les deux langues", () => {
    const keys = (o: object): string[] => Object.keys(o).sort();
    expect(keys(UI.en)).toEqual(keys(UI.fr));
    expect(keys(UI.en.quiz)).toEqual(keys(UI.fr.quiz));
  });

  it("adresses des pages", () => {
    expect(paths.home("fr")).toBe("/");
    expect(paths.home("en")).toBe("/en/");
    expect(paths.card("fr", "x")).toBe("/carte/x/");
    expect(paths.card("en", "x")).toBe("/en/card/x/");
  });
});
