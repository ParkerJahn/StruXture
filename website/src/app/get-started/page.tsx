'use client';
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/services/firebase';
import {
  sanitizeText,
  sanitizeEmail,
  sanitizePhone,
  sanitizeTextWithLimit,
  checkRateLimit,
  formatErrorMessage,
  INPUT_LIMITS,
} from '@/utils/security';

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
  // Set page metadata
  useEffect(() => {
    document.title = 'Get Started - StruXture | Request a Consultation';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Start your digital transformation journey with StruXture. Book a free consultation and discover innovative solutions for your business needs.');
    }
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

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

      // Validate and sanitize all inputs
      const sanitizedData = {
        name: sanitizeTextWithLimit(formData.name, INPUT_LIMITS.NAME, 'Name'),
        email: sanitizeEmail(formData.email),
        company: sanitizeTextWithLimit(formData.company, INPUT_LIMITS.COMPANY, 'Company'),
        phone: formData.phone ? sanitizePhone(formData.phone, false) : '',
        service: sanitizeText(formData.service),
        message: sanitizeTextWithLimit(formData.message, INPUT_LIMITS.MESSAGE, 'Message')
      };

      // Additional validation
      if (!sanitizedData.service) {
        throw new Error('Please select a service');
      }

      // Check if Firebase is initialized
      if (!app) {
        throw new Error('Firebase is not initialized. Please contact support.');
      }

      // Get Firebase Functions
      const functions = getFunctions(app);
      const sendConsultation = httpsCallable(functions, 'sendConsultation');

      // Send consultation request with sanitized data
      await sendConsultation(sanitizedData);

      // Success!
      alert('Thank you! We will contact you soon.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        phone: '',
        service: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting consultation request:', error);
      const errorMessage = formatErrorMessage(error);
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (error) setError('');
    
    // Apply basic sanitization on change (remove null bytes, trim on blur)
    const sanitizedValue = value.replace(/\0/g, '');
    
    setFormData({
      ...formData,
      [name]: sanitizedValue
    });
  };

  return (
    <div className="min-h-screen w-screen bg-black relative overflow-x-hidden">
      <Header />
      
      {/* Hero Section with Beach Background */}
      <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/Beach.jpeg" 
            alt="Tranquil beach paradise - Work remotely from anywhere with StruXture"
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
              fontFamily: '"natom-pro", sans-serif',
              fontWeight: 700,
              fontStyle: 'normal'
            }}
          >
            Get Started
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white max-w-4xl mx-auto px-4 drop-shadow-lg">
            Transform your business today with our innovative solutions. Lets build something amazing together.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
        <div className="max-w-7xl mx-auto">
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
                className="bg-gradient-to-br from-cyan-900/70 via-teal-900/60 to-amber-900/70 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-cyan-400/20 hover:border-amber-400/40 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 text-center"
              >
                <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-400/30 to-cyan-500/30 border-2 border-amber-400/60 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <span className="text-xl xs:text-2xl sm:text-3xl font-bold text-amber-300">
                    {step.number}
                  </span>
                </div>
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
        </div>
      </section>

      {/* Contact Form */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-cyan-900/80 via-teal-900/70 to-amber-900/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 border border-cyan-400/30 shadow-2xl shadow-cyan-500/20">
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
                    maxLength={INPUT_LIMITS.NAME}
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 sm:py-4 rounded-lg bg-black/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm xs:text-base"
                    placeholder="John Doe"
                    autoComplete="name"
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
                    maxLength={INPUT_LIMITS.EMAIL}
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 sm:py-4 rounded-lg bg-black/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm xs:text-base"
                    placeholder="john@company.com"
                    autoComplete="email"
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
                    maxLength={INPUT_LIMITS.COMPANY}
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 sm:py-4 rounded-lg bg-black/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm xs:text-base"
                    placeholder="Your Company"
                    autoComplete="organization"
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
                    maxLength={INPUT_LIMITS.PHONE}
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 sm:py-4 rounded-lg bg-black/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all text-sm xs:text-base"
                    placeholder="+1 (555) 123-4567"
                    autoComplete="tel"
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
                  Tell us about your project * ({formData.message.length}/{INPUT_LIMITS.MESSAGE})
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  maxLength={INPUT_LIMITS.MESSAGE}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 sm:py-4 rounded-lg bg-black/50 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none text-sm xs:text-base"
                  placeholder="Describe your needs, goals, and any specific requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 sm:py-5 px-8 rounded-xl font-semibold text-base sm:text-lg bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-500 text-white hover:from-amber-400 hover:via-orange-400 hover:to-cyan-400 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  fontFamily: '"cc-pixel-arcade-cartridge", sans-serif'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Additional CTA */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-cyan-900/70 via-teal-900/60 to-amber-900/70 backdrop-blur-md rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 border border-amber-400/30 shadow-xl shadow-amber-500/20">
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
                href="tel:+15612624601"
                className="flex items-center gap-3 text-base sm:text-lg text-amber-300 hover:text-amber-200 transition-colors font-semibold"
              >
                <span className="text-xl sm:text-2xl">📞</span>
                <span>561-262-4601</span>
              </a>
              <a 
                href="mailto:jahnparker90@gmail.com"
                className="flex items-center gap-3 text-base sm:text-lg text-amber-300 hover:text-amber-200 transition-colors font-semibold"
              >
                <span className="text-xl sm:text-2xl">📧</span>
                <span>jahnparker90@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

