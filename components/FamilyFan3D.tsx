import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, Float, ContactShadows, Text } from "@react-three/drei";
import * as THREE from "three";
import { CardData, FamilyData } from "@/data/cards";

interface FamilyFan3DProps {
  cards: CardData[];
  family: FamilyData;
  onSelectCard: (cardId: string) => void;
}

function FanCardItem({
  card,
  index,
  total,
  onSelectCard,
  hoveredCardId,
  setHoveredCardId,
  spreadProgress,
}: {
  card: CardData;
  index: number;
  total: number;
  onSelectCard: (id: string) => void;
  hoveredCardId: string | null;
  setHoveredCardId: (id: string | null) => void;
  spreadProgress: number; // 0 (pile empilée) -> 1 (déployé en éventail)
}) {
  const meshRef = useRef<THREE.Group>(null);
  const isHovered = hoveredCardId === card.id;

  const [frontTexture, backTexture] = useTexture([card.frontImage, card.backImage]);
  frontTexture.colorSpace = THREE.SRGBColorSpace;
  backTexture.colorSpace = THREE.SRGBColorSpace;

  const width = 1.6;
  const height = 2.28;
  const radius = 0.08;
  const thickness = 0.016;

  const shape = React.useMemo(() => {
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

  const extrudeSettings = React.useMemo(
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

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Déploiement en bel éventail / arc horizontal devant l'utilisateur
    const centerOffset = index - (total - 1) / 2; // de -2.5 à +2.5 pour 6 cartes

    // Position initiale empilée (progress = 0) vs déployée (progress = 1)
    const targetX = centerOffset * 1.55 * spreadProgress;
    const targetZ = -Math.abs(centerOffset) * 0.18 * spreadProgress + index * 0.02 * (1 - spreadProgress);
    const targetY = -Math.pow(centerOffset, 2) * 0.04 * spreadProgress + (isHovered ? 0.35 : 0);

    const targetRotZ = -centerOffset * 0.07 * spreadProgress;
    const targetRotY = -centerOffset * 0.04 * spreadProgress;
    const targetRotX = isHovered ? -0.05 : -0.12;

    const targetScale = isHovered ? 1.12 : 1;

    meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, targetX, 5, delta);
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, 5, delta);
    meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, targetZ, 5, delta);

    meshRef.current.rotation.x = THREE.MathUtils.damp(meshRef.current.rotation.x, targetRotX, 5, delta);
    meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, targetRotY, 5, delta);
    meshRef.current.rotation.z = THREE.MathUtils.damp(meshRef.current.rotation.z, targetRotZ, 5, delta);

    meshRef.current.scale.setScalar(
      THREE.MathUtils.damp(meshRef.current.scale.x, targetScale, 6, delta)
    );
  });

  return (
    <group
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredCardId(card.id);
      }}
      onPointerOut={() => setHoveredCardId(null)}
      onClick={(e) => {
        e.stopPropagation();
        onSelectCard(card.id);
      }}
      cursor="pointer"
    >
      {/* Bordure / Tranche de carte */}
      <mesh position={[0, 0, -thickness / 2]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color={isHovered ? card.familyColor : "#f8fafc"}
          roughness={0.35}
          metalness={0.08}
        />
      </mesh>

      {/* Face Recto illustrée */}
      <mesh position={[0, 0, thickness / 2 + 0.007]}>
        <planeGeometry args={[width * 0.985, height * 0.985]} />
        <meshBasicMaterial map={frontTexture} toneMapped={false} />
      </mesh>

      {/* Titre et numéro flottants sous chaque carte */}
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
    </group>
  );
}

export default function FamilyFan3D({ cards, family, onSelectCard }: FamilyFan3DProps) {
  const [spreadProgress, setSpreadProgress] = useState(0);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Animation fluide de déploiement à l'arrivée sur la page
  useEffect(() => {
    setSpreadProgress(0);
    const timer = setTimeout(() => {
      setSpreadProgress(1);
    }, 80);
    return () => clearTimeout(timer);
  }, [family.id]);

  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
      <Canvas
        camera={{ position: [0, 0.2, 5.8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[4, 8, 5]} intensity={1.6} />
        <directionalLight position={[-4, -3, -2]} intensity={0.6} />
        <pointLight position={[0, 1.5, 4]} intensity={0.9} color="#38bdf8" />

        <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.15}>
          <group position={[0, 0, 0]}>
            {cards.map((card, idx) => (
              <FanCardItem
                key={card.id}
                card={card}
                index={idx}
                total={cards.length}
                onSelectCard={onSelectCard}
                hoveredCardId={hoveredCardId}
                setHoveredCardId={setHoveredCardId}
                spreadProgress={spreadProgress}
              />
            ))}
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
