import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StruXture - Digital Solutions | Innovative Technology & Creative Design",
  description: "StruXture delivers cutting-edge digital solutions combining innovative technology with creative design. Experience immersive 3D interfaces, modern web development, and transformative digital experiences.",
  keywords: ["digital solutions", "web development", "3D design", "innovative technology", "creative design", "StruXture", "digital innovation", "web design"],
  authors: [{ name: "StruXture" }],
  creator: "StruXture",
  publisher: "StruXture",
  metadataBase: new URL('https://struxture.com'), // Update with your actual domain
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/png' },
    ],
    apple: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://struxturesoftware.com', // Update with your actual domain
    siteName: 'StruXture',
    title: 'StruXture - Digital Solutions | Innovative Technology & Creative Design',
    description: 'StruXture delivers cutting-edge digital solutions combining innovative technology with creative design. Experience immersive 3D interfaces and transformative digital experiences.',
    images: [
      {
        url: '/StruXturelogowords.png',
        width: 1200,
        height: 630,
        alt: 'StruXture Digital Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StruXture - Digital Solutions',
    description: 'Innovative technology meets creative design. Experience the future of digital solutions.',
    images: ['/StruXturelogowords.png'],
    creator: '@struxture', // Update with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'StruXture',
    description: 'Digital Solutions - Innovative technology and creative design',
    url: 'https://struxturesoftware.com',
    logo: 'https://struxturesoftware.com/StruXturelogowords.png',
    sameAs: [
      // Add your social media URLs here
      // 'https://twitter.com/struxture',
      // 'https://linkedin.com/company/struxture',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: 'English',
    },
  };

  return (
    <html lang="en">
      <head>
        {/* DNS Prefetch and Preconnect for performance */}
        <link rel="dns-prefetch" href="https://use.typekit.net" />
        <link rel="dns-prefetch" href="https://p.typekit.net" />
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firebase.googleapis.com" />
        <link rel="preconnect" href="https://firebaseapp.com" />
        
        {/* Fonts - loaded with display swap for better performance */}
        <link rel="preload" href="https://use.typekit.net/gei1cex.css" as="style" />
        <link rel="stylesheet" href="https://use.typekit.net/gei1cex.css" media="print" onLoad={(e) => (e.currentTarget.media = 'all')} />
        <noscript><link rel="stylesheet" href="https://use.typekit.net/gei1cex.css" /></noscript>
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
