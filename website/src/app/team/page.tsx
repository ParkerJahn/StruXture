'use client';
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Scene from "@/components/Scene";
import dynamic from "next/dynamic";

const FloatingGlobe = dynamic(() => import('@/components/FloatingGlobe'), {
  ssr: false,
  loading: () => null
});

interface Position {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  color: string;
}

const openPositions: Position[] = [
  {
    title: "Senior Full Stack Developer",
    department: "Engineering",
    location: "Remote / Hybrid",
    type: "Full-time",
    description: "Join our engineering team to build cutting-edge SaaS products that transform businesses.",
    requirements: [
      "5+ years of experience with React and Node.js",
      "Experience with cloud platforms (AWS/GCP/Azure)",
      "Strong problem-solving skills",
      "Excellent communication abilities"
    ],
    color: "#00ffff"
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Create beautiful, intuitive user experiences that delight our customers.",
    requirements: [
      "3+ years of product design experience",
      "Proficiency in Figma and design systems",
      "Portfolio demonstrating UX/UI skills",
      "Understanding of front-end development"
    ],
    color: "#ff00ff"
  },
  {
    title: "Business Intelligence Analyst",
    department: "Data & Analytics",
    location: "Hybrid",
    type: "Full-time",
    description: "Help our clients make data-driven decisions with powerful insights and analytics.",
    requirements: [
      "Experience with SQL and data visualization tools",
      "Strong analytical and statistical skills",
      "Understanding of business metrics",
      "Excellent presentation skills"
    ],
    color: "#ffd93d"
  },
  {
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote",
    type: "Full-time",
    description: "Build lasting relationships with our clients and ensure their success with our platform.",
    requirements: [
      "2+ years in customer success or account management",
      "Excellent communication skills",
      "Technical aptitude",
      "Proactive problem-solving mindset"
    ],
    color: "#ff6b6b"
  }
];

const perks = [
  { icon: "🏥", title: "Health & Wellness", description: "Comprehensive health, dental, and vision insurance" },
  { icon: "🏠", title: "Remote First", description: "Work from anywhere with flexible hours" },
  { icon: "📚", title: "Learning Budget", description: "$2,000 annual learning and development budget" },
  { icon: "🌴", title: "Unlimited PTO", description: "Take time off when you need it" },
  { icon: "💰", title: "Competitive Salary", description: "Above-market compensation and equity options" },
  { icon: "🚀", title: "Latest Tech", description: "Top-tier equipment and tools" }
];

export default function Team() {
  const [globeSize, setGlobeSize] = useState(320);

  useEffect(() => {
    const updateGlobeSize = () => {
      if (window.innerWidth < 475) {
        setGlobeSize(192);
      } else if (window.innerWidth < 640) {
        setGlobeSize(224);
      } else if (window.innerWidth < 768) {
        setGlobeSize(256);
      } else {
        setGlobeSize(320);
      }
    };

    updateGlobeSize();
    window.addEventListener('resize', updateGlobeSize);
    return () => window.removeEventListener('resize', updateGlobeSize);
  }, []);

  return (
    <div className="min-h-screen w-screen bg-black relative overflow-x-hidden">
      <Header />
      <Scene />
      
      <div className="relative z-50 pt-20 sm:pt-24 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto py-12 sm:py-16 md:py-20 text-center">
          <h1 
            className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 md:mb-8"
            style={{
              fontFamily: '"natom-pro", sans-serif',
              fontWeight: 700,
              fontStyle: 'normal'
            }}
          >
            Join Our Team
          </h1>
          <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto px-4">
            Build the future of business technology with passionate, talented individuals from around the world
          </p>
        </section>

        {/* Globe Visual */}
        <section className="max-w-7xl mx-auto mb-12 sm:mb-16 md:mb-20 flex justify-center">
          <div className="w-48 h-48 xs:w-56 xs:h-56 sm:w-64 sm:h-64 md:w-80 md:h-80">
            <FloatingGlobe
              size={globeSize}
              rotationSpeed={10}
              gridColor="#ffffff"
              glowColor="#ffffff"
              texturePath="/2k_earth_daymap.jpg"
            />
          </div>
        </section>

        {/* Perks Section */}
        <section className="max-w-7xl mx-auto mb-16 sm:mb-20 md:mb-24">
          <h2 
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 sm:mb-12 text-center"
            style={{
              fontFamily: '"natom-pro", sans-serif',
              fontWeight: 700
            }}
          >
            Why StruXture?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {perks.map((perk, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-neutral-900/80 to-black/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-white/5"
              >
                <div className="text-4xl sm:text-5xl mb-4">{perk.icon}</div>
                <h3 className="text-xl xs:text-2xl font-bold text-white mb-2 sm:mb-3"
                  style={{
                    fontFamily: '"cc-pixel-arcade-cartridge", sans-serif'
                  }}
                >
                  {perk.title}
                </h3>
                <p className="text-sm xs:text-base sm:text-lg text-white/70">
                  {perk.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section className="max-w-7xl mx-auto pb-20">
          <h2 
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 sm:mb-12 text-center"
            style={{
              fontFamily: '"natom-pro", sans-serif',
              fontWeight: 700
            }}
          >
            Open Positions
          </h2>
          <div className="space-y-6 sm:space-y-8">
            {openPositions.map((position, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-neutral-900/90 to-black/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-white/5"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <h3 
                        className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white"
                        style={{
                          fontFamily: '"cc-pixel-arcade-cartridge", sans-serif',
                          color: position.color
                        }}
                      >
                        {position.title}
                      </h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white/5 text-white/80 text-xs xs:text-sm sm:text-base border border-white/10">
                        {position.department}
                      </span>
                      <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white/5 text-white/80 text-xs xs:text-sm sm:text-base border border-white/10">
                        {position.location}
                      </span>
                      <span className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white/5 text-white/80 text-xs xs:text-sm sm:text-base border border-white/10">
                        {position.type}
                      </span>
                    </div>

                    <p className="text-sm xs:text-base sm:text-lg text-white/70 mb-4 sm:mb-6">
                      {position.description}
                    </p>

                    <div className="mb-6 sm:mb-8">
                      <h4 className="text-base xs:text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                        Requirements:
                      </h4>
                      <ul className="space-y-2 sm:space-y-3">
                        {position.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-start gap-3">
                            <span 
                              className="text-base sm:text-lg mt-0.5 flex-shrink-0"
                              style={{ color: position.color }}
                            >
                              ✦
                            </span>
                            <span className="text-xs xs:text-sm sm:text-base text-white/80">
                              {req}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    className="lg:ml-6 py-3 sm:py-4 px-8 sm:px-10 rounded-xl font-semibold text-sm xs:text-base sm:text-lg whitespace-nowrap transition-all duration-300 hover:scale-105 hover:shadow-lg self-start"
                    style={{
                      background: `linear-gradient(135deg, ${position.color}20 0%, ${position.color}40 100%)`,
                      border: `2px solid ${position.color}60`,
                      color: position.color,
                      fontFamily: '"cc-pixel-arcade-cartridge", sans-serif'
                    }}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto pb-20 text-center">
          <div className="bg-gradient-to-br from-neutral-900/80 to-black/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 border border-white/10">
            <h2 
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6"
              style={{
                fontFamily: '"natom-pro", sans-serif',
                fontWeight: 700
              }}
            >
              Don't See Your Role?
            </h2>
            <p className="text-base xs:text-lg sm:text-xl text-white/70 mb-6 sm:mb-8">
              We're always looking for talented individuals. Send us your resume!
            </p>
            <button
              className="py-4 px-8 sm:px-12 rounded-xl font-semibold text-base sm:text-lg bg-white text-black hover:bg-white/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/20"
              style={{
                fontFamily: '"cc-pixel-arcade-cartridge", sans-serif'
              }}
            >
              Send Resume
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

