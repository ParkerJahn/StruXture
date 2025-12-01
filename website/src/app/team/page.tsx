'use client';
import { useState } from "react";
import Header from "@/components/Header";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/services/firebase';
import {
  sanitizeText,
  sanitizeEmail,
  sanitizePhone,
  sanitizeURL,
  sanitizeTextWithLimit,
  checkRateLimit,
  validateFileUpload,
  formatErrorMessage,
  INPUT_LIMITS,
} from '@/utils/security';

export default function Team() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    linkedin: '',
    portfolio: '',
    coverLetter: '',
    resume: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (error) setError('');
    
    // Apply basic sanitization on change (remove null bytes)
    const sanitizedValue = value.replace(/\0/g, '');
    
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file
      const validation = validateFileUpload(file);
      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        alert(validation.error);
        e.target.value = ''; // Clear the file input
        return;
      }
      
      setFormData(prev => ({ ...prev, resume: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Check rate limit
      const rateLimit = checkRateLimit();
      if (!rateLimit.allowed) {
        throw new Error(
          `Too many submissions. Please try again after ${rateLimit.resetTime.toLocaleTimeString()}`
        );
      }

      // Validate file upload
      if (formData.resume) {
        const validation = validateFileUpload(formData.resume);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
      }

      // Validate and sanitize all inputs
      const sanitizedData = {
        fullName: sanitizeTextWithLimit(formData.fullName, INPUT_LIMITS.NAME, 'Full Name'),
        email: sanitizeEmail(formData.email),
        phone: formData.phone ? sanitizePhone(formData.phone, false) : '',
        position: sanitizeText(formData.position),
        experience: formData.experience ? sanitizeTextWithLimit(formData.experience, INPUT_LIMITS.EXPERIENCE, 'Experience') : '',
        linkedin: formData.linkedin ? sanitizeURL(formData.linkedin, false) : '',
        portfolio: formData.portfolio ? sanitizeURL(formData.portfolio, false) : '',
        coverLetter: sanitizeTextWithLimit(formData.coverLetter, INPUT_LIMITS.COVER_LETTER, 'Cover Letter')
      };

      // Additional validation
      if (!sanitizedData.position) {
        throw new Error('Please select a position');
      }

      // Check if Firebase is initialized
      if (!app) {
        throw new Error('Firebase is not initialized. Please contact support.');
      }

      // Get Firebase Functions
      const functions = getFunctions(app);
      const sendJobApplication = httpsCallable(functions, 'sendJobApplication');

      // Send application data with sanitized data (note: file upload would need separate handling with Storage)
      await sendJobApplication(sanitizedData);

      // Success!
      alert('Application submitted successfully! We will be in touch soon.');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        linkedin: '',
        portfolio: '',
        coverLetter: '',
        resume: null
      });
      
      // Reset file input
      const fileInput = document.getElementById('resume') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error submitting application:', error);
      const errorMessage = formatErrorMessage(error);
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-black relative overflow-x-hidden">
      <Header />
      
      {/* Hero Section with Beach Background */}
      <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/Collab2.jpeg" 
            alt="Team collaboration background"
            className="w-full h-full object-cover"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-blue-900/20 to-slate-900"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center">
          <h1 
            className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 md:mb-8 drop-shadow-2xl"
            style={{
              fontFamily: '"natom-pro", sans-serif',
              fontWeight: 700,
              fontStyle: 'normal'
            }}
          >
            Join Our Team
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white max-w-4xl mx-auto px-4 drop-shadow-lg">
            Build the future of business technology with passionate, talented individuals from around the world
          </p>
          <p className="text-base sm:text-lg md:text-xl text-white/90 mt-6 max-w-2xl drop-shadow-lg">
            Work from paradise. Live your best life while creating amazing products.
          </p>
          </div>
        </section>

      {/* Application Form Section */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12 md:mb-16">
            <h2 
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4"
            style={{
              fontFamily: '"natom-pro", sans-serif',
                fontWeight: 700,
                fontStyle: 'normal'
            }}
          >
              Apply Now
          </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Ready to join us? Fill out the form below and we&apos;ll get back to you soon.
            </p>
          </div>

          {/* Form + Image Grid */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            
            {/* Application Form */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl shadow-blue-500/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-white text-sm sm:text-base font-semibold mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    maxLength={INPUT_LIMITS.NAME}
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all"
                    placeholder="John Doe"
                    autoComplete="name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-white text-sm sm:text-base font-semibold mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    maxLength={INPUT_LIMITS.EMAIL}
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                    autoComplete="email"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-white text-sm sm:text-base font-semibold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    maxLength={INPUT_LIMITS.PHONE}
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all"
                    placeholder="+1 (555) 123-4567"
                    autoComplete="tel"
                  />
                </div>

                {/* Position */}
                <div>
                  <label htmlFor="position" className="block text-white text-sm sm:text-base font-semibold mb-2">
                    Position Applying For *
                  </label>
                  <select
                    id="position"
                    name="position"
                    required
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all"
                  >
                    <option value="" className="bg-black">Select a position</option>
                    <option value="developer" className="bg-black">Software Developer</option>
                    <option value="designer" className="bg-black">Product Designer</option>
                    <option value="analyst" className="bg-black">Business Intelligence Analyst</option>
                    <option value="success" className="bg-black">Customer Success Manager</option>
                    <option value="other" className="bg-black">Other</option>
                  </select>
                </div>

                {/* Years of Experience */}
                <div>
                  <label htmlFor="experience" className="block text-white text-sm sm:text-base font-semibold mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    id="experience"
                    name="experience"
                    maxLength={INPUT_LIMITS.EXPERIENCE}
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all"
                    placeholder="e.g., 5 years"
                  />
                </div>

                {/* LinkedIn */}
                <div>
                  <label htmlFor="linkedin" className="block text-white text-sm sm:text-base font-semibold mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    maxLength={INPUT_LIMITS.URL}
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all"
                    placeholder="https://linkedin.com/in/yourprofile"
                    autoComplete="url"
                  />
                </div>

                {/* Portfolio */}
                <div>
                  <label htmlFor="portfolio" className="block text-white text-sm sm:text-base font-semibold mb-2">
                    Portfolio / Website
                  </label>
                  <input
                    type="url"
                    id="portfolio"
                    name="portfolio"
                    maxLength={INPUT_LIMITS.URL}
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all"
                    placeholder="https://yourportfolio.com"
                    autoComplete="url"
                  />
                </div>

                {/* Resume Upload */}
                <div>
                  <label htmlFor="resume" className="block text-white text-sm sm:text-base font-semibold mb-2">
                    Resume / CV *
                  </label>
                  <input
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    required
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/20 file:text-white file:cursor-pointer hover:file:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
                  />
                  <p className="text-white/50 text-xs sm:text-sm mt-2">
                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                  {formData.resume && (
                    <p className="text-green-400 text-xs sm:text-sm mt-1">
                      ✓ {formData.resume.name} ({(formData.resume.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>

                {/* Cover Letter */}
                <div>
                  <label htmlFor="coverLetter" className="block text-white text-sm sm:text-base font-semibold mb-2">
                    Cover Letter / Why You? * ({formData.coverLetter.length}/{INPUT_LIMITS.COVER_LETTER})
                  </label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    required
                    rows={6}
                    maxLength={INPUT_LIMITS.COVER_LETTER}
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about yourself and why you'd be a great fit for StruXture..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-lg font-semibold text-base sm:text-lg bg-white text-black hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    fontFamily: '"natom-pro", sans-serif'
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </div>

            {/* Collaboration Image */}
            <div className="relative h-full min-h-[400px] lg:min-h-[800px] rounded-2xl overflow-hidden border border-white/20 lg:sticky lg:top-8 shadow-2xl shadow-cyan-500/20">
              <img 
                src="/Collab1.jpeg" 
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
              {/* Optional overlay text */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent p-8">
                <h3 
                  className="text-2xl sm:text-3xl font-bold text-white mb-2"
                  style={{ fontFamily: '"natom-pro", sans-serif' }}
                >
                  Join Our Team
                </h3>
                <p className="text-white/80 text-sm sm:text-base">
                  Work with talented individuals from around the globe
                </p>
              </div>
                    </div>
                    
          </div>
          </div>
        </section>
    </div>
  );
}

