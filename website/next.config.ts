import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  distDir: 'out',
  
  // Compress output for better performance
  compress: true,
  
  // Generate ETags for caching
  generateEtags: true,
  
  // PoweredBy header removal for security
  poweredByHeader: false,
  
  // React strict mode for better error detection
  reactStrictMode: true,
  
  // Optimize fonts
  optimizeFonts: true,
  
  // Security and performance headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Security Headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://use.typekit.net https://*.firebase.com https://*.firebaseapp.com",
              "style-src 'self' 'unsafe-inline' https://use.typekit.net https://p.typekit.net",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://use.typekit.net https://p.typekit.net",
              "connect-src 'self' https://*.firebase.com https://*.firebaseapp.com https://*.googleapis.com https://*.firebaseio.com",
              "media-src 'self' blob:",
              "object-src 'none'",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests"
            ].join('; ')
          }
        ],
      },
      // Cache static assets
      {
        source: '/public/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
