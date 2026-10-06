"use client";

import React, { useRef } from "react";
import { X } from "lucide-react";
import { paths, type Lang } from "@/lib/content";
import { UI } from "@/lib/ui";
import { asset } from "@/lib/asset";
import { useFocusTrap } from "@/lib/use-focus-trap";
import GameIntro from "@/components/GameIntro";

// Aide : gestes et raccourcis, accès aux règles, installation de l'application
export default function HelpDialog({
  lang,
  canInstall,
  iosHint,
  onInstall,
  onClose,
}: {
  lang: Lang;
  canInstall: boolean;
  iosHint: boolean;
  onInstall: () => void;
  onClose: () => void;
}) {
  const t = UI[lang];
  const box = useRef<HTMLDivElement>(null);
  useFocusTrap(box);
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-stone-900/40 p-4 print:hidden" onClick={onClose}>
      <div
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        className="w-full max-w-md rounded-2xl bg-white p-5 text-stone-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        <div className="flex items-center justify-between">
          <h2 id="help-title" className="text-base font-bold text-stone-900">
            {t.helpTitle}
          </h2>
          <button
            type="button"
            autoFocus
            onClick={onClose}
            aria-label={t.helpClose}
            className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <GameIntro lang={lang} className="mt-3 text-sm leading-snug text-stone-800" />
        <ul className="mt-3 space-y-2 text-sm leading-snug">
          {t.helpItems.map((it) => (
            <li key={it.k}>
              <strong>{it.k}</strong> {it.v}
            </li>
          ))}
          <li>
            <strong>{t.helpRules}</strong>{" "}
            <a href={asset(paths.rules(lang))} className="font-semibold text-[#1b5d78] underline">
              {t.helpRulesLink}
            </a>
          </li>
          <li>{t.helpMosaic}</li>
          {canInstall && (
            <li>
              <button
                type="button"
                onClick={onInstall}
                className="min-h-[44px] rounded-xl bg-[#1b5d78] px-4 text-xs font-semibold text-white focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
              >
                {t.installApp}
              </button>
            </li>
          )}
          {!canInstall && iosHint && <li>{t.installIos}</li>}
        </ul>
      </div>
    </div>
  );
}
