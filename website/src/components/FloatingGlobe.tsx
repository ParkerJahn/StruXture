'use client';
import dynamic from 'next/dynamic';

// Dynamically import PlanetGlobe with no SSR
const PlanetGlobe = dynamic(() => import('./PlanetGlobe'), {
  ssr: false,
  loading: () => null
});

interface FloatingGlobeProps {
  size?: number;
  rotationSpeed?: number;
  gridColor?: string;
  glowColor?: string;
  texturePath?: string;
}

export default function FloatingGlobe({
  size = 300,
  rotationSpeed = 20,
  gridColor = '#00ffff',
  glowColor = '#00ffff',
  texturePath = '/2k_earth_daymap.jpg'
}: FloatingGlobeProps) {
  return (
    <PlanetGlobe
      size={size}
      rotationSpeed={rotationSpeed}
      tintColor={gridColor}
      glowColor={glowColor}
      texturePath={texturePath}
    />
  );
}

