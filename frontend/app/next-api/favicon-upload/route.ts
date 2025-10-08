/**
 * Favicon Upload API Proxy
 * Proxies favicon zip uploads to Strapi backend
 * 
 * POST /next-api/favicon-upload
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Forward to Strapi
    const strapiFormData = new FormData();
    strapiFormData.append('file', file);

    const response = await fetch(`${STRAPI_URL}/api/favicon-settings/upload`, {
      method: 'POST',
      body: strapiFormData,
    });

    if (!response.ok) {
      const error = await response.json();
      return Response.json(
        { error: error.message || 'Upload failed' },
        { status: response.status }
      );
    }

    const result = await response.json();

    return Response.json({
      success: true,
      message: 'Favicon files uploaded successfully',
      ...result,
    });
  } catch (error) {
    console.error('Error uploading favicon:', error);
    return Response.json(
      { error: 'Failed to upload favicon files' },
      { status: 500 }
    );
  }
}

// GET for status check
export async function GET() {
  return Response.json({
    endpoint: '/next-api/favicon-upload',
    method: 'POST',
    description: 'Upload favicon zip file',
    accepts: 'multipart/form-data',
  });
}
