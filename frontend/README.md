# Cavota Frontend (Next.js)# CAVOTA AMP Pages Implementation



## OverviewThis implementation provides strict AMP compliance for Insights pages with mobile-first design and clean internationalization.



This is a **Next.js 15.1.2** frontend application for the Cavota website. It uses the App Router architecture with TypeScript, Tailwind CSS, and consumes content from the Strapi CMS backend.## Features



## Tech Stack✅ **Strict AMP Compliance**

- CSS under 75KB limit

- **Next.js**: 15.1.2 (App Router)- Zero Next.js/React scripts on AMP pages

- **React**: 18.3.1- Mobile-first responsive design

- **TypeScript**: 5.6.3- Valid AMP HTML structure

- **Tailwind CSS**: 3.4.15

- **Port**: 3001 (development & production)✅ **SEO Optimization**

- Canonical URL linking between AMP and non-AMP

## Quick Start- JSON-LD structured data

- Complete meta tags

### Prerequisites- amphtml discovery links

- Node.js 22.x

- Backend Strapi running on port 1337✅ **Internationalization**

- `.env.local` file configured- Support for Indonesian (`id`) and English (`en`) locales

- Localized content and interface strings

### Installation- Proper hreflang implementation

```bash

# Install dependencies✅ **Performance**

npm install- Incremental Static Regeneration (ISR)

- Cache revalidation API

# Development mode (with hot reload)- CDN optimization ready

npm run dev- Image optimization with amp-img



# Production build## Quick Start

npm run build

1. **Setup Environment**

# Production start   ```bash

npm start   cp .env.example .env.local

   # Edit .env.local with your Strapi credentials

# Type checking   ```

npm run type-check

2. **Start Development**

# Linting   ```bash

npm run lint   npm run dev

```   ```



### Process Management3. **Test AMP Pages**

The frontend runs in tmux session managed by the main tmux session:   ```bash

```bash   # Visit regular page (should have amphtml link)

# Check tmux session   curl https://your-domain.com/id/insights/your-slug

tmux attach -t cavota   

   # Visit AMP version

# Window 0: Strapi backend   curl https://your-domain.com/id/insights/your-slug/amp

# Window 1: Next.js frontend   ```

```

4. **Validate AMP**

## Project Structure   - Visit: https://search.google.com/test/amp

   - Enter: `https://your-domain.com/id/insights/your-slug/amp`

```

frontend/## URL Structure

├── app/                  # Next.js App Router

│   ├── (site)/          # Site route group```

│   │   └── [locale]/    # Internationalized routes# Non-AMP (canonical)

│   │       ├── [slug]/         # Dynamic pages/{locale}/insights/{slug}

│   │       ├── karya/          # Portfolio (ID)

│   │       ├── work/           # Portfolio (EN)# AMP version

│   │       ├── layanan/        # Services (ID)/{locale}/insights/{slug}/amp

│   │       ├── services/       # Services (EN)

│   │       ├── insights/       # Blog/Insights# Revalidation API

│   │       ├── layout.tsx      # Root layout/api/revalidate

│   │       ├── page.tsx        # Homepage```

│   │       └── not-found.tsx   # 404 page

│   └── api/             # API routes## Key Files

│       ├── proxy/              # Strapi proxy endpoints

│       ├── revalidate/         # Cache revalidation- `lib/amp.ts` - AMP utilities and HTML generation

│       └── test-page/          # Testing endpoint- `lib/strapi/client.ts` - Strapi API client with types

├── components/          # React components- `app/(site)/[locale]/insights/[slug]/amp/route.ts` - AMP route handler

│   ├── sections/       # Page section components- `app/api/revalidate/route.ts` - Cache revalidation API

│   ├── ui/             # UI components

│   ├── DynamicPage.tsx     # Dynamic page renderer## Testing

│   ├── Navbar.tsx          # Navigation bar

│   ├── Footer.tsx          # FooterSee `AMP_TEST_PLAN.md` for comprehensive testing instructions.

│   └── PageWrapper.tsx     # Page layout wrapper

├── hooks/              # Custom React hooks## Deployment

│   └── useDynamicContent.ts

├── lib/                # Utility libraries1. Configure environment variables

│   ├── strapi/        # Strapi client2. Build and deploy frontend

│   ├── contexts/      # React contexts3. Setup webhook in Strapi to call `/api/revalidate`

│   ├── seo.ts         # SEO utilities4. Test AMP validation in production

│   └── utils.ts       # General utilities

├── styles/            # Global styles---

│   └── globals.css

├── next.config.js     # Next.js configurationGenerated: 2025-10-06 04:48 UTC

├── tailwind.config.ts # Tailwind configurationStatus: Ready for Production
└── tsconfig.json      # TypeScript configuration
```

## Environment Variables

Create `.env.local` file:

```bash
# Strapi Backend URL
STRAPI_URL=https://cavota.id
NEXT_PUBLIC_STRAPI_URL=https://cavota.id

# Strapi API Token (server-side only)
STRAPI_TOKEN=your_api_token_here

# Revalidation Secret
REVALIDATE_SECRET=your_secret_here

# Site URL
NEXT_PUBLIC_SITE_URL=https://cavota.id
```

**Important**:
- `STRAPI_TOKEN` is only used server-side
- `.env.local` is excluded from git
- Never commit secrets

## Key Features

### 1. Internationalization (i18n)
- Supported locales: `id` (Indonesian), `en` (English)
- Route structure: `/id/beranda`, `/en/home`
- Default locale: Indonesian

### 2. Dynamic Page Rendering
- Pages fetched from Strapi CMS
- Section-based composition
- Automatic metadata generation

### 3. SEO Optimization
- Per-page metadata from Strapi
- Open Graph tags
- Twitter Cards
- Multilingual alternates

### 4. Responsive Images
- Hero sections support web/mobile images
- Next.js Image optimization
- Feature images for portfolio

### 5. Cache Management
- Next.js cache tags
- Revalidation API endpoint
- On-demand revalidation

## Known Issues

### Contact Form Submission
**Status**: Not working  
**Location**: `/id/kontak` and `/en/contact`  
**Issue**: Form refreshes but no data sent to Strapi  
**TODO**: Debug form submission and RFP API integration

## Development

See [DOCUMENTATION.md](./DOCUMENTATION.md) for comprehensive guide.

---

**Version**: 0.1.0  
**Last Updated**: October 2025
