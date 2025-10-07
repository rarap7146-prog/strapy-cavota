import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

const STRAPI_URL = 'http://localhost:1337';

interface PageProps {
  params: Promise<{
    locale: 'id' | 'en';
    slug: string;
  }>;
}

// Fetch insight data
async function getInsight(slug: string, locale: string) {
  try {
    // Build query string manually to properly handle Strapi v5 syntax
    const queryParams = [
      `filters[slug][$eq]=${encodeURIComponent(slug)}`,
      `locale=${locale}`,
      'populate[0]=hero_image',
      'populate[1]=tags',
    ].join('&');

    const response = await fetch(
      `${STRAPI_URL}/api/insights?${queryParams}`,
      {
        next: { revalidate: 60 },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch insight:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return null;
    }

    return data.data[0];
  } catch (error) {
    console.error('Error fetching insight:', error);
    return null;
  }
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const insight = await getInsight(slug, locale);

  if (!insight) {
    return {
      title: 'Article Not Found',
    };
  }

  const title = `${insight.title} | CAVOTA`;
  const description = insight.summary || '';
  const imageUrl = insight.hero_image?.url 
    ? `${STRAPI_URL}${insight.hero_image.url}`
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title: insight.title,
      description,
      type: 'article',
      publishedTime: insight.publishedAt,
      images: imageUrl ? [imageUrl] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: insight.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function InsightPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const insight = await getInsight(slug, locale);

  if (!insight) {
    notFound();
  }

  // Format date
  const publishedDate = new Date(insight.publishedAt).toLocaleDateString(
    locale === 'id' ? 'id-ID' : 'en-US',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );

  // Calculate reading time (use reading_time from API or calculate from body)
  const readingTime = insight.reading_time || 
    Math.ceil((insight.body?.split(/\s+/).length || 0) / 200);

  return (
    <article className="container-fluid py-16">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-muted-foreground">
          <Link href={`/${locale}`} className="hover:text-foreground">
            {locale === 'id' ? 'Beranda' : 'Home'}
          </Link>
          {' / '}
          <Link href={`/${locale}/wawasan`} className="hover:text-foreground">
            {locale === 'id' ? 'Wawasan' : 'Insights'}
          </Link>
          {' / '}
          <span className="text-foreground">{insight.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {insight.title}
          </h1>

          {insight.summary && (
            <p className="text-xl text-muted-foreground mb-6">
              {insight.summary}
            </p>
          )}

          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <time dateTime={insight.publishedAt}>{publishedDate}</time>
            {readingTime > 0 && (
              <>
                <span>•</span>
                <span>
                  {readingTime} {locale === 'id' ? 'menit baca' : 'min read'}
                </span>
              </>
            )}
          </div>

          {/* Tags */}
          {insight.tags && insight.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {insight.tags.map((tag: any) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 text-xs font-medium bg-muted rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Hero Image */}
        {insight.hero_image?.url && (
          <div className="relative w-full aspect-video mb-12 rounded-lg overflow-hidden">
            <Image
              src={`${STRAPI_URL}${insight.hero_image.url}`}
              alt={insight.hero_image.alternativeText || insight.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:mt-8 prose-headings:mb-4 prose-p:mb-6 prose-ul:my-6 prose-ol:my-6 prose-li:my-2">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
              p: ({ node, ...props }) => <p className="mb-6" {...props} />,
              h1: ({ node, ...props }) => <h1 className="mt-8 mb-4" {...props} />,
              h2: ({ node, ...props }) => <h2 className="mt-8 mb-4" {...props} />,
              h3: ({ node, ...props }) => <h3 className="mt-6 mb-3" {...props} />,
              ul: ({ node, ...props }) => <ul className="my-6 space-y-2" {...props} />,
              ol: ({ node, ...props }) => <ol className="my-6 space-y-2" {...props} />,
              li: ({ node, ...props }) => <li className="my-2" {...props} />,
              hr: ({ node, ...props }) => <hr className="my-8" {...props} />,
            }}
          >
            {insight.body || ''}
          </ReactMarkdown>
        </div>

        {/* Back to insights link */}
        <div className="mt-12 pt-8 border-t">
          <Link
            href={`/${locale}/wawasan`}
            className="inline-flex items-center text-brand-purple hover:underline"
          >
            ← {locale === 'id' ? 'Kembali ke Wawasan' : 'Back to Insights'}
          </Link>
        </div>
      </div>
    </article>
  );
}
