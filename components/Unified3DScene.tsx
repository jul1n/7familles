import React, { useRef, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, ContactShadows, Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { FAMILIES, CARDS, CardData } from "@/data/cards";
import { asset } from "@/lib/asset";

interface Unified3DSceneProps {
  currentStage: "deck" | "family" | "card";
  selectedFamilyId: string | null;
  selectedCardId: string | null;
  isFlipped: boolean;
  onSelectFamily: (fId: string) => void;
  onSelectCard: (cId: string) => void;
  onFlipToggle: () => void;
  hoveredCardId: string | null;
  setHoveredCardId: (id: string | null) => void;
  isDeckSpread: boolean;
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
      } else if (currentStage === "card") {
        targetZ = 7.2;
        targetY = 0.68; // Élève la carte au-dessus de la zone du bottom sheet mobile
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

function DeckBlock({ visible }: { visible: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
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
    if (groupRef.current) groupRef.current.visible = op > 0.01;
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

function CardFaces({
  frontUrl,
  width,
  height,
  thickness,
  frontMatRef,
  backMatRef,
}: {
  frontUrl: string;
  width: number;
  height: number;
  thickness: number;
  frontMatRef: React.RefObject<THREE.MeshBasicMaterial | null>;
  backMatRef: React.RefObject<THREE.MeshBasicMaterial | null>;
}) {
  // useTexture suspend : isolé ici, il ne bloque plus toute la scène (les cartes apparaissent au fil du chargement)
  const [frontTexture, backTexture] = useTexture([asset(frontUrl), asset("/cards/card-back.webp")]);
  frontTexture.colorSpace = THREE.SRGBColorSpace;
  backTexture.colorSpace = THREE.SRGBColorSpace;

  return (
    <>
      {/* Face Recto (illustration originale plein format sans double bordure) */}
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

      {/* Face Verso (dos officiel du jeu) */}
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
  onFlipToggle,
  isHovered,
  hoveredIndexInFamily,
  hoveredFamilyIndex,
  setHoveredCardId,
  isDeckSpread,
  deckScrollRef,
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
  onFlipToggle: () => void;
  isHovered: boolean;
  hoveredIndexInFamily: number;
  hoveredFamilyIndex: number;
  setHoveredCardId: (id: string | null) => void;
  isDeckSpread: boolean;
  deckScrollRef: React.MutableRefObject<number>;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const hoverProgressRef = useRef<number>(0);
  const evadeProgressRef = useRef<number>(0);
  const selectProgressRef = useRef<number>(0);
  const selectVelRef = useRef<number>(0);
  const lambdaRef = useRef<number>(6.8);
  const flipTargetRef = useRef<number>(0);
  const flipAngleRef = useRef<number>(0);
  const opacityRef = useRef<number>(1);
  const edgeMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const edgeMeshRef = useRef<THREE.Mesh>(null);
  const frontMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const backMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const tmp = useMemo(
    () => ({
      euler: new THREE.Euler(),
      q: new THREE.Quaternion(),
      qFlip: new THREE.Quaternion(),
      yAxis: new THREE.Vector3(0, 1, 0),
      pileEuler: new THREE.Euler(),
      pileNormal: new THREE.Vector3(),
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
  const isCardInSelectedFamily = card.familyId === selectedFamilyId;
  const isTargetSelectedCard = card.id === selectedCardId;

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
        tmp.pileNormal.set(0, 0, 1).applyEuler(tmp.pileEuler);
        targetX = jitter.offsetX * 0.25 + tmp.pileNormal.x * off;
        targetY = jitter.offsetY * 0.25 + tmp.pileNormal.y * off;
        targetZ = tmp.pileNormal.z * off;
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
        let baseY = Math.cos(effectiveFamilyPos * 0.25) * 0.2 + jitter.offsetY;
        let baseScale = isPortrait ? 0.88 : 1.0;

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

        // Position de repos dans l'éventail de la famille
        const centerOffset = indexInFamily - 2.5;
        const fanAngle = centerOffset * (isPortrait ? 0.095 : 0.11);
        const fanRadius = isPortrait ? 4.2 : 5.2;

        const restX = Math.sin(fanAngle) * fanRadius;
        const restY = -Math.cos(fanAngle) * fanRadius + (isPortrait ? 4.4 : 4.1);
        const restZ = indexInFamily * 0.09 + 0.8;
        const restRotZ = -fanAngle;
        const restRotY = -fanAngle * 0.32;
        const restRotX = -0.14;
        const restScale = isPortrait ? 0.70 : 0.82;

        // Waypoint d'insertion : la carte se place légèrement à GAUCHE de la carte précédente (i-1),
        // en superposition (dans sa propre couche, donc au-dessus de i-1 et sous i+1), puis se glisse
        // de gauche à droite dans sa fente. Elle suit l'arc de l'éventail avec l'inclinaison locale.
        const fanStep = isPortrait ? 0.095 : 0.11;
        const leftSlots = isPortrait ? 2.8 : 3.0; // nombre de fentes de décalage vers la gauche
        const clearAngle = fanAngle - leftSlots * fanStep;

        const clearX = Math.sin(clearAngle) * fanRadius;
        const clearY = -Math.cos(clearAngle) * fanRadius + (isPortrait ? 4.4 : 4.1);
        const clearZ = restZ; // Glisse exactement dans sa couche : couches espacées de 0.09 (> épaisseur)
        const clearRotZ = -clearAngle;
        const clearRotY = -clearAngle * 0.32; // plan parallèle aux cartes voisines à cet endroit
        const clearRotX = restRotX;
        const clearScale = restScale * 1.03;

        // Position d'inspection au premier plan
        const mouseX = state.pointer.x * 0.15;
        const mouseY = state.pointer.y * 0.15;
        const frontX = 0;
        const frontY = isPortrait ? 0.65 : 0.15;
        const frontZ = 2.4;
        const frontScale = isPortrait ? 0.76 : 0.86;
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
        // === 3. MODE FAMILLE : LES 6 CARTES EN MAIN (SURVOL & CONTOURNEMENT INVERSE) ===
        const centerOffset = indexInFamily - 2.5;
        const fanAngle = centerOffset * (isPortrait ? 0.095 : 0.11);
        const fanRadius = isPortrait ? 4.2 : 5.2;

        const baseX = Math.sin(fanAngle) * fanRadius;
        const baseY = -Math.cos(fanAngle) * fanRadius + (isPortrait ? 4.4 : 4.1);
        const baseZ = indexInFamily * 0.09 + 0.8;
        const baseRotZ = -fanAngle;
        const baseRotY = -fanAngle * 0.32;
        const baseRotX = -0.14;
        const baseScale = isPortrait ? 0.70 : 0.82;

        const sideDir = centerOffset >= 0 ? 1 : -1;
        const radX = Math.sin(fanAngle);
        const radY = Math.cos(fanAngle);
        const latX = Math.cos(fanAngle) * sideDir;
        const latY = -Math.sin(fanAngle) * sideDir;

        if (hp > 0.001) {
          // --- SURVOL D'UNE CARTE DANS LE DECK : GLISSEMENT LATÉRAL PUIS RAPPROCHEMENT (ET CHEMIN INVERSE) ---
          // Phase 1 (0 -> 0.42) : Glissement radial & décalage latéral (dégagement physique de la fente sans choc)
          // Phase 2 (0.42 -> 1.0) : Zoom d'avancée vers le joueur après dégagement
          const h1 = THREE.MathUtils.smoothstep(Math.min(hp / 0.42, 1.0), 0, 1);
          const h2 = THREE.MathUtils.smoothstep(Math.max(0, (hp - 0.42) / 0.58), 0, 1);

          const hRadial = (isPortrait ? 0.60 : 0.75) * h1;
          const hLateral = (isPortrait ? 0.28 : 0.36) * h1;
          const hLiftZ = 0.04 * h1; // Reste strictement dans sa couche de profondeur

          const hZoomZ = (isPortrait ? 0.45 : 0.55) * h2;
          const hZoomY = 0.14 * h2;
          const hZoomScale = (isPortrait ? 0.16 : 0.20) * h2;

          targetX = baseX + radX * hRadial + latX * hLateral;
          targetY = baseY + radY * hRadial + latY * hLateral + hZoomY;
          targetZ = baseZ + hLiftZ + hZoomZ;
          targetScale = baseScale + 0.03 * h1 + hZoomScale;

          targetRotZ = THREE.MathUtils.lerp(baseRotZ - sideDir * (0.08 * h1), -fanAngle * 0.08, h2);
          targetRotY = THREE.MathUtils.lerp(baseRotY, 0, h2);
          targetRotX = THREE.MathUtils.lerp(baseRotX, 0.02, h2);

          // Réactivité fine au curseur en hover
          targetRotX += -state.pointer.y * 0.06 * h2;
          targetRotZ += -state.pointer.x * 0.06 * h2;
        } else if (ep > 0.001) {
          // Évitement physique des autres cartes du deck
          const d = indexInFamily - hoveredIndexInFamily;
          const dist = Math.abs(d);
          const pushDir = Math.sign(d);
          const weight = Math.exp(-(dist - 1) * 0.7);

          targetX = baseX + pushDir * (0.34 * weight) * ep;
          targetY = baseY - (0.04 * weight) * ep;
          targetZ = baseZ - (0.06 * weight) * ep;
          targetRotZ = baseRotZ - pushDir * (0.05 * weight) * ep;
          targetRotY = baseRotY;
          targetRotX = baseRotX;
          targetScale = baseScale - 0.02 * ep;
        } else {
          targetX = baseX;
          targetY = baseY;
          targetZ = baseZ;
          targetRotZ = baseRotZ;
          targetRotY = baseRotY;
          targetRotX = baseRotX;
          targetScale = baseScale;
        }
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
    const lambdaTarget = sp > 0.001 || hp > 0.001 || ep > 0.001 ? 12 * motionScale : baseLambda;
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
      currentStage !== "deck" && !isCardInSelectedFamily ? (currentStage === "family" ? 0.3 : 0) : 1;
    opacityRef.current = THREE.MathUtils.damp(opacityRef.current, targetOpacity, 5 * motionScale, delta);
    const op = opacityRef.current;
    meshRef.current.visible = op > 0.01; // ne rend plus les cartes invisibles
    if (edgeMeshRef.current) edgeMeshRef.current.visible = !(currentStage === "deck" && !isDeckSpread);
    if (edgeMatRef.current) edgeMatRef.current.opacity = op;
    if (frontMatRef.current) frontMatRef.current.opacity = op;
    if (backMatRef.current) backMatRef.current.opacity = op;
  });

  const handleClick = (e: any) => {
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
      if (isTargetSelectedCard) {
        onFlipToggle();
      } else if (isCardInSelectedFamily) {
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

      {/* Titres flottants en 3D en mode Famille */}
      {currentStage === "family" && isCardInSelectedFamily && (isHovered || !isPortrait) && (
        <group position={[0, -height / 2 - 0.22, 0.05]}>
          <Text
            fontSize={0.11}
            color={isHovered ? "#0284c7" : "#1e293b"}
            anchorX="center"
            anchorY="top"
            maxWidth={1.5}
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

export default function Unified3DScene(rawProps: Unified3DSceneProps) {
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

  return (
    <div
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none touch-pan-y"
      role="region"
      aria-label="Scène 3D interactive des cartes et des familles de barrages"
    >
      <Canvas
        camera={{ position: [0, 0.15, 6.8], fov: 42 }}
        dpr={[1, maxDpr]}
        gl={{ antialias: true, alpha: true }}
      >
        <ResponsiveController currentStage={props.currentStage} />
        <ambientLight intensity={1.7} color="#fffcf5" />
        <directionalLight position={[5, 10, 6]} intensity={1.8} color="#fffbf5" />
        <directionalLight position={[-5, -2, -3]} intensity={0.5} color="#e2e8f0" />
        <pointLight position={[0, 2, 5]} intensity={0.4} color="#fef3c7" />

        <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.12}>
          <group position={[0, 0, 0]}>
            <DeckBlock visible={props.currentStage === "deck" && !props.isDeckSpread} />
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
                  onFlipToggle={props.onFlipToggle}
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
                  deckScrollRef={props.deckScrollRef}
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
    </div>
  );
}
