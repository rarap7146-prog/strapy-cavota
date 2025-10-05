#!/usr/bin/env node
"use strict";

/**
 * Strapi v5 Insight Entry Seeder with SEO Support
 * Creates ONE document with TWO localizations sharing the SAME documentId.
 *
 * Endpoints used:
 *  - Create base (id): POST /api/insights?locale=id
 *  - Create localization (en): PUT /api/insights/{documentId}?locale=en
 *  - Update existing: PUT /api/insights/{documentId}?locale={locale}
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
const INSIGHT_DATA_FILE = path.join(__dirname, '..', 'data', 'insight-seo-template.json');

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
 * Load insight data from JSON file
 */
function loadInsightData() {
  try {
    const data = fs.readFileSync(INSIGHT_DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`✖ Failed to load insight data: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Create or update the base insight entry (Indonesian)
 */
async function upsertBaseInsight(insightData) {
  const { translation_key, locales } = insightData;
  const idData = { ...locales.id, translation_key };

  try {
    // Check if insight exists
    console.log(`🔍 GET /api/insights?filters[translation_key][$eq]=${translation_key}&locale=id&populate=localizations`);
    const existing = await makeRequest(`/api/insights?filters[translation_key][$eq]=${translation_key}&locale=id&populate=localizations`);
    
    if (existing.data && existing.data.length > 0) {
      // Update existing
      const documentId = existing.data[0].documentId;
      console.log(`📝 Updating base insight at /api/insights/${documentId}?locale=id`);
      
      const updated = await makeRequest(`/api/insights/${documentId}?locale=id`, {
        method: 'PUT',
        body: { data: idData }
      });
      
      console.log(`✅ Base insight updated with id: ${updated.data.id}, documentId: ${updated.data.documentId}`);
      return updated.data;
    } else {
      // Create new
      console.log('📝 Creating new base insight at /api/insights?locale=id');
      
      const created = await makeRequest('/api/insights?locale=id', {
        method: 'POST',
        body: { data: idData }
      });
      
      console.log(`✅ Base insight created with id: ${created.data.id}, documentId: ${created.data.documentId}`);
      return created.data;
    }
  } catch (error) {
    throw new Error(`Failed to upsert base insight: ${error.message}`);
  }
}

/**
 * Create or update English localization
 */
async function upsertEnLocalization(insightData, baseDocumentId) {
  const { translation_key, locales } = insightData;
  const enData = { ...locales.en, translation_key };

  try {
    // Check if English localization exists
    console.log(`🔍 GET /api/insights?filters[translation_key][$eq]=${translation_key}&locale=en&populate=localizations`);
    const existing = await makeRequest(`/api/insights?filters[translation_key][$eq]=${translation_key}&locale=en&populate=localizations`);
    
    if (existing.data && existing.data.length > 0) {
      // Update existing English localization
      console.log(`📝 Updating existing English localization at /api/insights/${baseDocumentId}?locale=en`);
      
      const updated = await makeRequest(`/api/insights/${baseDocumentId}?locale=en`, {
        method: 'PUT',
        body: { data: enData }
      });
      
      console.log(`✅ English localization updated with id: ${updated.data.id}, documentId: ${updated.data.documentId}`);
      return updated.data;
    } else {
      // Create new English localization
      console.log(`📝 Creating English localization at /api/insights/${baseDocumentId}?locale=en`);
      
      const created = await makeRequest(`/api/insights/${baseDocumentId}?locale=en`, {
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
async function seedInsight() {
  console.log('🌱 Starting Strapi v5 Insight Entry Seeder with SEO');
  console.log(`📁 Loading insight data from: ${INSIGHT_DATA_FILE}`);
  
  try {
    const insightData = loadInsightData();
    console.log(`✅ Loaded data for translation_key: ${insightData.translation_key}`);
    
    // Create/update base insight (Indonesian)
    const baseInsight = await upsertBaseInsight(insightData);
    
    // Create/update English localization
    const enInsight = await upsertEnLocalization(insightData, baseInsight.documentId);
    
    // Summary
    console.log('─────────────────────────────');
    console.log('SEEDING SUMMARY:');
    console.log(`Base Document ID: ${baseInsight.documentId}`);
    console.log(`Indonesian Entry ID: ${baseInsight.id}`);
    console.log(`English Entry ID: ${enInsight.id}`);
    console.log(`English Document ID: ${enInsight.documentId}`);
    console.log(`Documents Match: ${baseInsight.documentId === enInsight.documentId ? '✅ YES' : '❌ NO'}`);
    console.log('─────────────────────────────');
    
    console.log('\nVERIFICATION:');
    console.log(`• GET https://cavota.id/api/insights?filters[translation_key][$eq]=${insightData.translation_key}&locale=id`);
    console.log(`• GET https://cavota.id/api/insights?filters[translation_key][$eq]=${insightData.translation_key}&locale=en`);
    console.log(`• GET https://cavota.id/api/insights/${baseInsight.documentId}?populate=localizations`);
    
    console.log('\n🎉 SUCCESS: Both locales share the same documentId!');
    
  } catch (error) {
    console.error(`💥 Seeding failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the seeder
if (require.main === module) {
  seedInsight();
}

module.exports = { seedInsight };