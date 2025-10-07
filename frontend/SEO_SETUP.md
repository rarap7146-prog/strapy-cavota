# SEO Setup - Sitemap & Robots.txt

## Overview

This document describes the SEO setup for cavota.id, including the dynamic sitemap and robots.txt configuration.

## Files Created

### 1. robots.txt
**Location**: `frontend/public/robots.txt`  
**URL**: https://cavota.id/robots.txt

**Purpose**: Instructs search engine crawlers on what to index and what to avoid.

**Configuration**:
- ✅ Allows all pages under `/id/` and `/en/`
- ✅ Allows services: `/id/layanan/` and `/en/services/`
- ✅ Allows insights: `/id/wawasan/` and `/en/insights/`
- ✅ Allows portfolio: `/id/karya/` and `/en/work/`
- ❌ Blocks API routes: `/api/` and `/next-api/`
- ❌ Blocks Next.js internals: `/_next/` and `/static/`
- ❌ Blocks preview/draft content: `/*?preview=*`
- 📍 Points to sitemap: https://cavota.id/sitemap.xml

### 2. sitemap.xml (Dynamic)
**Location**: `frontend/app/sitemap.xml/route.ts`  
**URL**: https://cavota.id/sitemap.xml  
**Type**: Next.js Route Handler (Dynamic)

**Purpose**: Automatically generates XML sitemap with all published content from Strapi CMS.

**Configuration**:
- **Revalidation**: 1 hour (3600 seconds)
- **Cache-Control**: Public, cached for 1 hour, stale-while-revalidate for 24 hours
- **Total URLs**: 46 URLs indexed

## Sitemap URL Breakdown

### Homepage (Priority: 1.0)
- https://cavota.id/id (Indonesian homepage)
- https://cavota.id/en (English homepage)

### Regular Pages (Priority: 0.8)
- About, Contact, Work listing, Services listing, Insights listing
- Both Indonesian (`/id/`) and English (`/en/`) versions

### Services (Priority: 0.9) - 12 URLs
**Indonesian** (`/id/layanan/`):
- layanan-pengalaman-website
- layanan-seo
- layanan-iklan-performa
- layanan-content-intelligent
- layanan-kol-influencer-marketing
- layanan-mentorship

**English** (`/en/services/`):
- performance-ads
- website-experience
- influencer-kol
- seo-content
- automation-bots
- mentorship-enablement

### Insights/Blog (Priority: 0.7) - 4 URLs
**Indonesian** (`/id/wawasan/`):
- strategi-digital-marketing-2025
- strategi-digital-marketing-2025/amp (AMP version)

**English** (`/en/insights/`):
- digital-marketing-strategies-2025
- digital-marketing-strategies-2025/amp (AMP version)

### Works/Portfolio (Priority: 0.7) - 14 URLs
**Indonesian** (`/id/karya/`):
- kampanye-cat-performa-tinggi
- enterprise-anonim-programmatic
- sunco-always-on-awareness-conversion
- tokopedia-mega-campaign-1212
- indomie-peluncuran-varian-global
- enterprise-anonim-omnichannel-leadgen
- contoh-proyek

**English** (`/en/work/`):
- (Same slugs, English locale)

## How It Works

### Data Fetching
The sitemap generator fetches data from Strapi v5 API:

1. **Pages**: `GET /api/pages?locale={locale}&populate[0]=seo&pagination[pageSize]=100`
   - Filters out `page_type=custom` (services are handled separately)

2. **Services**: `GET /api/pages?locale={locale}&filters[page_type][$eq]=custom&pagination[pageSize]=100`
   - Services have `page_type=custom` flag

3. **Insights**: `GET /api/insights?locale={locale}&pagination[pageSize]=100`
   - Blog posts/articles

4. **Works**: `GET /api/works?locale={locale}&pagination[pageSize]=100`
   - Portfolio case studies

### URL Structure
The sitemap respects the proper URL structure:
- Indonesian services: `/id/layanan/{slug}`
- English services: `/en/services/{slug}`
- Indonesian insights: `/id/wawasan/{slug}`
- English insights: `/en/insights/{slug}`
- Indonesian works: `/id/karya/{slug}`
- English works: `/en/work/{slug}`

### Priorities
- **1.0**: Homepage (highest)
- **0.9**: Services (important business pages)
- **0.8**: Static pages (about, contact, etc.)
- **0.7**: Insights and Works (content pages)
- **0.6**: AMP versions of insights

### Change Frequency
- **Weekly**: Homepage (frequently updated)
- **Monthly**: All other pages (content updates)

### Last Modified
- Uses `updatedAt` field from Strapi
- Formatted as W3C date (YYYY-MM-DD)

## Caching Strategy

### Sitemap Route
```typescript
export const revalidate = 3600; // 1 hour

headers: {
  'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400'
}
```

**Behavior**:
1. Sitemap regenerates every hour automatically
2. Browser caches for 1 hour
3. CDN/proxy caches for 1 hour
4. Serves stale content for up to 24 hours while revalidating

### Content Updates
When you update content in Strapi:
1. Changes are reflected in next sitemap regeneration (max 1 hour)
2. Or trigger manual revalidation via `/next-api/revalidate`

## Testing

### Manual Testing
```bash
# Test robots.txt
curl https://cavota.id/robots.txt

# Test sitemap.xml
curl https://cavota.id/sitemap.xml

# Count URLs
curl -s https://cavota.id/sitemap.xml | grep -c '<loc>'

# Check specific content type
curl -s https://cavota.id/sitemap.xml | grep '/layanan/'
```

### Validation Tools
1. **Google Search Console**: Submit sitemap at https://search.google.com/search-console
2. **Bing Webmaster Tools**: Submit at https://www.bing.com/webmasters
3. **XML Sitemap Validator**: https://www.xml-sitemaps.com/validate-xml-sitemap.html
4. **robots.txt Tester**: Use Google Search Console robots.txt tester

## Submission to Search Engines

### Google Search Console
1. Go to https://search.google.com/search-console
2. Add property: https://cavota.id
3. Navigate to **Sitemaps** section
4. Enter sitemap URL: `https://cavota.id/sitemap.xml`
5. Click **Submit**

### Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters
2. Add site: https://cavota.id
3. Navigate to **Sitemaps** section
4. Enter sitemap URL: `https://cavota.id/sitemap.xml`
5. Click **Submit**

### Robots.txt Verification
Both Google and Bing automatically check robots.txt at:
- https://cavota.id/robots.txt

No manual submission needed.

## Monitoring

### Check Indexing Status
**Google Search Console**:
- Navigate to **Coverage** report
- View indexed pages vs submitted in sitemap
- Check for any errors or warnings

**Manual Check**:
```
site:cavota.id
```
Search on Google to see all indexed pages.

### Sitemap Errors
Monitor in Search Console:
- **Sitemaps** section shows submission status
- Errors if URLs return 404 or 5xx
- Warnings for redirect chains

## Maintenance

### Regular Checks (Weekly)
- [ ] Verify sitemap generates without errors
- [ ] Check all URLs return 200 OK
- [ ] Monitor Search Console for indexing issues
- [ ] Review robots.txt blocks are correct

### After Content Updates
- [ ] Wait 1 hour for automatic sitemap regeneration
- [ ] Or trigger manual revalidation
- [ ] Verify new content appears in sitemap
- [ ] Check Search Console for new indexed pages

### After URL Structure Changes
- [ ] Update `frontend/app/sitemap.xml/route.ts`
- [ ] Rebuild Next.js: `npm run build`
- [ ] Restart production server
- [ ] Resubmit sitemap to search engines

## Troubleshooting

### Sitemap Returns Error
**Symptom**: 500 error or empty sitemap

**Solutions**:
1. Check Strapi API is running: `curl http://localhost:1337/api/pages`
2. Check Next.js logs: `tail -f frontend/next-production.log`
3. Verify `STRAPI_URL` in `.env.local`
4. Restart Next.js server

### URLs Missing from Sitemap
**Symptom**: Some pages not in sitemap

**Solutions**:
1. Check content is **Published** in Strapi (not Draft)
2. Verify correct locale is set
3. Check pagination limit (currently 100 items per collection)
4. Review `page_type` filters in sitemap code

### robots.txt Not Working
**Symptom**: Search engines indexing blocked URLs

**Solutions**:
1. Verify file at `frontend/public/robots.txt`
2. Test: `curl https://cavota.id/robots.txt`
3. Check nginx is serving static files correctly
4. Wait for search engines to recrawl (can take days)

### Sitemap Not Updating
**Symptom**: Old content still in sitemap after 1 hour

**Solutions**:
1. Check `revalidate` value in `route.ts` (should be 3600)
2. Clear Next.js cache: `rm -rf frontend/.next/cache/`
3. Rebuild: `npm run build`
4. Force revalidation: `curl -X POST "https://cavota.id/next-api/revalidate?path=/sitemap.xml&secret=YOUR_SECRET"`

## Best Practices

### Content Organization
- ✅ Use consistent slug patterns across locales
- ✅ Keep URLs short and descriptive
- ✅ Use hyphens (not underscores) in slugs
- ✅ Avoid special characters in URLs

### SEO Metadata
- ✅ Fill all SEO fields in Strapi (metaTitle, metaDescription)
- ✅ Use unique meta descriptions per page
- ✅ Add structured data (JSON-LD) for rich snippets
- ✅ Set proper canonical URLs

### Performance
- ✅ Sitemap cached for 1 hour (balance freshness vs performance)
- ✅ Use pagination for large content collections
- ✅ Monitor sitemap generation time (should be <1s)

### Internationalization
- ✅ Both locales included in single sitemap
- ✅ Use proper URL structure per locale
- ✅ Consider adding `<xhtml:link>` tags for alternate language versions (future enhancement)

## Future Enhancements

### Priority 1: Alternate Language Links
Add hreflang tags to sitemap for better i18n SEO:
```xml
<url>
  <loc>https://cavota.id/id/layanan/seo</loc>
  <xhtml:link rel="alternate" hreflang="id" href="https://cavota.id/id/layanan/seo"/>
  <xhtml:link rel="alternate" hreflang="en" href="https://cavota.id/en/services/seo-content"/>
</url>
```

### Priority 2: Images Sitemap
Create separate image sitemap for portfolio assets:
- https://cavota.id/sitemap-images.xml
- Include work portfolio images
- Add image titles and captions

### Priority 3: Sitemap Index
If content grows beyond 1000 URLs, split into multiple sitemaps:
- https://cavota.id/sitemap.xml (index)
- https://cavota.id/sitemap-pages.xml
- https://cavota.id/sitemap-services.xml
- https://cavota.id/sitemap-insights.xml
- https://cavota.id/sitemap-works.xml

### Priority 4: News Sitemap
For insights/blog posts published in last 2 days:
- https://cavota.id/sitemap-news.xml
- Submit to Google News

## References

- **XML Sitemap Protocol**: https://www.sitemaps.org/protocol.html
- **robots.txt Specification**: https://www.robotstxt.org/robotstxt.html
- **Google Search Central**: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- **Next.js Metadata**: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- **Strapi v5 API**: https://docs.strapi.io/dev-docs/api/rest

---

**Last Updated**: October 7, 2025  
**Sitemap Version**: 1.0  
**Total URLs**: 46
