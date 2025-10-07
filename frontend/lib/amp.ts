/**
 * AMP Utilities for CAVOTA
 * Handles AMP-compliant HTML generation and content sanitization
 */

// Import the MediaFile type from Strapi client
import type { MediaFile } from './strapi/client';

/**
 * Convert media to AMP-compliant image tag
 * @param media Media object from Strapi
 * @param role Image role (cover or inline)
 * @returns AMP-compliant img tag
 */
export function toAmpImage(media: MediaFile, role: "cover" | "inline"): string {
  if (!media) return '';

  // Choose best format - prefer large, fallback to medium, then original
  let imageUrl = media.url;
  let width = media.width || 800;
  let height = media.height || 600;

  if (media.formats?.large) {
    imageUrl = media.formats.large.url;
    width = media.formats.large.width;
    height = media.formats.large.height;
  } else if (media.formats?.medium) {
    imageUrl = media.formats.medium.url;
    width = media.formats.medium.width;
    height = media.formats.medium.height;
  }

  // Ensure absolute URL
  if (imageUrl.startsWith('/')) {
    imageUrl = `https://cavota.id${imageUrl}`;
  }

  const alt = media.alternativeText || media.caption || media.name || 'Image';
  
  // Add specific classes for styling
  const roleClass = role === 'cover' ? 'cover-image' : 'inline-image';
  
  return `<amp-img 
    src="${imageUrl}" 
    width="${width}" 
    height="${height}" 
    layout="responsive" 
    alt="${alt.replace(/"/g, '&quot;')}"
    class="${roleClass}">
  </amp-img>`;
}

/**
 * Sanitize HTML content for AMP compliance
 * @param html Raw HTML content
 * @returns AMP-compliant HTML
 */
export function sanitizeToAmp(html: string): string {
  if (!html) return '';

  let sanitized = html;

  // Remove disallowed script and style tags
  sanitized = sanitized.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  sanitized = sanitized.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

  // Remove inline event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');

  // Convert regular img tags to amp-img
  sanitized = sanitized.replace(/<img([^>]*?)>/gi, (match, attrs) => {
    // Extract attributes
    const srcMatch = attrs.match(/src\s*=\s*["']([^"']*)["']/i);
    const altMatch = attrs.match(/alt\s*=\s*["']([^"']*)["']/i);
    const widthMatch = attrs.match(/width\s*=\s*["']?(\d+)["']?/i);
    const heightMatch = attrs.match(/height\s*=\s*["']?(\d+)["']?/i);

    if (!srcMatch) return ''; // No src, skip

    const src = srcMatch[1];
    const alt = altMatch ? altMatch[1] : '';
    const width = widthMatch ? widthMatch[1] : '800';
    const height = heightMatch ? heightMatch[1] : '600';

    // Ensure absolute URL
    const absoluteSrc = src.startsWith('/') ? `https://cavota.id${src}` : src;

    return `<amp-img src="${absoluteSrc}" width="${width}" height="${height}" layout="responsive" alt="${alt}" class="inline-image"></amp-img>`;
  });

  // Convert video tags to amp-video
  sanitized = sanitized.replace(/<video([^>]*?)>([\s\S]*?)<\/video>/gi, (match, attrs, content) => {
    const srcMatch = attrs.match(/src\s*=\s*["']([^"']*)["']/i);
    const widthMatch = attrs.match(/width\s*=\s*["']?(\d+)["']?/i);
    const heightMatch = attrs.match(/height\s*=\s*["']?(\d+)["']?/i);

    if (!srcMatch) return ''; // No src, skip

    const src = srcMatch[1];
    const width = widthMatch ? widthMatch[1] : '640';
    const height = heightMatch ? heightMatch[1] : '360';

    const absoluteSrc = src.startsWith('/') ? `https://cavota.id${src}` : src;

    return `<amp-video src="${absoluteSrc}" width="${width}" height="${height}" layout="responsive" controls></amp-video>`;
  });

  // Convert YouTube iframes to amp-youtube
  sanitized = sanitized.replace(/<iframe[^>]*youtube\.com\/embed\/([^"'\s?&]+)[^>]*><\/iframe>/gi, (match, videoId) => {
    return `<amp-youtube data-videoid="${videoId}" layout="responsive" width="480" height="270"></amp-youtube>`;
  });

  // Remove other iframes that aren't converted to AMP components
  sanitized = sanitized.replace(/<iframe(?![^>]*amp-)[^>]*>[\s\S]*?<\/iframe>/gi, '');

  // Clean up any remaining dangerous attributes
  sanitized = sanitized.replace(/\s*(style|onclick|onload|onerror)\s*=\s*["'][^"']*["']/gi, '');

  // Ensure links have proper attributes for external links
  sanitized = sanitized.replace(/<a([^>]*?)>/gi, (match, attrs) => {
    if (attrs.includes('target="_blank"') || attrs.includes("target='_blank'")) {
      if (!attrs.includes('rel=')) {
        return `<a${attrs} rel="noopener nofollow">`;
      }
    }
    return match;
  });

  return sanitized;
}

/**
 * Generate minimal AMP-compliant CSS
 * @returns CSS string under 75KB
 */
export function buildAmpCss(): string {
  return `
/* CAVOTA AMP Styles - Mobile-first Typography */
:root {
  --brand-primary: #A20F16;
  --brand-secondary: #E51E29;
  --accent: #DEEEED;
  --text-primary: #1a1a1a;
  --text-secondary: #6b7280;
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --border: #e5e7eb;
  --max-content-width: 65ch;
}

/* Reset and Base */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-primary);
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-primary);
  -webkit-text-size-adjust: 100%;
}

/* Layout */
.container {
  max-width: var(--max-content-width);
  margin: 0 auto;
  padding: 0 1rem;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  line-height: 1.2;
  margin-bottom: 0.5em;
  color: var(--text-primary);
}

h1 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

h2 {
  font-size: clamp(1.5rem, 3.5vw, 2rem);
  font-weight: 600;
}

h3 {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 600;
}

p, li {
  margin-bottom: 1em;
  max-width: var(--max-content-width);
}

/* Links */
a {
  color: var(--brand-primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

a:hover {
  border-bottom-color: var(--brand-primary);
}

/* Lists */
ul, ol {
  margin-left: 1.5rem;
  margin-bottom: 1em;
}

/* Blockquotes */
blockquote {
  border-left: 4px solid var(--brand-primary);
  padding-left: 1rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: var(--text-secondary);
}

/* Images */
.cover-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.inline-image {
  width: 100%;
  height: auto;
  margin: 1rem 0;
  border-radius: 4px;
}

/* Article Structure */
.breadcrumb {
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.breadcrumb a {
  color: var(--brand-primary);
}

.article-header {
  margin-bottom: 2rem;
  text-align: center;
}

.article-meta {
  margin: 1rem 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-align: center;
}

.article-meta .author {
  font-weight: 600;
  color: var(--text-primary);
}

.article-body {
  margin-bottom: 3rem;
}

.article-body > * + * {
  margin-top: 1.5rem;
}

/* Tags */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
  justify-content: center;
}

.tag {
  background: var(--accent);
  color: var(--brand-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  border-bottom: none;
}

/* CTA Strip */
.cta-strip {
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
  color: white;
  padding: 2rem 1rem;
  text-align: center;
  margin: 3rem 0;
  border-radius: 8px;
}

.cta-strip h3 {
  color: white;
  margin-bottom: 1rem;
}

.cta-button {
  display: inline-block;
  background: white;
  color: var(--brand-primary);
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  border-bottom: none;
  transition: transform 0.2s;
}

.cta-button:hover {
  transform: translateY(-1px);
  border-bottom: none;
}

/* Footer */
.footer {
  border-top: 1px solid var(--border);
  padding: 2rem 1rem;
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 3rem;
}

/* Media Queries */
@media (min-width: 768px) {
  .container {
    padding: 0 2rem;
  }
  
  .article-header {
    text-align: left;
  }
  
  .article-meta {
    text-align: left;
  }
  
  .tags {
    justify-content: flex-start;
  }
}

/* AMP-specific optimizations */
amp-img {
  background-color: var(--bg-secondary);
}

amp-youtube {
  margin: 1.5rem 0;
}

/* Ensure content readability */
.article-body h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.article-body h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

/* Responsive spacing */
@media (max-width: 480px) {
  .container {
    padding: 0 0.75rem;
  }
  
  .cta-strip {
    margin: 2rem -0.75rem;
    border-radius: 0;
  }
}
`.trim();
}

/**
 * Extract required AMP component scripts from content
 * @param html Sanitized HTML content
 * @returns Array of required AMP component script URLs
 */
export function getRequiredAmpComponents(html: string): string[] {
  const components = new Set<string>();
  
  // Always include amp-img as it's used for images
  components.add('<script async custom-element="amp-img" src="https://cdn.ampproject.org/v0/amp-img-0.1.js"></script>');
  
  // Check for amp-video
  if (html.includes('<amp-video')) {
    components.add('<script async custom-element="amp-video" src="https://cdn.ampproject.org/v0/amp-video-0.1.js"></script>');
  }
  
  // Check for amp-youtube
  if (html.includes('<amp-youtube')) {
    components.add('<script async custom-element="amp-youtube" src="https://cdn.ampproject.org/v0/amp-youtube-0.1.js"></script>');
  }
  
  // Check for amp-accordion (if we add it in the future)
  if (html.includes('<amp-accordion')) {
    components.add('<script async custom-element="amp-accordion" src="https://cdn.ampproject.org/v0/amp-accordion-0.1.js"></script>');
  }
  
  return Array.from(components);
}