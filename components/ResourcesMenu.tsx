"use client";

import React, { useEffect, useRef, useState } from "react";
import { BookOpen, Printer, X } from "lucide-react";
import { paths, type Lang } from "@/lib/content";
import { UI } from "@/lib/ui";
import { asset } from "@/lib/asset";
import { GLOBAL_LINKS, gameAuthors } from "@/lib/links";
import { RESOURCE_LINKS, RESOURCE_LINKS_EN } from "@/lib/card-links";
import AgencyCredit from "@/components/AgencyCredit";

// Variante « menu flottant » du pied de page : un seul bouton, et les liens se déploient vers le haut en cascade.
// L'ancienne bande de liens reste disponible dans ResourcesNav (voir FOOTER_STYLE dans Experience7Familles).
export default function ResourcesMenu({ lang, onPrintAll }: { lang: Lang; onPrintAll: () => void }) {
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

  const resources = lang === "fr" ? RESOURCE_LINKS : RESOURCE_LINKS_EN;
  const link = "block rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#1b5d78] hover:bg-[#1b5d78]/10 focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none";
  const heading = "px-2.5 pb-0.5 pt-2 text-[10px] font-bold uppercase tracking-wider text-stone-500";
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

        <p className={`${heading} ${row}`} style={step(i++)}>{t.furtherReading}</p>
        {resources.map((l) => (
          <div key={l.url} className={row} style={step(i++)}>
            <a href={l.url} target="_blank" rel="noopener noreferrer" title={l.description} className={link}>
              {l.label}
            </a>
          </div>
        ))}

        <p className={`${heading} ${row}`} style={step(i++)}>CFBR</p>
        {GLOBAL_LINKS.map((l) => (
          <div key={l.url} className={row} style={step(i++)}>
            <a href={l.url} target="_blank" rel="noopener noreferrer" className={link}>
              {lang === "en" && l.url.includes("barrages-cfbr") ? t.cfbrSite : l.label}
            </a>
          </div>
        ))}

        <p className={`${heading} ${row}`} style={step(i++)}>{t.rulesAuthors}</p>
        <div className={`px-2.5 pb-1 text-xs text-stone-600 ${row}`} style={step(i++)}>
          <AgencyCredit lang={lang} className="font-medium" />
          <p className="mt-1">{gameAuthors(lang).map((a) => a.name).join(" • ")}</p>
        </div>

        <div className={row} style={step(i++)}>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onPrintAll();
            }}
            className={`${link} mt-1 flex w-full items-center gap-2 border-t border-stone-200 pt-2 text-left`}
          >
            <Printer className="h-4 w-4" aria-hidden /> {t.printAll}
          </button>
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
