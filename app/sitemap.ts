import type { MetadataRoute } from "next";
import { CARDS, FAMILIES } from "@/data/cards";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    ...FAMILIES.map((f) => ({ url: absoluteUrl(`/famille/${f.id}/`), changeFrequency: "yearly" as const, priority: 0.7 })),
    ...CARDS.map((c) => ({ url: absoluteUrl(`/carte/${c.id}/`), changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
