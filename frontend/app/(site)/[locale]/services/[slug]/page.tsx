import { DynamicPage } from '../../../../../components/DynamicPage'
import { strapiClient } from '../../../../../lib/strapi/client'
import { mapStrapiSeoToMetadata } from '../../../../../lib/seo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Locale = 'id' | 'en'

interface ServicePageProps {
  params: Promise<{ locale: string; slug: string }>
}

function validateLocale(locale: string): Locale {
  if (locale === 'id' || locale === 'en') {
    return locale
  }
  return 'id'
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params
  const locale = validateLocale(localeParam)
  
  try {
    const page = await strapiClient.getPageBySlug(slug, locale, '*')
    
    if (page?.seo) {
      return mapStrapiSeoToMetadata(page.seo, {
        siteName: 'CAVOTA',
        siteUrl: 'https://cavota.id',
        defaultImage: '/images/og-default.jpg',
      })
    }
    
    // Fallback metadata using page title
    return {
      title: page?.title || 'CAVOTA Services',
      description: page?.description || (locale === 'id' 
        ? 'Layanan CAVOTA - Solusi digital terpadu untuk bisnis Anda.'
        : 'CAVOTA Services - Integrated digital solutions for your business.'
      ),
      openGraph: {
        title: page?.title || 'CAVOTA Services',
        description: page?.description || (locale === 'id'
          ? 'Layanan CAVOTA - Solusi digital terpadu untuk bisnis Anda.'
          : 'CAVOTA Services - Integrated digital solutions for your business.'
        ),
        url: `https://cavota.id/${locale}/${locale === 'id' ? 'layanan' : 'services'}/${slug}`,
        siteName: 'CAVOTA',
        locale: locale === 'id' ? 'id_ID' : 'en_US',
        type: 'website',
      },
      alternates: {
        canonical: `https://cavota.id/${locale}/${locale === 'id' ? 'layanan' : 'services'}/${slug}`,
        languages: {
          'id': `https://cavota.id/id/layanan/${slug}`,
          'en': `https://cavota.id/en/services/${slug}`,
        },
      },
    }
  } catch (error) {
    console.warn('Failed to fetch page SEO for service:', error)
    return {
      title: 'CAVOTA Services',
      description: locale === 'id' 
        ? 'Layanan CAVOTA - Solusi digital terpadu untuk bisnis Anda.'
        : 'CAVOTA Services - Integrated digital solutions for your business.',
    }
  }
}

export async function generateStaticParams() {
  try {
    // Get all custom pages (service pages)
    const pages = await strapiClient.getAllPages()
    
    if (!pages || !Array.isArray(pages)) {
      console.warn('No pages found for service static params generation')
      return []
    }
    
    const servicePages = pages.filter((page: any) => page.page_type === 'custom')
    
    const params = []
    
    for (const page of servicePages) {
      // For Indonesian pages, remove 'layanan-' prefix if present
      let slug = page.slug
      if (page.locale === 'id' && slug.startsWith('layanan-')) {
        slug = slug.replace('layanan-', '')
      }
      
      params.push({
        locale: page.locale || 'id',
        slug: slug
      })
    }
    
    console.log('Generated service static params:', params)
    return params
  } catch (error) {
    console.error('Error generating static params for services:', error)
    return []
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { locale: localeParam, slug } = await params
  const locale = validateLocale(localeParam)
  
  try {
    // For Indonesian locale, try both with and without 'layanan-' prefix
    let page = null
    
    if (locale === 'id') {
      // First try with 'layanan-' prefix
      page = await strapiClient.getPageBySlug(`layanan-${slug}`, locale, '*')
      
      // If not found, try without prefix
      if (!page) {
        page = await strapiClient.getPageBySlug(slug, locale, '*')
      }
    } else {
      // For English, just use the slug as is
      page = await strapiClient.getPageBySlug(slug, locale, '*')
    }
    
    // Ensure this is a custom/service page
    if (!page || page.page_type !== 'custom') {
      notFound()
    }
    
    if (page?.sections) {
      return <DynamicPage sections={page.sections} locale={locale} />
    }
    
    notFound()
  } catch (error) {
    console.error('Error fetching service page:', error)
    notFound()
  }
}