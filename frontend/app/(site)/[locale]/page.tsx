import { DynamicPage } from '../../../components/DynamicPage'
import { strapiClient } from '../../../lib/strapi/client'
import { mapStrapiSeoToMetadata } from '../../../lib/seo'
import { Metadata } from 'next'

type Locale = 'id' | 'en'

interface PageProps {
  params: Promise<{ locale: string }>
}

function validateLocale(locale: string): Locale {
  if (locale === 'id' || locale === 'en') {
    return locale
  }
  return 'id'
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  
  try {
    // Use the correct slug based on locale
    const homeSlug = locale === 'id' ? 'beranda' : 'home'
    const page = await strapiClient.getPageBySlug(homeSlug, locale, '*')
    
    if (page?.seo) {
      return mapStrapiSeoToMetadata(page.seo, {
        siteName: 'CAVOTA',
        siteUrl: 'https://cavota.id',
        defaultImage: '/images/og-default.jpg',
      })
    }
  } catch (error) {
    console.warn('Failed to fetch page SEO, using fallbacks:', error)
  }

  // Fallback metadata
  return {
    title: locale === 'id' 
      ? 'CAVOTA - Perusahaan Konsultan Terkemuka Indonesia'
      : 'CAVOTA - Leading Indonesian Consulting Firm',
    description: locale === 'id'
      ? 'CAVOTA adalah perusahaan konsultan terkemuka di Indonesia yang menyediakan solusi bisnis strategis dan panduan ahli di berbagai industri.'
      : 'CAVOTA is a leading Indonesian consulting firm providing strategic business solutions and expert guidance across various industries.',
    openGraph: {
      title: locale === 'id' 
        ? 'CAVOTA - Perusahaan Konsultan Terkemuka Indonesia'
        : 'CAVOTA - Leading Indonesian Consulting Firm',
      description: locale === 'id'
        ? 'CAVOTA adalah perusahaan konsultan terkemuka di Indonesia yang menyediakan solusi bisnis strategis.'
        : 'CAVOTA is a leading Indonesian consulting firm providing strategic business solutions.',
      url: `https://cavota.id/${locale}`,
      siteName: 'CAVOTA',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: `https://cavota.id/${locale}`,
      languages: {
        'id': 'https://cavota.id/id',
        'en': 'https://cavota.id/en',
      },
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale: localeParam } = await params
  const locale = validateLocale(localeParam)
  
  try {
    // Use the correct slug based on locale
    const homeSlug = locale === 'id' ? 'beranda' : 'home'
    const page = await strapiClient.getPageBySlug(homeSlug, locale, '*', {
      next: { 
        tags: [`page:${homeSlug}:${locale}`] 
      }
    })
    
    if (page?.sections) {
      return <DynamicPage sections={page.sections} locale={locale} />
    }
  } catch (error) {
    console.error('Failed to fetch homepage:', error)
  }

  // Fallback content if Strapi is unavailable
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container-fluid py-16 md:py-24 lg:py-32">
        <div className="text-center space-y-6">
          <h1 className="text-brand-gradient font-bold tracking-tight">
            {locale === 'id' 
              ? 'Solusi Konsultan Terkemuka untuk Bisnis Indonesia'
              : 'Leading Consulting Solutions for Indonesian Business'
            }
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {locale === 'id'
              ? 'CAVOTA menyediakan konsultasi strategis yang membantu perusahaan mencapai pertumbuhan berkelanjutan dan transformasi bisnis yang sukses.'
              : 'CAVOTA provides strategic consulting that helps companies achieve sustainable growth and successful business transformation.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-brand-gradient text-white hover:opacity-90 h-12 px-10">
              {locale === 'id' ? 'Mulai Konsultasi' : 'Start Consultation'}
            </button>
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 px-10">
              {locale === 'id' ? 'Pelajari Lebih Lanjut' : 'Learn More'}
            </button>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="container-fluid py-16 bg-muted/30">
        <div className="text-center mb-12">
          <h2 className="font-semibold mb-4">
            {locale === 'id' ? 'Layanan Kami' : 'Our Services'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {locale === 'id'
              ? 'Kami menawarkan berbagai layanan konsultasi yang disesuaikan dengan kebutuhan unik bisnis Anda.'
              : 'We offer a range of consulting services tailored to your business unique needs.'
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-card p-6 rounded-lg border">
              <div className="w-12 h-12 bg-brand-gradient rounded-lg mb-4"></div>
              <h3 className="font-semibold mb-2">
                {locale === 'id' ? `Layanan ${item}` : `Service ${item}`}
              </h3>
              <p className="text-muted-foreground">
                {locale === 'id'
                  ? 'Deskripsi layanan konsultasi yang membantu bisnis Anda berkembang.'
                  : 'Consulting service description that helps your business grow.'
                }
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-fluid py-16">
        <div className="text-center space-y-6">
          <h2 className="font-semibold">
            {locale === 'id' 
              ? 'Siap Mengembangkan Bisnis Anda?'
              : 'Ready to Grow Your Business?'
            }
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {locale === 'id'
              ? 'Hubungi tim ahli kami hari ini untuk konsultasi gratis dan mulai perjalanan transformasi bisnis Anda.'
              : 'Contact our expert team today for a free consultation and start your business transformation journey.'
            }
          </p>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 h-12 px-10">
            {locale === 'id' ? 'Hubungi Kami' : 'Contact Us'}
          </button>
        </div>
      </section>
    </div>
  )
}