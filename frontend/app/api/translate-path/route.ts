import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const currentSlug = searchParams.get('slug');
  const currentLocale = searchParams.get('currentLocale');
  const targetLocale = searchParams.get('targetLocale');

  if (!currentSlug || !currentLocale || !targetLocale) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    // First, get the current page to find its document_id
    const currentPageResponse = await fetch(
      `${STRAPI_URL}/api/pages?filters[slug][$eq]=${currentSlug}&locale=${currentLocale}`,
      { cache: 'no-store' }
    );

    if (!currentPageResponse.ok) {
      return NextResponse.json({ slug: currentSlug }, { status: 200 });
    }

    const currentPageData = await currentPageResponse.json();
    
    if (!currentPageData.data || currentPageData.data.length === 0) {
      return NextResponse.json({ slug: currentSlug }, { status: 200 });
    }

    const documentId = currentPageData.data[0].documentId;

    // Now find the page with the same document_id but in the target locale
    const translatedPageResponse = await fetch(
      `${STRAPI_URL}/api/pages?filters[documentId][$eq]=${documentId}&locale=${targetLocale}`,
      { cache: 'no-store' }
    );

    if (!translatedPageResponse.ok) {
      return NextResponse.json({ slug: currentSlug }, { status: 200 });
    }

    const translatedPageData = await translatedPageResponse.json();

    if (translatedPageData.data && translatedPageData.data.length > 0) {
      const translatedSlug = translatedPageData.data[0].slug;
      return NextResponse.json({ slug: translatedSlug }, { status: 200 });
    }

    // If no translation found, return the original slug
    return NextResponse.json({ slug: currentSlug }, { status: 200 });
  } catch (error) {
    console.error('Error translating path:', error);
    return NextResponse.json({ slug: currentSlug }, { status: 200 });
  }
}
