import type { Metadata } from "next";
import { CARDS } from "@/data/cards";
import CardPageContent from "@/components/CardPageContent";
import { cardMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return CARDS.map((c) => ({ id: c.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return cardMetadata("fr", id);
}

export default async function CartePage({ params }: Props) {
  const { id } = await params;
  return <CardPageContent lang="fr" id={id} />;
}
