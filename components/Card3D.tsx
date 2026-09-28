import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

interface CardMeshProps {
  frontUrl: string;
  backUrl: string;
  isFlipped: boolean;
  onFlipToggle?: () => void;
  scale?: number;
}

function CardModel({ frontUrl, backUrl, isFlipped, onFlipToggle, scale = 1 }: CardMeshProps) {
  const meshRef = useRef<THREE.Group>(null);
  const targetRotationY = useRef(0);

  // Charger les textures
  const [frontTexture, backTexture] = useTexture([frontUrl, backUrl]);
  frontTexture.colorSpace = THREE.SRGBColorSpace;
  backTexture.colorSpace = THREE.SRGBColorSpace;

  // Création d'une forme géométrique aux coins arrondis (ratio 7.0 x 10.0 cm)
  const width = 2.4 * scale;
  const height = 3.42 * scale; // Ratio 1.428 correspondant au format 70x100mm
  const radius = 0.12 * scale;
  const thickness = 0.022 * scale;

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
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.012 * scale,
      bevelThickness: 0.008 * scale,
    }),
    [thickness, scale]
  );

  // Animation douce du retournement
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    targetRotationY.current = isFlipped ? Math.PI : 0;
    meshRef.current.rotation.y = THREE.MathUtils.damp(
      meshRef.current.rotation.y,
      targetRotationY.current,
      7,
      delta
    );

    // Légère ondulation interactive avec le gyroscope / curseur
    const mouseX = state.pointer.x * 0.18;
    const mouseY = state.pointer.y * 0.18;
    meshRef.current.rotation.x = THREE.MathUtils.damp(
      meshRef.current.rotation.x,
      -mouseY,
      4,
      delta
    );
    meshRef.current.rotation.z = THREE.MathUtils.damp(
      meshRef.current.rotation.z,
      -mouseX * 0.5,
      4,
      delta
    );
  });

  return (
    <group ref={meshRef} onClick={onFlipToggle}>
      {/* Tranche blanche / carton de la carte */}
      <mesh position={[0, 0, -thickness / 2]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial color="#f7fafc" roughness={0.4} metalness={0.05} />
      </mesh>

      {/* Face Recto */}
      <mesh position={[0, 0, thickness / 2 + 0.009]}>
        <planeGeometry args={[width * 0.98, height * 0.98]} />
        <meshBasicMaterial map={frontTexture} toneMapped={false} />
      </mesh>

      {/* Face Verso (inversée à 180°) */}
      <mesh position={[0, 0, -thickness / 2 - 0.009]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width * 0.98, height * 0.98]} />
        <meshBasicMaterial map={backTexture} toneMapped={false} />
      </mesh>
    </group>
  );
}

interface Card3DViewerProps {
  frontUrl: string;
  backUrl: string;
  isFlipped: boolean;
  onFlipToggle?: () => void;
  scale?: number;
}

export default function Card3DViewer(props: Card3DViewerProps) {
  return (
    <div className="w-full h-full relative cursor-pointer select-none">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.4} />
        <directionalLight position={[4, 5, 6]} intensity={1.2} />
        <directionalLight position={[-4, -3, -4]} intensity={0.5} />
        <Float speed={2} rotationIntensity={0.25} floatIntensity={0.4}>
          <React.Suspense fallback={null}>
            <CardModel {...props} />
          </React.Suspense>
        </Float>
        <ContactShadows
          position={[0, -2.1, 0]}
          opacity={0.35}
          scale={5}
          blur={2.4}
          far={4}
        />
      </Canvas>
    </div>
  );
}
