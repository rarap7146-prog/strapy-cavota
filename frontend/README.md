# CAVOTA AMP Pages Implementation

This implementation provides strict AMP compliance for Insights pages with mobile-first design and clean internationalization.

## Features

✅ **Strict AMP Compliance**
- CSS under 75KB limit
- Zero Next.js/React scripts on AMP pages
- Mobile-first responsive design
- Valid AMP HTML structure

✅ **SEO Optimization**
- Canonical URL linking between AMP and non-AMP
- JSON-LD structured data
- Complete meta tags
- amphtml discovery links

✅ **Internationalization**
- Support for Indonesian (`id`) and English (`en`) locales
- Localized content and interface strings
- Proper hreflang implementation

✅ **Performance**
- Incremental Static Regeneration (ISR)
- Cache revalidation API
- CDN optimization ready
- Image optimization with amp-img

## Quick Start

1. **Setup Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Strapi credentials
   ```

2. **Start Development**
   ```bash
   npm run dev
   ```

3. **Test AMP Pages**
   ```bash
   # Visit regular page (should have amphtml link)
   curl https://your-domain.com/id/insights/your-slug
   
   # Visit AMP version
   curl https://your-domain.com/id/insights/your-slug/amp
   ```

4. **Validate AMP**
   - Visit: https://search.google.com/test/amp
   - Enter: `https://your-domain.com/id/insights/your-slug/amp`

## URL Structure

```
# Non-AMP (canonical)
/{locale}/insights/{slug}

# AMP version
/{locale}/insights/{slug}/amp

# Revalidation API
/api/revalidate
```

## Key Files

- `lib/amp.ts` - AMP utilities and HTML generation
- `lib/strapi/client.ts` - Strapi API client with types
- `app/(site)/[locale]/insights/[slug]/amp/route.ts` - AMP route handler
- `app/api/revalidate/route.ts` - Cache revalidation API

## Testing

See `AMP_TEST_PLAN.md` for comprehensive testing instructions.

## Deployment

1. Configure environment variables
2. Build and deploy frontend
3. Setup webhook in Strapi to call `/api/revalidate`
4. Test AMP validation in production

---

Generated: 2025-10-06 04:48 UTC
Status: Ready for Production