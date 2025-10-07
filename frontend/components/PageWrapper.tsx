'use client'

import { DynamicPage } from './DynamicPage'

type Locale = 'id' | 'en'

interface PageSection {
  __component: string
  id: number
  [key: string]: any
}

interface PageData {
  title?: string
  sections?: PageSection[]
}

interface PageWrapperProps {
  pageData: PageData
  locale: Locale
}

export function PageWrapper({ pageData, locale }: PageWrapperProps) {
  // Extract hero section for header display
  const heroSection = pageData.sections?.find(
    section => section.__component === 'sections.hero'
  )

  // Extract page info for header context
  const pageInfo = {
    title: pageData.title,
    heroSection: heroSection ? {
      eyebrow: heroSection.eyebrow,
      heading: heroSection.heading,
      subheading: heroSection.subheading,
    } : undefined
  }

  // Set page data in a way that can be accessed by the header
  // For now, we'll pass it through a data attribute or use a ref
  // that the header can read from

  return (
    <>
      {/* Hidden data that header can read */}
      <script
        id="page-context"
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(pageInfo)
        }}
      />
      
      {pageData.sections && (
        <DynamicPage sections={pageData.sections} locale={locale} />
      )}
    </>
  )
}