'use client';
import TileWorld from '@/pokemon-world/TileWorld';

export default function Products() {
  return (
    <div className="min-h-screen bg-black">
      {/* Game Section */}
      <TileWorld />
      
      {/* Product Information Section - CUSTOMIZE YOUR CONTENT HERE */}
      <section className="min-h-[100vh] py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-black">
        <div className="max-w-7xl mx-auto text-white">
          
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
                style={{
                  fontFamily: '"natom-pro", sans-serif',
                  fontWeight: 700,
                  fontStyle: 'normal'
                }}>
              Our Products {/* EDIT: Change this title */}
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl opacity-80 max-w-4xl mx-auto">
              Your tagline or brief introduction here {/* EDIT: Add your tagline */}
            </p>
          </div>

          {/* Content Block 1: Text + Image */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20">
            {/* Text Content */}
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
                  style={{ fontFamily: '"natom-pro", sans-serif' }}>
                Section Title 1 {/* EDIT: First section title */}
              </h3>
              <p className="text-base sm:text-lg md:text-xl opacity-90 leading-relaxed">
                Your first paragraph goes here. Describe your product features, benefits, or 
                unique selling points. This is where you tell your product story.
                {/* EDIT: Replace with your content */}
              </p>
              <p className="text-base sm:text-lg md:text-xl opacity-90 leading-relaxed">
                Add a second paragraph to expand on your ideas. Explain what makes your 
                products unique and why customers should choose you.
                {/* EDIT: Replace with your content */}
              </p>
            </div>
            
            {/* Image Placeholder */}
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
              {/* EDIT: Replace with your image */}
              <img 
                src="/struxtureds-1.png" 
                alt="Description of image"
                className="w-full h-full object-cover"
              />
              {/* Or use this placeholder if you don't have an image yet:
              <div className="flex items-center justify-center h-full">
                <p className="text-white/50 text-lg">Your Image Here</p>
              </div>
              */}
            </div>
          </div>

          {/* Content Block 2: Video/Media Section */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
                  style={{ fontFamily: '"natom-pro", sans-serif' }}>
                Section Title 2 {/* EDIT: Second section title */}
              </h3>
              <p className="text-base sm:text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
                Introduce your video or media content here. Explain what viewers will learn or see.
                {/* EDIT: Replace with your content */}
              </p>
            </div>
            
            {/* Video Placeholder */}
            <div className="relative w-full max-w-5xl mx-auto h-64 md:h-96 lg:h-[500px] rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10">
              {/* EDIT: Replace with your video */}
              <video 
                className="w-full h-full object-cover"
                controls
                poster="/struxtureds-5.png"
              >
                <source src="/struxtureds-5-Intro.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {/* Or use this placeholder:
              <div className="flex items-center justify-center h-full">
                <p className="text-white/50 text-lg">Your Video Here (.mp4, .webm)</p>
              </div>
              */}
            </div>
          </div>

          {/* Content Block 3: Image + Text (Reversed) */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20">
            {/* Image Placeholder */}
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-white/10 md:order-1">
              {/* EDIT: Replace with your image */}
              <img 
                src="/struxtureds-2.png" 
                alt="Description of image"
                className="w-full h-full object-cover"
              />
              {/* Or use placeholder:
              <div className="flex items-center justify-center h-full">
                <p className="text-white/50 text-lg">Your Image Here</p>
              </div>
              */}
            </div>
            
            {/* Text Content */}
            <div className="space-y-4 md:order-2">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
                  style={{ fontFamily: '"natom-pro", sans-serif' }}>
                Section Title 3 {/* EDIT: Third section title */}
              </h3>
              <p className="text-base sm:text-lg md:text-xl opacity-90 leading-relaxed">
                Another paragraph for your content. You can discuss product features, 
                integrations, or customer success stories here.
                {/* EDIT: Replace with your content */}
              </p>
              <p className="text-base sm:text-lg md:text-xl opacity-90 leading-relaxed">
                Continue building your product narrative. Each block helps showcase 
                different aspects of your offerings.
                {/* EDIT: Replace with your content */}
              </p>
            </div>
          </div>

          {/* Content Block 4: Full-Width Image with Overlay Text */}
          <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-20">
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
            {/* EDIT: Replace with your image */}
            <img 
              src="/struxtureds-3.png" 
              alt="Description of image"
              className="w-full h-full object-cover"
            />
            {/* Or use placeholder:
            <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-white/10"></div>
            */}
            
            {/* Overlay Text */}
            <div className="absolute inset-0 z-20 flex items-center justify-start px-8 md:px-16">
              <div className="max-w-2xl">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
                    style={{ fontFamily: '"natom-pro", sans-serif' }}>
                  Overlay Title {/* EDIT: Overlay section title */}
                </h3>
                <p className="text-base sm:text-lg md:text-xl opacity-90">
                  Text overlaid on image for dramatic effect. Perfect for quotes or key messages.
                  {/* EDIT: Replace with your content */}
                </p>
              </div>
            </div>
          </div>

          {/* Content Block 5: Three Column Grid */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
                  style={{ fontFamily: '"natom-pro", sans-serif' }}>
                Section Title 4 {/* EDIT: Fourth section title */}
              </h3>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Column 1 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all">
                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                  {/* EDIT: Add your image */}
                  <img 
                    src="/struxtureds-4.png" 
                    alt="Description"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xl font-bold mb-3">Product Feature 1</h4>
                <p className="text-base opacity-80">
                  Brief description of this product feature or benefit. Keep it concise.
                  {/* EDIT: Replace with your content */}
                </p>
              </div>
              
              {/* Column 2 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all">
                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  {/* EDIT: Add your image */}
                  <div className="flex items-center justify-center h-full">
                    <p className="text-white/50">Your Image Here</p>
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-3">Product Feature 2</h4>
                <p className="text-base opacity-80">
                  Brief description of this product feature or benefit. Keep it concise.
                  {/* EDIT: Replace with your content */}
                </p>
              </div>
              
              {/* Column 3 */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all">
                <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-green-500/20 to-teal-500/20">
                  {/* EDIT: Add your image */}
                  <div className="flex items-center justify-center h-full">
                    <p className="text-white/50">Your Image Here</p>
                  </div>
                </div>
                <h4 className="text-xl font-bold mb-3">Product Feature 3</h4>
                <p className="text-base opacity-80">
                  Brief description of this product feature or benefit. Keep it concise.
                  {/* EDIT: Replace with your content */}
                </p>
              </div>
            </div>
          </div>

          {/* Final Call-to-Action */}
          <div className="text-center py-16">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6"
                style={{ fontFamily: '"natom-pro", sans-serif' }}>
              Ready to Try Our Products? {/* EDIT: CTA title */}
            </h3>
            <p className="text-lg sm:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Final message or call-to-action. Encourage visitors to take the next step.
              {/* EDIT: Replace with your content */}
            </p>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-lg font-semibold transition-all hover:scale-105">
              Get Started {/* EDIT: Button text */}
            </button>
          </div>

        </div>
      </section>
    </div>
  );
}

