"use client";

import React, { useState } from "react";
import { ExternalLink, Printer, Share2, ShoppingBag, Square, Volume2 } from "lucide-react";
import type { Lang } from "@/lib/content";
import type { UiText } from "@/lib/ui";
import { CFBR_CONTACT_URL, getCopyText } from "@/lib/links";

// Liens « en savoir plus » vers des pages externes (nouvel onglet)
export function MoreLinks({ links, t }: { links: { label: string; url: string; secondary?: boolean }[]; t: UiText }) {
  return (
    <nav aria-label={t.moreLinks} className="pt-4 border-t border-stone-200">
      <h3 className="text-xs font-bold uppercase tracking-wide text-stone-600 mb-2">{t.moreLinks}</h3>
      <ul className="flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.url}>
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-lg text-xs font-semibold focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none ${
                l.secondary
                  ? "text-stone-700 bg-stone-100 border border-stone-300 hover:bg-stone-200"
                  : "text-[#1b5d78] bg-[#1b5d78]/10 border border-[#1b5d78]/20 hover:bg-[#1b5d78]/15"
              }`}
            >
              {l.label}
              <ExternalLink className="w-3 h-3" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Actions de la fiche : écouter le texte à voix haute, imprimer la fiche
export function CardActions({
  isSpeaking,
  canSpeak,
  onToggleSpeak,
  onPrint,
  onShare,
  t,
  iconOnly = false,
}: {
  iconOnly?: boolean;
  t: UiText;
  onShare: () => void;
  isSpeaking: boolean;
  canSpeak: boolean;
  onToggleSpeak: () => void;
  onPrint: () => void;
}) {
  const btn =
    "inline-flex items-center gap-1.5 min-h-[44px] px-3.5 rounded-xl text-xs font-semibold border transition focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none";
  return (
    <div className="flex flex-wrap items-center gap-2">
      {canSpeak && (
        <button
          onClick={onToggleSpeak}
          aria-label={isSpeaking ? t.stop : t.listen}
          title={isSpeaking ? t.stop : t.listen}
          aria-pressed={isSpeaking}
          className={`${btn} ${
            isSpeaking
              ? "bg-[#1b5d78] text-white border-[#1b5d78]"
              : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
          }`}
        >
          {isSpeaking ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-4 h-4" />}
          <span className={iconOnly ? "sr-only" : undefined}>{isSpeaking ? t.stop : t.listen}</span>
        </button>
      )}
      <button onClick={onShare} aria-label={t.share} title={t.share} className={`${btn} bg-white text-stone-700 border-stone-200 hover:bg-stone-50`}>
        <Share2 className="w-4 h-4" />
        <span className={iconOnly ? "sr-only" : undefined}>{t.share}</span>
      </button>
      <button onClick={onPrint} aria-label={t.print} title={t.print} className={`${btn} bg-white text-stone-700 border-stone-200 hover:bg-stone-50`}>
        <Printer className="w-4 h-4" />
        <span className={iconOnly ? "sr-only" : undefined}>{t.print}</span>
      </button>
    </div>
  );
}

// Bouton « Se procurer le jeu » : infobulle au survol, au focus et au clic, lien vers la page contact du CFBR
export function GetCopyButton({ t, lang }: { t: UiText; lang: Lang }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="group relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="get-copy-pop"
        title={t.getCopyLabel}
        aria-label={t.getCopy}
        className="min-h-[44px] px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 shadow-xs transition flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
      >
        <ShoppingBag className="w-4 h-4" />
        <span className="topbar-action-label hidden lg:inline">{t.getCopy}</span>
      </button>
      <div
        id="get-copy-pop"
        role="region"
        aria-label={t.getCopyLabel}
        className={`absolute right-0 top-full z-50 mt-2 w-72 rounded-xl bg-stone-900 p-3 text-left text-xs font-medium leading-snug text-white shadow-lg transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
        }`}
      >
        <p>{getCopyText(lang)}</p>
        <a
          href={CFBR_CONTACT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-white px-3 font-semibold text-[#1b5d78] focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
        >
          {t.contactCfbr}
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

// Drapeaux (SVG : les emojis de drapeaux ne s'affichent pas sous Windows) : Royaume-Uni sur le site français,
// France sur le site anglais
function FrFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} role="img" aria-label="French flag">
      <rect width="20" height="40" fill="#0055A4" />
      <rect x="20" width="20" height="40" fill="#fff" />
      <rect x="40" width="20" height="40" fill="#EF4135" />
    </svg>
  );
}

function UKFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} role="img" aria-label="Drapeau du Royaume-Uni">
      <clipPath id="uk-clip">
        <rect width="60" height="40" />
      </clipPath>
      <g clipPath="url(#uk-clip)">
        <rect width="60" height="40" fill="#012169" />
        <path d="M0 0L60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
        <path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" strokeWidth="3" />
        <path d="M30 0V40M0 20H60" stroke="#fff" strokeWidth="13" />
        <path d="M30 0V40M0 20H60" stroke="#C8102E" strokeWidth="7" />
      </g>
    </svg>
  );
}

// Terme anglais de la carte, en fin de fiche
export function EnglishTerm({ term, wiki, t, lang }: { term?: string; wiki?: { label: string; url: string }; t: UiText; lang: Lang }) {
  if (!term) return null;
  return (
    <p className="pt-4 border-t border-stone-200 text-sm text-stone-700">
      {lang === "fr" ? (
        <UKFlag className="inline-block w-5 h-[14px] rounded-[2px] shadow-sm mr-2 align-[-2px]" />
      ) : (
        <FrFlag className="inline-block w-5 h-[14px] rounded-[2px] shadow-sm mr-2 align-[-2px]" />
      )}
      <span className="text-xs font-bold uppercase tracking-wide text-stone-600 mr-2">{t.inOtherLang}</span>
      {wiki ? (
        <a
          href={wiki.url}
          target="_blank"
          rel="noopener noreferrer"
          lang={lang === "fr" ? "en" : "fr"}
          title={wiki.label}
          className="font-semibold text-[#1b5d78] underline decoration-dotted underline-offset-2 hover:decoration-solid"
        >
          {term}
        </a>
      ) : (
        <span lang={lang === "fr" ? "en" : "fr"} className="font-semibold">{term}</span>
      )}
    </p>
  );
}

