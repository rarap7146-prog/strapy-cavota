import { NextRequest, NextResponse } from 'next/server';

// Use localhost for server-side API calls (faster, no SSL overhead)
const STRAPI_URL = 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { name, email, budget_band, message, locale } = body;
    
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Prepare data for Strapi
    const rfpData = {
      data: {
        name,
        email,
        company: body.company || null,
        goals: body.goals || null,
        scope: body.scope || null,
        budget_band: budget_band || null,
        timeline: body.timeline || null,
        message,
        locale: locale || 'id',
        source: 'website_contact_form',
        status: 'new',  // Valid enum: 'new', 'reviewed', 'contacted'
      }
    };
    
    // Submit to Strapi
    const response = await fetch(`${STRAPI_URL}/api/rfp-submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      },
      body: JSON.stringify(rfpData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Strapi API error:', response.status, errorText);
      throw new Error(`Failed to submit RFP: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      message: locale === 'id' 
        ? 'Pesan Anda telah berhasil dikirim. Tim kami akan menghubungi Anda segera.' 
        : 'Your message has been successfully sent. Our team will contact you shortly.',
      data: result.data
    });
    
  } catch (error) {
    console.error('Error submitting RFP:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        success: false
      },
      { status: 500 }
    );
  }
}
