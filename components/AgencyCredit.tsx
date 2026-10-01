"use client";

import React from "react";
import { ExternalLink } from "lucide-react";
import { BIMBAMBOUM } from "@/lib/links";

// Crédit des illustrations et du design des cartes, avec une infobulle (survol ou clavier) qui présente l'agence.
export default function AgencyCredit({ className = "", placement = "top" }: { className?: string; placement?: "top" | "bottom" }) {
  const position = placement === "top" ? "bottom-full mb-2" : "top-full mt-2";
  return (
    <span className={`group relative inline-block ${className}`}>
      <a
        href={BIMBAMBOUM.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-dotted underline-offset-2 hover:decoration-solid focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none rounded"
      >
        Illustrations et design des cartes : {BIMBAMBOUM.name}
      </a>
      <span
        role="tooltip"
        className={`absolute left-1/2 -translate-x-1/2 ${position} z-50 w-72 max-w-[85vw] rounded-xl bg-stone-900 px-3.5 py-3 text-left text-[11px] font-medium leading-snug text-white shadow-xl opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto not-italic`}
      >
        <strong className="block text-xs mb-1">{BIMBAMBOUM.name}</strong>
        {BIMBAMBOUM.description}
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
  );
}
