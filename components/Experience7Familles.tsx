"use client";

import React, { useState, useEffect, useRef } from "react";
import { asset } from "@/lib/asset";
import dynamic from "next/dynamic";
import type { CardData } from "@/data/cards";
import { getContent, paths, type Lang } from "@/lib/content";
import { UI, type UiText } from "@/lib/ui";
import MosaicView from "@/components/MosaicView";
import GameIntro from "@/components/GameIntro";
import ResourcesNav from "@/components/ResourcesNav";
import ResourcesMenu from "@/components/ResourcesMenu";
import PrintSheets from "@/components/PrintSheets";
import AgencyCredit from "@/components/AgencyCredit";
import { markdownToSpeech, markdownToSpeechEn, playAudio, speak, speechSupported, stopSpeaking } from "@/lib/speech";
import audioManifest from "@/data/audio-manifest.json";
import audioManifestEn from "@/data/audio-manifest-en.json";
import { ARCHITECTES_URL, CFBR_CONTACT_URL, cardLinks, getCopyText, otherLanguageTerm } from "@/lib/links";
import {
  Layers,
  ExternalLink,
  Volume2,
  Square,
  Printer,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Copy,
  Check,
  ChevronUp,
  X,
  Compass,
  Box,
  LayoutGrid,
  CircleHelp,
  ShoppingBag,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// Pied de page du carrousel : « menu » = bouton flottant qui déploie les liens ; « bar » = ancienne bande de liens (gardée pour comparer)
const FOOTER_STYLE: "menu" | "bar" = "menu";

// Import de la scène 3D unifiée continue
const Unified3DScene = dynamic(() => import("@/components/Unified3DScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
      <span className="text-xs text-stone-600 font-medium" aria-hidden="true">3D…</span>
    </div>
  ),
});

// Liens « en savoir plus » vers des pages externes (nouvel onglet)
function MoreLinks({ links, t }: { links: { label: string; url: string }[]; t: UiText }) {
  return (
    <nav aria-label={t.moreLinks} className="pt-4 border-t border-stone-200">
      <h3 className="text-xs font-bold uppercase tracking-wide text-stone-600 mb-2">{t.moreLinks}</h3>
      <ul className="flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.url}>
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 min-h-[36px] px-3 rounded-lg text-xs font-semibold text-[#1b5d78] bg-[#1b5d78]/10 border border-[#1b5d78]/20 hover:bg-[#1b5d78]/15 focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
            >
              {l.label}
              <ExternalLink className="w-3 h-3" />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// Actions de la fiche : écouter le texte à voix haute, imprimer la fiche
function CardActions({
  isSpeaking,
  canSpeak,
  onToggleSpeak,
  onPrint,
  t,
}: {
  t: UiText;
  isSpeaking: boolean;
  canSpeak: boolean;
  onToggleSpeak: () => void;
  onPrint: () => void;
}) {
  const btn =
    "inline-flex items-center gap-1.5 min-h-[40px] px-3.5 rounded-xl text-xs font-semibold border transition focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none";
  return (
    <div className="flex flex-wrap items-center gap-2">
      {canSpeak && (
        <button
          onClick={onToggleSpeak}
          aria-pressed={isSpeaking}
          className={`${btn} ${
            isSpeaking
              ? "bg-[#1b5d78] text-white border-[#1b5d78]"
              : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
          }`}
        >
          {isSpeaking ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-4 h-4" />}
          {isSpeaking ? t.stop : t.listen}
        </button>
      )}
      <button onClick={onPrint} className={`${btn} bg-white text-stone-700 border-stone-200 hover:bg-stone-50`}>
        <Printer className="w-4 h-4" />
        {t.print}
      </button>
    </div>
  );
}

// Bouton « Se procurer le jeu » : infobulle au survol, au focus et au clic, lien vers la page contact du CFBR
function GetCopyButton({ t, lang }: { t: UiText; lang: Lang }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="group relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="get-copy-pop"
        title={t.getCopyLabel}
        className="min-h-[40px] px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 shadow-xs transition flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
      >
        <ShoppingBag className="w-4 h-4" />
        <span className="hidden lg:inline">{t.getCopy}</span>
        <span className="sr-only lg:hidden">{t.getCopy}</span>
      </button>
      <div
        id="get-copy-pop"
        role="region"
        aria-label={t.getCopyLabel}
        className={`absolute right-0 top-full z-50 mt-2 w-72 rounded-xl bg-stone-900 p-3 text-left text-xs font-medium leading-snug text-white shadow-lg transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100"
        }`}
      >
        <p>{getCopyText(lang)}</p>
        <a
          href={CFBR_CONTACT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-white px-3 font-semibold text-[#1b5d78] focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
        >
          {t.contactCfbr}
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

// Drapeaux (SVG : les emojis de drapeaux ne s'affichent pas sous Windows) : Royaume-Uni sur le site français,
// France sur le site anglais
function FrFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} role="img" aria-label="French flag">
      <rect width="20" height="40" fill="#0055A4" />
      <rect x="20" width="20" height="40" fill="#fff" />
      <rect x="40" width="20" height="40" fill="#EF4135" />
    </svg>
  );
}

function UKFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={className} role="img" aria-label="Drapeau du Royaume-Uni">
      <clipPath id="uk-clip">
        <rect width="60" height="40" />
      </clipPath>
      <g clipPath="url(#uk-clip)">
        <rect width="60" height="40" fill="#012169" />
        <path d="M0 0L60 40M60 0L0 40" stroke="#fff" strokeWidth="8" />
        <path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" strokeWidth="3" />
        <path d="M30 0V40M0 20H60" stroke="#fff" strokeWidth="13" />
        <path d="M30 0V40M0 20H60" stroke="#C8102E" strokeWidth="7" />
      </g>
    </svg>
  );
}

// Terme anglais de la carte, en fin de fiche
function EnglishTerm({ term, wiki, t, lang }: { term?: string; wiki?: { label: string; url: string }; t: UiText; lang: Lang }) {
  if (!term) return null;
  return (
    <p className="pt-4 border-t border-stone-200 text-sm text-stone-700">
      {lang === "fr" ? (
        <UKFlag className="inline-block w-5 h-[14px] rounded-[2px] shadow-sm mr-2 align-[-2px]" />
      ) : (
        <FrFlag className="inline-block w-5 h-[14px] rounded-[2px] shadow-sm mr-2 align-[-2px]" />
      )}
      <span className="text-xs font-bold uppercase tracking-wide text-stone-600 mr-2">{t.inOtherLang}</span>
      {wiki ? (
        <a
          href={wiki.url}
          target="_blank"
          rel="noopener noreferrer"
          lang={lang === "fr" ? "en" : "fr"}
          title={wiki.label}
          className="font-semibold text-[#1b5d78] underline decoration-dotted underline-offset-2 hover:decoration-solid"
        >
          {term}
        </a>
      ) : (
        <span lang={lang === "fr" ? "en" : "fr"} className="font-semibold">{term}</span>
      )}
    </p>
  );
}

export default function Experience7Familles({ lang = "fr" }: { lang?: Lang }) {
  const t = UI[lang];
  const otherLang: Lang = lang === "fr" ? "en" : "fr";
  const { FAMILIES, CARDS } = React.useMemo(() => getContent(lang), [lang]);
  // Navigation & états monopage (SPA)
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  // Dos de la carte : easter egg, uniquement via la touche Espace
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Mode d'affichage : scène 3D ou mosaïque des 42 cartes côte à côte
  const [viewMode, setViewMode] = useState<"3d" | "mosaic">("3d");
  // Préférence « réduire les animations » et disponibilité de WebGL : sans l'un ou l'autre, on propose la mosaïque
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [webglOk, setWebglOk] = useState<boolean>(true);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  // Vue par défaut : mosaïque sur téléphone, carrousel 3D ailleurs (on peut toujours basculer)
  const [phone, setPhone] = useState<boolean>(false);
  const [modeResolved, setModeResolved] = useState<boolean>(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    let ok = false;
    try {
      const c = document.createElement("canvas");
      ok = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      ok = false;
    }
    setWebglOk(ok);
    // Ouverture directe d'une carte : ?carte=<id> (liens partagés et pages statiques des cartes)
    const params = new URLSearchParams(window.location.search);
    const wanted = CARDS.find((c) => c.id === params.get("carte"));
    const wantedFamily = FAMILIES.find((f) => f.id === params.get("famille"));
    const isPhone = window.matchMedia("(max-width: 767px)").matches;
    setPhone(isPhone);
    if (!ok || ((mq.matches || isPhone) && !wanted && !wantedFamily)) {
      setViewMode("mosaic");
    }
    setModeResolved(true);
    if (ok && wanted) {
      setSelectedFamilyId(wanted.familyId);
      setSelectedCardId(wanted.id);
    } else if (ok && wantedFamily) {
      setSelectedFamilyId(wantedFamily.id);
    }
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const [fromMosaic, setFromMosaic] = useState<boolean>(false);

  // État du Deck 3D (pile compacte vs éventail des 7 familles)
  const [isDeckSpread, setIsDeckSpread] = useState<boolean>(true);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  // Position du carrousel dans une ref (lue par la scène 3D à chaque frame) : pas de re-rendu React
  // à chaque pixel de défilement. Seul l'index actif déclenche un rendu.
  const deckScrollRef = useRef<number>(0);
  const [deckIdx, setDeckIdx] = useState<number>(3);
  const setDeckScrollOffset = (next: number | ((prev: number) => number)) => {
    const v = typeof next === "function" ? next(deckScrollRef.current) : next;
    deckScrollRef.current = v;
    const idx = Math.round(3 - v);
    setDeckIdx((prev) => (prev === idx ? prev : idx));
  };

  // Vitesse de défilement continu au survol gauche/droite
  const hoverVelocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartOffsetRef = useRef<number>(0);

  // Détection du survol gauche et droite pour faire défiler le carrousel 3D
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedFamilyId || viewMode === "mosaic" || reducedMotion) {
      hoverVelocityRef.current = 0;
      return;
    }
    const width = window.innerWidth;
    const x = e.clientX;
    const ratio = x / width;

    // Survol vers la droite (ratio > 0.68) : fait défiler pour révéler les familles de droite
    if (ratio > 0.68) {
      const factor = (ratio - 0.68) / 0.32; // 0 à 1
      hoverVelocityRef.current = -factor * 2.4;
    }
    // Survol vers la gauche (ratio < 0.32) : fait défiler pour révéler les familles de gauche
    else if (ratio < 0.32) {
      const factor = (0.32 - ratio) / 0.32; // 0 à 1
      hoverVelocityRef.current = factor * 2.4;
    } else {
      hoverVelocityRef.current = 0;
    }
  };

  const handleMouseLeave = () => {
    hoverVelocityRef.current = 0;
    isDraggingRef.current = false;
  };

  // Boucle de défilement continu au survol
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isDraggingRef.current && Math.abs(hoverVelocityRef.current) > 0.001) {
        setDeckScrollOffset((prev) => {
          const next = prev + hoverVelocityRef.current * dt;
          return Math.max(-3.0, Math.min(3.0, next));
        });
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Défilement à la molette / touchpad
  const handleWheel = (e: React.WheelEvent) => {
    if (selectedFamilyId || viewMode === "mosaic") return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    setDeckScrollOffset((prev) => Math.max(-3.0, Math.min(3.0, prev - delta * 0.0025)));
  };

  // Glisser-déposer / swipe à la souris ou au doigt
  const handlePointerDown = (e: React.PointerEvent) => {
    if (selectedFamilyId || viewMode === "mosaic") return;
    // Seule la scène (et non les boutons ou le panneau) fait défiler le carrousel
    if (!(e.target as HTMLElement).closest("canvas")) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = deckScrollRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (selectedFamilyId || viewMode === "mosaic") return;
    handleMouseMove(e as unknown as React.MouseEvent<HTMLDivElement>);
    if (isDraggingRef.current) {
      const diff = (e.clientX - dragStartXRef.current) / (window.innerWidth * 0.35);
      setDeckScrollOffset(Math.max(-3.0, Math.min(3.0, dragStartOffsetRef.current + diff * 1.5)));
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Écoute de la fiche à voix haute
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [canSpeak, setCanSpeak] = useState<boolean>(false);
  const manifest: Record<string, unknown> = lang === "fr" ? audioManifest : audioManifestEn;
  useEffect(() => setCanSpeak(speechSupported() || Object.keys(manifest).length > 0), [manifest]);

  // Impression : une page par carte (la carte ouverte, ou les 42 depuis la mosaïque)
  const [printCards, setPrintCards] = useState<{ cards: CardData[]; booklet: boolean } | null>(null);
  useEffect(() => {
    if (!printCards) return;
    let cancelled = false;
    const finish = () => setPrintCards(null);
    window.addEventListener("afterprint", finish, { once: true });
    const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("#print-root img"));
    Promise.all(imgs.map((img) => img.decode().catch(() => undefined))).then(() => {
      if (!cancelled) window.print();
    });
    return () => {
      cancelled = true;
      window.removeEventListener("afterprint", finish);
    };
  }, [printCards]);

  // Lien direct vers le dossier imprimable : ...?dossier=pdf
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("dossier") === "pdf") {
      setPrintCards({ cards: CARDS, booklet: true });
    }
  }, []);

  // Bottom sheet mobile (collapsed | intermediate | expanded)
  const [sheetState, setSheetState] = useState<"collapsed" | "intermediate" | "expanded">("collapsed");

  // Mode Édition de développement
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTab, setEditTab] = useState<"write" | "preview">("write");
  const [customMarkdownMap, setCustomMarkdownMap] = useState<Record<string, string>>({});
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>("Enregistré automatiquement");

  // Détermination de l'étape courante pour la transition 3D continue
  const currentStage: "deck" | "family" | "card" = selectedCardId
    ? "card"
    : selectedFamilyId
    ? "family"
    : "deck";

  // Chargement des modifications locales (localStorage)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("7familles_markdown_edits");
      if (saved) {
        setCustomMarkdownMap(JSON.parse(saved));
      }
    } catch {
      // Ignorer si indisponible
    }
  }, []);

  // Recentre la puce active dans sa barre défilante (sans faire défiler la page)
  const centerInParent = (el: Element | null) => {
    const child = el as HTMLElement | null;
    const box = child?.parentElement;
    if (!child || !box) return;
    box.scrollTo({
      left: child.offsetLeft - (box.clientWidth - child.clientWidth) / 2,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (currentStage === "deck") centerInParent(document.querySelector(`[data-deck-idx="${deckIdx}"]`));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckIdx, currentStage]);

  const activeFamily = FAMILIES.find((f) => f.id === selectedFamilyId) || null;
  const currentCard = CARDS.find((c) => c.id === selectedCardId) || null;
  const familyCards = selectedFamilyId ? CARDS.filter((c) => c.familyId === selectedFamilyId) : [];

  // Contenu markdown actif (édité ou original)
  const currentMarkdown = currentCard
    ? customMarkdownMap[currentCard.id] ?? currentCard.contentMarkdown
    : "";

  const handleUpdateMarkdown = (newMd: string) => {
    if (!currentCard) return;
    const updated = { ...customMarkdownMap, [currentCard.id]: newMd };
    setCustomMarkdownMap(updated);
    setSaveStatus("Modifications enregistrées");
    try {
      localStorage.setItem("7familles_markdown_edits", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const toggleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else if (currentCard) {
      setIsSpeaking(true);
      const readWithBrowserVoice = () =>
        speak(
          lang === "fr"
            ? markdownToSpeech(currentCard.title, currentCard.shortDescription, currentMarkdown)
            : markdownToSpeechEn(currentCard.title, currentCard.shortDescription, currentMarkdown),
          () => setIsSpeaking(false),
          lang
        );
      // Voix pré-enregistrée si la fiche n'a pas été modifiée dans l'éditeur, sinon voix du navigateur
      const hasAudio = currentCard.id in manifest && customMarkdownMap[currentCard.id] === undefined;
      if (hasAudio) {
        playAudio(asset(lang === "fr" ? `/audio/${currentCard.id}.mp3` : `/audio/en/${currentCard.id}.mp3`), () => setIsSpeaking(false), readWithBrowserVoice);
      } else {
        readWithBrowserVoice();
      }
    }
  };

  const markdownFor = (card: CardData) => customMarkdownMap[card.id] ?? card.contentMarkdown;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(currentMarkdown);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  const handleExportAll = () => {
    const exportData = CARDS.map((c) => ({
      id: c.id,
      familyId: c.familyId,
      title: c.title,
      markdown: customMarkdownMap[c.id] ?? c.contentMarkdown,
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "7familles_contenus_pedagogiques.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const map: Record<string, string> = { ...customMarkdownMap };
        parsed.forEach((item: { id: string; markdown: string }) => {
          map[item.id] = item.markdown;
        });
        setCustomMarkdownMap(map);
        localStorage.setItem("7familles_markdown_edits", JSON.stringify(map));
        alert("Importation réussie des contenus pédagogiques !");
      } catch {
        alert("Erreur lors de la lecture du fichier JSON.");
      }
    };
    reader.readAsText(file);
  };

  // Clic sur une carte de la mosaïque : on l'ouvre dans la fiche 3D, avec retour possible vers la mosaïque
  const openCardFromMosaic = (card: CardData) => {
    setSelectedFamilyId(card.familyId);
    setSelectedCardId(card.id);
    setSheetState("collapsed");
    setFromMosaic(true);
    setViewMode("3d");
  };

  // Fermer la carte : retour à la mosaïque si on en vient, sinon à la famille
  const closeCard = () => {
    if (fromMosaic) {
      setSelectedCardId(null);
      setSelectedFamilyId(null);
      setViewMode("mosaic");
    } else {
      setSelectedCardId(null);
    }
  };

  // Clic dans le vide de la scène : retour à l'affichage plus général
  const handleSceneBack = () => {
    if (selectedCardId) closeCard();
    else if (selectedFamilyId) setSelectedFamilyId(null);
  };

  const switchViewMode = (mode: "3d" | "mosaic") => {
    if (mode === viewMode) return;
    setSelectedCardId(null);
    setSelectedFamilyId(null);
    setHoveredCardId(null);
    setViewMode(mode);
  };

  useEffect(() => {
    stopSpeaking();
    setIsSpeaking(false);
    setIsFlipped(false);
    if (!selectedCardId) setFromMosaic(false);
  }, [selectedCardId]);

  const handlePrevCard = () => {
    if (!currentCard || familyCards.length === 0) return;
    const idx = familyCards.findIndex((c) => c.id === currentCard.id);
    const nextIdx = (idx - 1 + familyCards.length) % familyCards.length;
    setSelectedCardId(familyCards[nextIdx].id);
  };

  const handleNextCard = () => {
    if (!currentCard || familyCards.length === 0) return;
    const idx = familyCards.findIndex((c) => c.id === currentCard.id);
    const nextIdx = (idx + 1) % familyCards.length;
    setSelectedCardId(familyCards[nextIdx].id);
  };

  // URL partageable : ?famille=<id> ou ?carte=<id>, et bouton « Précédent » du navigateur
  const urlSyncSkipFirst = useRef(true);
  useEffect(() => {
    if (urlSyncSkipFirst.current) {
      urlSyncSkipFirst.current = false;
      return;
    }
    const params = new URLSearchParams(window.location.search);
    params.delete("carte");
    params.delete("famille");
    if (selectedCardId) params.set("carte", selectedCardId);
    else if (selectedFamilyId) params.set("famille", selectedFamilyId);
    const qs = params.toString();
    const next = window.location.pathname + (qs ? `?${qs}` : "");
    if (next !== window.location.pathname + window.location.search) window.history.pushState({}, "", next);
  }, [selectedFamilyId, selectedCardId]);
  useEffect(() => {
    const onPop = () => {
      const params = new URLSearchParams(window.location.search);
      const card = CARDS.find((c) => c.id === params.get("carte"));
      const fam = FAMILIES.find((f) => f.id === params.get("famille"));
      setSelectedCardId(card ? card.id : null);
      setSelectedFamilyId(card ? card.familyId : fam ? fam.id : null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Focus : à chaque changement d'étape, le focus clavier suit le nouveau titre
  const focusSkipFirst = useRef(true);
  useEffect(() => {
    if (focusSkipFirst.current) {
      focusSkipFirst.current = false;
      return;
    }
    if (viewMode !== "3d") return;
    const target = currentStage === "card" ? "card-title" : currentStage === "family" ? "family-title" : "deck-title";
    const el = Array.from(document.querySelectorAll<HTMLElement>(`[data-focus-target="${target}"]`)).find(
      (n) => n.offsetParent !== null
    );
    el?.focus({ preventScroll: true });
  }, [currentStage, selectedCardId, viewMode]);

  // Annonce vocale dynamique pour les lecteurs d'écran (WCAG 4.1.3)
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>("");

  useEffect(() => {
    if (currentStage === "card" && currentCard) {
      setLiveAnnouncement(t.liveCard(currentCard.num, currentCard.title, currentCard.familyName));
    } else if (currentStage === "family" && activeFamily) {
      setLiveAnnouncement(t.liveFamily(activeFamily.name));
    } else if (currentStage === "deck") {
      setLiveAnnouncement(t.liveDeck);
    }
  }, [currentStage, currentCard, activeFamily]);

  // Support tactile complet : balayage horizontal (swipe) et vertical
  const touchStartPosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchSheetStartPosRef = useRef<{ y: number; time: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    // Les bords de l'écran sont réservés aux gestes du système (retour arrière sur iOS et Android)
    const x0 = e.touches[0]?.clientX ?? 100;
    if (x0 < 24 || x0 > window.innerWidth - 24) {
      touchStartPosRef.current = null;
      return;
    }
    if (e.touches.length === 1) {
      touchStartPosRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPosRef.current) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartPosRef.current.x;
    const endY = e.changedTouches[0]?.clientY ?? touchStartPosRef.current.y;
    const deltaX = endX - touchStartPosRef.current.x;
    const deltaY = endY - touchStartPosRef.current.y;
    const duration = Date.now() - touchStartPosRef.current.time;
    touchStartPosRef.current = null;

    const inSheet = !!(e.target as HTMLElement | null)?.closest?.("#card-pedagogic-sheet");

    // Glisser franchement vers le bas sur la scène : retour à la famille
    if (
      currentStage === "card" &&
      !inSheet &&
      deltaY > 90 &&
      deltaY > Math.abs(deltaX) * 1.5 &&
      duration < 700
    ) {
      closeCard();
      return;
    }

    // Détection d'un geste de swipe horizontal franc (seuil 38px, ratio horizontal > 1.25)
    if (Math.abs(deltaX) > 38 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25 && duration < 650) {
      if (currentStage === "card") {
        if (inSheet) return; // ne change pas de carte quand on lit la fiche
        if (deltaX < 0) {
          handleNextCard();
        } else {
          handlePrevCard();
        }
      } else if (currentStage === "deck") {
        if (deltaX < 0) {
          setDeckScrollOffset((prev) => Math.max(-3.0, prev - 1.0));
        } else {
          setDeckScrollOffset((prev) => Math.min(3.0, prev + 1.0));
        }
      } else if (currentStage === "family") {
        if (deltaX < 0) {
          if (hoveredCardId && familyCards.length > 0) {
            const idx = familyCards.findIndex((c) => c.id === hoveredCardId);
            const nextIdx = (idx + 1) % familyCards.length;
            setHoveredCardId(familyCards[nextIdx].id);
          } else if (familyCards.length > 0) {
            setHoveredCardId(familyCards[0].id);
          }
        } else {
          if (hoveredCardId && familyCards.length > 0) {
            const idx = familyCards.findIndex((c) => c.id === hoveredCardId);
            const prevIdx = (idx - 1 + familyCards.length) % familyCards.length;
            setHoveredCardId(familyCards[prevIdx].id);
          } else if (familyCards.length > 0) {
            setHoveredCardId(familyCards[familyCards.length - 1].id);
          }
        }
      }
    }
  };

  // Glissement vertical sur le volet mobile (Bottom Sheet)
  const handleSheetTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchSheetStartPosRef.current = {
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  };

  const handleSheetTouchEnd = (e: React.TouchEvent) => {
    if (!touchSheetStartPosRef.current) return;
    const endY = e.changedTouches[0]?.clientY ?? touchSheetStartPosRef.current.y;
    const deltaY = endY - touchSheetStartPosRef.current.y;
    touchSheetStartPosRef.current = null;

    if (Math.abs(deltaY) > 30) {
      if (deltaY < 0) {
        // Balayage vers le haut : déployer d'un niveau
        if (sheetState === "collapsed") setSheetState("intermediate");
        else if (sheetState === "intermediate") setSheetState("expanded");
      } else {
        // Balayage vers le bas : réduire d'un niveau
        if (sheetState === "expanded") setSheetState("intermediate");
        else if (sheetState === "intermediate") setSheetState("collapsed");
      }
    }
  };

  // Navigation complète au clavier (WCAG 2.1.1 Clavier)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorer si l'utilisateur saisit dans un champ de formulaire
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (viewMode === "mosaic" && e.key !== "Escape") return;

      // Espace et Entrée activent déjà les boutons, liens et onglets : on ne les détourne pas
      const onControl =
        e.target instanceof Element && !!e.target.closest('button, a[href], [role="button"], [role="tab"], select, summary');
      if (onControl && (e.key === " " || e.key === "Spacebar" || e.key === "Enter")) return;

      if (e.key === "Escape") {
        if (isEditing) {
          setIsEditing(false);
        } else if (selectedCardId) {
          closeCard();
        } else if (selectedFamilyId) {
          setSelectedFamilyId(null);
        }
      } else if (e.key === "ArrowLeft") {
        if (currentStage === "card") {
          e.preventDefault();
          handlePrevCard();
        } else if (currentStage === "family") {
          e.preventDefault();
          if (familyCards.length > 0) {
            const currentIdx = familyCards.findIndex((c) => c.id === hoveredCardId);
            const nextIdx = (currentIdx - 1 + familyCards.length) % familyCards.length;
            setHoveredCardId(familyCards[nextIdx].id);
          }
        } else if (currentStage === "deck") {
          e.preventDefault();
          setDeckScrollOffset((prev) => Math.min(3.0, prev + 1.0));
        }
      } else if (e.key === "ArrowRight") {
        if (currentStage === "card") {
          e.preventDefault();
          handleNextCard();
        } else if (currentStage === "family") {
          e.preventDefault();
          if (familyCards.length > 0) {
            const currentIdx = familyCards.findIndex((c) => c.id === hoveredCardId);
            const nextIdx = (currentIdx + 1) % familyCards.length;
            setHoveredCardId(familyCards[nextIdx].id);
          }
        } else if (currentStage === "deck") {
          e.preventDefault();
          setDeckScrollOffset((prev) => Math.max(-3.0, prev - 1.0));
        }
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        if (currentStage === "card") {
          setIsFlipped((prev) => !prev);
        } else if (currentStage === "deck") {
          setIsDeckSpread((prev) => !prev);
        }
      } else if (e.key === "Enter") {
        if (currentStage === "deck") {
          e.preventDefault();
          const activeIdx = Math.round(3 - deckScrollRef.current);
          const fam = FAMILIES[Math.max(0, Math.min(FAMILIES.length - 1, activeIdx))];
          if (fam) setSelectedFamilyId(fam.id);
        } else if (currentStage === "family") {
          e.preventDefault();
          if (hoveredCardId) {
            setSelectedCardId(hoveredCardId);
                    setSheetState("collapsed");
          } else if (familyCards.length > 0) {
            setSelectedCardId(familyCards[0].id);
                    setSheetState("collapsed");
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentStage,
    selectedFamilyId,
    selectedCardId,
    isEditing,
    hoveredCardId,
    familyCards,
    currentCard,
    viewMode,
    fromMosaic,
  ]);

  return (
    <>
    <div className="relative w-full h-dvh overflow-hidden print:hidden bg-[radial-gradient(ellipse_at_50%_38%,#FFFEFB_0%,#F7F5F0_52%,#EAE4D6_100%)] text-stone-900 flex flex-col font-sans select-none">
      {/* Liens d'évitement : visibles uniquement quand ils reçoivent le focus clavier */}
      <nav
        aria-label={t.skipNav}
        className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:left-3 focus-within:top-3 focus-within:z-[60] focus-within:flex focus-within:gap-2 focus-within:rounded-xl focus-within:bg-white focus-within:p-2 focus-within:shadow-lg"
      >
        <a
          href="#contenu"
          className="min-h-[40px] inline-flex items-center rounded-lg bg-[#1b5d78] px-3 text-xs font-semibold text-white focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
        >
          {t.skipToContent}
        </a>
        <button
          type="button"
          onClick={() => switchViewMode("mosaic")}
          className="min-h-[40px] rounded-lg border border-stone-300 bg-white px-3 text-xs font-semibold text-stone-800 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
        >
          {t.skipToMosaic}
        </button>
      </nav>

      {/* Annonceur vocal accessible invisible */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* 1. BARRE SUPÉRIEURE ÉPURÉE & MODERNE AUX COULEURS DU CFBR */}
      {/* Liseré discret aux couleurs identitaires du CFBR (bleu canard / vert eau) */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#1b5d78] via-[#247c9e] to-[#22c55e] z-50 flex-shrink-0" />

      <header
        role="banner"
        className="h-16 [@media(max-height:500px)]:h-12 px-4 md:px-8 border-b border-stone-200/80 flex items-center justify-between backdrop-blur-md bg-[#FDFBF7]/90 z-40 transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Logo officiel CFBR & Titre avec retour accueil */}
          <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={t.home}
            aria-describedby="cfbr-logo-tip"
            className="relative cursor-pointer group focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none rounded-xl"
            onClick={() => {
              setSelectedFamilyId(null);
              setSelectedCardId(null);
              setViewMode(webglOk && !phone && !reducedMotion ? "3d" : "mosaic");
            }}
          >
            {/* Vignette épurée du logo CFBR */}
            <span className="relative flex items-center justify-center group-hover:scale-105 transition">
              <img
                src={asset("/cfbr-logo.png")}
                alt=""
                className="h-11 [@media(max-height:500px)]:h-9 w-auto object-contain"
              />
              {/* Infobulle au survol du logo : lien du CFBR avec la CIGB / ICOLD */}
              <span
                id="cfbr-logo-tip"
                role="tooltip"
                className="pointer-events-none absolute left-0 top-full mt-2 z-50 w-64 rounded-xl bg-stone-900 px-3 py-2 text-left text-[11px] font-medium leading-snug text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                {t.logoTip}
              </span>
            </span>
          </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm md:text-base font-bold tracking-tight text-stone-900 leading-tight whitespace-nowrap">
                  <span className="sm:hidden">{t.siteNameShort}</span>
                  <span className="hidden sm:inline">{t.siteName}</span>
                </h1>
                <span className="hidden lg:inline-flex whitespace-nowrap items-center text-[11px] font-semibold text-[#1b5d78] bg-[#1b5d78]/10 border border-[#1b5d78]/20 px-2 py-0.5 rounded-full">
                  1926–2026
                </span>
              </div>
              <p className="text-[11px] text-stone-600 hidden md:block">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Partenaires : le logo renvoie directement vers leur site ou leur compte */}
          <div className="hidden md:flex items-center gap-3 ml-2 pl-4 border-l border-stone-200">
            <a
              href={ARCHITECTES_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Les Architectes de l’Eau"
              className="block rounded-lg focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/logos/architectes-de-leau.png")} alt="Les Architectes de l’Eau" className="h-8 w-auto" />
            </a>
            <AgencyCredit placement="bottom" align="center" lang={lang}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset("/logos/hello-bim-bam-boum-small.png")}
                alt="Hello Bim Bam Boum"
                className="h-9 w-9 rounded-full"
              />
            </AgencyCredit>
          </div>
        </div>

        {/* Contrôles supérieurs */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Choix du mode d'affichage : carrousel 3D ou toutes les cartes */}
          <div
            role="group"
            aria-label={t.displayMode}
            className="flex h-10 flex-shrink-0 items-center gap-0.5 rounded-xl bg-white/95 border border-stone-200/90 p-0.5 shadow-xs"
          >
            {([
              { mode: "3d", label: t.carousel, Icon: Box, hint: t.carouselHint },
              { mode: "mosaic", label: t.mosaic, Icon: LayoutGrid, hint: t.mosaicHint },
            ] as const).map(({ mode, label, Icon, hint }) => (
              <button
                key={mode}
                onClick={() => switchViewMode(mode)}
                disabled={mode === "3d" && !webglOk}
                aria-pressed={viewMode === mode}
                aria-label={label}
                title={hint}
                className={`h-9 px-2.5 sm:px-3 rounded-[10px] text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none ${
                  viewMode === mode ? "bg-[#1b5d78] text-white shadow-sm" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <Icon className="w-4 h-4" />
                <span className={mode === "mosaic" ? "hidden sm:inline" : "hidden md:inline"}>{label}</span>
              </button>
            ))}
          </div>

          <GetCopyButton t={t} lang={lang} />

          {/* Changement de langue : on garde la carte ouverte (?carte=...) */}
          <a
            href={asset(paths.home(otherLang))}
            hrefLang={otherLang}
            lang={otherLang}
            onClick={(e) => {
              e.preventDefault();
              window.location.href = asset(paths.home(otherLang)) + window.location.search;
            }}
            aria-label={t.switchLangLabel}
            title={t.switchLangLabel}
            className="h-10 min-w-10 flex-shrink-0 px-2 inline-flex items-center justify-center rounded-xl bg-white/95 hover:bg-white text-xs font-bold text-stone-700 hover:text-stone-900 border border-stone-200/90 shadow-xs transition focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
          >
            {t.switchLang}
          </a>

          {/* Aide : gestes et raccourcis */}
          <button
            type="button"
            onClick={() => setShowHelp(true)}
            aria-label={t.help}
            title={t.help}
            className="hidden sm:flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 shadow-xs transition focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
          >
            <CircleHelp className="w-4 h-4" />
          </button>

          {/* Dossier complet à imprimer ou à enregistrer en PDF */}
          <button
            onClick={() => setPrintCards({ cards: CARDS, booklet: true })}
            title={t.printAllHint}
            aria-label={t.printAll}
            className="min-h-[40px] px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 shadow-xs transition flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden md:inline">{t.print}</span>
          </button>

          {/* Outil d'édition des contenus : réservé au développement (absent du site publié) */}
          {process.env.NODE_ENV === "development" && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
              isEditing
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                : "bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 shadow-xs"
            }`}
            aria-label={isEditing ? "Fermer le mode édition" : "Ouvrir le mode édition"}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mode Édition</span>
          </button>
          )}
        </div>
      </header>

      {/* 2. SCÈNE 3D UNIQUE ET PERMANENTE (AU CŒUR DU SITE) */}
      <main
        id="contenu"
        role="main"
        aria-label={t.mainLabel}
        className="flex-1 relative flex overflow-hidden touch-pan-y"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {viewMode === "mosaic" && <MosaicView
            onOpenCard={openCardFromMosaic}
            onPrintAll={() => setPrintCards({ cards: CARDS, booklet: true })}
            notice={!webglOk ? t.mosaicNotice : undefined}
            lang={lang}
          />}

        {viewMode === "3d" && modeResolved && (
        <>
        {/* CANVAS WEBGL PLEIN ÉCRAN SOUS LES OVERLAYS */}
        <div
          className={`relative transition-all duration-500 ${
            currentStage === "card"
              ? sheetState === "expanded"
                ? "hidden md:flex md:w-[45%] h-full"
                : "w-full md:w-[45%] lg:w-[42%] h-full"
              : "w-full h-full"
          }`}
        >
          <Unified3DScene
            lang={lang}
            currentStage={currentStage}
            selectedFamilyId={selectedFamilyId}
            selectedCardId={selectedCardId}
            isFlipped={isFlipped}
            onBack={handleSceneBack}
            onSelectFamily={(fId) => {
              setSelectedFamilyId(fId);
              setSelectedCardId(null);
            }}
            onSelectCard={(cId) => {
              // Second clic sur la carte déjà ouverte (mobile) : la fiche monte à moitié, comme « En savoir plus »
              if (cId === selectedCardId) {
                if (window.innerWidth < 768 && sheetState === "collapsed") setSheetState("intermediate");
                return;
              }
              setSelectedCardId(cId);
              setSheetState("collapsed");
            }}
            hoveredCardId={hoveredCardId}
            setHoveredCardId={setHoveredCardId}
            isDeckSpread={isDeckSpread}
            deckScrollRef={deckScrollRef}
          />
        </div>

        {/* --- OVERLAYS FLUIDES SELON L'ÉTAPE --- */}

        {/* OVERLAY ÉTAPE 1 : DECK ACCUEIL */}
        {currentStage === "deck" && (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6">
            <h2 data-focus-target="deck-title" tabIndex={-1} className="sr-only focus:outline-none">
              {t.deckTitle}
            </h2>
            {/* Guide supérieur */}
            <div className="text-center pt-1">
              <span className="inline-block px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white/90 text-stone-700 border border-stone-200/90 backdrop-blur-md shadow-sm">
                <span className="hidden pointer-coarse:inline">
                  {t.hintTouch}
                </span>
                <span className="pointer-coarse:hidden">
                  {t.hintMouse}
                </span>
              </span>
            </div>

            {/* Barre inférieure : sélecteur rapide des 7 familles & bouton éventail */}
            <div className="flex flex-col items-center gap-2 pb-1 pointer-events-auto">
            <div className="flex flex-col lg:flex-row items-center justify-center gap-3 max-w-full">
              {/* Pastilles directes des 7 familles */}
              <div
                role="group"
                aria-label={t.quickPick}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/95 border border-stone-200/90 backdrop-blur-xl shadow-lg overflow-x-auto max-w-full"
              >
                {FAMILIES.map((fam, idx) => {
                  const isCentered = deckIdx === idx;
                  return (
                    <button
                      key={fam.id}
                      data-deck-idx={idx}
                      onClick={() => (isCentered ? setSelectedFamilyId(fam.id) : setDeckScrollOffset(3 - idx))}
                      className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
                        isCentered
                          ? "bg-stone-900 text-white shadow-sm border border-stone-900 scale-105"
                          : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                      }`}
                      title={isCentered ? t.openFamily(fam.name) : t.centerFamily(fam.name)}
                      aria-label={isCentered ? t.openFamily(fam.name) : t.centerFamily(fam.name)}
                      aria-current={isCentered ? "true" : undefined}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: fam.color }}
                      />
                      <span>{fam.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
              {/* Bouton éventail / paquet */}
              <button
                onClick={() => setIsDeckSpread(!isDeckSpread)}
                className="min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold bg-white/95 text-stone-800 border border-stone-300 hover:bg-stone-50 transition flex items-center gap-2 shadow-lg backdrop-blur-xl focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none"
                aria-label={isDeckSpread ? t.spreadOn : t.spreadOff}
              >
                <Compass className="w-4 h-4 text-cyan-600" />
                <span>{isDeckSpread ? t.spreadOn : t.spreadOff}</span>
              </button>

              {FOOTER_STYLE === "menu" && (
                <ResourcesMenu lang={lang} onPrintAll={() => setPrintCards({ cards: CARDS, booklet: true })} />
              )}
              </div>
            </div>
              {FOOTER_STYLE === "bar" && (
              <ResourcesNav
                lang={lang}
                compact
                onPrintAll={() => setPrintCards({ cards: CARDS, booklet: true })}
                className="max-w-5xl rounded-xl bg-white/80 px-3 py-1.5 backdrop-blur-md [@media(max-height:620px)]:hidden"
              />
              )}
            </div>
          </div>
        )}

        {/* OVERLAY ÉTAPE 2 : FAMILLE DÉPLOYÉE */}
        {currentStage === "family" && activeFamily && (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6">
            {/* Barre de retour et d'identification de famille */}
            <div className="flex items-center justify-between w-full max-w-6xl mx-auto pointer-events-auto">
              <button
                onClick={() => setSelectedFamilyId(null)}
                className="flex items-center gap-2 text-xs md:text-sm font-semibold text-stone-700 hover:text-stone-900 transition min-h-[44px] px-4 py-2 rounded-xl bg-white/95 hover:bg-white border border-stone-200/90 backdrop-blur-md shadow-md focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none"
                aria-label={t.backToFamiliesShort}
              >
                <ChevronLeft className="w-4 h-4" /> {t.backToFamilies}
              </button>

              <div className="flex items-center gap-2.5 min-h-[44px] px-4 py-2 rounded-xl bg-white/95 border border-stone-200/90 backdrop-blur-md shadow-md">
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-sm"
                  style={{ backgroundColor: activeFamily.color }}
                />
                <h2 data-focus-target="family-title" tabIndex={-1} className="text-sm font-bold text-stone-900 focus:outline-none">
                  {t.familyLabel(activeFamily.name)}
                </h2>
                <span className="text-xs text-stone-600">{t.sixCards}</span>
              </div>
            </div>

            {/* Accès clavier aux 6 cartes : apparaît seulement quand il reçoit le focus */}
            <nav
              aria-label={t.familyCardsNav(activeFamily.name)}
              className="pointer-events-auto sr-only focus-within:not-sr-only focus-within:absolute focus-within:bottom-4 focus-within:left-1/2 focus-within:z-40 focus-within:flex focus-within:max-w-[calc(100%-2rem)] focus-within:-translate-x-1/2 focus-within:flex-wrap focus-within:justify-center focus-within:gap-2 focus-within:rounded-2xl focus-within:bg-white/95 focus-within:p-2 focus-within:shadow-lg"
            >
              {familyCards.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onFocus={() => setHoveredCardId(c.id)}
                  onClick={() => {
                    setSelectedCardId(c.id);
                    setSheetState("collapsed");
                  }}
                  className="min-h-[40px] rounded-xl border border-stone-300 bg-white px-3 text-xs font-semibold text-stone-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none"
                >
                  {c.num}. {c.title}
                </button>
              ))}
            </nav>

            {/* Aide tactile : les noms des cartes sont affichés sous chacune d'elles */}
            <p className="hidden pointer-coarse:block self-center text-center text-[11px] font-medium text-stone-600 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-stone-200/80">
              {t.touchFamilyHint}
            </p>
          </div>
        )}

        {/* OVERLAY ÉTAPE 3 : CARTE INDIVIDUELLE SÉLECTIONNÉE */}
        {currentStage === "card" && currentCard && (
          <>
            {/* Contrôles carte (Haut) */}
            <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
              <button
                onClick={closeCard}
                className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 backdrop-blur-md transition flex items-center gap-2 shadow-md focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none"
                aria-label={fromMosaic ? t.backToMosaic : t.backToFamily(activeFamily?.name ?? "")}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{fromMosaic ? t.mosaic : activeFamily?.name}</span>
              </button>
            </div>

            <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
              <button
                onClick={handlePrevCard}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 backdrop-blur-md transition shadow-md flex items-center justify-center focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                title={t.prevCard}
                aria-label={t.prevCard}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span
                aria-label={t.cardOf(currentCard.num)}
                className="min-h-[44px] px-3.5 text-xs font-semibold bg-white/95 border border-stone-200/90 rounded-xl text-stone-800 backdrop-blur-md shadow-sm flex items-center justify-center"
              >
                {currentCard.num} / 6
              </span>
              <button
                onClick={handleNextCard}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 backdrop-blur-md transition shadow-md flex items-center justify-center focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                title={t.nextCard}
                aria-label={t.nextCard}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Expérience Desktop : Panneau Pédagogique droit sticky */}
            <div className="hidden md:flex flex-col flex-1 h-full border-l border-stone-200/80 bg-white/80 backdrop-blur-xl overflow-hidden z-20 shadow-xl">
              <div className="p-4 md:p-5 flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className="px-3.5 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: currentCard.familyColor }}
                    >
                      {currentCard.familyName} • {t.cardNo(currentCard.num).charAt(0).toUpperCase() + t.cardNo(currentCard.num).slice(1)}
                    </span>
                    {currentCard.location && (
                      <span className="text-xs font-medium text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200/80">
                        {currentCard.location}
                      </span>
                    )}
                  </div>

                  <h2
                    data-focus-target="card-title"
                    tabIndex={-1}
                    lang={lang === "fr" && currentCard.id === "monde-hoover-dam" ? "en" : undefined}
                    className="text-3xl font-extrabold text-stone-900 tracking-tight focus:outline-none"
                  >
                    {currentCard.title}
                  </h2>

                  <CardActions
                    isSpeaking={isSpeaking}
                    canSpeak={canSpeak}
                    onToggleSpeak={toggleSpeak}
                    onPrint={() => setPrintCards({ cards: [currentCard], booklet: false })}
                    t={t}
                  />

                  <p className="text-base text-stone-800 leading-relaxed font-medium bg-[#F5F2EB] p-4 rounded-xl border border-stone-200/90">
                    {currentCard.shortDescription}
                  </p>

                  <div className="card-prose">
                    <ReactMarkdown>{currentMarkdown}</ReactMarkdown>
                  </div>

                  <MoreLinks links={cardLinks(currentCard, lang)} t={t} />
                  <EnglishTerm term={otherLanguageTerm(currentCard, lang)?.term} wiki={otherLanguageTerm(currentCard, lang)?.wiki} t={t} lang={lang} />

                  {currentCard.credits && (
                    <div className="pt-6 border-t border-stone-200 text-xs text-stone-600 italic">
                      {t.creditPhoto} : {currentCard.credits}
                    </div>
                  )}
                  <p className="text-xs text-stone-600 italic">
                    <AgencyCredit lang={lang} />
                  </p>
                </div>
              </div>
            </div>

            {/* Expérience Mobile : Bottom Sheet à 3 états avec glissement tactile */}
            <div
              role="region"
              aria-label={t.sheetLabel}
              id="card-pedagogic-sheet"
              className={`md:hidden absolute bottom-0 left-0 right-0 z-30 bg-[#FDFBF7]/98 border-t border-stone-200/90 backdrop-blur-2xl rounded-t-3xl transition-all duration-300 ease-out flex flex-col shadow-2xl text-stone-900 ${
                sheetState === "collapsed"
                  ? "h-32"
                  : sheetState === "intermediate"
                  ? "h-[55%]"
                  : "h-[92%]"
              }`}
            >
              <div
                role="button"
                tabIndex={0}
                aria-expanded={sheetState !== "collapsed"}
                aria-controls="card-pedagogic-content"
                aria-label={
                  sheetState === "expanded"
                    ? t.sheetCollapse
                    : t.sheetExpand
                }
                className="w-full pt-3.5 pb-2.5 min-h-[48px] flex flex-col items-center justify-center cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none rounded-t-3xl"
                onClick={() => {
                  if (sheetState === "collapsed") setSheetState("intermediate");
                  else if (sheetState === "intermediate") setSheetState("expanded");
                  else setSheetState("collapsed");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (sheetState === "collapsed") setSheetState("intermediate");
                    else if (sheetState === "intermediate") setSheetState("expanded");
                    else setSheetState("collapsed");
                  }
                }}
                onTouchStart={handleSheetTouchStart}
                onTouchEnd={handleSheetTouchEnd}
              >
                <div className="w-12 h-1.5 rounded-full bg-stone-300 mb-2" />
                <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-600">
                  <span>
                    {sheetState === "expanded" ? t.sheetLessShort : t.sheetMoreShort}
                  </span>
                  <ChevronUp
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      sheetState === "expanded" ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              <div id="card-pedagogic-content" className="px-5 pb-6 overflow-y-auto flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white shadow-sm"
                    style={{ backgroundColor: currentCard.familyColor }}
                  >
                    {currentCard.familyName} • {lang === "fr" ? "n°" : "no. "}{currentCard.num}
                  </span>
                  {currentCard.period && (
                    <span className="text-[11px] text-stone-600">
                      {currentCard.period}
                    </span>
                  )}
                </div>

                <h2
                  data-focus-target="card-title"
                  tabIndex={-1}
                  lang={lang === "fr" && currentCard.id === "monde-hoover-dam" ? "en" : undefined}
                  className="text-lg font-bold text-stone-900 leading-snug focus:outline-none"
                >
                  {currentCard.title}
                </h2>
                <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                  {currentCard.shortDescription}
                </p>

                {sheetState !== "collapsed" && (
                  <div className="mt-4">
                    <CardActions
                      isSpeaking={isSpeaking}
                      canSpeak={canSpeak}
                      onToggleSpeak={toggleSpeak}
                      onPrint={() => setPrintCards({ cards: [currentCard], booklet: false })}
                    t={t}
                    />
                  </div>
                )}

                {sheetState !== "collapsed" && (
                  <div className="mt-5 pt-4 border-t border-stone-200 card-prose card-prose-sm">
                    <ReactMarkdown>{currentMarkdown}</ReactMarkdown>
                    <MoreLinks links={cardLinks(currentCard, lang)} t={t} />
                    <div className="mt-4"><EnglishTerm term={otherLanguageTerm(currentCard, lang)?.term} wiki={otherLanguageTerm(currentCard, lang)?.wiki} t={t} lang={lang} /></div>
                    {currentCard.credits && (
                      <div className="mt-4 pt-4 border-t border-stone-200 text-[11px] text-stone-600 italic">
                        {t.creditPhoto} : {currentCard.credits}
                      </div>
                    )}
                    <p className="mt-2 text-[11px] text-stone-600 italic">
                      <AgencyCredit lang={lang} />
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        </>
        )}
      </main>

      {/* 3. MODALE DU MODE ÉDITION DE DÉVELOPPEMENT */}
      {showHelp && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-stone-900/40 p-4 print:hidden"
          onClick={() => setShowHelp(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-title"
            className="w-full max-w-md rounded-2xl bg-white p-5 text-stone-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.key === "Escape" && setShowHelp(false)}
          >
            <div className="flex items-center justify-between">
              <h2 id="help-title" className="text-base font-bold text-stone-900">{t.helpTitle}</h2>
              <button
                type="button"
                autoFocus
                onClick={() => setShowHelp(false)}
                aria-label={t.helpClose}
                className="h-9 w-9 rounded-lg hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <GameIntro lang={lang} className="mt-3 text-sm leading-snug text-stone-800" />
            <ul className="mt-3 space-y-2 text-sm leading-snug">
              {t.helpItems.map((it) => (
                <li key={it.k}>
                  <strong>{it.k}</strong> {it.v}
                </li>
              ))}
              <li>
                <strong>{t.helpRules}</strong>{" "}
                <a href={asset(paths.rules(lang))} className="font-semibold text-[#1b5d78] underline">
                  {t.helpRulesLink}
                </a>
              </li>
              <li>{t.helpMosaic}</li>
            </ul>
          </div>
        </div>
      )}

      {isEditing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-dialog-title"
          className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-3 md:p-6"
        >
          <div className="bg-white border border-stone-300 w-full max-w-4xl h-[88vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden text-stone-900">
            <div className="px-5 py-3.5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-600" />
                <h3 id="edit-dialog-title" className="text-sm font-bold text-stone-900">
                  Éditeur Markdown • {currentCard ? currentCard.title : "Sélectionnez une carte"}
                </h3>
                <span className="text-xs text-emerald-600 font-medium ml-3 hidden sm:inline">
                  {saveStatus}
                </span>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                aria-label="Fermer la boîte de dialogue d'édition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-2.5 bg-stone-50/80 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div role="tablist" aria-label="Modes de rédaction" className="flex items-center gap-2">
                <button
                  role="tab"
                  aria-selected={editTab === "write"}
                  onClick={() => setEditTab("write")}
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-lg font-semibold transition focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
                    editTab === "write"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-stone-600 hover:text-stone-950"
                  }`}
                >
                  Édition
                </button>
                <button
                  role="tab"
                  aria-selected={editTab === "preview"}
                  onClick={() => setEditTab("preview")}
                  className={`min-h-[40px] px-3.5 py-1.5 rounded-lg font-semibold transition focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
                    editTab === "preview"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-stone-600 hover:text-stone-950"
                  }`}
                >
                  Aperçu
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMarkdown}
                  className="min-h-[40px] px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-1.5 transition border border-stone-200 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                  title="Copier le Markdown de cette carte"
                  aria-label="Copier le Markdown de la carte"
                >
                  {copiedNotice ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copiedNotice ? "Copié !" : "Copier"}</span>
                </button>

                <button
                  onClick={handleExportAll}
                  className="min-h-[40px] px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-1.5 transition border border-stone-200 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                  title="Exporter les 42 cartes en JSON"
                  aria-label="Exporter les 42 cartes en format JSON"
                >
                  <Download className="w-4 h-4" />
                  <span>Exporter tout (JSON)</span>
                </button>

                <label className="min-h-[40px] px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-1.5 cursor-pointer transition border border-stone-200 focus-within:ring-2 focus-within:ring-amber-500">
                  <Upload className="w-4 h-4" />
                  <span>Importer</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="hidden"
                    aria-label="Importer un fichier JSON de contenus"
                  />
                </label>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-hidden bg-stone-50/50">
              {currentCard ? (
                editTab === "write" ? (
                  <textarea
                    value={currentMarkdown}
                    onChange={(e) => handleUpdateMarkdown(e.target.value)}
                    className="w-full h-full bg-white text-stone-900 font-mono text-xs md:text-sm p-4 rounded-xl border border-stone-300 focus:border-amber-600 outline-none resize-none leading-relaxed shadow-inner"
                    placeholder="Écrivez le contenu pédagogique au format Markdown..."
                  />
                ) : (
                  <div className="w-full h-full bg-white p-6 rounded-xl border border-stone-300 overflow-y-auto prose prose-stone max-w-none text-xs md:text-sm shadow-inner">
                    <ReactMarkdown>{currentMarkdown}</ReactMarkdown>
                  </div>
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 text-sm">
                  Veuillez d'abord sélectionner une carte dans le jeu pour modifier son texte.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    {printCards && <PrintSheets cards={printCards.cards} booklet={printCards.booklet} markdownFor={markdownFor} lang={lang} />}
    </>
  );
}
