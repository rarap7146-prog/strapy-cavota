# Strapi v5 Component Field Reference Guide

Based on analysis of manually created homepage from dashboard.

## 📋 Page Structure

### Basic Page Fields
```json
{
  "title": "string",
  "slug": "string (uid)",
  "page_type": "enum (home|services|about|contact|rfp|custom)",
  "translation_key": "string"
}
```

### SEO Component (`shared.seo`)
```json
{
  "metaTitle": "string (max 60 chars)",
  "metaDescription": "string (50-160 chars)", 
  "keywords": "string",
  "metaRobots": "string",
  "metaViewport": "string",
  "canonicalURL": "string",
  "structuredData": {
    "@context": "https://schema.org",
    "@type": "DigitalMarketingAgency",
    "name": "string",
    "url": "string",
    "logo": "string",
    "description": "string",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "string",
      "addressCountry": "string"
    },
    "sameAs": ["string[]"]
  }
}
```

## 🧩 Component Field Structures

### sections.hero
```json
{
  "__component": "sections.hero",
  "eyebrow": "string",
  "heading": "string",
  "subheading": "string",
  "style_variant": "string (default|other)"
}
```

### sections.proof-bar  
```json
{
  "__component": "sections.proof-bar",
  "note": "string"
}
```

### sections.services-grid
```json
{
  "__component": "sections.services-grid", 
  "title": "string"
}
```

### sections.case-carousel
```json
{
  "__component": "sections.case-carousel",
  "title": "string",
  "layout": "string (cards|other)"
}
```

### sections.playbook
```json
{
  "__component": "sections.playbook",
  "title": "string"
}
```

### sections.cta-strip
```json
{
  "__component": "sections.cta-strip",
  "text": "string"
}
```

## 📊 Usage Patterns

From the dashboard homepage analysis:

- **sections.hero**: 1 instance (page header)
- **sections.proof-bar**: 4 instances (multiple testimonials/achievements)
- **sections.services-grid**: 1 instance (services overview)
- **sections.case-carousel**: 1 instance (portfolio showcase)
- **sections.playbook**: 1 instance (process/methodology)
- **sections.cta-strip**: 1 instance (call-to-action)

## 🔧 Component Notes

1. **Required Fields**: All components require `__component` field
2. **IDs**: Strapi auto-generates `id` fields, don't include in JSON
3. **Repeatable**: `proof-bar` is commonly used multiple times
4. **Layout Options**: `case-carousel` supports different layout variants
5. **Style Variants**: `hero` supports style customization

## 💡 Best Practices

1. **SEO**: Always include comprehensive structured data
2. **Localization**: Translate all text fields between locales
3. **Consistency**: Keep component order consistent between locales
4. **Proof Bars**: Use multiple instances for social proof
5. **CTAs**: End pages with clear call-to-action components

## 🎯 Template Usage

Use this reference when creating new pages:

```bash
# Create pages with learned structure
export STRAPI_TOKEN=your_token
node scripts/seed-page.js
```

The updated `page-home.json` now includes all learned field structures and can be used as a template for future pages.