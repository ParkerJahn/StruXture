'use client';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

/**
 * Optimized Image component that serves WebP with fallback
 * Automatically converts /image.jpg to /image.webp with fallback
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  width,
  height,
}: OptimizedImageProps) {
  // Get the WebP version of the image
  const getWebPSrc = (imgSrc: string): string => {
    const extension = imgSrc.match(/\.(jpg|jpeg|png)$/i);
    if (extension) {
      return imgSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    return imgSrc;
  };

  const webpSrc = getWebPSrc(src);

  return (
    <picture>
      {/* WebP version for modern browsers */}
      <source srcSet={webpSrc} type="image/webp" />
      
      {/* Fallback to original format */}
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        width={width}
        height={height}
        decoding="async"
      />
    </picture>
  );
}

