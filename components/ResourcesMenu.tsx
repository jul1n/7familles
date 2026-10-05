"use client";

import React, { useEffect, useRef, useState } from "react";
import { BookOpen, X } from "lucide-react";
import { paths, type Lang } from "@/lib/content";
import { UI } from "@/lib/ui";
import { asset } from "@/lib/asset";
import { gameAuthors } from "@/lib/links";

// Variante « menu flottant » du pied de page : un seul bouton, et les liens se déploient vers le haut en cascade.
// L'ancienne bande de liens reste disponible dans ResourcesNav (voir FOOTER_STYLE dans Experience7Familles).
export default function ResourcesMenu({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  // Fermeture au clic extérieur et avec Échap
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const link = "block rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#1b5d78] hover:bg-[#1b5d78]/10 focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none";
  // Chaque ligne apparaît avec un léger décalage : effet de cascade à l'ouverture
  const step = (i: number): React.CSSProperties => ({ transitionDelay: open ? `${60 + i * 28}ms` : "0ms" });
  const row = `transition duration-300 ease-out ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`;
  let i = 0;

  return (
    <div ref={root} className="relative">
      <div
        id="resources-menu"
        role="region"
        aria-label={t.resources}
        inert={!open}
        className={`absolute bottom-full right-0 z-30 mb-3 w-[min(20rem,calc(100vw-2rem))] origin-bottom-right overflow-y-auto rounded-2xl border border-stone-200/90 bg-white/95 p-2 shadow-2xl backdrop-blur-xl transition duration-300 ease-out max-h-[min(70dvh,32rem)] ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0"
        }`}
      >
        <div className={row} style={step(i++)}>
          <a href={asset(paths.rules(lang))} className={`${link} flex items-center gap-2 bg-[#1b5d78]/5`}>
            <BookOpen className="h-4 w-4" aria-hidden /> {t.rules}
          </a>
        </div>

        <div className={`hidden px-2.5 pb-1 pt-1 text-[11px] text-stone-600 sm:block ${row}`} style={step(i++)}>
          {gameAuthors(lang).map((a) => a.name).join(" · ")}
        </div>

      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="resources-menu"
        aria-label={t.resources}
        title={t.resources}
        className={`flex h-11 items-center gap-2 rounded-xl border px-3.5 text-xs font-bold shadow-lg backdrop-blur-xl transition focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none ${
          open ? "border-[#1b5d78] bg-[#1b5d78] text-white" : "border-stone-300 bg-white/95 text-stone-800 hover:bg-stone-50"
        }`}
      >
        {open ? <X className="h-4 w-4" aria-hidden /> : <BookOpen className="h-4 w-4 text-[#1b5d78]" aria-hidden />}
        <span>{t.resources}</span>
      </button>
    </div>
  );
}
