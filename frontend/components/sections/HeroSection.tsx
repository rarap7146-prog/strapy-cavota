interface HeroButton {
  label: string
  url: string
  isExternal: boolean
  icon?: string
}

interface HeroMedia {
  url: string
  alternativeText?: string
  width: number
  height: number
}

interface HeroSectionProps {
  data: {
    id: number
    eyebrow?: string
    heading: string
    subheading?: string
    style_variant?: string
    buttons?: HeroButton[]
    media_web?: HeroMedia
    media_mobile?: HeroMedia
    // Keep legacy media field for backwards compatibility
    media?: HeroMedia
  }
  locale: 'id' | 'en'
}

export function HeroSection({ data, locale }: HeroSectionProps) {
  const variant = data.style_variant || 'default'
  
  // Get appropriate media for different screen sizes
  // For now, use the legacy media field until we can properly populate the new fields
  const webImage = data.media_web || data.media
  const mobileImage = data.media_mobile || data.media

  // Fallback to the same image for both if only one is available
  const displayWebImage = webImage || mobileImage
  const displayMobileImage = mobileImage || webImage

  // Default variant with responsive background images
  if (variant === 'default' && (displayWebImage || displayMobileImage)) {
    return (
      <section 
        className="relative w-full min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex items-center overflow-hidden"
      >
        {/* Mobile Background Image */}
        {displayMobileImage && (
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transform scale-105 block md:hidden"
            style={{
              backgroundImage: `url(https://cavota.id${displayMobileImage.url})`,
            }}
          />
        )}
        
        {/* Desktop Background Image */}
        {displayWebImage && (
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transform scale-105 hidden md:block"
            style={{
              backgroundImage: `url(https://cavota.id${displayWebImage.url})`,
            }}
          />
        )}
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        
        <div className="container-fluid relative z-20 py-16 md:py-24 lg:py-32">
          <div className="text-center space-y-6 md:space-y-8 max-w-5xl mx-auto">
            {data.eyebrow && (
              <p className="text-sm md:text-base text-white font-medium tracking-wide uppercase">
                {data.eyebrow}
              </p>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white leading-tight">
              {data.heading}
            </h1>
            
            {data.subheading && (
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                {data.subheading}
              </p>
            )}

            {data.buttons && data.buttons.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                {data.buttons.map((button, index) => (
                  <a
                    key={`${button.label}-${index}`}
                    href={button.url}
                    target={button.isExternal ? '_blank' : '_self'}
                    rel={button.isExternal ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-brand-gradient text-white hover:opacity-90 h-12 px-10 transition-opacity shadow-lg"
                  >
                    {button.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Split layout variants (image_left or image_right)
  if ((variant === 'image_left' || variant === 'image_right') && (displayWebImage || displayMobileImage)) {
    const isImageRight = variant === 'image_right'
    
    return (
      <section className="container-fluid py-16 md:py-24 lg:py-32">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[60vh] lg:min-h-[70vh]`}>
          {/* Content */}
          <div className={`space-y-6 md:space-y-8 ${isImageRight ? 'lg:order-1' : 'lg:order-2'} ${isImageRight ? '' : 'lg:text-left text-center'}`}>
            {data.eyebrow && (
              <p className="text-sm md:text-base text-brand-red font-medium tracking-wide uppercase">
                {data.eyebrow}
              </p>
            )}
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-brand-gradient leading-tight">
              {data.heading}
            </h1>
            
            {data.subheading && (
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl lg:max-w-none">
                {data.subheading}
              </p>
            )}

            {data.buttons && data.buttons.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                {data.buttons.map((button, index) => (
                  <a
                    key={`${button.label}-${index}`}
                    href={button.url}
                    target={button.isExternal ? '_blank' : '_self'}
                    rel={button.isExternal ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-brand-gradient text-white hover:opacity-90 h-12 px-10 transition-opacity"
                  >
                    {button.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Image */}
          <div className={`${isImageRight ? 'lg:order-2' : 'lg:order-1'} w-full`}>
            <div className="relative w-full aspect-[4/3] lg:aspect-[3/4] xl:aspect-[4/3] overflow-hidden rounded-lg shadow-lg">
              {/* Mobile Image */}
              {displayMobileImage && (
                <img
                  src={`https://cavota.id${displayMobileImage.url}`}
                  alt={displayMobileImage.alternativeText || data.heading}
                  className="absolute inset-0 w-full h-full object-cover block md:hidden"
                  width={displayMobileImage.width}
                  height={displayMobileImage.height}
                />
              )}
              
              {/* Desktop Image */}
              {displayWebImage && (
                <img
                  src={`https://cavota.id${displayWebImage.url}`}
                  alt={displayWebImage.alternativeText || data.heading}
                  className="absolute inset-0 w-full h-full object-cover hidden md:block"
                  width={displayWebImage.width}
                  height={displayWebImage.height}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Fallback: centered layout without image (original design)
  return (
    <section className="container-fluid py-16 md:py-24 lg:py-32">
      <div className="text-center space-y-8">
        {data.eyebrow && (
          <p className="text-sm md:text-base text-brand-red font-medium tracking-wide uppercase">
            {data.eyebrow}
          </p>
        )}
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-brand-gradient">
          {data.heading}
        </h1>
        
        {data.subheading && (
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            {data.subheading}
          </p>
        )}

        {data.buttons && data.buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {data.buttons.map((button, index) => (
              <a
                key={`${button.label}-${index}`}
                href={button.url}
                target={button.isExternal ? '_blank' : '_self'}
                rel={button.isExternal ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-brand-gradient text-white hover:opacity-90 h-12 px-10 transition-opacity"
              >
                {button.label}
              </a>
            ))}
          </div>
        )}

        {(displayWebImage || displayMobileImage) && (
          <div className="pt-8">
            {/* Mobile Image */}
            {displayMobileImage && (
              <img
                src={`https://cavota.id${displayMobileImage.url}`}
                alt={displayMobileImage.alternativeText || data.heading}
                className="mx-auto max-w-md h-auto block md:hidden"
                width={displayMobileImage.width}
                height={displayMobileImage.height}
              />
            )}
            
            {/* Desktop Image */}
            {displayWebImage && (
              <img
                src={`https://cavota.id${displayWebImage.url}`}
                alt={displayWebImage.alternativeText || data.heading}
                className="mx-auto max-w-md h-auto hidden md:block"
                width={displayWebImage.width}
                height={displayWebImage.height}
              />
            )}
          </div>
        )}
      </div>
    </section>
  )
}