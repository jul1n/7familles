"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { BIMBAMBOUM } from "@/lib/links";
import { UI } from "@/lib/ui";
import type { Lang } from "@/lib/content";

interface AgencyCreditProps {
  className?: string;
  placement?: "top" | "bottom";
  align?: "center" | "right";
  lang?: Lang;
  children?: React.ReactNode; // déclencheur personnalisé (ex. le logo) ; par défaut, le texte du crédit
}

// Crédit des illustrations et du design des cartes, avec une infobulle (survol ou clavier) qui présente l'agence.
// L'infobulle touche son déclencheur (le vide est comblé par un remplissage transparent) : on peut y descendre
// avec la souris et cliquer sur les liens LinkedIn et Instagram sans qu'elle disparaisse.
export default function AgencyCredit({ className = "", placement = "top", align = "center", lang = "fr", children }: AgencyCreditProps) {
  const vertical = placement === "top" ? "bottom-full pb-2" : "top-full pt-2";
  const horizontal = align === "right" ? "right-0" : "left-1/2 -translate-x-1/2";
  return (
    <span className={`group relative inline-block ${className}`}>
      <a
        href={BIMBAMBOUM.instagram}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={children ? `${BIMBAMBOUM.name} (Instagram)` : undefined}
        className={
          children
            ? "block rounded-full focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
            : "underline decoration-dotted underline-offset-2 hover:decoration-solid focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none rounded"
        }
      >
        {children ?? `${UI[lang].agencyCredit} : ${BIMBAMBOUM.name}`}
      </a>
      <span
        role="tooltip"
        className={`absolute ${horizontal} ${vertical} z-50 w-72 max-w-[85vw] opacity-0 invisible transition-[opacity,visibility] duration-150 group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible`}
      >
        <span className="block rounded-xl bg-stone-900 px-3.5 py-3 text-left text-[11px] font-medium leading-snug text-white shadow-xl not-italic">
          <strong className="block text-xs mb-1">{BIMBAMBOUM.name}</strong>
          {lang === "fr" ? BIMBAMBOUM.description : UI.en.agencyDesc}
          <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold">
            <a
              href={BIMBAMBOUM.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-cyan-200 underline underline-offset-2"
            >
              LinkedIn <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={BIMBAMBOUM.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-cyan-200 underline underline-offset-2"
            >
              Instagram {BIMBAMBOUM.handle} <ExternalLink className="w-3 h-3" />
            </a>
          </span>
        </span>
      </span>
    </span>
  );
}
