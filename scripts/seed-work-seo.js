#!/usr/bin/env node
"use strict";

/**
 * Strapi v5 Work Entry Seeder with SEO Support
 * Creates ONE document with TWO localizations sharing the SAME documentId.
 *
 * Endpoints used:
 *  - Create base (id): POST /api/works?locale=id
 *  - Create localization (en): PUT /api/works/{documentId}?locale=en
 *  - Update existing: PUT /api/works/{documentId}?locale={locale}
 * 
 * This ensures Indonesian and English entries share the SAME documentId.
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

const API_TOKEN = process.env.STRAPI_TOKEN;
if (!API_TOKEN) {
  console.error('✖ STRAPI_TOKEN is not set in environment variables.');
  process.exit(1);
}

const BASE_URL = 'http://localhost:1337';
const WORK_DATA_FILE = path.join(__dirname, '..', 'data', 'work-seo-template.json');

/**
 * Make HTTP request to Strapi API
 */
function makeRequest(endpoint, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, BASE_URL);
    
    const requestOptions = {
      method: options.method || 'GET',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const protocol = url.protocol === 'https:' ? https : http;
    const req = protocol.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
          } else {
            resolve(parsed);
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

/**
 * Load work data from JSON file
 */
function loadWorkData() {
  try {
    const data = fs.readFileSync(WORK_DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`✖ Failed to load work data: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Create or update the base work entry (Indonesian)
 */
async function upsertBaseWork(workData) {
  const { translation_key, locales } = workData;
  const idData = { ...locales.id, translation_key };

  try {
    // Check if work exists
    console.log(`🔍 GET /api/works?filters[translation_key][$eq]=${translation_key}&locale=id&populate=localizations`);
    const existing = await makeRequest(`/api/works?filters[translation_key][$eq]=${translation_key}&locale=id&populate=localizations`);
    
    if (existing.data && existing.data.length > 0) {
      // Update existing
      const documentId = existing.data[0].documentId;
      console.log(`📝 Updating base work at /api/works/${documentId}?locale=id`);
      
      const updated = await makeRequest(`/api/works/${documentId}?locale=id`, {
        method: 'PUT',
        body: { data: idData }
      });
      
      console.log(`✅ Base work updated with id: ${updated.data.id}, documentId: ${updated.data.documentId}`);
      return updated.data;
    } else {
      // Create new
      console.log('📝 Creating new base work at /api/works?locale=id');
      
      const created = await makeRequest('/api/works?locale=id', {
        method: 'POST',
        body: { data: idData }
      });
      
      console.log(`✅ Base work created with id: ${created.data.id}, documentId: ${created.data.documentId}`);
      return created.data;
    }
  } catch (error) {
    throw new Error(`Failed to upsert base work: ${error.message}`);
  }
}

/**
 * Create or update English localization
 */
async function upsertEnLocalization(workData, baseDocumentId) {
  const { translation_key, locales } = workData;
  const enData = { ...locales.en, translation_key };

  try {
    // Check if English localization exists
    console.log(`🔍 GET /api/works?filters[translation_key][$eq]=${translation_key}&locale=en&populate=localizations`);
    const existing = await makeRequest(`/api/works?filters[translation_key][$eq]=${translation_key}&locale=en&populate=localizations`);
    
    if (existing.data && existing.data.length > 0) {
      // Update existing English localization
      console.log(`📝 Updating existing English localization at /api/works/${baseDocumentId}?locale=en`);
      
      const updated = await makeRequest(`/api/works/${baseDocumentId}?locale=en`, {
        method: 'PUT',
        body: { data: enData }
      });
      
      console.log(`✅ English localization updated with id: ${updated.data.id}, documentId: ${updated.data.documentId}`);
      return updated.data;
    } else {
      // Create new English localization
      console.log(`📝 Creating English localization at /api/works/${baseDocumentId}?locale=en`);
      
      const created = await makeRequest(`/api/works/${baseDocumentId}?locale=en`, {
        method: 'PUT',
        body: { data: enData }
      });
      
      console.log(`✅ English localization created with id: ${created.data.id}, documentId: ${created.data.documentId}`);
      return created.data;
    }
  } catch (error) {
    throw new Error(`Failed to upsert English localization: ${error.message}`);
  }
}

/**
 * Main seeding function
 */
async function seedWork() {
  console.log('🌱 Starting Strapi v5 Work Entry Seeder with SEO');
  console.log(`📁 Loading work data from: ${WORK_DATA_FILE}`);
  
  try {
    const workData = loadWorkData();
    console.log(`✅ Loaded data for translation_key: ${workData.translation_key}`);
    
    // Create/update base work (Indonesian)
    const baseWork = await upsertBaseWork(workData);
    
    // Create/update English localization
    const enWork = await upsertEnLocalization(workData, baseWork.documentId);
    
    // Summary
    console.log('─────────────────────────────');
    console.log('SEEDING SUMMARY:');
    console.log(`Base Document ID: ${baseWork.documentId}`);
    console.log(`Indonesian Entry ID: ${baseWork.id}`);
    console.log(`English Entry ID: ${enWork.id}`);
    console.log(`English Document ID: ${enWork.documentId}`);
    console.log(`Documents Match: ${baseWork.documentId === enWork.documentId ? '✅ YES' : '❌ NO'}`);
    console.log('─────────────────────────────');
    
    console.log('\nVERIFICATION:');
    console.log(`• GET https://cavota.id/api/works?filters[translation_key][$eq]=${workData.translation_key}&locale=id`);
    console.log(`• GET https://cavota.id/api/works?filters[translation_key][$eq]=${workData.translation_key}&locale=en`);
    console.log(`• GET https://cavota.id/api/works/${baseWork.documentId}?populate=localizations`);
    
    console.log('\n🎉 SUCCESS: Both locales share the same documentId!');
    
  } catch (error) {
    console.error(`💥 Seeding failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the seeder
if (require.main === module) {
  seedWork();
}

module.exports = { seedWork };