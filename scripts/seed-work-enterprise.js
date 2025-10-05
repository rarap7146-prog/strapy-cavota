#!/usr/bin/env node
"use strict";

/**
 * Strapi v5 Work Entry Seeder with Proper Localization
 * Creates ONE document with TWO localizations sharing the SAME documentId.
 *
 * Endpoints used:
 *  - Create base (id): POST /api/works?locale=id
 *  - Create localization (en): POST /api/works?locale=en with "relatedEntityId": baseDocumentId
 *  - Update existing: PUT /api/works/{documentId}?locale={locale}
 *
 * For tags:
 *  - GET /api/tags?filters[name][$eq]=<name>&locale=id
 *  - POST /api/tags?locale=id (if not found)
 * 
 * This ensures Indonesian and English entries share the SAME documentId.
 */

const https = require('https');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

// Load environment variables from process.env
const STRAPI_URL = process.env.STRAPI_URL || 'https://linkgacor.one';
const API_TOKEN = process.env.STRAPI_TOKEN;
if (!API_TOKEN) {
  console.error('✖ STRAPI_TOKEN is not set in environment variables.');
  process.exit(1);
}

const PUBLISH_DATE = new Date().toISOString();

// Load work data from JSON file
function loadWorkData(jsonFilePath) {
  try {
    const fullPath = path.resolve(jsonFilePath);
    console.log(`📁 Loading work data from: ${fullPath}`);
    const jsonData = fs.readFileSync(fullPath, 'utf8');
    const data = JSON.parse(jsonData);
    
    // Validate required fields
    if (!data.translation_key) {
      throw new Error('Missing required field: translation_key');
    }
    if (!data.locales || !data.locales.id || !data.locales.en) {
      throw new Error('Missing required locales: id and en');
    }
    
    console.log(`✅ Loaded data for translation_key: ${data.translation_key}`);
    return data;
  } catch (error) {
    console.error(`❌ Error loading JSON file: ${error.message}`);
    process.exit(1);
  }
}

// Helper: Make HTTPS request
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
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

// Helper: Build options for HTTPS requests
function buildOptions(path, method) {
  const url = new URL(STRAPI_URL);
  return {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path,
    method,
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };
}

// Get work entry by translation_key for a given locale
async function getWorkByTranslationKey(translationKey, locale) {
  const path = `/api/works?filters[translation_key][$eq]=${encodeURIComponent(translationKey)}&locale=${locale}&populate=localizations`;
  const options = buildOptions(path, 'GET');
  console.log(`🔍 GET ${path}`);
  const res = await makeRequest(options);
  if (res.statusCode === 200 && res.data.data && res.data.data.length) {
    return res.data.data[0];
  }
  return null;
}

// Get or create a tag by name (returns tag id)
async function getOrCreateTag(tagName) {
  const path = `/api/tags?filters[name][$eq]=${encodeURIComponent(tagName)}&locale=id`;
  const options = buildOptions(path, 'GET');
  console.log(`🔍 GET Tag: ${tagName}`);
  const res = await makeRequest(options);
  if (res.statusCode === 200 && res.data.data && res.data.data.length) {
    return res.data.data[0].id;
  }
  // Tag does not exist, create it with required scope field
  const payload = {
    data: {
      name: tagName,
      slug: tagName.toLowerCase().replace(/\s+/g, '-'),
      scope: 'work', // Add required scope field
      publishedAt: PUBLISH_DATE,
    },
  };
  const createOptions = buildOptions('/api/tags?locale=id', 'POST');
  console.log(`📝 Creating Tag: ${tagName}`);
  const createRes = await makeRequest(createOptions, payload);
  if (createRes.statusCode >= 200 && createRes.statusCode < 300) {
    return createRes.data.data.id;
  }
  throw new Error(`Failed to create tag ${tagName}: ${JSON.stringify(createRes.data)}`);
}

// Create or update base entry (Indonesian locale)
async function upsertBaseEntry(basePayload) {
  const translationKey = basePayload.translation_key;
  const existing = await getWorkByTranslationKey(translationKey, 'id');
  const endpoint = existing ? `/api/works/${existing.documentId}?locale=id` : '/api/works?locale=id';
  const method = existing ? 'PUT' : 'POST';
  const payload = { data: { ...basePayload, publishedAt: PUBLISH_DATE } };
  console.log(`📝 ${existing ? 'Updating' : 'Creating'} base entry at ${endpoint}`);
  const options = buildOptions(endpoint, method);
  const res = await makeRequest(options, payload);
  if (res.statusCode >= 200 && res.statusCode < 300) {
    const entry = res.data.data;
    console.log(`✅ Base entry ${existing ? 'updated' : 'created'} with id: ${entry.id}, documentId: ${entry.documentId}`);
    return entry;
  }
  throw new Error(`Failed to upsert base entry: ${JSON.stringify(res.data)}`);
}

// Create or update English localization attached to the base entry
async function upsertEnLocalization(baseEntry, enPayload) {
  const translationKey = enPayload.translation_key;
  const existing = await getWorkByTranslationKey(translationKey, 'en');
  
  let endpoint, method, payloadData;
  
  if (existing) {
    // Update existing English localization
    endpoint = `/api/works/${existing.documentId}?locale=en`;
    method = 'PUT';
    payloadData = {
      ...enPayload,
      publishedAt: PUBLISH_DATE,
    };
    console.log(`📝 Updating existing English localization at ${endpoint}`);
  } else {
    // Try the document management approach for creating localization
    // PUT to the base document with locale=en should create the localization
    endpoint = `/api/works/${baseEntry.documentId}?locale=en`;
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

// Main seeding process
async function seedWork(jsonFilePath = 'data/work-enterprise.json') {
  try {
    console.log('🌱 Starting Strapi v5 Work Entry Seeder');
    
    // Load work data from JSON file
    const workData = loadWorkData(jsonFilePath);
    const translationKey = workData.translation_key;
    
    // Process tags: get or create tag ids
    const tagNames = workData.tags || [];
    const tagIds = [];
    for (const tagName of tagNames) {
      const tagId = await getOrCreateTag(tagName);
      tagIds.push(tagId);
    }

    // Prepare base (Indonesian) payload
    const basePayload = {
      translation_key: translationKey,
      ...workData.locales.id,
      tags: tagIds,
    };

    // Prepare English payload
    const enPayload = {
      translation_key: translationKey,
      ...workData.locales.en,
      tags: tagIds,
    };

    // Upsert base entry (Indonesian locale)
    const baseEntry = await upsertBaseEntry(basePayload);

    // Upsert English localization attached to the same base
    const enEntry = await upsertEnLocalization(baseEntry, enPayload);

    console.log('─────────────────────────────');
    console.log('SEEDING SUMMARY:');
    console.log(`Base Document ID: ${baseEntry.documentId}`);
    console.log(`Indonesian Entry ID: ${baseEntry.id}`);
    console.log(`English Entry ID: ${enEntry.id}`);
    console.log(`English Document ID: ${enEntry.documentId}`);
    console.log(`Documents Match: ${baseEntry.documentId === enEntry.documentId ? '✅ YES' : '❌ NO'}`);
    console.log('─────────────────────────────');

    // Verification instructions
    console.log('\nVERIFICATION:');
    console.log(`• GET ${STRAPI_URL}/api/works?filters[translation_key][$eq]=${translationKey}&locale=id`);
    console.log(`• GET ${STRAPI_URL}/api/works?filters[translation_key][$eq]=${translationKey}&locale=en`);
    console.log(`• GET ${STRAPI_URL}/api/works/${baseEntry.documentId}?populate=localizations`);
    
    // Exit with success if documents match, error if they don't
    const success = baseEntry.documentId === enEntry.documentId;
    console.log(`\n${success ? '🎉 SUCCESS: Both locales share the same documentId!' : '❌ FAILURE: Documents have different documentIds'}`);
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('💥 Seeding failed:', error.message);
    process.exit(1);
  }
}

// Execute seeding process if run directly
if (require.main === module) {
  // Get JSON file path from command line argument or use default
  const jsonFilePath = process.argv[2] || 'data/work-enterprise.json';
  seedWork(jsonFilePath);
}

module.exports = { seedWork, loadWorkData };
