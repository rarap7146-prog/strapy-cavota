/**
 * Favicon Metadata Generator
 * Generates Next.js metadata for favicons
 * Fetches favicon configuration from Strapi
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cavota.id';

interface FaviconSettings {
  data: {
    files?: string[];
    availableFiles?: string[];
  } | null;
}

/**
 * Fetch favicon settings from Strapi
 */
async function getFaviconSettings(): Promise<string[]> {
  try {
    const response = await fetch(`${STRAPI_URL}/api/favicon-settings`, {
      cache: 'no-store', // Always check for updates
    });

    if (!response.ok) {
      return [];
    }

    const data: FaviconSettings = await response.json();
    return data.data?.availableFiles || data.data?.files || [];
  } catch (error) {
    console.error('Error fetching favicon settings:', error);
    return [];
  }
}

/**
 * Generate favicon metadata for Next.js
 * Usage: import { generateFaviconMetadata } from '@/lib/favicons'
 * Then use in layout.tsx: export const metadata = { icons: await generateFaviconMetadata() }
 */
export async function generateFaviconMetadata() {
  const availableFiles = await getFaviconSettings();

  const icons: any = {
    icon: [],
    apple: [],
    other: [],
  };

  // Standard favicon
  if (availableFiles.includes('favicon.ico')) {
    icons.icon.push({
      url: `${STRAPI_URL}/favicons/favicon.ico`,
      type: 'image/x-icon',
    });
  }

  if (availableFiles.includes('favicon.svg')) {
    icons.icon.push({
      url: `${STRAPI_URL}/favicons/favicon.svg`,
      type: 'image/svg+xml',
    });
  }

  if (availableFiles.includes('favicon-96x96.png')) {
    icons.icon.push({
      url: `${STRAPI_URL}/favicons/favicon-96x96.png`,
      sizes: '96x96',
      type: 'image/png',
    });
  }

  // Apple touch icon
  if (availableFiles.includes('apple-touch-icon.png')) {
    icons.apple.push({
      url: `${STRAPI_URL}/favicons/apple-touch-icon.png`,
      sizes: '180x180',
      type: 'image/png',
    });
  }

  // Web app manifest
  if (availableFiles.includes('site.webmanifest')) {
    icons.other.push({
      rel: 'manifest',
      url: `${STRAPI_URL}/favicons/site.webmanifest`,
    });
  }

  return icons;
}

/**
 * Get favicon URLs for manual usage
 */
export async function getFaviconUrls() {
  const availableFiles = await getFaviconSettings();
  
  return {
    favicon: availableFiles.includes('favicon.ico') 
      ? `${STRAPI_URL}/favicons/favicon.ico` 
      : null,
    faviconSvg: availableFiles.includes('favicon.svg')
      ? `${STRAPI_URL}/favicons/favicon.svg`
      : null,
    faviconPng: availableFiles.includes('favicon-96x96.png')
      ? `${STRAPI_URL}/favicons/favicon-96x96.png`
      : null,
    appleTouchIcon: availableFiles.includes('apple-touch-icon.png')
      ? `${STRAPI_URL}/favicons/apple-touch-icon.png`
      : null,
    manifest: availableFiles.includes('site.webmanifest')
      ? `${STRAPI_URL}/favicons/site.webmanifest`
      : null,
  };
}
