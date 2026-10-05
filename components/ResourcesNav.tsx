"use client";

import React from "react";
import { paths, type Lang } from "@/lib/content";
import { UI } from "@/lib/ui";
import { asset } from "@/lib/asset";
import { gameAuthors } from "@/lib/links";

// Pied de page : règles du jeu et auteurs (logos partenaires, impression et liens du CFBR sont déjà ailleurs), partagés par la mosaïque et le carrousel.
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
      <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
        <a href={asset(paths.rules(lang))} className={link}>
          {t.rules}
        </a>
        {/* Auteurs en une ligne discrète, pas sur téléphone */}
        <span className="hidden text-[11px] font-medium text-stone-600 sm:inline">
          {gameAuthors(lang).map((a) => a.name).join(" · ")}
        </span>
      </p>
    </nav>
  );
}
