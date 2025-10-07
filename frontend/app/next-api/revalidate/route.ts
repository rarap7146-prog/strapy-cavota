export async function POST(request: Request) {
  try {
    const secret = process.env.REVALIDATE_SECRET
    
    if (!secret) {
      return Response.json(
        { error: 'REVALIDATE_SECRET not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { model, slug, locale, secret: providedSecret } = body

    // Validate secret
    if (providedSecret !== secret) {
      return Response.json(
        { error: 'Invalid secret' },
        { status: 401 }
      )
    }

    // Validate required fields
    if (!model || !slug) {
      return Response.json(
        { error: 'Missing required fields: model, slug' },
        { status: 400 }
      )
    }

    // Build cache tags to revalidate
    const tags: string[] = []
    
    if (model === 'page') {
      tags.push(`page:${slug}:${locale || 'id'}`)
    } else if (model === 'insight') {
      tags.push(`insight:${slug}:${locale || 'id'}`)
      tags.push(`insights:${locale || 'id'}`)
    }

    // Revalidate each tag
    const revalidatedTags: string[] = []
    for (const tag of tags) {
      try {
        const { revalidateTag } = await import('next/cache')
        revalidateTag(tag)
        revalidatedTags.push(tag)
        console.log(`✅ Revalidated cache tag: ${tag}`)
      } catch (error) {
        console.error(`❌ Failed to revalidate tag ${tag}:`, error)
      }
    }

    return Response.json({
      revalidated: true,
      tags: revalidatedTags,
      timestamp: new Date().toISOString(),
      message: `Successfully revalidated ${revalidatedTags.length} cache tag(s)`,
    })

  } catch (error) {
    console.error('Revalidation error:', error)
    return Response.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const model = searchParams.get('model')
  const slug = searchParams.get('slug')
  const locale = searchParams.get('locale')
  const secret = searchParams.get('secret')

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json(
      { error: 'Invalid or missing secret' },
      { status: 401 }
    )
  }

  if (!model || !slug) {
    return Response.json(
      { error: 'Missing required query params: model, slug' },
      { status: 400 }
    )
  }

  // Convert to POST format and reuse logic
  const mockRequest = {
    json: async () => ({ model, slug, locale, secret })
  } as Request

  return POST(mockRequest)
}