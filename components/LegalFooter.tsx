import type { Lang } from "@/lib/content";
import { LEGAL_URL } from "@/lib/links";
import { UI } from "@/lib/ui";

// Pied de page des pages de lecture : renvoi vers les mentions légales du CFBR
export default function LegalFooter({ lang, className = "" }: { lang: Lang; className?: string }) {
  return (
    <footer className={`mx-auto max-w-5xl px-4 pb-10 text-center text-xs text-stone-600 ${className}`}>
      <a
        href={LEGAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[44px] items-center underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
      >
        {UI[lang].legal}
      </a>
    </footer>
  );
}
