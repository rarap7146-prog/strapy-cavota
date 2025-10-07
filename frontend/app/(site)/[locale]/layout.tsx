import { Inter } from 'next/font/google'
import '../../../styles/globals.css'
import { Navbar } from '../../../components/Navbar'
import { Footer } from '../../../components/Footer'
import { strapiClient } from '../../../lib/strapi/client'
import { Metadata, Viewport } from 'next'

const inter = Inter({ subsets: ['latin'] })

type Locale = 'id' | 'en'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

function validateLocale(locale: string): Locale {
  if (locale === 'id' || locale === 'en') {
    return locale
  }
  return 'id' // fallback to Indonesian
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#E51E29' },
    { media: '(prefers-color-scheme: dark)', color: '#E51E29' },
  ],
}

export const metadata: Metadata = {
  title: {
    default: 'CAVOTA - Leading Indonesian Consulting Firm',
    template: '%s | CAVOTA',
  },
  description: 'CAVOTA is a leading Indonesian consulting firm providing strategic business solutions and expert guidance across various industries.',
  keywords: ['consulting', 'Indonesia', 'business', 'strategy', 'CAVOTA'],
  authors: [{ name: 'CAVOTA Team' }],
  creator: 'CAVOTA',
  publisher: 'CAVOTA',
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
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    alternateLocale: 'en_US',
    url: 'https://cavota.id',
    siteName: 'CAVOTA',
    title: 'CAVOTA - Leading Indonesian Consulting Firm',
    description: 'CAVOTA is a leading Indonesian consulting firm providing strategic business solutions.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CAVOTA - Leading Indonesian Consulting Firm',
    description: 'CAVOTA is a leading Indonesian consulting firm providing strategic business solutions.',
    creator: '@cavota_id',
  },
  alternates: {
    canonical: 'https://cavota.id',
    languages: {
      'id': 'https://cavota.id/id',
      'en': 'https://cavota.id/en',
    },
  },
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  
  // Fetch global strings for navigation and common UI elements
  let globalStrings: any = {
    // Navigation with URLs
    nav_home_text: locale === 'id' ? 'Beranda' : 'Home',
    nav_home_url_id: '/id',
    nav_home_url_en: '/en',
    nav_services_text: locale === 'id' ? 'Layanan' : 'Services', 
    nav_services_url_id: '/id/services',
    nav_services_url_en: '/en/services',
    nav_insights_text: locale === 'id' ? 'Wawasan' : 'Insights',
    nav_insights_url_id: '/id/insights',
    nav_insights_url_en: '/en/insights',
    nav_about_text: locale === 'id' ? 'Tentang Kami' : 'About Us',
    nav_about_url_id: '/id/about',
    nav_about_url_en: '/en/about',
    nav_contact_text: locale === 'id' ? 'Hubungi Kami' : 'Contact',
    nav_contact_url_id: '/id/contact',
    nav_contact_url_en: '/en/contact',
    
    // Header/Brand
    site_tagline: locale === 'id' ? 'Agensi Digital Premium' : 'Premium Digital Agency',
    site_description: locale === 'id' ? 'Performa, Bukan Janji' : 'Performance, Not Promises',
    header_cta_text: locale === 'id' ? 'Konsultasi' : 'Consultation',
    header_cta_url_id: '/id/contact',
    header_cta_url_en: '/en/contact',
    
    // Footer & Common
    footer: {
      copyright: locale === 'id' 
        ? `© ${new Date().getFullYear()} CAVOTA. Semua hak dilindungi.`
        : `© ${new Date().getFullYear()} CAVOTA. All rights reserved.`,
      description: locale === 'id'
        ? 'Perusahaan konsultan terkemuka di Indonesia yang menyediakan solusi bisnis strategis.'
        : 'Leading Indonesian consulting firm providing strategic business solutions.',
    },
    common: {
      loading: locale === 'id' ? 'Memuat...' : 'Loading...',
      error: locale === 'id' ? 'Terjadi kesalahan' : 'An error occurred',
      retry: locale === 'id' ? 'Coba Lagi' : 'Try Again',
      readMore: locale === 'id' ? 'Baca Selengkapnya' : 'Read More',
    }
  }

  // Initialize site settings fallback
  let siteSettings: any = {
    org_name: 'CAVOTA',
    logo: null,
    logo_2x: null,
    logo_dark: null,
    logo_dark_2x: null
  }

  try {
    // Fetch global strings and site settings from Strapi
    const [globalStringsData, siteSettingsData] = await Promise.all([
      strapiClient.getGlobalStrings(locale),
      strapiClient.getSiteSettings()
    ])
    
    if (globalStringsData) {
      // Merge Strapi data with fallbacks - use slug fields for URLs
      globalStrings = {
        // Navigation with URLs - use slug fields from Strapi to build URLs
        nav_home_text: globalStringsData.nav_home || globalStrings.nav_home_text,
        nav_home_url_id: globalStringsData.nav_home_slug ? `/id${globalStringsData.nav_home_slug.startsWith('/') ? '' : '/'}${globalStringsData.nav_home_slug}` : globalStrings.nav_home_url_id,
        nav_home_url_en: globalStringsData.nav_home_slug ? `/en${globalStringsData.nav_home_slug.startsWith('/') ? '' : '/'}${globalStringsData.nav_home_slug}` : globalStrings.nav_home_url_en,
        
        nav_services_text: globalStringsData.nav_services || globalStrings.nav_services_text,
        nav_services_url_id: globalStringsData.nav_services_slug ? `/id${globalStringsData.nav_services_slug.startsWith('/') ? '' : '/'}${globalStringsData.nav_services_slug}` : globalStrings.nav_services_url_id,
        nav_services_url_en: globalStringsData.nav_services_slug ? `/en${globalStringsData.nav_services_slug.startsWith('/') ? '' : '/'}${globalStringsData.nav_services_slug}` : globalStrings.nav_services_url_en,
        
        nav_insights_text: globalStringsData.nav_insights || globalStrings.nav_insights_text,
        nav_insights_url_id: globalStringsData.nav_insights_slug ? `/id${globalStringsData.nav_insights_slug.startsWith('/') ? '' : '/'}${globalStringsData.nav_insights_slug}` : globalStrings.nav_insights_url_id,
        nav_insights_url_en: globalStringsData.nav_insights_slug ? `/en${globalStringsData.nav_insights_slug.startsWith('/') ? '' : '/'}${globalStringsData.nav_insights_slug}` : globalStrings.nav_insights_url_en,
        
        nav_about_text: globalStringsData.nav_about || globalStrings.nav_about_text,
        nav_about_url_id: globalStringsData.nav_about_slug ? `/id${globalStringsData.nav_about_slug.startsWith('/') ? '' : '/'}${globalStringsData.nav_about_slug}` : globalStrings.nav_about_url_id,
        nav_about_url_en: globalStringsData.nav_about_slug ? `/en${globalStringsData.nav_about_slug.startsWith('/') ? '' : '/'}${globalStringsData.nav_about_slug}` : globalStrings.nav_about_url_en,
        
        nav_contact_text: globalStringsData.nav_contact || globalStrings.nav_contact_text,
        nav_contact_url_id: globalStringsData.nav_contact_slug ? `/id${globalStringsData.nav_contact_slug.startsWith('/') ? '' : '/'}${globalStringsData.nav_contact_slug}` : globalStrings.nav_contact_url_id,
        nav_contact_url_en: globalStringsData.nav_contact_slug ? `/en${globalStringsData.nav_contact_slug.startsWith('/') ? '' : '/'}${globalStringsData.nav_contact_slug}` : globalStrings.nav_contact_url_en,
        
        // Header/Brand
        site_tagline: globalStringsData.site_tagline || globalStrings.site_tagline,
        site_description: globalStringsData.site_description || globalStrings.site_description,
        header_cta_text: globalStringsData.nav_rfp || globalStrings.header_cta_text,
        header_cta_url_id: globalStringsData.nav_contact_slug ? `/id${globalStringsData.nav_contact_slug.startsWith('/') ? '' : '/'}${globalStringsData.nav_contact_slug}` : globalStrings.header_cta_url_id,
        header_cta_url_en: globalStringsData.nav_contact_slug ? `/en${globalStringsData.nav_contact_slug.startsWith('/') ? '' : '/'}${globalStringsData.nav_contact_slug}` : globalStrings.header_cta_url_en,
        
        // Keep existing structure for Footer compatibility
        nav: {
          home: globalStringsData.nav_home_text || globalStringsData.nav_home || globalStrings.nav_home_text,
          services: globalStringsData.nav_services_text || globalStringsData.nav_services || globalStrings.nav_services_text,
          insights: globalStringsData.nav_insights_text || globalStringsData.nav_insights || globalStrings.nav_insights_text,
          about: globalStringsData.nav_about_text || globalStringsData.nav_about || globalStrings.nav_about_text,
          contact: globalStringsData.nav_contact_text || globalStringsData.nav_contact || globalStrings.nav_contact_text,
        },
        footer: {
          copyright: globalStrings.footer.copyright,
          description: globalStringsData.footer_description || globalStrings.footer.description,
        },
        common: {
          loading: globalStrings.common.loading,
          error: globalStringsData.error_msg || globalStrings.common.error,
          retry: globalStrings.common.retry,
          readMore: globalStrings.common.readMore,
        },
        // Footer-specific fields from global strings
        footer_navigation_title: globalStringsData.footer_navigation_title || 'Menu',
        footer_contact_title: globalStringsData.footer_contact_title || 'Contact',
        footer_email_label: globalStringsData.footer_email_label || 'Email',
        footer_phone_label: globalStringsData.footer_phone_label || 'Phone',
        footer_address_label: globalStringsData.footer_address_label || 'Address',
        privacy_policy_text: globalStringsData.privacy_policy_text || 'Privacy Policy',
        privacy_policy_url: globalStringsData.privacy_policy_url || '/privacy',
        terms_conditions_text: globalStringsData.terms_conditions_text || 'Terms & Conditions',
        terms_conditions_url: globalStringsData.terms_conditions_url || '/terms'
      }
    }
    
    // Process site settings
    if (siteSettingsData) {
      siteSettings = {
        org_name: siteSettingsData.org_name || siteSettings.org_name,
        logo: siteSettingsData.logo || siteSettings.logo,
        logo_2x: siteSettingsData.logo_2x || siteSettings.logo_2x,
        logo_dark: siteSettingsData.logo_dark || siteSettings.logo_dark,
        logo_dark_2x: siteSettingsData.logo_dark_2x || siteSettings.logo_dark_2x,
        contact_email: siteSettingsData.contact_email,
        contact_phone: siteSettingsData.contact_phone,
        contact_address: siteSettingsData.contact_address,
        company_address: siteSettingsData.company_address,
        socials: siteSettingsData.socials
      }
    }
  } catch (error) {
    console.warn('Failed to fetch global strings, using fallbacks:', error)
    // Add nav structure to fallbacks for Footer compatibility
    globalStrings.nav = {
      home: globalStrings.nav_home_text,
      services: globalStrings.nav_services_text,
      insights: globalStrings.nav_insights_text,
      about: globalStrings.nav_about_text,
      contact: globalStrings.nav_contact_text,
    }
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar locale={locale} strings={globalStrings} siteSettings={siteSettings} />
          <main className="flex-1">
            {children}
          </main>
          <Footer locale={locale} strings={globalStrings} siteSettings={siteSettings} />
        </div>
      </body>
    </html>
  )
}