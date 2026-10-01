"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import type { CardData } from "@/data/cards";
import { asset } from "@/lib/asset";
import { cardLinks, englishTerm } from "@/lib/links";

interface PrintSheetsProps {
  cards: CardData[];
  markdownFor: (card: CardData) => string;
}

// Fiches imprimables : une page A4 par carte (visibles uniquement à l'impression).
export default function PrintSheets({ cards, markdownFor }: PrintSheetsProps) {
  return (
    <div id="print-root" className="hidden print:block text-stone-900">
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
            {card.credits && <p className="italic">Crédits : {card.credits}</p>}
          </footer>
        </article>
      ))}
    </div>
  );
}
