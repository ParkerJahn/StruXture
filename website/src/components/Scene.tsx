'use client';
import dynamic from 'next/dynamic';

// Lazy load client components for optimal loading speed
const Particles = dynamic(() => import('@/components/Particles'), {
  ssr: false,
  loading: () => <div className="h-screen w-screen bg-black" />
});

const FloatingGlobe = dynamic(() => import('@/components/FloatingGlobe'), {
  ssr: false,
  loading: () => null
});

export default function Scene() {
  return (
    <>
      {/* Particles Background - Client Side Only */}
      <Particles
        particleColors={['#ffffff', '#ffffff']}
        particleCount={800}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        alphaParticles={false}
        disableRotation={false}
      />

      {/* Floating Globe - Centered - Client Side Only */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <FloatingGlobe 
          size={800}
          rotationSpeed={15}
          gridColor="#00ffff"
          glowColor="#00ffff"
        />
      </div>
    </>
  );
}

