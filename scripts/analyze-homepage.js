#!/usr/bin/env node
"use strict";

/**
 * Fetch and analyze homepage structure from Strapi dashboard
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');

const API_TOKEN = process.env.STRAPI_TOKEN || '8953c0183eaee87ccf284e7db9404875bb41a685b54a89c7381cbd59f91790234db270dfa03b589bb2a6232d8ea8fced86412a491cda820f43cc213669d2bc3703055c4d122886dc02729be9d914fce7eb01b3acaf3b3d386da5165cd4995816bc68388cc2eff9fc38fe18eda87b9b8330e27e2520cd3e5ded0702267ef8899a';
const BASE_URL = 'http://localhost:1337';
const DOCUMENT_ID = 'r5x9txjztewfrjsdg5lkplct';

function makeRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, BASE_URL);
    
    const requestOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
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
    req.end();
  });
}

async function fetchHomepageData() {
  console.log('🔍 Fetching Indonesian homepage data from dashboard...');
  
  try {
    // Try different populate strategies
    const endpoints = [
      `/api/pages/${DOCUMENT_ID}?locale=id`,
      `/api/pages/${DOCUMENT_ID}?locale=id&populate=*`,
      `/api/pages/${DOCUMENT_ID}?locale=id&populate=sections`,
      `/api/pages/${DOCUMENT_ID}?locale=id&populate=seo`
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`📡 Trying: ${endpoint}`);
        const response = await makeRequest(endpoint);
        
        if (response.data) {
          const filename = endpoint.includes('populate=*') ? 'homepage-id-full.json' :
                          endpoint.includes('populate=sections') ? 'homepage-id-sections.json' :
                          endpoint.includes('populate=seo') ? 'homepage-id-seo.json' :
                          'homepage-id-basic.json';
          
          fs.writeFileSync(filename, JSON.stringify(response.data, null, 2));
          console.log(`✅ Saved to ${filename}`);
          
          // Show summary of what we found
          if (response.data.sections) {
            console.log(`📋 Found ${response.data.sections.length} sections:`);
            response.data.sections.forEach((section, i) => {
              console.log(`   ${i + 1}. ${section.__component || 'Unknown component'}`);
            });
          }
          
          if (response.data.seo) {
            console.log(`🔍 SEO data found: ${response.data.seo.metaTitle}`);
          }
        }
        
      } catch (error) {
        console.log(`❌ Failed: ${error.message}`);
      }
    }
    
    // Also fetch English version for comparison
    console.log('\n🔍 Fetching English version...');
    try {
      const enResponse = await makeRequest(`/api/pages/${DOCUMENT_ID}?locale=en`);
      if (enResponse.data) {
        fs.writeFileSync('homepage-en-basic.json', JSON.stringify(enResponse.data, null, 2));
        console.log('✅ Saved English version to homepage-en-basic.json');
      }
    } catch (error) {
      console.log(`❌ Failed to fetch English: ${error.message}`);
    }
    
  } catch (error) {
    console.error(`💥 Error: ${error.message}`);
    process.exit(1);
  }
}

fetchHomepageData();