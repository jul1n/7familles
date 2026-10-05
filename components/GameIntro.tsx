import type { Lang } from "@/lib/content";
import { UI } from "@/lib/ui";

// Présentation du jeu par analogie avec un jeu connu (version anglaise : « Happy Families »), avant les règles complètes
export default function GameIntro({ lang, className = "" }: { lang: Lang; className?: string }) {
  const intro = UI[lang].gameIntro;
  if (!intro) return null;
  return (
    <p className={className}>
      {intro.text}{" "}
      <a href={intro.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1b5d78] underline underline-offset-2">
        {intro.linkLabel}
      </a>
    </p>
  );
}
