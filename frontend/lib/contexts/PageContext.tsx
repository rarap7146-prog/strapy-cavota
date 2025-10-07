'use client'

import { createContext, useContext, ReactNode, useState } from 'react'

interface PageData {
  title?: string
  heroSection?: {
    eyebrow?: string
    heading?: string
    subheading?: string
  }
}

interface PageContextType {
  pageData: PageData | null
  setPageData: (data: PageData | null) => void
}

const PageContext = createContext<PageContextType | undefined>(undefined)

export function PageProvider({ children }: { children: ReactNode }) {
  const [pageData, setPageData] = useState<PageData | null>(null)

  return (
    <PageContext.Provider value={{ pageData, setPageData }}>
      {children}
    </PageContext.Provider>
  )
}

export function usePageContext() {
  const context = useContext(PageContext)
  if (context === undefined) {
    throw new Error('usePageContext must be used within a PageProvider')
  }
  return context
}