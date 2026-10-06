import Link from "next/link";
import { notFound } from "next/navigation";
import { getContent, paths, type Lang } from "@/lib/content";
import { asset, thumb } from "@/lib/asset";
import { UI } from "@/lib/ui";
import { textOnCream } from "@/lib/color";
import { absoluteUrl } from "@/lib/site";
import LegalFooter from "@/components/LegalFooter";

// Page d'une famille : ses 6 cartes, avec un lien vers la fiche de chacune
export default function FamilyPageContent({ lang, id }: { lang: Lang; id: string }) {
  const { CARDS, FAMILIES } = getContent(lang);
  const fam = FAMILIES.find((f) => f.id === id);
  if (!fam) notFound();
  const t = UI[lang];
  const cards = CARDS.filter((c) => c.familyId === fam.id);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t.familyOf(fam.name),
    description: fam.description,
    inLanguage: lang,
    url: absoluteUrl(paths.family(lang, fam.id)),
    isPartOf: { "@type": "WebSite", name: t.siteName, url: absoluteUrl(paths.home(lang)) },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: cards.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.title, url: absoluteUrl(paths.card(lang, c.id)) })),
    },
  };
  return (
    <div className="h-dvh overflow-y-auto bg-[#F7F5F0] text-stone-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="h-[3px] w-full bg-gradient-to-r from-[#1b5d78] via-[#247c9e] to-[#22c55e]" />
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
        <Link href={paths.home(lang)} className="inline-flex items-center gap-3 rounded-lg focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/cfbr-logo.png")} alt="" className="h-9 w-auto" />
          <span className="text-sm font-bold">{t.siteName}</span>
        </Link>
        <Link
          href={`${paths.home(lang)}?famille=${fam.id}`}
          className="inline-flex min-h-[44px] items-center rounded-xl bg-[#1b5d78] px-4 text-xs font-semibold text-white focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
        >
          {t.seeFamily3d}
        </Link>
      </header>
      <main className="mx-auto max-w-5xl px-4 pb-16">
        <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: textOnCream(fam.color) }}>
          {t.familyOf(fam.name)}
        </h1>
        <p className="mt-2 max-w-2xl text-base text-stone-800">{fam.description}</p>
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {cards.map((c) => (
            <li key={c.id}>
              <Link href={paths.card(lang, c.id)} className="group block rounded-2xl focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={thumb(c.frontImage)} alt="" width={360} height={514} loading="lazy" className="h-auto w-full drop-shadow-[0_6px_10px_rgba(60,45,20,0.22)]" />
                <span className="mt-2 block text-center text-sm font-semibold leading-tight">
                  {c.num}. {c.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <LegalFooter lang={lang} />
    </div>
  );
}
