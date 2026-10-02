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
  return cardMetadata("en", id);
}

export default async function CardPage({ params }: Props) {
  const { id } = await params;
  return <CardPageContent lang="en" id={id} />;
}
