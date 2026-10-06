import { describe, expect, it } from "vitest";
import { FAMILIES } from "@/data/cards";
import { badgeColors, contrast, textOnCream } from "@/lib/color";

describe("couleurs des familles", () => {
  it("la pastille de chaque famille a un contraste d'au moins 4,5:1", () => {
    for (const f of FAMILIES) {
      const { backgroundColor, color } = badgeColors(f.color);
      expect(contrast(backgroundColor, color), f.id).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("le texte coloré sur fond crème est lisible", () => {
    for (const f of FAMILIES) expect(contrast(textOnCream(f.color), "#F7F5F0"), f.id).toBeGreaterThanOrEqual(4.5);
  });

  it("les couleurs déjà lisibles ne changent pas", () => {
    expect(badgeColors("#8E44AD")).toEqual({ backgroundColor: "#8E44AD", color: "#FFFFFF" });
    expect(textOnCream("#000000")).toBe("#000000");
  });
});
