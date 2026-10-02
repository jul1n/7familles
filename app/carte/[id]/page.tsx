import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CARDS } from "@/data/cards";
import StaticArticle from "@/components/StaticArticle";
import { asset } from "@/lib/asset";
import { SITE_NAME, absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return CARDS.map((c) => ({ id: c.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const card = CARDS.find((c) => c.id === id);
  if (!card) return {};
  const title = `${card.title} – ${card.familyName}`;
  return {
    title,
    description: card.shortDescription,
    alternates: { canonical: absoluteUrl(`/carte/${card.id}/`) },
    openGraph: {
      type: "article",
      locale: "fr_FR",
      siteName: SITE_NAME,
      title,
      description: card.shortDescription,
      url: absoluteUrl(`/carte/${card.id}/`),
      images: [{ url: `/og/${card.id}.jpg`, width: 1200, height: 630, alt: `Carte ${card.title}` }],
    },
    twitter: { card: "summary_large_image", title, description: card.shortDescription, images: [`/og/${card.id}.jpg`] },
  };
}

export default async function CartePage({ params }: Props) {
  const { id } = await params;
  const card = CARDS.find((c) => c.id === id);
  if (!card) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: card.title,
    description: card.shortDescription,
    inLanguage: "fr",
    image: absoluteUrl(card.frontImage),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
    publisher: { "@type": "Organization", name: "Comité Français des Barrages et Réservoirs (CFBR)", url: "https://www.barrages-cfbr.eu/" },
    mainEntityOfPage: absoluteUrl(`/carte/${card.id}/`),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <StaticArticle card={card} siblings={CARDS.filter((c) => c.familyId === card.familyId)} />
    </>
  );
}
