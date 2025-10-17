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

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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
          // Globe is waiting to enter from the right
          translateX = 150; // Start off-screen right (percentage)
          scale = 0.3;
          opacity = 0;
        } else if (rawGlobeProgress <= 1) {
          // Globe is transitioning across the screen
          // 0 to 1: move from right to left, scale from small to large to small
          translateX = 150 - (globeProgress * 300); // 150 to -150
          
          // Scale: peaks at 1.0 when globeProgress = 0.5 (centered)
          if (globeProgress <= 0.5) {
            // Entering: scale from 0.3 to 1.0
            scale = 0.3 + (globeProgress * 1.4);
          } else {
            // Exiting: scale from 1.0 to 0.3
            scale = 1.7 - (globeProgress * 1.4);
          }
          
          // Opacity: fade in and out
          if (globeProgress <= 0.2) {
            opacity = globeProgress * 5; // 0 to 1
          } else if (globeProgress >= 0.8) {
            opacity = (1 - globeProgress) * 5; // 1 to 0
          } else {
            opacity = 1;
          }
        } else {
          // Globe has exited to the left
          translateX = -150;
          scale = 0.3;
          opacity = 0;
        }

        return (
          <div
            key={index}
            className="absolute flex flex-col items-center"
            style={{
              transform: `translateX(${translateX}vw) scale(${scale})`,
              opacity: opacity,
              transition: 'transform 0.1s linear, opacity 0.1s linear',
            }}
          >
            <FloatingGlobe
              size={globe.size}
              rotationSpeed={globe.rotationSpeed}
              gridColor={globe.gridColor}
              glowColor={globe.glowColor}
            />
            
            {/* Text that moves with the globe */}
            <div className="mt-8 text-center pointer-events-auto">
              <h2 
                className="text-5xl font-bold mb-4"
                style={{ color: globe.gridColor }}
              >
                {globe.title}
              </h2>
              <p className="text-xl opacity-80 text-white">
                {globe.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

