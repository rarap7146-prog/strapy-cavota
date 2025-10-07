/**
 * CAVOTA AMP Implementation - Test Plan
 * 
 * This document outlines how to test the AMP implementation for Insights pages.
 */

## Files Created

1. **lib/amp.ts** - AMP utilities for HTML sanitization and image conversion
2. **lib/strapi/client.ts** - Strapi API client with TypeScript types
3. **lib/cdn.ts** - CDN optimization utilities (optional)
4. **app/(site)/[locale]/insights/[slug]/head.tsx** - Inject amphtml link on non-AMP pages
5. **app/(site)/[locale]/insights/[slug]/amp/route.ts** - AMP HTML generation route
6. **app/api/revalidate/route.ts** - Cache revalidation API

## Test Plan

### 1. Setup Test Environment

Before testing, ensure these environment variables are set:

```env
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=your_strapi_api_token
REVALIDATE_SECRET=your_secret_key
```

### 2. Test Non-AMP Page (AMP Discovery)

Visit a regular insight page to verify the amphtml link is injected:

```bash
# Visit the non-AMP page
curl -I https://cavota.id/id/insights/your-insight-slug

# Check page source for amphtml link
curl https://cavota.id/id/insights/your-insight-slug | grep "amphtml"
```

Expected result: Should find `<link rel="amphtml" href="/id/insights/your-insight-slug/amp" />`

### 3. Test AMP Page Generation

Visit the AMP version of an insight:

```bash
# Test AMP page accessibility
curl -I https://cavota.id/id/insights/your-insight-slug/amp

# Get full AMP HTML
curl https://cavota.id/id/insights/your-insight-slug/amp > test-amp.html
```

Expected results:
- HTTP 200 response
- Content-Type: text/html; charset=utf-8
- Cache-Control headers set for performance
- Valid AMP HTML structure

### 4. Validate AMP Compliance

Use Google's AMP Validator to ensure compliance:

1. Visit: https://search.google.com/test/amp
2. Enter URL: `https://cavota.id/id/insights/your-insight-slug/amp`
3. Check for validation errors

Key validation points:
- ⚡ Valid AMP doctype and html tag
- Required AMP runtime script
- Inline CSS under 75KB limit
- No disallowed JavaScript
- All images converted to amp-img
- Proper canonical URL linking

### 5. Test CSS Size Compliance

Check that inline CSS is under the 75KB AMP limit:

```bash
# Extract and measure CSS size
curl https://cavota.id/id/insights/your-insight-slug/amp | \
  grep -A 1000 '<style amp-custom>' | \
  grep -B 1000 '</style>' | \
  wc -c
```

Expected result: Should be well under 75,000 bytes

### 6. Test Image Optimization

Verify that images are properly converted to amp-img:

```bash
# Check for amp-img tags
curl https://cavota.id/id/insights/your-insight-slug/amp | grep "amp-img"

# Verify no regular img tags remain
curl https://cavota.id/id/insights/your-insight-slug/amp | grep "<img" | grep -v "amp-img"
```

Expected results:
- Find amp-img tags with proper attributes
- No regular img tags should remain

### 7. Test Video Conversion

If your insight contains videos, verify conversion:

```bash
# Check for amp-video tags
curl https://cavota.id/id/insights/your-insight-slug/amp | grep "amp-video"

# Check for amp-youtube tags (for YouTube embeds)
curl https://cavota.id/id/insights/your-insight-slug/amp | grep "amp-youtube"
```

### 8. Test Structured Data

Verify JSON-LD structured data is properly generated:

```bash
# Extract JSON-LD data
curl https://cavota.id/id/insights/your-insight-slug/amp | \
  grep -A 50 'application/ld+json' | \
  grep -B 50 '</script>'
```

Expected result: Valid Article schema with proper properties

### 9. Test Localization

Test both Indonesian and English versions:

```bash
# Test Indonesian version
curl -I https://cavota.id/id/insights/your-insight-slug/amp

# Test English version  
curl -I https://cavota.id/en/insights/your-insight-slug/amp
```

Verify that:
- Both locales work
- Language-specific strings are correct
- Canonical URLs point to correct locale

### 10. Test Cache Revalidation

Test the revalidation API:

```bash
# Test revalidation endpoint
curl -X POST https://cavota.id/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "insight",
    "slug": "your-insight-slug",
    "locale": "id",
    "secret": "your_revalidate_secret"
  }'
```

Expected result: 200 response with revalidation confirmation

### 11. Performance Testing

Test page load performance:

```bash
# Measure response time
time curl -o /dev/null -s https://cavota.id/id/insights/your-insight-slug/amp

# Test with various locations using online tools:
# - GTmetrix
# - PageSpeed Insights  
# - WebPageTest
```

### 12. Mobile Testing

Test on actual mobile devices:
- Verify responsive layout
- Check touch interactions
- Validate scrolling performance
- Test form functionality (if any)

## Expected Benchmarks

### AMP Validation
- ✅ Valid AMP HTML structure
- ✅ CSS under 75KB
- ✅ No JavaScript errors
- ✅ All images properly converted

### Performance
- 🎯 LCP (Largest Contentful Paint) < 2.5s
- 🎯 FID (First Input Delay) < 100ms  
- 🎯 CLS (Cumulative Layout Shift) < 0.1
- 🎯 Time to Interactive < 3s

### SEO
- ✅ Proper canonical linking
- ✅ Valid structured data
- ✅ Complete meta tags
- ✅ Accessible navigation

## Troubleshooting

### Common Issues

1. **AMP Validation Errors**
   - Check for remaining non-AMP HTML tags
   - Verify all scripts are AMP-compatible
   - Ensure CSS is within size limits

2. **Images Not Loading**
   - Verify absolute URLs are generated
   - Check media file permissions
   - Validate amp-img syntax

3. **Styling Issues**
   - Test CSS without external dependencies
   - Verify no external stylesheets
   - Check responsive breakpoints

4. **Content Sanitization Problems**
   - Review sanitizeToAmp function
   - Test with various HTML content
   - Check for edge cases in rich text

## Deployment Checklist

Before deploying to production:

- [ ] All tests pass
- [ ] AMP validation passes
- [ ] Performance benchmarks met
- [ ] Mobile testing completed
- [ ] Cache revalidation working
- [ ] Error handling tested
- [ ] Monitoring setup
- [ ] Backup plan ready

---

Generated: 2025-10-06 04:40 UTC
Status: Ready for Testing