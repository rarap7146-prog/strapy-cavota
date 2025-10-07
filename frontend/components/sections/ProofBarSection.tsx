interface ProofBarLogo {
  id: number
  url: string
  alternativeText?: string
  width: number
  height: number
}

interface ProofBarItem {
  id: number
  note: string
  logos?: ProofBarLogo[]
}

interface ProofBarSectionProps {
  data: {
    id: number
    title?: string
    items?: ProofBarItem[]
    // Legacy support for single item
    note?: string
    logos?: ProofBarLogo[]
  }
  locale: 'id' | 'en'
}

export function ProofBarSection({ data, locale }: ProofBarSectionProps) {
  // Handle both new nested structure and legacy single item
  const items = data.items || (data.note ? [{ id: data.id, note: data.note, logos: data.logos }] : [])
  
  if (!items || items.length === 0) {
    return null
  }

  return (
    <section className="container-fluid py-8 bg-muted/50">
      {data.title && (
        <div className="text-center mb-8">
          <h2 className="font-semibold text-lg">
            {data.title}
          </h2>
        </div>
      )}
      
      <div className={`grid gap-8 ${
        items.length === 1 ? 'grid-cols-1' :
        items.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
        items.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      }`}>
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-center gap-4 flex-col md:flex-row">
            {item.logos && item.logos.length > 0 && (
              <div className="flex items-center gap-2">
                {item.logos.map((logo) => (
                  <img
                    key={logo.id}
                    src={`http://localhost:1337${logo.url}`}
                    alt={logo.alternativeText || ''}
                    className="w-8 h-8 opacity-60"
                    width={32}
                    height={32}
                  />
                ))}
              </div>
            )}
            <p className="text-sm md:text-base text-muted-foreground font-medium text-center md:text-left">
              {item.note}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}