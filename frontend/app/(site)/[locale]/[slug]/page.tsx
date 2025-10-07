import { DynamicPage } from '../../../../components/DynamicPage'
import { strapiClient } from '../../../../lib/strapi/client'
import { mapStrapiSeoToMetadata } from '../../../../lib/seo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Locale = 'id' | 'en'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

function validateLocale(locale: string): Locale {
  if (locale === 'id' || locale === 'en') {
    return locale
  }
  return 'id'
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
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
      title: page?.title || 'CAVOTA',
      description: page?.description || (locale === 'id' 
        ? 'CAVOTA adalah agensi digital terkemuka di Indonesia yang menyediakan solusi bisnis strategis.'
        : 'CAVOTA is a leading digital agency in Indonesia providing strategic business solutions.'
      ),
      openGraph: {
        title: page?.title || 'CAVOTA',
        description: page?.description || (locale === 'id'
          ? 'CAVOTA adalah agensi digital terkemuka di Indonesia yang menyediakan solusi bisnis strategis.'
          : 'CAVOTA is a leading digital agency in Indonesia providing strategic business solutions.'
        ),
        url: `https://cavota.id/${locale}/${slug}`,
        siteName: 'CAVOTA',
        locale: locale === 'id' ? 'id_ID' : 'en_US',
        type: 'website',
      },
      alternates: {
        canonical: `https://cavota.id/${locale}/${slug}`,
        languages: {
          'id': `https://cavota.id/id/${slug}`,
          'en': `https://cavota.id/en/${slug}`,
        },
      },
    }
  } catch (error) {
    console.warn('Failed to fetch page SEO, using fallbacks:', error)
    return {
      title: 'CAVOTA',
      description: locale === 'id' 
        ? 'CAVOTA - Agensi Digital Terkemuka Indonesia'
        : 'CAVOTA - Leading Indonesian Digital Agency',
    }
  }
}

export async function generateStaticParams() {
  try {
    // Get all pages for both locales
    const [idPages, enPages] = await Promise.all([
      strapiClient.getAllPages('id'),
      strapiClient.getAllPages('en')
    ])

    const params = []
    
    // Add Indonesian pages
    if (idPages) {
      for (const page of idPages) {
        if (page.slug && page.slug !== 'beranda') { // Skip homepage
          params.push({ locale: 'id', slug: page.slug })
        }
      }
    }
    
    // Add English pages  
    if (enPages) {
      for (const page of enPages) {
        if (page.slug && page.slug !== 'home') { // Skip homepage
          params.push({ locale: 'en', slug: page.slug })
        }
      }
    }
    
    return params
  } catch (error) {
    console.warn('Failed to generate static params for pages:', error)
    return []
  }
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam, slug } = await params
  const locale = validateLocale(localeParam)
  
  try {
    const page = await strapiClient.getPageBySlug(slug, locale, '*', {
      next: { 
        tags: [`page:${slug}:${locale}`] 
      }
    })
    
    if (!page) {
      notFound()
    }
    
    if (page.sections) {
      return <DynamicPage sections={page.sections} locale={locale} />
    }
    
    // Fallback if no sections
    return (
      <div className="container-fluid py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
          {page.description && (
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {page.description}
            </p>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Failed to fetch page:', error)
    notFound()
  }
}