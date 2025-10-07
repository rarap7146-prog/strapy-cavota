import { Metadata } from 'next'

interface StrapiSEO {
  metaTitle?: string
  metaDescription?: string
  metaImage?: {
    url: string
    alternativeText?: string
  }
  keywords?: string
  metaRobots?: string
  structuredData?: string
  metaViewport?: string
  canonicalURL?: string
}

interface SEOConfig {
  siteName: string
  siteUrl: string
  defaultImage: string
}

export function mapStrapiSeoToMetadata(
  seo: StrapiSEO,
  config: SEOConfig
): Metadata {
  const {
    metaTitle,
    metaDescription,
    metaImage,
    keywords,
    metaRobots,
    canonicalURL,
  } = seo

  const title = metaTitle || config.siteName
  const description = metaDescription || `${config.siteName} - Leading Indonesian Consulting Firm`
  const imageUrl = metaImage?.url 
    ? (metaImage.url.startsWith('http') ? metaImage.url : `${config.siteUrl}${metaImage.url}`)
    : `${config.siteUrl}${config.defaultImage}`

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords?.split(',').map(k => k.trim()),
    
    openGraph: {
      type: 'website',
      title,
      description,
      url: config.siteUrl,
      siteName: config.siteName,
      images: [
        {
          url: imageUrl,
          alt: metaImage?.alternativeText || title,
        },
      ],
    },
    
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    
    robots: metaRobots || {
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
  }

  if (canonicalURL) {
    metadata.alternates = {
      canonical: canonicalURL,
    }
  }

  return metadata
}

// Generate structured data for different content types
export function generateArticleStructuredData({
  title,
  description,
  author,
  publishedAt,
  modifiedAt,
  image,
  url,
}: {
  title: string
  description: string
  author?: string
  publishedAt: string
  modifiedAt?: string
  image?: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: {
      '@type': 'Organization',
      name: author || 'CAVOTA',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CAVOTA',
      logo: {
        '@type': 'ImageObject',
        url: 'https://cavota.id/images/logo.png',
      },
    },
    datePublished: publishedAt,
    dateModified: modifiedAt || publishedAt,
    image: image || 'https://cavota.id/images/og-default.jpg',
    url,
  }
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CAVOTA',
    url: 'https://cavota.id',
    logo: 'https://cavota.id/images/logo.png',
    description: 'Leading Indonesian consulting firm providing strategic business solutions and expert guidance across various industries.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ID',
      addressLocality: 'Jakarta',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+62-21-5099-1234',
      contactType: 'customer service',
      email: 'info@cavota.id',
    },
    sameAs: [
      'https://linkedin.com/company/cavota',
      'https://twitter.com/cavota_id',
      'https://instagram.com/cavota_id',
    ],
  }
}