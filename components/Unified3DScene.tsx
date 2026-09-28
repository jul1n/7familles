import React, { useRef, useMemo } from "react";
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
}

// Composant d'une carte unique (réutilisée pour les 42 cartes dans une seule scène)
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

  // Forme de la carte aux coins arrondis
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
    const seed = familyIndex * 17 + indexInFamily * 23;
    return {
      rotZ: Math.sin(seed) * 0.04,
      offsetX: Math.cos(seed * 1.5) * 0.02,
      offsetY: Math.sin(seed * 2.1) * 0.018,
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

    // --- 1. ÉTAPE DECK (Toutes les 7 familles visibles) ---
    if (currentStage === "deck") {
      if (!isDeckSpread) {
        // Paquet unique compact
        const globalZ = (familyIndex - 3) * (6 * 0.016) + indexInFamily * 0.016;
        targetX = jitter.offsetX;
        targetY = jitter.offsetY;
        targetZ = globalZ;
        targetRotX = -0.55;
        targetRotY = 0.45;
        targetRotZ = jitter.rotZ;
      } else {
        // Éventail des 7 familles
        const angleStep = 0.34;
        const angle = (familyIndex - 3) * angleStep;
        const arcRadius = 5.2;

        targetX = Math.sin(angle) * arcRadius + jitter.offsetX;
        targetZ = -Math.cos(angle) * (arcRadius * 0.45) + 1.8 + indexInFamily * 0.016;
        targetY = Math.cos((familyIndex - 3) * 0.35) * 0.22 + jitter.offsetY;

        targetRotY = -angle * 0.75;
        targetRotX = -0.12;
        targetRotZ = -angle * 0.15 + jitter.rotZ;

        if (isHovered) {
          targetY += 0.35;
          targetZ += 0.3;
          targetScale = 1.06;
        }
      }
    }
    // --- 2. ÉTAPE FAMILLE (Éventail de joueur complet avec les 6 cartes) ---
    else if (currentStage === "family") {
      if (isCardInSelectedFamily) {
        // Authentique éventail de joueur de cartes (pivoté en éventail depuis la base)
        const centerOffset = indexInFamily - 2.5; // -2.5, -1.5, -0.5, 0.5, 1.5, 2.5
        const fanAngle = centerOffset * 0.11; // Éventail angulaire naturel (~ -16° à +16°)

        // Rayon de l'éventail de cartes tenu en main
        const fanRadius = 5.2;
        targetX = Math.sin(fanAngle) * fanRadius;
        targetY = -Math.cos(fanAngle) * fanRadius + 4.1;
        targetZ = indexInFamily * 0.05 + 0.8;
        targetScale = 0.82;

        targetRotZ = -fanAngle; // Inclinaison angulaire comme tenu en main
        targetRotY = -fanAngle * 0.35;
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
    // --- 3. ÉTAPE CARTE INDIVIDUELLE (Carte active au centre + éventail de joueur complet visible en arrière-plan) ---
    else if (currentStage === "card") {
      if (isTargetSelectedCard) {
        // La carte choisie se détache vers l'avant, centrée et parfaitement cadrée
        targetX = 0;
        targetY = 0.15;
        targetZ = 2.4;
        targetScale = 0.86;

        // Retournement à 180°
        targetRotY = isFlipped ? Math.PI : 0;

        // Légère réaction interactive au curseur / gyroscope
        const mouseX = state.pointer.x * 0.15;
        const mouseY = state.pointer.y * 0.15;
        targetRotX = -mouseY;
        targetRotZ = -mouseX * 0.4;
      } else if (isCardInSelectedFamily) {
        // LES 5 AUTRES CARTES FORMENT UN ÉVENTAIL DE JOUEUR LISIBLE DERRIÈRE LA CARTE
        const centerOffset = indexInFamily - 2.5; // -2.5 à +2.5
        const fanAngle = centerOffset * 0.15; // Éventail plus ouvert pour voir l'index et le coin de chaque carte

        const fanRadius = 6.0;
        targetX = Math.sin(fanAngle) * fanRadius;
        targetY = -Math.cos(fanAngle) * fanRadius + 4.5;
        targetZ = -1.2 + indexInFamily * 0.04;
        targetScale = 0.62;

        targetRotZ = -fanAngle; // Orientation en éventail de joueur
        targetRotY = -fanAngle * 0.4;
        targetRotX = -0.15;
      } else {
        // Les autres familles sont repoussées hors champ
        targetZ = -6;
        targetScale = 0.15;
      }
    }

    // Amortissement Three.js (damp) pour une transition physique continue
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

  // Afficher le recto ou le verso selon la carte
  const showFront =
    currentStage === "card" ||
    (currentStage === "family" && isCardInSelectedFamily) ||
    (currentStage === "deck" && indexInFamily === 5); // carte 1 du dessus en mode deck

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
      {/* Tranche de papier / carton de la carte */}
      <mesh position={[0, 0, -thickness / 2]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color={isHovered ? card.familyColor : "#f8fafc"}
          roughness={0.35}
          metalness={0.08}
        />
      </mesh>

      {/* Face Recto (illustration de la carte) */}
      <mesh position={[0, 0, thickness / 2 + 0.007]}>
        <planeGeometry args={[width * 0.985, height * 0.985]} />
        <meshBasicMaterial
          map={showFront ? frontTexture : backTexture}
          toneMapped={false}
        />
      </mesh>

      {/* Face Verso (dos du jeu ou dos de la carte en mode consultation) */}
      <mesh position={[0, 0, -thickness / 2 - 0.007]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width * 0.985, height * 0.985]} />
        <meshBasicMaterial map={backTexture} toneMapped={false} />
      </mesh>

      {/* Titres flottants en 3D */}
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

      {currentStage === "deck" && isDeckSpread && indexInFamily === 5 && (
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
