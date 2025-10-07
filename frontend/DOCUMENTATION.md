# Cavota Frontend - Detailed Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [App Router Structure](#app-router-structure)
3. [Component Reference](#component-reference)
4. [Strapi Client](#strapi-client)
5. [Hooks Reference](#hooks-reference)
6. [Styling System](#styling-system)
7. [Internationalization](#internationalization)
8. [SEO Implementation](#seo-implementation)
9. [Performance & Caching](#performance--caching)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 15.1.2 (App Router)
- **React**: 18.3.1
- **TypeScript**: 5.6.3
- **Styling**: Tailwind CSS 3.4.15 + CSS Modules
- **Content**: Strapi v5 headless CMS
- **Deployment**: Production on port 3001

### Design Patterns

#### 1. Server Components First
```typescript
// Default: Server Component (no 'use client')
export default async function Page() {
  const data = await fetch(...)  // Direct data fetching
  return <div>{data}</div>
}
```

**Benefits**:
- Zero JavaScript sent to client
- Direct database/API access
- Better SEO
- Faster initial load

#### 2. Client Components When Needed
```typescript
'use client'  // Marks as client component

export function InteractiveNav() {
  const [open, setOpen] = useState(false)  // Client state
  // Interactive features, hooks, event handlers
}
```

**Use Cases**:
- State management (`useState`, `useReducer`)
- Effects (`useEffect`)
- Event handlers
- Browser APIs
- Third-party libraries requiring `window`

#### 3. Dynamic Zone Pattern

Pages are composed of sections:
```typescript
// DynamicPage.tsx
const sectionRegistry = {
  'sections.hero': HeroSection,
  'sections.services-grid': ServicesGridSection,
  // ... map Strapi components to React components
}

sections.map(section => {
  const Component = sectionRegistry[section.__component]
  return <Component data={section} locale={locale} />
})
```

---

## App Router Structure

### Route Organization

```
app/
├── (site)/                    # Route group (doesn't affect URL)
│   └── [locale]/             # Dynamic segment: id or en
│       ├── layout.tsx        # Root layout with Navbar/Footer
│       ├── page.tsx          # Homepage (/id or /en)
│       ├── not-found.tsx     # 404 page
│       ├── [slug]/           # Dynamic pages
│       │   ├── page.tsx      # /id/tentang, /en/about
│       │   └── not-found.tsx
│       ├── karya/            # Portfolio (Indonesian)
│       │   └── [slug]/
│       │       └── page.tsx  # /id/karya/project-name
│       ├── work/             # Portfolio (English)
│       │   └── [slug]/
│       │       └── page.tsx  # /en/work/project-name
│       ├── layanan/          # Services (Indonesian)
│       │   └── [slug]/
│       │       └── page.tsx  # /id/layanan/service-name
│       ├── services/         # Services (English)
│       │   └── [slug]/
│       │       └── page.tsx  # /en/services/service-name
│       └── insights/         # Blog
│           └── [slug]/
│               ├── page.tsx  # Blog post
│               └── amp/
│                   └── route.ts  # AMP version
└── api/                      # API routes
    ├── proxy/
    │   ├── global-strings/
    │   │   └── route.ts      # GET /api/proxy/global-strings
    │   └── site-settings/
    │       └── route.ts      # GET /api/proxy/site-settings
    ├── revalidate/
    │   └── route.ts          # POST /api/revalidate
    └── test-page/
        └── route.ts          # GET /api/test-page
```

### Route Features

#### 1. Dynamic Segments

**Locale Parameter**:
```typescript
// app/(site)/[locale]/page.tsx
interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params  // 'id' or 'en'
  // Use locale for content fetching
}
```

**Slug Parameter**:
```typescript
// app/(site)/[locale]/[slug]/page.tsx
interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params
  const page = await strapiClient.getPageBySlug(slug, locale)
  return <DynamicPage sections={page.sections} locale={locale} />
}
```

#### 2. Static Site Generation

```typescript
// Generate static pages at build time
export async function generateStaticParams() {
  const [idPages, enPages] = await Promise.all([
    strapiClient.getAllPages('id'),
    strapiClient.getAllPages('en')
  ])
  
  return [
    ...idPages.map(page => ({ locale: 'id', slug: page.slug })),
    ...enPages.map(page => ({ locale: 'en', slug: page.slug }))
  ]
}
```

**Output**:
- Pre-renders all pages at build time
- Creates static HTML files
- Instant page loads
- Can be cached by CDN

#### 3. Metadata Generation

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const page = await strapiClient.getPageBySlug(slug, locale)
  
  if (page?.seo) {
    return mapStrapiSeoToMetadata(page.seo, {
      siteName: 'CAVOTA',
      siteUrl: 'https://cavota.id',
      defaultImage: '/images/og-default.jpg',
    })
  }
  
  // Fallback metadata
  return {
    title: page?.title || 'CAVOTA',
    description: page?.description || 'Default description'
  }
}
```

---

## Component Reference

### Core Components

#### 1. DynamicPage (`components/DynamicPage.tsx`)

**Purpose**: Renders page sections dynamically based on Strapi data

**Props**:
```typescript
interface DynamicPageProps {
  sections: Section[]  // Array of section data from Strapi
  locale: 'id' | 'en'
}
```

**Usage**:
```typescript
<DynamicPage sections={pageData.sections} locale="id" />
```

**How It Works**:
1. Receives sections array from Strapi
2. Maps each section's `__component` to React component
3. Renders components in order
4. Passes section data and locale to each component

**Section Registry**:
```typescript
const sectionRegistry = {
  'sections.hero': HeroSection,
  'sections.services-grid': ServicesGridSection,
  'sections.metrics-grid': MetricsGridSection,
  'sections.case-carousel': CaseCarouselSection,
  'sections.testimonial-carousel': TestimonialCarouselSection,
  'sections.proof-bar': ProofBarSection,
  'sections.playbook': PlaybookSection,
  'sections.cta-strip': CTAStripSection,
  'sections.rich-text': RichTextSection,
  'sections.dynamic-content': DynamicContentSection,
}
```

**Adding New Sections**:
1. Create component in `components/sections/`
2. Add to registry in `DynamicPage.tsx`
3. Ensure backend has matching component

---

#### 2. Navbar (`components/Navbar.tsx`)

**Type**: Client Component (`'use client'`)

**Purpose**: Main navigation with responsive menu and language switcher

**Props**:
```typescript
interface NavbarProps {
  locale: 'id' | 'en'
  siteSettings?: {
    org_name: string
    logo?: MediaFile
    logo_2x?: MediaFile
    logo_dark?: MediaFile      // Dark theme logo
    logo_dark_2x?: MediaFile
  }
  strings: {
    nav_home_text: string
    nav_home_url_id: string
    nav_home_url_en: string
    nav_services_text: string
    nav_services_url_id: string
    nav_services_url_en: string
    // ... all navigation strings
  }
}
```

**Features**:
- **Responsive menu**: Desktop horizontal, mobile hamburger
- **Theme-aware logos**: Automatically switches between light/dark logos
- **Language switcher**: Toggle between ID and EN
- **Sticky navigation**: Fixed on scroll (optional)
- **Active state**: Highlights current page

**Logo Selection Logic**:
```typescript
const getLogoSet = () => {
  if (isDark && siteSettings?.logo_dark?.url) {
    // Use dark theme logos
    return {
      regular: siteSettings.logo_dark,
      retina: siteSettings.logo_dark_2x
    }
  } else if (siteSettings?.logo?.url) {
    // Use regular logos
    return {
      regular: siteSettings.logo,
      retina: siteSettings.logo_2x
    }
  }
  return null
}
```

---

#### 3. Footer (`components/Footer.tsx`)

**Type**: Client Component

**Purpose**: Site footer with navigation, social links, and contact info

**Props**: Similar to Navbar (receives global strings and site settings)

**Sections**:
- Logo and company info
- Navigation links
- Social media icons
- Contact details
- Copyright notice

---

### Section Components

All section components follow this pattern:

```typescript
interface SectionProps {
  data: SectionData  // Specific to section type
  locale: 'id' | 'en'
}

export function SectionName({ data, locale }: SectionProps) {
  // Extract data
  const { title, items } = data
  
  // Render section
  return (
    <section className="container-fluid py-16">
      <h2>{title}</h2>
      {/* Section content */}
    </section>
  )
}
```

**Common Patterns**:
- All sections use `container-fluid` for consistent padding
- Responsive spacing with `py-16 md:py-24`
- Early return if required data is missing
- Type-safe props with TypeScript interfaces

---

#### HeroSection (`components/sections/HeroSection.tsx`)

**Purpose**: Banner section with heading, subheading, CTA buttons, and responsive background images

**Props**:
```typescript
interface HeroSectionProps {
  data: {
    id: number
    eyebrow?: string          // Small text above heading
    heading: string           // Main headline
    subheading?: string       // Supporting text
    style_variant?: string    // 'default' | 'image_right' | 'image_left'
    buttons?: HeroButton[]    // CTA buttons
    media_web?: HeroMedia     // Desktop background image
    media_mobile?: HeroMedia  // Mobile background image
    media?: HeroMedia         // Legacy field (fallback)
  }
  locale: 'id' | 'en'
}
```

**Style Variants**:

1. **Default** (Full-screen background):
   ```
   ┌─────────────────────────────────┐
   │  Background Image (responsive)  │
   │                                 │
   │         Eyebrow Text            │
   │      ★ Main Heading ★           │
   │        Subheading               │
   │     [Button] [Button]           │
   │                                 │
   └─────────────────────────────────┘
   ```

2. **Image Right/Left** (Split layout):
   ```
   ┌──────────────┬──────────────┐
   │              │              │
   │   Content    │    Image     │
   │   & Buttons  │              │
   │              │              │
   └──────────────┴──────────────┘
   ```

**Responsive Images**:
```typescript
// Mobile: Show mobile image
<div className="block md:hidden">
  <img src={media_mobile.url} />
</div>

// Desktop: Show web image
<div className="hidden md:block">
  <img src={media_web.url} />
</div>
```

**Fallback Logic**:
- If `media_mobile` missing → use `media_web`
- If `media_web` missing → use `media_mobile`
- If both missing → use `media` (legacy)

---

#### ServicesGridSection (`components/sections/ServicesGridSection.tsx`)

**Purpose**: Grid of service offerings with icons

**Props**:
```typescript
interface ServicesGridData {
  id: number
  title: string
  items?: ServiceItem[]
}

interface ServiceItem {
  id: number
  title: string
  description: string
  subtitle?: string
  url?: string
  isExternal?: boolean
  icon?: MediaFile
}
```

**Layout**:
```
┌──────────┬──────────┬──────────┐
│  [Icon]  │  [Icon]  │  [Icon]  │
│  Title   │  Title   │  Title   │
│  Desc    │  Desc    │  Desc    │
│ [Link]   │ [Link]   │ [Link]   │
└──────────┴──────────┴──────────┘
    1 col     2 cols     3 cols
   mobile    tablet     desktop
```

**Icon Handling**:
```typescript
{item.icon?.url ? (
  <img 
    src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${item.icon.url}`}
    alt={item.icon.alternativeText || item.title}
    className="w-8 h-8 object-contain"
  />
) : (
  <div className="w-6 h-6 bg-white rounded opacity-80" />
)}
```

---

#### MetricsGridSection (`components/sections/MetricsGridSection.tsx`)

**Purpose**: Performance metrics showcase

**Props**:
```typescript
interface MetricsGridData {
  id: number
  title: string
  subtitle?: string
  style_variant?: string
  metrics?: MetricItem[]
}

interface MetricItem {
  id: number
  value: string          // e.g., "150%", "50K+"
  label: string          // Metric name
  description?: string   // Optional explanation
}
```

**Responsive Grid**:
```typescript
const getGridClasses = (metricCount: number) => {
  switch (metricCount) {
    case 1: return "grid-cols-1"
    case 2: return "grid-cols-2 md:grid-cols-2"
    case 3: return "grid-cols-2 md:grid-cols-3"
    case 4: return "grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
    // ... adaptive grid based on metric count
  }
}
```

**Key Features**:
- **Minimum 2 columns on mobile** (user requirement)
- **Left-aligned text** (not centered)
- **Dynamic grid**: Adjusts columns based on metric count
- **Brand gradient values**: Uses `text-brand-gradient` class

---

#### CaseCarouselSection (`components/sections/CaseCarouselSection.tsx`)

**Purpose**: Portfolio/work showcase

**Type**: Server Component (fetches data directly)

**Props**:
```typescript
interface CaseCarouselData {
  id: number
  title: string
  layout: string  // 'cards' | 'highlight'
}
```

**Data Fetching**:
```typescript
// Fetches works with assets populated
const response = await fetch('http://localhost:1337/api/works?populate[assets][populate]=file')
const worksData = await response.json()
```

**Asset Priority**:
```typescript
// 1. Look for feature_image first
const featureImage = work.assets?.find(asset => asset.kind === 'feature_image')
  // 2. Fall back to regular image
  || work.assets?.find(asset => asset.kind === 'image')

// 3. Show gradient background if no image
const imageUrl = featureImage?.file?.url 
  ? `${STRAPI_URL}${featureImage.file.url}`
  : null
```

**Localized URLs**:
```typescript
const workUrl = locale === 'id' 
  ? `/id/karya/${work.slug}` 
  : `/en/work/${work.slug}`
```

---

#### TestimonialCarouselSection (`components/sections/TestimonialCarouselSection.tsx`)

**Purpose**: Client testimonials display

**Props**:
```typescript
interface TestimonialCarouselData {
  id: number
  title: string
  subtitle?: string
  layout: 'cards' | 'highlight' | 'compact'
  max_items: number  // Limit testimonials shown
}
```

**Features**:
- Fetches testimonials from Strapi API
- Displays up to `max_items` testimonials
- Shows quote, author, company, logo
- Responsive card layout

---

#### ProofBarSection (`components/sections/ProofBarSection.tsx`)

**Purpose**: Client logos showcase (trust indicators)

**Props**:
```typescript
interface ProofBarData {
  id: number
  title?: string
  note?: string
  items?: ProofItem[]  // New approach
  logos?: MediaFile[]  // Legacy approach
}

interface ProofItem {
  note: string
  logos: MediaFile[]
}
```

**Supports Two Approaches**:
1. **New**: Use `items` array with grouped logos
2. **Legacy**: Use flat `logos` array

---

#### PlaybookSection (`components/sections/PlaybookSection.tsx`)

**Purpose**: Step-by-step process/methodology display

**Props**:
```typescript
interface PlaybookData {
  id: number
  title: string
  steps?: StepItem[]
}

interface StepItem {
  id: number
  title: string
  description: string
}
```

**Rendering**:
- Automatically numbered steps (1, 2, 3...)
- Responsive layout
- Visual indicators for progress

---

#### CTAStripSection (`components/sections/CTAStripSection.tsx`)

**Purpose**: Call-to-action banner

**Props**:
```typescript
interface CTAStripData {
  id: number
  title?: string
  subtitle?: string
  text: string
  button?: LinkItem
}
```

**Layout**: Full-width banner with centered content and button

---

#### RichTextSection (`components/sections/RichTextSection.tsx`)

**Purpose**: Free-form rich text content

**Props**:
```typescript
interface RichTextData {
  id: number
  content: string  // HTML or Markdown
}
```

**Rendering**:
- Uses `react-markdown` for Markdown content
- Supports HTML passthrough
- Styled with Tailwind typography classes

---

#### DynamicContentSection (`components/sections/DynamicContentSection.tsx`)

**Purpose**: Custom HTML or dynamic content

**Props**:
```typescript
interface DynamicContentData {
  id: number
  content: string  // HTML
}
```

**Use Case**: For one-off custom sections that don't fit other patterns

---

### UI Components

#### Button (`components/ui/Button.tsx`)

**Purpose**: Reusable button component with variants

**Props**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg'
  children: React.ReactNode
}
```

**Variants**:
- `default`: Brand gradient background
- `outline`: Border with transparent background
- `ghost`: No border or background
- `link`: Text link styling

**Usage**:
```typescript
<Button variant="default" size="lg">
  Get Started
</Button>
```

---

#### Link (`components/ui/Link.tsx`)

**Purpose**: Next.js Link wrapper with external link support

**Props**:
```typescript
interface LinkProps {
  href: string
  children: React.ReactNode
  external?: boolean
  className?: string
}
```

**Features**:
- Internal links use Next.js `<Link>` (client-side navigation)
- External links use `<a>` with `rel="noopener noreferrer"`
- Automatic detection of external URLs

---

#### Badge (`components/ui/Badge.tsx`)

**Purpose**: Small label/tag component

**Usage**: For categories, tags, status indicators

---

## Strapi Client

### Overview (`lib/strapi/client.ts`)

Centralized API client for Strapi backend communication.

### Configuration

```typescript
// Use different URLs for server vs client
const STRAPI_URL = typeof window === 'undefined' 
  ? 'http://localhost:1337'  // Server: localhost
  : 'https://cavota.id';     // Client: public domain

const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
```

**Why Different URLs?**
- Server-side: Direct connection to localhost (faster, no SSL overhead)
- Client-side: Public domain (browser can't access localhost)

### Core Methods

#### 1. getPageBySlug()

**Purpose**: Fetch page data by slug and locale

**Signature**:
```typescript
async getPageBySlug(
  slug: string,
  locale: string = 'id',
  populate: string = '*',
  options?: { next?: { tags?: string[]; revalidate?: number } }
): Promise<Page | null>
```

**Usage**:
```typescript
const page = await strapiClient.getPageBySlug('beranda', 'id', '*', {
  next: { tags: ['page:beranda:id'] }
})
```

**Populate Syntax**:
```
// Simple: Populate all first-level relations
populate=*

// Explicit: Populate nested relations
populate[0]=sections
populate[1]=sections.items
populate[2]=sections.items.icon
populate[3]=sections.metrics
populate[4]=sections.buttons
populate[5]=sections.media
populate[6]=sections.media_web
populate[7]=sections.media_mobile
```

**Why Explicit Population?**
Strapi v5 dynamic zones only auto-populate 1 level deep. Explicit syntax ensures all nested components and media are included.

---

#### 2. getGlobalStrings()

**Purpose**: Get UI labels and navigation strings

**Signature**:
```typescript
async getGlobalStrings(locale: string = 'id'): Promise<any | null>
```

**Returns**:
```typescript
{
  nav_home: string
  nav_home_slug: string
  nav_services: string
  nav_services_slug: string
  cta_primary: string
  footer_copyright: string
  // ... all UI strings
}
```

---

#### 3. getSiteSettings()

**Purpose**: Get global site configuration

**Signature**:
```typescript
async getSiteSettings(): Promise<any | null>
```

**Returns**:
```typescript
{
  org_name: string
  logo: MediaFile
  logo_2x: MediaFile
  logo_dark: MediaFile
  logo_dark_2x: MediaFile
  contact_email: string
  contact_phone: string
  whatsapp: string
  socials: LinkItem[]
}
```

---

#### 4. getAllPages()

**Purpose**: Get all pages for static generation

**Signature**:
```typescript
async getAllPages(locale: string = 'id'): Promise<Page[] | null>
```

**Usage**:
```typescript
export async function generateStaticParams() {
  const pages = await strapiClient.getAllPages('id')
  return pages.map(page => ({ locale: 'id', slug: page.slug }))
}
```

---

#### 5. getInsightBySlug()

**Purpose**: Fetch blog post by slug

**Signature**:
```typescript
async getInsightBySlug(
  slug: string,
  locale: string = 'id',
  populate?: any,
  options?: { next?: { tags?: string[] } }
): Promise<Insight | null>
```

---

#### 6. getInsights()

**Purpose**: List blog posts with pagination

**Signature**:
```typescript
async getInsights(
  locale: string = 'id',
  page: number = 1,
  pageSize: number = 10,
  options?: { next?: { tags?: string[] } }
): Promise<StrapiResponse<Insight[]>>
```

---

### Error Handling

```typescript
try {
  const data = await this.fetch(endpoint)
  return data
} catch (error) {
  console.error('Error:', error)
  // Client-side: Return null for graceful fallback
  if (typeof window !== 'undefined') {
    return null
  }
  // Server-side: Throw error for proper handling
  throw error
}
```

---

### Type Definitions

```typescript
interface StrapiResponse<T> {
  data: T
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

interface MediaFile {
  id: number
  name: string
  alternativeText?: string
  url: string
  width?: number
  height?: number
  formats?: {
    large?: { url: string }
    medium?: { url: string }
    small?: { url: string }
    thumbnail?: { url: string }
  }
}
```

---

## Hooks Reference

### useDynamicContent (`hooks/useDynamicContent.ts`)

**Type**: Client-side hook

**Purpose**: Fetch site settings and global strings on client

**Signature**:
```typescript
export const useDynamicContent = (locale: 'id' | 'en' = 'id')
```

**Returns**:
```typescript
{
  siteSettings: SiteSettings | null
  globalStrings: GlobalStrings | null
  loading: boolean
  error: string | null
  processTemplate: (template: string) => string
}
```

**Usage**:
```typescript
function ClientComponent() {
  const { siteSettings, globalStrings, loading } = useDynamicContent('id')
  
  if (loading) return <div>Loading...</div>
  
  return <div>{siteSettings.org_name}</div>
}
```

**Template Processing**:
```typescript
const { processTemplate } = useDynamicContent('id')

// Template with placeholders
const template = "Welcome to {{site_settings.org_name}}"

// Processed output
const output = processTemplate(template)
// "Welcome to CAVOTA"
```

---

## Styling System

### Tailwind Configuration

#### Custom Colors

CSS variables defined in `styles/globals.css`:

```css
:root {
  --background: 255 255 255;           /* White */
  --foreground: 17 24 39;              /* Dark gray */
  --card: 255 255 255;                 /* White */
  --card-foreground: 17 24 39;
  --muted: 243 244 246;                /* Light gray */
  --muted-foreground: 107 114 128;
  --border: 229 231 235;               /* Light border */
  --brand-gradient: linear-gradient(135deg, #E51E29 0%, #6B29B7 100%);
}

.dark {
  --background: 17 24 39;              /* Dark gray */
  --foreground: 255 255 255;           /* White */
  --card: 31 41 55;
  /* ... dark theme values */
}
```

#### Using Colors

```typescript
<div className="bg-background text-foreground">
  <div className="bg-card border-border">
    <p className="text-muted-foreground">Muted text</p>
  </div>
</div>
```

#### Brand Gradient

```typescript
// Text gradient
<h1 className="text-brand-gradient">
  Gradient Text
</h1>

// Background gradient
<div className="bg-brand-gradient">
  White text on gradient
</div>
```

**Definition**:
```css
.text-brand-gradient {
  background-image: var(--brand-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

### Container Utilities

#### container-fluid

```typescript
<section className="container-fluid py-16">
  {/* Content with consistent padding */}
</section>
```

**Definition**:
```css
.container-fluid {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding-left: 1rem;
  padding-right: 1rem;
}
```

---

### Responsive Breakpoints

```typescript
// Mobile first approach
<div className="text-sm md:text-base lg:text-lg">
  Responsive text size
</div>

// Hide/show by breakpoint
<div className="block md:hidden">Mobile only</div>
<div className="hidden md:block">Desktop only</div>
```

**Breakpoints**:
- `sm`: 640px (tablets)
- `md`: 768px (small desktops)
- `lg`: 1024px (desktops)
- `xl`: 1280px (large desktops)
- `2xl`: 1280px (capped)

---

### Animations

```typescript
<div className="animate-fade-in">
  Fades in on load
</div>

<div className="animate-slide-up">
  Slides up from bottom
</div>
```

**Keyframes**:
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

---

## Internationalization

### Locale System

**Supported Locales**: `id`, `en`

**Route Structure**:
```
/id              → Indonesian homepage
/en              → English homepage
/id/layanan      → Indonesian services
/en/services     → English services
/id/karya        → Indonesian portfolio
/en/work         → English portfolio
```

---

### Locale Validation

```typescript
function validateLocale(locale: string): Locale {
  if (locale === 'id' || locale === 'en') {
    return locale
  }
  return 'id'  // Fallback to Indonesian
}
```

---

### Content Fetching

Always pass locale to API calls:

```typescript
const page = await strapiClient.getPageBySlug('about', locale)
const strings = await strapiClient.getGlobalStrings(locale)
```

---

### Conditional Rendering

```typescript
<div>
  {locale === 'id' 
    ? 'Konten dalam Bahasa Indonesia'
    : 'Content in English'}
</div>
```

---

### URL Generation

```typescript
// Portfolio URL
const workUrl = locale === 'id' 
  ? `/id/karya/${slug}` 
  : `/en/work/${slug}`

// Service URL
const serviceUrl = locale === 'id'
  ? `/id/layanan/${slug}`
  : `/en/services/${slug}`
```

---

## SEO Implementation

### Metadata Generation

Every page implements `generateMetadata()`:

```typescript
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const page = await strapiClient.getPageBySlug(slug, locale)
  
  if (page?.seo) {
    return mapStrapiSeoToMetadata(page.seo, {
      siteName: 'CAVOTA',
      siteUrl: 'https://cavota.id',
      defaultImage: '/images/og-default.jpg',
    })
  }
  
  // Fallback metadata
  return { /* ... */ }
}
```

---

### SEO Helper (`lib/seo.ts`)

#### mapStrapiSeoToMetadata()

**Purpose**: Convert Strapi SEO to Next.js Metadata

**Signature**:
```typescript
function mapStrapiSeoToMetadata(
  seo: StrapiSEO,
  config: SEOConfig
): Metadata
```

**Input** (from Strapi):
```typescript
interface StrapiSEO {
  metaTitle?: string
  metaDescription?: string
  metaImage?: { url: string; alternativeText?: string }
  keywords?: string
  metaRobots?: string
  canonicalURL?: string
  structuredData?: string
}
```

**Output** (Next.js Metadata):
```typescript
{
  title: string
  description: string
  keywords: string[]
  openGraph: {
    title: string
    description: string
    url: string
    siteName: string
    images: [{ url: string; alt: string }]
  }
  twitter: {
    card: 'summary_large_image'
    title: string
    description: string
    images: [string]
  }
  robots: {
    index: boolean
    follow: boolean
    googleBot: { /* ... */ }
  }
  alternates: {
    canonical: string
  }
}
```

---

### Canonical URLs

Automatically generated:

```typescript
alternates: {
  canonical: `https://cavota.id/${locale}/${slug}`,
  languages: {
    'id': `https://cavota.id/id/${slug}`,
    'en': `https://cavota.id/en/${slug}`
  }
}
```

---

### Structured Data

Generated from Strapi `structuredData` JSON field:

```typescript
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "CAVOTA",
  "url": "https://cavota.id",
  "logo": "https://cavota.id/logo.png"
}
```

---

## Performance & Caching

### Static Generation

```typescript
// Build time: Generate static HTML
export async function generateStaticParams() {
  const pages = await strapiClient.getAllPages('id')
  return pages.map(page => ({ 
    locale: 'id', 
    slug: page.slug 
  }))
}
```

**Benefits**:
- Pre-rendered HTML at build time
- Instant page loads
- CDN cacheable
- No server rendering overhead

---

### Cache Tags

Tag cached content for selective revalidation:

```typescript
await strapiClient.getPageBySlug(slug, locale, '*', {
  next: { 
    tags: [`page:${slug}:${locale}`] 
  }
})
```

---

### Revalidation API

**Endpoint**: `POST /api/revalidate`

**Purpose**: Invalidate cache when content changes in Strapi

**Request**:
```typescript
{
  "secret": "your_secret",
  "model": "page",
  "slug": "beranda",
  "locale": "id"
}
```

**Response**:
```typescript
{
  "revalidated": true,
  "tags": ["page:beranda:id"],
  "now": 1633024800000
}
```

**Implementation**:
```typescript
// api/revalidate/route.ts
import { revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  const { model, slug, locale, secret } = await request.json()
  
  // Validate secret
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 })
  }
  
  // Build cache tags
  const tags = [`${model}:${slug}:${locale}`]
  
  // Revalidate each tag
  for (const tag of tags) {
    revalidateTag(tag)
  }
  
  return Response.json({ revalidated: true, tags })
}
```

---

### Image Optimization

**Next.js Image Component**:
```typescript
import Image from 'next/image'

<Image
  src={imageUrl}
  alt={altText}
  width={800}
  height={600}
  priority={isAboveFold}  // Preload critical images
/>
```

**Benefits**:
- Automatic format conversion (WebP, AVIF)
- Responsive images
- Lazy loading
- Blur placeholder
- CDN optimization

---

## Best Practices

### 1. Component Organization

**Do**:
```typescript
// components/sections/HeroSection.tsx
interface HeroSectionProps { /* ... */ }

export function HeroSection({ data, locale }: HeroSectionProps) {
  // Single responsibility: Render hero
}
```

**Don't**:
```typescript
// ❌ Mixing concerns
export function HeroSection() {
  const data = await fetch(...)  // Data fetching in component
  const [state, setState] = useState()  // State in server component
}
```

---

### 2. Type Safety

**Do**:
```typescript
// Define interfaces for all props
interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

// Use type validation
function validateLocale(locale: string): Locale {
  // Runtime validation + type narrowing
}
```

**Don't**:
```typescript
// ❌ Using 'any'
function Component({ data }: { data: any }) {
  // No type safety
}
```

---

### 3. Error Handling

**Do**:
```typescript
try {
  const page = await strapiClient.getPageBySlug(slug, locale)
  
  if (!page) {
    notFound()  // Show 404 page
  }
  
  return <DynamicPage sections={page.sections} />
} catch (error) {
  console.error('Failed to fetch page:', error)
  // Show error boundary or fallback UI
}
```

---

### 4. Loading States

**Do**:
```typescript
// loading.tsx (automatic loading UI)
export default function Loading() {
  return <Skeleton />
}

// Or use Suspense
<Suspense fallback={<Skeleton />}>
  <AsyncComponent />
</Suspense>
```

---

### 5. Internationalization

**Do**:
```typescript
// Always handle both locales
const title = locale === 'id' 
  ? 'Judul dalam Bahasa Indonesia'
  : 'Title in English'

// Use locale in API calls
const page = await strapiClient.getPageBySlug(slug, locale)
```

**Don't**:
```typescript
// ❌ Hardcoding language
const title = "Title"  // What language?
```

---

### 6. SEO

**Do**:
```typescript
// Generate metadata for every page
export async function generateMetadata({ params }) {
  // Fetch SEO data from CMS
  // Return proper metadata
}

// Use semantic HTML
<main>
  <article>
    <h1>Heading</h1>
    <section>Content</section>
  </article>
</main>
```

---

## Troubleshooting

### Images Not Loading

**Symptom**: Broken image icons

**Causes**:
1. Wrong `NEXT_PUBLIC_STRAPI_URL` in `.env.local`
2. Image domain not in `next.config.js`
3. Strapi uploads folder not accessible
4. Image URL missing domain prefix

**Solutions**:
```typescript
// 1. Check environment variable
console.log(process.env.NEXT_PUBLIC_STRAPI_URL)

// 2. Add domain to next.config.js
images: {
  domains: ['localhost', 'cavota.id']
}

// 3. Ensure URL is complete
const imageUrl = image.url.startsWith('http')
  ? image.url
  : `${process.env.NEXT_PUBLIC_STRAPI_URL}${image.url}`
```

---

### Content Not Updating

**Symptom**: Old content shows after Strapi update

**Causes**:
1. Next.js cache not invalidated
2. Browser cache
3. CDN cache

**Solutions**:
```bash
# 1. Clear Next.js cache
rm -rf .next
npm run build

# 2. Use revalidation API
curl -X POST http://localhost:3001/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"your_secret","model":"page","slug":"beranda","locale":"id"}'

# 3. Hard refresh browser
Ctrl + Shift + R (or Cmd + Shift + R on Mac)
```

---

### Type Errors

**Symptom**: TypeScript errors in IDE

**Causes**:
1. Outdated type definitions
2. Missing types from API response
3. Type mismatch

**Solutions**:
```bash
# 1. Regenerate Next.js types
rm -rf .next/types
npm run dev  # Types regenerate automatically

# 2. Run type check
npm run type-check

# 3. Check tsconfig.json
{
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
}
```

---

### API Connection Failed

**Symptom**: "Failed to fetch" errors

**Causes**:
1. Strapi not running
2. Wrong `STRAPI_URL` in `.env.local`
3. Network/firewall issues
4. API token invalid

**Solutions**:
```bash
# 1. Check Strapi is running
curl http://localhost:1337/api/pages

# 2. Verify environment variables
cat .env.local

# 3. Test with curl
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:1337/api/pages

# 4. Check Strapi logs
cd /var/www/linkgacor.one/backend
tail -f strapi.log
```

---

### Build Errors

**Symptom**: Build fails

**Common Errors**:

1. **Module not found**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

2. **Type errors**:
```bash
# Run type check first
npm run type-check
# Fix all type errors before building
```

3. **Out of memory**:
```bash
# Increase Node memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

4. **Static generation timeout**:
```typescript
// Reduce static pages or increase timeout
export const dynamic = 'force-dynamic'  // Skip static generation
```

---

### Contact Form Not Working

**Current Status**: **Known Issue** ⚠️

**Symptom**: Form submits but data not saved in Strapi

**Affected Pages**:
- `/id/kontak`
- `/en/contact`

**TODO**:
1. Debug form submission handler
2. Check RFP API endpoint
3. Verify CORS settings
4. Test API token permissions
5. Add error handling and feedback

**Temporary Workaround**:
- Use email contact instead
- Or manually create RFP entries in Strapi admin

---

## Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Next.js 15**: https://nextjs.org/blog/next-15
- **App Router**: https://nextjs.org/docs/app
- **React 18**: https://react.dev/blog/2022/03/29/react-v18
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

---

**Document Version**: 1.0  
**Last Updated**: October 2025  
**Next.js Version**: 15.1.2  
**Author**: Cavota Development Team
