import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, ContactShadows, Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { FAMILIES, CARDS, CardData } from "@/data/cards";

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
  deckScrollOffset: number; // Défilement horizontal contrôlé par le survol souris/tactile
}

function ResponsiveController({ currentStage }: { currentStage: "deck" | "family" | "card" }) {
  const { camera, size } = useThree();
  const isPortrait = size.width < size.height;

  useFrame((_, delta) => {
    let targetZ = 6.8;
    let targetY = 0.15;

    if (isPortrait) {
      if (currentStage === "family") {
        targetZ = 9.2;
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
  deckScrollOffset,
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
  deckScrollOffset: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const hoverProgressRef = useRef<number>(0);
  const evadeProgressRef = useRef<number>(0);

  // Textures Recto et Verso
  const [frontTexture, backTexture] = useTexture([card.frontImage, "/cards/card-back.webp"]);
  frontTexture.colorSpace = THREE.SRGBColorSpace;
  backTexture.colorSpace = THREE.SRGBColorSpace;

  const width = 1.7;
  const height = 2.42;
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
    s.quadraticCurveTo(x, y + r);
    return s;
  }, [width, height, radius]);

  const extrudeSettings = useMemo(
    () => ({
      depth: thickness,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.007,
      bevelThickness: 0.005,
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

    // 1. Progression fluide du survol de la carte (0 -> 1)
    const targetHover = isHovered ? 1 : 0;
    hoverProgressRef.current = THREE.MathUtils.damp(hoverProgressRef.current, targetHover, 8.5, delta);
    const hp = hoverProgressRef.current;

    // 2. Progression d'évitement physique pour les cartes soeurs du même deck (0 -> 1)
    const isSisterEvading =
      (currentStage === "family" && isCardInSelectedFamily && hoveredIndexInFamily >= 0 && hoveredIndexInFamily !== indexInFamily) ||
      (currentStage === "card" && isCardInSelectedFamily && !isTargetSelectedCard && hoveredIndexInFamily >= 0 && hoveredIndexInFamily !== indexInFamily);
    const targetEvade = isSisterEvading ? 1 : 0;
    evadeProgressRef.current = THREE.MathUtils.damp(evadeProgressRef.current, targetEvade, 7.5, delta);
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
        // Paquet unique compact
        const globalZ = (familyIndex - 3) * (6 * 0.016) + (5 - indexInFamily) * 0.016;
        targetX = jitter.offsetX;
        targetY = jitter.offsetY;
        targetZ = globalZ;
        targetRotX = -0.55;
        targetRotY = 0.45;
        targetRotZ = jitter.rotZ;
      } else {
        const effectiveFamilyPos = (familyIndex - 3) + deckScrollOffset;
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
    // --- 2. ÉTAPE FAMILLE (Éventail avec simulation physique de sortie latérale puis zoom + évitement des voisines) ---
    else if (currentStage === "family") {
      if (isCardInSelectedFamily) {
        // Base naturelle de l'éventail de cartes en main
        const centerOffset = indexInFamily - 2.5; // -2.5, -1.5, -0.5, 0.5, 1.5, 2.5
        const fanAngle = centerOffset * (isPortrait ? 0.095 : 0.11);
        const fanRadius = isPortrait ? 4.2 : 5.2;

        const baseX = Math.sin(fanAngle) * fanRadius;
        const baseY = -Math.cos(fanAngle) * fanRadius + (isPortrait ? 3.4 : 4.1);
        const baseZ = indexInFamily * 0.06 + 0.8;
        const baseRotZ = -fanAngle;
        const baseRotY = -fanAngle * 0.32;
        const baseRotX = -0.14;
        const baseScale = isPortrait ? 0.64 : 0.82;

        if (hp > 0.001) {
          // --- 1. DÉPLACEMENT DE LA CARTE SURVOLÉE (SORTIE DU DECK PUIS ZOOM) ---
          // Phase 1 (0 -> 0.38) : Décalage latéral & glissement hors de la fente (dégagement physique du paquet)
          // Phase 2 (0.38 -> 1.0) : Zoom vers la caméra, redressement face au joueur
          const stage1 = Math.min(hp / 0.38, 1.0);
          const s1 = THREE.MathUtils.smoothstep(stage1, 0, 1);

          const stage2 = Math.max(0, (hp - 0.38) / 0.62);
          const s2 = THREE.MathUtils.smoothstep(stage2, 0, 1);

          // Phase 1 : Sortie de la fente le long du rayon + décalage latéral vers l'extérieur
          const radialSlide = (isPortrait ? 0.44 : 0.52) * s1;
          const sideSlideDir = centerOffset >= 0 ? 1 : -1;
          const lateralSlide = sideSlideDir * 0.18 * s1;
          const liftOutZ = 0.32 * s1;

          // Phase 2 : Zoom, avancée vers le joueur et redressement
          const zoomZ = 0.48 * s2;
          const zoomY = 0.16 * s2;
          const zoomScale = (isPortrait ? 0.18 : 0.22) * s2;

          targetX = baseX + Math.sin(fanAngle) * radialSlide + Math.cos(fanAngle) * lateralSlide;
          targetY = baseY + Math.cos(fanAngle) * radialSlide + zoomY;
          targetZ = baseZ + liftOutZ + zoomZ;
          targetScale = baseScale + 0.04 * s1 + zoomScale;

          // Redressement progressif pour faire face au joueur
          targetRotZ = THREE.MathUtils.lerp(baseRotZ, -fanAngle * 0.12, s2);
          targetRotY = THREE.MathUtils.lerp(baseRotY, 0, s2);
          targetRotX = THREE.MathUtils.lerp(baseRotX, 0.02, s2);

          // Réactivité fine au curseur en hover
          targetRotX += -state.pointer.y * 0.08 * s2;
          targetRotZ += -state.pointer.x * 0.08 * s2;
        } else if (ep > 0.001) {
          // --- 2. ÉVITEMENT PHYSIQUE DES AUTRES CARTES DU DECK ---
          // Les cartes voisines s'écartent pour laisser passer la carte qui sort
          const d = indexInFamily - hoveredIndexInFamily; // < 0 pour gauche, > 0 pour droite
          const dist = Math.abs(d);
          const pushDir = Math.sign(d);

          // Force d'écartement : maximale pour les voisins immédiats (|d| = 1), décroît avec la distance
          const weight = Math.exp(-(dist - 1) * 0.7);
          const pushX = pushDir * (0.34 * weight) * ep;
          const pushAngle = pushDir * (0.055 * weight) * ep;
          const pushZ = -(0.08 * weight) * ep; // Recul en profondeur
          const pushY = -(0.05 * weight) * ep;

          targetX = baseX + pushX;
          targetY = baseY + pushY;
          targetZ = baseZ + pushZ;
          targetRotZ = baseRotZ - pushAngle;
          targetRotY = baseRotY;
          targetRotX = baseRotX;
          targetScale = baseScale - 0.02 * ep;
        } else {
          // Position de repos normale
          targetX = baseX;
          targetY = baseY;
          targetZ = baseZ;
          targetRotZ = baseRotZ;
          targetRotY = baseRotY;
          targetRotX = baseRotX;
          targetScale = baseScale;
        }
      } else {
        // Les autres familles s'estompent doucement vers l'arrière-plan
        const angleStep = 0.5;
        const angle = (familyIndex - 3) * angleStep;
        targetX = Math.sin(angle) * 7.5;
        targetZ = -4.5;
        targetY = -0.5;
        targetScale = 0.5;
        targetRotY = -angle;
      }
    }
    // --- 3. ÉTAPE CARTE INDIVIDUELLE (Carte active au centre + les 5 cartes soeurs visibles en arrière-plan) ---
    else if (currentStage === "card") {
      if (isTargetSelectedCard) {
        // La carte choisie se détache vers l'avant, centrée et bien cadrée
        targetX = 0;
        targetY = isPortrait ? 0.65 : 0.15; // Élevée en portrait pour flotter au-dessus du bottom sheet
        targetZ = 2.4;
        targetScale = isPortrait ? 0.76 : 0.86;

        // Retournement à 180°
        targetRotY = isFlipped ? Math.PI : 0;

        // Réaction interactive au curseur / gyroscope
        const mouseX = state.pointer.x * 0.15;
        const mouseY = state.pointer.y * 0.15;
        targetRotX = -mouseY;
        targetRotZ = -mouseX * 0.4;
      } else if (isCardInSelectedFamily) {
        // Les 5 autres cartes forment un éventail visible en arrière-plan pour naviguer
        const centerOffset = indexInFamily - 2.5;
        const fanAngle = centerOffset * (isPortrait ? 0.16 : 0.22);
        const fanRadius = isPortrait ? 5.0 : 5.8;

        const baseX = Math.sin(fanAngle) * fanRadius;
        const baseY = -Math.cos(fanAngle) * fanRadius + (isPortrait ? 5.4 : 4.9);
        const baseZ = 0.15 + (5 - Math.abs(centerOffset)) * 0.05;
        const baseRotZ = -fanAngle;
        const baseRotY = -fanAngle * 0.35;
        const baseRotX = -0.12;
        const baseScale = isPortrait ? 0.48 : 0.68;

        if (hp > 0.001) {
          // Sortie et zoom de la carte soeur survolée
          const stage1 = Math.min(hp / 0.40, 1.0);
          const s1 = THREE.MathUtils.smoothstep(stage1, 0, 1);
          const stage2 = Math.max(0, (hp - 0.40) / 0.60);
          const s2 = THREE.MathUtils.smoothstep(stage2, 0, 1);

          const radialSlide = 0.45 * s1;
          const sideSlideDir = centerOffset >= 0 ? 1 : -1;
          const lateralSlide = sideSlideDir * 0.15 * s1;

          targetX = baseX + Math.sin(fanAngle) * radialSlide + Math.cos(fanAngle) * lateralSlide;
          targetY = baseY + Math.cos(fanAngle) * radialSlide + 0.15 * s2;
          targetZ = baseZ + 0.30 * s1 + 0.40 * s2;
          targetScale = baseScale + 0.04 * s1 + 0.14 * s2;
          targetRotZ = THREE.MathUtils.lerp(baseRotZ, -fanAngle * 0.15, s2);
          targetRotY = THREE.MathUtils.lerp(baseRotY, 0, s2);
          targetRotX = THREE.MathUtils.lerp(baseRotX, 0, s2);
        } else if (ep > 0.001) {
          // Évitement des cartes soeurs voisines en arrière-plan
          const d = indexInFamily - hoveredIndexInFamily;
          const dist = Math.abs(d);
          const pushDir = Math.sign(d);
          const weight = Math.exp(-(dist - 1) * 0.7);

          targetX = baseX + pushDir * (0.30 * weight) * ep;
          targetY = baseY - (0.04 * weight) * ep;
          targetZ = baseZ - (0.06 * weight) * ep;
          targetRotZ = baseRotZ - pushDir * (0.045 * weight) * ep;
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
        // Les autres familles sont repoussées hors champ
        targetZ = -6;
        targetScale = 0.15;
      }
    }

    // Amortissement Three.js pour une transition physique ultra fluide
    meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, targetX, 5.5, delta);
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, 5.5, delta);
    meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, targetZ, 5.5, delta);

    meshRef.current.rotation.x = THREE.MathUtils.damp(meshRef.current.rotation.x, targetRotX, 5.5, delta);
    meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, targetRotY, 5.5, delta);
    meshRef.current.rotation.z = THREE.MathUtils.damp(meshRef.current.rotation.z, targetRotZ, 5.5, delta);

    meshRef.current.scale.setScalar(
      THREE.MathUtils.damp(meshRef.current.scale.x, targetScale, 6, delta)
    );
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
      }}
      onPointerOut={() => setHoveredCardId(null)}
      onClick={handleClick}
      cursor="pointer"
    >
      {/* Tranche de papier / carton */}
      <mesh position={[0, 0, -thickness / 2]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color={isHovered ? card.familyColor : "#f8fafc"}
          roughness={0.35}
          metalness={0.08}
        />
      </mesh>

      {/* Face Recto (illustration de la carte - TOUJOURS le recto illustré de la carte) */}
      <mesh position={[0, 0, thickness / 2 + 0.007]}>
        <planeGeometry args={[width * 0.985, height * 0.985]} />
        <meshBasicMaterial
          map={frontTexture}
          toneMapped={false}
        />
      </mesh>

      {/* Face Verso (dos officiel du jeu) */}
      <mesh position={[0, 0, -thickness / 2 - 0.007]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width * 0.985, height * 0.985]} />
        <meshBasicMaterial map={backTexture} toneMapped={false} />
      </mesh>

      {/* Titres flottants en 3D en mode Famille */}
      {currentStage === "family" && isCardInSelectedFamily && (
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
      {currentStage === "card" && !isTargetSelectedCard && isCardInSelectedFamily && (
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

export default function Unified3DScene(props: Unified3DSceneProps) {
  return (
    <div
      className="w-full h-full relative cursor-grab active:cursor-grabbing select-none touch-pan-y"
      role="region"
      aria-label="Scène 3D interactive des cartes et des familles de barrages"
    >
      <Canvas
        camera={{ position: [0, 0.15, 6.8], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ResponsiveController currentStage={props.currentStage} />
        <ambientLight intensity={1.7} color="#fffcf5" />
        <directionalLight position={[5, 10, 6]} intensity={1.8} color="#fffbf5" />
        <directionalLight position={[-5, -2, -3]} intensity={0.5} color="#e2e8f0" />
        <pointLight position={[0, 2, 5]} intensity={0.4} color="#fef3c7" />

        <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.12}>
          <group position={[0, 0, 0]}>
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
                      props.hoveredCardId?.startsWith(family.id) &&
                      cIdx === 0)
                  }
                  hoveredIndexInFamily={hoveredIndexInFamily}
                  hoveredFamilyIndex={hoveredFamilyIndex}
                  setHoveredCardId={props.setHoveredCardId}
                  isDeckSpread={props.isDeckSpread}
                  deckScrollOffset={props.deckScrollOffset}
                />
              ));
            })}
          </group>
        </Float>

        <ContactShadows
          position={[0, -1.9, 0]}
          opacity={0.22}
          scale={10}
          blur={2.4}
          far={4}
        />
      </Canvas>
    </div>
  );
}
