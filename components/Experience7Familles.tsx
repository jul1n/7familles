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

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#F7F5F0] text-stone-900 flex flex-col font-sans select-none">
      {/* 1. BARRE SUPÉRIEURE ÉPURÉE */}
      <header className="h-16 px-4 md:px-8 border-b border-stone-200/80 flex items-center justify-between backdrop-blur-md bg-[#F7F5F0]/85 z-40">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            setSelectedFamilyId(null);
            setSelectedCardId(null);
          }}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center shadow-md shadow-cyan-600/20 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-bold tracking-tight text-stone-900 leading-tight flex items-center gap-2">
              7 Familles des Barrages
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-stone-200/80 text-stone-700 border border-stone-300/80">
                Continuous 3D Scene
              </span>
            </h1>
            <p className="text-[11px] text-stone-500">
              CFBR • Centenaire 1926–2026
            </p>
          </div>
        </div>

        {/* Contrôles supérieurs */}
        <div className="flex items-center gap-2">
          {selectedCardId && (
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 shadow-sm transition flex items-center gap-1.5"
              title="Retourner la carte à 180°"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isFlipped ? "Voir recto" : "Voir verso"}
              </span>
            </button>
          )}

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              isEditing
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                : "bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 shadow-sm"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mode Édition</span>
          </button>
        </div>
      </header>

      {/* 2. SCÈNE 3D UNIQUE ET PERMANENTE (AU CŒUR DU SITE) */}
      <div
        className="flex-1 relative flex overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
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
              <span className="inline-block px-3.5 py-1 text-xs font-semibold rounded-full bg-white/85 text-stone-700 border border-stone-200/90 backdrop-blur-md shadow-sm">
                Survolez les bords gauche/droite pour faire défiler les 7 familles • Cliquez sur un paquet pour l'ouvrir
              </span>
            </div>

            {/* Zones de navigation latérales (flèches de défilement cliquables) */}
            <div className="flex-1 flex items-center justify-between px-2 pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeckScrollOffset((prev) => Math.min(3.0, prev + 1.0));
                }}
                className={`p-3 rounded-full bg-white/95 border border-stone-200/90 text-stone-600 hover:text-stone-900 hover:border-stone-400 backdrop-blur-xl shadow-lg transition pointer-events-auto ${
                  deckScrollOffset >= 2.9
                    ? "opacity-25 pointer-events-none"
                    : "opacity-85 hover:opacity-100 hover:scale-110"
                }`}
                title="Faire défiler vers la gauche"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeckScrollOffset((prev) => Math.max(-3.0, prev - 1.0));
                }}
                className={`p-3 rounded-full bg-white/95 border border-stone-200/90 text-stone-600 hover:text-stone-900 hover:border-stone-400 backdrop-blur-xl shadow-lg transition pointer-events-auto ${
                  deckScrollOffset <= -2.9
                    ? "opacity-25 pointer-events-none"
                    : "opacity-85 hover:opacity-100 hover:scale-110"
                }`}
                title="Faire défiler vers la droite"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Barre inférieure : sélecteur rapide des 7 familles & bouton éventail */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pb-2 pointer-events-auto">
              {/* Pastilles directes des 7 familles */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/95 border border-stone-200/90 backdrop-blur-xl shadow-lg overflow-x-auto max-w-full">
                {FAMILIES.map((fam, idx) => {
                  const isCentered = Math.round(3 - deckScrollOffset) === idx;
                  return (
                    <button
                      key={fam.id}
                      onClick={() => setDeckScrollOffset(3 - idx)}
                      onDoubleClick={() => setSelectedFamilyId(fam.id)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                        isCentered
                          ? "bg-stone-900 text-white shadow-sm border border-stone-900 scale-105"
                          : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                      }`}
                      title={`Centrer la famille ${fam.name}`}
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
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/95 text-stone-800 border border-stone-300 hover:bg-stone-50 transition flex items-center gap-2 shadow-lg backdrop-blur-xl"
              >
                <Compass className="w-4 h-4 text-cyan-600" />
                {isDeckSpread ? "Rassembler le paquet" : "Déployer en éventail"}
              </button>
            </div>
          </div>
        )}

        {/* OVERLAY ÉTAPE 2 : FAMILLE DÉPLOYÉE */}
        {currentStage === "family" && activeFamily && (
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-5 md:p-6">
            {/* Barre de retour et d'identification de famille */}
            <div className="flex items-center justify-between w-full max-w-6xl mx-auto pointer-events-auto">
              <button
                onClick={() => setSelectedFamilyId(null)}
                className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-stone-700 hover:text-stone-900 transition px-3.5 py-1.5 rounded-xl bg-white/95 hover:bg-white border border-stone-200/90 backdrop-blur-md shadow-md"
              >
                <ChevronLeft className="w-4 h-4" /> Revenir aux 7 familles
              </button>

              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-white/95 border border-stone-200/90 backdrop-blur-md shadow-md">
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
            <div className="flex items-center justify-center gap-2 max-w-full overflow-x-auto pb-2 pointer-events-auto">
              {familyCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => {
                    setSelectedCardId(card.id);
                    setIsFlipped(false);
                    setSheetState("collapsed");
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 backdrop-blur-md transition shadow-md flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span className="w-4 h-4 rounded-full bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-700">
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
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 backdrop-blur-md transition flex items-center gap-1 shadow-md"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                {activeFamily?.name}
              </button>
            </div>

            <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5">
              <button
                onClick={handlePrevCard}
                className="p-1.5 rounded-lg bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 backdrop-blur-md transition shadow-md"
                title="Carte précédente"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold px-2.5 py-1 bg-white/95 border border-stone-200/90 rounded-lg text-stone-800 backdrop-blur-md shadow-sm">
                {currentCard.num} / 6
              </span>
              <button
                onClick={handleNextCard}
                className="p-1.5 rounded-lg bg-white/95 hover:bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90 backdrop-blur-md transition shadow-md"
                title="Carte suivante"
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
                      className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
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

            {/* Expérience Mobile : Bottom Sheet à 3 états */}
            <div
              className={`md:hidden absolute bottom-0 left-0 right-0 z-30 bg-[#FDFBF7]/98 border-t border-stone-200/90 backdrop-blur-2xl rounded-t-3xl transition-all duration-300 ease-out flex flex-col shadow-2xl text-stone-900 ${
                sheetState === "collapsed"
                  ? "h-36"
                  : sheetState === "intermediate"
                  ? "h-[55%]"
                  : "h-[92%]"
              }`}
            >
              <div
                className="w-full pt-3 pb-2 flex flex-col items-center cursor-pointer select-none"
                onClick={() => {
                  if (sheetState === "collapsed") setSheetState("intermediate");
                  else if (sheetState === "intermediate") setSheetState("expanded");
                  else setSheetState("collapsed");
                }}
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

              <div className="px-5 pb-6 overflow-y-auto flex-1">
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
      </div>

      {/* 3. MODALE DU MODE ÉDITION DE DÉVELOPPEMENT */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-3 md:p-6">
          <div className="bg-white border border-stone-300 w-full max-w-4xl h-[88vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden text-stone-900">
            <div className="px-5 py-3.5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-stone-900">
                  Éditeur Markdown • {currentCard ? currentCard.title : "Sélectionnez une carte"}
                </h3>
                <span className="text-xs text-emerald-600 font-medium ml-3 hidden sm:inline">
                  {saveStatus}
                </span>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-2.5 bg-stone-50/80 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditTab("write")}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
                    editTab === "write"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-stone-600 hover:text-stone-950"
                  }`}
                >
                  Édition
                </button>
                <button
                  onClick={() => setEditTab("preview")}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
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
                  className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-1 transition border border-stone-200"
                  title="Copier le Markdown de cette carte"
                >
                  {copiedNotice ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedNotice ? "Copié !" : "Copier"}
                </button>

                <button
                  onClick={handleExportAll}
                  className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-1 transition border border-stone-200"
                  title="Exporter les 42 cartes en JSON"
                >
                  <Download className="w-3.5 h-3.5" /> Exporter tout (JSON)
                </button>

                <label className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-1 cursor-pointer transition border border-stone-200">
                  <Upload className="w-3.5 h-3.5" /> Importer
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="hidden"
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
  );
}
