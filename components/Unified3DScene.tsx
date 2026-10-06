import React, { useRef, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useTexture, ContactShadows, Text, Float, useProgress } from "@react-three/drei";
import * as THREE from "three";
import type { CardData } from "@/data/cards";
import { getContent, type Lang } from "@/lib/content";
import { asset, thumb } from "@/lib/asset";

// Police locale pour les étiquettes 3D (évite la police récupérée sur un CDN par défaut)
const FONT_URL = asset("/fonts/Geist-Regular.ttf");

interface Unified3DSceneProps {
  lang?: Lang;
  currentStage: "deck" | "family" | "card";
  selectedFamilyId: string | null;
  selectedCardId: string | null;
  isFlipped: boolean; // dos de la carte ouverte (touche Espace)
  onSelectFamily: (fId: string) => void;
  onSelectCard: (cId: string) => void;
  onBack: () => void; // clic dans le vide : retour à l'affichage plus général
  hoveredCardId: string | null;
  setHoveredCardId: (id: string | null) => void;
  isDeckSpread: boolean;
  isBoxed: boolean; // paquet rassemblé rangé dans la boîte de jeu
  onToggleBox: () => void;
  deckScrollRef: React.MutableRefObject<number>; // Défilement horizontal (survol souris / tactile), lu à chaque frame
}

// Réglage global de la vitesse des animations : 1 = réglage par défaut, 0.7 = environ 40 % plus lent,
// 1.3 = plus nerveux. Agit sur le survol, l'ouverture / retour des cartes et le déploiement des éventails.
const ANIM_SPEED = 1;

function ResponsiveController({ currentStage }: { currentStage: "deck" | "family" | "card" }) {
  const { camera, size } = useThree();
  const isPortrait = size.width < size.height;

  useFrame((_, delta) => {
    let targetZ = 6.8;
    let targetY = 0.15;

    if (isPortrait) {
      if (currentStage === "family") {
        targetZ = 9.6;
        targetY = 0.35;
      } else if (currentStage === "deck") {
        targetZ = 8.6;
        targetY = 0.20;
      } else if (currentStage === "card" && window.innerWidth < 768) {
        targetZ = 7.2;
        targetY = 0.68; // Élève la carte au-dessus de la zone du bottom sheet mobile
      } else if (currentStage === "card") {
        // Volet de gauche d'une fenêtre de bureau étroite : pas de bottom sheet, on cadre comme en paysage
        targetZ = 6.8;
        targetY = 0.15;
      }
    } else {
      targetZ = 6.8;
      targetY = 0.15;
    }

    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 4.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 4.5, delta);
  });

  return null;
}

// Paquet rassemblé : 42 cartes de ~0,3 mm sur une carte de 100 mm de haut (échelle 2.428), soit ~13 mm réels
const PILE_COUNT = 42;
const PILE_SPACING = 0.0075;
const PILE_THICKNESS = PILE_COUNT * PILE_SPACING;
const PILE_EULER = new THREE.Euler(-0.55, 0.45, 0);
// Vitesse de suivi des cartes du paquet rassemblé (le bloc de tranche et la boîte la partagent)
const PILE_LAMBDA = 5;

// Boîte de jeu : proportions du gabarit d'impression (face 1085 × 1549 px, tranche 345 px), à l'échelle des cartes
const BOX_H = 2.72;
const BOX_W = (BOX_H * 1085) / 1549;
const BOX_D = (BOX_H * 345) / 1549;
// Ordre des faces de BoxGeometry : +x (droite), -x (gauche), +y (dessus), -y (dessous), +z (devant), -z (arrière)
const BOX_FACES = ["right", "left", "top", "bottom", "front", "back"] as const;
const BOX_DURATION = 1.5; // secondes pour ranger / sortir les cartes
const CARD_H_PILE = 2.428;

// Positions (u, v) dans le plan du paquet : paysage = paquet à gauche, boîte à droite ;
// portrait = paquet au-dessus de la boîte.
function boxLayout(isPortrait: boolean) {
  return isPortrait
    ? { pileU: 0, pileV: 1.6, boxU: 0, boxV: -1.5 }
    : { pileU: -1.3, pileV: 0.1, boxU: 1.3, boxV: 0 };
}

// Une fois les cartes rangées, la boîte glisse vers le centre de la scène
function boxU(s: number, L: ReturnType<typeof boxLayout>) {
  return THREE.MathUtils.lerp(L.boxU, 0, THREE.MathUtils.smoothstep(s, 0.75, 1));
}

// Trajet du paquet vers la boîte (s : 0 = posé à côté, 1 = rangé) : il se place au-dessus de l'ouverture,
// puis glisse vers le bas. Même repère que le paquet (inclinaison PILE_EULER).
function storedPose(s: number, L: ReturnType<typeof boxLayout>) {
  const aboveV = Math.max(L.boxV + BOX_H / 2 + CARD_H_PILE / 2 + 0.12, L.boxV);
  if (s < 0.5) {
    const k = THREE.MathUtils.smoothstep(s / 0.5, 0, 1);
    return {
      u: THREE.MathUtils.lerp(L.pileU, boxU(s, L), k),
      v: THREE.MathUtils.lerp(L.pileV, aboveV, k),
      scale: 1 - 0.3 * Math.sin(Math.PI * k), // léger recul pendant le déplacement : le paquet reste dans le cadre
    };
  }
  const k = THREE.MathUtils.smoothstep((s - 0.5) / 0.5, 0, 1);
  return { u: boxU(s, L), v: THREE.MathUtils.lerp(aboveV, L.boxV, k), scale: 0.7 + 0.3 * k };
}

function DeckBlock({ visible, boxProgressRef }: { visible: boolean; boxProgressRef: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const { size } = useThree();
  const isPortrait = size.width < size.height;
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const capMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const sideMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const opacityRef = useRef(0);

  // Même contour arrondi que les cartes, légèrement réduit pour rester caché derrière leurs bords
  const geometry = useMemo(() => {
    const w = 1.7 - 0.012;
    const h = 2.428 - 0.012;
    const r = 0.08;
    const x = -w / 2;
    const y = -h / 2;
    const sh = new THREE.Shape();
    sh.moveTo(x + r, y);
    sh.lineTo(x + w - r, y);
    sh.quadraticCurveTo(x + w, y, x + w, y + r);
    sh.lineTo(x + w, y + h - r);
    sh.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    sh.lineTo(x + r, y + h);
    sh.quadraticCurveTo(x, y + h, x, y + h - r);
    sh.lineTo(x, y + r);
    sh.quadraticCurveTo(x, y, x + r, y);
    const g = new THREE.ExtrudeGeometry(sh, { depth: PILE_THICKNESS, bevelEnabled: false, steps: 1 });
    g.translate(0, 0, -PILE_THICKNESS / 2);
    return g;
  }, []);

  // Tranche du paquet : une fine ligne d'ombre entre chaque carte (une bande = une carte)
  const sideTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 8;
    canvas.height = 32;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#f7f3ea";
    ctx.fillRect(0, 0, 8, 32);
    ctx.fillStyle = "#b9b09c";
    ctx.fillRect(0, 29, 8, 3);
    ctx.fillStyle = "#e6dfcf";
    ctx.fillRect(0, 26, 8, 3);
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(1, 1 / PILE_SPACING); // les UV des parois sont en unités monde : une bande par carte
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, []);

  useFrame((_, delta) => {
    opacityRef.current = THREE.MathUtils.damp(opacityRef.current, visible ? 1 : 0, 8, delta);
    const op = opacityRef.current;
    if (groupRef.current) {
      groupRef.current.visible = op > 0.01;
      // Le bloc suit le paquet : à côté de la boîte, puis glisse à l'intérieur
      const pose = storedPose(boxProgressRef.current, boxLayout(isPortrait));
      targetPos.set(pose.u, pose.v, 0).applyEuler(PILE_EULER);
      const lam = PILE_LAMBDA * (reducedMotion ? 3 : 1);
      groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetPos.x, lam, delta);
      groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetPos.y, lam, delta);
      groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetPos.z, lam, delta);
      groupRef.current.scale.setScalar(THREE.MathUtils.damp(groupRef.current.scale.x, pose.scale, lam, delta));
    }
    if (capMatRef.current) capMatRef.current.opacity = op;
    if (sideMatRef.current) sideMatRef.current.opacity = op;
  });

  return (
    <group ref={groupRef} rotation={PILE_EULER} visible={false}>
      <mesh geometry={geometry}>
        <meshStandardMaterial ref={capMatRef} attach="material-0" color="#f7f3ea" roughness={0.7} transparent />
        <meshStandardMaterial
          ref={sideMatRef}
          attach="material-1"
          map={sideTexture}
          roughness={0.8}
          transparent
        />
      </mesh>
    </group>
  );
}

type MatRef<T> = React.RefObject<T | null>;

interface FacesProps {
  frontUrl: string;
  width: number;
  height: number;
  thickness: number;
  frontMatRef: MatRef<THREE.MeshBasicMaterial>;
  backMatRef: MatRef<THREE.MeshBasicMaterial>;
}

// Faces en miniature (360 px) : légères, suffisantes pour le deck, l'éventail et les cartes d'arrière-plan.
// useTexture suspend : isolé ici, il ne bloque pas la scène (les cartes apparaissent au fil du chargement).
function CardFaces({ frontUrl, width, height, thickness, frontMatRef, backMatRef }: FacesProps) {
  const [frontTexture, backTexture] = useTexture([thumb(frontUrl), thumb("/cards/card-back.webp")]);
  frontTexture.colorSpace = THREE.SRGBColorSpace;
  backTexture.colorSpace = THREE.SRGBColorSpace;

  return (
    <>
      <mesh position={[0, 0, thickness / 2 + 0.001]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          ref={frontMatRef}
          map={frontTexture}
          toneMapped={false}
          transparent={true}
          alphaTest={0.01}
        />
      </mesh>
      <mesh position={[0, 0, -thickness / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          ref={backMatRef}
          map={backTexture}
          toneMapped={false}
          transparent={true}
          alphaTest={0.01}
        />
      </mesh>
    </>
  );
}

// Pleine résolution, uniquement pour la carte ouverte : se superpose à la miniature dès qu'elle est chargée.
function FullFront({ frontUrl, width, height, thickness, frontMatRef }: Omit<FacesProps, "backMatRef">) {
  const frontTexture = useTexture(asset(frontUrl));
  frontTexture.colorSpace = THREE.SRGBColorSpace;

  // Libère la mémoire graphique de l'image pleine résolution quand la carte est refermée
  React.useEffect(() => () => frontTexture.dispose(), [frontTexture]);

  return (
    <mesh position={[0, 0, thickness / 2 + 0.002]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        ref={frontMatRef}
        map={frontTexture}
        toneMapped={false}
        transparent={true}
        alphaTest={0.01}
      />
    </mesh>
  );
}

// Dos pleine résolution (388 Ko) : chargé seulement au premier retournement de la carte.
function FullBack({ width, height, thickness, backMatRef }: Omit<FacesProps, "frontUrl" | "frontMatRef">) {
  const backTexture = useTexture(asset("/cards/card-back.webp"));
  backTexture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh position={[0, 0, -thickness / 2 - 0.002]} rotation={[0, Math.PI, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        ref={backMatRef}
        map={backTexture}
        toneMapped={false}
        transparent={true}
        alphaTest={0.01}
      />
    </mesh>
  );
}

// Disposition des 6 cartes d'une famille : toutes visibles en même temps, sans chevauchement.
// Calculée d'après la taille réelle de la fenêtre (1 rangée, 2 × 3 ou 3 × 2) pour exploiter tout l'espace disponible.
const CARD_W = 1.7;
const CARD_H = 2.428;
const CELL_H = CARD_H + 0.5; // carte + étiquette du nom
const GRID_GAP = 1.04;
const FAMILY_Z = 0.8;

function familyGridLayout(index: number, width: number, height: number, isPortrait: boolean) {
  const camZ = isPortrait ? 9.6 : 6.8;
  const camY = isPortrait ? 0.35 : 0.15;
  const visH = 2 * Math.tan(THREE.MathUtils.degToRad(21)) * (camZ - FAMILY_Z);
  const wpp = visH / height; // unités monde par pixel
  const topPx = 84; // barre de retour / titre de famille
  const botPx = isPortrait ? 56 : 20;
  const usableW = visH * (width / height) * 0.94;
  const usableH = Math.max(1, height - topPx - botPx) * wpp;

  let best = { cols: 6, scale: 0 };
  for (const cols of [6, 3, 2]) {
    const rows = 6 / cols;
    const sW = usableW / ((cols - 1) * GRID_GAP * CARD_W + CARD_W);
    const sH = usableH / (rows * CELL_H);
    const scale = Math.min(sW, sH, 1);
    if (scale > best.scale) best = { cols, scale };
  }
  const { cols, scale } = best;
  const rows = 6 / cols;
  const col = index % cols;
  const row = Math.floor(index / cols);
  const centerY = camY - ((topPx - botPx) / 2) * wpp;
  const blockTop = centerY + (rows * CELL_H * scale) / 2;
  return {
    x: (col - (cols - 1) / 2) * GRID_GAP * CARD_W * scale,
    y: blockTop - row * CELL_H * scale - (CARD_H / 2) * scale,
    scale,
  };
}

function PhysicalCard3D({
  card,
  indexInFamily,
  familyIndex,
  currentStage,
  selectedFamilyId,
  selectedCardId,
  isFlipped,
  onSelectFamily,
  onSelectCard,
  isHovered,
  hoveredIndexInFamily,
  hoveredFamilyIndex,
  setHoveredCardId,
  isDeckSpread,
  boxProgressRef,
  deckScrollRef,
  loadAll,
}: {
  card: CardData;
  indexInFamily: number;
  familyIndex: number;
  currentStage: "deck" | "family" | "card";
  selectedFamilyId: string | null;
  selectedCardId: string | null;
  isFlipped: boolean;
  onSelectFamily: (fId: string) => void;
  onSelectCard: (cId: string) => void;
  isHovered: boolean;
  hoveredIndexInFamily: number;
  hoveredFamilyIndex: number;
  setHoveredCardId: (id: string | null) => void;
  isDeckSpread: boolean;
  boxProgressRef: React.MutableRefObject<number>;
  deckScrollRef: React.MutableRefObject<number>;
  loadAll: boolean;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const hoverProgressRef = useRef<number>(0);
  const evadeProgressRef = useRef<number>(0);
  const selectProgressRef = useRef<number>(0);
  const selectVelRef = useRef<number>(0);
  const lambdaRef = useRef<number>(6.8);
  const flipTargetRef = useRef<number>(0);
  const flipAngleRef = useRef<number>(0);
  const fullBackMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const opacityRef = useRef<number>(1);
  const edgeMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const edgeMeshRef = useRef<THREE.Mesh>(null);
  const frontMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const backMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const fullFrontMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const tmp = useMemo(
    () => ({
      euler: new THREE.Euler(),
      q: new THREE.Quaternion(),
      qFlip: new THREE.Quaternion(),
      yAxis: new THREE.Vector3(0, 1, 0),
      pileEuler: new THREE.Euler(),
      pileOffset: new THREE.Vector3(),
    }),
    []
  );
  // Accessibilité : transitions quasi instantanées si l'utilisateur réduit les animations
  const motionScale = useMemo(
    () =>
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 3 * ANIM_SPEED : ANIM_SPEED,
    []
  );

  const width = 1.7;
  const height = 2.428;
  const radius = 0.085;
  const thickness = 0.016;

  // Forme de carte aux coins arrondis physiques
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    const w = width;
    const h = height;
    const r = radius;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }, [width, height, radius]);

  const extrudeSettings = useMemo(
    () => ({
      depth: thickness,
      bevelEnabled: false,
      steps: 1,
    }),
    [thickness]
  );

  // Jitter naturel de chaque carte lorsqu'elle est dans le paquet de 6
  const jitter = useMemo(() => {
    const seed = familyIndex * 19 + indexInFamily * 31;
    return {
      rotZ: Math.sin(seed) * 0.035,
      offsetX: Math.cos(seed * 1.4) * 0.02,
      offsetY: Math.sin(seed * 2.2) * 0.018,
    };
  }, [familyIndex, indexInFamily]);

  const { size } = useThree();
  const isPortrait = size.width < size.height;
  const grid = useMemo(
    () => familyGridLayout(indexInFamily, size.width, size.height, isPortrait),
    [indexInFamily, size.width, size.height, isPortrait]
  );
  const isCardInSelectedFamily = card.familyId === selectedFamilyId;
  const isTargetSelectedCard = card.id === selectedCardId;

  // Chargement à la demande : couvertures d'abord, puis la famille ouverte, puis le reste en temps libre
  const shouldLoad = indexInFamily === 0 || loadAll || card.familyId === selectedFamilyId;
  // Pleine résolution : carte ouverte, conservée pendant l'animation de retour pour éviter un effet de flou
  const isOpenNow = currentStage === "card" && isTargetSelectedCard;
  const [keepFull, setKeepFull] = useState(false);
  React.useEffect(() => {
    if (isOpenNow) {
      setKeepFull(true);
      return;
    }
    const t = setTimeout(() => setKeepFull(false), 1800);
    return () => clearTimeout(t);
  }, [isOpenNow]);
  const wantFull = isOpenNow || keepFull;
  // Le dos en pleine résolution n'est demandé qu'au premier retournement
  const [backRequested, setBackRequested] = useState(false);
  React.useEffect(() => {
    if (isOpenNow && isFlipped) setBackRequested(true);
    else if (!wantFull) setBackRequested(false);
  }, [isOpenNow, isFlipped, wantFull]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // 1. Progression fluide de sélection de la carte (sortie vers le premier plan 0 -> 1, retour 1 -> 0)
    const isCurrentlySelected = currentStage === "card" && isTargetSelectedCard;
    const targetSelect = isCurrentlySelected ? 1 : 0;
    // Ressort amorti : départ doux (contrairement à un lissage exponentiel) et arrivée avec un léger
    // dépassement à l'ouverture. Le retour est critique (sans rebond) et plus lent : on voit la carte
    // se glisser dans l'éventail.
    const opening = targetSelect > selectProgressRef.current;
    const omega = (opening ? 5.5 : 4.2) * motionScale; // pulsation : ~0.9 s à l'ouverture, ~1.2 s au retour
    const zeta = opening ? 0.72 : 1;
    const steps = 2;
    const h = Math.min(delta, 1 / 30) / steps;
    for (let i = 0; i < steps; i++) {
      const acc =
        omega * omega * (targetSelect - selectProgressRef.current) - 2 * zeta * omega * selectVelRef.current;
      selectVelRef.current += acc * h;
      selectProgressRef.current += selectVelRef.current * h;
    }
    if (targetSelect === 0 && selectProgressRef.current < 0) {
      selectProgressRef.current = 0;
      selectVelRef.current = 0;
    }
    const sp = selectProgressRef.current;
    const settleOvershoot = Math.max(0, sp - 1); // dépassement à l'arrivée, utilisé pour un léger effet de pose

    // 2. Progression fluide du survol de la carte (0 -> 1)
    // Si la carte est en cours de sélection (sp > 0.05), le survol s'efface au profit de la sélection
    const targetHover = (isHovered && sp < 0.05) ? 1 : 0;
    hoverProgressRef.current = THREE.MathUtils.damp(hoverProgressRef.current, targetHover, 6 * motionScale, delta);
    const hp = hoverProgressRef.current;

    // 3. Progression d'évitement physique pour les cartes soeurs du même deck (0 -> 1)
    const isSisterEvading =
      (currentStage === "family" && isCardInSelectedFamily && hoveredIndexInFamily >= 0 && hoveredIndexInFamily !== indexInFamily && sp < 0.05) ||
      (currentStage === "card" && isCardInSelectedFamily && !isTargetSelectedCard && hoveredIndexInFamily >= 0 && hoveredIndexInFamily !== indexInFamily);
    const targetEvade = isSisterEvading ? 1 : 0;
    evadeProgressRef.current = THREE.MathUtils.damp(evadeProgressRef.current, targetEvade, 5.5 * motionScale, delta);
    const ep = evadeProgressRef.current;

    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let targetRotZ = 0;
    let targetScale = 1;

    // --- 1. ÉTAPE DECK (Les 7 familles avec défilement horizontal fluide) ---
    if (currentStage === "deck") {
      if (!isDeckSpread) {
        // Paquet unique compact : 42 cartes empilées le long de leur normale (épaisseur réaliste),
        // à peine désalignées comme un jeu bien rangé. La tranche est dessinée par <DeckBlock />.
        const stackK = familyIndex * 6 + (5 - indexInFamily); // 0 = dessous, 41 = dessus
        const off = (stackK - (PILE_COUNT - 1) / 2) * PILE_SPACING;
        const pileRotZ = jitter.rotZ * 0.2;
        tmp.pileEuler.set(PILE_EULER.x, PILE_EULER.y, pileRotZ);
        // Position dans le repère du paquet : (u, v) vers la boîte, off le long de l'épaisseur
        const pose = storedPose(boxProgressRef.current, boxLayout(isPortrait));
        tmp.pileOffset.set(pose.u, pose.v, off).applyEuler(tmp.pileEuler);
        targetX = jitter.offsetX * 0.25 + tmp.pileOffset.x;
        targetY = jitter.offsetY * 0.25 + tmp.pileOffset.y;
        targetZ = tmp.pileOffset.z;
        targetScale = pose.scale;
        targetRotX = PILE_EULER.x;
        targetRotY = PILE_EULER.y;
        targetRotZ = pileRotZ;
      } else {
        const effectiveFamilyPos = (familyIndex - 3) + deckScrollRef.current;
        const angleStep = 0.38;
        const angle = effectiveFamilyPos * angleStep;
        const arcRadius = 5.6;

        targetRotY = -angle * 0.72;
        targetRotX = -0.12;
        targetRotZ = -angle * 0.12 + jitter.rotZ;

        // La carte n°1 (indexInFamily = 0) est au-dessus du paquet de 6, orientée vers le joueur
        const stackOffset = (5 - indexInFamily) * 0.018;

        let baseX = Math.sin(angle) * arcRadius + Math.sin(targetRotY) * stackOffset + jitter.offsetX;
        let baseZ = -Math.cos(angle) * (arcRadius * 0.42) + 2.0 + Math.cos(targetRotY) * stackOffset;
        const baseY = Math.cos(effectiveFamilyPos * 0.25) * 0.2 + jitter.offsetY;
        const baseScale = isPortrait ? 0.88 : 1.0;

        // Évitement horizontal entre familles voisines au survol d'un paquet
        if (hoveredFamilyIndex >= 0 && hoveredFamilyIndex !== familyIndex) {
          const dFam = familyIndex - hoveredFamilyIndex;
          const distFam = Math.abs(dFam);
          const pushFamDir = Math.sign(dFam);
          const weightFam = Math.exp(-(distFam - 1) * 0.7);
          baseX += pushFamDir * (0.28 * weightFam);
          baseZ -= 0.12 * weightFam;
        }

        if (hp > 0.001) {
          // Sortie en 2 temps de la carte de couverture du paquet
          const stage1 = Math.min(hp / 0.40, 1.0);
          const s1 = THREE.MathUtils.smoothstep(stage1, 0, 1);
          const stage2 = Math.max(0, (hp - 0.40) / 0.60);
          const s2 = THREE.MathUtils.smoothstep(stage2, 0, 1);

          targetY = baseY + 0.24 * s1 + 0.16 * s2;
          targetZ = baseZ + 0.22 * s1 + 0.22 * s2;
          targetScale = baseScale + 0.03 * s1 + 0.05 * s2;
          targetX = baseX;
        } else {
          targetX = baseX;
          targetY = baseY;
          targetZ = baseZ;
          targetScale = baseScale;
        }
      }
    }
    // --- 2 & 3. ÉTAPES FAMILLE ET CARTE (AVEC CONTOURNEMENT PHYSIQUE ET CHEMIN INVERSE SANS CHOC) ---
    else if (isCardInSelectedFamily) {
      if (sp > 0.001) {
        // === 1. CARTE SÉLECTIONNÉE : TRAJECTOIRE DE CONTOURNEMENT EN 2 PHASES (ALLER & RETOUR) ===
        // Phase 1 (0 -> 0.42) : Glissement radial et déport latéral hors de l'éventail (dégagement de la fente)
        // Phase 2 (0.42 -> 1.0) : Avancée vers le joueur en Z et centrage face à la caméra
        const p1 = THREE.MathUtils.smoothstep(Math.min(sp / 0.42, 1.0), 0, 1);
        const p2 = THREE.MathUtils.smoothstep(Math.max(0, (sp - 0.42) / 0.58), 0, 1);

        // Position de repos dans la grille de la famille, puis soulèvement avant l'avancée vers le joueur
        const restX = grid.x;
        const restY = grid.y;
        const restZ = FAMILY_Z + indexInFamily * 0.02;
        const restRotZ = 0;
        const restRotY = 0;
        const restRotX = 0;
        const restScale = grid.scale;

        const clearX = restX;
        const clearY = restY;
        const clearZ = restZ + 0.6;
        const clearRotZ = 0;
        const clearRotY = 0;
        const clearRotX = 0;
        const clearScale = restScale * 1.05;

        // Position d'inspection au premier plan
        const mouseX = state.pointer.x * 0.15;
        const mouseY = state.pointer.y * 0.15;
        const frontX = 0;
        // Bottom sheet mobile (< 768 px) : la carte est remontée ; sinon elle est centrée dans son volet
        const sheetLayout = isPortrait && window.innerWidth < 768;
        const frontY = sheetLayout ? 1.1 : 0.15;
        const frontZ = 2.4;
        // Carte ouverte : aussi grande que le volet le permet (environ 2 fois la surface d'avant)
        const frontDist = (sheetLayout ? 7.2 : 6.8) - frontZ;
        const frontVisH = 2 * Math.tan(THREE.MathUtils.degToRad(21)) * frontDist;
        const frontVisW = frontVisH * (size.width / size.height);
        const frontScale = sheetLayout
          ? Math.min(0.82, (frontVisW * 0.92) / CARD_W)
          : Math.min(1.2, (frontVisW * 0.92) / CARD_W, (frontVisH * 0.8) / CARD_H);
        const frontRotX = -mouseY;
        const frontRotY = 0; // le retournement est géré à part (rotation cumulative)
        const frontRotZ = -mouseX * 0.4;

        if (p2 > 0) {
          // Trajectoire Phase 2 : entre le waypoint dégagé P_clear et le premier plan P_front (aller ou retour)
          // Z monte vite (ease-out) et XY suit (ease-in) : la carte passe au-dessus des voisines,
          // jamais à travers. Symétrique au retour : XY d'abord, Z ensuite.
          const zP = 1 - (1 - p2) * (1 - p2);
          const xyP = p2 * p2;
          targetX = THREE.MathUtils.lerp(clearX, frontX, xyP);
          targetY = THREE.MathUtils.lerp(clearY, frontY, xyP);
          targetZ = THREE.MathUtils.lerp(clearZ, frontZ, zP);
          targetRotX = THREE.MathUtils.lerp(clearRotX, frontRotX, p2);
          targetRotY = THREE.MathUtils.lerp(clearRotY, frontRotY, p2);
          targetRotZ = THREE.MathUtils.lerp(clearRotZ, frontRotZ, p2);
          targetScale = THREE.MathUtils.lerp(clearScale, frontScale, p2);
        } else {
          // Trajectoire Phase 1 : glissement latéral & radial entre le slot de repos P_slot et P_clear (aller ou retour)
          targetX = THREE.MathUtils.lerp(restX, clearX, p1);
          targetY = THREE.MathUtils.lerp(restY, clearY, p1);
          targetZ = THREE.MathUtils.lerp(restZ, clearZ, p1);
          targetRotX = THREE.MathUtils.lerp(restRotX, clearRotX, p1);
          targetRotY = THREE.MathUtils.lerp(restRotY, clearRotY, p1);
          targetRotZ = THREE.MathUtils.lerp(restRotZ, clearRotZ, p1);
          targetScale = THREE.MathUtils.lerp(restScale, clearScale, p1);
        }
      } else if (currentStage === "card") {
        // === 2. LES 5 CARTES SOEURS EN ARRIÈRE-PLAN (MODE CARTE) ===
        const centerOffset = indexInFamily - 2.5;
        const fanAngle = centerOffset * (isPortrait ? 0.16 : 0.22);
        const fanRadius = isPortrait ? 5.0 : 5.8;

        const baseX = Math.sin(fanAngle) * fanRadius;
        const baseY = -Math.cos(fanAngle) * fanRadius + (isPortrait ? 5.4 : 4.9);
        const baseZ = 0.3 + indexInFamily * 0.09; // même ordre de profondeur qu'en mode famille
        const baseRotZ = -fanAngle;
        const baseRotY = -fanAngle * 0.35;
        const baseRotX = -0.12;
        const baseScale = isPortrait ? 0.48 : 0.68;

        const sideDir = centerOffset >= 0 ? 1 : -1;
        const radX = Math.sin(fanAngle);
        const radY = Math.cos(fanAngle);
        const latX = Math.cos(fanAngle) * sideDir;
        const latY = -Math.sin(fanAngle) * sideDir;

        if (hp > 0.001) {
          // Survol en arrière-plan : sortie latérale puis léger rapprochement
          const h1 = THREE.MathUtils.smoothstep(Math.min(hp / 0.42, 1.0), 0, 1);
          const h2 = THREE.MathUtils.smoothstep(Math.max(0, (hp - 0.42) / 0.58), 0, 1);

          const hRadial = (isPortrait ? 0.45 : 0.58) * h1;
          const hLateral = (isPortrait ? 0.18 : 0.24) * h1;
          const hLiftZ = 0.04 * h1;
          const hZoomZ = (isPortrait ? 0.30 : 0.42) * h2;
          const hZoomY = 0.12 * h2;
          const hZoomScale = 0.14 * h2;

          targetX = baseX + radX * hRadial + latX * hLateral;
          targetY = baseY + radY * hRadial + latY * hLateral + hZoomY;
          targetZ = baseZ + hLiftZ + hZoomZ;
          targetScale = baseScale + 0.03 * h1 + hZoomScale;
          targetRotZ = THREE.MathUtils.lerp(baseRotZ - sideDir * (0.06 * h1), -fanAngle * 0.10, h2);
          targetRotY = THREE.MathUtils.lerp(baseRotY, 0, h2);
          targetRotX = THREE.MathUtils.lerp(baseRotX, 0.02, h2);
        } else if (ep > 0.001) {
          const d = indexInFamily - hoveredIndexInFamily;
          const dist = Math.abs(d);
          const pushDir = Math.sign(d);
          const weight = Math.exp(-(dist - 1) * 0.7);

          targetX = baseX + pushDir * (0.28 * weight) * ep;
          targetY = baseY - (0.04 * weight) * ep;
          targetZ = baseZ - (0.06 * weight) * ep;
          targetRotZ = baseRotZ - pushDir * (0.04 * weight) * ep;
          targetRotY = baseRotY;
          targetRotX = baseRotX;
          targetScale = baseScale;
        } else {
          targetX = baseX;
          targetY = baseY;
          targetZ = baseZ;
          targetRotZ = baseRotZ;
          targetRotY = baseRotY;
          targetRotX = baseRotX;
          targetScale = baseScale;
        }
      } else {
        // === 3. MODE FAMILLE : LES 6 CARTES CÔTE À CÔTE, TOUTES LISIBLES ===
        const baseX = grid.x;
        const baseY = grid.y;
        const baseZ = FAMILY_Z + indexInFamily * 0.02;
        const baseScale = grid.scale;

        // Survol : la carte se soulève et grossit légèrement, les autres ne bougent pas
        targetX = baseX;
        targetY = baseY + 0.06 * hp;
        targetZ = baseZ + 0.5 * hp;
        targetScale = baseScale * (1 + 0.1 * hp);
        targetRotX = -state.pointer.y * 0.06 * hp;
        targetRotZ = -state.pointer.x * 0.06 * hp;
      }
    } else {
      // Les autres familles s'estompent doucement vers l'arrière-plan
      if (currentStage === "family") {
        const angleStep = 0.5;
        const angle = (familyIndex - 3) * angleStep;
        targetX = Math.sin(angle) * 7.5;
        targetZ = -4.5;
        targetY = -0.5;
        targetScale = 0.5;
        targetRotY = -angle;
      } else {
        targetZ = -6;
        targetScale = 0.15;
      }
    }

    // Retournement : rotation cumulative, toujours dans le même sens (jamais par le grand côté)
    const isSelectedNow = currentStage === "card" && isTargetSelectedCard;
    if (isSelectedNow) {
      const parity = Math.abs(Math.round(flipTargetRef.current / Math.PI)) % 2;
      if ((parity === 1) !== isFlipped) flipTargetRef.current += Math.PI;
    } else {
      // Carte reposée : on revient au multiple de 2π le plus proche (face recto)
      flipTargetRef.current = Math.round(flipTargetRef.current / (2 * Math.PI)) * 2 * Math.PI;
    }
    flipAngleRef.current = THREE.MathUtils.damp(
      flipAngleRef.current,
      flipTargetRef.current,
      (isSelectedNow ? 5 : 14) * motionScale,
      delta
    );
    // Arc du retournement : la carte se soulève et grossit à mi-course
    const flipArc = Math.abs(Math.sin(flipAngleRef.current));
    targetZ += flipArc * 0.6 * sp;
    targetScale += flipArc * 0.06 * sp;
    targetZ += settleOvershoot * 3;
    targetScale += settleOvershoot * 0.5;

    // Vitesse de suivi : un seul niveau de lissage visible.
    // Trajectoire pilotée par une progression -> suivi serré ; sinon -> décalage (stagger) par carte,
    // la carte du dessus part en premier et les suivantes la rattrapent (effet d'éventail qui se déploie).
    const baseLambda = (5 - indexInFamily * 0.4 - familyIndex * 0.05) * motionScale;
    // Paquet rassemblé : vitesse unique, pour que les cartes restent alignées avec le bloc de tranche
    const lambdaTarget =
      currentStage === "deck" && !isDeckSpread
        ? PILE_LAMBDA * motionScale
        : sp > 0.001 || hp > 0.001 || ep > 0.001
          ? 12 * motionScale
          : baseLambda;
    lambdaRef.current = THREE.MathUtils.damp(lambdaRef.current, lambdaTarget, 8, delta);
    const lam = lambdaRef.current;

    meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, targetX, lam, delta);
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, lam, delta);
    meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, targetZ, lam, delta);

    // Rotation par quaternions (slerp) : trajet direct, sans torsion d'Euler
    tmp.euler.set(targetRotX, targetRotY, targetRotZ);
    tmp.q.setFromEuler(tmp.euler);
    tmp.qFlip.setFromAxisAngle(tmp.yAxis, flipAngleRef.current);
    tmp.q.multiply(tmp.qFlip);
    meshRef.current.quaternion.slerp(tmp.q, 1 - Math.exp(-lam * delta));

    meshRef.current.scale.setScalar(
      THREE.MathUtils.damp(meshRef.current.scale.x, targetScale, lam + 0.2, delta)
    );

    // Fondu des familles non sélectionnées (au lieu d'un simple éloignement brutal)
    const targetOpacity =
      currentStage !== "deck" && !isCardInSelectedFamily ? 0 : 1;
    opacityRef.current = THREE.MathUtils.damp(opacityRef.current, targetOpacity, 5 * motionScale, delta);
    const op = opacityRef.current;
    meshRef.current.visible = op > 0.01; // ne rend plus les cartes invisibles
    if (edgeMeshRef.current) edgeMeshRef.current.visible = !(currentStage === "deck" && !isDeckSpread);
    if (edgeMatRef.current) edgeMatRef.current.opacity = op;
    if (frontMatRef.current) frontMatRef.current.opacity = op;
    if (backMatRef.current) backMatRef.current.opacity = op;
    if (fullFrontMatRef.current) fullFrontMatRef.current.opacity = op;
    if (fullBackMatRef.current) fullBackMatRef.current.opacity = op;
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (currentStage === "deck") {
      onSelectFamily(card.familyId);
    } else if (currentStage === "family") {
      if (isCardInSelectedFamily) {
        // Sur mobile tactile : 1er tap sort la carte en prévisualisation, 2e tap ouvre la carte
        const isTouch = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
        if (isTouch && hoveredIndexInFamily !== indexInFamily) {
          setHoveredCardId(card.id);
        } else {
          onSelectCard(card.id);
        }
      }
    } else if (currentStage === "card") {
      // Carte voisine : on l'ouvre. Carte déjà ouverte : le parent s'en sert pour déployer la fiche (mobile).
      if (isTargetSelectedCard || isCardInSelectedFamily) {
        onSelectCard(card.id);
      }
    }
  };

  return (
    <group
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredCardId(card.id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHoveredCardId(null);
        document.body.style.cursor = "";
      }}
      onClick={handleClick}
    >
      {/* Tranche de papier / carton physique */}
      <mesh ref={edgeMeshRef} position={[0, 0, -thickness / 2]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          ref={edgeMatRef}
          transparent={true}
          color="#fdfbf7"
          roughness={0.42}
          metalness={0.04}
        />
      </mesh>

      {shouldLoad && (
        <Suspense fallback={null}>
          <CardFaces
            frontUrl={card.frontImage}
            width={width}
            height={height}
            thickness={thickness}
            frontMatRef={frontMatRef}
            backMatRef={backMatRef}
          />
        </Suspense>
      )}
      {wantFull && (
        <Suspense fallback={null}>
          <FullFront
            frontUrl={card.frontImage}
            width={width}
            height={height}
            thickness={thickness}
            frontMatRef={fullFrontMatRef}
          />
        </Suspense>
      )}

      {wantFull && backRequested && (
        <Suspense fallback={null}>
          <FullBack width={width} height={height} thickness={thickness} backMatRef={fullBackMatRef} />
        </Suspense>
      )}

      {/* Titres flottants en 3D en mode Famille */}
      {currentStage === "family" && isCardInSelectedFamily && (
        <group position={[0, -height / 2 - 0.12, 0.05]}>
          <Text
            font={FONT_URL}
            fontSize={0.15}
            color={isHovered ? "#0284c7" : "#1e293b"}
            anchorX="center"
            anchorY="top"
            maxWidth={1.65}
            textAlign="center"
            fontWeight={600}
          >
            {card.num}. {card.title}
          </Text>
        </group>
      )}

      {/* Titre de carte en arrière-plan en mode Carte pour guider le clic */}
      {currentStage === "card" && !isTargetSelectedCard && isCardInSelectedFamily && (isHovered || !isPortrait) && (
        <group position={[0, -height / 2 - 0.22, 0.05]}>
          <Text
            font={FONT_URL}
            fontSize={0.10}
            color={isHovered ? "#0284c7" : "#64748b"}
            anchorX="center"
            anchorY="top"
            maxWidth={1.4}
            textAlign="center"
            fontWeight={500}
          >
            {card.num}. {card.title}
          </Text>
        </group>
      )}

      {/* Titre de famille en mode Deck */}
      {currentStage === "deck" && isDeckSpread && indexInFamily === 0 && (
        <group position={[0, -height / 2 - 0.28, 0.05]}>
          <Text
            font={FONT_URL}
            fontSize={0.14}
            color={isHovered ? "#0284c7" : "#0f172a"}
            anchorX="center"
            anchorY="top"
            maxWidth={2}
            textAlign="center"
            fontWeight={700}
          >
            {card.familyName}
          </Text>
        </group>
      )}
    </group>
  );
}

// Boîte de jeu en 3D : visuels du gabarit d'impression (devant, arrière, tranches, dessus, dessous).
// Opaque : les cartes rangées à l'intérieur disparaissent derrière ses parois.
function GameBox({
  visible,
  onToggle,
  boxProgressRef,
}: {
  visible: boolean;
  onToggle: () => void;
  boxProgressRef: React.MutableRefObject<number>;
}) {
  const textures = useTexture(BOX_FACES.map((f) => asset(`/box/${f}.webp`)));
  useMemo(() => {
    textures.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
    });
  }, [textures]);
  const groupRef = useRef<THREE.Group>(null);
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const { size } = useThree();
  const isPortrait = size.width < size.height;
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const L = boxLayout(isPortrait);
    targetPos.set(boxU(boxProgressRef.current, L), L.boxV, 0).applyEuler(PILE_EULER);
    // Apparition : la boîte arrive du bas en grandissant
    const lam = 6 * (reducedMotion ? 3 : 1);
    const k = THREE.MathUtils.damp(g.scale.x, visible ? 1 : 0, lam, delta);
    g.scale.setScalar(k);
    g.visible = k > 0.02;
    g.position.x = targetPos.x;
    g.position.y = targetPos.y - (1 - k) * 1.2;
    g.position.z = targetPos.z;
  });

  return (
    <group ref={groupRef} rotation={PILE_EULER} visible={false} scale={0.001}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <boxGeometry args={[BOX_W, BOX_H, BOX_D]} />
        {textures.map((map, i) => (
          <meshStandardMaterial key={BOX_FACES[i]} attach={`material-${i}`} map={map} roughness={0.62} />
        ))}
      </mesh>
    </group>
  );
}

// Avancement du rangement (0 = cartes posées à côté de la boîte, 1 = rangées), à vitesse constante.
function BoxController({
  active,
  progressRef,
}: {
  active: boolean;
  progressRef: React.MutableRefObject<number>;
}) {
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  useFrame((_, delta) => {
    const step = Math.min(delta, 1 / 20) / (BOX_DURATION / (reducedMotion ? 3 : 1));
    const target = active ? 1 : 0;
    const p = progressRef.current;
    progressRef.current = p + Math.max(-step, Math.min(step, target - p));
  });
  return null;
}

// Barre de progression du chargement initial (affichée une seule fois)
function LoadingBar({ lang }: { lang: Lang }) {
  const { progress } = useProgress();
  const [done, setDone] = useState(false);
  React.useEffect(() => {
    if (progress < 100) return;
    const t = setTimeout(() => setDone(true), 500);
    return () => clearTimeout(t);
  }, [progress]);
  if (done) return null;
  return (
    <div
      role="progressbar"
      aria-label={lang === "fr" ? "Chargement des cartes" : "Loading the cards"}
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 pointer-events-none flex flex-col items-center gap-2 transition-opacity duration-500 ${
        progress >= 100 ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="h-1.5 w-full rounded-full bg-stone-200/80 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#1b5d78] transition-[width] duration-300 ease-out"
          style={{ width: `${Math.max(6, progress)}%` }}
        />
      </div>
      <span className="text-xs font-medium text-stone-600">{lang === "fr" ? "Chargement des cartes…" : "Loading the cards…"} {Math.round(progress)} %</span>
    </div>
  );
}

export default function Unified3DScene(rawProps: Unified3DSceneProps) {
  // Préchargement en temps libre des cartes qui ne sont pas encore nécessaires (après les couvertures)
  const [loadAll, setLoadAll] = useState(false);
  React.useEffect(() => {
    const w = window as unknown as {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId: number | undefined;
    const t = setTimeout(() => {
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(() => setLoadAll(true), { timeout: 6000 });
      else setLoadAll(true);
    }, 2000);
    return () => {
      clearTimeout(t);
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
    };
  }, []);

  // Mouvement réduit : la scène ne flotte plus d'elle-même
  const reduceMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const maxDpr = useMemo(
    () => (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches ? 1.5 : 2),
    []
  );
  // Survol avec délai de sortie : évite le clignotement quand la carte survolée s'écarte du curseur
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setHoveredCardId: setHoveredRaw } = rawProps;
  const setHoveredCardId = React.useCallback(
    (id: string | null) => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
      if (id) setHoveredRaw(id);
      else hoverTimerRef.current = setTimeout(() => setHoveredRaw(null), 90);
    },
    [setHoveredRaw]
  );
  React.useEffect(
    () => () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    },
    []
  );
  const props = { ...rawProps, setHoveredCardId };
  // Boîte : visible quand le paquet est rassemblé ; textures chargées au premier rassemblement
  const boxProgressRef = useRef(0);
  const folded = rawProps.currentStage === "deck" && !rawProps.isDeckSpread;
  const [boxWanted, setBoxWanted] = useState(false);
  React.useEffect(() => {
    if (folded) setBoxWanted(true);
  }, [folded]);
  const lang: Lang = rawProps.lang ?? "fr";
  const { FAMILIES, CARDS } = useMemo(() => getContent(lang), [lang]);

  return (
    <div
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none touch-pan-y"
      role="region"
      aria-label={lang === "fr" ? "Scène 3D interactive des cartes et des familles de barrages" : "Interactive 3D scene of the dam cards and families"}
    >
      <Canvas
        camera={{ position: [0, 0.15, 6.8], fov: 42 }}
        dpr={[1, maxDpr]}
        gl={{ antialias: true, alpha: true }}
        onPointerMissed={() => props.onBack()}
      >
        <ResponsiveController currentStage={props.currentStage} />
        <BoxController active={folded && props.isBoxed} progressRef={boxProgressRef} />
        <ambientLight intensity={1.7} color="#fffcf5" />
        <directionalLight position={[5, 10, 6]} intensity={1.8} color="#fffbf5" />
        <directionalLight position={[-5, -2, -3]} intensity={0.5} color="#e2e8f0" />
        <pointLight position={[0, 2, 5]} intensity={0.4} color="#fef3c7" />

        <Float speed={reduceMotion ? 0 : 1.1} rotationIntensity={reduceMotion ? 0 : 0.06} floatIntensity={reduceMotion ? 0 : 0.12}>
          <group position={[0, 0, 0]}>
            <DeckBlock visible={folded} boxProgressRef={boxProgressRef} />
            {boxWanted && (
              <Suspense fallback={null}>
                <GameBox visible={folded} onToggle={props.onToggleBox} boxProgressRef={boxProgressRef} />
              </Suspense>
            )}
            {FAMILIES.map((family, fIdx) => {
              const famCards = CARDS.filter((c) => c.familyId === family.id);
              const hoveredFamilyCard = props.hoveredCardId
                ? famCards.find((c) => c.id === props.hoveredCardId)
                : null;
              const hoveredIndexInFamily = hoveredFamilyCard
                ? famCards.indexOf(hoveredFamilyCard)
                : -1;
              const hoveredFamilyIndex = props.hoveredCardId
                ? FAMILIES.findIndex((f) => props.hoveredCardId?.startsWith(f.id))
                : -1;

              return famCards.map((card, cIdx) => (
                <PhysicalCard3D
                  key={card.id}
                  card={card}
                  indexInFamily={cIdx}
                  familyIndex={fIdx}
                  currentStage={props.currentStage}
                  selectedFamilyId={props.selectedFamilyId}
                  selectedCardId={props.selectedCardId}
                  isFlipped={props.isFlipped}
                  onSelectFamily={props.onSelectFamily}
                  onSelectCard={props.onSelectCard}
                  isHovered={
                    props.hoveredCardId === card.id ||
                    (props.currentStage === "deck" &&
                      !!props.hoveredCardId?.startsWith(family.id) &&
                      cIdx === 0)
                  }
                  hoveredIndexInFamily={hoveredIndexInFamily}
                  hoveredFamilyIndex={hoveredFamilyIndex}
                  setHoveredCardId={props.setHoveredCardId}
                  isDeckSpread={props.isDeckSpread}
                  boxProgressRef={boxProgressRef}
                  deckScrollRef={props.deckScrollRef}
                  loadAll={loadAll}
                />
              ));
            })}
          </group>
        </Float>

        <ContactShadows
          position={[0, -1.9, 0]}
          opacity={0.3}
          scale={10}
          blur={2.4}
          far={4}
        />
      </Canvas>
      <LoadingBar lang={lang} />
    </div>
  );
}
