"use client";

import React, { useMemo } from "react";
import type { CardData } from "@/data/cards";
import type { Lang } from "@/lib/content";
import { UI } from "@/lib/ui";
import { asset } from "@/lib/asset";
import { drawPrintQuizzes, getQuizBank, shuffleAnswers } from "@/data/quiz";

const LETTERS = ["A", "B", "C"];

// PDF des quiz : 10 quiz de 5 questions tirés au hasard (2 par page A4), puis les réponses.
// S'imprime avec le navigateur (« Enregistrer au format PDF »), comme le dossier complet.
export default function QuizPrint({ lang, cards }: { lang: Lang; cards: CardData[] }) {
  const t = UI[lang].quiz;
  const quizzes = useMemo(
    () =>
      drawPrintQuizzes(getQuizBank(lang)).map((quiz) =>
        quiz.map((q) => ({ q, ...shuffleAnswers(q) })),
      ),
    [lang],
  );
  const titleOf = (id: string) => cards.find((c) => c.id === id)?.title ?? id;
  const pages: number[][] = [];
  for (let i = 0; i < quizzes.length; i += 2) pages.push([i, i + 1].filter((k) => k < quizzes.length));

  const header = (
    <div className="flex items-center justify-between border-b-2 border-[#1b5d78] pb-2">
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/cfbr-logo.png")} alt="" className="h-9 w-auto" />
        <div>
          <p className="text-base font-extrabold leading-tight text-[#1b5d78]">{UI[lang].siteName}</p>
          <p className="text-[11px] text-stone-600">{t.pdfSubtitle}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div id="print-quiz" className="hidden print:block text-stone-900">
      <style dangerouslySetInnerHTML={{ __html: "@page { size: A4; margin: 12mm 14mm; }" }} />
      {pages.map((ks, pi) => (
        <section key={pi} className="print-sheet" style={{ gap: "6mm" }}>
          {header}
          {ks.map((k) => (
            <article key={k} className="break-inside-avoid">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-extrabold text-[#1b5d78]">{t.pdfQuizN(k + 1)}</h2>
                <p className="text-xs text-stone-600">{t.pdfNameScore}</p>
              </div>
              <ol className="mt-2 space-y-2.5 text-[12.5px] leading-snug">
                {quizzes[k].map((r, qi) => (
                  <li key={r.q.id} className="break-inside-avoid">
                    <p className="font-bold">
                      {qi + 1}. {r.q.q}
                    </p>
                    <p className="mt-0.5 flex flex-wrap gap-x-5 gap-y-0.5 pl-4">
                      {r.answers.map((a, i) => (
                        <span key={a}>
                          <span className="mr-1 inline-block h-3 w-3 translate-y-[1px] rounded-sm border border-stone-700" />
                          <strong>{LETTERS[i]}.</strong> {a}
                        </span>
                      ))}
                    </p>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </section>
      ))}

      <section className="print-sheet" style={{ gap: "5mm" }}>
        {header}
        <h2 className="text-lg font-extrabold text-[#1b5d78]">{t.pdfAnswers}</h2>
        <p className="text-xs text-stone-600">{t.pdfAnswersHint}</p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-[12px]">
          {quizzes.map((quiz, k) => (
            <div key={k} className="break-inside-avoid">
              <h3 className="font-extrabold text-[#1b5d78]">{t.pdfQuizN(k + 1)}</h3>
              <ol className="mt-1 space-y-0.5">
                {quiz.map((r, qi) => (
                  <li key={r.q.id}>
                    {qi + 1}. <strong>{LETTERS[r.correct]}</strong> – {r.answers[r.correct]}{" "}
                    <span className="text-stone-500">({titleOf(r.q.card)})</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
