"use client";
import { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';

interface GalaxyParticlesProps {
  particleCount?: number;
  speed?: number;
  scrollRotation?: boolean;
  scrollRotationSpeed?: number;
  scrollZoom?: boolean;
  scrollZoomAmount?: number; // How much closer to move (positive = toward viewer)
  scrollZoomDuration?: number; // Pixels of scroll to complete zoom
  scrollStartOffset?: number; // Pixels of scroll before effects begin
  className?: string;
}

const hexToRgb = (hex: string): [number, number, number] => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(c => c + c)
      .join('');
  }
  const int = parseInt(hex, 16);
  const r = ((int >> 16) & 255) / 255;
  const g = ((int >> 8) & 255) / 255;
  const b = (int & 255) / 255;
  return [r, g, b];
};

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vRandom = random;
    vColor = color;
    
    vec3 pos = position;
    
    // Add gentle floating motion
    pos.x += sin(uTime * 0.5 + random.z * 6.28) * 0.3 * random.x;
    pos.y += cos(uTime * 0.3 + random.w * 6.28) * 0.3 * random.y;
    pos.z += sin(uTime * 0.4 + random.x * 6.28) * 0.2 * random.z;
    
    vec4 mvPos = viewMatrix * modelMatrix * vec4(pos, 1.0);
    
    // Size based on distance and randomness
    float size = (50.0 + random.x * 100.0) / length(mvPos.xyz);
    gl_PointSize = size;
    
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  
  uniform float uTime;
  varying vec4 vRandom;
  varying vec3 vColor;
  
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    
    // Create soft glowing particles
    float circle = smoothstep(0.5, 0.1, d);
    float glow = smoothstep(0.5, 0.0, d) * 0.3;
    
    // Add subtle twinkle effect
    float twinkle = sin(uTime * 2.0 + vRandom.w * 6.28) * 0.3 + 0.7;
    
    vec3 finalColor = vColor * (circle + glow) * twinkle;
    float alpha = (circle + glow * 0.5) * 0.8;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

const GalaxyParticles: React.FC<GalaxyParticlesProps> = ({
  particleCount = 3000,
  speed = 0.1,
  scrollRotation = false,
  scrollRotationSpeed = 0.001,
  scrollZoom = false,
  scrollZoomAmount = 8,
  scrollZoomDuration = 800,
  scrollStartOffset = 0,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);

  // Track scroll position
  useEffect(() => {
    if (!scrollRotation && !scrollZoom) return;

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollRotation, scrollZoom]);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new Renderer({ depth: false, alpha: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    // Append canvas to container
    containerRef.current.appendChild(gl.canvas);
    gl.canvas.style.position = 'absolute';
    gl.canvas.style.top = '0';
    gl.canvas.style.left = '0';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';

    const camera = new Camera(gl, { fov: 45 });
    camera.position.set(0, 5, 15);
    camera.lookAt([0, 0, 0]);

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    };
    window.addEventListener('resize', resize, false);
    resize();

    // Galaxy color palette - blues, purples, whites, and hints of pink
    const galaxyColors = [
      '#ffffff', // bright white stars
      '#e0e6ff', // light blue-white
      '#c5d4ff', // soft blue
      '#a8b9ff', // medium blue
      '#8b9eff', // deeper blue
      '#9d8bff', // purple-blue
      '#b899ff', // light purple
      '#d4b3ff', // soft purple
      '#ffc8dd', // soft pink
      '#ffb5d5', // light pink
    ];

    const count = particleCount;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);

    // Create spiral galaxy pattern
    for (let i = 0; i < count; i++) {
      // Distance from center (higher density near center)
      const radius = Math.pow(Math.random(), 0.5) * 12;
      
      // Spiral arms (3 arms)
      const armCount = 3;
      const arm = Math.floor(Math.random() * armCount);
      const armAngleOffset = (arm / armCount) * Math.PI * 2;
      
      // Angle with spiral
      const angle = armAngleOffset + radius * 0.5 + (Math.random() - 0.5) * 0.5;
      
      // Height variation (thicker in center, thinner at edges)
      const heightVariation = (1 - radius / 12) * 0.5 + 0.1;
      const height = (Math.random() - 0.5) * heightVariation;
      
      // Scatter particles slightly from perfect spiral
      const scatter = (Math.random() - 0.5) * (1 + radius * 0.1);
      
      const x = Math.cos(angle) * (radius + scatter);
      const y = height;
      const z = Math.sin(angle) * (radius + scatter);
      
      positions.set([x, y, z], i * 3);
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
      
      // Color based on distance from center
      // Center is brighter/whiter, edges are more blue/purple
      let colorIndex;
      if (radius < 2) {
        // Core: bright white/yellow
        colorIndex = Math.floor(Math.random() * 3);
      } else if (radius < 6) {
        // Middle: blues and purples
        colorIndex = Math.floor(Math.random() * 6) + 2;
      } else {
        // Outer: darker blues and purples
        colorIndex = Math.floor(Math.random() * 4) + 4;
      }
      
      const col = hexToRgb(galaxyColors[colorIndex]);
      colors.set(col, i * 3);
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors }
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 }
      },
      transparent: true,
      depthTest: true,
      depthWrite: false
    });

    // Enable blending for glow effect
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.enable(gl.BLEND);

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program });

    let animationFrameId: number;
    let lastTime = performance.now();
    let elapsed = 0;

    const update = (t: number) => {
      animationFrameId = requestAnimationFrame(update);
      const delta = t - lastTime;
      lastTime = t;
      elapsed += delta * speed;

      program.uniforms.uTime.value = elapsed * 0.001;

      // Slowly rotate the galaxy (time-based)
      let yRotation = elapsed * 0.0001;
      
      // Calculate effective scroll (after offset)
      const effectiveScroll = Math.max(0, scrollYRef.current - scrollStartOffset);
      
      // Add scroll-based rotation if enabled
      if (scrollRotation) {
        yRotation += effectiveScroll * scrollRotationSpeed;
      }
      
      particles.rotation.y = yRotation;
      particles.rotation.x = Math.sin(elapsed * 0.00005) * 0.2;

      // Apply scroll-based zoom (come toward viewer)
      if (scrollZoom) {
        const scrollProgress = Math.min(effectiveScroll / scrollZoomDuration, 1);
        // Ease out cubic for smooth deceleration
        const easedProgress = 1 - Math.pow(1 - scrollProgress, 3);
        // Start at 15, move closer by scrollZoomAmount
        camera.position.z = 15 - (scrollZoomAmount * easedProgress);
      }

      renderer.render({ scene: particles, camera });
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && gl.canvas) {
        containerRef.current.removeChild(gl.canvas);
      }
    };
  }, [particleCount, speed, scrollRotation, scrollRotationSpeed, scrollZoom, scrollZoomAmount, scrollZoomDuration, scrollStartOffset]);

  return <div ref={containerRef} className={`relative w-full h-full ${className}`} />;
};

export default GalaxyParticles;

