import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
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
  setHoveredCardId: (id: string | null) => void;
  isDeckSpread: boolean;
  deckScrollOffset: number;
}) {
  const meshRef = useRef<THREE.Group>(null);

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
    s.quadraticCurveTo(x, y, x + r, y);
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

  const isCardInSelectedFamily = card.familyId === selectedFamilyId;
  const isTargetSelectedCard = card.id === selectedCardId;

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let targetRotZ = 0;
    let targetScale = 1;

    // --- 1. ÉTAPE DECK (Les 7 familles avec défilement fluide au survol gauche/droite) ---
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
        // Défilement horizontal fluide des 7 familles via deckScrollOffset
        // familyIndex varie de 0 à 6. Avec deckScrollOffset, on fait défiler le carrousel.
        const effectiveFamilyPos = (familyIndex - 3) + deckScrollOffset;
        const angleStep = 0.38;
        const angle = effectiveFamilyPos * angleStep;
        const arcRadius = 5.6;

        targetRotY = -angle * 0.72;
        targetRotX = -0.12;
        targetRotZ = -angle * 0.12 + jitter.rotZ;

        // La carte n°1 (indexInFamily = 0) est au-dessus du paquet de 6, orientée vers le joueur
        const stackOffset = (5 - indexInFamily) * 0.018;

        // Déplacement perpendiculaire à la face de la carte pour un empilement physique parfait
        targetX = Math.sin(angle) * arcRadius + Math.sin(targetRotY) * stackOffset + jitter.offsetX;
        targetZ = -Math.cos(angle) * (arcRadius * 0.42) + 2.0 + Math.cos(targetRotY) * stackOffset;
        targetY = Math.cos(effectiveFamilyPos * 0.25) * 0.2 + jitter.offsetY;

        if (isHovered) {
          targetY += 0.35;
          targetZ += 0.35;
          targetScale = 1.06;
        }
      }
    }
    // --- 2. ÉTAPE FAMILLE (Éventail de joueur complet avec les 6 cartes déployées) ---
    else if (currentStage === "family") {
      if (isCardInSelectedFamily) {
        // Authentique éventail de joueur de cartes pivoté depuis le bas
        const centerOffset = indexInFamily - 2.5; // -2.5, -1.5, -0.5, 0.5, 1.5, 2.5
        const fanAngle = centerOffset * 0.11; // ~ -16° à +16°

        const fanRadius = 5.2;
        targetX = Math.sin(fanAngle) * fanRadius;
        targetY = -Math.cos(fanAngle) * fanRadius + 4.1;
        targetZ = indexInFamily * 0.06 + 0.8;
        targetScale = 0.82;

        targetRotZ = -fanAngle; // Orientation naturelle en main
        targetRotY = -fanAngle * 0.32;
        targetRotX = isHovered ? -0.02 : -0.14;

        if (isHovered) {
          targetY += 0.38;
          targetZ += 0.35;
          targetScale = 0.94;
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
        targetY = 0.15;
        targetZ = 2.4;
        targetScale = 0.86;

        // Retournement à 180°
        targetRotY = isFlipped ? Math.PI : 0;

        // Réaction interactive au curseur / gyroscope
        const mouseX = state.pointer.x * 0.15;
        const mouseY = state.pointer.y * 0.15;
        targetRotX = -mouseY;
        targetRotZ = -mouseX * 0.4;
      } else if (isCardInSelectedFamily) {
        // Les 5 autres cartes forment un éventail visible en arrière-plan pour naviguer
        const centerOffset = indexInFamily - 2.5; // -2.5 à +2.5
        const fanAngle = centerOffset * 0.22;

        const fanRadius = 5.8;
        targetX = Math.sin(fanAngle) * fanRadius;
        targetY = -Math.cos(fanAngle) * fanRadius + 4.9;
        targetZ = 0.15 + (5 - Math.abs(centerOffset)) * 0.05;
        targetScale = 0.68;

        targetRotZ = -fanAngle;
        targetRotY = -fanAngle * 0.35;
        targetRotX = -0.12;

        if (isHovered) {
          targetY += 0.32;
          targetZ += 0.5;
          targetScale = 0.78;
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
        onSelectCard(card.id);
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
            color={isHovered ? "#38bdf8" : "#ffffff"}
            anchorX="center"
            anchorY="top"
            maxWidth={1.5}
            textAlign="center"
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
            color={isHovered ? "#38bdf8" : "#94a3b8"}
            anchorX="center"
            anchorY="top"
            maxWidth={1.4}
            textAlign="center"
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
            color={isHovered ? "#38bdf8" : "#ffffff"}
            anchorX="center"
            anchorY="top"
            maxWidth={2}
            textAlign="center"
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
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        camera={{ position: [0, 0.15, 6.8], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[4, 8, 5]} intensity={1.6} />
        <directionalLight position={[-4, -3, -2]} intensity={0.6} />
        <pointLight position={[0, 1.5, 4]} intensity={0.9} color="#38bdf8" />

        <Float speed={1.1} rotationIntensity={0.06} floatIntensity={0.12}>
          <group position={[0, 0, 0]}>
            {FAMILIES.map((family, fIdx) => {
              const famCards = CARDS.filter((c) => c.familyId === family.id);
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
                      props.hoveredCardId?.startsWith(family.id))
                  }
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
          opacity={0.4}
          scale={10}
          blur={2.4}
          far={4}
        />
      </Canvas>
    </div>
  );
}
