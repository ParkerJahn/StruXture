'use client';
import "./globals.css";
import Scene from "@/components/Scene";
import ScrollingGlobes, { GlobeConfig } from "@/components/ScrollingGlobes";
import Header from "@/components/Header";
import Link from "next/link";
import dynamic from "next/dynamic";

const TextType = dynamic(() => import("@/components/TextType"), {
  ssr: false,
});

const MultiGlobes = dynamic(() => import("@/components/MultiGlobes"), {
  ssr: false,
});

const GalaxyParticles = dynamic(() => import("@/components/GalaxyParticles"), {
  ssr: false,
});

// Original slow scrolling globes
const originalGlobes: GlobeConfig[] = [
  {
    size: 1000,
    rotationSpeed: 23,
    gridColor: "#ffffff",
    glowColor: "#ffffff",
    texturePath: "/2k_earth_daymap.jpg",
    name: "Cyan",
    title: "",
    subtitle: ""
  },
  {
    size: 1200,
    rotationSpeed: 18,
    gridColor: "#ffffff",
    glowColor: "#ffffff",
    texturePath: "/2k_jupiter.jpg",
    name: "Purple",
    title: "",
    subtitle: ""
  },
  {
    size: 900,
    rotationSpeed: 10,
    gridColor: "#ffffff",
    glowColor: "#ffffff",
    texturePath: "/2k_mars.jpg",
    name: "Green",
    title: "",
    subtitle: ""
  },
  {
    size: 900,
    rotationSpeed: 20,
    gridColor: "#ffffff",
    glowColor: "#ffffff",
    texturePath: "/2k_mercury.jpg",
    name: "Orange",
    title: "",
    subtitle: ""
  }
];

export default function Home() {
  return (
    <div className="min-h-[1400vh] w-screen bg-black relative overflow-x-hidden">
      <Header />
      <Scene />
      
      {/* Floating Galaxy Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <GalaxyParticles particleCount={3000} speed={0.1} />
      </div>
      
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
      <div className="relative z-50 pointer-events-auto">
        {/* Hero Section */}
        <section className="h-[100vh] flex items-center justify-center px-4 sm:px-6 md:px-8 bg-gradient-to-b from-neutral-800/80 via-neutral-900/70 to-black/30 relative z-50">
          <div className="text-center text-white max-w-5xl relative z-50 w-full">
            <TextType
              text="Build Structured, Scalable Digital Solutions That Drive Growth"
              as="h1"
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 px-2"
              style={{
                fontFamily: '"natom-pro", sans-serif',
                fontWeight: 700,
                fontStyle: 'normal'
              }}
              typingSpeed={50}
              showCursor={true}
              cursorCharacter="|"
              loop={false}
              initialDelay={500}
              startOnVisible={true}
            />
            <p className="text-base xs:text-lg sm:text-xl md:text-2xl opacity-90 mb-8 md:mb-12 px-2 max-w-4xl mx-auto">
              Custom software, AI automation, and digital infrastructure designed for performance, security, and long-term impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-2">
              <Link href="/get-started" className="px-8 py-4 bg-white text-black hover:bg-white/90 rounded-lg text-lg font-semibold transition-all hover:scale-105 w-full sm:w-auto text-center">
                Start a Project
              </Link>
              <Link href="/products" className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-lg font-semibold transition-all hover:scale-105 w-full sm:w-auto text-center">
                View Our Services
              </Link>
            </div>
          </div>
        </section>

        {/* Multi-globes display section - at the beginning */}
        <section className="h-[100vh] relative">
          <div className="sticky top-0 h-screen">
            <MultiGlobes />
          </div>
        </section>

        {/* Trust / Positioning Section */}
        <section className="min-h-[100vh] flex items-center justify-center px-4 sm:px-6 md:px-8 py-20">
          <div className="text-center text-white max-w-4xl w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 hover:bg-white/10 transition-all">
            <TextType
              text="Technology Built With Purpose"
              as="h2"
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
              style={{
                fontFamily: '"natom-pro", sans-serif',
                fontWeight: 700,
                fontStyle: 'normal'
              }}
              typingSpeed={50}
              showCursor={true}
              cursorCharacter="|"
              loop={false}
              initialDelay={200}
              startOnVisible={true}
            />
            <p className="text-base sm:text-lg md:text-xl opacity-90 leading-relaxed">
              StruXture Digital Solutions is a modern digital consultancy focused on turning complex ideas into reliable, production-ready software. We partner with founders and businesses to build technology that is cleanly designed, secure by default, and engineered to scale.
            </p>
          </div>
        </section>

        {/* Services Overview Section */}
        <section className="min-h-[100vh] py-20 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto text-white">
            
            {/* Section Title */}
            <div className="text-center mb-16">
              <TextType
                text="What We Build"
                as="h2"
                className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
                  style={{
                    fontFamily: '"natom-pro", sans-serif',
                    fontWeight: 700,
                    fontStyle: 'normal'
                }}
                typingSpeed={50}
                showCursor={true}
                cursorCharacter="|"
                loop={false}
                initialDelay={200}
                startOnVisible={true}
              />
            </div>

            {/* Service Cards Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-32">
              {/* Service 1 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 hover:bg-white/10 transition-all">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4"
                    style={{ fontFamily: '"natom-pro", sans-serif' }}>
                  Custom SaaS Development
                </h3>
                <p className="text-base sm:text-lg opacity-90 leading-relaxed">
                  We transform ideas into full-scale SaaS platforms—handling architecture, development, and deployment so you can focus on growth and market fit.
                </p>
              </div>
              
              {/* Service 2 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 hover:bg-white/10 transition-all">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4"
                    style={{ fontFamily: '"natom-pro", sans-serif' }}>
                  AI Automation & Integration
                </h3>
                <p className="text-base sm:text-lg opacity-90 leading-relaxed">
                  We securely integrate AI into your workflows to automate processes, analyze data, and surface insights that give your business a competitive edge.
                </p>
            </div>

              {/* Service 3 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 hover:bg-white/10 transition-all">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4"
                    style={{ fontFamily: '"natom-pro", sans-serif' }}>
                  Custom CRM & Workflow Systems
                </h3>
                <p className="text-base sm:text-lg opacity-90 leading-relaxed">
                  Purpose-built CRM solutions designed around your business processes, helping you centralize data, automate workflows, and operate efficiently.
                </p>
              </div>
              
              {/* Service 4 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 hover:bg-white/10 transition-all">
                <h3 className="text-2xl sm:text-3xl font-bold mb-4"
                    style={{ fontFamily: '"natom-pro", sans-serif' }}>
                  Websites & Landing Pages
                </h3>
                <p className="text-base sm:text-lg opacity-90 leading-relaxed">
                  Modern, high-performance websites and landing pages built to clearly communicate value and convert users.
                </p>
              </div>
            </div>

            {/* How We Work Section */}
            <div className="mb-32">
              <div className="text-center mb-16">
                <TextType
                  text="Our Approach"
                  as="h2"
                  className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
                  style={{
                    fontFamily: '"natom-pro", sans-serif',
                    fontWeight: 700,
                    fontStyle: 'normal'
                  }}
                  typingSpeed={50}
                  showCursor={true}
                  cursorCharacter="|"
                  loop={false}
                  initialDelay={200}
                  startOnVisible={true}
                />
              </div>
              
              <div className="space-y-8 max-w-4xl mx-auto">
                {/* Step 1 */}
                <div className="flex gap-6 items-start bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 hover:bg-white/10 transition-all">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-3"
                    style={{ fontFamily: '"natom-pro", sans-serif' }}>
                      Understand
                </h3>
                    <p className="text-base sm:text-lg opacity-90 leading-relaxed">
                      We take the time to understand your business, goals, and constraints before writing a single line of code.
                    </p>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex gap-6 items-start bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 hover:bg-white/10 transition-all">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-3"
                        style={{ fontFamily: '"natom-pro", sans-serif' }}>
                      Design & Build
                    </h3>
                    <p className="text-base sm:text-lg opacity-90 leading-relaxed">
                      We design clean, scalable systems and build with performance, security, and maintainability in mind.
                </p>
              </div>
            </div>

                {/* Step 3 */}
                <div className="flex gap-6 items-start bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-8 hover:bg-white/10 transition-all">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-3"
                      style={{ fontFamily: '"natom-pro", sans-serif' }}>
                      Deploy & Scale
                  </h3>
                    <p className="text-base sm:text-lg opacity-90 leading-relaxed">
                      We deliver production-ready solutions built to evolve as your business grows.
                  </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why StruXture Section */}
            <div className="mb-32">
              <div className="text-center mb-16">
                <TextType
                  text="Why Work With Us"
                  as="h2"
                  className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
                  style={{
                    fontFamily: '"natom-pro", sans-serif',
                    fontWeight: 700,
                    fontStyle: 'normal'
                  }}
                  typingSpeed={50}
                  showCursor={true}
                  cursorCharacter="|"
                  loop={false}
                  initialDelay={200}
                  startOnVisible={true}
                />
              </div>
              
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex gap-4 items-start bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                  <div className="flex-shrink-0 text-2xl">✓</div>
                  <p className="text-base sm:text-lg opacity-90 leading-relaxed">
                    Security-first and scalability-driven development
                  </p>
                  </div>
                
                <div className="flex gap-4 items-start bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                  <div className="flex-shrink-0 text-2xl">✓</div>
                  <p className="text-base sm:text-lg opacity-90 leading-relaxed">
                    Custom solutions—no templates or one-size-fits-all platforms
                  </p>
                </div>
                
                <div className="flex gap-4 items-start bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                  <div className="flex-shrink-0 text-2xl">✓</div>
                  <p className="text-base sm:text-lg opacity-90 leading-relaxed">
                    Clear communication and transparent execution
                  </p>
                </div>
                
                <div className="flex gap-4 items-start bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                  <div className="flex-shrink-0 text-2xl">✓</div>
                  <p className="text-base sm:text-lg opacity-90 leading-relaxed">
                    Built for real-world use, not just demos
                  </p>
                </div>
              </div>
            </div>

            {/* Final Call-to-Action */}
            <div className="text-center py-16">
              <TextType
                text="Let's Build Something That Lasts"
                as="h3"
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
                style={{ fontFamily: '"natom-pro", sans-serif' }}
                typingSpeed={50}
                showCursor={true}
                cursorCharacter="|"
                loop={false}
                initialDelay={200}
                startOnVisible={true}
              />
              <p className="text-lg sm:text-xl opacity-90 mb-8 max-w-3xl mx-auto">
                Whether you&apos;re launching a new product or improving existing systems, StruXture Digital Solutions is ready to help you build with confidence.
              </p>
              <Link href="/get-started" className="inline-block px-8 py-4 bg-white text-black hover:bg-white/90 rounded-lg text-lg font-semibold transition-all hover:scale-105">
                Get in Touch
              </Link>
              <p className="text-sm opacity-60 mt-8">
                Structured Technology. Built to Scale.
              </p>
            </div>

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
