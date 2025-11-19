'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const FloatingGlobe = dynamic(() => import('@/components/FloatingGlobe'), {
  ssr: false,
  loading: () => null
});


export interface GlobeConfig {
  size: number;
  rotationSpeed: number;
  gridColor: string;
  glowColor: string;
  texturePath?: string;
  name: string;
  title: string;
  subtitle: string;
}

interface ScrollingGlobesProps {
  globes: GlobeConfig[];
  scrollPeriod?: number; // viewport heights per globe transition
  scrollStartOffset?: number; // viewport heights to subtract from scroll
  pauseStart?: number; // where the pause zone starts (0-1)
  pauseEnd?: number; // where the pause zone ends (0-1)
  pauseMovement?: number; // how much to move during pause (0-1)
}

export default function ScrollingGlobes({
  globes,
  scrollPeriod = 0.5,
  scrollStartOffset = 1,
  pauseStart = 0.2,
  pauseEnd = 0.9,
  pauseMovement = 1,
}: ScrollingGlobesProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    let rafId: number | null = null;
    let latestScrollY = window.scrollY;

    const handleScroll = () => {
      latestScrollY = window.scrollY;
      
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          setScrollY(latestScrollY);
          rafId = null;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Easing function that slows down in the middle and pauses at center
  const easeWithPause = (t: number): number => {
    const pauseZoneSize = pauseEnd - pauseStart;
    
    if (t < pauseStart) {
      // Before pause: ease in (slow start, speed up)
      const normalizedT = t / pauseStart;
      return pauseStart * (normalizedT * normalizedT);
    } else if (t <= pauseEnd) {
      // In pause zone: controlled movement
      const normalizedT = (t - pauseStart) / pauseZoneSize;
      return pauseStart + (normalizedT * pauseMovement);
    } else {
      // After pause: ease out (start slow, speed up)
      const normalizedT = (t - pauseEnd) / (1 - pauseEnd);
      const remaining = 1 - (pauseStart + pauseMovement);
      return pauseStart + pauseMovement + remaining * (normalizedT * normalizedT);
    }
  };

  // Calculate which globe section we're in
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 1000;
  const scrollProgress = (scrollY - (viewportHeight * scrollStartOffset)) / (viewportHeight * scrollPeriod);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex items-center justify-center">
      {globes.map((globe, index) => {
        // Calculate progress for this globe's transition
        // Each globe is "active" for 1 viewport height of scrolling
        const rawGlobeProgress = scrollProgress - index;
        
        // Apply easing with pause
        let globeProgress = rawGlobeProgress;
        if (rawGlobeProgress >= 0 && rawGlobeProgress <= 1) {
          globeProgress = easeWithPause(rawGlobeProgress);
        }
        
        // Progress from 0 to 1:
        // 0 = globe is off-screen right
        // 0.5 = globe is centered (and paused)
        // 1 = globe is off-screen left
        
        // Calculate horizontal position
        // Start from right (100vw), move to center (0), then to left (-100vw)
        let translateX = 0;
        let scale = 0;
        let opacity = 0;
        
        if (rawGlobeProgress < 0) {
          // Globe is waiting to enter from the right - completely hidden
          translateX = 100;
          scale = 1;
          opacity = 0;
        } else if (rawGlobeProgress <= 1) {
          // Globe is transitioning across the screen
          translateX = 100 - (globeProgress * 200); // 100 to -100
          
          // Keep scale constant at 1.0 - no scaling animation
          scale = 1;
          
          // Opacity: very quick fade in/out at edges, invisible outside viewport
          if (globeProgress <= 0.05) {
            opacity = globeProgress / 0.05; // 0 to 1 over first 5%
          } else if (globeProgress >= 0.95) {
            opacity = (1 - globeProgress) / 0.05; // 1 to 0 over last 5%
          } else {
            opacity = 1;
          }
        } else {
          // Globe has exited to the left - completely hidden
          translateX = -100;
          scale = 1;
          opacity = 0;
        }

        // Scale down globe size for mobile (50% on mobile, 100% on desktop)
        const scaledSize = isMobile ? globe.size * 0.5 : globe.size;
        
        return (
          <div
            key={index}
            className="absolute flex items-center justify-center"
            style={{
              transform: `translate3d(${translateX}vw, 0, 0) scale(${scale})`,
              opacity: opacity,
              visibility: opacity === 0 ? 'hidden' : 'visible',
              willChange: 'transform, opacity',
              backfaceVisibility: 'hidden' as const,
            }}
          >
            {/* Globe */}
            <FloatingGlobe
              size={scaledSize}
              rotationSpeed={globe.rotationSpeed}
              gridColor={globe.gridColor}
              glowColor={globe.glowColor}
              texturePath={globe.texturePath}
            />
            
            {/* Text overlaid on top of globe */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-auto px-4">
              <h2 
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 drop-shadow-lg"
                style={{ color: globe.gridColor }}
              >
                {globe.title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 text-white drop-shadow-lg">
                {globe.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

