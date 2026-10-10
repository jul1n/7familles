// Lecture à voix haute d'une fiche (synthèse vocale du navigateur, en français).

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// Les classes \b de JavaScript ne connaissent pas les lettres accentuées : « \bm\b » trouvait le « m » de
// « même » ou « métier » (suivi d'un « ê » ou « é ») et le lisait « mètres ». On utilise donc des bornes
// Unicode : une unité n'est remplacée que si elle suit un nombre ou n'est collée à aucune lettre.
const END = "(?![\\p{L}\\p{N}])";
const NOT_AFTER_LETTER = "(?<![\\p{L}\\p{N}])";
const AFTER_NUMBER = "(?<=\\d)\\s?";
const rx = (source: string) => new RegExp(source, "gu");

const ORDINALS: Record<string, string> = {
  Ier: "premier",
  XIIe: "douzième",
  XVIIe: "dix-septième",
  XIXe: "dix-neuvième",
  XXe: "vingtième",
  XXIe: "vingt et unième",
};

// Transforme le Markdown d'une fiche en texte agréable à écouter
export function markdownToSpeech(title: string, intro: string, md: string): string {
  const body = md
    .replace(/^#\s.*$/m, "") // le titre est lu à part
    // Titres d'ouverture non lus (« En bref », « Comment ça marche ? ») : la lecture est plus fluide
    .replace(/^#{2,6}\s*(?:En bref|En un coup d['’]œil|Comment ça marche\s*\?)\s*$/gm, "")
    .replace(/^#{2,6}\s*(.*)$/gm, "$1.")
    .replace(/^>\s?/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[*_`]/g, "");

  // Nombres, unités et chiffres romains : appliqués au titre, à l'accroche et au corps du texte
  return `${title}. ${intro}\n${body}`
    // nombres : « 2 365 » lu d'un bloc, « 1920-1930 » → « 1920 à 1930 », « 1/10 » → « 1 sur 10 »
    .replace(/(?<=\d)[ \u00a0\u202f](?=\d{3}(?!\d))/g, "")
    .replace(/(\d)\s?[–-]\s?(\d)/g, "$1 à $2")
    .replace(/(\d)\/(\d)/g, "$1 sur $2")
    // unités (les plus longues d'abord)
    .replace(rx(`m³/s${END}`), "mètres cubes par seconde")
    .replace(rx(`m³${END}`), "mètres cubes")
    .replace(rx(`km²${END}`), "kilomètres carrés")
    .replace(rx(`m²${END}`), "mètres carrés")
    .replace(rx(`km/h${END}`), "kilomètres par heure")
    .replace(rx(`${AFTER_NUMBER}km${END}`), " kilomètres")
    .replace(rx(`${AFTER_NUMBER}mm${END}`), " millimètres")
    .replace(rx(`${AFTER_NUMBER}cm${END}`), " centimètres")
    .replace(rx(`${AFTER_NUMBER}m${END}`), " mètres")
    .replace(rx(`${AFTER_NUMBER}h${END}`), " heures")
    .replace(rx(`${NOT_AFTER_LETTER}MW${END}`), "mégawatts")
    .replace(rx(`${NOT_AFTER_LETTER}kWh${END}`), "kilowattheures")
    .replace(rx(`${NOT_AFTER_LETTER}kW${END}`), "kilowatts")
    .replace(rx(`${NOT_AFTER_LETTER}Hz${END}`), "hertz")
    .replace(/CO₂/g, "C O deux")
    .replace(/%/g, " pour cent")
    .replace(/\s=\s/g, " veut dire ")
    .replace(/\s\/\s/g, " et ")
    // siècles et chiffres romains
    .replace(rx(`${NOT_AFTER_LETTER}(Ier|XIIe|XVIIe|XIXe|XXe|XXIe)${END}`), (_, r: string) => ORDINALS[r])
    .replace(/Louis XIV/g, "Louis quatorze")
    .replace(/\n{2,}/g, "\n");
}

// Version anglaise : le texte à lire d'une fiche (Markdown nettoyé, unités épelées)
export function markdownToSpeechEn(title: string, intro: string, md: string): string {
  const body = md
    .replace(/^#\s.*$/m, "")
    .replace(/^#{2,6}\s*(?:In brief|How does it work\s*\?)\s*$/gm, "")
    .replace(/^#{2,6}\s*(.*)$/gm, "$1.")
    .replace(/^>\s?/gm, "")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/[*_`]/g, "");
  return `${title}. ${intro}\n${body}`
    .replace(/(\d)\s?km²/g, "$1 square kilometers")
    .replace(/(\d)\s?km\/h/g, "$1 kilometers per hour")
    .replace(/(\d)\s?m³\/s/g, "$1 cubic meters per second")
    .replace(/(\d)\s?m³/g, "$1 cubic meters")
    .replace(/(\d)\s?km\b/g, "$1 kilometers")
    .replace(/(\d)\s?kWh/g, "$1 kilowatt-hours")
    .replace(/(\d)\s?TWh/g, "$1 terawatt-hours")
    .replace(/(\d)\s?GW\b/g, "$1 gigawatts")
    .replace(/(\d)\s?MW\b/g, "$1 megawatts")
    .replace(/(\d)\s?kW\b/g, "$1 kilowatts")
    .replace(/(\d)\s?mm\b/g, "$1 millimeters")
    .replace(/(\d)\s?cm\b/g, "$1 centimeters")
    .replace(/(\d)\s?m\b/g, "$1 meters")
    .replace(/CO₂/g, "C O 2")
    .replace(/\bm\/s\b/g, "meters per second")
    .replace(/\n{2,}/g, "\n");
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

export function bestVoice(lang: "fr" | "en" = "fr"): SpeechSynthesisVoice | undefined {
  if (!speechSupported()) return undefined;
  return window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.toLowerCase().startsWith(lang))
    .sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
}

export function bestFrenchVoice(): SpeechSynthesisVoice | undefined {
  return bestVoice("fr");
}

let utterances: SpeechSynthesisUtterance[] = [];

let audio: HTMLAudioElement | null = null;
let meterContext: AudioContext | null = null;
let meterAnalyser: AnalyserNode | null = null;
let meterSamples: Uint8Array<ArrayBuffer> | null = null;
let meterSource: MediaElementAudioSourceNode | null = null;
let meterEnabled = false;

// Optional audio-reactive decoration; unsupported browsers keep normal MP3 playback.
export function enableAudioMeter() { meterEnabled = true; }
export function audioLevel(): number {
  if (!audio || audio.paused || !meterAnalyser || !meterSamples) return 0;
  meterAnalyser.getByteTimeDomainData(meterSamples);
  let sum = 0;
  for (const sample of meterSamples) sum += ((sample - 128) / 128) ** 2;
  return Math.min(1, Math.sqrt(sum / meterSamples.length) * 5);
}
function attachAudioMeter(element: HTMLAudioElement) {
  if (!meterEnabled || typeof AudioContext === "undefined") return;
  try {
    meterContext ??= new AudioContext();
    // Do not reroute sound through a suspended context: playback must stay reliable.
    if (meterContext.state !== "running") {
      void meterContext.resume().then(() => {
        if (audio === element && meterContext?.state === "running") connectAudioMeter(element);
      }).catch(() => undefined);
    } else connectAudioMeter(element);
  } catch { /* Audio remains on the native player. */ }
}
function connectAudioMeter(element: HTMLAudioElement) {
  if (!meterContext) return;
  try {
    meterAnalyser ??= meterContext.createAnalyser();
    meterAnalyser.fftSize = 512;
    meterSamples ??= new Uint8Array(512);
    meterSource = meterContext.createMediaElementSource(element);
    meterSource.connect(meterContext.destination);
    meterSource.connect(meterAnalyser);
  } catch { /* Unsupported analysis must never interrupt native playback. */ }
}


export function stopSpeaking() {
  if (audio) {
    audio.onended = null;
    audio.onerror = null;
    audio.pause();
    audio = null;
    meterSource?.disconnect();
    meterSource = null;
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
  attachAudioMeter(el);
  el.onended = onEnd;
  el.onerror = onFail;
  // Si la lecture a été arrêtée entre-temps, l'échec de play() est normal : on ne se rabat pas sur la synthèse
  el.play().catch(() => {
    if (audio === el) onFail();
  });
}

// Lit le texte phrase par phrase (évite l'arrêt des longs textes sur certains navigateurs)
export function speak(text: string, onEnd: () => void, lang: "fr" | "en" = "fr") {
  if (!speechSupported()) return onEnd();
  stopSpeaking();
  const synth = window.speechSynthesis;

  const start = () => {
    const voice = bestVoice(lang);
    const chunks = text
      .split(/\n|(?<=[.!?:;])\s+/)
      .map((t) => t.trim())
      .filter(Boolean);
    utterances = chunks.map((chunk, i) => {
      const u = new SpeechSynthesisUtterance(chunk);
      u.lang = voice?.lang ?? (lang === "fr" ? "fr-FR" : "en-US");
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
