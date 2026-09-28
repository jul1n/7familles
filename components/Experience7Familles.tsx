"use client";

import React, { useState, useEffect } from "react";
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
  Sparkles,
  Compass,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// Chargement dynamique des scènes 3D Three.js
const Deck3DScene = dynamic(() => import("@/components/Deck3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
      <span className="text-xs text-slate-400 font-medium">Chargement du deck 3D...</span>
    </div>
  ),
});

const Card3DViewer = dynamic(() => import("@/components/Card3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
    </div>
  ),
});

const FamilyFan3D = dynamic(() => import("@/components/FamilyFan3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin" />
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
  const [hoveredFamily, setHoveredFamily] = useState<string | null>(null);

  // Bottom sheet mobile (collapsed | intermediate | expanded)
  const [sheetState, setSheetState] = useState<"collapsed" | "intermediate" | "expanded">("collapsed");

  // Mode Édition de développement
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTab, setEditTab] = useState<"write" | "preview">("write");
  const [customMarkdownMap, setCustomMarkdownMap] = useState<Record<string, string>>({});
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>("Enregistré automatiquement");

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

  const activeHoveredFamilyObj = FAMILIES.find((f) => f.id === hoveredFamily) || null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* 1. BARRE SUPÉRIEURE ÉPURÉE ET MODERNE */}
      <header className="h-16 px-4 md:px-8 border-b border-white/10 flex items-center justify-between backdrop-blur-md bg-slate-950/80 z-40">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            setSelectedFamilyId(null);
            setSelectedCardId(null);
          }}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-bold tracking-tight text-white leading-tight flex items-center gap-2">
              7 Familles des Barrages
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                3D Experience
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              CFBR • Centenaire 1926–2026
            </p>
          </div>
        </div>

        {/* Contrôles supérieurs */}
        <div className="flex items-center gap-2">
          {selectedCardId && (
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 transition flex items-center gap-1.5 text-cyan-300 border border-white/10"
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
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                : "bg-white/10 hover:bg-white/20 text-amber-300 border border-white/10"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mode Édition</span>
          </button>
        </div>
      </header>

      {/* 2. ZONE PRINCIPALE DE L'EXPÉRIENCE CONTINUE */}
      <div className="flex-1 relative flex flex-col md:flex-row overflow-hidden">
        {/* VUE 1 : LE DECK DE CARTES 3D SPECTACULAIRE */}
        {!selectedFamilyId && (
          <div className="w-full h-full relative flex flex-col items-center justify-between">
            {/* Overlay d'information haut */}
            <div className="z-10 pt-6 px-4 text-center pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-2 backdrop-blur-md">
                <Sparkles className="w-3 h-3" /> Deck interactif de 42 cartes
              </span>
              <h2 className="text-xl md:text-3xl font-extrabold text-white tracking-tight">
                Touchez ou cliquez sur une famille pour l'ouvrir
              </h2>
            </div>

            {/* SCÈNE 3D DU DECK COMPLET */}
            <div className="absolute inset-0 w-full h-full">
              <Deck3DScene
                onSelectFamily={(fId) => {
                  setSelectedFamilyId(fId);
                  setSelectedCardId(null);
                }}
                hoveredFamily={hoveredFamily}
                setHoveredFamily={setHoveredFamily}
                isSpread={isDeckSpread}
              />
            </div>

            {/* Barre de contrôle du Deck & sélecteur rapide bas */}
            <div className="z-10 pb-6 px-4 w-full max-w-4xl flex flex-col items-center gap-3">
              {/* Info bulle dynamique au survol d'une famille */}
              {activeHoveredFamilyObj && (
                <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/40 backdrop-blur-xl shadow-2xl flex items-center gap-3 animate-fade-in">
                  <span
                    className="w-3.5 h-3.5 rounded-full shadow-md"
                    style={{ backgroundColor: activeHoveredFamilyObj.color }}
                  />
                  <span className="text-sm font-bold text-white">
                    Famille {activeHoveredFamilyObj.name}
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    — {activeHoveredFamilyObj.description}
                  </span>
                </div>
              )}

              {/* Sélecteur de mode 3D & onglets des 7 familles */}
              <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-950/80 p-2 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl max-w-full overflow-x-auto">
                <button
                  onClick={() => setIsDeckSpread(!isDeckSpread)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5" />
                  {isDeckSpread ? "Rassembler le paquet" : "Déployer en éventail"}
                </button>

                <div className="h-4 w-[1px] bg-white/10 mx-1 hidden sm:block" />

                {FAMILIES.map((fam) => (
                  <button
                    key={fam.id}
                    onMouseEnter={() => setHoveredFamily(fam.id)}
                    onMouseLeave={() => setHoveredFamily(null)}
                    onClick={() => {
                      setSelectedFamilyId(fam.id);
                      setSelectedCardId(null);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                      hoveredFamily === fam.id
                        ? "bg-white/20 text-white scale-105"
                        : "bg-white/5 hover:bg-white/10 text-slate-300"
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: fam.color }}
                    />
                    {fam.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VUE 2 : SÉLECTION DES 6 CARTES DE LA FAMILLE (DÉPLOIEMENT 3D EN ÉVENTAIL) */}
        {selectedFamilyId && !selectedCardId && activeFamily && (
          <div className="w-full h-full relative flex flex-col items-center justify-between">
            {/* Fil d'Ariane & titre haut */}
            <div className="z-10 pt-5 px-4 w-full max-w-6xl flex items-center justify-between pointer-events-auto">
              <button
                onClick={() => setSelectedFamilyId(null)}
                className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-slate-300 hover:text-white transition px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 backdrop-blur-md shadow-lg"
              >
                <ChevronLeft className="w-4 h-4" /> Revenir au deck 3D
              </button>

              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 backdrop-blur-md shadow-lg">
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-md"
                  style={{ backgroundColor: activeFamily.color }}
                />
                <span className="text-sm font-bold text-white">
                  Famille {activeFamily.name}
                </span>
                <span className="text-xs text-slate-400">• 6 cartes</span>
              </div>
            </div>

            {/* Instruction discrète */}
            <div className="z-10 text-center px-4 pointer-events-none mt-2">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 backdrop-blur-md">
                Cliquez ou touchez une carte pour l'examiner en 3D
              </span>
            </div>

            {/* SCÈNE 3D DU DÉPLOIEMENT EN ÉVENTAIL DES 6 CARTES */}
            <div className="absolute inset-0 w-full h-full">
              <FamilyFan3D
                cards={familyCards}
                family={activeFamily}
                onSelectCard={(cId) => {
                  setSelectedCardId(cId);
                  setIsFlipped(false);
                  setSheetState("collapsed");
                }}
              />
            </div>

            {/* Sélecteur miniature rapide en bas */}
            <div className="z-10 pb-5 px-4 flex items-center justify-center gap-2 max-w-full overflow-x-auto">
              {familyCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => {
                    setSelectedCardId(card.id);
                    setIsFlipped(false);
                    setSheetState("collapsed");
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition shadow-md flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                    {card.num}
                  </span>
                  <span>{card.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* VUE 3 : CARTE SÉLECTIONNÉE (SCÈNE 3D + SAVOIR PÉDAGOGIQUE) */}
        {currentCard && (
          <div className="w-full h-full flex flex-col md:flex-row relative">
            {/* Zone 3D Mobile & Desktop */}
            <div
              className={`relative transition-all duration-300 ${
                sheetState === "expanded"
                  ? "hidden md:flex md:w-[40%] h-full"
                  : "w-full md:w-[45%] lg:w-[40%] flex-1 md:h-full flex flex-col"
              }`}
            >
              {/* Retour rapide à la famille */}
              <div className="absolute top-3 left-4 z-20 flex items-center gap-2">
                <button
                  onClick={() => setSelectedCardId(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition flex items-center gap-1 shadow-lg"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  {activeFamily?.name}
                </button>
              </div>

              {/* Navigation Précédent / Suivant */}
              <div className="absolute top-3 right-4 z-20 flex items-center gap-1.5">
                <button
                  onClick={handlePrevCard}
                  className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition shadow-lg"
                  title="Carte précédente"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold px-2 py-1 bg-slate-900/80 border border-white/10 rounded-lg text-slate-300 backdrop-blur-md">
                  {currentCard.num} / 6
                </span>
                <button
                  onClick={handleNextCard}
                  className="p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition shadow-lg"
                  title="Carte suivante"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Canvas WebGL 3D Carte individuelle */}
              <div className="flex-1 w-full h-full relative">
                <Card3DViewer
                  frontUrl={currentCard.frontImage}
                  backUrl={currentCard.backImage}
                  isFlipped={isFlipped}
                  onFlipToggle={() => setIsFlipped(!isFlipped)}
                />

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-slate-950/70 border border-white/10 backdrop-blur-md text-[11px] text-slate-400 pointer-events-none flex items-center gap-1.5 shadow-md">
                  <RotateCcw className="w-3 h-3 text-cyan-400" />
                  Touchez ou cliquez pour retourner
                </div>
              </div>
            </div>

            {/* Expérience Desktop (Panneau Pédagogique droit sticky) */}
            <div className="hidden md:flex flex-col flex-1 h-full border-l border-white/10 bg-slate-900/40 backdrop-blur-md overflow-hidden">
              <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Badge & Titre */}
                  <div className="flex items-center justify-between">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                      style={{ backgroundColor: currentCard.familyColor }}
                    >
                      {currentCard.familyName} • Carte n°{currentCard.num}
                    </span>
                    {currentCard.location && (
                      <span className="text-xs font-medium text-slate-400 bg-white/5 px-2.5 py-1 rounded-md">
                        {currentCard.location}
                      </span>
                    )}
                  </div>

                  <h2 className="text-3xl font-extrabold text-white tracking-tight">
                    {currentCard.title}
                  </h2>

                  <p className="text-base text-cyan-200/90 leading-relaxed font-medium bg-cyan-950/30 p-4 rounded-xl border border-cyan-800/30">
                    {currentCard.shortDescription}
                  </p>

                  {/* Rendu Markdown HTML classique */}
                  <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed">
                    <ReactMarkdown>{currentMarkdown}</ReactMarkdown>
                  </div>

                  {currentCard.credits && (
                    <div className="pt-6 border-t border-white/10 text-xs text-slate-500 italic">
                      Crédits photo / illustrations : {currentCard.credits}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Expérience Mobile (Bottom Sheet à 3 états) */}
            <div
              className={`md:hidden absolute bottom-0 left-0 right-0 z-30 bg-slate-900/95 border-t border-white/15 backdrop-blur-2xl rounded-t-3xl transition-all duration-300 ease-out flex flex-col shadow-2xl ${
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
                <div className="w-12 h-1.5 rounded-full bg-white/20 mb-2" />
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                  <span>
                    {sheetState === "expanded"
                      ? "Réduire"
                      : "En savoir plus"}
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
                    className="text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: currentCard.familyColor }}
                  >
                    {currentCard.familyName} • n°{currentCard.num}
                  </span>
                  {currentCard.period && (
                    <span className="text-[10px] text-slate-400">
                      {currentCard.period}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">
                  {currentCard.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  {currentCard.shortDescription}
                </p>

                {sheetState !== "collapsed" && (
                  <div className="mt-5 pt-4 border-t border-white/10 prose prose-invert prose-xs max-w-none text-slate-300">
                    <ReactMarkdown>{currentMarkdown}</ReactMarkdown>
                    {currentCard.credits && (
                      <div className="mt-4 pt-4 border-t border-white/10 text-[10px] text-slate-500 italic">
                        {currentCard.credits}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. MODALE DU MODE ÉDITION DE DÉVELOPPEMENT */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6">
          <div className="bg-slate-900 border border-amber-500/30 w-full max-w-4xl h-[88vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/10 bg-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Éditeur Markdown • {currentCard ? currentCard.title : "Sélectionnez une carte"}
                </h3>
                <span className="text-xs text-emerald-400 font-medium ml-3 hidden sm:inline">
                  {saveStatus}
                </span>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-5 py-2.5 bg-slate-900/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditTab("write")}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
                    editTab === "write"
                      ? "bg-amber-500 text-slate-950"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Édition
                </button>
                <button
                  onClick={() => setEditTab("preview")}
                  className={`px-3 py-1 rounded-md font-semibold transition ${
                    editTab === "preview"
                      ? "bg-amber-500 text-slate-950"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Aperçu
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyMarkdown}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 flex items-center gap-1 transition"
                  title="Copier le Markdown de cette carte"
                >
                  {copiedNotice ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedNotice ? "Copié !" : "Copier"}
                </button>

                <button
                  onClick={handleExportAll}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 flex items-center gap-1 transition"
                  title="Exporter les 42 cartes en JSON"
                >
                  <Download className="w-3.5 h-3.5" /> Exporter tout (JSON)
                </button>

                <label className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 flex items-center gap-1 cursor-pointer transition">
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

            <div className="flex-1 p-4 overflow-hidden bg-slate-950">
              {currentCard ? (
                editTab === "write" ? (
                  <textarea
                    value={currentMarkdown}
                    onChange={(e) => handleUpdateMarkdown(e.target.value)}
                    className="w-full h-full bg-slate-900 text-slate-100 font-mono text-xs md:text-sm p-4 rounded-xl border border-white/10 focus:border-amber-500 outline-none resize-none leading-relaxed"
                    placeholder="Écrivez le contenu pédagogique au format Markdown..."
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 p-6 rounded-xl border border-white/10 overflow-y-auto prose prose-invert prose-slate max-w-none text-xs md:text-sm">
                    <ReactMarkdown>{currentMarkdown}</ReactMarkdown>
                  </div>
                )
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-sm">
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
