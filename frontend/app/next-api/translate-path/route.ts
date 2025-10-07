import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const currentSlug = searchParams.get('slug');
  const currentLocale = searchParams.get('currentLocale');
  const targetLocale = searchParams.get('targetLocale');
  const contentType = searchParams.get('type') || 'pages'; // Default to pages, can be 'insights'

  if (!currentSlug || !currentLocale || !targetLocale) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    // Determine which collection to query based on content type
    let collection = 'pages';
    if (contentType === 'insights') {
      collection = 'insights';
    } else if (contentType === 'works') {
      collection = 'works';
    }
    
    // First, get the current item to find its document_id
    const currentItemResponse = await fetch(
      `${STRAPI_URL}/api/${collection}?filters[slug][$eq]=${currentSlug}&locale=${currentLocale}`,
      { cache: 'no-store' }
    );

    if (!currentItemResponse.ok) {
      return NextResponse.json({ slug: currentSlug }, { status: 200 });
    }

    const currentItemData = await currentItemResponse.json();
    
    if (!currentItemData.data || currentItemData.data.length === 0) {
      return NextResponse.json({ slug: currentSlug }, { status: 200 });
    }

    const documentId = currentItemData.data[0].documentId;

    // Now find the item with the same document_id but in the target locale
    const translatedItemResponse = await fetch(
      `${STRAPI_URL}/api/${collection}?filters[documentId][$eq]=${documentId}&locale=${targetLocale}`,
      { cache: 'no-store' }
    );

    if (!translatedItemResponse.ok) {
      return NextResponse.json({ slug: currentSlug }, { status: 200 });
    }

    const translatedItemData = await translatedItemResponse.json();

    if (translatedItemData.data && translatedItemData.data.length > 0) {
      const translatedSlug = translatedItemData.data[0].slug;
      return NextResponse.json({ slug: translatedSlug }, { status: 200 });
    }

    // If no translation found, return the original slug
    return NextResponse.json({ slug: currentSlug }, { status: 200 });
  } catch (error) {
    console.error('Error translating path:', error);
    return NextResponse.json({ slug: currentSlug }, { status: 200 });
  }
}
