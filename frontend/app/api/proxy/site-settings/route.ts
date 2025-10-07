import { NextRequest, NextResponse } from 'next/server';

// Use environment variable for Strapi URL
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

export async function GET() {
  try {
    const response = await fetch(`${STRAPI_URL}/api/site-settings`, {
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch site settings: ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Site settings API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}