import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, Float, ContactShadows, Text } from "@react-three/drei";
import * as THREE from "three";
import { FAMILIES } from "@/data/cards";

interface Deck3DProps {
  onSelectFamily: (familyId: string) => void;
  hoveredFamily: string | null;
  setHoveredFamily: (id: string | null) => void;
  isSpread: boolean;
}

// Composant d'une carte individuelle dans le deck 3D
function DeckCardItem({
  familyIndex,
  cardIndexInFamily,
  family,
  isSpread,
  onSelectFamily,
  isHovered,
  setHoveredFamily,
}: {
  familyIndex: number;
  cardIndexInFamily: number;
  family: (typeof FAMILIES)[0];
  isSpread: boolean;
  onSelectFamily: (id: string) => void;
  isHovered: boolean;
  setHoveredFamily: (id: string | null) => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const backTexture = useTexture("/cards/card-back.webp");
  backTexture.colorSpace = THREE.SRGBColorSpace;

  const width = 1.8;
  const height = 2.56;
  const radius = 0.09;
  const thickness = 0.015;

  // Géométrie arrondie physique
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
      bevelSize: 0.008,
      bevelThickness: 0.006,
    }),
    [thickness]
  );

  // Position cible dynamique
  const totalCards = 42;
  const globalIndex = familyIndex * 6 + cardIndexInFamily;

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let targetRotZ = 0;

    if (!isSpread) {
      // 1. ÉTAT PILE / DECK COMPACT (Vue Deck 3D groupé)
      // Légère désynchronisation naturelle de chaque carte comme un vrai paquet
      const jitterZ = (globalIndex - totalCards / 2) * 0.018;
      const jitterRotZ = Math.sin(globalIndex * 0.8) * 0.015;
      const jitterX = Math.cos(globalIndex * 1.2) * 0.02;

      targetX = jitterX;
      targetY = -0.1;
      targetZ = jitterZ;
      targetRotX = -0.55 + Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
      targetRotY = 0.45 + Math.cos(state.clock.elapsedTime * 0.6) * 0.04;
      targetRotZ = jitterRotZ;
    } else {
      // 2. ÉTAT ÉVENTAIL DES 7 FAMILLES (Arc en cercle 3D ultra moderne)
      const angleStep = (Math.PI * 0.72) / 6;
      const angle = (familyIndex - 3) * angleStep;
      const radiusArc = 3.6;

      const subOffset = (cardIndexInFamily - 2.5) * 0.02;

      targetX = Math.sin(angle) * radiusArc;
      targetZ = -Math.cos(angle) * (radiusArc * 0.5) + 1.2 + subOffset;
      targetY = Math.cos((familyIndex - 3) * 0.4) * 0.35 + (isHovered ? 0.35 : 0);

      targetRotY = -angle * 0.85;
      targetRotX = -0.15;
      targetRotZ = -angle * 0.25;
    }

    // Amorti fluide Three.js (damp)
    meshRef.current.position.x = THREE.MathUtils.damp(meshRef.current.position.x, targetX, 5, delta);
    meshRef.current.position.y = THREE.MathUtils.damp(meshRef.current.position.y, targetY, 5, delta);
    meshRef.current.position.z = THREE.MathUtils.damp(meshRef.current.position.z, targetZ, 5, delta);

    meshRef.current.rotation.x = THREE.MathUtils.damp(meshRef.current.rotation.x, targetRotX, 5, delta);
    meshRef.current.rotation.y = THREE.MathUtils.damp(meshRef.current.rotation.y, targetRotY, 5, delta);
    meshRef.current.rotation.z = THREE.MathUtils.damp(meshRef.current.rotation.z, targetRotZ, 5, delta);
  });

  return (
    <group
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredFamily(family.id);
      }}
      onPointerOut={() => setHoveredFamily(null)}
      onClick={(e) => {
        e.stopPropagation();
        onSelectFamily(family.id);
      }}
      cursor="pointer"
    >
      {/* Corps & tranches */}
      <mesh position={[0, 0, -thickness / 2]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color={isHovered ? family.color : "#edf2f7"}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Texture Dos de carte haute définition */}
      <mesh position={[0, 0, -thickness / 2 - 0.007]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width * 0.98, height * 0.98]} />
        <meshBasicMaterial map={backTexture} toneMapped={false} />
      </mesh>

      {/* Bordure lumineuse sur la carte de dessus de chaque famille */}
      {cardIndexInFamily === 5 && isSpread && (
        <Text
          position={[0, -height / 2 - 0.22, 0]}
          fontSize={0.14}
          color={isHovered ? "#38bdf8" : "#ffffff"}
          anchorX="center"
          anchorY="top"
          maxWidth={1.8}
          textAlign="center"
        >
          {family.name.toUpperCase()}
        </Text>
      )}
    </group>
  );
}

export default function Deck3DScene({
  onSelectFamily,
  hoveredFamily,
  setHoveredFamily,
  isSpread,
}: Deck3DProps) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0.4, 5.4], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 8, 5]} intensity={1.6} />
        <directionalLight position={[-5, -4, -3]} intensity={0.6} />
        <pointLight position={[0, 2, 3]} intensity={0.8} color="#38bdf8" />

        <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.25}>
          <group position={[0, 0, 0]}>
            {FAMILIES.map((family, fIdx) => (
              <React.Fragment key={family.id}>
                {[0, 1, 2, 3, 4, 5].map((cIdx) => (
                  <DeckCardItem
                    key={`${family.id}-${cIdx}`}
                    familyIndex={fIdx}
                    cardIndexInFamily={cIdx}
                    family={family}
                    isSpread={isSpread}
                    onSelectFamily={onSelectFamily}
                    isHovered={hoveredFamily === family.id}
                    setHoveredFamily={setHoveredFamily}
                  />
                ))}
              </React.Fragment>
            ))}
          </group>
        </Float>

        <ContactShadows
          position={[0, -1.8, 0]}
          opacity={0.4}
          scale={7}
          blur={2.5}
          far={4}
        />
      </Canvas>
    </div>
  );
}
