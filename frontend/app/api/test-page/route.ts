import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const apiUrl = process.env.STRAPI_API_URL || 'http://localhost:1337'
    const apiToken = process.env.STRAPI_API_TOKEN
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (apiToken) {
      headers['Authorization'] = `Bearer ${apiToken}`
    }

    // Test basic pages endpoint
    const pagesResponse = await fetch(`${apiUrl}/api/pages?populate=*`, {
      headers,
    })
    
    if (!pagesResponse.ok) {
      throw new Error(`API Error: ${pagesResponse.status} ${pagesResponse.statusText}`)
    }
    
    const pagesData = await pagesResponse.json()
    
    // Test specific page
    const tentangResponse = await fetch(`${apiUrl}/api/pages?filters[slug][$eq]=tentang&populate[sections][populate]=*`, {
      headers,
    })
    
    const tentangData = await tentangResponse.json()
    
    return NextResponse.json({
      success: true,
      apiUrl,
      hasToken: !!apiToken,
      pagesCount: pagesData.data?.length || 0,
      tentangPage: tentangData.data?.[0] || null,
      tentangSections: tentangData.data?.[0]?.sections || null,
    })
  } catch (error) {
    console.error('API Test Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}