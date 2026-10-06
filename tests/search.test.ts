import { describe, expect, it } from "vitest";
import { getContent } from "@/lib/content";
import { searchCards } from "@/lib/search";

const fr = getContent("fr").CARDS;
const en = getContent("en").CARDS;

describe("searchCards", () => {
  it("ignore les accents et la casse", () => {
    const ids = searchCards(fr, "VOUTE").map((h) => h.card.id);
    expect(ids).toContain("types-barrage-voute");
  });

  it("classe le titre avant le texte", () => {
    const hits = searchCards(fr, "hoover");
    expect(hits[0].card.id).toBe("monde-hoover-dam");
    expect(hits.length).toBeGreaterThan(1);
  });

  it("exige tous les mots", () => {
    expect(searchCards(fr, "hoover zzzzqq")).toEqual([]);
    expect(searchCards(fr, "barrage voute").length).toBeGreaterThan(0);
  });

  it("ne cherche rien pour un mot trop court ou vide", () => {
    expect(searchCards(fr, "")).toEqual([]);
    expect(searchCards(fr, "a")).toEqual([]);
  });

  it("limite le nombre de résultats", () => {
    expect(searchCards(fr, "eau").length).toBeLessThanOrEqual(30);
  });

  it("fonctionne en anglais", () => {
    expect(searchCards(en, "tide")[0].card.id).toBe("france-rance");
  });
});
