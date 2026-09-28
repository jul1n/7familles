"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { FAMILIES, CARDS } from "@/data/cards";
import {
  Layers,
  RotateCcw,
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
  Globe,
  ExternalLink,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// Import de la scène 3D unifiée continue
const Unified3DScene = dynamic(() => import("@/components/Unified3DScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
      <span className="text-xs text-slate-400 font-medium">Initialisation de la scène 3D continue...</span>
    </div>
  ),
});

export default function Experience7Familles() {
  // Navigation & états monopage (SPA)
  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isCfbrModalOpen, setIsCfbrModalOpen] = useState<boolean>(false);

  // État du Deck 3D (pile compacte vs éventail des 7 familles)
  const [isDeckSpread, setIsDeckSpread] = useState<boolean>(true);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [deckScrollOffset, setDeckScrollOffset] = useState<number>(0);

  // Vitesse de défilement continu au survol gauche/droite
  const hoverVelocityRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartOffsetRef = useRef<number>(0);

  // Détection du survol gauche et droite pour faire défiler le carrousel 3D
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedFamilyId) {
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
    if (selectedFamilyId) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    setDeckScrollOffset((prev) => Math.max(-3.0, Math.min(3.0, prev - delta * 0.0025)));
  };

  // Glisser-déposer / swipe à la souris ou au doigt
  const handlePointerDown = (e: React.PointerEvent) => {
    if (selectedFamilyId) return;
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = deckScrollOffset;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (selectedFamilyId) return;
    handleMouseMove(e as unknown as React.MouseEvent<HTMLDivElement>);
    if (isDraggingRef.current) {
      const diff = (e.clientX - dragStartXRef.current) / (window.innerWidth * 0.35);
      setDeckScrollOffset(Math.max(-3.0, Math.min(3.0, dragStartOffsetRef.current + diff * 1.5)));
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

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

  const handlePrevCard = () => {
    if (!currentCard || familyCards.length === 0) return;
    const idx = familyCards.findIndex((c) => c.id === currentCard.id);
    const nextIdx = (idx - 1 + familyCards.length) % familyCards.length;
    setSelectedCardId(familyCards[nextIdx].id);
    setIsFlipped(false);
  };

  const handleNextCard = () => {
    if (!currentCard || familyCards.length === 0) return;
    const idx = familyCards.findIndex((c) => c.id === currentCard.id);
    const nextIdx = (idx + 1) % familyCards.length;
    setSelectedCardId(familyCards[nextIdx].id);
    setIsFlipped(false);
  };

  // Annonce vocale dynamique pour les lecteurs d'écran (WCAG 4.1.3)
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>("");

  useEffect(() => {
    if (currentStage === "card" && currentCard) {
      setLiveAnnouncement(
        `Carte ${currentCard.num} sur 6 sélectionnée : ${currentCard.title}, famille ${currentCard.familyName}. Flèches gauche et droite pour changer de carte, espace pour retourner.`
      );
    } else if (currentStage === "family" && activeFamily) {
      setLiveAnnouncement(
        `Famille ${activeFamily.name} ouverte. 6 cartes disponibles. Utilisez les flèches pour prévisualiser.`
      );
    } else if (currentStage === "deck") {
      setLiveAnnouncement(`Accueil : Vue des 7 familles des barrages.`);
    }
  }, [currentStage, currentCard, activeFamily]);

  // Support tactile complet : balayage horizontal (swipe) et vertical
  const touchStartPosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchSheetStartPosRef = useRef<{ y: number; time: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
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

    // Détection d'un geste de swipe horizontal franc (seuil 38px, ratio horizontal > 1.25)
    if (Math.abs(deltaX) > 38 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25 && duration < 650) {
      if (currentStage === "card") {
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

      if (e.key === "Escape") {
        if (isCfbrModalOpen) {
          setIsCfbrModalOpen(false);
        } else if (isEditing) {
          setIsEditing(false);
        } else if (selectedCardId) {
          setSelectedCardId(null);
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
          const activeIdx = Math.round(3 - deckScrollOffset);
          const fam = FAMILIES[Math.max(0, Math.min(FAMILIES.length - 1, activeIdx))];
          if (fam) setSelectedFamilyId(fam.id);
        } else if (currentStage === "family") {
          e.preventDefault();
          if (hoveredCardId) {
            setSelectedCardId(hoveredCardId);
            setIsFlipped(false);
            setSheetState("collapsed");
          } else if (familyCards.length > 0) {
            setSelectedCardId(familyCards[0].id);
            setIsFlipped(false);
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
    isCfbrModalOpen,
    hoveredCardId,
    deckScrollOffset,
    familyCards,
    currentCard,
  ]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#F7F5F0] text-stone-900 flex flex-col font-sans select-none">
      {/* Annonceur vocal accessible invisible */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* 1. BARRE SUPÉRIEURE ÉPURÉE & MODERNE AUX COULEURS DU CFBR */}
      {/* Liseré discret aux couleurs identitaires du CFBR (bleu canard / vert eau) */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#1b5d78] via-[#247c9e] to-[#22c55e] z-50 flex-shrink-0" />

      <header
        role="banner"
        className="h-16 px-4 md:px-8 border-b border-stone-200/80 flex items-center justify-between backdrop-blur-md bg-[#FDFBF7]/90 z-40 transition-colors"
      >
        <div className="flex items-center gap-3">
          {/* Logo officiel CFBR & Titre avec retour accueil */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Accueil du jeu des 7 familles - CFBR"
            className="flex items-center gap-3 cursor-pointer group focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none rounded-xl p-1 -m-1"
            onClick={() => {
              setSelectedFamilyId(null);
              setSelectedCardId(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setSelectedFamilyId(null);
                setSelectedCardId(null);
              }
            }}
          >
            {/* Vignette épurée du logo CFBR */}
            <div className="h-10 px-2 py-0.5 bg-white/95 border border-stone-200/90 rounded-xl shadow-xs flex items-center justify-center group-hover:scale-105 group-hover:shadow-md group-hover:border-[#1b5d78]/40 transition">
              <img
                src="/cfbr-logo.png"
                alt="Logo officiel CFBR"
                className="h-8 w-auto object-contain"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm md:text-base font-bold tracking-tight text-stone-900 leading-tight">
                  7 Familles des Barrages
                </h1>
                <span className="hidden sm:inline-flex items-center text-[10px] font-semibold text-[#1b5d78] bg-[#1b5d78]/10 border border-[#1b5d78]/20 px-2 py-0.5 rounded-full">
                  1926–2026
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Comité Français des Barrages et Réservoirs
              </p>
            </div>
          </div>
        </div>

        {/* Contrôles supérieurs */}
        <div className="flex items-center gap-2">
          {/* Bouton d'accès au site officiel CFBR avec consultation directe embarquée */}
          <button
            onClick={() => setIsCfbrModalOpen(true)}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/95 hover:bg-[#1b5d78] hover:text-white text-[#1b5d78] border border-[#1b5d78]/30 shadow-xs hover:shadow-md transition flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#1b5d78] focus-visible:outline-none"
            title="Consulter le site officiel CFBR (vue intégrée)"
            aria-label="Ouvrir le site officiel du CFBR dans une fenêtre intégrée"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Site CFBR</span>
          </button>

          {selectedCardId && (
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 shadow-xs hover:shadow-sm transition flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
              title="Retourner la carte à 180°"
              aria-label={isFlipped ? "Afficher le recto de la carte" : "Afficher le verso de la carte"}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isFlipped ? "Voir recto" : "Voir verso"}
              </span>
            </button>
          )}

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
        </div>
      </header>

      {/* 2. SCÈNE 3D UNIQUE ET PERMANENTE (AU CŒUR DU SITE) */}
      <main
        role="main"
        aria-label="Espace de jeu interactif 3D"
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
            currentStage={currentStage}
            selectedFamilyId={selectedFamilyId}
            selectedCardId={selectedCardId}
            isFlipped={isFlipped}
            onSelectFamily={(fId) => {
              setSelectedFamilyId(fId);
              setSelectedCardId(null);
            }}
            onSelectCard={(cId) => {
              setSelectedCardId(cId);
              setIsFlipped(false);
              setSheetState("collapsed");
            }}
            onFlipToggle={() => setIsFlipped(!isFlipped)}
            hoveredCardId={hoveredCardId}
            setHoveredCardId={setHoveredCardId}
            isDeckSpread={isDeckSpread}
            deckScrollOffset={deckScrollOffset}
          />
        </div>

        {/* --- OVERLAYS FLUIDES SELON L'ÉTAPE --- */}

        {/* OVERLAY ÉTAPE 1 : DECK ACCUEIL */}
        {currentStage === "deck" && (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6">
            {/* Guide supérieur */}
            <div className="text-center pt-1">
              <span className="inline-block px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white/90 text-stone-700 border border-stone-200/90 backdrop-blur-md shadow-sm">
                Glissez ou survolez pour faire défiler les 7 familles • Cliquez sur un paquet pour l'ouvrir
              </span>
            </div>

            {/* Zones de navigation latérales (flèches de défilement cliquables) */}
            <div className="flex-1 flex items-center justify-between px-2 pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeckScrollOffset((prev) => Math.min(3.0, prev + 1.0));
                }}
                className={`w-12 h-12 min-w-[44px] min-h-[44px] rounded-full bg-white/95 border border-stone-200/90 text-stone-700 hover:text-stone-900 hover:border-stone-400 backdrop-blur-xl shadow-lg transition pointer-events-auto flex items-center justify-center focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
                  deckScrollOffset >= 2.9
                    ? "opacity-25 pointer-events-none"
                    : "opacity-90 hover:opacity-100 hover:scale-105 active:scale-95"
                }`}
                title="Faire défiler vers la gauche"
                aria-label="Faire défiler vers la gauche"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeckScrollOffset((prev) => Math.max(-3.0, prev - 1.0));
                }}
                className={`w-12 h-12 min-w-[44px] min-h-[44px] rounded-full bg-white/95 border border-stone-200/90 text-stone-700 hover:text-stone-900 hover:border-stone-400 backdrop-blur-xl shadow-lg transition pointer-events-auto flex items-center justify-center focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
                  deckScrollOffset <= -2.9
                    ? "opacity-25 pointer-events-none"
                    : "opacity-90 hover:opacity-100 hover:scale-105 active:scale-95"
                }`}
                title="Faire défiler vers la droite"
                aria-label="Faire défiler vers la droite"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Barre inférieure : sélecteur rapide des 7 familles & bouton éventail */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pb-2 pointer-events-auto">
              {/* Pastilles directes des 7 familles */}
              <div
                role="tablist"
                aria-label="Sélection rapide des familles de barrages"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/95 border border-stone-200/90 backdrop-blur-xl shadow-lg overflow-x-auto max-w-full"
              >
                {FAMILIES.map((fam, idx) => {
                  const isCentered = Math.round(3 - deckScrollOffset) === idx;
                  return (
                    <button
                      key={fam.id}
                      onClick={() => setDeckScrollOffset(3 - idx)}
                      onDoubleClick={() => setSelectedFamilyId(fam.id)}
                      className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
                        isCentered
                          ? "bg-stone-900 text-white shadow-sm border border-stone-900 scale-105"
                          : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                      }`}
                      title={`Centrer la famille ${fam.name}`}
                      aria-label={`Centrer la famille ${fam.name}`}
                      aria-selected={isCentered}
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

              {/* Bouton éventail / paquet */}
              <button
                onClick={() => setIsDeckSpread(!isDeckSpread)}
                className="min-h-[44px] px-4 py-2.5 rounded-xl text-xs font-bold bg-white/95 text-stone-800 border border-stone-300 hover:bg-stone-50 transition flex items-center gap-2 shadow-lg backdrop-blur-xl focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none"
                aria-label={isDeckSpread ? "Rassembler le paquet en une pile" : "Déployer les 7 familles en éventail"}
              >
                <Compass className="w-4 h-4 text-cyan-600" />
                <span>{isDeckSpread ? "Rassembler le paquet" : "Déployer en éventail"}</span>
              </button>
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
                aria-label="Revenir à la vue des 7 familles"
              >
                <ChevronLeft className="w-4 h-4" /> Revenir aux 7 familles
              </button>

              <div className="flex items-center gap-2.5 min-h-[44px] px-4 py-2 rounded-xl bg-white/95 border border-stone-200/90 backdrop-blur-md shadow-md">
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-sm"
                  style={{ backgroundColor: activeFamily.color }}
                />
                <span className="text-sm font-bold text-stone-900">
                  Famille {activeFamily.name}
                </span>
                <span className="text-xs text-stone-500">• 6 cartes</span>
              </div>
            </div>

            {/* Sélecteur miniature rapide en bas */}
            <div
              role="group"
              aria-label="Sélection des cartes de la famille"
              className="flex items-center justify-center gap-2 max-w-full overflow-x-auto pb-2 pointer-events-auto"
            >
              {familyCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => {
                    setSelectedCardId(card.id);
                    setIsFlipped(false);
                    setSheetState("collapsed");
                  }}
                  className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 backdrop-blur-md transition shadow-md flex items-center gap-2 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                  aria-label={`Ouvrir la carte numéro ${card.num} : ${card.title}`}
                >
                  <span className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-700">
                    {card.num}
                  </span>
                  <span>{card.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* OVERLAY ÉTAPE 3 : CARTE INDIVIDUELLE SÉLECTIONNÉE */}
        {currentStage === "card" && currentCard && (
          <>
            {/* Contrôles carte (Haut) */}
            <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
              <button
                onClick={() => setSelectedCardId(null)}
                className="min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 backdrop-blur-md transition flex items-center gap-2 shadow-md focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:outline-none"
                aria-label={`Revenir à la famille ${activeFamily?.name}`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{activeFamily?.name}</span>
              </button>
            </div>

            <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
              <button
                onClick={handlePrevCard}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 backdrop-blur-md transition shadow-md flex items-center justify-center focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                title="Carte précédente"
                aria-label="Carte précédente"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span
                aria-label={`Carte numéro ${currentCard.num} sur 6`}
                className="min-h-[44px] px-3.5 text-xs font-semibold bg-white/95 border border-stone-200/90 rounded-xl text-stone-800 backdrop-blur-md shadow-sm flex items-center justify-center"
              >
                {currentCard.num} / 6
              </span>
              <button
                onClick={handleNextCard}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 backdrop-blur-md transition shadow-md flex items-center justify-center focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                title="Carte suivante"
                aria-label="Carte suivante"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Expérience Desktop : Panneau Pédagogique droit sticky */}
            <div className="hidden md:flex flex-col flex-1 h-full border-l border-stone-200/80 bg-white/80 backdrop-blur-xl overflow-hidden z-20 shadow-xl">
              <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="flex items-center justify-between">
                    <span
                      className="px-3.5 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: currentCard.familyColor }}
                    >
                      {currentCard.familyName} • Carte n°{currentCard.num}
                    </span>
                    {currentCard.location && (
                      <span className="text-xs font-medium text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200/80">
                        {currentCard.location}
                      </span>
                    )}
                  </div>

                  <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
                    {currentCard.title}
                  </h2>

                  <p className="text-base text-stone-800 leading-relaxed font-medium bg-[#F5F2EB] p-4 rounded-xl border border-stone-200/90">
                    {currentCard.shortDescription}
                  </p>

                  <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed">
                    <ReactMarkdown>{currentMarkdown}</ReactMarkdown>
                  </div>

                  {currentCard.credits && (
                    <div className="pt-6 border-t border-stone-200 text-xs text-stone-500 italic">
                      Crédits : {currentCard.credits}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Expérience Mobile : Bottom Sheet à 3 états avec glissement tactile */}
            <div
              role="region"
              aria-label="Fiche pédagogique de la carte"
              id="card-pedagogic-sheet"
              className={`md:hidden absolute bottom-0 left-0 right-0 z-30 bg-[#FDFBF7]/98 border-t border-stone-200/90 backdrop-blur-2xl rounded-t-3xl transition-all duration-300 ease-out flex flex-col shadow-2xl text-stone-900 ${
                sheetState === "collapsed"
                  ? "h-36"
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
                    ? "Réduire la fiche pédagogique"
                    : "Développer la fiche pédagogique"
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
                <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-500">
                  <span>
                    {sheetState === "expanded" ? "Réduire" : "En savoir plus"}
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
                    className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white shadow-sm"
                    style={{ backgroundColor: currentCard.familyColor }}
                  >
                    {currentCard.familyName} • n°{currentCard.num}
                  </span>
                  {currentCard.period && (
                    <span className="text-[10px] text-stone-500">
                      {currentCard.period}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-stone-900 leading-snug">
                  {currentCard.title}
                </h3>
                <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                  {currentCard.shortDescription}
                </p>

                {sheetState !== "collapsed" && (
                  <div className="mt-5 pt-4 border-t border-stone-200 prose prose-stone prose-xs max-w-none text-stone-700">
                    <ReactMarkdown>{currentMarkdown}</ReactMarkdown>
                    {currentCard.credits && (
                      <div className="mt-4 pt-4 border-t border-stone-200 text-[10px] text-stone-500 italic">
                        {currentCard.credits}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* 3. MODALE DU MODE ÉDITION DE DÉVELOPPEMENT */}
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

      {/* 4. MODALE CONSULTATION EMBEDDED DU SITE OFFICIEL CFBR */}
      {isCfbrModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cfbr-dialog-title"
          className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6"
        >
          <div className="bg-white border border-stone-300 w-full max-w-6xl h-[92vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden text-stone-900">
            {/* Barre d'en-tête de la modale CFBR */}
            <div className="px-4 py-3 border-b border-stone-200 bg-[#FDFBF7] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 px-2 py-0.5 bg-white border border-stone-200 rounded-lg flex items-center justify-center shadow-xs">
                  <img src="/cfbr-logo.png" alt="CFBR" className="h-7 w-auto object-contain" />
                </div>
                <div>
                  <h3 id="cfbr-dialog-title" className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-2">
                    Comité Français des Barrages et Réservoirs
                    <span className="text-[10px] text-[#1b5d78] bg-[#1b5d78]/10 font-semibold px-2 py-0.5 rounded-full border border-[#1b5d78]/20 hidden md:inline">
                      Site officiel embarqué
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-500 hidden sm:block">
                    https://www.barrages-cfbr.eu
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://www.barrages-cfbr.eu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-stone-50 text-stone-700 transition flex items-center gap-1.5 border border-stone-300 shadow-xs focus-visible:ring-2 focus-visible:ring-cyan-500"
                  title="Ouvrir le site CFBR dans un nouvel onglet"
                >
                  <span className="hidden sm:inline">Ouvrir dans un onglet</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
                </a>
                <button
                  onClick={() => setIsCfbrModalOpen(false)}
                  className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                  aria-label="Fermer la vue intégrée du site CFBR"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cadre de navigation web intégré (iframe sécurisée) */}
            <div className="flex-1 w-full h-full relative bg-stone-100">
              <iframe
                src="https://www.barrages-cfbr.eu"
                title="Site officiel du CFBR (Comité Français des Barrages et Réservoirs)"
                className="w-full h-full border-0"
                allow="fullscreen"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
