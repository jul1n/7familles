"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import type { CardData } from "@/data/cards";
import { getContent, type Lang } from "@/lib/content";
import { UI } from "@/lib/ui";
import { thumb } from "@/lib/asset";
import { Search, Trophy } from "lucide-react";
import ResourcesNav from "@/components/ResourcesNav";

interface MosaicViewProps {
  visible?: boolean;
  onOpenCard: (card: CardData) => void;
  onSearch: () => void;
  onQuiz?: (familyId: string | null) => void;
  notice?: string; // ex. : affichage 3D indisponible sur cet appareil
  lang?: Lang;
}

// Vue « mosaïque » : les 42 cartes côte à côte, regroupées par famille, cliquables.
export default function MosaicView({ visible = true, onOpenCard, onSearch, onQuiz, notice, lang = "fr" }: MosaicViewProps) {
  const t = UI[lang];
  const { FAMILIES, CARDS } = getContent(lang);
  const [activeFamilyId, setActiveFamilyId] = useState<string | null>(null);
  const scrollBox = useRef<HTMLDivElement>(null);
  const savedScroll = useRef(0);
  useLayoutEffect(() => {
    if (visible && scrollBox.current) scrollBox.current.scrollTop = savedScroll.current;
  }, [visible]);
  const families = activeFamilyId ? FAMILIES.filter((f) => f.id === activeFamilyId) : FAMILIES;

  return (
    <div
      ref={scrollBox}
      onScroll={(e) => { if (visible) savedScroll.current = e.currentTarget.scrollTop; }}
      className="absolute inset-0 overflow-y-auto overscroll-contain"
      role="region"
      aria-label={t.mosaicRegion}
    >
      {notice && (
        <p role="status" className="mx-auto max-w-6xl px-4 md:px-8 pt-3 text-xs font-medium text-stone-700">
          {notice}
        </p>
      )}
      {/* Filtre par famille */}
      <div className="sticky top-0 z-10 px-4 md:px-8 pt-3 pb-2 bg-gradient-to-b from-[#F7F5F0] via-[#F7F5F0]/95 to-transparent">
        <div
          role="group"
          aria-label={t.filterByFamily}
          className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-6xl mx-auto"
        >
          <button
            onClick={onSearch}
            aria-label={t.search}
            className="flex min-h-[44px] flex-shrink-0 items-center gap-1.5 rounded-xl border border-[#1b5d78] bg-[#1b5d78] px-3.5 text-xs font-semibold text-white focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
          >
            <Search className="h-4 w-4" aria-hidden />
            {t.search}
          </button>
          {onQuiz && (
            <button
              onClick={() => onQuiz?.(activeFamilyId)}
              aria-label={t.quiz.open}
              className="flex min-h-[44px] flex-shrink-0 items-center gap-1.5 rounded-xl border border-amber-700 bg-amber-700 px-3.5 text-xs font-semibold text-white focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:outline-none"
            >
              <Trophy className="h-4 w-4" aria-hidden />
              {t.quiz.open}
            </button>
          )}

        </div>
        <label className="flex max-w-6xl mx-auto mt-2 flex-col gap-1 text-xs font-semibold text-stone-700">
          {t.chooseFamily}
          <select value={activeFamilyId ?? ""} onChange={(e) => { savedScroll.current = 0; setActiveFamilyId(e.target.value || null); e.currentTarget.closest('[role="region"]')?.scrollTo({ top: 0 }); }} className="min-h-[44px] w-full rounded-xl border border-stone-300 bg-white px-3 text-sm text-stone-900 focus-visible:ring-2 focus-visible:ring-[#1b5d78]">
            <option value="">{t.allCards}</option>
            {FAMILIES.map((fam) => <option key={fam.id} value={fam.id}>{fam.name}</option>)}
          </select>
        </label>
      </div>

      <div className="px-4 md:px-8 pb-10 max-w-6xl mx-auto">
        {families.map((fam, famIndex) => {
          const cards = CARDS.filter((c) => c.familyId === fam.id);
          return (
            <section key={fam.id} className="mt-5" aria-label={t.familyLabel(fam.name)}>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="w-1.5 h-5 rounded-full self-center" style={{ backgroundColor: fam.color }} />
                <h2 className="text-base md:text-lg font-extrabold tracking-tight text-stone-900">{fam.name}</h2>
                <p className="hidden md:block text-xs text-stone-600 truncate">{fam.description}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                {cards.map((card, i) => (
                  <button
                    key={card.id}
                    onClick={() => onOpenCard(card)}
                    className="mosaic-card group relative block w-full rounded-2xl focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:ring-offset-2 focus-visible:outline-none"
                    style={{ animationDelay: `${Math.min(i * 40, 240)}ms` }}
                    aria-label={t.openCard(card.num, card.title)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={thumb(card.frontImage)}
                      alt={t.cardAlt(card.num, card.title)}
                      // Les premières cartes (visibles sans défiler) sont chargées tout de suite : meilleur premier affichage
                      loading={famIndex === 0 && i < 4 ? "eager" : "lazy"}
                      fetchPriority={famIndex === 0 && i < 2 ? "high" : "auto"}
                      decoding="async"
                      draggable={false}
                      className="w-full h-auto aspect-[7/10] object-contain drop-shadow-[0_6px_10px_rgba(60,45,20,0.22)] transition duration-300 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.04] group-hover:drop-shadow-[0_14px_20px_rgba(60,45,20,0.3)] group-active:scale-[0.98]"
                    />
                    <span className="mt-2 block text-center text-xs md:text-[13px] font-semibold leading-tight text-stone-800">
                      <span className="text-stone-600">{card.num}.</span> {card.title}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          );
        })}

        <ResourcesNav lang={lang} className="mt-10" />
      </div>
    </div>
  );
}
