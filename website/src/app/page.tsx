'use client';
import "./globals.css";
import Scene from "@/components/Scene";
import ScrollingGlobes, { GlobeConfig } from "@/components/ScrollingGlobes";
import dynamic from "next/dynamic";

const TextType = dynamic(() => import("@/components/TextType"), {
  ssr: false,
});

const MultiGlobes = dynamic(() => import("@/components/MultiGlobes"), {
  ssr: false,
});

// Original slow scrolling globes
const originalGlobes: GlobeConfig[] = [
  {
    size: 500,
    rotationSpeed: 12,
    gridColor: "#00ffff",
    glowColor: "#00ffff",
    name: "Cyan",
    title: "Original Slow Cyan",
    subtitle: "Classic slow transition with pause"
  },
  {
    size: 500,
    rotationSpeed: 18,
    gridColor: "#ff00ff",
    glowColor: "#ff00ff",
    name: "Purple",
    title: "Original Slow Purple",
    subtitle: "Smooth and deliberate movement"
  },
  {
    size: 500,
    rotationSpeed: 10,
    gridColor: "#00ff88",
    glowColor: "#00ff88",
    name: "Green",
    title: "Original Slow Green",
    subtitle: "One globe at a time, centered"
  },
  {
    size: 500,
    rotationSpeed: 20,
    gridColor: "#ff8800",
    glowColor: "#ff8800",
    name: "Orange",
    title: "Original Slow Orange",
    subtitle: "Final globe in the original sequence"
  }
];

export default function Home() {
  return (
    <div className="min-h-[1400vh] w-screen bg-black relative overflow-x-hidden">
      <Scene />
      
      {/* Original slow scrolling globes - start after multi-globe section */}
      <ScrollingGlobes
        globes={originalGlobes}
        scrollPeriod={3}
        scrollStartOffset={1} // Start after intro (1vh) + multi-globe section (4vh)
        pauseStart={0.35}
        pauseEnd={0.65}
        pauseMovement={0.1}
      />
      
      {/* Content sections to enable scrolling */}
      <div className="relative z-30 pointer-events-auto">
        {/* Intro Section */}
        <section className="h-[100vh] flex items-top mt-20 md:mt-40 justify-center px-4">
          <div className="text-center text-white max-w-4xl">
            <TextType
              text="Welcome to StruXture"
              as="h1"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6"
              typingSpeed={75}
              showCursor={true}
              cursorCharacter="|"
              loop={false}
              initialDelay={500}
            />
            <p className="text-lg sm:text-xl md:text-2xl opacity-80 mb-4 md:mb-8">Where innovation meets design</p>
            <p className="text-sm sm:text-base md:text-lg opacity-60">Scroll to explore</p>
          </div>
        </section>

        {/* Multi-globes display section - at the beginning */}
        <section className="h-[100vh] relative">
          <div className="sticky top-0 h-screen">
            <MultiGlobes />
          </div>
        </section>

        {/* Transition section */}
        <section className="h-[100vh] flex items-center justify-center px-4">
          <div className="text-center text-white max-w-4xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4">Experience the Journey</h2>
            <p className="text-base sm:text-lg md:text-xl opacity-80">Smooth scrolling globe transitions</p>
          </div>
        </section>

        {/* Globe sections - Each 50vh for 0.5 viewport height transitions */}
        <section className="h-[50vh]"></section>
        <section className="h-[50vh]"></section>
        <section className="h-[50vh]"></section>
        <section className="h-[50vh]"></section>
      </div>
    </div>
  );  
}
