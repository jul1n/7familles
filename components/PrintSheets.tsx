"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { FAMILIES, CARDS, CardData } from "@/data/cards";
import { asset, printImg } from "@/lib/asset";
import { ARCHITECTES_URL, BIMBAMBOUM, CFBR_URL, GLOBAL_LINKS, cardLinks, englishTerm } from "@/lib/links";

interface PrintSheetsProps {
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
@page { size: A4; margin: 14mm 14mm 16mm;
  @bottom-center { content: counter(page); font: 9pt sans-serif; color: #57534e; } }
@page bare { margin: 14mm; @bottom-center { content: none; } }
.print-bare { page: bare; }
`;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

// Pied de page de chaque feuille : logo du CFBR (le numéro de page est ajouté sous le pied de page)
function SheetFooter() {
  return (
    <div className="print-footer mt-auto flex items-center justify-between border-t border-stone-300 pt-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/cfbr-logo.png")} alt="CFBR" className="h-[9mm] w-auto" />
      <span className="text-[8pt] text-stone-500">7 Familles des Barrages • 1926–2026</span>
    </div>
  );
}

function CoverPage() {
  return (
    <section className="print-sheet print-bare flex flex-col items-center justify-center text-center" style={{ minHeight: "265mm" }}>
      <div className="h-1.5 w-40 rounded-full bg-gradient-to-r from-[#1b5d78] via-[#247c9e] to-[#22c55e] mb-10" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/cfbr-logo.png")} alt="Logo du CFBR" className="h-28 w-auto mb-10" />
      <h1 className="text-5xl font-extrabold tracking-tight text-[#1b5d78]">7 Familles des Barrages</h1>
      <p className="mt-3 text-2xl font-semibold text-stone-700">1926 – 2026</p>
      <p className="mt-10 text-lg font-medium text-stone-800">Comité Français des Barrages et Réservoirs</p>
      <p className="mt-1 text-sm text-stone-600">
        Comité français de la CIGB / ICOLD, la Commission Internationale des Grands Barrages
      </p>
      <p className="mt-12 max-w-[12cm] text-sm leading-relaxed text-stone-700">
        Un jeu de 42 cartes réparties en 7 familles pour découvrir les barrages, leurs métiers, leurs usages, leurs
        composants, leurs types, et quelques ouvrages célèbres en France et dans le monde.
      </p>
    </section>
  );
}

// Sommaire : la structure des 7 familles et de leurs 6 cartes
function TocPage() {
  return (
    <section className="print-sheet">
      <h2 className="text-2xl font-extrabold mb-1 text-[#1b5d78]">Sommaire</h2>
      <p className="text-sm text-stone-600 mb-6">7 familles de 6 cartes, soit 42 cartes.</p>
      <div className="space-y-4">
        {FAMILIES.map((fam, i) => (
          <div key={fam.id} className="break-inside-avoid">
            <p className="flex items-center gap-2 text-base font-extrabold" style={{ color: fam.color }}>
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs text-white"
                style={{ backgroundColor: fam.color }}
              >
                {i + 1}
              </span>
              {fam.name}
            </p>
            <p className="ml-8 text-xs text-stone-600 mb-1">{fam.description}</p>
            <ol className="ml-8 grid grid-cols-2 gap-x-6 gap-y-0.5 text-sm text-stone-800">
              {CARDS.filter((c) => c.familyId === fam.id).map((c) => (
                <li key={c.id}>
                  <span className="font-semibold text-stone-500">{c.num}.</span> {c.title}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <SheetFooter />
    </section>
  );
}

// Mosaïque des 42 cartes sur deux pages : 4 familles puis 3 familles, un rang par famille
function OverviewPages() {
  const pages = [FAMILIES.slice(0, 4), FAMILIES.slice(4)];
  return (
    <>
      {pages.map((fams, pi) => (
        <section key={pi} className="print-sheet">
          <h2 className="text-lg font-extrabold mb-3 text-[#1b5d78]">Les 42 cartes ({pi + 1}/2)</h2>
          <div className="space-y-3">
            {fams.map((fam) => (
              <div key={fam.id}>
                <p className="text-xs font-bold mb-1" style={{ color: fam.color }}>
                  {fam.name}
                </p>
                <div className="grid grid-cols-6 gap-1.5">
                  {CARDS.filter((c) => c.familyId === fam.id).map((c) => (
                    <figure key={c.id} className="text-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={printImg(c.frontImage)} alt="" className="w-full h-auto" />
                      <figcaption className="mt-0.5 text-[7pt] leading-tight font-medium">
                        {c.num}. {c.title}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <SheetFooter />
        </section>
      ))}
    </>
  );
}

// 3e de couverture : tous les crédits (photos, agence de design, CFBR)
function CreditsPage() {
  const withCredits = CARDS.filter((c) => c.credits);
  return (
    <section className="print-sheet text-sm">
      <h2 className="text-2xl font-extrabold mb-4 text-[#1b5d78]">Crédits</h2>

      <h3 className="text-base font-bold mb-1">Crédits photos</h3>
      <ul className="columns-2 gap-6 text-xs leading-snug mb-5">
        {withCredits.map((c) => (
          <li key={c.id} className="break-inside-avoid mb-1">
            <span className="font-semibold">{c.title}</span> : {c.credits}
          </li>
        ))}
      </ul>

      <h3 className="text-base font-bold mb-1">Illustrations et design des cartes</h3>
      <p className="text-xs leading-snug mb-1">
        <strong>{BIMBAMBOUM.name}</strong>. {BIMBAMBOUM.description}
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

      <h3 className="text-base font-bold mb-1">Édition</h3>
      <p className="text-xs leading-snug mb-1">
        <strong>CFBR – Comité Français des Barrages et Réservoirs</strong>, comité français de la CIGB / ICOLD
        (Commission Internationale des Grands Barrages). Textes des cartes : version initiale des auteurs du jeu,
        reformulée pour un public d’enfants.
      </p>
      <p className="text-xs">
        {GLOBAL_LINKS.map((l, i) => (
          <React.Fragment key={l.url}>
            {i > 0 && " • "}
            <a href={l.url} className="text-[#1b5d78] underline">
              {l.label}
            </a>
          </React.Fragment>
        ))}
      </p>
      <SheetFooter />
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
      <p className="mt-6 text-base font-medium text-stone-800">Comité Français des Barrages et Réservoirs</p>
      <div className="mt-20 flex items-center justify-center gap-16">
        <a href={ARCHITECTES_URL} className="flex flex-col items-center gap-2">
          <PartnerLogo file="architectes-de-leau.png" name="Les Architectes de l’Eau" className="h-[13mm] w-auto" />
        </a>
        <a href={BIMBAMBOUM.instagram} className="flex flex-col items-center gap-2">
          <PartnerLogo file="hello-bim-bam-boum.png" name="Hello Bim Bam Boum" className="h-[22mm] w-auto" />
        </a>
      </div>
    </section>
  );
}

export default function PrintSheets({ cards, booklet, markdownFor }: PrintSheetsProps) {
  return (
    <div id="print-root" className="hidden print:block text-stone-900">
      <RunningStyle />
      {booklet && (
        <>
          <CoverPage />
          <TocPage />
          <OverviewPages />
        </>
      )}

      {cards.map((card) => (
        <article key={card.id} className="print-sheet">
          <header className="flex items-center justify-between border-b-2 pb-2 mb-4" style={{ borderColor: card.familyColor }}>
            <span className="text-sm font-bold" style={{ color: card.familyColor }}>
              Famille {card.familyName} • Carte n°{card.num}
            </span>
          </header>
          <div className="flex gap-6 items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={printImg(card.frontImage)} alt={`Carte ${card.title}`} className="w-[6.5cm] h-auto flex-shrink-0" />
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
              {cardLinks(card)
                .filter((l) => l.url !== CFBR_URL)
                .map((l, i) => (
                  <React.Fragment key={l.url}>
                    {i > 0 && " • "}
                    <a href={l.url} className="text-[#1b5d78] underline">
                      {l.label}
                    </a>{" "}
                    <span className="text-stone-400">({domainOf(l.url)})</span>
                  </React.Fragment>
                ))}
            </p>
            {card.credits && <p className="italic">Crédit photo : {card.credits}</p>}
          </footer>
          <SheetFooter />
        </article>
      ))}

      {booklet && (
        <>
          <CreditsPage />
          <BackCover />
        </>
      )}
    </div>
  );
}
