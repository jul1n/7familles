// Lecture à voix haute d'une fiche (synthèse vocale du navigateur, en français).

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// Transforme le Markdown d'une fiche en texte agréable à écouter
export function markdownToSpeech(title: string, intro: string, md: string): string {
  const body = md
    .replace(/^#\s.*$/m, "") // le titre est lu à part
    .replace(/^#{2,6}\s*(.*)$/gm, "$1.")
    .replace(/^>\s?/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[*_`]/g, "")
    .replace(/m³\/s/g, "mètres cubes par seconde")
    .replace(/m³/g, "mètres cubes")
    .replace(/km²/g, "kilomètres carrés")
    .replace(/\bkm\b/g, "kilomètres")
    .replace(/\bMW\b/g, "mégawatts")
    .replace(/\bkWh\b/g, "kilowattheures")
    .replace(/\bkm\/h\b/g, "kilomètres par heure")
    .replace(/CO₂/g, "C O deux")
    .replace(/\bm\b/g, "mètres")
    .replace(/%/g, " pour cent")
    .replace(/\n{2,}/g, "\n");
  return `${title}. ${intro}\n${body}`;
}

let utterances: SpeechSynthesisUtterance[] = [];

export function stopSpeaking() {
  if (!speechSupported()) return;
  utterances = [];
  window.speechSynthesis.cancel();
}

// Lit le texte phrase par phrase (évite l'arrêt des longs textes sur certains navigateurs)
export function speak(text: string, onEnd: () => void) {
  if (!speechSupported()) return onEnd();
  stopSpeaking();
  const synth = window.speechSynthesis;
  const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith("fr"));
  const chunks = text
    .split(/\n|(?<=[.!?:;])\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
  utterances = chunks.map((chunk, i) => {
    const u = new SpeechSynthesisUtterance(chunk);
    u.lang = "fr-FR";
    if (voice) u.voice = voice;
    u.rate = 0.95;
    if (i === chunks.length - 1) {
      u.onend = onEnd;
      u.onerror = onEnd;
    }
    return u;
  });
  utterances.forEach((u) => synth.speak(u));
}
