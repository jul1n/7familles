import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { CardData } from "@/data/cards";
import { asset } from "@/lib/asset";
import { cardLinks, otherLanguageTerm } from "@/lib/links";
import { paths, type Lang } from "@/lib/content";
import { UI } from "@/lib/ui";
import { textOnCream } from "@/lib/color";
import LegalFooter from "@/components/LegalFooter";

// Page de lecture « simple » d'une carte : texte complet, indexable, sans la scène 3D.
// Sert aussi de version accessible et de lien partageable (la scène s'ouvre via ?carte=<id>).
export default function StaticArticle({ card, siblings, lang = "fr" }: { card: CardData; siblings: CardData[]; lang?: Lang }) {
  const t = UI[lang];
  const idx = siblings.findIndex((c) => c.id === card.id);
  const prev = siblings[(idx - 1 + siblings.length) % siblings.length];
  const next = siblings[(idx + 1) % siblings.length];
  const links = cardLinks(card, lang);
  const term = otherLanguageTerm(card, lang)?.term;
  // Le titre « # … » du Markdown est repris dans le <h1> de la page
  const body = card.contentMarkdown.replace(/^#\s.*\n+/, "");

  return (
    <div className="h-dvh overflow-y-auto bg-[#F7F5F0] text-stone-900">
      <div className="h-[3px] w-full bg-gradient-to-r from-[#1b5d78] via-[#247c9e] to-[#22c55e]" />
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
        <Link href={paths.home(lang)} className="inline-flex items-center gap-3 rounded-lg focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/cfbr-logo.png")} alt="" className="h-9 w-auto" />
          <span className="text-sm font-bold">{t.siteName}</span>
        </Link>
        <Link
          href={`${paths.home(lang)}?carte=${card.id}`}
          className="inline-flex min-h-[44px] items-center rounded-xl bg-[#1b5d78] px-4 text-xs font-semibold text-white focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
        >
          {t.seeCard3d}
        </Link>
      </header>

      <main className="mx-auto grid max-w-5xl gap-8 px-4 pb-16 md:grid-cols-[320px_1fr]">
        <div className="md:sticky md:top-4 md:self-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset(card.frontImage)}
            alt={`${t.cardAlt(card.num, card.title)} (${t.familyOf(card.familyName)})`}
            width={716}
            height={1022}
            className="mx-auto h-auto w-full max-w-[320px] drop-shadow-[0_8px_14px_rgba(60,45,20,0.25)]"
          />
        </div>

        <article>
          <p className="text-sm font-semibold" style={{ color: textOnCream(card.familyColor) }}>
            <Link href={paths.family(lang, card.familyId)} className="underline-offset-2 hover:underline">
              {t.familyOf(card.familyName)}
            </Link>{" "}
            · {t.cardNo(card.num)}
            {card.location ? ` · ${card.location}` : ""}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{card.title}</h1>
          <p className="mt-4 rounded-xl border border-stone-200 bg-[#F5F2EB] p-4 text-base font-medium leading-relaxed text-stone-800">
            {card.shortDescription}
          </p>
          <h2 className="sr-only">{t.cardSheetHeading}</h2>
          <div className="card-prose mt-4">
            <ReactMarkdown>{body}</ReactMarkdown>
          </div>

          <nav aria-label={t.moreLinks} className="mt-6 border-t border-stone-200 pt-4">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-stone-600">{t.moreLinks}</h2>
            <ul className="flex flex-wrap gap-2">
              {links.map((l) => (
                <li key={l.url}>
                  <a
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center rounded-lg border border-[#1b5d78]/20 bg-[#1b5d78]/10 px-3 text-xs font-semibold text-[#1b5d78] focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {term && (
            <p className="mt-4 border-t border-stone-200 pt-4 text-sm text-stone-700">
              <span className="mr-2 text-xs font-bold uppercase tracking-wide text-stone-600">{t.inOtherLang}</span>
              <span lang={lang === "fr" ? "en" : "fr"} className="font-semibold">{term}</span>
            </p>
          )}
          {card.credits && <p className="mt-6 text-xs italic text-stone-600">{t.creditPhoto} : {card.credits}</p>}

          <nav aria-label={t.prevNextNav} className="mt-8 flex justify-between gap-3 border-t border-stone-200 pt-4 text-sm font-semibold">
            <Link href={paths.card(lang, prev.id)} className="text-[#1b5d78] hover:underline">
              ← {prev.title}
            </Link>
            <Link href={paths.card(lang, next.id)} className="text-[#1b5d78] hover:underline">
              {next.title} →
            </Link>
          </nav>
        </article>
      </main>
      <LegalFooter lang={lang} />
    </div>
  );
}
