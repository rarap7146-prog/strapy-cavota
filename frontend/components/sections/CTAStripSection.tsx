interface CTAButton {
  id: number
  label: string
  url: string
  isExternal: boolean
}

interface CTAStripSectionProps {
  data: {
    id: number
    title?: string
    subtitle?: string
    text: string
    button?: CTAButton
  }
  locale: 'id' | 'en'
}

export function CTAStripSection({ data, locale }: CTAStripSectionProps) {
  const fallbackButtonText = locale === 'id' ? 'Mari Bicara' : 'Let\'s Talk'
  const fallbackContactUrl = locale === 'id' ? '/id/kontak' : '/en/contact'

  const buttonLabel = data.button?.label || fallbackButtonText
  const buttonUrl = data.button?.url || fallbackContactUrl
  const isExternal = data.button?.isExternal || false

  return (
    <section className="container-fluid py-16 bg-brand-gradient">
      <div className="text-center max-w-4xl mx-auto">
        {data.title && (
          <h2 className="text-2xl md:text-3xl text-white font-semibold mb-4">
            {data.title}
          </h2>
        )}
        
        {data.subtitle && (
          <p className="text-lg md:text-xl text-white/90 mb-6">
            {data.subtitle}
          </p>
        )}
        
        <p className="text-xl md:text-2xl text-white mb-8 font-medium">
          {data.text}
        </p>
        
        <a
          href={buttonUrl}
          target={isExternal ? '_blank' : '_self'}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-brand-red hover:bg-white/90 h-12 px-8 text-lg"
        >
          {buttonLabel}
        </a>
      </div>
    </section>
  )
}