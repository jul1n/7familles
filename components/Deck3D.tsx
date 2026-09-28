import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, Float, ContactShadows, Text } from "@react-three/drei";
import * as THREE from "three";
import { FAMILIES, CARDS } from "@/data/cards";

interface Deck3DProps {
  onSelectFamily: (familyId: string) => void;
  hoveredFamily: string | null;
  setHoveredFamily: (id: string | null) => void;
  isSpread: boolean;
}

// Récupère l'image de la 1ère carte pour chaque famille
const FIRST_CARDS: Record<string, string> = {};
FAMILIES.forEach((fam) => {
  const card1 = CARDS.find((c) => c.familyId === fam.id && c.num === 1);
  FIRST_CARDS[fam.id] = card1 ? card1.frontImage : "/cards/card-back.webp";
});

// Pile 3D d'une famille entière (6 cartes superposées avec désordre et épaisseur)
function FamilyStack3D({
  family,
  familyIndex,
  isSpread,
  isHovered,
  onSelectFamily,
  setHoveredFamily,
}: {
  family: (typeof FAMILIES)[0];
  familyIndex: number;
  isSpread: boolean;
  isHovered: boolean;
  onSelectFamily: (id: string) => void;
  setHoveredFamily: (id: string | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Textures : la première carte affiche son RECTO illustré, le dos de carte sert pour les cartes en dessous
  const [frontTexture, backTexture] = useTexture([
    FIRST_CARDS[family.id],
    "/cards/card-back.webp",
  ]);
  frontTexture.colorSpace = THREE.SRGBColorSpace;
  backTexture.colorSpace = THREE.SRGBColorSpace;

  const width = 1.7;
  const height = 2.42;
  const radius = 0.085;
  const singleThickness = 0.016;

  // Forme de carte aux coins arrondis
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
      depth: singleThickness,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.007,
      bevelThickness: 0.005,
    }),
    [singleThickness]
  );

  // Désordre naturel figé et pseudo-aléatoire propre à chaque carte du paquet de 6
  const jitterArray = React.useMemo(() => {
    return [0, 1, 2, 3, 4, 5].map((idx) => {
      const seed = familyIndex * 17 + idx * 23;
      const rotZ = Math.sin(seed) * 0.045; // petite rotation désordonnée
      const offsetX = Math.cos(seed * 1.5) * 0.025; // petit décalage x
      const offsetY = Math.sin(seed * 2.1) * 0.02; // petit décalage y
      return { rotZ, offsetX, offsetY };
    });
  }, [familyIndex]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let targetRotZ = 0;
    let targetScale = 1;

    if (!isSpread) {
      // 1. MODE PAQUET UNIQUE RASSEMBLÉ
      // Les 7 familles sont empilées les unes sur les autres dans un gros deck compact
      const stackZ = (familyIndex - 3) * (6 * 0.016);
      targetX = 0;
      targetY = 0;
      targetZ = stackZ;
      targetRotX = -0.55;
      targetRotY = 0.45;
      targetRotZ = (familyIndex - 3) * 0.015;
    } else {
      // 2. MODE ÉVENTAIL 3D (Disposition élégante en arc de cercle face caméra)
      const angleStep = 0.34;
      const angle = (familyIndex - 3) * angleStep;
      const arcRadius = 5.2;

      targetX = Math.sin(angle) * arcRadius;
      targetZ = -Math.cos(angle) * (arcRadius * 0.45) + 1.8;
      targetY = Math.cos((familyIndex - 3) * 0.35) * 0.22;

      // Rotation orientée naturellement vers la caméra pour une excellente lisibilité
      targetRotY = -angle * 0.75;
      targetRotX = -0.12;
      targetRotZ = -angle * 0.15;

      if (isHovered) {
        targetY += 0.4;
        targetZ += 0.35;
        targetScale = 1.08;
      }
    }

    // Amorti Three.js très doux
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 5.5, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 5.5, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetZ, 5.5, delta);

    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 5.5, delta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 5.5, delta);
    groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, targetRotZ, 5.5, delta);

    groupRef.current.scale.setScalar(
      THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 6, delta)
    );
  });

  return (
    <group
      ref={groupRef}
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
      {/* Empilement des 6 cartes de la famille */}
      {[0, 1, 2, 3, 4, 5].map((cardIdx) => {
        const isTopCard = cardIdx === 5;
        const zPos = cardIdx * singleThickness;
        const jitter = jitterArray[cardIdx];

        return (
          <group
            key={cardIdx}
            position={[jitter.offsetX, jitter.offsetY, zPos]}
            rotation={[0, 0, jitter.rotZ]}
          >
            {/* Tranche de carton de la carte */}
            <mesh position={[0, 0, -singleThickness / 2]}>
              <extrudeGeometry args={[shape, extrudeSettings]} />
              <meshStandardMaterial
                color={isTopCard && isHovered ? family.color : "#f8fafc"}
                roughness={0.35}
                metalness={0.05}
              />
            </mesh>

            {/* La carte supérieure (carte 1) montre son RECTO avec l'illustration ! */}
            {isTopCard ? (
              <mesh position={[0, 0, singleThickness / 2 + 0.006]}>
                <planeGeometry args={[width * 0.985, height * 0.985]} />
                <meshBasicMaterial map={frontTexture} toneMapped={false} />
              </mesh>
            ) : (
              /* Les cartes du dessous montrent le dos ou la tranche */
              <mesh position={[0, 0, -singleThickness / 2 - 0.006]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[width * 0.985, height * 0.985]} />
                <meshBasicMaterial map={backTexture} toneMapped={false} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Titre et badge de la famille sous le paquet */}
      {isSpread && (
        <group position={[0, -height / 2 - 0.28, 0.06]}>
          <Text
            fontSize={0.15}
            color={isHovered ? "#38bdf8" : "#ffffff"}
            anchorX="center"
            anchorY="top"
            maxWidth={2.2}
            textAlign="center"
          >
            {family.name}
          </Text>
          <Text
            position={[0, -0.2, 0]}
            fontSize={0.095}
            color={isHovered ? family.color : "#94a3b8"}
            anchorX="center"
            anchorY="top"
          >
            6 CARTES
          </Text>
        </group>
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
        camera={{ position: [0, 0.3, 6.0], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[4, 8, 5]} intensity={1.5} />
        <directionalLight position={[-4, -3, -2]} intensity={0.6} />
        <pointLight position={[0, 1.5, 4]} intensity={0.9} color="#38bdf8" />

        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
          <group position={[0, -0.15, 0]}>
            {FAMILIES.map((family, fIdx) => (
              <FamilyStack3D
                key={family.id}
                family={family}
                familyIndex={fIdx}
                isSpread={isSpread}
                isHovered={hoveredFamily === family.id}
                onSelectFamily={onSelectFamily}
                setHoveredFamily={setHoveredFamily}
              />
            ))}
          </group>
        </Float>

        <ContactShadows
          position={[0, -2.1, 0]}
          opacity={0.45}
          scale={9}
          blur={2.5}
          far={5}
        />
      </Canvas>
    </div>
  );
}
