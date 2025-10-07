'use client'

import { useEffect } from 'react'
import { Navbar } from './Navbar'

type Locale = 'id' | 'en'

interface PageData {
  title?: string
  heroSection?: {
    eyebrow?: string
    heading?: string
    subheading?: string
  }
}

interface DynamicHeaderProps {
  locale: Locale
  strings: any
  pageData?: PageData
}

export function DynamicHeader({ locale, strings, pageData }: DynamicHeaderProps) {
  return <Navbar locale={locale} strings={strings} />
}