'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from './ui/Button'

type Locale = 'id' | 'en'

interface NavbarProps {
  locale: Locale
  siteSettings?: {
    org_name: string
    logo?: any
    logo_2x?: any
    logo_dark?: any
    logo_dark_2x?: any
  }
  strings: {
    // Navigation with URLs
    nav_home_text: string
    nav_home_url_id: string
    nav_home_url_en: string
    nav_services_text: string
    nav_services_url_id: string
    nav_services_url_en: string
    nav_insights_text: string
    nav_insights_url_id: string
    nav_insights_url_en: string
    nav_about_text: string
    nav_about_url_id: string
    nav_about_url_en: string
    nav_contact_text: string
    nav_contact_url_id: string
    nav_contact_url_en: string
    
    // Header info
    site_tagline?: string
    site_description?: string
    header_cta_text: string
    header_cta_url_id?: string
    header_cta_url_en?: string
    
    [key: string]: any
  }
}

export function Navbar({ locale, strings, siteSettings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)

  // Check theme on mount and updates
  React.useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark')
      setIsDark(isDarkMode)
    }
    
    checkTheme()
    
    // Watch for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    })
    
    return () => observer.disconnect()
  }, [])

  // Smart logo selection based on theme and availability
  const getLogoSet = () => {
    if (isDark && siteSettings?.logo_dark?.url) {
      // Dark theme with dark logos available
      return {
        regular: siteSettings.logo_dark,
        retina: siteSettings.logo_dark_2x
      }
    } else if (siteSettings?.logo?.url) {
      // Light theme or fallback to regular logos
      return {
        regular: siteSettings.logo,
        retina: siteSettings.logo_2x
      }
    }
    return null
  }

  const logoSet = getLogoSet()

  // Build navigation from strings with proper URLs
  const navigation = [
    { 
      name: strings.nav_home_text, 
      href: locale === 'id' ? strings.nav_home_url_id : strings.nav_home_url_en 
    },
    { 
      name: strings.nav_services_text, 
      href: locale === 'id' ? strings.nav_services_url_id : strings.nav_services_url_en 
    },
    { 
      name: strings.nav_insights_text, 
      href: locale === 'id' ? strings.nav_insights_url_id : strings.nav_insights_url_en 
    },
    { 
      name: strings.nav_about_text, 
      href: locale === 'id' ? strings.nav_about_url_id : strings.nav_about_url_en 
    },
    { 
      name: strings.nav_contact_text, 
      href: locale === 'id' ? strings.nav_contact_url_id : strings.nav_contact_url_en 
    },
  ]

  // CTA button URL - use contact URL since RFP goes to contact form
  const ctaUrl = locale === 'id' ? strings.nav_contact_url_id : strings.nav_contact_url_en

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-fluid">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href={`/${locale}`} className="flex items-center space-x-2">
            {logoSet ? (
              <picture>
                {logoSet.retina?.url && (
                  <source 
                    srcSet={`https://cavota.id${logoSet.retina.url} 2x`}
                    media="(-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx)"
                  />
                )}
                <img 
                  src={`https://cavota.id${logoSet.regular.url}`}
                  alt="Logo" 
                  className="h-10 w-auto object-contain"
                />
              </picture>
            ) : (
              <>
                <div className="w-10 h-10 bg-brand-gradient rounded"></div>
                <span className="font-bold text-xl">CAVOTA</span>
              </>
            )}
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <LangSwitcher currentLocale={locale} />
            <a
              href={ctaUrl}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand-gradient text-white hover:opacity-90 h-9 rounded-md px-3"
            >
              {strings.header_cta_text}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <LangSwitcher currentLocale={locale} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-foreground hover:bg-muted rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="px-3 py-2">
                <a
                  href={ctaUrl}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand-gradient text-white hover:opacity-90 h-10 px-4 py-2 w-full"
                  onClick={() => setIsOpen(false)}
                >
                  {strings.header_cta_text}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  // Initialize theme from localStorage on mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    
    setIsDark(shouldBeDark)
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  )
}

function LangSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const languages = [
    { code: 'id', name: 'ID', flag: '🇮🇩' },
    { code: 'en', name: 'EN', flag: '🇺🇸' },
  ]

  const switchLanguage = (newLocale: string) => {
    // Store current scroll position
    const currentScrollY = window.scrollY
    
    // Extract the current path without the locale prefix
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/'
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
    
    // Store scroll position in sessionStorage for more reliable restoration
    sessionStorage.setItem('preserveScrollPosition', currentScrollY.toString())
    
    // Use Next.js router for client-side navigation with scroll disabled
    router.push(newPath, { scroll: false })
    
    setIsOpen(false)
  }

  // Effect to restore scroll position after navigation
  React.useEffect(() => {
    const preservedScrollY = sessionStorage.getItem('preserveScrollPosition')
    if (preservedScrollY) {
      const scrollY = parseInt(preservedScrollY, 10)
      
      // Use multiple methods to ensure scroll position is restored
      const restoreScroll = () => {
        window.scrollTo({ top: scrollY, behavior: 'instant' })
      }
      
      // Immediate restoration
      restoreScroll()
      
      // Use requestAnimationFrame for reliable DOM-ready restoration
      requestAnimationFrame(restoreScroll)
      
      // Fallback timeout for mobile browsers
      setTimeout(restoreScroll, 0)
      setTimeout(restoreScroll, 10)
      
      // Clean up
      sessionStorage.removeItem('preserveScrollPosition')
    }
  }, [pathname])

  const currentLang = languages.find(lang => lang.code === currentLocale) || languages[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 p-2 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring text-sm"
      >
        <span>{currentLang.flag}</span>
        <span>{currentLang.name}</span>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-24 bg-popover border rounded-md shadow-md z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className={`w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-muted first:rounded-t-md last:rounded-b-md ${
                currentLocale === lang.code ? 'bg-muted' : ''
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}