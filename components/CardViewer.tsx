"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Pause, Play, Share2, Volume2, Square, X } from "lucide-react";
import type { CardData } from "@/data/cards";
import type { Lang } from "@/lib/content";
import { asset } from "@/lib/asset";
import { UI } from "@/lib/ui";
import { useFocusTrap } from "@/lib/use-focus-trap";
import styles from "./ExplorerView.module.css";

interface Props {
  card: CardData; siblings: CardData[]; lang: Lang;
  onSelect: (card: CardData) => void; onClose: () => void;
  onRead: () => void; onSpeak: () => void; onShare: () => void;
  canSpeak: boolean; isSpeaking: boolean;
}

export default function CardViewer({ card, siblings, lang, onSelect, onClose, onRead, onSpeak, onShare, canSpeak, isSpeaking }: Props) {
  const fr = lang === "fr";
  const t = UI[lang];
  const dialog = useRef<HTMLDivElement>(null);
  const previous = useRef(card);
  const [outgoing, setOutgoing] = useState<CardData | null>(null);
  const [direction, setDirection] = useState(1);
  const [autoplay, setAutoplay] = useState(false);
  const played = useRef(false);
  const playingCard = useRef<string | null>(null);
  const latestSpeak = useRef(onSpeak);
  useEffect(() => { latestSpeak.current = onSpeak; }, [onSpeak]);
  useFocusTrap(dialog);
  useEffect(() => { dialog.current?.querySelector<HTMLButtonElement>("button")?.focus(); }, []);
  useLayoutEffect(() => {
    if (previous.current.id !== card.id) {
      const oldIndex = siblings.findIndex(c => c.id === previous.current.id);
      const newIndex = siblings.findIndex(c => c.id === card.id);
      setDirection(oldIndex === siblings.length - 1 && newIndex === 0 ? 1 : oldIndex === 0 && newIndex === siblings.length - 1 ? -1 : newIndex > oldIndex ? 1 : -1);
      setOutgoing(previous.current);
      previous.current = card;
    }
  }, [card, siblings]);
  useEffect(() => { if (!outgoing) return; const timer = setTimeout(() => setOutgoing(null), 460); return () => clearTimeout(timer); }, [outgoing]);
  const index = siblings.findIndex(c => c.id === card.id);
  useEffect(() => {
    if (!autoplay || !canSpeak) { played.current = false; playingCard.current = null; return; }
    if (playingCard.current !== card.id) {
      played.current = false;
      const timer = setTimeout(() => { playingCard.current = card.id; latestSpeak.current(); }, 0);
      return () => clearTimeout(timer);
    }
    if (isSpeaking) played.current = true;
    else if (played.current) {
      played.current = false;
      if (index + 1 < siblings.length) onSelect(siblings[index + 1]);
      else setAutoplay(false);
    }
  }, [autoplay, canSpeak, card.id, isSpeaking, index, siblings, onSelect]);
  const close = () => { if (isSpeaking) onSpeak(); setAutoplay(false); onClose(); };
  return <div className={styles.zoomOverlay} style={{ "--family": card.familyColor } as React.CSSProperties}
    onClick={close} onPointerDown={e => e.stopPropagation()} onPointerMove={e => e.stopPropagation()} onPointerUp={e => e.stopPropagation()}
    onTouchStart={e => e.stopPropagation()} onTouchEnd={e => e.stopPropagation()}>
    <div ref={dialog} className={styles.zoomDialog} role="dialog" aria-modal="true" aria-label={card.title}
      onClick={e => { e.stopPropagation(); if (e.target === e.currentTarget) close(); }}
      onKeyDown={e => { if (e.key === "Escape") { e.stopPropagation(); close(); } else { if (e.key === "ArrowRight") { e.preventDefault(); onSelect(siblings[(index + 1) % siblings.length]); } if (e.key === "ArrowLeft") { e.preventDefault(); onSelect(siblings[(index - 1 + siblings.length) % siblings.length]); } } }}>
      <button className={styles.viewerHeading} onClick={close}><span><ArrowLeft size={15} />{fr ? "RETOUR À LA MOSAÏQUE" : "BACK TO MOSAIC"}</span><strong>{card.familyName}</strong></button>
      <button className={styles.zoomClose} onClick={close} aria-label={fr ? "Fermer et revenir à la mosaïque" : "Close and return to mosaic"}><X size={20} /></button>
      <div className={styles.viewerDots} aria-label={t.cardOf(card.num)}>{siblings.map(c => <button key={c.id} onClick={() => onSelect(c)} aria-label={t.openCard(c.num, c.title)} aria-current={c.id === card.id ? "true" : undefined}><span /></button>)}</div>
      <div className={styles.zoomStage} style={{ "--slide-direction": direction } as React.CSSProperties} onClick={e => { if (e.target === e.currentTarget) close(); }}>
        <button className={styles.zoomPrevious} onClick={() => onSelect(siblings[(index - 1 + siblings.length) % siblings.length])} aria-label={t.prevCard}><ChevronLeft size={24} /></button>
        <div className={styles.transitionFrame}>{outgoing && <img key={outgoing.id + "-out"} className={styles.outgoingCard} src={asset(outgoing.frontImage)} alt="" aria-hidden="true" />}<img key={card.id} className={outgoing ? styles.incomingCard : undefined} src={asset(card.frontImage)} alt={t.cardAlt(card.num, card.title)} /></div>
        <button className={styles.zoomNext} onClick={() => onSelect(siblings[(index + 1) % siblings.length])} aria-label={t.nextCard}><ChevronRight size={24} /></button>
      </div>
      <div className={styles.zoomToolbar}>
        <div className={styles.viewerLabel} aria-live="polite"><span>{card.familyName} · {index + 1} / {siblings.length}</span><strong>{card.title}</strong></div>
        {canSpeak && <button className={styles.zoomListen} onClick={() => { setAutoplay(false); onSpeak(); }} aria-label={isSpeaking ? t.stop : t.listen} aria-pressed={isSpeaking}>{isSpeaking ? <Square size={20} /> : <Volume2 size={20} />}</button>}
        {canSpeak && <button className={styles.viewerAuto} aria-pressed={autoplay} onClick={() => { if (isSpeaking) onSpeak(); played.current = false; playingCard.current = null; setAutoplay(!autoplay); }} aria-label={fr ? (autoplay ? "Arrêter l’écoute de la famille" : "Écouter cette famille à partir de cette carte") : (autoplay ? "Stop family playback" : "Listen to this family from this card")}>{autoplay ? <Pause size={18} /> : <Play size={18} />}<span>Auto</span></button>}
        <button className={styles.viewerShare} onClick={onShare} aria-label={t.share}><Share2 size={19} /></button>
      </div>
      <button className={styles.viewerRead} onClick={onRead}><BookOpen size={18} />{fr ? "Lire la fiche" : "Read the story"}</button>
      <p className={styles.viewerHint}>{fr ? "Six cartes à découvrir. Auto lit les cartes restantes de cette famille." : "Six cards to discover. Auto plays the remaining cards in this family."}</p>
    </div>
  </div>;
}
