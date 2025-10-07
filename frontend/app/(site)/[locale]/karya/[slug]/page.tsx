import { strapiClient } from '../../../../../lib/strapi/client'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Locale = 'id' | 'en'

interface WorkPageProps {
  params: Promise<{ locale: string; slug: string }>
}

function validateLocale(locale: string): Locale {
  if (locale === 'id' || locale === 'en') {
    return locale
  }
  return 'id'
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params
  const locale = validateLocale(localeParam)
  
  try {
    const response = await fetch(`http://localhost:1337/api/works?filters[slug][$eq]=${slug}`)
    const data = await response.json()
    const work = data.data?.[0]
    
    if (work) {
      return {
        title: work.title,
        description: work.summary,
        openGraph: {
          title: work.title,
          description: work.summary,
          url: `https://cavota.id/${locale}/karya/${slug}`,
          siteName: 'CAVOTA',
          locale: locale === 'id' ? 'id_ID' : 'en_US',
          type: 'article',
        },
        alternates: {
          canonical: `https://cavota.id/${locale}/karya/${slug}`,
        },
      }
    }
    
    return {
      title: 'Work Case Study - CAVOTA',
      description: locale === 'id' 
        ? 'Studi kasus pekerjaan CAVOTA - Lihat bagaimana kami membantu klien mencapai hasil yang luar biasa.'
        : 'CAVOTA work case study - See how we help clients achieve extraordinary results.',
    }
  } catch (error) {
    console.warn('Failed to fetch work metadata:', error)
    return {
      title: 'Work Case Study - CAVOTA',
    }
  }
}

export async function generateStaticParams() {
  try {
    const response = await fetch('http://localhost:1337/api/works')
    const data = await response.json()
    const works = data.data || []
    
    return works.map((work: any) => ({
      locale: work.locale || 'id',
      slug: work.slug
    }))
  } catch (error) {
    console.error('Error generating static params for works:', error)
    return []
  }
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { locale: localeParam, slug } = await params
  const locale = validateLocale(localeParam)
  
  try {
    const response = await fetch(`http://localhost:1337/api/works?filters[slug][$eq]=${slug}&populate=*`)
    const data = await response.json()
    const work = data.data?.[0]
    
    if (!work) {
      notFound()
    }
    
    return (
      <div className="container-fluid py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-muted-foreground">
                {work.categories} • {work.industry}
              </span>
              {work.is_enterprise && (
                <span className="bg-brand-gradient text-white px-2 py-1 rounded text-xs font-medium">
                  Enterprise
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {work.title}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6">
              {work.summary}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <h3 className="font-semibold mb-2">
                  {locale === 'id' ? 'Objektif' : 'Objective'}
                </h3>
                <p className="text-muted-foreground">
                  {work.objective || (locale === 'id' ? 'Tidak disebutkan' : 'Not specified')}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">
                  {locale === 'id' ? 'Anggaran' : 'Budget'}
                </h3>
                <p className="text-muted-foreground">
                  {work.budget_band?.replace(/_/g, ' ').toUpperCase() || (locale === 'id' ? 'Tidak disebutkan' : 'Not specified')}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">
                  {locale === 'id' ? 'Saluran' : 'Channels'}
                </h3>
                <p className="text-muted-foreground">
                  {work.channels?.replace(/_/g, ' ').toUpperCase() || (locale === 'id' ? 'Tidak disebutkan' : 'Not specified')}
                </p>
              </div>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <h2>
              {locale === 'id' ? 'Detail Proyek' : 'Project Details'}
            </h2>
            <div 
              className="text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: work.body || (locale === 'id' ? 'Detail tidak tersedia.' : 'Details not available.') }}
            />
          </div>
          
          <div className="mt-12 pt-8 border-t">
            <a 
              href={locale === 'id' ? '/id' : '/en'}
              className="inline-flex items-center text-brand-blue hover:text-brand-purple transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {locale === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
            </a>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching work:', error)
    notFound()
  }
}