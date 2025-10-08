/**
 * Favicon Settings API Proxy
 * Proxies favicon settings requests to Strapi backend
 * 
 * GET /next-api/favicon-settings
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

export async function GET(request: Request) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/favicon-settings`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return Response.json({
          data: null,
          message: 'No favicon settings found. Please upload favicons first.',
        });
      }

      return Response.json(
        { error: 'Failed to fetch favicon settings' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return Response.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error fetching favicon settings:', error);
    return Response.json(
      { error: 'Failed to fetch favicon settings' },
      { status: 500 }
    );
  }
}
