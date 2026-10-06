import React from "react";
import Link from "next/link";
import { getContent, paths, type Lang } from "@/lib/content";
import { UI } from "@/lib/ui";
import LegalFooter from "@/components/LegalFooter";
import { asset } from "@/lib/asset";
import GameIntro from "@/components/GameIntro";
import { BIMBAMBOUM, CFBR_CONTACT_URL, CFBR_URL, gameAuthors, getCopyText } from "@/lib/links";
import {
  CFBR_HISTORY,
  CFBR_MISSIONS,
  RULES_EN,
  RULES_END,
  RULES_FLOW,
  RULES_GOAL,
  RULES_MATERIAL,
  RULES_META,
  RULES_MORE,
  RULES_URL,
} from "@/lib/rules";

// Article de lecture : règles du jeu, inventaire des 42 cartes, ressources, présentation du CFBR et des auteurs.
export default function RulesArticle({ lang = "fr" }: { lang?: Lang }) {
  const t = UI[lang];
  const fr = lang === "fr";
  const { CARDS, FAMILIES } = getContent(lang);
  const meta = fr ? RULES_META : RULES_EN.meta;
  const material = fr ? RULES_MATERIAL : RULES_EN.material;
  const goal = fr ? RULES_GOAL : RULES_EN.goal;
  const flow = fr ? RULES_FLOW : RULES_EN.flow;
  const end = fr ? RULES_END : RULES_EN.end;
  const more = fr ? RULES_MORE : RULES_EN.more;
  const history = fr ? CFBR_HISTORY : RULES_EN.history;
  const missions = fr ? CFBR_MISSIONS : RULES_EN.missions;
  const h2 = "mt-8 text-xl font-extrabold tracking-tight text-[#1b5d78]";
  return (
    <div className="h-dvh overflow-y-auto bg-[#F7F5F0] text-stone-900">
      <div className="h-[3px] w-full bg-gradient-to-r from-[#1b5d78] via-[#247c9e] to-[#22c55e]" />
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4">
        <Link href={paths.home(lang)} className="inline-flex items-center gap-3 rounded-lg focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/cfbr-logo.png")} alt="" className="h-9 w-auto" />
          <span className="text-sm font-bold">{t.siteName}</span>
        </Link>
        <Link
          href={paths.home(lang)}
          className="inline-flex min-h-[44px] items-center rounded-xl bg-[#1b5d78] px-4 text-xs font-semibold text-white focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
        >
          {t.discover}
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-16">
        <article>
          <h1 className="text-3xl font-extrabold tracking-tight">{t.rulesTitle}</h1>
          <GameIntro lang={lang} className="mt-3 rounded-xl border border-[#1b5d78]/20 bg-[#1b5d78]/5 px-4 py-3 text-base text-stone-800" />
          <p className="mt-3 text-base text-stone-800">{t.rulesIntro}</p>
          {t.rulesImagesNote && <p className="mt-2 text-sm text-stone-700">{t.rulesImagesNote}</p>}

          <ul className="mt-4 flex flex-wrap gap-2" aria-label={t.rulesTitle}>
            {meta.map((m) => (
              <li key={m.label} className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm">
                <span className="text-xs font-semibold uppercase tracking-wide text-stone-600">{m.label}</span>
                <span className="ml-2 font-bold">{m.value}</span>
              </li>
            ))}
          </ul>

          <h2 className={h2}>{t.rulesMaterial}</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-[#247c9e]">
            {material.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>

          <h2 className={h2}>{t.rulesGoal}</h2>
          <p className="mt-2">{goal}</p>

          <h2 className={h2}>{t.rulesFlow}</h2>
          <div className="mt-2 space-y-3 leading-relaxed">
            {flow.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <h2 className={h2}>{t.rulesEnd}</h2>
          <p className="mt-2 leading-relaxed">{end}</p>

          <h2 className={h2}>{t.rulesCards}</h2>
          <p className="mt-2 text-sm text-stone-700">
            {t.rulesCardsIntro}
          </p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {FAMILIES.map((f) => (
              <section key={f.id} aria-label={t.familyOf(f.name)}>
                <h3 className="text-sm font-extrabold" style={{ color: f.color }}>
                  <Link href={paths.family(lang, f.id)} className="hover:underline">
                    {f.name}
                  </Link>
                </h3>
                <ol className="mt-1 space-y-0.5 text-sm">
                  {CARDS.filter((c) => c.familyId === f.id).map((c) => (
                    <li key={c.id}>
                      <span className="text-stone-600">{c.num}.</span>{" "}
                      <Link href={paths.card(lang, c.id)} className="text-[#1b5d78] underline-offset-2 hover:underline">
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>

          <h2 className={h2}>{t.rulesFurther}</h2>
          <div className="mt-2 space-y-3 leading-relaxed">
            {more.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/regles/qr-ressources.png")} alt={t.rulesQrAlt} width={120} height={120} className="h-[120px] w-[120px] rounded-lg border border-stone-200 bg-white p-1" />
            <a
              href={RULES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center rounded-xl border border-[#1b5d78]/20 bg-[#1b5d78]/10 px-4 text-sm font-semibold text-[#1b5d78] focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
            >
              {t.rulesSite}
            </a>
          </div>

          <h2 className={h2}>{t.rulesGetCopy}</h2>
          <p className="mt-2 leading-relaxed">{getCopyText(lang)}</p>
          <p className="mt-3">
            <a
              href={CFBR_CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center rounded-xl bg-[#1b5d78] px-4 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
            >
              {t.contactCfbr}
            </a>
          </p>

          <h2 className={h2}>{t.rulesCfbr}</h2>
          <div className="mt-2 space-y-3 leading-relaxed">
            {history.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <h3 className="mt-4 text-base font-bold">{t.rulesMissions}</h3>
          <p className="mt-1 leading-relaxed">{missions}</p>
          <p className="mt-2 text-sm">
            <a href={CFBR_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1b5d78] underline">
              {t.cfbrSite}
            </a>
          </p>

          <h2 className={h2}>{t.rulesAuthors}</h2>
          <ul className="mt-2 space-y-2">
            {gameAuthors(lang).map((a) => (
              <li key={a.name}>
                <strong>{a.name}</strong>
                {a.description && <span className="text-stone-800"> : {a.description}</span>}
                {a.name.toLowerCase().includes("bim bam boum") && (
                  <>
                    {" "}
                    <a href={BIMBAMBOUM.instagram} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#1b5d78] underline">
                      Instagram
                    </a>
                  </>
                )}
              </li>
            ))}
          </ul>
        </article>
      </main>
      <LegalFooter lang={lang} />
    </div>
  );
}
