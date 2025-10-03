#!/usr/bin/env node

/**
 * Strapi v5 Work Entry Seeder
 * Idempotent upsert via REST API
 */

const https = require('https');

// Configuration
const STRAPI_BASE_URL = 'https://linkgacor.one';
const API_TOKEN = '8953c0183eaee87ccf284e7db9404875bb41a685b54a89c7381cbd59f91790234db270dfa03b589bb2a6232d8ea8fced86412a491cda820f43cc213669d2bc3703055c4d122886dc02729be9d914fce7eb01b3acaf3b3d386da5165cd4995816bc68388cc2eff9fc38fe18eda87b9b8330e27e2520cd3e5ded0702267ef8899a';

// Data for both locales
const workData = {
  translation_key: 'work-enterprise-anon-mm-usd',
  id: {
    title: 'Enterprise (Anonim) — Programmatic Multi-Million USD',
    slug: 'enterprise-anonim-programmatic',
    summary: 'Kontrol risiko & skalabilitas di anggaran jutaan USD lintas channel.',
    categories: ['ads'],
    channels: ['google_ads', 'meta_ads', 'tiktok_ads', 'other'],
    tags: ['awareness', 'conversion'],
    budget_band: 'multi_million_usd',
    is_enterprise: true,
    metrics: [
      { label: 'ROAS', value_before: 1.6, value_after: 2.4, unit: 'x' },
      { label: 'CPA', value_before: 1.0, value_after: 0.82, unit: 'index' }
    ],
    body: 'Guardrails harian (pacing, cap, frequency), creative rotation cepat, anti-fatigue rules, brand-safety policy.'
  },
  en: {
    title: 'Enterprise (Anonymized) — Multi-Million USD Programmatic',
    slug: 'enterprise-anonymized-programmatic',
    summary: 'Risk control & scalability for multi-million USD budgets across channels.',
    categories: ['ads'],
    channels: ['google_ads', 'meta_ads', 'tiktok_ads', 'other'],
    tags: ['awareness', 'conversion'],
    budget_band: 'multi_million_usd',
    is_enterprise: true,
    metrics: [
      { label: 'ROAS', value_before: 1.6, value_after: 2.4, unit: 'x' },
      { label: 'CPA', value_before: 1.0, value_after: 0.82, unit: 'index' }
    ],
    body: 'Daily guardrails (pacing, cap, frequency), rapid creative rotation, anti-fatigue rules, brand-safety policy.'
  }
};

// HTTP Request Helper
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = {
            statusCode: res.statusCode,
            data: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (error) {
          reject(new Error(`Parse error: ${error.message}`));
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Check if entry exists
async function checkExistingEntry(translationKey, locale) {
  const options = {
    hostname: 'linkgacor.one',
    path: `/api/works?locale=${locale}&filters[translation_key][$eq]=${translationKey}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  console.log(`🔍 Checking existing entry for locale=${locale}...`);
  const response = await makeRequest(options);
  
  if (response.statusCode === 200 && response.data?.data?.length > 0) {
    return response.data.data[0];
  }
  return null;
}

// Create new entry
async function createEntry(data, locale) {
  const payload = {
    data: {
      ...data,
      locale: locale,
      publishedAt: new Date().toISOString()
    }
  };

  const options = {
    hostname: 'linkgacor.one',
    path: '/api/works',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  console.log(`📝 Creating new entry for locale=${locale}...`);
  console.log(`Payload:`, JSON.stringify(payload, null, 2));
  
  const response = await makeRequest(options, payload);
  return response;
}

// Update existing entry
async function updateEntry(documentId, data, locale) {
  const payload = {
    data: {
      ...data,
      locale: locale,
      publishedAt: new Date().toISOString()
    }
  };

  const options = {
    hostname: 'linkgacor.one',
    path: `/api/works/${documentId}`,
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  console.log(`✏️  Updating entry ${documentId} for locale=${locale}...`);
  console.log(`Payload:`, JSON.stringify(payload, null, 2));
  
  const response = await makeRequest(options, payload);
  return response;
}

// Upsert entry for a specific locale
async function upsertEntry(translationKey, localeData, locale) {
  try {
    console.log(`\n🚀 Processing locale: ${locale.toUpperCase()}`);
    
    // Check if entry exists
    const existing = await checkExistingEntry(translationKey, locale);
    
    let response;
    if (existing) {
      console.log(`✅ Found existing entry with ID: ${existing.documentId}`);
      response = await updateEntry(existing.documentId, localeData, locale);
    } else {
      console.log(`➕ No existing entry found, creating new one...`);
      response = await createEntry(localeData, locale);
    }

    // Handle response
    if (response.statusCode >= 200 && response.statusCode < 300) {
      const action = existing ? 'UPDATED' : 'CREATED';
      const entryId = response.data?.data?.documentId || existing?.documentId;
      console.log(`✅ ${action} successfully! Entry ID: ${entryId}`);
      console.log(`📊 Response:`, JSON.stringify(response.data, null, 2));
      return { success: true, action, entryId, locale };
    } else {
      console.error(`❌ Error ${response.statusCode}:`, response.data);
      return { success: false, error: response.data, locale };
    }

  } catch (error) {
    console.error(`❌ Error processing locale ${locale}:`, error.message);
    return { success: false, error: error.message, locale };
  }
}

// Main execution
async function main() {
  console.log('🌱 Starting Strapi v5 Work Entry Seeder');
  console.log(`📍 Target: ${workData.translation_key}`);
  console.log('=' .repeat(60));

  const results = [];

  // Process ID locale first
  const idResult = await upsertEntry(
    workData.translation_key,
    workData.id,
    'id'
  );
  results.push(idResult);

  // Process EN locale
  const enResult = await upsertEntry(
    workData.translation_key,
    workData.en,
    'en'
  );
  results.push(enResult);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📈 SEEDING SUMMARY');
  console.log('='.repeat(60));
  
  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.locale.toUpperCase()}: ${result.action} (ID: ${result.entryId})`);
    } else {
      console.log(`❌ ${result.locale.toUpperCase()}: FAILED - ${result.error}`);
    }
  });

  // Verification instructions
  console.log('\n🔍 VERIFICATION:');
  console.log(`GET ${STRAPI_BASE_URL}/api/works?locale=id&filters[translation_key][$eq]=${workData.translation_key}`);
  console.log(`GET ${STRAPI_BASE_URL}/api/works?locale=en&filters[translation_key][$eq]=${workData.translation_key}`);
  
  const allSuccess = results.every(r => r.success);
  process.exit(allSuccess ? 0 : 1);
}

// Execute if run directly
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { upsertEntry, workData };