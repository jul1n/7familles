"use client";

import React, { useState, useEffect, useRef } from "react";
import { asset } from "@/lib/asset";
import dynamic from "next/dynamic";
import type { CardData } from "@/data/cards";
import { getContent, paths, type Lang } from "@/lib/content";
import { UI } from "@/lib/ui";
import MosaicView from "@/components/MosaicView";
import SearchDialog from "@/components/SearchDialog";
import QuizDialog from "@/components/QuizDialog";
import HelpDialog from "@/components/HelpDialog";
import { useInstallPrompt } from "@/lib/use-install-prompt";
import QuizPrint from "@/components/QuizPrint";
import { trackEvent, trackView } from "@/lib/analytics";
import { badgeColors } from "@/lib/color";
import { QUIZ_ENABLED, absoluteUrl } from "@/lib/site";
import PrintSheets from "@/components/PrintSheets";
import AgencyCredit from "@/components/AgencyCredit";
import { CardActions, EnglishTerm, GetCopyButton, MoreLinks } from "@/components/CardWidgets";
import { markdownToSpeech, markdownToSpeechEn, playAudio, speak, speechSupported, stopSpeaking } from "@/lib/speech";
import audioManifest from "@/data/audio-manifest.json";
import audioManifestEn from "@/data/audio-manifest-en.json";
import { ARCHITECTES_URL, LEGAL_URL, cardLinks, otherLanguageTerm } from "@/lib/links";
import {
  Printer,
  Edit3,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Compass,
  Box,
  Package,
  PackageOpen,
  LayoutGrid,
  CircleHelp,
  BookOpen,
  Search,
  Trophy,
} from "lucide-react";
import ReactMarkdown from "react-markdown";


// Éditeur Markdown : chargé en développement seulement, le code n'est pas inclus dans le site publié
const DevEditor =
  process.env.NODE_ENV === "development" ? dynamic(() => import("@/components/DevEditor"), { ssr: false }) : null;

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
  const [viewMode, setViewMode] = useState<"3d" | "mosaic">("mosaic");
  // Préférence « réduire les animations » et disponibilité de WebGL : sans l'un ou l'autre, on propose la mosaïque
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [webglOk, setWebglOk] = useState<boolean>(true);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [quizFamilyId, setQuizFamilyId] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [printQuiz, setPrintQuiz] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Raccourcis de recherche : « / » ou Ctrl/Cmd + K (hors champ de saisie)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || (e.target instanceof HTMLElement && e.target.isContentEditable);
      if ((e.key === "/" && !typing && !e.ctrlKey && !e.metaKey) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setShowSearch(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const { canInstall, install, iosHint } = useInstallPrompt();
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
    // La mosaïque est la vue de départ (elle est dans le HTML statique : affichage immédiat sur téléphone) ;
    // le carrousel 3D la remplace sur les écrans larges, sauf si WebGL manque ou si les animations sont réduites
    if (ok && (!(mq.matches || isPhone) || wanted || wantedFamily)) {
      setViewMode("3d");
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
  // Copies lues par l'écouteur « Précédent » du navigateur (enregistré une seule fois)
  const fromMosaicRef = useRef(false);
  fromMosaicRef.current = fromMosaic;

  // État du Deck 3D (pile compacte vs éventail des 7 familles)
  const [isDeckSpread, setIsDeckSpread] = useState<boolean>(true);
  // Paquet rassemblé : cartes rangées dans la boîte (modèle 3D) ou posées à côté
  const [isBoxed, setIsBoxed] = useState<boolean>(false);
  const toggleDeckSpread = () => {
    setIsBoxed(false);
    setIsDeckSpread((prev) => !prev);
  };
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

  // PDF des 10 quiz : on monte la mise en page, puis on lance l'impression du navigateur (« Enregistrer au format PDF »)
  useEffect(() => {
    if (!printQuiz) return;
    trackEvent("evt/quiz-pdf");
    const finish = () => setPrintQuiz(false);
    window.addEventListener("afterprint", finish, { once: true });
    const t = setTimeout(() => window.print(), 400);
    return () => {
      clearTimeout(t);
      window.removeEventListener("afterprint", finish);
    };
  }, [printQuiz]);

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
  const [customMarkdownMap, setCustomMarkdownMap] = useState<Record<string, string>>({});

  // Détermination de l'étape courante pour la transition 3D continue
  const currentStage: "deck" | "family" | "card" = selectedCardId
    ? "card"
    : selectedFamilyId
    ? "family"
    : "deck";

  // Modifications locales de l'éditeur (développement uniquement : le site publié n'y touche pas, plusieurs sites
  // partagent l'origine jul1n.github.io et pourraient écrire dans le même localStorage)
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
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

  // Clic sur une carte de la mosaïque : on l'ouvre dans la fiche 3D, avec retour possible vers la mosaïque
  const openCardFromMosaic = (card: CardData) => {
    setSelectedFamilyId(card.familyId);
    setSelectedCardId(card.id);
    setSheetState("collapsed");
    setFromMosaic(true);
    setViewMode("3d");
  };

  // Résultat de recherche : ouvre la carte comme depuis la mosaïque ou le carrousel, selon la vue d'où l'on vient
  const openCardFromSearch = (card: CardData) => {
    setShowSearch(false);
    if (viewMode === "mosaic") {
      openCardFromMosaic(card);
    } else {
      setSelectedFamilyId(card.familyId);
      setSelectedCardId(card.id);
      setSheetState("collapsed");
    }
  };

  // Partage : feuille de partage du téléphone, sinon copie du lien de la fiche (page statique avec image de partage)
  const shareCard = async (card: CardData) => {
    const url = absoluteUrl(paths.card(lang, card.id));
    trackEvent("evt/partage");
    try {
      if (navigator.share) {
        await navigator.share({ title: `${card.title} – ${card.familyName}`, text: card.shortDescription, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setToast(t.shareCopied);
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 2200);
    } catch {
      /* partage annulé par la personne : rien à faire */
    }
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
    if (selectedCardId) trackView(paths.card(lang, selectedCardId), CARDS.find((c) => c.id === selectedCardId)?.title);
  }, [selectedCardId, lang, CARDS]);

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
      // « Précédent » après une carte ouverte depuis la mosaïque : on revient à la mosaïque, pas au carrousel
      if (!card && !fam && fromMosaicRef.current) setViewMode("mosaic");
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
          toggleDeckSpread();
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
    <div className="relative w-full h-dvh overflow-hidden pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] print:hidden bg-[radial-gradient(ellipse_at_50%_38%,#FFFEFB_0%,#F7F5F0_52%,#EAE4D6_100%)] text-stone-900 flex flex-col font-sans select-none">
      {/* Liens d'évitement : visibles uniquement quand ils reçoivent le focus clavier */}
      <nav
        aria-label={t.skipNav}
        className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:left-3 focus-within:top-3 focus-within:z-[60] focus-within:flex focus-within:gap-2 focus-within:rounded-xl focus-within:bg-white focus-within:p-2 focus-within:shadow-lg"
      >
        <a
          href="#contenu"
          className="min-h-[44px] inline-flex items-center rounded-lg bg-[#1b5d78] px-3 text-xs font-semibold text-white focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
        >
          {t.skipToContent}
        </a>
        <button
          type="button"
          onClick={() => switchViewMode("mosaic")}
          className="min-h-[44px] rounded-lg border border-stone-300 bg-white px-3 text-xs font-semibold text-stone-800 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
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
        className="topbar h-16 shrink-0 gap-3 [@media(max-height:500px)]:h-12 px-4 md:px-8 border-b border-stone-200/80 flex items-center justify-between backdrop-blur-md bg-[#FDFBF7]/90 z-40 transition-colors"
      >
        <div className="topbar-brand flex min-w-0 items-center gap-3">
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
                className="topbar-cfbr h-11 [@media(max-height:500px)]:h-9 w-auto object-contain"
              />
              {/* Infobulle au survol du logo : lien du CFBR avec la CIGB / ICOLD */}
              <span
                id="cfbr-logo-tip"
                role="tooltip"
                className="pointer-events-none absolute left-0 top-full mt-2 z-50 w-64 rounded-xl bg-stone-900 px-3 py-2 text-left text-xs font-medium leading-snug text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                {t.logoTip}
              </span>
            </span>
          </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="topbar-title text-sm md:text-base font-bold tracking-tight text-stone-900 leading-tight whitespace-nowrap">
                  <span className="topbar-short-title sm:hidden">{t.siteNameShort}</span>
                  <span className="topbar-full-title hidden sm:inline">{t.siteName}</span>
                </h1>
                <span className="topbar-date hidden lg:inline-flex whitespace-nowrap items-center text-xs font-semibold text-[#1b5d78] bg-[#1b5d78]/10 border border-[#1b5d78]/20 px-2 py-0.5 rounded-full">
                  1926–2026
                </span>
              </div>
              <p className="topbar-subtitle text-xs text-stone-600 hidden md:block">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Partenaires : le logo renvoie directement vers leur site ou leur compte */}
          <div className="topbar-partners hidden md:flex shrink-0 items-center gap-3 ml-2 pl-4 border-l border-stone-200">
            <a
              href={ARCHITECTES_URL}
              target="_blank"
              rel="noopener noreferrer"
              title="Les Architectes de l’Eau"
              className="topbar-architectes block shrink-0 rounded-lg focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/logos/architectes-de-leau.png")} alt="Les Architectes de l’Eau" className="h-8 w-auto max-w-none" />
            </a>
            <AgencyCredit placement="bottom" align="center" lang={lang}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset("/logos/hello-bim-bam-boum-small.png")}
                alt="Hello Bim Bam Boum"
                className="topbar-agency h-9 w-9 rounded-full"
              />
            </AgencyCredit>
          </div>
        </div>

        {/* Contrôles supérieurs */}
        <div className="topbar-controls flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Choix du mode d'affichage : carrousel 3D ou toutes les cartes */}
          <div
            role="group"
            aria-label={t.displayMode}
            className="flex h-11 flex-shrink-0 items-center gap-0.5 rounded-xl bg-white/95 border border-stone-200/90 p-0.5 shadow-xs"
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
                className={`h-10 px-2.5 sm:px-3 rounded-[10px] text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none ${
                  viewMode === mode ? "bg-[#1b5d78] text-white shadow-sm" : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                <Icon className="w-4 h-4" />
                <span className={`topbar-action-label ${mode === "mosaic" ? "hidden sm:inline" : "hidden md:inline"}`}>{label}</span>
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
            aria-label={`${t.switchLang} – ${t.switchLangLabel}`}
            title={t.switchLangLabel}
            className="h-11 min-w-11 flex-shrink-0 px-2 inline-flex items-center justify-center rounded-xl bg-white/95 hover:bg-white text-xs font-bold text-stone-700 hover:text-stone-900 border border-stone-200/90 shadow-xs transition focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
          >
            {t.switchLang}
          </a>

          {/* Quiz (sur téléphone : bouton de la mosaïque) */}
          {QUIZ_ENABLED && (
            <button
              type="button"
              onClick={() => { setQuizFamilyId(null); setShowQuiz(true); }}
              aria-label={t.quiz.open}
              title={t.quiz.open}
              className="hidden sm:flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/95 hover:bg-white text-amber-600 border border-stone-200/90 shadow-xs transition focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
            >
              <Trophy className="w-4 h-4" />
            </button>
          )}

          {/* Recherche dans les cartes (sur téléphone : bouton de la mosaïque) */}
          <button
            type="button"
            onClick={() => setShowSearch(true)}
            aria-label={t.search}
            title={`${t.search} ( / )`}
            className="hidden sm:flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 shadow-xs transition focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Aide : gestes et raccourcis */}
          <button
            type="button"
            onClick={() => setShowHelp(true)}
            aria-label={t.help}
            title={t.help}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 shadow-xs transition focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
          >
            <CircleHelp className="w-4 h-4" />
          </button>

          {/* Dossier complet à imprimer ou à enregistrer en PDF */}
          <button
            onClick={() => setPrintCards({ cards: CARDS, booklet: true })}
            title={t.printAllHint}
            aria-label={t.printAll}
            className="min-h-[44px] px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 shadow-xs transition flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
          >
            <Printer className="w-4 h-4" />
            <span className="topbar-action-label hidden md:inline">{t.print}</span>
          </button>

          {/* Outil d'édition des contenus : réservé au développement (absent du site publié) */}
          {process.env.NODE_ENV === "development" && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
              isEditing
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                : "bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 shadow-xs"
            }`}
            title={isEditing ? "Fermer le mode édition" : "Ouvrir le mode édition"}
            aria-label={isEditing ? "Fermer le mode édition" : "Ouvrir le mode édition"}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="topbar-action-label hidden md:inline">Mode Édition</span>
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
        {/* Avant le choix de la vue, la mosaïque reste invisible sur écran large pour éviter un éclair avant la 3D */}
          <div className={viewMode === "mosaic" ? `contents ${modeResolved ? "" : "md:invisible"}` : "hidden"}>
            <MosaicView
              visible={viewMode === "mosaic"}
              onOpenCard={openCardFromMosaic}
              notice={!webglOk ? t.mosaicNotice : undefined}
              onSearch={() => setShowSearch(true)}
              onQuiz={QUIZ_ENABLED ? (familyId) => { setQuizFamilyId(familyId); setShowQuiz(true); } : undefined}
              lang={lang}
            />
          </div>

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
            isBoxed={isBoxed}
            onToggleBox={() => setIsBoxed((prev) => !prev)}
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
                      className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
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
                onClick={toggleDeckSpread}
                className="min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold bg-white/95 text-stone-800 border border-stone-300 hover:bg-stone-50 transition flex items-center gap-2 shadow-lg backdrop-blur-xl focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none"
                aria-label={isDeckSpread ? t.spreadOn : t.spreadOff}
              >
                <Compass className="w-4 h-4 text-cyan-600" />
                <span>{isDeckSpread ? t.spreadOn : t.spreadOff}</span>
              </button>

              {/* Boîte de jeu : visible quand le paquet est rassemblé */}
              {!isDeckSpread && (
                <button
                  onClick={() => setIsBoxed((prev) => !prev)}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold bg-white/95 text-stone-800 border border-stone-300 hover:bg-stone-50 transition flex items-center gap-2 shadow-lg backdrop-blur-xl focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none"
                  aria-pressed={isBoxed}
                >
                  {isBoxed ? <PackageOpen className="w-4 h-4 text-cyan-600" /> : <Package className="w-4 h-4 text-cyan-600" />}
                  <span>{isBoxed ? t.boxOut : t.boxIn}</span>
                </button>
              )}

              {/* Règles du jeu : le seul lien utile ici, les autres sont dans la barre du haut */}
              <a
                href={asset(paths.rules(lang))}
                className="min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold bg-white/95 text-stone-800 border border-stone-300 hover:bg-stone-50 transition flex items-center gap-2 shadow-lg backdrop-blur-xl focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none"
              >
                <BookOpen className="w-4 h-4 text-[#1b5d78]" />
                <span>{t.rules}</span>
              </a>
              </div>
              <a
                href={LEGAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center rounded-lg bg-white/70 px-3 text-xs font-medium text-stone-700 underline underline-offset-2 backdrop-blur-md focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none [@media(max-height:620px)]:hidden"
              >
                {t.legal}
              </a>
            </div>
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
                  className="min-h-[44px] rounded-xl border border-stone-300 bg-white px-3 text-xs font-semibold text-stone-800 focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none"
                >
                  {c.num}. {c.title}
                </button>
              ))}
            </nav>

            {/* Aide tactile : les noms des cartes sont affichés sous chacune d'elles */}
            <p className="hidden pointer-coarse:block self-center text-center text-xs font-medium text-stone-600 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-stone-200/80">
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
              <div tabIndex={0} role="region" aria-label={currentCard.title} className="p-4 md:p-5 flex-1 overflow-y-auto focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1b5d78] focus-visible:outline-none">
                <div className="max-w-3xl mx-auto space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className="px-3.5 py-1 rounded-full text-xs font-bold shadow-sm"
                      style={badgeColors(currentCard.familyColor)}
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
                      onShare={() => shareCard(currentCard)}
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
                  ? "h-[260px] max-h-[60%]"
                  : sheetState === "intermediate"
                  ? "h-[55%]"
                  : "h-full rounded-none"
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
                    : t.readSheet
                }
                className="w-full pt-3.5 pb-2.5 min-h-[48px] flex flex-col items-center justify-center cursor-pointer select-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none rounded-t-3xl"
                onClick={() => {
                  if (sheetState !== "expanded") setSheetState("expanded");
                  else setSheetState("collapsed");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (sheetState !== "expanded") setSheetState("expanded");
                    else setSheetState("collapsed");
                  }
                }}
                onTouchStart={handleSheetTouchStart}
                onTouchEnd={handleSheetTouchEnd}
              >
                <div className="w-12 h-1.5 rounded-full bg-stone-300 mb-2" />
                <div className="flex items-center gap-1 text-xs font-semibold text-stone-600">
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

              <div className="px-5 pb-3 shrink-0">
                <CardActions
                      isSpeaking={isSpeaking}
                      canSpeak={canSpeak}
                      onToggleSpeak={toggleSpeak}
                      onPrint={() => setPrintCards({ cards: [currentCard], booklet: false })}
                      onShare={() => shareCard(currentCard)}
                    t={t}
                    />
                  </div>
              <div
                id="card-pedagogic-content"
                tabIndex={0}
                role="region"
                aria-label={currentCard.title}
                className={`px-5 pb-6 overflow-y-auto flex-1 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1b5d78] focus-visible:outline-none`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm"
                    style={badgeColors(currentCard.familyColor)}
                  >
                    {currentCard.familyName} • {lang === "fr" ? "n°" : "no. "}{currentCard.num}
                  </span>
                  {currentCard.period && (
                    <span className="text-xs text-stone-600">
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
                  <div className="mt-5 pt-4 border-t border-stone-200 card-prose card-prose-sm">
                    <ReactMarkdown>{currentMarkdown}</ReactMarkdown>
                    <MoreLinks links={cardLinks(currentCard, lang)} t={t} />
                    <div className="mt-4"><EnglishTerm term={otherLanguageTerm(currentCard, lang)?.term} wiki={otherLanguageTerm(currentCard, lang)?.wiki} t={t} lang={lang} /></div>
                    {currentCard.credits && (
                      <div className="mt-4 pt-4 border-t border-stone-200 text-xs text-stone-600 italic">
                        {t.creditPhoto} : {currentCard.credits}
                      </div>
                    )}
                    <p className="mt-2 text-xs text-stone-600 italic">
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

      {showQuiz && (
        <QuizDialog
          lang={lang}
          cards={CARDS}
          initialFamilyId={quizFamilyId}
          onClose={() => setShowQuiz(false)}
          onPrint={() => {
            setShowQuiz(false);
            setPrintQuiz(true);
          }}
          onOpenCard={(card) => {
            setShowQuiz(false);
            openCardFromSearch(card);
          }}
        />
      )}
      {showSearch && <SearchDialog cards={CARDS} lang={lang} onPick={openCardFromSearch} onClose={() => setShowSearch(false)} />}
      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-white shadow-lg print:hidden">
          {toast}
        </div>
      )}

      {/* 3. MODALE DU MODE ÉDITION DE DÉVELOPPEMENT */}
      {showHelp && <HelpDialog lang={lang} canInstall={canInstall} iosHint={iosHint} onInstall={install} onClose={() => setShowHelp(false)} />}

      {isEditing && DevEditor && (
        <DevEditor
          currentCard={currentCard}
          currentMarkdown={currentMarkdown}
          cards={CARDS}
          map={customMarkdownMap}
          onMapChange={setCustomMarkdownMap}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
    {printQuiz && <QuizPrint lang={lang} cards={CARDS} />}
    {printCards && <PrintSheets cards={printCards.cards} booklet={printCards.booklet} markdownFor={markdownFor} lang={lang} />}
    </>
  );
}
