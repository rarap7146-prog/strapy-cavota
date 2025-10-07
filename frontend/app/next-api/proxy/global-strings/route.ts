import { NextRequest, NextResponse } from 'next/server';

// Use localhost for server-side API calls (faster, no SSL overhead, avoids circular routing)
const STRAPI_URL = 'http://localhost:1337';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'id';

    const response = await fetch(`${STRAPI_URL}/api/global-strings?locale=${locale}`, {
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch global strings: ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Global strings API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch global strings' },
      { status: 500 }
    );
  }
}