type Locale = 'id' | 'en'

// Icon mapping function
const getIconComponent = (iconName?: string) => {
  switch (iconName) {
    case 'instagram':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12.017 0C8.396 0 7.929.013 6.71.058 5.487.103 4.665.259 3.933.487c-.789.306-1.459.717-2.126 1.384S.5 3.134.194 3.923C-.033 4.655-.19 5.477-.234 6.7-.28 7.919-.29 8.386-.29 12.017c0 3.631.013 4.098.058 5.317.045 1.223.201 2.045.429 2.777.306.789.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.732.228 1.554.385 2.777.43 1.219.044 1.686.055 5.317.055 3.631 0 4.098-.013 5.317-.058 1.223-.045 2.045-.201 2.777-.429a5.9 5.9 0 002.126-1.384 5.9 5.9 0 001.384-2.126c.228-.732.385-1.554.43-2.777.044-1.219.055-1.686.055-5.317 0-3.631-.013-4.098-.058-5.317-.045-1.223-.201-2.045-.429-2.777a5.9 5.9 0 00-1.384-2.126A5.9 5.9 0 0020.794.487C20.062.259 19.24.103 18.017.058 16.798.013 16.331 0 12.017 0zm0 2.161c3.549 0 3.97.013 5.372.056 1.295.059 2.001.276 2.47.458.623.242 1.066.531 1.531.996.466.466.754.908.996 1.531.182.469.399 1.175.458 2.47.043 1.402.056 1.823.056 5.372 0 3.549-.013 3.97-.056 5.372-.059 1.295-.276 2.001-.458 2.47-.242.623-.531 1.066-.996 1.531a4.12 4.12 0 01-1.531.996c-.469.182-1.175.399-2.47.458-1.402.043-1.823.056-5.372.056-3.549 0-3.97-.013-5.372-.056-1.295-.059-2.001-.276-2.47-.458a4.12 4.12 0 01-1.531-.996 4.12 4.12 0 01-.996-1.531c-.182-.469-.399-1.175-.458-2.47-.043-1.402-.056-1.823-.056-5.372 0-3.549.013-3.97.056-5.372.059-1.295.276-2.001.458-2.47.242-.623.531-1.066.996-1.531a4.12 4.12 0 011.531-.996c.469-.182 1.175-.399 2.47-.458 1.402-.043 1.823-.056 5.372-.056z"></path>
          <path d="M12.017 5.838a6.179 6.179 0 100 12.359 6.179 6.179 0 000-12.359zm0 10.199a4.02 4.02 0 110-8.04 4.02 4.02 0 010 8.04zm7.846-10.405a1.441 1.441 0 11-2.883 0 1.441 1.441 0 012.883 0z"></path>
        </svg>
      )
    case 'linkedin':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
        </svg>
      )
    case 'facebook':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
        </svg>
      )
    case 'twitter':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
        </svg>
      )
    case 'youtube':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"></path>
        </svg>
      )
    case 'github':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
        </svg>
      )
    case 'whatsapp':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.484 3.488"></path>
        </svg>
      )
    default:
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM7.5 18.5a1.5 1.5 0 111.5-1.5 1.5 1.5 0 01-1.5 1.5zm5 0a1.5 1.5 0 111.5-1.5 1.5 1.5 0 01-1.5 1.5zm5 0a1.5 1.5 0 111.5-1.5 1.5 1.5 0 01-1.5 1.5z" clipRule="evenodd"></path>
        </svg>
      )
  }
}

interface FooterProps {
  locale: Locale
  strings: {
    footer: {
      copyright: string
      description: string
    }
    nav: {
      home: string
      services: string
      insights: string
      about: string
      contact: string
    }
    // Footer UI text from global strings
    footer_navigation_title: string
    footer_contact_title: string
    footer_email_label: string
    footer_phone_label: string
    footer_address_label: string
    privacy_policy_text: string
    privacy_policy_url: string
    terms_conditions_text: string
    terms_conditions_url: string
    [key: string]: any
  }
  siteSettings: {
    org_name: string
    contact_email?: string
    contact_phone?: string
    contact_address?: string
    company_address?: string
    socials?: Array<{
      label: string
      url: string
      icon?: string
    }>
  }
}

export function Footer({ locale, strings, siteSettings }: FooterProps) {
  const navigation = [
    { name: strings.nav.home, href: `/${locale}` },
    { name: strings.nav.services, href: `/${locale}/services` },
    { name: strings.nav.insights, href: `/${locale}/insights` },
    { name: strings.nav.about, href: `/${locale}/about` },
    { name: strings.nav.contact, href: `/${locale}/contact` },
  ]

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container-fluid py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="font-bold text-xl">{siteSettings.org_name}</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              {strings.footer.description}
            </p>
            <div className="flex space-x-4">
              {siteSettings.socials?.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {getIconComponent(social.icon)}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">
              {strings.footer_navigation_title}
            </h3>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">
              {strings.footer_contact_title}
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              {siteSettings.contact_email && (
                <li>
                  <strong>{strings.footer_email_label}</strong>
                  <br />
                  <a 
                    href={`mailto:${siteSettings.contact_email}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {siteSettings.contact_email}
                  </a>
                </li>
              )}
              {siteSettings.contact_phone && (
                <li>
                  <strong>{strings.footer_phone_label}</strong>
                  <br />
                  <a 
                    href={`tel:${siteSettings.contact_phone}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {siteSettings.contact_phone}
                  </a>
                </li>
              )}
              {siteSettings.contact_address && (
                <li>
                  <strong>{strings.footer_address_label}</strong>
                  <br />
                  {siteSettings.contact_address}
                </li>
              )}
              {siteSettings.company_address && (
                <li>
                  <strong>Company Address</strong>
                  <br />
                  {siteSettings.company_address}
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            {strings.footer.copyright}
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a
              href={strings.privacy_policy_url}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {strings.privacy_policy_text}
            </a>
            <a
              href={strings.terms_conditions_url}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {strings.terms_conditions_text}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}