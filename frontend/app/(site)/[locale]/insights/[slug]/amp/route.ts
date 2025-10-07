/**
 * AMP Route for Insights
 * Serves AMP-compliant HTML for /{locale}/insights/{slug}/amp
 */

import { strapiClient, type Insight } from '../../../../../../lib/strapi/client';
import { toAmpImage, sanitizeToAmp, buildAmpCss, getRequiredAmpComponents } from '../../../../../../lib/amp';

export const revalidate = 300; // ISR-like behavior

/**
 * Generate JSON-LD structured data for the article
 */
function generateArticleJsonLd(insight: Insight, locale: string): string {
  const baseUrl = 'https://cavota.id';
  const canonicalUrl = `${baseUrl}/${locale}/insights/${insight.slug}`;
  const coverUrl = insight.hero_image ? 
    (insight.hero_image.url.startsWith('/') ? `${baseUrl}${insight.hero_image.url}` : insight.hero_image.url) : 
    `${baseUrl}/favicon.png`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": insight.title,
    "description": insight.seo?.metaDescription || insight.summary || `Insight tentang ${insight.title}`,
    "datePublished": insight.publishedAt,
    "dateModified": insight.updatedAt,
    "author": {
      "@type": "Person",
      "name": insight.author?.name || "CAVOTA"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CAVOTA",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/favicon.png`
      }
    },
    "image": [coverUrl],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  };

  return JSON.stringify(jsonLd);
}

/**
 * Format date for display
 */
function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  try {
    return date.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', options);
  } catch {
    return date.toLocaleDateString('en-US', options);
  }
}

/**
 * Get localized strings
 */
function getLocalizedStrings(locale: string) {
  if (locale === 'id') {
    return {
      backToInsights: 'Kembali ke Wawasan',
      by: 'Oleh',
      readTime: 'menit baca',
      ctaTitle: 'Tertarik bekerja sama?',
      ctaDescription: 'Mari diskusikan bagaimana CAVOTA dapat membantu bisnis Anda berkembang.',
      ctaButton: 'Hubungi Kami',
      copyright: '© 2025 CAVOTA. Semua hak dilindungi.'
    };
  }
  
  return {
    backToInsights: 'Back to Insights',
    by: 'By',
    readTime: 'min read',
    ctaTitle: 'Interested in working together?',
    ctaDescription: 'Let\'s discuss how CAVOTA can help your business grow.',
    ctaButton: 'Contact Us',
    copyright: '© 2025 CAVOTA. All rights reserved.'
  };
}

/**
 * Generate AMP HTML string
 */
function generateAmpHtml(insight: Insight, locale: string): string {
  const strings = getLocalizedStrings(locale);
  const baseUrl = 'https://cavota.id';
  const canonicalUrl = `${baseUrl}/${locale}/insights/${insight.slug}`;
  const ampUrl = `${baseUrl}/${locale}/insights/${insight.slug}/amp`;
  
  // Sanitize content for AMP
  const sanitizedBody = sanitizeToAmp(insight.body);
  
  // Get required AMP components
  const ampComponents = getRequiredAmpComponents(sanitizedBody);
  
  // Generate cover image
  const coverImageHtml = insight.hero_image ? toAmpImage(insight.hero_image, 'cover') : '';
  
  // Generate tags
  const tagsHtml = insight.tags && insight.tags.length > 0 ? `
    <div class="tags">
      ${insight.tags.map(tag => `<span class="tag">${tag.name}</span>`).join('')}
    </div>
  ` : '';
  
  // SEO meta
  const seoTitle = insight.seo?.metaTitle || insight.title;
  const seoDescription = insight.seo?.metaDescription || insight.summary || `Insight tentang ${insight.title}`;
  
  // Build CSS
  const ampCss = buildAmpCss();
  
  // Generate structured data
  const jsonLd = generateArticleJsonLd(insight, locale);
  
  // Format published date
  const publishedDate = formatDate(insight.publishedAt, locale);
  
  // Generate reading time
  const readingTime = insight.reading_time ? `${insight.reading_time} ${strings.readTime}` : '';

  return `<!doctype html>
<html ⚡ lang="${locale}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
  <link rel="canonical" href="${canonicalUrl}">
  <title>${seoTitle}</title>
  <meta name="description" content="${seoDescription.replace(/"/g, '&quot;')}">
  ${insight.seo?.keywords ? `<meta name="keywords" content="${insight.seo.keywords}">` : ''}
  <meta property="og:title" content="${seoTitle}">
  <meta property="og:description" content="${seoDescription.replace(/"/g, '&quot;')}">
  <meta property="og:url" content="${ampUrl}">
  <meta property="og:type" content="article">
  ${insight.hero_image ? `<meta property="og:image" content="${insight.hero_image.url.startsWith('/') ? baseUrl + insight.hero_image.url : insight.hero_image.url}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${seoTitle}">
  <meta name="twitter:description" content="${seoDescription.replace(/"/g, '&quot;')}">
  ${insight.hero_image ? `<meta name="twitter:image" content="${insight.hero_image.url.startsWith('/') ? baseUrl + insight.hero_image.url : insight.hero_image.url}">` : ''}
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  ${ampComponents.join('\n  ')}
  <style amp-custom>
${ampCss}
  </style>
  <script type="application/ld+json">
${jsonLd}
  </script>
</head>
<body>
  <div class="container">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <a href="/${locale}/insights">${strings.backToInsights}</a>
    </nav>

    <!-- Article Header -->
    <header class="article-header">
      <h1>${insight.title}</h1>
      
      <div class="article-meta">
        <span class="author">${strings.by} ${insight.author?.name || 'CAVOTA'}</span>
        <span> • </span>
        <time datetime="${insight.publishedAt}">${publishedDate}</time>
        ${readingTime ? `<span> • </span><span>${readingTime}</span>` : ''}
      </div>
      
      ${tagsHtml}
    </header>

    <!-- Cover Image -->
    ${coverImageHtml}

    <!-- Article Body -->
    <article class="article-body">
      ${sanitizedBody}
    </article>

    <!-- CTA Strip -->
    <section class="cta-strip">
      <h3>${strings.ctaTitle}</h3>
      <p>${strings.ctaDescription}</p>
      <a href="/${locale}/contact" class="cta-button">${strings.ctaButton}</a>
    </section>
  </div>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <p>${strings.copyright}</p>
    </div>
  </footer>
</body>
</html>`;
}

/**
 * GET handler for AMP pages
 */
export async function GET(
  request: Request, 
  context: { params: Promise<{ locale: string; slug: string }> }
) {
  const params = await context.params;
  const { locale, slug } = params;
  
  try {
    // Fetch insight data with full population
    const insight = await strapiClient.getInsightBySlug(
      slug,
      locale,
      {
        hero_image: { populate: '*' },
        seo: { populate: '*' },
        tags: true,
        author: true
      },
      {
        next: { 
          tags: [`insight:${slug}:${locale}`],
          revalidate: 300
        }
      }
    );

    if (!insight) {
      return new Response('Insight not found', { 
        status: 404,
        headers: {
          'content-type': 'text/html; charset=utf-8'
        }
      });
    }

    // Generate AMP HTML
    const ampHtml = generateAmpHtml(insight, locale);

    // Return AMP HTML with proper headers
    return new Response(ampHtml, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, s-maxage=300, stale-while-revalidate=600',
        'vary': 'Accept-Encoding'
      }
    });

  } catch (error) {
    console.error('AMP Route Error:', error);
    return new Response('Internal Server Error', { 
      status: 500,
      headers: {
        'content-type': 'text/html; charset=utf-8'
      }
    });
  }
}