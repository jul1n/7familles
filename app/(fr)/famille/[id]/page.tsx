import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CARDS, FAMILIES } from "@/data/cards";
import { asset, thumb } from "@/lib/asset";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return FAMILIES.map((f) => ({ id: f.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const fam = FAMILIES.find((f) => f.id === id);
  if (!fam) return {};
  const title = `Famille ${fam.name}`;
  return {
    title,
    description: fam.description,
    alternates: { canonical: absoluteUrl(`/famille/${fam.id}/`) },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: SITE_NAME,
      title,
      description: fam.description,
      url: absoluteUrl(`/famille/${fam.id}/`),
      images: [{ url: "/og/accueil.jpg", width: 1200, height: 630, alt: SITE_NAME }],
    },
  };
}

export default async function FamillePage({ params }: Props) {
  const { id } = await params;
  const fam = FAMILIES.find((f) => f.id === id);
  if (!fam) notFound();
  const cards = CARDS.filter((c) => c.familyId === fam.id);
  return (
    <div className="h-dvh overflow-y-auto bg-[#F7F5F0] text-stone-900">
      <div className="h-[3px] w-full bg-gradient-to-r from-[#1b5d78] via-[#247c9e] to-[#22c55e]" />
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="inline-flex items-center gap-3 rounded-lg focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/cfbr-logo.png")} alt="" className="h-9 w-auto" />
          <span className="text-sm font-bold">7 Familles des Barrages</span>
        </Link>
        <Link
          href={`/?famille=${fam.id}`}
          className="inline-flex min-h-[40px] items-center rounded-xl bg-[#1b5d78] px-4 text-xs font-semibold text-white focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
        >
          Voir la famille en 3D
        </Link>
      </header>
      <main className="mx-auto max-w-5xl px-4 pb-16">
        <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: fam.color }}>
          Famille {fam.name}
        </h1>
        <p className="mt-2 max-w-2xl text-base text-stone-800">{fam.description}</p>
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {cards.map((c) => (
            <li key={c.id}>
              <Link href={`/carte/${c.id}/`} className="group block rounded-2xl focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none">
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
    </div>
  );
}
