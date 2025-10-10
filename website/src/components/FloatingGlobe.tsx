'use client';
import { useEffect, useRef } from 'react';

interface FloatingGlobeProps {
  size?: number;
  rotationSpeed?: number;
  gridColor?: string;
  glowColor?: string;
}

export default function FloatingGlobe({
  size = 300,
  rotationSpeed = 20,
  gridColor = '#00ffff',
  glowColor = '#00ffff'
}: FloatingGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log('FloatingGlobe rendering with size:', size);

    // Set canvas size
    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 20;

    let animationFrame: number;

    const drawGlobe = () => {
      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Draw glow effect
      const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius * 1.3);
      gradient.addColorStop(0, `${glowColor}00`);
      gradient.addColorStop(0.5, `${glowColor}20`);
      gradient.addColorStop(1, `${glowColor}00`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      // Draw main sphere outline
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw latitude lines
      for (let i = 1; i < 6; i++) {
        const y = centerY + (radius * 2 * (i / 6 - 0.5));
        const latRadius = Math.sqrt(radius * radius - Math.pow(y - centerY, 2));
        
        if (latRadius > 0) {
          ctx.beginPath();
          ctx.ellipse(centerX, y, latRadius, latRadius * 0.3, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `${gridColor}80`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw longitude lines (rotating)
      const numLongitudes = 12;
      for (let i = 0; i < numLongitudes; i++) {
        const angle = (i * Math.PI * 2 / numLongitudes) + (rotationRef.current * Math.PI / 180);
        
        ctx.beginPath();
        for (let t = 0; t <= Math.PI * 2; t += 0.05) {
          const x = centerX + Math.sin(t) * radius * Math.cos(angle);
          const z = Math.sin(t) * radius * Math.sin(angle);
          const y = centerY + Math.cos(t) * radius;
          
          // Simple perspective: scale based on z-depth
          const scale = 1 + (z / (radius * 3));
          const projX = centerX + (x - centerX) * scale;
          const projY = centerY + (y - centerY) * scale;
          
          if (t === 0) {
            ctx.moveTo(projX, projY);
          } else {
            ctx.lineTo(projX, projY);
          }
        }
        ctx.strokeStyle = `${gridColor}60`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw rotating dots/particles
      const numDots = 40;
      for (let i = 0; i < numDots; i++) {
        const lat = (Math.random() - 0.5) * Math.PI;
        const lon = Math.random() * Math.PI * 2 + (rotationRef.current * Math.PI / 180);
        
        const x = centerX + radius * Math.cos(lat) * Math.cos(lon);
        const z = radius * Math.cos(lat) * Math.sin(lon);
        const y = centerY + radius * Math.sin(lat);
        
        // Only draw dots on the front hemisphere
        if (z > 0) {
          const scale = 1 + (z / (radius * 3));
          const projX = centerX + (x - centerX) * scale;
          const projY = centerY + (y - centerY) * scale;
          const brightness = Math.floor(155 + (z / radius) * 100);
          
          ctx.beginPath();
          ctx.arc(projX, projY, 2, 0, Math.PI * 2);
          ctx.fillStyle = `${gridColor}${brightness.toString(16).padStart(2, '0')}`;
          ctx.fill();
        }
      }

      // Update rotation
      rotationRef.current += rotationSpeed / 100;
      if (rotationRef.current >= 360) {
        rotationRef.current = 0;
      }

      animationFrame = requestAnimationFrame(drawGlobe);
    };

    drawGlobe();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [size, rotationSpeed, gridColor, glowColor]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.02);
          }
        }
      `}} />
      
      <div className="relative">
        <div
          className="relative"
          style={{
            filter: `drop-shadow(0 0 50px ${glowColor}80)`,
            animation: 'float 6s ease-in-out infinite'
          }}
        >
          <canvas
            ref={canvasRef}
            className="block"
            style={{
              imageRendering: 'auto',
              display: 'block',
              margin: '0 auto'
            }}
          />
        </div>
      </div>
    </>
  );
}

