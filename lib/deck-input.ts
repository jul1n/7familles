/** Only an actual mouse on a hover-capable surface can start automatic edge scrolling. */
export function deckHoverVelocity(pointerType: string, x: number, width: number, canHover: boolean): number {
  if (pointerType !== "mouse" || !canHover || width <= 0) return 0;
  const ratio = Math.max(0, Math.min(1, x / width));
  if (ratio > .68) return -(ratio - .68) / .32 * 2.4;
  if (ratio < .32) return (.32 - ratio) / .32 * 2.4;
  return 0;
}
export function clampDeckOffset(offset: number) { return Math.max(-3, Math.min(3, offset)); }
/** Ignore taps and vertical page gestures; a horizontal drag directly controls the deck. */
export function deckDragOffset(start: number, dx: number, dy: number, width: number): number | null {
  if (width <= 0 || Math.abs(dx) < 6 || Math.abs(dx) <= Math.abs(dy) * 1.25) return null;
  return clampDeckOffset(start + dx / (width * .35) * 1.5);
}
