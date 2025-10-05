#!/usr/bin/env node
"use strict";

/**
 * Strapi v5 Authentic Testimonial Seeder
 * Creates testimonials in their original languages without forced localization.
 * Each testimonial represents authentic client feedback in their preferred language.
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

// Create authentic testimonial
async function createTestimonial(testimonialData) {
  const endpoint = '/api/testimonials';
  const payload = { data: { ...testimonialData, publishedAt: PUBLISH_DATE } };
  console.log(`📝 Creating testimonial for: ${testimonialData.name}`);
  const options = buildOptions(endpoint, 'POST');
  const res = await makeRequest(options, payload);
  if (res.statusCode >= 200 && res.statusCode < 300) {
    const entry = res.data.data;
    console.log(`✅ Testimonial created with id: ${entry.id}, documentId: ${entry.documentId}`);
    return entry;
  }
  throw new Error(`Failed to create testimonial: ${JSON.stringify(res.data)}`);
}

// Main seeding function
async function seedAuthenticTestimonials() {
  // Clear existing testimonials first
  console.log('🧹 Clearing existing testimonials...');
  try {
    const existingRes = await makeRequest(buildOptions('/api/testimonials', 'GET'));
    if (existingRes.data.data && existingRes.data.data.length > 0) {
      for (const testimonial of existingRes.data.data) {
        try {
          await makeRequest(buildOptions(`/api/testimonials/${testimonial.documentId}`, 'DELETE'));
          console.log(`🗑️ Deleted testimonial: ${testimonial.name}`);
        } catch (err) {
          console.log(`⚠️ Could not delete testimonial ${testimonial.name}: ${err.message}`);
        }
      }
    }
  } catch (err) {
    console.log('⚠️ Could not clear existing testimonials, continuing...');
  }

  const authentticTestimonials = [
    {
      quote: "CAVOTA tidak hanya mengoptimalkan campaign ads kami, tapi juga mengubah cara kami memahami customer journey. ROI meningkat 340% dalam 3 bulan — hasil yang tidak pernah kami bayangkan sebelumnya.",
      name: "Sarah Wijaya",
      title: "Marketing Director",
      company: "TechStart Indonesia",
      link: "https://techstart.id"
    },
    {
      quote: "The website redesign from CAVOTA wasn't just a visual upgrade. The user experience they created increased our conversion rate by 180% and made customers interact much longer with our brand.",
      name: "Michael Chen",
      title: "CEO",
      company: "EcoLiving",
      link: "https://ecoliving.co.id"
    },
    {
      quote: "Program mentorship CAVOTA mengubah seluruh perspektif saya tentang digital marketing. Dalam 6 bulan, saya berhasil naik jabatan dan memimpin tim marketing yang 3x lebih besar.",
      name: "Dian Pratiwi",
      title: "Senior Marketing Manager",
      company: "BeautyNow",
      link: "https://beautynow.id"
    },
    {
      quote: "CAVOTA's SEO strategy made our website dominate Google page 1 for 15+ main keywords. Organic traffic increased 450% and the quality of incoming leads is much more qualified.",
      name: "Rizky Firmansyah",
      title: "Digital Marketing Head",
      company: "FinanceMax",
      link: "https://financemax.co.id"
    },
    {
      quote: "Kolaborasi influencer yang diatur CAVOTA terasa sangat natural dan authentic. Brand awareness kami meningkat 280% dengan engagement rate yang konsisten tinggi di semua platform.",
      name: "Amanda Sari",
      title: "Brand Manager",
      company: "FashionForward",
      link: "https://fashionforward.id"
    },
    {
      quote: "Working with CAVOTA transformed our entire digital presence. Their content intelligence system didn't just automate our publishing — it elevated our brand voice and audience engagement beyond what we thought possible.",
      name: "James Liu",
      title: "Founder",
      company: "InnovateTech",
      link: "https://innovatetech.asia"
    },
    {
      quote: "Tim CAVOTA membantu kami membangun brand recognition yang kuat dari nol. Dalam setahun, brand kami dikenal 78% dari target market — pencapaian yang luar biasa untuk startup.",
      name: "Putri Maharani",
      title: "Co-Founder",
      company: "GreenLife",
      link: "https://greenlife.id"
    }
  ];

  console.log('🚀 Starting authentic testimonial seeding process...');
  
  for (const testimonial of authentticTestimonials) {
    try {
      await createTestimonial(testimonial);
      console.log(`✅ Completed testimonial for: ${testimonial.name}\n`);
      
    } catch (error) {
      console.error(`❌ Failed to process testimonial for ${testimonial.name}:`, error.message);
    }
  }
  
  console.log('🎉 Authentic testimonial seeding completed!');
}

// Run the seeder
if (require.main === module) {
  seedAuthenticTestimonials().catch(console.error);
}

module.exports = { seedAuthenticTestimonials };