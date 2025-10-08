/**
 * Strapi Webhook Handler for Next.js Revalidation
 * Automatically revalidates Next.js pages when Strapi content is updated
 * 
 * API: POST /next-api/strapi-webhook
 */

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'your-secret-key';

interface WebhookPayload {
  event: string;
  model: string;
  entry?: {
    id: number;
    slug?: string;
    locale?: string;
    documentId?: string;
  };
}

export async function POST(request: Request) {
  try {
    // Parse webhook payload
    const payload: WebhookPayload = await request.json();
    
    const { event, model, entry } = payload;

    console.log(`[Webhook] Received: ${event} for ${model}`, entry);

    // Determine which paths to revalidate based on content type
    const pathsToRevalidate: string[] = [];

    // Homepage always revalidates
    pathsToRevalidate.push('/id');
    pathsToRevalidate.push('/en');

    // Content-specific revalidation
    switch (model) {
      case 'page':
        if (entry?.slug) {
          pathsToRevalidate.push(`/id/${entry.slug}`);
          pathsToRevalidate.push(`/en/${entry.slug}`);
        }
        break;

      case 'insight':
        if (entry?.slug) {
          pathsToRevalidate.push(`/id/wawasan/${entry.slug}`);
          pathsToRevalidate.push(`/en/insights/${entry.slug}`);
          pathsToRevalidate.push(`/id/wawasan/${entry.slug}/amp`);
          pathsToRevalidate.push(`/en/insights/${entry.slug}/amp`);
        }
        // Also revalidate listing pages
        pathsToRevalidate.push('/id/wawasan');
        pathsToRevalidate.push('/en/insights');
        break;

      case 'work':
        if (entry?.slug) {
          pathsToRevalidate.push(`/id/karya/${entry.slug}`);
          pathsToRevalidate.push(`/en/work/${entry.slug}`);
        }
        // Also revalidate listing pages
        pathsToRevalidate.push('/id/karya');
        pathsToRevalidate.push('/en/work');
        break;

      case 'global-strings':
        // Revalidate all pages since global strings affect everything
        pathsToRevalidate.push('/id');
        pathsToRevalidate.push('/en');
        break;

      case 'site-settings':
        // Revalidate all pages since site settings affect everything
        pathsToRevalidate.push('/id');
        pathsToRevalidate.push('/en');
        break;

      case 'testimonial':
        // Revalidate homepage and related work page if linked
        pathsToRevalidate.push('/id');
        pathsToRevalidate.push('/en');
        break;

      default:
        console.log(`[Webhook] Unknown model: ${model}`);
    }

    // Revalidate all paths
    const revalidationPromises = pathsToRevalidate.map(async (path) => {
      try {
        const revalidateUrl = `${request.headers.get('origin')}/next-api/revalidate?path=${encodeURIComponent(path)}&secret=${REVALIDATE_SECRET}`;
        
        const response = await fetch(revalidateUrl, {
          method: 'POST',
        });

        if (response.ok) {
          console.log(`[Webhook] ✓ Revalidated: ${path}`);
          return { path, success: true };
        } else {
          console.error(`[Webhook] ✗ Failed to revalidate: ${path}`);
          return { path, success: false };
        }
      } catch (error) {
        console.error(`[Webhook] ✗ Error revalidating ${path}:`, error);
        return { path, success: false, error };
      }
    });

    const results = await Promise.all(revalidationPromises);
    const successCount = results.filter(r => r.success).length;

    // Also revalidate sitemap
    try {
      const sitemapUrl = `${request.headers.get('origin')}/next-api/revalidate?path=/sitemap.xml&secret=${REVALIDATE_SECRET}`;
      await fetch(sitemapUrl, { method: 'POST' });
      console.log('[Webhook] ✓ Revalidated sitemap');
    } catch (error) {
      console.error('[Webhook] ✗ Failed to revalidate sitemap:', error);
    }

    return Response.json({
      success: true,
      message: `Revalidated ${successCount} of ${results.length} paths`,
      event,
      model,
      results,
    });
  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error);
    return Response.json(
      { success: false, error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

// Allow GET for testing
export async function GET() {
  return Response.json({
    status: 'Strapi Webhook Handler',
    endpoint: '/next-api/strapi-webhook',
    method: 'POST',
    description: 'Receives webhooks from Strapi and triggers Next.js revalidation',
  });
}
