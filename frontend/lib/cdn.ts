/**
 * CDN Utilities for CAVOTA
 * Handle asset URL transformations for CDN optimization
 */

const CLOUDFLARE_IMG_BASE = process.env.CLOUDFLARE_IMG_BASE;

/**
 * Convert URL to CDN-optimized version if available
 * @param url Original asset URL
 * @returns CDN-optimized URL or original URL
 */
export function cdnize(url: string): string {
  if (!url) return url;
  
  // If Cloudflare Image Resizing is configured
  if (CLOUDFLARE_IMG_BASE && url.includes('cavota.id')) {
    // Transform Strapi uploads to use Cloudflare Image Resizing
    if (url.includes('/uploads/')) {
      return `${CLOUDFLARE_IMG_BASE}/${encodeURIComponent(url)}`;
    }
  }
  
  // Return original URL if no CDN configuration
  return url;
}

/**
 * Generate responsive image URLs for different sizes
 * @param url Original image URL
 * @param sizes Array of widths to generate
 * @returns Object with responsive URLs
 */
export function generateResponsiveUrls(url: string, sizes: number[] = [320, 640, 1024, 1920]) {
  if (!CLOUDFLARE_IMG_BASE) {
    // Return original URL for all sizes if no CDN
    return sizes.reduce((acc, size) => {
      acc[size] = url;
      return acc;
    }, {} as Record<number, string>);
  }

  return sizes.reduce((acc, size) => {
    acc[size] = `${CLOUDFLARE_IMG_BASE}/width=${size}/${encodeURIComponent(url)}`;
    return acc;
  }, {} as Record<number, string>);
}

/**
 * Optimize image URL for AMP with specific dimensions
 * @param url Original image URL
 * @param width Target width
 * @param height Target height
 * @param quality Image quality (1-100)
 * @returns Optimized image URL
 */
export function optimizeForAmp(url: string, width: number, height: number, quality: number = 85): string {
  if (!CLOUDFLARE_IMG_BASE) {
    return url;
  }

  const params = [
    `width=${width}`,
    `height=${height}`,
    `quality=${quality}`,
    'format=auto', // Let Cloudflare choose the best format
    'fit=cover'
  ].join(',');

  return `${CLOUDFLARE_IMG_BASE}/${params}/${encodeURIComponent(url)}`;
}