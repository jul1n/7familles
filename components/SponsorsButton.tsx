"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Heart, X } from "lucide-react";
import type { Lang } from "@/lib/content";
import { asset } from "@/lib/asset";
import AgencyCredit from "@/components/AgencyCredit";
import { ARCHITECTES_URL, BIMBAMBOUM } from "@/lib/links";
import { useFocusTrap } from "@/lib/use-focus-trap";

type Logo = [file: string, name: string, url: string];
const groups: { fr: string; en: string; color: string; logos: Logo[] }[] = [
  { fr: "Sponsors or", en: "Gold sponsors", color: "#a87916", logos: [
    ["artelia.png", "Artelia", "https://www.arteliagroup.com/"],
    ["cnr.svg", "CNR", "https://www.cnr.tm.fr/"],
    ["edf.svg", "EDF", "https://www.edf.fr/"],
    ["tractebel.svg", "Tractebel ENGIE", "https://tractebel-engie.com/"],
  ] },
  { fr: "Sponsors argent", en: "Silver sponsors", color: "#687481", logos: [
    ["carpi.png", "Carpi", "https://www.carpitech.com/"],
    ["egis.png", "Egis", "https://www.egis-group.com/"],
    ["eiffage.svg", "Eiffage", "https://www.eiffage.com/"],
    ["hydroplus.png", "Hydroplus", "https://www.hydroplus.com/"],
    ["isl.png", "ISL Ingénierie", "https://isl.fr/"],
    ["razel-bec.png", "Razel-Bec", "https://razel-bec.fayat.com/"],
    ["soletanche-bachy.png", "Soletanche Bachy", "https://www.soletanche-bachy.com/"],
    ["freyssinet.png", "Freyssinet", "https://www.freyssinet.com/"],
  ] },
  { fr: "Sponsors bronze", en: "Bronze sponsors", color: "#b65b38", logos: [
    ["brl.png", "BRL Ingénierie", "https://www.brl.fr/fr/brl-ingenierie"],
    ["rives-eaux.png", "Rives & Eaux du Sud-Ouest", "https://www.riveseteaux.fr/"],
    ["scp.jpg", "Société du Canal de Provence", "https://canaldeprovence.com/"],
    ["watertracks.png", "Watertracks", "https://www.watertracks.fr/"],
  ] },
  { fr: "Partenaires", en: "Partners", color: "#1b5d78", logos: [
    ["aneb.png", "ANEB — Association nationale des élus des bassins", "https://bassinversant.org/"],
    ["cercle-francais-eau.png", "Cercle Français de l’Eau", "https://www.cerclefrancaisdeleau.fr/"],
    ["eau-agriculture-territoires.png", "Eau, Agriculture et Territoires", "https://www.eau-agriculture-et-territoires.com/"],
    ["hydro21.png", "Hydro21", "https://www.hydro21.org/"],
    ["shf.png", "Société Hydrotechnique de France", "https://www.shf-hydro.org/"],
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
          {groups.map((group) => <section key={group.en} className="mb-7 last:mb-0" aria-label={fr ? group.fr : group.en}>
            <h3 className="mb-3 border-b pb-2 text-sm font-bold uppercase tracking-widest" style={{ color: group.color, borderColor: `${group.color}40` }}>{fr ? group.fr : group.en}</h3>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {group.logos.map(([file, name, url]) => <li key={file} className="min-w-0">
                <a href={url} target="_blank" rel="noopener noreferrer" title={name} className="group flex h-full min-w-0 flex-col items-center justify-between rounded-2xl border border-stone-200/80 bg-white p-3 transition duration-200 hover:-translate-y-0.5 hover:border-[#1b5d78] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b5d78]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(`/logos/sponsors/${file}`)} alt="" loading="lazy" className="h-20 w-full object-contain transition duration-200 group-hover:scale-105" />
                  <span className="mt-2 text-center text-[11px] font-medium leading-snug text-stone-600">{name}<span className="sr-only">{fr ? " (site officiel, nouvel onglet)" : " (official website, new tab)"}</span></span>
                </a>
              </li>)}
            </ul>
          </section>)}
          <section className="mt-8" aria-labelledby="thanks-creators">
            <h3 id="thanks-creators" className="mb-3 border-b border-[#1b5d78]/25 pb-2 text-sm font-bold uppercase tracking-widest text-[#1b5d78]">{fr ? "Autour du jeu" : "Around the game"}</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <a href={ARCHITECTES_URL} target="_blank" rel="noopener noreferrer" title="Les Architectes de l’Eau" className="group flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#1b5d78] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b5d78]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset("/logos/architectes-de-leau-castor.png")} alt="" className="h-16 w-16 shrink-0 object-contain transition duration-200 group-hover:scale-105" />
                <span><strong className="block text-sm">Les Architectes de l’Eau</strong><span className="mt-1 block text-xs text-stone-600">{fr ? "Découvrir Les Architectes de l’Eau" : "Meet Les Architectes de l’Eau"}</span><span className="sr-only">{fr ? " (nouvel onglet)" : " (new tab)"}</span></span>
              </a>
              <div className="flex items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#1b5d78] hover:shadow-md">
                <AgencyCredit placement="top" align="center" lang={lang} className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset("/logos/hello-bim-bam-boum.png")} alt={BIMBAMBOUM.name} className="h-16 w-24 object-contain transition duration-200 hover:scale-105" />
                </AgencyCredit>
                <span><strong className="block text-sm">{BIMBAMBOUM.name}</strong><span className="mt-1 block text-xs text-stone-600">{fr ? "Illustrations et design des cartes" : "Card illustrations and design"}</span></span>
              </div>
            </div>
          </section>

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
      className="flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-stone-200/90 bg-white/95 px-2.5 text-xs font-semibold text-rose-600 shadow-xs transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b5d78]">
      <Heart className="h-4 w-4 fill-rose-500 text-rose-500" /><span className="hidden lg:inline">{title}</span>
    </button>
    {open && <ThanksDialog lang={lang} onClose={() => setOpen(false)} />}
  </>;
}
