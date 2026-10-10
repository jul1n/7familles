"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, ChevronLeft, ChevronRight, Search, Sparkles, Trophy, Volume2, Square, X, Maximize2, Share2, Play, Pause } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { CardData, FamilyData } from "@/data/cards";
import { type Lang, paths } from "@/lib/content";
import { asset, thumb } from "@/lib/asset";
import { UI } from "@/lib/ui";
import { enableAudioMeter, audioLevel } from "@/lib/speech";
import { searchCards } from "@/lib/search";
import { cardLinks } from "@/lib/links";
import { QUIZ_ENABLED } from "@/lib/site";
import { CardActions, MoreLinks } from "@/components/CardWidgets";
import { useFocusTrap } from "@/lib/use-focus-trap";
import ResourcesNav from "@/components/ResourcesNav";
import styles from "./ExplorerView.module.css";

type Mode = "3d" | "mosaic" | "explorer";
interface Props {
  lang: Lang; cards: CardData[]; families: FamilyData[]; card: CardData | null;
  onSelect: (card: CardData | null) => void; onSwitch: (mode: Mode) => void;
  onQuiz: (familyId: string | null) => void; isSpeaking: boolean; canSpeak: boolean;
  onSpeak: () => void; onShare: () => void; onPrint: () => void;
}

export default function ExplorerView({ lang, cards, families, card, onSelect, onSwitch, onQuiz, isSpeaking, canSpeak, onSpeak, onShare, onPrint }: Props) {
  const t = UI[lang];
  const fr = lang === "fr";
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const scroll = useRef<HTMLDivElement>(null);
  const listPosition = useRef(0);
  const heroArt = useRef<HTMLButtonElement>(null);
  const [familyOrder, setFamilyOrder] = useState<string[]>([]);
  const [listenCardId, setListenCardId] = useState<string | null>(null);
  useEffect(() => {
    const order = families.map((f) => f.id);
    const random = new Uint32Array(Math.max(0, order.length - 1));
    window.crypto.getRandomValues(random);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(random[i - 1] / 4294967296 * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    setFamilyOrder(order);
  }, [families]);
  const orderedFamilies = [...families].sort((a, b) => familyOrder.indexOf(a.id) - familyOrder.indexOf(b.id));
  useEffect(() => {
    if (!listenCardId) return;
    if (!card || card.id !== listenCardId || !canSpeak) { setListenCardId(null); return; }
    // Wait for the parent to finish resetting audio after selecting the card.
    const timer = setTimeout(() => { onSpeak(); setListenCardId(null); }, 0);
    return () => clearTimeout(timer);
  }, [listenCardId, card, canSpeak, onSpeak]);
  useEffect(() => {
    const node = scroll.current;
    const art = heroArt.current;
    if (!node || !art || card) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      const amount = motion.matches ? 0 : Math.min(1, node.scrollTop / Math.max(1, art.offsetTop + art.offsetHeight * .65));
      art.style.setProperty("--hero-gather", amount.toFixed(4));
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    update();
    node.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    return () => { cancelAnimationFrame(frame); node.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); motion.removeEventListener("change", schedule); };
  }, [card]);
  const [zoomed, setZoomed] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const wasSpeaking = useRef(false);
  const autoplayCard = useRef<string | null>(null);
  const pendingAutoStart = useRef(false);
  const latestSpeak = useRef(onSpeak);
  useEffect(() => { latestSpeak.current = onSpeak; }, [onSpeak]);
  const zoomDialog = useRef<HTMLDivElement>(null);
  const halo = useRef<HTMLDivElement>(null);
  useEffect(() => { enableAudioMeter(); }, []);
  useEffect(() => {
    const node = halo.current;
    if (!node || !zoomed || !isSpeaking || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let energy = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(80, now - previous);
      previous = now;
      const target = audioLevel();
      const smoothing = 1 - Math.exp(-elapsed / (target > energy ? 110 : 280));
      energy += (target - energy) * smoothing;
      node.style.setProperty("--voice-energy", energy.toFixed(4));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); node.style.setProperty("--voice-energy", "0"); };
  }, [zoomed, isSpeaking]);
  useFocusTrap(zoomDialog, zoomed);
  const [progress, setProgress] = useState(0);
  const [outgoing, setOutgoing] = useState<CardData | null>(null);
  const [direction, setDirection] = useState(1);
  const previousCard = useRef<CardData | null>(card);
  const title = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    const previous = previousCard.current;
    if (previous && card && previous.id !== card.id) {
      const oldIndex = cards.findIndex((c) => c.id === previous.id);
      const newIndex = cards.findIndex((c) => c.id === card.id);
      // Adjacent navigation, including wraparound, follows the same animation as autoplay.
      const sameFamily = previous.familyId === card.familyId;
      setDirection(sameFamily && previous.num === 6 && card.num === 1 ? 1 : sameFamily && previous.num === 1 && card.num === 6 ? -1 : newIndex >= oldIndex ? 1 : -1);
      setOutgoing(previous);
    } else if (!card) setOutgoing(null);
    previousCard.current = card;
  }, [card, cards]);
  useEffect(() => {
    if (!outgoing) return;
    const timer = setTimeout(() => setOutgoing(null), 650);
    return () => clearTimeout(timer);
  }, [outgoing]);
  useLayoutEffect(() => {
    if (scroll.current) scroll.current.scrollTo({ top: card ? 0 : listPosition.current, behavior: "instant" });
    if (card) title.current?.focus({ preventScroll: true });
  }, [card]);
  const family = families.find((f) => f.id === familyId);
  const filtered = (query.trim().length > 1 ? searchCards(cards, query).map((h) => h.card) : orderedFamilies.flatMap((f) => cards.filter((c) => c.familyId === f.id))).filter((c) => !familyId || c.familyId === familyId);
  const siblings = card ? cards.filter((c) => c.familyId === card.familyId) : [];
  const idx = card ? siblings.findIndex((c) => c.id === card.id) : 0;
  useEffect(() => {
    if (!zoomed || !autoplay || !card) { wasSpeaking.current = false; autoplayCard.current = null; pendingAutoStart.current = false; return; }
    if (autoplayCard.current !== card.id) {
      const alreadyPlaying = autoplayCard.current === null && isSpeaking;
      autoplayCard.current = card.id;
      wasSpeaking.current = alreadyPlaying;
      pendingAutoStart.current = !alreadyPlaying;
    }
    if (pendingAutoStart.current) {
      if (!isSpeaking) {
        pendingAutoStart.current = false;
        const expected = card.id;
        setTimeout(() => { if (autoplayCard.current === expected) latestSpeak.current(); }, 0);
      }
      return;
    }
    if (isSpeaking) { wasSpeaking.current = true; return; }
    if (wasSpeaking.current) {
      wasSpeaking.current = false;
      if (idx + 1 < siblings.length) onSelect(siblings[idx + 1]);
      else setAutoplay(false);
    }
  }, [zoomed, autoplay, card, isSpeaking, idx, siblings, onSelect]);
  const stopAuto = () => { setAutoplay(false); wasSpeaking.current = false; if (isSpeaking) onSpeak(); };
  const closeViewer = () => { stopAuto(); setZoomed(false); };

  const select = (next: CardData, keepZoom = false) => { if (!keepZoom) setZoomed(false); setProgress(0); if (!card) listPosition.current = scroll.current?.scrollTop ?? 0; onSelect(next); };
  const [featuredId, setFeaturedId] = useState<string | null>(null);
  useEffect(() => {
    const pick = new Uint32Array(1);
    window.crypto.getRandomValues(pick);
    setFeaturedId(cards[Math.floor((pick[0] / 4294967296) * cards.length)].id);
  }, [cards]);
  const featured = cards.find((c) => c.id === featuredId) ?? cards[0];

  useEffect(() => {
    const node = scroll.current;
    if (!node || !card) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add(styles.revealed); observer.unobserve(entry.target); }
    }, { root: node, threshold: 0.12 });
    const items = node.querySelectorAll("." + styles.readText + " > *");
    for (const item of items) observer.observe(item);
    return () => observer.disconnect();
  }, [card]);
  useEffect(() => {
    if (zoomed) zoomDialog.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, [zoomed]);

  return <div ref={scroll} className={styles.root} style={zoomed ? { overflowY: "hidden" } : undefined} onScroll={(e) => { if (card) { const node = e.currentTarget; const max = node.scrollHeight - node.clientHeight; setProgress(max > 0 ? Math.round(node.scrollTop / max * 100) : 100); } }} onTouchStart={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()}>
    <header className={styles.header}>
      <button className={styles.brand} onClick={() => onSelect(null)} aria-label={t.home}>
        <img src={asset("/cfbr-logo.png")} alt="CFBR" />
        <span>7 {fr ? "Familles" : "Families"}<small>{fr ? "Le monde des barrages" : "The world of dams"}</small></span>
      </button>
      <div className={styles.headerActions}>
        <label className={styles.mode}><span className="sr-only">{t.displayMode}</span><select value="explorer" onChange={(e) => onSwitch(e.target.value as Mode)}><option value="explorer">{fr ? "Explorer" : "Explore"}</option><option value="mosaic">{t.mosaic}</option><option value="3d">{t.carousel}</option></select></label>
        <a className={styles.language} href={asset(paths.home(fr ? "en" : "fr")) + "?vue=explorer" + (card ? "&carte=" + card.id : "")} aria-label={`${t.switchLang} – ${t.switchLangLabel}`}>{t.switchLang}</a>
      </div>
    </header>
    {card && <div className={styles.readProgress} role="progressbar" aria-label={fr ? "Progression de lecture" : "Reading progress"} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{width: progress + "%"}} /></div>}
    {card ? <div key={card.id} className={styles.reader}>
      <div className={styles.readNav}>
        <button onClick={() => onSelect(null)}><ArrowLeft size={17} />{fr ? "Retour à l’exploration" : "Back to exploring"}</button>
        <div><button onClick={() => select(siblings[(idx - 1 + siblings.length) % siblings.length])} aria-label={t.prevCard}><ChevronLeft size={18} /></button><span>{idx + 1} / {siblings.length}</span><button onClick={() => select(siblings[(idx + 1) % siblings.length])} aria-label={t.nextCard}><ChevronRight size={18} /></button></div>
      </div>
      <div className={styles.readGrid}>
        <aside className={styles.readVisual} style={{ "--family": card.familyColor } as React.CSSProperties}>
          <span className={styles.eyebrow}>{card.familyName} / 0{card.num}</span>
          <button className={styles.interactiveCard} aria-label={fr ? "Agrandir l’illustration" : "Enlarge the illustration"} onClick={() => setZoomed(true)} onPointerMove={(e) => { if (e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; const rect = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - rect.left) / rect.width; const y = (e.clientY - rect.top) / rect.height; e.currentTarget.style.setProperty("--tilt-x", (y * -14 + 7) + "deg"); e.currentTarget.style.setProperty("--tilt-y", (x * 14 - 7) + "deg"); e.currentTarget.style.setProperty("--light-x", (x * 100) + "%"); e.currentTarget.style.setProperty("--light-y", (y * 100) + "%"); }} onPointerLeave={(e) => { e.currentTarget.style.setProperty("--tilt-x", "0deg"); e.currentTarget.style.setProperty("--tilt-y", "0deg"); }}>
            <span className={styles.artDepth} style={{ "--slide-direction": direction } as React.CSSProperties}><span className={`${styles.transitionFrame} ${styles.inlineFrame}`}>{outgoing && <img className={styles.outgoingCard} src={asset(outgoing.frontImage)} alt="" aria-hidden="true" />}<img key={card.id} className={outgoing ? styles.incomingCard : undefined} src={asset(card.frontImage)} alt={t.cardAlt(card.num,card.title)} /></span><span className={styles.artShine} /><span className={styles.zoomHint}><Maximize2 size={17} /></span></span>
          </button>
          <p>{fr ? "Une carte. Une histoire. Un ouvrage à découvrir." : "One card. One story. A structure to discover."}</p>
        </aside>
        <article className={styles.article}>
          <span className={styles.eyebrow}>{fr ? "LA FICHE DÉCOUVERTE" : "THE DISCOVERY SHEET"}</span>
          <h1 ref={title} tabIndex={-1}>{card.title}</h1>
          <p className={styles.lead}>{card.shortDescription}</p>
          <CardActions iconOnly t={t} isSpeaking={isSpeaking} canSpeak={canSpeak} onToggleSpeak={onSpeak} onShare={onShare} onPrint={onPrint} />

          <div className={styles.readText}><ReactMarkdown components={{ h1: ({children}) => <h2>{children}</h2>, h2: ({children}) => <h2>{children}</h2>, h3: ({children}) => <h2>{children}</h2> }}>{card.contentMarkdown}</ReactMarkdown></div>
          <MoreLinks t={t} links={cardLinks(card,lang)} />
          {card.credits && <p className={styles.credit}>{t.creditPhoto} : {card.credits}</p>}
          <div className={styles.readEnd}><span>{fr ? "Continuez la découverte" : "Keep exploring"}</span><button onClick={() => select(siblings[(idx + 1) % siblings.length])}>{siblings[(idx + 1) % siblings.length].title}<ArrowRight size={18} /></button></div>
        </article>
      </div>
    </div> : <>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}><span className={styles.dot} />CFBR · 1926 — 2026</span>
          <h1>{fr ? "Un autre regard" : "A new perspective"}<br />{fr ? "sur les" : "on"} <em>{fr ? "barrages." : "dams."}</em></h1>
          <p>{fr ? "Derrière chaque barrage, des histoires, des métiers et des idées. Explorez-les, une carte à la fois." : "Behind every dam are stories, people and ideas. Explore them, one card at a time."}</p>
          <div className={styles.heroActions}><a href="#explorer-collection"><BookOpen size={18} />{fr ? "Explorer les cartes" : "Explore the cards"}<ArrowRight size={18} /></a>{QUIZ_ENABLED && <button onClick={() => onQuiz(familyId)}><Trophy size={18} />{fr ? "À vous de jouer" : "Your turn to play"}</button>}</div>
          <div className={styles.heroMeta}><span><b>7</b> {fr ? "familles" : "families"}</span><span><b>42</b> {fr ? "histoires à découvrir" : "stories to discover"}</span><button className={styles.heroListen} onClick={() => { select(featured); if (canSpeak) setListenCardId(featured.id); }} aria-label={(fr ? "Lire et écouter : " : "Read and listen: ") + featured.title}><Volume2 size={15} />{fr ? "À lire ou à écouter" : "Read or listen"}</button></div>
        </div>
        <button ref={heroArt} className={styles.heroArt} onClick={() => select(featured)} aria-label={t.openCard(featured.num,featured.title)}>
          <span className={styles.orbit} />
          <img className={styles.heroBack} src={thumb("/cards/card-back.webp")} alt="" />
          <img className={styles.heroFront} src={thumb(featured.frontImage)} alt={featured.title} />
          <span className={styles.heroCaption}><Sparkles size={15} /><span>{fr ? "Pour commencer" : "Start here"}<strong>{featured.title}</strong></span><ArrowRight size={18} /></span>
        </button>
      </section>
      <section id="explorer-collection" className={styles.collection}>
        <div className={styles.collectionHead}><div><span className={styles.eyebrow}>{fr ? "LA COLLECTION" : "THE COLLECTION"}</span><h2>{family?.name ?? (fr ? "À chaque carte, une découverte." : "A discovery in every card.")}</h2></div><label className={styles.search}><Search size={18} /><span className="sr-only">{t.search}</span><input aria-label={t.search} value={query} onChange={(e)=>setQuery(e.target.value)} placeholder={t.searchPlaceholder} />{query && <button onClick={()=>setQuery("")} aria-label={fr ? "Effacer la recherche" : "Clear search"}>×</button>}</label></div>
        <div className={styles.filters} role="group" aria-label={t.filterByFamily}><button aria-pressed={!familyId} onClick={()=>setFamilyId(null)}>{fr ? "Tout explorer" : "Explore all"}<span>42</span></button>{orderedFamilies.map(f=><button key={f.id} aria-pressed={familyId===f.id} onClick={()=>setFamilyId(f.id)}><i style={{background:f.color}} />{f.name}</button>)}</div>
        <div className={styles.resultMeta} role="status"><span>{filtered.length} {fr ? (filtered.length === 1 ? "carte à explorer" : "cartes à explorer") : (filtered.length === 1 ? "card to explore" : "cards to explore")}{family ? " · " + family.description : ""}</span>{family && QUIZ_ENABLED && <button onClick={()=>onQuiz(familyId)}><Trophy size={15} />{fr ? "Quiz de cette famille" : "Quiz this family"}<ArrowRight size={15} /></button>}</div>
        <div className={styles.cards}>{filtered.map(c=><button key={c.id} onClick={()=>select(c)} className={styles.card} aria-label={t.openCard(c.num,c.title)} style={{"--family":c.familyColor} as React.CSSProperties}><div className={styles.cardArt}><img src={thumb(c.frontImage)} alt="" loading="lazy" /><span className={styles.openArrow}><ArrowRight size={19} /></span></div><div className={styles.cardCopy}><span className={styles.eyebrow}>{c.familyName}</span><h3>{c.title}</h3><p>{c.shortDescription}</p><span className={styles.readLink}>{fr ? "Découvrir la fiche" : "Discover the story"}<ArrowRight size={14} /></span></div></button>)}</div>
        {!filtered.length && <p className={styles.empty}>{t.searchNone}</p>}
      </section>
      <section className={styles.quizBanner}><div><span className={styles.eyebrow}>{fr ? "APPRENDRE EN S’AMUSANT" : "LEARN THROUGH PLAY"}</span><h2>{fr ? "Et si on jouait ?" : "Ready to play?"}</h2><p>{fr ? "Cinq questions. De nouvelles découvertes. À votre rythme." : "Five questions. New discoveries. At your own pace."}</p></div>{QUIZ_ENABLED && <button onClick={()=>onQuiz(familyId)}>{t.quiz.start}<ArrowRight size={19} /></button>}</section>
    </>}
    {zoomed && card && <div ref={halo} className={`${styles.zoomOverlay} ${isSpeaking ? styles.voiceActive : ""}`} style={{ "--family": card.familyColor } as React.CSSProperties} onClick={closeViewer}><div ref={zoomDialog} role="dialog" aria-modal="true" aria-label={fr ? "Illustration agrandie : " + card.title : "Enlarged illustration: " + card.title} className={styles.zoomDialog} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); closeViewer(); } }}><div className={styles.viewerHeading}><span>{fr ? "LE SALON DES CARTES" : "THE CARD LOUNGE"}</span><strong>{card.familyName}</strong></div><div className={styles.viewerDots} aria-label={t.cardOf(card.num)}>{siblings.map((c, i) => <button key={c.id} onClick={() => select(c, true)} aria-label={t.openCard(c.num, c.title)} aria-current={i === idx ? "true" : undefined}><span /></button>)}</div><button className={styles.zoomClose} onClick={() => setZoomed(false)} aria-label={fr ? "Fermer l’illustration" : "Close illustration"}><X size={20} /></button><div className={styles.zoomStage} style={{ "--slide-direction": direction } as React.CSSProperties}><button className={styles.zoomPrevious} onClick={() => select(siblings[(idx - 1 + siblings.length) % siblings.length], true)} aria-label={t.prevCard} title={t.prevCard}><ChevronLeft size={24} /></button><div className={styles.transitionFrame}>{outgoing && <img key={outgoing.id + "-out"} className={styles.outgoingCard} src={asset(outgoing.frontImage)} alt="" aria-hidden="true" />}<img key={card.id} className={outgoing ? styles.incomingCard : undefined} src={asset(card.frontImage)} alt={t.cardAlt(card.num,card.title)} /></div><button className={styles.zoomNext} onClick={() => select(siblings[(idx + 1) % siblings.length], true)} aria-label={t.nextCard} title={t.nextCard}><ChevronRight size={24} /></button></div><div className={styles.zoomToolbar}><div key={card.id} className={`${styles.viewerLabel} ${outgoing ? styles.changingLabel : ""}`}><span>{card.familyName} · {idx + 1} / {siblings.length}</span><strong>{card.title}</strong></div>{canSpeak && <button onClick={() => { if (isSpeaking) setAutoplay(false); onSpeak(); }} aria-label={isSpeaking ? t.stop : t.listen} title={isSpeaking ? t.stop : t.listen} aria-pressed={isSpeaking} className={styles.zoomListen}>{isSpeaking ? <Square size={22} /> : <Volume2 size={22} />}<span className="sr-only">{isSpeaking ? t.stop : t.listen}</span></button>}<button className={styles.viewerAuto} aria-pressed={autoplay} aria-label={fr ? (autoplay ? "Arrêter la lecture automatique" : "Lecture automatique de la famille") : (autoplay ? "Stop autoplay" : "Autoplay this family")} title={fr ? "Lecture automatique de la famille" : "Autoplay this family"} onClick={() => autoplay ? stopAuto() : setAutoplay(true)}>{autoplay ? <Pause size={18} /> : <Play size={18} />}<span>{fr ? "Auto" : "Auto"}</span></button><button className={styles.viewerShare} onClick={onShare} aria-label={t.share} title={t.share}><Share2 size={19} /></button></div><p className={styles.viewerHint}>{fr ? "Une famille, six découvertes. Auto enchaîne les fiches jusqu’à la dernière carte." : "One family, six discoveries. Auto plays the remaining stories in order."}</p></div></div>}
    <footer className={styles.footer}><span>7 {fr ? "Familles des Barrages" : "Families of Dams"}<small>CFBR · 1926—2026</small></span><ResourcesNav lang={lang} /></footer>
  </div>;
}
