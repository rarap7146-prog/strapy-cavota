interface ServiceItem {
  id: number
  title: string
  description: string
  subtitle?: string
  url?: string
  isExternal?: boolean
  icon?: {
    url: string
    alternativeText?: string
    width?: number
    height?: number
  }
}

interface ServicesGridData {
  id: number
  title: string
  items?: ServiceItem[]
}

interface ServicesGridSectionProps {
  data: ServicesGridData
  locale: 'id' | 'en'
}

export function ServicesGridSection({ data, locale }: ServicesGridSectionProps) {
  const { title, items } = data

  // Don't render anything if there are no items
  if (!items || items.length === 0) {
    return null
  }

  return (
    <section className="container-fluid py-16 md:py-24">
      <div className="text-center mb-16">
        <h2 className="font-semibold mb-4">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div 
            key={item.id}
            className="bg-card p-8 rounded-lg border hover:shadow-lg transition-shadow group"
          >
            <div className="w-12 h-12 bg-brand-gradient rounded-lg mb-6 flex items-center justify-center overflow-hidden">
              {item.icon?.url ? (
                <img 
                  src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${item.icon.url}`}
                  alt={item.icon.alternativeText || item.title}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <div className="w-6 h-6 bg-white rounded opacity-80" />
              )}
            </div>
            
            <h3 className="font-semibold text-lg mb-3">
              {item.title}
            </h3>
            
            {item.subtitle && (
              <p className="text-sm text-muted-foreground font-medium mb-3">
                {item.subtitle}
              </p>
            )}
            
            <p className="text-muted-foreground leading-relaxed mb-6">
              {item.description}
            </p>
            
            {item.url && (
              <a 
                href={item.url}
                target={item.isExternal ? '_blank' : '_self'}
                rel={item.isExternal ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center text-sm font-medium text-brand-blue hover:text-brand-purple transition-colors"
              >
                {locale === 'id' ? 'Pelajari Lebih Lanjut' : 'Learn More'}
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}