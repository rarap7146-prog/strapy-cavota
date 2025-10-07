import Image from 'next/image';
import Link from 'next/link';

interface InsightsListSectionProps {
  data: {
    id: number
    title?: string
    subtitle?: string
    max_items?: number
    show_featured_only?: boolean
    show_read_time?: boolean
    show_tags?: boolean
    layout?: 'list' | 'compact'
  }
  locale: 'id' | 'en'
}

interface Insight {
  id: number
  documentId: string
  title: string
  slug: string
  summary?: string
  hero_image?: {
    id: number
    url: string
    alternativeText?: string
    width?: number
    height?: number
  }
  reading_time?: number
  tags?: Array<{
    id: number
    name: string
    slug: string
  }>
  publishedAt: string
  createdAt: string
}

// Use internal Strapi URL for server-side rendering
const STRAPI_URL = 'http://localhost:1337';

export async function InsightsListSection({ data, locale }: InsightsListSectionProps) {
  const { 
    title, 
    subtitle, 
    max_items = 10, 
    show_read_time = true, 
    show_tags = true,
    layout = 'list'
  } = data;

  // Fetch insights from Strapi
  let insights: Insight[] = [];
  
  try {
    // Build query params - Strapi v5 uses populate[0], populate[1] format
    const params = new URLSearchParams({
      locale,
      'sort': 'publishedAt:desc',
      'pagination[limit]': max_items.toString(),
      'populate[0]': 'hero_image',
      'populate[1]': 'tags'
    });
    
    const url = `${STRAPI_URL}/api/insights?${params}`;
    const response = await fetch(url, {
      next: { 
        tags: [`insights:${locale}`],
        revalidate: 3600 // Revalidate every hour
      }
    });

    if (response.ok) {
      const result = await response.json();
      insights = result.data || [];
    }
  } catch (error) {
    console.error('Failed to fetch insights:', error);
  }

  if (insights.length === 0) {
    return null;
  }

  // Format date based on locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (locale === 'id') {
      return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    }
    return date.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getInsightUrl = (slug: string) => {
    return `/${locale}/insights/${slug}`;
  };

  return (
    <section className="container-fluid py-16">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        {(title || subtitle) && (
          <div className="mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Insights List */}
        <div className="space-y-8">
          {insights.map((insight) => (
            <article 
              key={insight.id}
              className={`group ${
                layout === 'compact' 
                  ? 'flex gap-6' 
                  : 'flex flex-col md:flex-row gap-6'
              }`}
            >
              {/* Thumbnail */}
              {insight.hero_image?.url && (
                <Link 
                  href={getInsightUrl(insight.slug)}
                  className={`relative overflow-hidden rounded-lg bg-muted flex-shrink-0 ${
                    layout === 'compact' 
                      ? 'w-32 h-32' 
                      : 'w-full md:w-80 aspect-video md:aspect-auto md:h-52'
                  }`}
                >
                  <Image
                    src={`${STRAPI_URL}${insight.hero_image.url}`}
                    alt={insight.hero_image.alternativeText || insight.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes={layout === 'compact' ? '128px' : '(max-width: 768px) 100vw, 320px'}
                  />
                </Link>
              )}

              {/* Content */}
              <div className="flex-1 flex flex-col">
                {/* Tags */}
                {show_tags && insight.tags && insight.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {insight.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-block px-3 py-1 text-xs font-medium bg-muted rounded-full"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Title */}
                <h3 className={`font-bold mb-2 group-hover:text-brand-purple transition-colors ${
                  layout === 'compact' ? 'text-lg' : 'text-xl md:text-2xl'
                }`}>
                  <Link href={getInsightUrl(insight.slug)}>
                    {insight.title}
                  </Link>
                </h3>

                {/* Summary */}
                {layout !== 'compact' && insight.summary && (
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {insight.summary}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto">
                  <time dateTime={insight.publishedAt}>
                    {formatDate(insight.publishedAt)}
                  </time>
                  
                  {show_read_time && insight.reading_time && (
                    <>
                      <span>•</span>
                      <span>
                        {insight.reading_time} {locale === 'id' ? 'menit baca' : 'min read'}
                      </span>
                    </>
                  )}

                  <Link 
                    href={getInsightUrl(insight.slug)}
                    className="ml-auto font-medium text-foreground hover:text-brand-purple transition-colors"
                  >
                    {locale === 'id' ? 'Baca Selengkapnya' : 'Read More'} →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Link */}
        {insights.length >= max_items && (
          <div className="text-center mt-12">
            <Link
              href={`/${locale}/insights`}
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-foreground rounded-md font-medium hover:bg-foreground hover:text-background transition-colors"
            >
              {locale === 'id' ? 'Lihat Semua Artikel' : 'View All Articles'}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
