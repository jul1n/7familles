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

// Meilleure voix française disponible : les voix « naturelles » / « multilingues » d'Edge d'abord,
// puis les voix Google (Chrome), puis les voix d'Apple, puis n'importe quelle voix française.
function scoreVoice(v: SpeechSynthesisVoice): number {
  const name = v.name.toLowerCase();
  let score = 0;
  if (v.lang.toLowerCase().replace("_", "-") === "fr-fr") score += 5;
  if (name.includes("natural")) score += 40;
  if (name.includes("multilingual")) score += 35;
  if (name.includes("online")) score += 10;
  if (name.includes("google")) score += 20;
  if (name.includes("premium") || name.includes("enhanced") || name.includes("amélie") || name.includes("thomas")) score += 15;
  if (v.localService === false) score += 2;
  return score;
}

export function bestFrenchVoice(): SpeechSynthesisVoice | undefined {
  if (!speechSupported()) return undefined;
  return window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith("fr"))
    .sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
}

let utterances: SpeechSynthesisUtterance[] = [];

let audio: HTMLAudioElement | null = null;

export function stopSpeaking() {
  if (audio) {
    audio.onended = null;
    audio.onerror = null;
    audio.pause();
    audio = null;
  }
  if (!speechSupported()) return;
  utterances = [];
  window.speechSynthesis.cancel();
}

// Lit un fichier audio pré-enregistré (voix neuronale générée à l'avance).
// Si le fichier est introuvable ou illisible, onFail permet de se rabattre sur la synthèse du navigateur.
export function playAudio(url: string, onEnd: () => void, onFail: () => void) {
  stopSpeaking();
  const el = new Audio(url);
  audio = el;
  el.onended = onEnd;
  el.onerror = onFail;
  // Si la lecture a été arrêtée entre-temps, l'échec de play() est normal : on ne se rabat pas sur la synthèse
  el.play().catch(() => {
    if (audio === el) onFail();
  });
}

// Lit le texte phrase par phrase (évite l'arrêt des longs textes sur certains navigateurs)
export function speak(text: string, onEnd: () => void) {
  if (!speechSupported()) return onEnd();
  stopSpeaking();
  const synth = window.speechSynthesis;

  const start = () => {
    const voice = bestFrenchVoice();
    const chunks = text
      .split(/\n|(?<=[.!?:;])\s+/)
      .map((t) => t.trim())
      .filter(Boolean);
    utterances = chunks.map((chunk, i) => {
      const u = new SpeechSynthesisUtterance(chunk);
      u.lang = voice?.lang ?? "fr-FR";
      if (voice) u.voice = voice;
      if (i === chunks.length - 1) {
        u.onend = onEnd;
        u.onerror = onEnd;
      }
      return u;
    });
    utterances.forEach((u) => synth.speak(u));
  };

  // La liste des voix se charge parfois après le premier clic : on l'attend brièvement
  if (synth.getVoices().length > 0) return start();
  let started = false;
  const once = () => {
    if (started) return;
    started = true;
    synth.removeEventListener("voiceschanged", once);
    start();
  };
  synth.addEventListener("voiceschanged", once);
  setTimeout(once, 500);
}
