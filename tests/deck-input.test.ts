import { describe, expect, it } from "vitest";
import { deckHoverVelocity, clampDeckOffset, deckDragOffset } from "../lib/deck-input";
describe("deck input on touch and hybrid screens", () => {
  it("never starts hover scrolling from a finger or pen, even on a hybrid device", () => { for(const pointer of ["touch","pen"]) for(const x of [0,1000]) expect(deckHoverVelocity(pointer,x,1000,true)).toBe(0); });
  it("ignores compatibility mouse input on a device without hover", () => { expect(deckHoverVelocity("mouse",0,1000,false)).toBe(0); });
  it("scrolls only at the mouse edges, with a stationary center", () => { expect(deckHoverVelocity("mouse",0,1000,true)).toBeCloseTo(2.4); expect(deckHoverVelocity("mouse",1000,1000,true)).toBeCloseTo(-2.4); expect(deckHoverVelocity("mouse",500,1000,true)).toBe(0); });
  it("preserves a deliberate horizontal touch drag within the seven-family bounds", () => { expect(deckDragOffset(0,100,0,1000)).toBeGreaterThan(0); expect(deckDragOffset(2.9,1000,0,1000)).toBe(3); expect(deckDragOffset(-2.9,-1000,0,1000)).toBe(-3); });
  it("does not move the deck for a tap or vertical page gesture", () => { expect(deckDragOffset(0,3,0,1000)).toBeNull(); expect(deckDragOffset(0,30,100,1000)).toBeNull(); });
  it("clamps every input path to the existing family range", () => { expect(clampDeckOffset(10)).toBe(3); expect(clampDeckOffset(-10)).toBe(-3); expect(clampDeckOffset(.75)).toBe(.75); });
});
