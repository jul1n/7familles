"use client";

import React from "react";
import { paths, type Lang } from "@/lib/content";
import { UI } from "@/lib/ui";
import { asset } from "@/lib/asset";
import { LEGAL_URL, gameAuthors } from "@/lib/links";

// Pied de page de la mosaïque : règles du jeu, mentions légales du CFBR et auteurs (logos partenaires, impression
// et liens du CFBR sont déjà dans la barre du haut).
export default function ResourcesNav({
  lang,
  className = "",
}: {
  lang: Lang;
  className?: string;
}) {
  const t = UI[lang];
  const link = "underline underline-offset-2";
  return (
    <nav aria-label={t.resources} className={`text-xs font-semibold text-[#1b5d78] ${className}`}>
      <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <a href={asset(paths.rules(lang))} className={`${link} inline-flex min-h-[44px] items-center px-2`}>
          {t.rules}
        </a>
        <a href={LEGAL_URL} target="_blank" rel="noopener noreferrer" className={`${link} inline-flex min-h-[44px] items-center px-2`}>
          {t.legal}
        </a>
        {/* Auteurs en une ligne discrète, pas sur téléphone */}
        <span className="hidden text-xs font-medium text-stone-600 sm:inline">
          {gameAuthors(lang).map((a) => a.name).join(" · ")}
        </span>
      </p>
    </nav>
  );
}
