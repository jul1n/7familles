"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Check, FileDown, RotateCcw, Trophy, X } from "lucide-react";
import type { CardData } from "@/data/cards";
import type { Lang } from "@/lib/content";
import { UI } from "@/lib/ui";
import { drawQuestions, getQuizBank, shuffleAnswers, type QuizQuestion } from "@/data/quiz";
import { trackEvent } from "@/lib/analytics";
import { useFocusTrap } from "@/lib/use-focus-trap";

const QUIZ_LENGTH = 5;
const LETTERS = ["A", "B", "C", "D"];

interface Round {
  q: QuizQuestion;
  answers: string[];
  correct: number;
}

// Points : 10 par bonne réponse, +5 pour chaque bonne réponse d'affilée après la première, et un bonus de rapidité
// de 10 points (en moins de FAST_MS) qui baisse régulièrement jusqu'à 0 (à SLOW_MS). 150 points au maximum, 100 sans chrono.
const BASE_POINTS = 10;
const FULL_SPEED_BONUS = 10;
const FAST_MS = 8000;
const SLOW_MS = 20000;
const speedBonus = (ms: number) =>
  ms <= FAST_MS ? FULL_SPEED_BONUS : ms >= SLOW_MS ? 0 : Math.round((FULL_SPEED_BONUS * (SLOW_MS - ms)) / (SLOW_MS - FAST_MS));
const streakBonus = (streak: number) => 5 * Math.max(0, streak - 1);
const TIMER_KEY = "7familles-quiz-chrono";

// Compteur qui défile jusqu'à sa nouvelle valeur
function Counter({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = from.current;
    if (start === value) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 600);
      setShown(Math.round(start + (value - start) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{shown}</>;
}

// Quiz de 5 questions à choix multiples tirées au hasard, avec points animés, et accès au PDF imprimable des 10 quiz
export default function QuizDialog({
  lang,
  cards,
  onOpenCard,
  onPrint,
  onClose,
}: {
  lang: Lang;
  cards: CardData[];
  onOpenCard: (card: CardData) => void;
  onPrint: () => void;
  onClose: () => void;
}) {
  const t = UI[lang].quiz;
  const bank = useMemo(() => getQuizBank(lang), [lang]);
  const [phase, setPhase] = useState<"intro" | "play" | "end">("intro");
  const [rounds, setRounds] = useState<Round[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [right, setRight] = useState(0);
  const [gain, setGain] = useState<{ n: number; speed: number; streak: number; key: number } | null>(null);
  // Chrono : actif par défaut, désactivable pour jouer sans pression (choix gardé sur l'appareil)
  const [timed, setTimed] = useState<boolean>(true);
  const [liveBonus, setLiveBonus] = useState<number>(FULL_SPEED_BONUS);
  const startedAt = useRef<number>(0);
  useEffect(() => {
    try {
      if (localStorage.getItem(TIMER_KEY) === "off") setTimed(false);
    } catch {
      /* stockage indisponible : on garde la valeur par défaut */
    }
  }, []);
  const toggleTimed = (v: boolean) => {
    setTimed(v);
    try {
      localStorage.setItem(TIMER_KEY, v ? "on" : "off");
    } catch {
      /* sans conséquence */
    }
  };
  // Le bonus se vide en direct tant que la question est ouverte
  useEffect(() => {
    if (phase !== "play" || !timed || picked !== null) return;
    setLiveBonus(FULL_SPEED_BONUS);
    const id = setInterval(() => setLiveBonus(speedBonus(performance.now() - startedAt.current)), 100);
    return () => clearInterval(id);
  }, [phase, timed, picked, idx]);
  const box = useRef<HTMLDivElement>(null);
  useFocusTrap(box);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const nextBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => closeBtn.current?.focus(), []);
  // Après une réponse, le focus passe sur « Suivante » pour continuer au clavier
  useEffect(() => {
    if (picked !== null) nextBtn.current?.focus();
  }, [picked]);

  const start = () => {
    const drawn = drawQuestions(bank, QUIZ_LENGTH).map((q) => ({ q, ...shuffleAnswers(q) }));
    setRounds(drawn);
    setIdx(0);
    setPicked(null);
    setScore(0);
    setStreak(0);
    setRight(0);
    setGain(null);
    startedAt.current = performance.now();
    setPhase("play");
    trackEvent("evt/quiz-debut");
  };

  const answer = (i: number, at: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === rounds[idx].correct) {
      const speed = timed ? speedBonus(at - startedAt.current) : 0;
      const bonus = streakBonus(streak + 1);
      const n = BASE_POINTS + speed + bonus;
      setStreak(streak + 1);
      setRight(right + 1);
      setScore(score + n);
      setGain({ n, speed, streak: bonus, key: idx });
    } else {
      setStreak(0);
      setGain(null);
    }
  };

  const next = () => {
    if (idx + 1 < rounds.length) {
      setIdx(idx + 1);
      setPicked(null);
      setGain(null);
      startedAt.current = performance.now();
    } else {
      setPhase("end");
      setGain(null);
      trackEvent("evt/quiz-fin");
      if (right >= 3 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        import("canvas-confetti").then(({ default: confetti }) => {
          confetti({ particleCount: right === QUIZ_LENGTH ? 220 : 110, spread: 75, origin: { y: 0.65 }, zIndex: 90 });
        });
      }
    }
  };

  const round = rounds[idx];
  const card = round ? cards.find((c) => c.id === round.q.card) : undefined;
  const btn = "min-h-[44px] rounded-xl px-5 text-sm font-bold focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-stone-900/40 p-3 print:hidden sm:p-6" onClick={onClose}>
      <div
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-title"
        className="relative flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white text-stone-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            onClose();
          }
        }}
      >
        <div className="flex items-center justify-between gap-3 border-b border-stone-200 px-4 py-3">
          <h2 id="quiz-title" className="flex items-center gap-2 text-base font-extrabold text-stone-900">
            <Trophy className="h-5 w-5 text-amber-500" aria-hidden /> {t.title}
          </h2>
          <div className="flex items-center gap-2">
            {phase !== "intro" && (
              <span className="relative rounded-full bg-[#1b5d78]/10 px-3 py-1 text-sm font-extrabold tabular-nums text-[#1b5d78]" aria-label={t.score(score)}>
                <Counter value={score} /> {t.pts}
                {gain && (
                  <span key={gain.key} aria-hidden className="quiz-gain pointer-events-none absolute -top-1 right-1 text-lg font-black text-emerald-600">
                    +{gain.n}
                  </span>
                )}
              </span>
            )}
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              aria-label={t.close}
              className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-4 sm:p-5">
          {phase === "intro" && (
            <div className="text-center">
              <p className="text-sm leading-relaxed text-stone-700">{t.intro}</p>
              <p className="mt-2 text-xs text-stone-600">{t.rulesOfPoints(timed)}</p>
              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-800 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#1b5d78]">
                <input type="checkbox" checked={timed} onChange={(e) => toggleTimed(e.target.checked)} className="h-4 w-4 accent-[#1b5d78]" />
                {t.timerToggle}
              </label>
              <p className="mt-1 text-xs text-stone-500">{t.timerHint}</p>
              <div className="mt-5 flex flex-col items-center gap-2">
                <button type="button" onClick={start} className={`${btn} bg-[#1b5d78] text-white`}>
                  {t.start}
                </button>
                <button
                  type="button"
                  onClick={onPrint}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-stone-300 bg-white px-5 text-xs font-semibold text-stone-800 hover:bg-stone-50 focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
                >
                  <FileDown className="h-4 w-4" aria-hidden /> {t.print}
                </button>
                <p className="max-w-xs text-xs text-stone-500">{t.printHint}</p>
              </div>
            </div>
          )}

          {phase === "play" && round && (
            <div>
              <div className="mb-3 flex items-center gap-1.5" role="img" aria-label={t.questionOf(idx + 1, rounds.length)}>
                {rounds.map((_, i) => (
                  <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < idx || (i === idx && picked !== null) ? "bg-[#1b5d78]" : i === idx ? "bg-[#1b5d78]/40" : "bg-stone-200"}`} />
                ))}
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">{t.questionOf(idx + 1, rounds.length)}</p>
                {timed && picked === null && (
                  <p className="text-xs font-extrabold tabular-nums text-amber-600" aria-hidden>
                    ⚡ +{liveBonus}
                  </p>
                )}
              </div>
              {timed && (
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-stone-100" aria-hidden>
                  <div
                    className={`h-full rounded-full transition-[width] duration-100 ease-linear ${liveBonus >= 7 ? "bg-emerald-500" : liveBonus >= 3 ? "bg-amber-400" : "bg-rose-400"}`}
                    style={{ width: `${picked === null ? liveBonus * 10 : 0}%` }}
                  />
                </div>
              )}
              <h3 className="mt-1 text-lg font-bold leading-snug text-stone-900">{round.q.q}</h3>

              <ul className="mt-4 space-y-2">
                {round.answers.map((a, i) => {
                  const isRight = i === round.correct;
                  const state = picked === null ? "idle" : isRight ? "right" : i === picked ? "wrong" : "dim";
                  return (
                    <li key={a}>
                      <button
                        type="button"
                        onClick={(e) => answer(i, e.timeStamp)}
                        disabled={picked !== null}
                        aria-label={`${LETTERS[i]} : ${a}${picked !== null ? (isRight ? ` (${t.correctShort})` : i === picked ? ` (${t.wrongShort})` : "") : ""}`}
                        className={`flex w-full items-center gap-3 rounded-xl border-2 px-3 py-3 text-left text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none ${
                          state === "idle"
                            ? "border-stone-200 bg-white hover:border-[#1b5d78] hover:bg-[#1b5d78]/5"
                            : state === "right"
                            ? "quiz-right border-emerald-500 bg-emerald-50 text-emerald-900"
                            : state === "wrong"
                            ? "quiz-wrong border-rose-400 bg-rose-50 text-rose-900"
                            : "border-stone-200 bg-white text-stone-400"
                        }`}
                      >
                        <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-extrabold ${state === "right" ? "bg-emerald-500 text-white" : state === "wrong" ? "bg-rose-400 text-white" : "bg-stone-100 text-stone-600"}`}>
                          {state === "right" ? <Check className="h-4 w-4" aria-hidden /> : state === "wrong" ? <X className="h-4 w-4" aria-hidden /> : LETTERS[i]}
                        </span>
                        {a}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div role="status" aria-live="polite" className="mt-4 min-h-[3.5rem]">
                {picked !== null && (
                  <div>
                    <p className={`text-sm font-bold ${picked === round.correct ? "text-emerald-700" : "text-rose-700"}`}>
                      {picked === round.correct ? `${gain && timed && gain.speed >= FULL_SPEED_BONUS ? t.fastLabel + " " : ""}${t.correct(gain?.n ?? 0)}` : t.wrong(round.answers[round.correct])}
                    </p>
                    {picked === round.correct && gain && (
                      <p className="text-xs tabular-nums text-stone-600">{t.breakdown(gain.speed, gain.streak)}</p>
                    )}
                    {card && (
                      <button
                        type="button"
                        onClick={() => onOpenCard(card)}
                        className="mt-1 text-xs font-semibold text-[#1b5d78] underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
                      >
                        {t.seeCard(card.title)}
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-2 flex justify-end">
                <button ref={nextBtn} type="button" onClick={next} disabled={picked === null} className={`${btn} bg-[#1b5d78] text-white disabled:opacity-30`}>
                  {idx + 1 < rounds.length ? t.next : t.seeResult}
                </button>
              </div>
            </div>
          )}

          {phase === "end" && (
            <div className="text-center">
              <p className="text-5xl font-black tabular-nums text-[#1b5d78]">
                <Counter value={score} /> <span className="text-xl font-bold text-stone-500">/ {t.maxScore(timed)}</span>
              </p>
              <p className="mt-2 text-sm font-bold text-stone-900">{t.rightCount(right, rounds.length)}</p>
              <p className="mt-1 text-sm text-stone-700">{t.verdict(right)}</p>
              <div className="mt-5 flex flex-col items-center gap-2">
                <button type="button" onClick={start} className={`${btn} inline-flex items-center gap-2 bg-[#1b5d78] text-white`}>
                  <RotateCcw className="h-4 w-4" aria-hidden /> {t.replay}
                </button>
                <button
                  type="button"
                  onClick={onPrint}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-stone-300 bg-white px-5 text-xs font-semibold text-stone-800 hover:bg-stone-50 focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
                >
                  <FileDown className="h-4 w-4" aria-hidden /> {t.print}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
