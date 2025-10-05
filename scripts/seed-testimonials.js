#!/usr/bin/env node
"use strict";

/**
 * Strapi v5 Testimonial Entry Seeder with Proper Localization
 * Creates ONE document with TWO localizations sharing the SAME documentId.
 *
 * Endpoints used:
 *  - Create base (id): POST /api/testimonials?locale=id
 *  - Create localization (en): PUT /api/testimonials/{documentId}?locale=en
 *  - Update existing: PUT /api/testimonials/{documentId}?locale={locale}
 * 
 * This ensures Indonesian and English entries share the SAME documentId.
 */

const https = require('https');
const { URL } = require('url');

// Load environment variables from process.env
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_TOKEN;

// For local development, we'll use direct API calls without token
const IS_LOCAL = STRAPI_URL.includes('localhost');

const PUBLISH_DATE = new Date().toISOString();

// Helper: Make HTTPS/HTTP request
function makeRequest(options, data = null) {
  const requestLib = STRAPI_URL.startsWith('https:') ? require('https') : require('http');
  
  return new Promise((resolve, reject) => {
    const req = requestLib.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        let parsed;
        try {
          parsed = body ? JSON.parse(body) : {};
        } catch (err) {
          return reject(new Error('Failed to parse JSON response: ' + err.message));
        }
        resolve({ statusCode: res.statusCode, data: parsed });
      });
    });

    req.on('error', (err) => reject(err));
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Helper: Build options for requests
function buildOptions(path, method) {
  const url = new URL(STRAPI_URL);
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path,
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  // Add auth header if token is available
  if (API_TOKEN && !IS_LOCAL) {
    options.headers.Authorization = `Bearer ${API_TOKEN}`;
  }
  
  return options;
}

// Get testimonial entry by name for a given locale
async function getTestimonialByName(name, locale) {
  const path = `/api/testimonials?filters[name][$eq]=${encodeURIComponent(name)}&locale=${locale}&populate=localizations`;
  const options = buildOptions(path, 'GET');
  console.log(`🔍 GET ${path}`);
  const res = await makeRequest(options);
  if (res.statusCode === 200 && res.data.data && res.data.data.length) {
    return res.data.data[0];
  }
  return null;
}

// Create or update base entry (Indonesian locale)
async function upsertBaseTestimonial(basePayload) {
  const name = basePayload.name;
  const existing = await getTestimonialByName(name, 'id');
  const endpoint = existing ? `/api/testimonials/${existing.documentId}?locale=id` : '/api/testimonials?locale=id';
  const method = existing ? 'PUT' : 'POST';
  const payload = { data: { ...basePayload, publishedAt: PUBLISH_DATE } };
  console.log(`📝 ${existing ? 'Updating' : 'Creating'} base testimonial at ${endpoint}`);
  const options = buildOptions(endpoint, method);
  const res = await makeRequest(options, payload);
  if (res.statusCode >= 200 && res.statusCode < 300) {
    const entry = res.data.data;
    console.log(`✅ Base testimonial ${existing ? 'updated' : 'created'} with id: ${entry.id}, documentId: ${entry.documentId}`);
    return entry;
  }
  throw new Error(`Failed to upsert base testimonial: ${JSON.stringify(res.data)}`);
}

// Create or update English localization attached to the base entry
async function upsertEnLocalization(baseEntry, enPayload) {
  const name = enPayload.name;
  const existing = await getTestimonialByName(name, 'en');
  
  let endpoint, method, payloadData;
  
  if (existing) {
    // Update existing English localization
    endpoint = `/api/testimonials/${existing.documentId}?locale=en`;
    method = 'PUT';
    payloadData = {
      ...enPayload,
      publishedAt: PUBLISH_DATE,
    };
    console.log(`📝 Updating existing English localization at ${endpoint}`);
  } else {
    // Create English localization for the base document
    endpoint = `/api/testimonials/${baseEntry.documentId}?locale=en`;
    method = 'PUT';
    payloadData = {
      ...enPayload,
      publishedAt: PUBLISH_DATE,
    };
    console.log(`📝 Creating English localization for document ${baseEntry.documentId} using PUT at ${endpoint}`);
  }
  
  const payload = { data: payloadData };
  const options = buildOptions(endpoint, method);
  const res = await makeRequest(options, payload);
  if (res.statusCode >= 200 && res.statusCode < 300) {
    const entry = res.data.data;
    console.log(`✅ English localization ${existing ? 'updated' : 'created'} with id: ${entry.id}, documentId: ${entry.documentId}`);
    return entry;
  }
  throw new Error(`Failed to upsert English localization: ${JSON.stringify(res.data)}`);
}

// Main seeding function
async function seedTestimonials() {
  const testimonials = [
    {
      id: {
        quote: "CAVOTA tidak hanya mengoptimalkan campaign ads kami, tapi juga mengubah cara kami memahami customer journey. ROI meningkat 340% dalam 3 bulan — hasil yang tidak pernah kami bayangkan sebelumnya.",
        name: "Sarah Wijaya",
        title: "Marketing Director",
        company: "TechStart Indonesia",
        link: "https://techstart.id"
      },
      en: {
        quote: "CAVOTA didn't just optimize our ad campaigns, but transformed how we understand customer journey. ROI increased 340% in 3 months — results we never imagined before.",
        name: "Sarah Wijaya",
        title: "Marketing Director", 
        company: "TechStart Indonesia",
        link: "https://techstart.id"
      }
    },
    {
      id: {
        quote: "Website redesign dari CAVOTA bukan sekadar visual upgrade. User experience yang mereka ciptakan meningkatkan conversion rate 180% dan membuat customer lebih lama berinteraksi dengan brand kami.",
        name: "Michael Chen",
        title: "CEO",
        company: "EcoLiving",
        link: "https://ecoliving.co.id"
      },
      en: {
        quote: "The website redesign from CAVOTA wasn't just a visual upgrade. The user experience they created increased conversion rate by 180% and made customers interact longer with our brand.",
        name: "Michael Chen",
        title: "CEO",
        company: "EcoLiving", 
        link: "https://ecoliving.co.id"
      }
    },
    {
      id: {
        quote: "Program mentorship CAVOTA mengubah seluruh perspektif saya tentang digital marketing. Dalam 6 bulan, saya berhasil naik jabatan dan memimpin tim marketing yang 3x lebih besar.",
        name: "Dian Pratiwi",
        title: "Senior Marketing Manager",
        company: "BeautyNow",
        link: "https://beautynow.id"
      },
      en: {
        quote: "CAVOTA's mentorship program completely changed my perspective on digital marketing. In 6 months, I got promoted and now lead a marketing team 3x larger.",
        name: "Dian Pratiwi",
        title: "Senior Marketing Manager",
        company: "BeautyNow",
        link: "https://beautynow.id"
      }
    },
    {
      id: {
        quote: "Strategi SEO CAVOTA membuat website kami mendominasi page 1 Google untuk 15+ keywords utama. Organic traffic naik 450% dan kualitas lead yang masuk jauh lebih qualified.",
        name: "Rizky Firmansyah",
        title: "Digital Marketing Head",
        company: "FinanceMax",
        link: "https://financemax.co.id"
      },
      en: {
        quote: "CAVOTA's SEO strategy made our website dominate Google page 1 for 15+ main keywords. Organic traffic increased 450% and the quality of incoming leads is much more qualified.",
        name: "Rizky Firmansyah",
        title: "Digital Marketing Head",
        company: "FinanceMax",
        link: "https://financemax.co.id"
      }
    },
    {
      id: {
        quote: "Kolaborasi influencer yang diatur CAVOTA terasa sangat natural dan authentic. Brand awareness kami meningkat 280% dengan engagement rate yang konsisten tinggi di semua platform.",
        name: "Amanda Sari",
        title: "Brand Manager",
        company: "FashionForward",
        link: "https://fashionforward.id"
      },
      en: {
        quote: "The influencer collaborations arranged by CAVOTA felt very natural and authentic. Our brand awareness increased 280% with consistently high engagement rates across all platforms.",
        name: "Amanda Sari",
        title: "Brand Manager",
        company: "FashionForward",
        link: "https://fashionforward.id"
      }
    }
  ];

  console.log('🚀 Starting testimonial seeding process...');
  
  for (const testimonial of testimonials) {
    try {
      console.log(`\n👤 Processing testimonial for: ${testimonial.id.name}`);
      
      // Create/update Indonesian base entry
      const baseEntry = await upsertBaseTestimonial(testimonial.id);
      
      // Create/update English localization
      await upsertEnLocalization(baseEntry, testimonial.en);
      
      console.log(`✅ Completed testimonial for: ${testimonial.id.name}\n`);
      
    } catch (error) {
      console.error(`❌ Failed to process testimonial for ${testimonial.id.name}:`, error.message);
    }
  }
  
  console.log('🎉 Testimonial seeding completed!');
}

// Run the seeder
if (require.main === module) {
  seedTestimonials().catch(console.error);
}

module.exports = { seedTestimonials };