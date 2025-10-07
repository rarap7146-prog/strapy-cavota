import { HeroSection } from './sections/HeroSection'
import { ServicesGridSection } from './sections/ServicesGridSection'
import { RichTextSection } from './sections/RichTextSection'
import { MetricsGridSection } from './sections/MetricsGridSection'
import { CTAStripSection } from './sections/CTAStripSection'
import { ProofBarSection } from './sections/ProofBarSection'
import { PlaybookSection } from './sections/PlaybookSection'
import { DynamicContentSection } from './sections/DynamicContentSection'
import { TestimonialCarouselSection } from './sections/TestimonialCarouselSection'
import { CaseCarouselSection } from './sections/CaseCarouselSection'

interface Section {
  __component: string
  [key: string]: any
}

interface DynamicPageProps {
  sections: Section[]
  locale: 'id' | 'en'
}

// Section registry mapping component names to React components
const sectionRegistry = {
  'sections.hero': HeroSection,
  'sections.services-grid': ServicesGridSection,
  'sections.rich-text': RichTextSection,
  'sections.metrics-grid': MetricsGridSection,
  'sections.cta-strip': CTAStripSection,
  'sections.proof-bar': ProofBarSection,
  'sections.playbook': PlaybookSection,
  'sections.dynamic-content': DynamicContentSection,
  'sections.testimonial-carousel': TestimonialCarouselSection,
  'sections.case-carousel': CaseCarouselSection,
}

export function DynamicPage({ sections, locale }: DynamicPageProps) {
  if (!sections || !Array.isArray(sections)) {
    return (
      <div className="container-fluid py-16 text-center">
        <p className="text-muted-foreground">
          {locale === 'id' ? 'Konten tidak tersedia' : 'Content not available'}
        </p>
      </div>
    )
  }

  return (
    <div>
      {sections.map((section, index) => {
        const SectionComponent = sectionRegistry[section.__component as keyof typeof sectionRegistry]
        
        if (!SectionComponent) {
          console.warn(`Unknown section component: ${section.__component}`)
          return null
        }

        return (
          <SectionComponent
            key={`${section.__component}-${index}`}
            data={section as any}
            locale={locale}
          />
        )
      })}
    </div>
  )
}