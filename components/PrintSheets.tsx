"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { FAMILIES, CARDS, CardData } from "@/data/cards";
import { asset, thumb } from "@/lib/asset";
import { GLOBAL_LINKS, cardLinks, englishTerm } from "@/lib/links";

interface PrintSheetsProps {
  cards: CardData[];
  booklet?: boolean; // dossier complet : page de garde, mosaïque, puis une page par carte
  markdownFor: (card: CardData) => string;
}

// Fiches imprimables : une page A4 par carte (visibles uniquement à l'impression).
function CoverPage() {
  return (
    <section className="print-sheet flex flex-col items-center justify-center text-center" style={{ minHeight: "255mm" }}>
      <div className="h-1.5 w-40 rounded-full bg-gradient-to-r from-[#1b5d78] via-[#247c9e] to-[#22c55e] mb-10" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/cfbr-logo.png")} alt="Logo du CFBR" className="h-28 w-auto mb-10" />
      <h1 className="text-5xl font-extrabold tracking-tight text-[#1b5d78]">7 Familles des Barrages</h1>
      <p className="mt-3 text-2xl font-semibold text-stone-700">1926 – 2026</p>
      <p className="mt-10 text-lg font-medium text-stone-800">Comité Français des Barrages et Réservoirs</p>
      <p className="mt-1 text-sm text-stone-600">
        Comité français de la CIGB / ICOLD, la Commission Internationale des Grands Barrages
      </p>
      <p className="mt-12 max-w-[12cm] text-sm leading-relaxed text-stone-700">
        Un jeu de 42 cartes réparties en 7 familles pour découvrir les barrages, leurs métiers, leurs usages, leurs
        composants, leurs types, et quelques ouvrages célèbres en France et dans le monde.
      </p>
      <div className="mt-16 text-xs text-stone-600 space-y-0.5">
        {GLOBAL_LINKS.map((l) => (
          <p key={l.url}>
            {l.label} : {l.url}
          </p>
        ))}
      </div>
    </section>
  );
}

// Mosaïque des 42 cartes sur deux pages : 4 familles puis 3 familles, un rang par famille
function OverviewPages() {
  const pages = [FAMILIES.slice(0, 4), FAMILIES.slice(4)];
  return (
    <>
      {pages.map((fams, pi) => (
        <section key={pi} className="print-sheet">
          <h2 className="text-lg font-extrabold mb-3 text-[#1b5d78]">Les 42 cartes ({pi + 1}/2)</h2>
          <div className="space-y-3">
            {fams.map((fam) => (
              <div key={fam.id}>
                <p className="text-xs font-bold mb-1" style={{ color: fam.color }}>
                  {fam.name}
                </p>
                <div className="grid grid-cols-6 gap-1.5">
                  {CARDS.filter((c) => c.familyId === fam.id).map((c) => (
                    <figure key={c.id} className="text-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={thumb(c.frontImage)} alt="" className="w-full h-auto" />
                      <figcaption className="mt-0.5 text-[7pt] leading-tight font-medium">
                        {c.num}. {c.title}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}

export default function PrintSheets({ cards, booklet, markdownFor }: PrintSheetsProps) {
  return (
    <div id="print-root" className="hidden print:block text-stone-900">
      {booklet && (
        <>
          <CoverPage />
          <OverviewPages />
        </>
      )}
      {cards.map((card) => (
        <article key={card.id} className="print-sheet">
          <header className="flex items-center justify-between border-b-2 pb-2 mb-4" style={{ borderColor: card.familyColor }}>
            <span className="text-sm font-bold" style={{ color: card.familyColor }}>
              Famille {card.familyName} • Carte n°{card.num}
            </span>
            <span className="text-xs text-stone-500">7 Familles des Barrages • CFBR 1926–2026</span>
          </header>
          <div className="flex gap-6 items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(card.frontImage)} alt={`Carte ${card.title}`} className="w-[6.5cm] h-auto flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-extrabold mb-1">{card.title}</h1>
              {card.location && <p className="text-xs text-stone-600 mb-2">{card.location}</p>}
              <p className="text-sm font-medium mb-3">{card.shortDescription}</p>
              <div className="card-prose card-prose-sm">
                <ReactMarkdown>{markdownFor(card)}</ReactMarkdown>
              </div>
            </div>
          </div>
          <footer className="mt-4 pt-2 border-t border-stone-300 text-[10px] text-stone-600 space-y-0.5">
            {englishTerm(card) && (
              <p>
                <strong>En anglais :</strong> {englishTerm(card)}
              </p>
            )}
            <p>
              <strong>En savoir plus :</strong>{" "}
              {cardLinks(card).map((l) => `${l.label} (${l.url})`).join(" • ")}
            </p>
            {card.credits && <p className="italic">Crédit photo : {card.credits}</p>}
          </footer>
        </article>
      ))}
    </div>
  );
}
