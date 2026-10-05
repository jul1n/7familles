"use client";

import React from "react";
import { paths, type Lang } from "@/lib/content";
import { UI } from "@/lib/ui";
import { asset } from "@/lib/asset";
import { GLOBAL_LINKS, gameAuthors } from "@/lib/links";
import { RESOURCE_LINKS, RESOURCE_LINKS_EN } from "@/lib/card-links";
import AgencyCredit from "@/components/AgencyCredit";

// Liens de bas de page (règles, ressources, CFBR, crédits, impression), partagés par la mosaïque et le carrousel.
// La variante « compact » tient en une bande discrète sous les pastilles du carrousel.
export default function ResourcesNav({
  lang,
  onPrintAll,
  compact = false,
  className = "",
}: {
  lang: Lang;
  onPrintAll: () => void;
  compact?: boolean;
  className?: string;
}) {
  const t = UI[lang];
  const link = "underline underline-offset-2";
  return (
    <nav aria-label={t.resources} className={`text-xs font-semibold text-[#1b5d78] ${className}`}>
      {!compact && <p className="mb-2 text-center font-medium text-stone-600">{t.furtherReading}</p>}
      <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <li>
          <a href={asset(paths.rules(lang))} className={link}>
            {t.rules}
          </a>
        </li>
        {(lang === "fr" ? RESOURCE_LINKS : RESOURCE_LINKS_EN).map((l) => (
          <li key={l.url}>
            <a href={l.url} target="_blank" rel="noopener noreferrer" title={l.description} className={link}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <p className={`${compact ? "mt-1" : "mt-3"} flex flex-wrap items-center justify-center gap-x-4 gap-y-1`}>
        {GLOBAL_LINKS.map((l) => (
          <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className={link}>
            {lang === "en" && l.url.includes("barrages-cfbr") ? t.cfbrSite : l.label}
          </a>
        ))}
        <AgencyCredit className="text-stone-600 font-medium" lang={lang} />
        <span className="text-stone-600 font-medium">
          {t.rulesAuthors} : {gameAuthors(lang).map((a) => a.name).join(" • ")}
        </span>
        <button onClick={onPrintAll} className={link}>
          {t.printAll}
        </button>
      </p>
    </nav>
  );
}
