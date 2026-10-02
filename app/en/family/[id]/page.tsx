import type { Metadata } from "next";
import { FAMILIES } from "@/data/cards";
import FamilyPageContent from "@/components/FamilyPageContent";
import { familyMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return FAMILIES.map((f) => ({ id: f.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return familyMetadata("en", id);
}

export default async function FamilyPage({ params }: Props) {
  const { id } = await params;
  return <FamilyPageContent lang="en" id={id} />;
}
