/**
 * Favicon Proxy API for Next.js
 * Serves favicon files from Strapi backend
 * 
 * This ensures favicons are served from the frontend domain
 * even though they're uploaded to Strapi
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const file = searchParams.get('file');

    if (!file) {
      return new Response('File parameter required', { status: 400 });
    }

    // Validate filename to prevent directory traversal
    const allowedFiles = [
      'apple-touch-icon.png',
      'favicon.ico',
      'favicon.svg',
      'favicon-96x96.png',
      'site.webmanifest',
      'web-app-manifest-192x192.png',
      'web-app-manifest-512x512.png',
    ];

    if (!allowedFiles.includes(file)) {
      return new Response('Invalid file', { status: 400 });
    }

    // Fetch file from Strapi
    const response = await fetch(`${STRAPI_URL}/favicons/${file}`, {
      cache: 'force-cache',
    });

    if (!response.ok) {
      return new Response('File not found', { status: 404 });
    }

    // Determine content type
    const contentTypeMap: Record<string, string> = {
      'apple-touch-icon.png': 'image/png',
      'favicon.ico': 'image/x-icon',
      'favicon.svg': 'image/svg+xml',
      'favicon-96x96.png': 'image/png',
      'site.webmanifest': 'application/manifest+json',
      'web-app-manifest-192x192.png': 'image/png',
      'web-app-manifest-512x512.png': 'image/png',
    };

    const contentType = contentTypeMap[file] || 'application/octet-stream';
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving favicon:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
