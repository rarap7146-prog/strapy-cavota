/**
 * Dynamic XML Sitemap Generator
 * Generates sitemap.xml with all pages, services, insights, and works
 * 
 * Access: https://cavota.id/sitemap.xml
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cavota.id';

interface StrapiResponse<T> {
  data: T;
  meta?: any;
}

interface Page {
  id: number;
  slug: string;
  locale: string;
  updatedAt: string;
  page_type?: string;
}

interface ContentItem {
  id: number;
  slug: string;
  locale: string;
  updatedAt: string;
}

/**
 * Fetch all pages from Strapi
 */
async function fetchPages(): Promise<Page[]> {
  try {
    const locales = ['id', 'en'];
    const allPages: Page[] = [];

    for (const locale of locales) {
      const response = await fetch(
        `${STRAPI_URL}/api/pages?locale=${locale}&populate[0]=seo&pagination[pageSize]=100`,
        { 
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) continue;

      const data: StrapiResponse<Page[]> = await response.json();
      if (data.data && Array.isArray(data.data)) {
        // Filter out custom page types (they have their own routes)
        const filteredPages = data.data.filter(page => page.page_type !== 'custom');
        allPages.push(...filteredPages);
      }
    }

    return allPages;
  } catch (error) {
    console.error('Error fetching pages:', error);
    return [];
  }
}

/**
 * Fetch all services from Strapi
 */
async function fetchServices(): Promise<ContentItem[]> {
  try {
    const locales = ['id', 'en'];
    const allServices: ContentItem[] = [];

    for (const locale of locales) {
      const response = await fetch(
        `${STRAPI_URL}/api/pages?locale=${locale}&filters[page_type][$eq]=custom&populate[0]=seo&pagination[pageSize]=100`,
        { 
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) continue;

      const data: StrapiResponse<ContentItem[]> = await response.json();
      if (data.data && Array.isArray(data.data)) {
        allServices.push(...data.data);
      }
    }

    return allServices;
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

/**
 * Fetch all insights from Strapi
 */
async function fetchInsights(): Promise<ContentItem[]> {
  try {
    const locales = ['id', 'en'];
    const allInsights: ContentItem[] = [];

    for (const locale of locales) {
      const response = await fetch(
        `${STRAPI_URL}/api/insights?locale=${locale}&pagination[pageSize]=100`,
        { 
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) continue;

      const data: StrapiResponse<ContentItem[]> = await response.json();
      if (data.data && Array.isArray(data.data)) {
        allInsights.push(...data.data);
      }
    }

    return allInsights;
  } catch (error) {
    console.error('Error fetching insights:', error);
    return [];
  }
}

/**
 * Fetch all works from Strapi
 */
async function fetchWorks(): Promise<ContentItem[]> {
  try {
    const locales = ['id', 'en'];
    const allWorks: ContentItem[] = [];

    for (const locale of locales) {
      const response = await fetch(
        `${STRAPI_URL}/api/works?locale=${locale}&pagination[pageSize]=100`,
        { 
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) continue;

      const data: StrapiResponse<ContentItem[]> = await response.json();
      if (data.data && Array.isArray(data.data)) {
        allWorks.push(...data.data);
      }
    }

    return allWorks;
  } catch (error) {
    console.error('Error fetching works:', error);
    return [];
  }
}

/**
 * Format date to W3C format (YYYY-MM-DD)
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * Generate XML sitemap
 */
function generateSitemap(
  pages: Page[], 
  services: ContentItem[], 
  insights: ContentItem[], 
  works: ContentItem[]
): string {
  const urls: string[] = [];

  // Add homepage for both locales (highest priority)
  urls.push(`
  <url>
    <loc>${SITE_URL}/id</loc>
    <lastmod>${formatDate(new Date().toISOString())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`);

  urls.push(`
  <url>
    <loc>${SITE_URL}/en</loc>
    <lastmod>${formatDate(new Date().toISOString())}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`);

  // Add regular pages (0.8 priority)
  pages.forEach(page => {
    const slug = page.slug === 'beranda' ? '' : page.slug;
    const url = `${SITE_URL}/${page.locale}${slug ? '/' + slug : ''}`;
    
    urls.push(`
  <url>
    <loc>${url}</loc>
    <lastmod>${formatDate(page.updatedAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });

  // Add services (0.9 priority - important pages)
  services.forEach(service => {
    const basePath = service.locale === 'id' ? 'layanan' : 'services';
    const url = `${SITE_URL}/${service.locale}/${basePath}/${service.slug}`;
    
    urls.push(`
  <url>
    <loc>${url}</loc>
    <lastmod>${formatDate(service.updatedAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`);
  });

  // Add insights (0.7 priority)
  insights.forEach(insight => {
    const basePath = insight.locale === 'id' ? 'wawasan' : 'insights';
    const url = `${SITE_URL}/${insight.locale}/${basePath}/${insight.slug}`;
    
    urls.push(`
  <url>
    <loc>${url}</loc>
    <lastmod>${formatDate(insight.updatedAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);

    // Add AMP version
    urls.push(`
  <url>
    <loc>${url}/amp</loc>
    <lastmod>${formatDate(insight.updatedAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
  });

  // Add works/portfolio (0.7 priority)
  works.forEach(work => {
    const basePath = work.locale === 'id' ? 'karya' : 'work';
    const url = `${SITE_URL}/${work.locale}/${basePath}/${work.slug}`;
    
    urls.push(`
  <url>
    <loc>${url}</loc>
    <lastmod>${formatDate(work.updatedAt)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  });

  // Generate XML
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('')}
</urlset>`;
}

/**
 * GET handler for sitemap.xml
 */
export async function GET() {
  try {
    // Fetch all content
    const [pages, services, insights, works] = await Promise.all([
      fetchPages(),
      fetchServices(),
      fetchInsights(),
      fetchWorks()
    ]);

    // Generate sitemap XML
    const sitemap = generateSitemap(pages, services, insights, works);

    // Return XML response
    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return minimal sitemap on error
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/id</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/en</loc>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new Response(fallbackSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}

// Revalidate every hour
export const revalidate = 3600;
