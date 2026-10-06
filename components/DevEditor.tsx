"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Check, Copy, Download, Edit3, Upload, X } from "lucide-react";
import type { CardData } from "@/data/cards";

const STORAGE_KEY = "7familles_markdown_edits";

// Éditeur Markdown des fiches : outil de développement, absent du site publié (voir l'import dynamique dans
// Experience7Familles). Les modifications restent dans le localStorage du navigateur.
export default function DevEditor({
  currentCard,
  currentMarkdown,
  cards,
  map,
  onMapChange,
  onClose,
}: {
  currentCard: CardData | null;
  currentMarkdown: string;
  cards: CardData[];
  map: Record<string, string>;
  onMapChange: (m: Record<string, string>) => void;
  onClose: () => void;
}) {
  const [editTab, setEditTab] = useState<"write" | "preview">("write");
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string>("Enregistré automatiquement");
  const setIsEditing = (v: boolean) => !v && onClose();

  const handleUpdateMarkdown = (newMd: string) => {
    if (!currentCard) return;
    const updated = { ...map, [currentCard.id]: newMd };
    onMapChange(updated);
    setSaveStatus("Modifications enregistrées");
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
    const exportData = cards.map((c) => ({
      id: c.id,
      familyId: c.familyId,
      title: c.title,
      markdown: map[c.id] ?? c.contentMarkdown,
    }));
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
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
        const next: Record<string, string> = { ...map };
        parsed.forEach((item: { id: string; markdown: string }) => {
          next[item.id] = item.markdown;
        });
        onMapChange(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        alert("Importation réussie des contenus pédagogiques !");
      } catch {
        alert("Erreur lors de la lecture du fichier JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
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
                  className={`min-h-[44px] px-3.5 py-1.5 rounded-lg font-semibold transition focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
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
                  className={`min-h-[44px] px-3.5 py-1.5 rounded-lg font-semibold transition focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none ${
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
                  className="min-h-[44px] px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-1.5 transition border border-stone-200 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
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
                  className="min-h-[44px] px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-1.5 transition border border-stone-200 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                  title="Exporter les 42 cartes en JSON"
                  aria-label="Exporter les 42 cartes en format JSON"
                >
                  <Download className="w-4 h-4" />
                  <span>Exporter tout (JSON)</span>
                </button>

                <label className="min-h-[44px] px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-1.5 cursor-pointer transition border border-stone-200 focus-within:ring-2 focus-within:ring-amber-500">
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
                  Veuillez d&apos;abord sélectionner une carte dans le jeu pour modifier son texte.
                </div>
              )}
            </div>
          </div>
        </div>
  );
}
