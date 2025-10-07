/**
 * Strapi Client for CAVOTA Frontend
 * Handles API calls to Strapi backend
 */

// Use different URLs for server-side vs client-side requests
const STRAPI_URL = typeof window === 'undefined' 
  ? 'http://localhost:1337'  // Server-side: always use localhost
  : 'https://cavota.id';  // Client-side: use current domain

const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

interface MediaFile {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    large?: { url: string; width: number; height: number; };
    medium?: { url: string; width: number; height: number; };
    small?: { url: string; width: number; height: number; };
    thumbnail?: { url: string; width: number; height: number; };
  };
  url: string;
  createdAt: string;
  updatedAt: string;
}

interface SEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  metaRobots?: string;
  structuredData?: any;
  metaViewport?: string;
  canonicalURL?: string;
}

interface Insight {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  summary?: string;
  body: string;
  reading_time?: number;
  hero_image?: MediaFile;
  seo?: SEO;
  tags?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  author?: {
    id: number;
    name: string;
  };
  locale: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  localizations?: Array<{
    id: number;
    locale: string;
    slug: string;
  }>;
}

class StrapiClient {
  private baseUrl: string;
  private token?: string;

  constructor() {
    this.baseUrl = STRAPI_URL;
    this.token = STRAPI_TOKEN;
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/api${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Only add authorization token on server-side
    if (this.token && typeof window === 'undefined') {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      throw new Error(`Strapi API error: ${response.status} ${response.statusText}. ${errorText}`);
    }

    return response.json();
  }

  /**
   * Get global strings for navigation and UI labels
   * @param locale Locale (id or en)
   * @returns Global strings data
   */
  async getGlobalStrings(locale: string = 'id'): Promise<any | null> {
    try {
      const endpoint = `/global-strings?locale=${locale}`;
      const response = await this.fetch(endpoint) as StrapiResponse<any>;
      return response.data;
    } catch (error) {
      console.error('Error fetching global strings:', error);
      if (typeof window !== 'undefined') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get site settings
   * @returns Site settings data
   */
  async getSiteSettings(): Promise<any | null> {
    try {
      const endpoint = `/site-settings?populate=*`;
      const response = await this.fetch(endpoint) as StrapiResponse<any>;
      return response.data;
    } catch (error) {
      console.error('Error fetching site settings:', error);
      if (typeof window !== 'undefined') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get page by slug with full population
   * @param slug Page slug
   * @param locale Locale (id or en)
   * @param populate Population options
   * @param options Fetch options (for Next.js caching)
   * @returns Page data
   */
  async getPageBySlug(
    slug: string, 
    locale: string = 'id',
    populate: string = '*', // Use deep population by default
    options: { next?: { tags?: string[]; revalidate?: number } } = {}
  ): Promise<any | null> {
    try {
            // Properly encode the filter parameters for Strapi v5
      const filterParam = `filters[slug][$eq]=${encodeURIComponent(slug)}`;
      // Use Strapi v5 deep population syntax for nested components and media
      // This explicitly lists all the fields to populate including nested ones
      const populateParam = populate === '*' 
        ? 'populate[0]=sections&populate[1]=sections.items&populate[2]=sections.items.icon&populate[3]=sections.metrics&populate[4]=sections.buttons&populate[5]=sections.media&populate[6]=sections.steps&populate[7]=sections.testimonials&populate[8]=sections.media_web&populate[9]=sections.media_mobile&populate[10]=sections.logos&populate[11]=sections.button' 
        : `populate=${populate}`;
      const endpoint = `/pages?${filterParam}&locale=${locale}&${populateParam}`;
      
      const fetchOptions: RequestInit = {};
      if (options.next && typeof window === 'undefined') {
        // Only apply Next.js cache options on server-side
        (fetchOptions as any).next = options.next;
      }

      const response = await this.fetch(endpoint, fetchOptions) as StrapiResponse<any[]>;
      
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching page by slug:', error);
      // For client-side, don't throw errors - just return null for graceful fallback
      if (typeof window !== 'undefined') {
        return null;
      }
      throw error; // Re-throw on server-side
    }
  }

  /**
   * Get all pages for a locale
   * @param locale Locale (id or en)
   * @returns Array of pages
   */
  async getAllPages(locale: string = 'id'): Promise<any[] | null> {
    try {
      const endpoint = `/pages?locale=${locale}&pagination[pageSize]=100`;
      const response = await this.fetch(endpoint) as StrapiResponse<any[]>;
      return response.data || [];
    } catch (error) {
      console.error('Error fetching all pages:', error);
      if (typeof window !== 'undefined') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get insight by slug with full population
   * @param slug Insight slug
   * @param locale Locale (id or en)
   * @param populate Population options
   * @param options Fetch options (for Next.js caching)
   * @returns Insight data
   */
  async getInsightBySlug(
    slug: string,
    locale: string = 'id',
    populate: any = {
      hero_image: { populate: '*' },
      seo: { populate: '*' },
      tags: true,
      author: true,
      localizations: true
    },
    options: { next?: { tags?: string[]; revalidate?: number } } = {}
  ): Promise<Insight | null> {
    try {
      const populateParam = encodeURIComponent(JSON.stringify(populate));
      const endpoint = `/insights?filters[slug][$eq]=${encodeURIComponent(slug)}&locale=${locale}&populate=${populateParam}`;
      
      const fetchOptions: RequestInit = {};
      if (options.next && typeof window === 'undefined') {
        // Only apply Next.js cache options on server-side
        (fetchOptions as any).next = options.next;
      }

      const response = await this.fetch(endpoint, fetchOptions) as StrapiResponse<Insight[]>;
      
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching insight by slug:', error);
      // For client-side, don't throw errors - just return null for graceful fallback
      if (typeof window !== 'undefined') {
        return null;
      }
      throw error; // Re-throw on server-side
    }
  }  /**
   * Get multiple insights with pagination
   * @param locale Locale
   * @param page Page number
   * @param pageSize Items per page
   * @param options Fetch options
   * @returns Insights data with pagination
   */
  async getInsights(
    locale: string = 'id',
    page: number = 1,
    pageSize: number = 10,
    options: { next?: { tags?: string[]; revalidate?: number } } = {}
  ): Promise<StrapiResponse<Insight[]>> {
    try {
      const populate = JSON.stringify({
        hero_image: { populate: '*' },
        seo: { populate: '*' },
        tags: true,
        author: true
      });
      
      const endpoint = `/insights?locale=${locale}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=${encodeURIComponent(populate)}&sort=publishedAt:desc`;
      
      const fetchOptions: RequestInit = {};
      if (options.next && typeof window === 'undefined') {
        // Only apply Next.js cache options on server-side
        (fetchOptions as any).next = options.next;
      }

      return await this.fetch(endpoint, fetchOptions) as StrapiResponse<Insight[]>;
    } catch (error) {
      console.error('Error fetching insights:', error);
      // For client-side, don't throw errors - just return empty data for graceful fallback
      if (typeof window !== 'undefined') {
        return { data: [] };
      }
      throw error; // Re-throw on server-side
    }
  }
}

// Export singleton instance
export const strapiClient = new StrapiClient();

// Export types for use in components
export type { Insight, MediaFile, SEO, StrapiResponse };