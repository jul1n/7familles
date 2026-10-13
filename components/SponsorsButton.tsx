"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Heart, X } from "lucide-react";
import type { Lang } from "@/lib/content";
import { asset } from "@/lib/asset";
import { ARCHITECTES_URL, BIMBAMBOUM } from "@/lib/links";
import { useFocusTrap } from "@/lib/use-focus-trap";

const groups = [
  { fr: "Partenaires", en: "Partners", color: "#1b5d78", logos: [
    ["aneb", "ANEB — Association nationale des élus des bassins"],
    ["cercle-francais-eau", "Cercle Français de l’Eau"],
    ["eau-agriculture-territoires", "Eau, Agriculture et Territoires"],
    ["hydro21", "Hydro21"], ["shf", "Société Hydrotechnique de France"],
  ] },
  { fr: "Sponsors or", en: "Gold sponsors", color: "#a87916", logos: [
    ["artelia", "Artelia"], ["cnr", "CNR"], ["edf", "EDF"], ["tractebel", "Tractebel ENGIE"],
  ] },
  { fr: "Sponsors argent", en: "Silver sponsors", color: "#687481", logos: [
    ["carpi", "Carpi"], ["egis", "Egis"], ["eiffage", "Eiffage"], ["hydroplus", "Hydroplus"],
    ["isl", "ISL Ingénierie"], ["razel-bec", "Razel-Bec"], ["soletanche-bachy", "Soletanche Bachy"], ["freyssinet", "Freyssinet"],
  ] },
  { fr: "Sponsors bronze", en: "Bronze sponsors", color: "#b65b38", logos: [
    ["brl", "BRL Ingénierie"], ["rives-eaux", "Rives & Eaux du Sud-Ouest"], ["scp", "Société du Canal de Provence"], ["watertracks", "Watertracks"],
  ] },
];

function ThanksDialog({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const fr = lang === "fr";
  const box = useRef<HTMLDivElement>(null);
  useFocusTrap(box);
  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-stone-900/50 p-3 backdrop-blur-sm sm:p-6 print:hidden" onClick={onClose}>
      <div ref={box} role="dialog" aria-modal="true" aria-labelledby="thanks-title" aria-describedby="thanks-description"
        className="flex max-h-[90dvh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-[#FDFBF7] text-stone-800 shadow-2xl"
        onClick={(event) => event.stopPropagation()} onKeyDown={(event) => { if (event.key !== "Tab") event.stopPropagation(); if (event.key === "Escape") onClose(); }}>
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-stone-200 p-5 sm:px-8 sm:py-6">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#1b5d78]">{fr ? "À leurs côtés" : "Together"}</p>
            <h2 id="thanks-title" className="text-2xl font-bold tracking-tight">{fr ? "Merci à nos sponsors et partenaires" : "Thank you to our sponsors and partners"}</h2>
            <p id="thanks-description" className="mt-2 text-sm leading-relaxed text-stone-600">{fr ? "Découvrez les partenaires et sponsors présentés dans le programme du CFBR, ainsi que Les Architectes de l’Eau et le studio Hello Bim Bam Boum." : "Meet the partners and sponsors featured in the CFBR programme, along with Les Architectes de l’Eau and the Hello Bim Bam Boum studio."}</p>
          </div>
          <button type="button" autoFocus onClick={onClose} aria-label={fr ? "Fermer les remerciements" : "Close acknowledgements"} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b5d78]"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto overscroll-contain p-5 sm:px-8 sm:py-6">
          <section className="mb-8" aria-labelledby="thanks-creators">
            <h3 id="thanks-creators" className="mb-3 text-sm font-bold text-[#1b5d78]">{fr ? "Autour du jeu" : "Around the game"}</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { name: "Les Architectes de l’Eau", logo: "architectes-de-leau.png", url: ARCHITECTES_URL, caption: fr ? "Découvrir Les Architectes de l’Eau" : "Meet Les Architectes de l’Eau" },
                { name: BIMBAMBOUM.name, logo: "hello-bim-bam-boum.png", url: BIMBAMBOUM.instagram, caption: fr ? "Illustrations et design des cartes" : "Card illustrations and design" },
              ].map((item) => <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 transition hover:border-[#1b5d78] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b5d78]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(`/logos/${item.logo}`)} alt="" className="h-16 w-24 shrink-0 object-contain" />
                <span><strong className="block text-sm">{item.name}</strong><span className="mt-1 block text-xs text-stone-500">{item.caption}</span><span className="sr-only">{fr ? " (nouvel onglet)" : " (new tab)"}</span></span>
              </a>)}
            </div>
          </section>
          {groups.map((group) => <section key={group.en} className="mb-7 last:mb-0" aria-label={fr ? group.fr : group.en}>
            <h3 className="mb-3 border-b pb-2 text-sm font-bold uppercase tracking-widest" style={{ color: group.color, borderColor: `${group.color}40` }}>{fr ? group.fr : group.en}</h3>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {group.logos.map(([id, name]) => <li key={id} className="flex min-w-0 flex-col items-center justify-between rounded-2xl border border-stone-200/80 bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(`/logos/sponsors/${id}.png`)} alt={name} loading="lazy" className="h-20 w-full object-contain" />
                <span aria-hidden="true" className="mt-2 text-center text-[11px] font-medium leading-snug text-stone-500">{name}</span>
              </li>)}
            </ul>
          </section>)}
        </div>
      </div>
    </div>, document.body,
  );
}

export default function SponsorsButton({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const title = lang === "fr" ? "Merci à" : "Thanks to";
  return <>
    <button type="button" onClick={() => setOpen(true)} aria-label={lang === "fr" ? "Merci à nos sponsors et partenaires" : "Thanks to our sponsors and partners"} aria-haspopup="dialog" aria-expanded={open} title={title}
      className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-stone-200/90 bg-white/95 px-2.5 text-xs font-semibold text-[#1b5d78] shadow-xs transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b5d78]">
      <Heart className="h-4 w-4" /><span className="hidden lg:inline">{title}</span>
    </button>
    {open && <ThanksDialog lang={lang} onClose={() => setOpen(false)} />}
  </>;
}
