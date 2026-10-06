// Couleurs des familles : textes lisibles (contraste WCAG AA de 4,5:1) sur ou à partir d'une couleur de famille.
const DARK = "#1c1917";
const CREAM = "#F7F5F0";

function rgb(hex: string): [number, number, number] {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];
}

function luminance(hex: string): number {
  const [r, g, b] = rgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function darken(hex: string, factor: number): string {
  return "#" + rgb(hex).map((v) => Math.round(v * factor).toString(16).padStart(2, "0")).join("");
}

// Pastille de famille (fond coloré + texte) : texte blanc ou foncé selon la couleur ; le fond est assombri en dernier recours
export function badgeColors(bg: string): { backgroundColor: string; color: string } {
  if (contrast("#FFFFFF", bg) >= 4.5) return { backgroundColor: bg, color: "#FFFFFF" };
  if (contrast(DARK, bg) >= 4.5) return { backgroundColor: bg, color: DARK };
  let dark = bg;
  for (let i = 0; i < 12 && contrast("#FFFFFF", dark) < 4.5; i++) dark = darken(dark, 0.92);
  return { backgroundColor: dark, color: "#FFFFFF" };
}

// Texte coloré sur le fond crème du site : la couleur de la famille, assombrie jusqu'à être lisible
export function textOnCream(color: string): string {
  let c = color;
  for (let i = 0; i < 20 && contrast(c, CREAM) < 4.5; i++) c = darken(c, 0.93);
  return c;
}
