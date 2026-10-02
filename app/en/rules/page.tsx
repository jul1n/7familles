import type { Metadata } from "next";
import RulesArticle from "@/components/RulesArticle";
import { rulesMetadata } from "@/lib/seo";
import { UI } from "@/lib/ui";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = rulesMetadata("en");

export default function RulesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Rules of the 7 Families of Dams card game",
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: UI.en.siteName, url: absoluteUrl("/en/") },
    publisher: { "@type": "Organization", name: "French Committee on Large Dams (CFBR)", url: "https://www.barrages-cfbr.eu/" },
    mainEntityOfPage: absoluteUrl("/en/rules/"),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <RulesArticle lang="en" />
    </>
  );
}
