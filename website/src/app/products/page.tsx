'use client';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import LoadingSpinner from '@/components/LoadingSpinner';

// Lazy load TileWorld to reduce initial bundle size
const TileWorld = dynamic(() => import('@/pokemon-world/TileWorld'), {
  ssr: false,
  loading: () => <LoadingSpinner />
});

export default function Products() {
  // Set page metadata
  useEffect(() => {
    document.title = 'Our Products - StruXture | Innovative Digital Solutions';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Explore StruXture\'s suite of innovative digital products designed to transform your business. From data analytics to cloud infrastructure management.');
    }
  }, []);
  return (
    <div className="min-h-screen w-screen bg-black relative overflow-x-hidden">
      <Header />
      
      {/* Hero Section with Background Image */}
      <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/Productsbackground.png" 
            alt="StruXture Products - Innovative Digital Solutions"
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-blue-900/20 to-slate-900"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
          <h1 
            className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 md:mb-8 drop-shadow-2xl"
            style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontWeight: 700,
              fontStyle: 'normal'
            }}
          >
            Our Products
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white max-w-4xl mx-auto px-4 drop-shadow-lg">
            Innovative digital solutions designed to transform your business
          </p>
        </div>
      </section>

      {/* Interactive Game Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 
              className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
              style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: 700
              }}
            >
              Explore Our World
            </h2>
            <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto">
              Walk into houses to discover our products and services
            </p>
          </div>
        </div>
        <TileWorld />
      </section>
      
      {/* Product Information Section */}
      <section className="min-h-[100vh] py-16 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
        <div className="max-w-7xl mx-auto text-white relative z-10">
          
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white"
                style={{
                  fontFamily: 'var(--font-space-grotesk), sans-serif',
                  fontWeight: 700,
                  fontStyle: 'normal'
                }}>
              What We Offer
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-4xl mx-auto">
              Explore our suite of digital solutions designed for modern businesses
            </p>
          </div>

          {/* Content Block 1: Text + Image */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20">
            {/* Text Content */}
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white"
                  style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                Section Title 1
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-white/70 leading-relaxed">
                Your first paragraph goes here. Describe your product features, benefits, or 
                unique selling points. This is where you tell your product story.
              </p>
              <p className="text-base sm:text-lg md:text-xl text-white/70 leading-relaxed">
                Add a second paragraph to expand on your ideas. Explain what makes your 
                products unique and why customers should choose you.
              </p>
            </div>
            
            {/* Image Placeholder */}
            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-blue-500/10">
              <img 
                src="/StruXturelogowords-removebg-preview.png" 
                alt="StruXture Digital Platform - Enterprise Solutions"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Content Block 2: Video/Media Section */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white"
                  style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                Section Title 2
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
                Introduce your video or media content here. Explain what viewers will learn or see.
              </p>
            </div>
            
            {/* Video Placeholder */}
            <div className="relative w-full max-w-5xl mx-auto h-64 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-blue-500/10">
              <video 
                className="w-full h-full object-cover"
                controls
                poster="/struxturelogo.png"
              >
                <source src="/struxtureds-5-Intro.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Content Block 3: Image + Text (Reversed) */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20">
            {/* Image Placeholder */}
            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-blue-500/10 md:order-1">
              <img 
                src="/struxturelogo.png" 
                alt="StruXture Product Features - Innovative Business Solutions"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Text Content */}
            <div className="space-y-4 md:order-2">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white"
                  style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                Section Title 3
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-white/70 leading-relaxed">
                Another paragraph for your content. You can discuss product features, 
                integrations, or customer success stories here.
              </p>
              <p className="text-base sm:text-lg md:text-xl text-white/70 leading-relaxed">
                Continue building your product narrative. Each block helps showcase 
                different aspects of your offerings.
              </p>
            </div>
          </div>

          {/* Content Block 4: Full-Width Image with Overlay Text */}
          <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-20 shadow-2xl shadow-blue-500/10 border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-transparent z-10"></div>
            <img 
              src="/StruXturelogowords-removebg-preview.png" 
              alt="StruXture Brand Promise - Quality Digital Solutions"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {/* Overlay Text */}
            <div className="absolute inset-0 z-20 flex items-center justify-start px-8 md:px-16">
              <div className="max-w-2xl">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white"
                    style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                  Overlay Title
                </h3>
                <p className="text-base sm:text-lg md:text-xl text-white/80">
                  Text overlaid on image for dramatic effect. Perfect for quotes or key messages.
                </p>
              </div>
            </div>
          </div>

          {/* Content Block 5: Three Column Grid */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-white"
                  style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
                Section Title 4
              </h3>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Column 1 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className="w-full h-48 mb-4 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                  <img 
                    src="/struxturelogo.png" 
                    alt="StruXture Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xl font-bold mb-3 text-white">Product Feature 1</h4>
                <p className="text-base text-white/70">
                  Brief description of this product feature or benefit. Keep it concise.
                </p>
              </div>
              
              {/* Column 2 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className="w-full h-48 mb-4 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                  <div className="flex items-center justify-center h-full">
                    <p className="text-white/40">Your Image Here</p>
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-3 text-white">Product Feature 2</h4>
                <p className="text-base text-white/70">
                  Brief description of this product feature or benefit. Keep it concise.
                </p>
              </div>
              
              {/* Column 3 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className="w-full h-48 mb-4 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                  <div className="flex items-center justify-center h-full">
                    <p className="text-white/40">Your Image Here</p>
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-3 text-white">Product Feature 3</h4>
                <p className="text-base text-white/70">
                  Brief description of this product feature or benefit. Keep it concise.
                </p>
              </div>
            </div>
          </div>

          {/* Final Call-to-Action */}
          <div className="text-center py-16">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-white"
                style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}>
              Ready to Try Our Products?
            </h3>
            <p className="text-lg sm:text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Final message or call-to-action. Encourage visitors to take the next step.
            </p>
            <a 
              href="/get-started"
              className="inline-block px-8 py-4 bg-white text-black hover:bg-white/90 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/20"
              style={{ fontFamily: 'var(--font-space-grotesk), sans-serif' }}
            >
              Get Started
            </a>
          </div>

        </div>
      </section>
    </div>
  );
}

