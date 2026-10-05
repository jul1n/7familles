"use client";

import React from "react";
import { paths, type Lang } from "@/lib/content";
import { UI } from "@/lib/ui";
import { asset } from "@/lib/asset";
import { CFBR_URL, gameAuthors } from "@/lib/links";
import { footerResources } from "@/lib/card-links";

// Liens de bas de page (règles, ressources générales, CFBR, auteurs ; logos partenaires et impression sont déjà dans la barre du haut), partagés par la mosaïque et le carrousel.
// La variante « compact » tient en une bande discrète sous les pastilles du carrousel.
export default function ResourcesNav({
  lang,
  compact = false,
  className = "",
}: {
  lang: Lang;
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
        {footerResources(lang).map((l) => (
          <li key={l.url}>
            <a href={l.url} target="_blank" rel="noopener noreferrer" title={l.description} className={link}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <p className={`${compact ? "mt-1" : "mt-3"} flex flex-wrap items-center justify-center gap-x-4 gap-y-1`}>
        <a href={CFBR_URL} target="_blank" rel="noopener noreferrer" className={link}>
          {t.cfbrSite}
        </a>
        <span className="text-stone-600 font-medium">
          {t.rulesAuthors} : {gameAuthors(lang).map((a) => a.name).join(" • ")}
        </span>
      </p>
    </nav>
  );
}
