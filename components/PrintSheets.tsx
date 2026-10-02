"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { CardData } from "@/data/cards";
import { getContent, paths, type Lang } from "@/lib/content";
import { UI } from "@/lib/ui";
import { asset, printImg } from "@/lib/asset";
import { ARCHITECTES_URL, BIMBAMBOUM, CFBR_URL, GLOBAL_LINKS, cardLinks, gameAuthors, otherLanguageTerm } from "@/lib/links";
import { RESOURCE_LINKS, RESOURCE_LINKS_EN } from "@/lib/card-links";
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

interface PrintSheetsProps {
  lang?: Lang;
  cards: CardData[];
  booklet?: boolean; // dossier complet : couverture, sommaire, mosaïque, une page par carte, crédits, 4e de couverture
  markdownFor: (card: CardData) => string;
}

// Logo partenaire : si le fichier n'est pas (encore) dans public/logos, on affiche le nom en texte.
function PartnerLogo({ file, name, className }: { file: string; name: string; className: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="text-lg font-extrabold text-stone-700">{name}</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={asset(`/logos/${file}`)} alt={name} className={className} onError={() => setFailed(true)} />;
}

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// Numérotation des pages et marges. Les pages « bare » (couverture et 4e de couverture) n'ont ni logo ni numéro.
function RunningStyle() {
  const css = `
@page { size: A4; margin: 14mm 14mm 11mm;
  @bottom-right { content: counter(page); font: 10pt sans-serif; color: #44403c; vertical-align: top; padding-top: 1mm; } }
@page bare { margin: 14mm; @bottom-right { content: none; } }
.print-bare { page: bare; }
`;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

// Pied de page de chaque feuille : logo du CFBR (le numéro de page est ajouté sous le pied de page)
function SheetFooter({ lang = "fr" }: { lang?: Lang }) {
  return (
    <div className="print-footer mt-auto flex items-center justify-between border-t border-stone-300 pt-1.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/cfbr-logo.png")} alt="CFBR" className="h-[10mm] w-auto" />
      <span className="text-[10pt] text-stone-700">{UI[lang].pdfFooter}</span>
    </div>
  );
}

function CoverPage({ lang }: { lang: Lang }) {
  const t = UI[lang];
  return (
    <section className="print-sheet print-bare flex flex-col items-center justify-center text-center" style={{ minHeight: "265mm" }}>
      <div className="h-1.5 w-40 rounded-full bg-gradient-to-r from-[#1b5d78] via-[#247c9e] to-[#22c55e] mb-10" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/logos/cfbr-hd.png")} alt="Logo du CFBR" className="w-[14cm] h-auto mb-10" />
      <h1 className="text-5xl font-extrabold tracking-tight text-[#1b5d78]">{t.siteName}</h1>
      <p className="mt-3 text-2xl font-semibold text-stone-700">1926 – 2026</p>
      <p className="mt-10 text-lg font-medium text-stone-800">{t.pdfCoverTagline}</p>
      <p className="mt-1 text-sm text-stone-600">
        {lang === "fr"
          ? "Comité français de la CIGB / ICOLD, la Commission Internationale des Grands Barrages"
          : "French committee of ICOLD, the International Commission on Large Dams"}
      </p>
      <p className="mt-12 max-w-[12cm] text-sm leading-relaxed text-stone-700">
        {t.pdfCoverBody}
      </p>
    </section>
  );
}

// Sommaire : la structure des 7 familles et de leurs 6 cartes
function TocPage({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const { FAMILIES, CARDS } = getContent(lang);
  return (
    <section className="print-sheet">
      <h2 className="text-2xl font-extrabold mb-1 text-[#1b5d78]">{t.pdfTocTitle}</h2>
      <p className="text-sm text-stone-600 mb-6">{t.pdfTocSub}</p>
      <div className="space-y-4">
        {FAMILIES.map((fam, i) => (
          <div key={fam.id} className="break-inside-avoid">
            <a href={`#print-fam-${fam.id}`} className="flex items-center gap-2 text-base font-extrabold" style={{ color: fam.color }}>
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs text-white"
                style={{ backgroundColor: fam.color }}
              >
                {i + 1}
              </span>
              {fam.name}
            </a>
            <p className="ml-8 text-xs text-stone-600 mb-1">{fam.description}</p>
            <ol className="ml-8 grid grid-cols-2 gap-x-6 gap-y-0.5 text-sm text-stone-800">
              {CARDS.filter((c) => c.familyId === fam.id).map((c) => (
                <li key={c.id}>
                  <a href={`#print-card-${c.id}`}>
                    <span className="font-semibold text-stone-500">{c.num}.</span> {c.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <SheetFooter lang={lang} />
    </section>
  );
}

// Les 6 cartes « hors famille » du jeu imprimé (inventaire, infos, règles, CFBR, auteurs)
const RULE_CARDS = [
  { file: "regles-jeu-1", label: "Règles du jeu (1/2)" },
  { file: "regles-jeu-2", label: "Règles du jeu (2/2)" },
  { file: "regles-inventaire", label: "Inventaire" },
  { file: "regles-infos", label: "Infos complémentaires" },
  { file: "regles-cfbr", label: "Le CFBR" },
  { file: "regles-auteurs", label: "Auteurs du jeu" },
];

// Règles du jeu (2 pages) : règle, infos complémentaires avec QR code, CFBR et auteurs
function RulesPages({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const fr = lang === "fr";
  const meta = fr ? RULES_META : RULES_EN.meta;
  const material = fr ? RULES_MATERIAL : RULES_EN.material;
  const goal = fr ? RULES_GOAL : RULES_EN.goal;
  const flow = fr ? RULES_FLOW : RULES_EN.flow;
  const end = fr ? RULES_END : RULES_EN.end;
  const more = fr ? RULES_MORE : RULES_EN.more;
  const history = fr ? CFBR_HISTORY : RULES_EN.history;
  const missions = fr ? CFBR_MISSIONS : RULES_EN.missions;
  const h = "text-sm font-extrabold uppercase tracking-wide text-[#1b5d78] mt-4 mb-1";
  return (
    <>
      <section className="print-sheet" id="print-regles">
        <h2 className="text-2xl font-extrabold mb-1 text-[#1b5d78]">{t.rulesTitle}</h2>
        <p className="text-sm text-stone-700 mb-2">{meta.map((m) => `${m.label} : ${m.value}`).join("  •  ")}</p>
        <h3 className={h}>{t.rulesMaterial}</h3>
        <ul className="list-disc pl-5 text-sm leading-snug">
          {material.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <h3 className={h}>{t.rulesGoal}</h3>
        <p className="text-sm leading-snug">{goal}</p>
        <h3 className={h}>{t.rulesFlow}</h3>
        <div className="space-y-2 text-sm leading-snug">
          {flow.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <h3 className={h}>{t.rulesEnd}</h3>
        <p className="text-sm leading-snug">{end}</p>
        <SheetFooter lang={lang} />
      </section>

      <section className="print-sheet">
        <h2 className="text-2xl font-extrabold mb-2 text-[#1b5d78]">{t.rulesFurther}</h2>
        <div className="space-y-2 text-sm leading-snug">
          {more.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/regles/qr-ressources.png")} alt={t.rulesQrAlt} className="h-[32mm] w-[32mm]" />
          <a href={RULES_URL} className="text-sm text-[#1b5d78] underline">
            {RULES_URL}
          </a>
        </div>
        <h2 className="text-2xl font-extrabold mt-6 mb-2 text-[#1b5d78]">{t.rulesCfbr}</h2>
        <div className="space-y-2 text-sm leading-snug">
          {history.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
        <h3 className={h}>{t.rulesMissions}</h3>
        <p className="text-sm leading-snug">{missions}</p>
        <h3 className={h}>{t.rulesAuthors}</h3>
        <ul className="text-sm leading-snug space-y-1">
          {gameAuthors(lang).map((a) => (
            <li key={a.name}>
              <strong>{a.name}</strong>
              {a.description && <> : {a.description}</>}
            </li>
          ))}
        </ul>
        <SheetFooter lang={lang} />
      </section>
    </>
  );
}

// Mosaïque des 42 cartes sur deux pages : 4 familles puis 3 familles, un rang par famille
function OverviewPages({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const { FAMILIES, CARDS } = getContent(lang);
  const pages = [FAMILIES.slice(0, 4), FAMILIES.slice(4)];
  return (
    <>
      {pages.map((fams, pi) => (
        <section key={pi} className="print-sheet">
          <h2 className="text-lg font-extrabold mb-3 text-[#1b5d78]">{t.pdfOverviewTitle(pi + 1)}</h2>
          <div className="space-y-3">
            {fams.map((fam) => (
              <div key={fam.id}>
                <p className="text-xs font-bold mb-1" style={{ color: fam.color }}>
                  {fam.name}
                </p>
                <div className="grid grid-cols-6 gap-1.5">
                  {CARDS.filter((c) => c.familyId === fam.id).map((c) => (
                    <a key={c.id} href={`#print-card-${c.id}`} className="block">
                      <figure className="text-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={printImg(c.frontImage)} alt="" className="w-full h-auto" />
                        <figcaption className="mt-0.5 text-[7pt] leading-tight font-medium">
                          {c.num}. {c.title}
                        </figcaption>
                      </figure>
                    </a>
                  ))}
                </div>
              </div>
            ))}
            {/* 2e page : les cartes « règles du jeu » à la suite des 42 cartes */}
            {pi === pages.length - 1 && lang === "fr" && (
              <div>
                <p className="text-xs font-bold mb-1 text-[#1b5d78]">{t.pdfRuleCardsRow}</p>
                <div className="grid grid-cols-6 gap-1.5">
                  {RULE_CARDS.map((c) => (
                    <a key={c.file} href="#print-regles" className="block">
                      <figure className="text-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={asset(`/cards/print/${c.file}.jpg`)} alt={c.label} className="w-full h-auto" />
                        <figcaption className="mt-0.5 text-[7pt] leading-tight font-medium">{c.label}</figcaption>
                      </figure>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <SheetFooter lang={lang} />
        </section>
      ))}
    </>
  );
}

// 3e de couverture : tous les crédits (photos, agence de design, CFBR)
function CreditsPage({ lang }: { lang: Lang }) {
  const t = UI[lang];
  const { CARDS } = getContent(lang);
  const withCredits = CARDS.filter((c) => c.credits);
  return (
    <section className="print-sheet text-sm">
      <h2 className="text-2xl font-extrabold mb-4 text-[#1b5d78]">{t.pdfCredits}</h2>

      <h3 className="text-base font-bold mb-1">{t.pdfPhotoCredits}</h3>
      <ul className="columns-2 gap-6 text-xs leading-snug mb-5">
        {withCredits.map((c) => (
          <li key={c.id} className="break-inside-avoid mb-1">
            <span className="font-semibold">{c.title}</span> : {c.credits}
          </li>
        ))}
      </ul>

      <h3 className="text-base font-bold mb-1">{t.pdfIllustrations}</h3>
      <p className="text-xs leading-snug mb-1">
        <strong>{BIMBAMBOUM.name}</strong>. {lang === "fr" ? BIMBAMBOUM.description : t.agencyDesc}
      </p>
      <p className="text-xs mb-5">
        <a href={BIMBAMBOUM.linkedin} className="text-[#1b5d78] underline">
          LinkedIn
        </a>{" "}
        •{" "}
        <a href={BIMBAMBOUM.instagram} className="text-[#1b5d78] underline">
          Instagram {BIMBAMBOUM.handle}
        </a>
      </p>

      <h3 className="text-base font-bold mb-1">{t.pdfAuthors}</h3>
      <ul className="text-xs leading-snug mb-5 space-y-0.5">
        {gameAuthors(lang).map((a) => (
          <li key={a.name}>
            <strong>{a.name}</strong>
            {a.description && <> : {a.description}</>}
          </li>
        ))}
      </ul>

      <h3 className="text-base font-bold mb-1">{t.rulesFurther}</h3>
      <ul className="text-xs leading-snug mb-5 space-y-0.5">
        {(lang === "fr" ? RESOURCE_LINKS : RESOURCE_LINKS_EN).map((l) => (
          <li key={l.url}>
            <a href={l.url} className="text-[#1b5d78] underline">
              {l.label}
            </a>
            <span className="text-stone-600"> : {l.description}</span>
          </li>
        ))}
      </ul>

      <h3 className="text-base font-bold mb-1">{t.pdfEdition}</h3>
      <p className="text-xs leading-snug mb-1">
        {lang === "fr" ? (
          <>
            <strong>CFBR – Comité Français des Barrages et Réservoirs</strong>, créé en 1926 : une association d’environ
            580 membres actifs, choisis pour leurs compétences dans le domaine des barrages et des ouvrages
            hydrauliques. En 1928, il a œuvré à la création de la Commission Internationale des Grands Barrages (CIGB /
            ICOLD), à laquelle il est affilié. En 2026, il célèbre 100 ans d’expertise avec ce jeu de 7 familles. Textes
            des cartes : version initiale des auteurs du jeu, reformulée pour un public d’enfants.
          </>
        ) : (
          t.pdfEditionText
        )}
      </p>
      <p className="text-xs">
        {GLOBAL_LINKS.map((l, i) => (
          <React.Fragment key={l.url}>
            {i > 0 && " • "}
            <a href={l.url} className="text-[#1b5d78] underline">
              {lang === "en" && l.url.includes("barrages-cfbr") ? t.cfbrSite : l.label}
            </a>
          </React.Fragment>
        ))}
      </p>
      <SheetFooter lang={lang} />
    </section>
  );
}

// 4e de couverture : logo du CFBR en grand, Architectes de l'Eau et Hello Bim Bam Boum en plus petit
function BackCover() {
  return (
    <section className="print-sheet print-bare flex flex-col items-center justify-center text-center" style={{ minHeight: "265mm" }}>
      <div className="h-1.5 w-40 rounded-full bg-gradient-to-r from-[#1b5d78] via-[#247c9e] to-[#22c55e] mb-16" />
      <a href={CFBR_URL}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/logos/cfbr-hd.png")} alt="Logo du CFBR" className="w-[12cm] h-auto" />
      </a>
      <div className="mt-24 flex items-center justify-center gap-16">
        <a href={ARCHITECTES_URL} className="flex flex-col items-center gap-2">
          <PartnerLogo file="architectes-de-leau.png" name="Les Architectes de l’Eau" className="h-[16.5mm] w-auto" />
        </a>
        <a href={BIMBAMBOUM.instagram} className="flex flex-col items-center gap-2">
          <PartnerLogo file="hello-bim-bam-boum.png" name="Hello Bim Bam Boum" className="h-[27.5mm] w-auto" />
        </a>
      </div>
    </section>
  );
}

export default function PrintSheets({ cards, booklet, markdownFor, lang = "fr" }: PrintSheetsProps) {
  const t = UI[lang];
  return (
    <div id="print-root" className="hidden print:block text-stone-900">
      <RunningStyle />
      {booklet && (
        <>
          <CoverPage lang={lang} />
          <TocPage lang={lang} />
          <RulesPages lang={lang} />
          <OverviewPages lang={lang} />
        </>
      )}

      {cards.map((card) => (
        <article key={card.id} id={`print-card-${card.id}`} className="print-sheet">
          <header className="flex items-center justify-between border-b-2 pb-1.5 mb-2" style={{ borderColor: card.familyColor }}>
            <span
              id={card.num === 1 ? `print-fam-${card.familyId}` : undefined}
              className="text-sm font-bold"
              style={{ color: card.familyColor }}
            >
              {t.pdfFamily} {card.familyName} • {t.pdfCardNo}{card.num}
            </span>
          </header>
          <div className="flex gap-6 items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={printImg(card.frontImage)} alt={`${t.pdfCardCaption} ${card.title}`} className="w-[6.5cm] h-auto flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-extrabold mb-1">{card.title}</h1>
              {card.location && <p className="text-xs text-stone-600 mb-2">{card.location}</p>}
              <p className="text-sm font-medium mb-3">{card.shortDescription}</p>
              <div className="card-prose card-prose-sm">
                <ReactMarkdown>{markdownFor(card)}</ReactMarkdown>
              </div>
            </div>
          </div>
          <footer className="mt-2 mb-2 pt-1.5 border-t border-stone-300 text-[10px] text-stone-600 space-y-0.5">
            {otherLanguageTerm(card, lang) && (
              <p>
                <strong>{t.pdfOtherLangTerm}</strong>{" "}
                {otherLanguageTerm(card, lang)!.wiki ? (
                  <a href={otherLanguageTerm(card, lang)!.wiki!.url} className="text-[#1b5d78] underline">
                    {otherLanguageTerm(card, lang)!.term}
                  </a>
                ) : (
                  otherLanguageTerm(card, lang)!.term
                )}
              </p>
            )}
            <div>
              <strong>{t.pdfMore}</strong>
              <ul className="ml-3 flex flex-wrap gap-x-4">
                {cardLinks(card, lang).map((l) => (
                  <li key={l.url}>
                    <a href={l.url} className="text-[#1b5d78] underline">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {card.credits && <p className="italic">{t.creditPhoto} : {card.credits}</p>}
          </footer>
          <SheetFooter lang={lang} />
        </article>
      ))}

      {booklet && (
        <>
          <CreditsPage lang={lang} />
          <BackCover />
        </>
      )}
    </div>
  );
}
