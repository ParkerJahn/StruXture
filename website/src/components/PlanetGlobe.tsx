'use client';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import * as THREE from 'three';

interface PlanetProps {
  texturePath: string;
  rotationSpeed: number;
  tintColor: string;
}

function Planet({ texturePath, rotationSpeed, tintColor }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Load the texture
  const texture = useLoader(TextureLoader, texturePath);

  // Convert hex color to THREE.Color and apply tinting
  const planetColor = useMemo(() => new THREE.Color(tintColor), [tintColor]);

  // Rotate the planet
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += (rotationSpeed / 100) * 0.01;
    }
  });

  return (
    <group>
      {/* Main Planet Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          color={planetColor}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}

interface PlanetGlobeProps {
  size?: number;
  rotationSpeed?: number;
  texturePath: string;
  tintColor?: string;
  glowColor?: string;
}

export default function PlanetGlobe({
  size = 300,
  rotationSpeed = 20,
  texturePath,
  tintColor = '#ffffff',
  glowColor = '#ffffff'
}: PlanetGlobeProps) {
  return (
    <>
      <div 
        className="relative"
        style={{
          width: size,
          height: size,
          filter: `drop-shadow(0 0 50px ${glowColor}80)`,
          background: 'transparent',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden' as const,
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 10], fov: 45 }}
          style={{ background: 'transparent' }}
          gl={{ 
            alpha: true, 
            antialias: true,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: false,
          }}
          frameloop="always"
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 3, 5]} intensity={1.5} />
          <directionalLight position={[-5, -3, -5]} intensity={0.5} />
          <Planet
            texturePath={texturePath}
            rotationSpeed={rotationSpeed}
            tintColor={tintColor}
          />
        </Canvas>
      </div>
    </>
  );
}

