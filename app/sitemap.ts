import type { MetadataRoute } from "next";
import { CARDS, FAMILIES } from "@/data/cards";
import { paths } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

// Chaque page existe en français et en anglais : les deux versions se référencent (hreflang)
const entry = (fr: string, en: string, priority: number, changeFrequency: "monthly" | "yearly"): MetadataRoute.Sitemap =>
  [fr, en].map((url) => ({
    url: absoluteUrl(url),
    changeFrequency,
    priority,
    alternates: { languages: { fr: absoluteUrl(fr), en: absoluteUrl(en) } },
  }));

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...entry(paths.home("fr"), paths.home("en"), 1, "monthly"),
    ...entry(paths.rules("fr"), paths.rules("en"), 0.8, "yearly"),
    ...FAMILIES.flatMap((f) => entry(paths.family("fr", f.id), paths.family("en", f.id), 0.7, "yearly")),
    ...CARDS.flatMap((c) => entry(paths.card("fr", c.id), paths.card("en", c.id), 0.6, "yearly")),
  ];
}
