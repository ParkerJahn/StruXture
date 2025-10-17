'use client';
import dynamic from 'next/dynamic';

// Lazy load client components for optimal loading speed
const Particles = dynamic(() => import('@/components/Particles'), {
  ssr: false,
  loading: () => <div className="h-screen w-screen bg-black" />
});

export default function Scene() {
  return (
    <>
      {/* Particles Background - Fixed Position - Client Side Only */}
      <div 
        className="fixed inset-0 w-screen h-screen z-0 pointer-events-none"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      >
        <Particles
          particleColors={['#ffffff', '#ffffff']}
          particleCount={800}
          particleSpread={10}
          speed={0.05}
          particleBaseSize={120}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
    </>
  );
}

