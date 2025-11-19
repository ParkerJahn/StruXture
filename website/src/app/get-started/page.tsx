'use client';
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Scene from "@/components/Scene";
import dynamic from "next/dynamic";

const FloatingGlobe = dynamic(() => import('@/components/FloatingGlobe'), {
  ssr: false,
  loading: () => null
});

interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
}

const steps: Step[] = [
  {
    number: 1,
    title: "Book a Consultation",
    description: "Schedule a free 30-minute consultation with our team to discuss your needs and goals.",
    icon: "📅"
  },
  {
    number: 2,
    title: "Custom Proposal",
    description: "Receive a tailored proposal outlining our recommended solutions and implementation plan.",
    icon: "📋"
  },
  {
    number: 3,
    title: "Onboarding & Setup",
    description: "Our team will guide you through setup and configuration, ensuring a smooth transition.",
    icon: "🚀"
  },
  {
    number: 4,
    title: "Launch & Support",
    description: "Go live with confidence, backed by our 24/7 support team and ongoing optimization.",
    icon: "✨"
  }
];

export default function GetStarted() {
  const [globeSize, setGlobeSize] = useState(256);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    message: ''
  });

  useEffect(() => {
    const updateGlobeSize = () => {
      if (window.innerWidth < 475) {
        setGlobeSize(192);
      } else if (window.innerWidth < 640) {
        setGlobeSize(224);
      } else {
        setGlobeSize(256);
      }
    };

    updateGlobeSize();
    window.addEventListener('resize', updateGlobeSize);
    return () => window.removeEventListener('resize', updateGlobeSize);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
    alert('Thank you! We will contact you soon.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
            Get Started
          </h1>
          <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto px-4">
            Transform your business today with our innovative solutions. Lets build something amazing together.
          </p>
        </section>

        {/* Globe Visual */}
        <section className="max-w-7xl mx-auto mb-12 sm:mb-16 md:mb-20 flex justify-center">
          <div className="w-48 h-48 xs:w-56 xs:h-56 sm:w-64 sm:h-64">
            <FloatingGlobe
              size={globeSize}
              rotationSpeed={15}
              gridColor="#00ffff"
              glowColor="#00ffff"
              texturePath="/2k_earth_daymap.jpg"
            />
          </div>
        </section>

        {/* Process Steps */}
        <section className="max-w-7xl mx-auto mb-16 sm:mb-20 md:mb-24">
          <h2 
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-8 sm:mb-12 text-center"
            style={{
              fontFamily: '"natom-pro", sans-serif',
              fontWeight: 700
            }}
          >
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-gradient-to-br from-neutral-900/80 to-black/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-white/5 text-center"
              >
                <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <span className="text-xl xs:text-2xl sm:text-3xl font-bold text-cyan-400">
                    {step.number}
                  </span>
                </div>
                <div className="text-4xl xs:text-5xl sm:text-6xl mb-4 sm:mb-6">{step.icon}</div>
                <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4"
                  style={{
                    fontFamily: '"cc-pixel-arcade-cartridge", sans-serif'
                  }}
                >
                  {step.title}
                </h3>
                <p className="text-xs xs:text-sm sm:text-base text-white/70">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="max-w-4xl mx-auto pb-20">
          <div className="bg-gradient-to-br from-neutral-900/90 to-black/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 border border-white/10">
            <h2 
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 text-center"
              style={{
                fontFamily: '"natom-pro", sans-serif',
                fontWeight: 700
              }}
            >
              Request a Consultation
            </h2>
            <p className="text-sm xs:text-base sm:text-lg text-white/70 mb-8 sm:mb-10 text-center">
              Fill out the form below and our team will get back to you within 24 hours
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm xs:text-base font-medium text-white mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 sm:py-4 rounded-lg bg-black/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm xs:text-base"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm xs:text-base font-medium text-white mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 sm:py-4 rounded-lg bg-black/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm xs:text-base"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm xs:text-base font-medium text-white mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 sm:py-4 rounded-lg bg-black/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm xs:text-base"
                    placeholder="Your Company"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm xs:text-base font-medium text-white mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 sm:py-4 rounded-lg bg-black/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm xs:text-base"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-sm xs:text-base font-medium text-white mb-2">
                  Service Interested In *
                </label>
                <select
                  id="service"
                  name="service"
                  required
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full px-4 py-3 sm:py-4 rounded-lg bg-black/50 border border-white/20 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm xs:text-base"
                >
                  <option value="">Select a service...</option>
                  <option value="data-analytics">Data Analytics Suite</option>
                  <option value="business-intelligence">Business Intelligence Pro</option>
                  <option value="cloud-infrastructure">Cloud Infrastructure Manager</option>
                  <option value="workflow-automation">Workflow Automation Engine</option>
                  <option value="custom">Custom Solution</option>
                  <option value="consultation">General Consultation</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm xs:text-base font-medium text-white mb-2">
                  Tell us about your project *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 sm:py-4 rounded-lg bg-black/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none text-sm xs:text-base"
                  placeholder="Describe your needs, goals, and any specific requirements..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 sm:py-5 px-8 rounded-xl font-semibold text-base sm:text-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/30"
                style={{
                  fontFamily: '"cc-pixel-arcade-cartridge", sans-serif'
                }}
              >
                Submit Request
              </button>
            </form>
          </div>
        </section>

        {/* Additional CTA */}
        <section className="max-w-4xl mx-auto pb-20 text-center">
          <div className="bg-gradient-to-br from-neutral-900/80 to-black/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 border border-white/10">
            <h2 
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6"
              style={{
                fontFamily: '"natom-pro", sans-serif',
                fontWeight: 700
              }}
            >
              Prefer to Talk?
            </h2>
            <p className="text-sm xs:text-base sm:text-lg text-white/70 mb-6 sm:mb-8">
              Give us a call or send us an email
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <a 
                href="tel:+15551234567"
                className="flex items-center gap-3 text-base sm:text-lg text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span className="text-xl sm:text-2xl">📞</span>
                <span>+1 (555) 123-4567</span>
              </a>
              <a 
                href="mailto:hello@struxture.com"
                className="flex items-center gap-3 text-base sm:text-lg text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span className="text-xl sm:text-2xl">📧</span>
                <span>hello@struxture.com</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

