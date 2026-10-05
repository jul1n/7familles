"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { CardData } from "@/data/cards";
import type { Lang } from "@/lib/content";
import { UI } from "@/lib/ui";
import { thumb } from "@/lib/asset";
import { searchCards } from "@/lib/search";
import { trackEvent } from "@/lib/analytics";

// Recherche plein texte dans les 42 cartes : s'ouvre depuis l'en-tête, la mosaïque ou la touche « / »
export default function SearchDialog({
  cards,
  lang,
  onPick,
  onClose,
}: {
  cards: CardData[];
  lang: Lang;
  onPick: (card: CardData) => void;
  onClose: () => void;
}) {
  const t = UI[lang];
  const [query, setQuery] = useState("");
  const hits = useMemo(() => searchCards(cards, query), [cards, query]);
  const input = useRef<HTMLInputElement>(null);
  const tracked = useRef(false);

  useEffect(() => input.current?.focus(), []);
  // Une seule mesure par ouverture, sans le texte tapé
  useEffect(() => {
    if (hits.length > 0 && !tracked.current) {
      tracked.current = true;
      trackEvent("evt/recherche");
    }
  }, [hits.length]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-stone-900/40 p-3 pt-[8dvh] print:hidden sm:p-6 sm:pt-[10dvh]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.search}
        className="flex max-h-[80dvh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white text-stone-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            onClose();
          }
          if (e.key === "Enter" && hits[0] && e.target === input.current) onPick(hits[0].card);
        }}
      >
        <div className="flex items-center gap-2 border-b border-stone-200 px-3">
          <Search className="h-4 w-4 flex-shrink-0 text-stone-500" aria-hidden />
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label={t.search}
            enterKeyHint="search"
            autoComplete="off"
            spellCheck={false}
            className="h-12 min-w-0 flex-1 bg-transparent text-base text-stone-900 outline-none placeholder:text-stone-400 [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={t.searchClose}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div role="status" aria-live="polite" className="sr-only">
          {query.trim().length > 1 ? (hits.length ? t.searchCount(hits.length) : t.searchNone) : ""}
        </div>

        <ul className="flex-1 overflow-y-auto p-2">
          {query.trim().length > 1 && hits.length === 0 && <li className="px-3 py-6 text-center text-sm text-stone-600">{t.searchNone}</li>}
          {hits.map(({ card, snippet }) => (
            <li key={card.id}>
              <button
                type="button"
                onClick={() => onPick(card)}
                className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb(card.frontImage)} alt="" loading="lazy" className="h-16 w-11 flex-shrink-0 rounded object-contain" />
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-sm font-bold text-stone-900">
                    <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: card.familyColor }} aria-hidden />
                    {card.title}
                    <span className="text-xs font-medium text-stone-500">{card.familyName}</span>
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-xs text-stone-600">{snippet}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
