'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { href: '/products/', label: 'Our Products' },
    { href: '/team/', label: 'Join Our Team' },
    { href: '/get-started/', label: 'Get Started' }
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-black z-[100] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo - Home Button */}
          <Link href="/" className="flex items-center z-[101]" onClick={closeMenu}>
            <Image
              src="/struxturelogo.png"
              alt="StruXture Logo"
              width={150}
              height={100}
              className="h-10 sm:h-12 w-auto object-contain cursor-pointer transition-opacity hover:opacity-80"
              priority
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white text-sm lg:text-base font-medium transition-all duration-300 nav-link whitespace-nowrap"
                style={{
                  fontFamily: '"cc-pixel-arcade-cartridge", sans-serif',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex flex-col items-center justify-center w-10 h-10 z-[101] focus:outline-none"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-1.5' : 'mb-1'
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : 'mb-1'
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col py-4 space-y-4 bg-black border-t border-white/10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white text-base font-medium transition-all duration-300 hover:text-white/80 px-4 py-2"
                style={{
                  fontFamily: '"cc-pixel-arcade-cartridge", sans-serif',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                }}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

