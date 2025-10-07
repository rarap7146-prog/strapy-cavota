interface Asset {
  id: number
  kind: 'feature_image' | 'image' | 'video'
  alt?: string
  caption?: string
  file: {
    url: string
    alternativeText?: string
    width?: number
    height?: number
  }
}

interface Work {
  id: number
  title: string
  slug: string
  summary: string
  categories: string
  industry: string
  objective: string
  budget_band: string
  channels: string
  is_enterprise: boolean
  assets?: Asset[]
}

interface CaseCarouselData {
  id: number
  title: string
  layout: string
  cases?: Work[]
}

interface CaseCarouselSectionProps {
  data: CaseCarouselData
  locale: 'id' | 'en'
}

// Server-side component that fetches works
export async function CaseCarouselSection({ data, locale }: CaseCarouselSectionProps) {
  const { title, layout } = data

  // Fetch works from the API with assets populated
  let works: Work[] = []
  
  try {
    const response = await fetch('http://localhost:1337/api/works?populate[assets][populate]=file')
    const worksData = await response.json()
    works = worksData.data || []
  } catch (error) {
    console.error('Failed to fetch works:', error)
  }

  // Limit to first 6 works for display
  const displayedWorks = works.slice(0, 6)

  return (
    <section className="container-fluid py-16 md:py-24 bg-muted/30">
      <div className="text-center mb-16">
        <h2 className="font-semibold mb-4">
          {title}
        </h2>
      </div>

      {works && works.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {displayedWorks.map((work) => {
            // Generate the proper URL based on locale
            const workUrl = locale === 'id' ? `/id/karya/${work.slug}` : `/en/work/${work.slug}`
            
            // Find the feature image from assets (prefer feature_image, fallback to any image)
            const featureImage = work.assets?.find(asset => asset.kind === 'feature_image') 
              || work.assets?.find(asset => asset.kind === 'image')
            const imageUrl = featureImage?.file?.url 
              ? `${process.env.NEXT_PUBLIC_STRAPI_URL || 'https://cavota.id'}${featureImage.file.url}`
              : null
            
            return (
              <a 
                key={work.id}
                href={workUrl}
                className="bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow group block"
              >
                <div className="aspect-video bg-gradient-to-br from-brand-blue to-brand-purple relative overflow-hidden">
                  {imageUrl ? (
                    <img 
                      src={imageUrl}
                      alt={featureImage?.alt || work.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-xs text-white/80 font-medium mb-1">
                      {work.categories} • {work.industry}
                    </div>
                    <h3 className="text-white font-semibold text-lg leading-tight">
                      {work.title}
                    </h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="text-sm text-muted-foreground font-medium mb-3">
                    {work.objective}
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {work.summary}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="inline-block bg-brand-gradient text-white px-2 py-1 rounded text-xs font-medium">
                        {work.channels.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {work.is_enterprise && (
                        <span className="text-xs text-brand-blue font-medium">
                          Enterprise
                        </span>
                      )}
                      <svg className="w-4 h-4 text-muted-foreground group-hover:text-brand-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            {locale === 'id' 
              ? 'Studi kasus sedang dalam proses pengembangan.' 
              : 'Case studies are currently in development.'
            }
          </p>
        </div>
      )}
    </section>
  )
}