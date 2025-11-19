'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const FloatingGlobe = dynamic(() => import('@/components/FloatingGlobe'), {
  ssr: false,
  loading: () => null
});

interface GlobePosition {
  size: number;
  rotationSpeed: number;
  gridColor: string;
  glowColor: string;
  texturePath: string;
  initialX: number; // percentage
  initialY: number; // percentage
  moveX: number; // movement range in percentage
  moveY: number; // movement range in percentage
  duration: number; // animation duration in seconds
  exitDirection: { x: number; y: number }; // direction to exit when scrolling
}

const globePositions: GlobePosition[] = [
  {
    size: 500,
    rotationSpeed: 12,
    gridColor: "#ffffff",
    glowColor: "#ffffff",
    texturePath: "/2k_earth_daymap.jpg", // Earth
    initialX: 15,
    initialY: 20,
    moveX: 1,
    moveY: 1,
    duration: 8,
    exitDirection: { x: -150, y: -100 } // exit top-left
  },
  {
    size: 350,
    rotationSpeed: 18,
    gridColor: "#ffffff",
    glowColor: "#ffffff",
    texturePath: "/2k_jupiter.jpg", // Jupiter
    initialX: 75,
    initialY: 30,
    moveX: -1,
    moveY: 1,
    duration: 10,
    exitDirection: { x: 150, y: -100 } // exit top-right
  },
  {
    size: 450,
    rotationSpeed: 10,
    gridColor: "#ffffff",
    glowColor: "#ffffff",
    texturePath: "/2k_mars.jpg", // Mars
    initialX: 50,
    initialY: 70,
    moveX: 1,
    moveY: -1,
    duration: 12,
    exitDirection: { x: 0, y: 150 } // exit bottom-center
  },
  {
    size: 380,
    rotationSpeed: 20,
    gridColor: "#ffffff",
    glowColor: "#ffffff",
    texturePath: "/2k_mercury.jpg", // Mercury
    initialX: 25,
    initialY: 75,
    moveX: -1,
    moveY: 1,
    duration: 9,
    exitDirection: { x: -150, y: 100 } // exit bottom-left
  },
  {
    size: 420,
    rotationSpeed: 15,
    gridColor: "#ffffff",
    glowColor: "#ffffff",
    texturePath: "/2k_earth_clouds.jpg", // Earth with clouds
    initialX: 80,
    initialY: 70,
    moveX: 1,
    moveY: -1,
    duration: 11,
    exitDirection: { x: 150, y: 100 } // exit bottom-right
  }
];

export default function MultiGlobes() {
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Detect mobile screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      // Multi-globe section starts at 100vh (after intro section)
      const sectionStartScroll = viewportHeight * 1;
      const sectionHeight = viewportHeight * 4; // 400vh section
      
      const scrollY = window.scrollY;
      const scrollIntoSection = scrollY - sectionStartScroll;
      
      // Calculate progress: 0 at start, 1 at end of section
      const progress = Math.max(0, Math.min(1, scrollIntoSection / sectionHeight));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {globePositions.map((globe, index) => {
        // Calculate exit translation based on scroll progress
        const exitX = globe.exitDirection.x * scrollProgress;
        const exitY = globe.exitDirection.y * scrollProgress;
        const opacity = 1 - scrollProgress;
        
        // Scale down globe size for mobile (40% on mobile, 100% on desktop)
        const scaledSize = isMobile ? globe.size * 0.4 : globe.size;
        
        return (
          <div
            key={index}
            className="absolute"
            style={{
              left: `${globe.initialX}%`,
              top: `${globe.initialY}%`,
              transform: `translate(calc(-50% + ${exitX}vw), calc(-50% + ${exitY}vh))`,
              opacity: opacity,
              transition: 'transform 0.1s linear, opacity 0.1s linear',
            }}
          >
            <FloatingGlobe
              size={scaledSize}
              rotationSpeed={globe.rotationSpeed}
              gridColor={globe.gridColor}
              glowColor={globe.glowColor}
              texturePath={globe.texturePath}
            />
          </div>
        );
      })}
    </div>
  );
}

