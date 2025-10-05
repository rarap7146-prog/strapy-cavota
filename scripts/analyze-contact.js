#!/usr/bin/env node
"use strict";

/**
 * Analyze the Contact page structure
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

const API_TOKEN = '8953c0183eaee87ccf284e7db9404875bb41a685b54a89c7381cbd59f91790234db270dfa03b589bb2a6232d8ea8fced86412a491cda820f43cc213669d2bc3703055c4d122886dc02729be9d914fce7eb01b3acaf3b3d386da5165cd4995816bc68388cc2eff9fc38fe18eda87b9b8330e27e2520cd3e5ded0702267ef8899a';
const BASE_URL = 'http://localhost:1337';
const CONTACT_DOCUMENT_ID = 'dpur1aj283dfyhxl6zjj8vpv';

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

async function analyzeContactPage() {
  console.log('🔍 Analyzing Contact Page...\n');
  
  try {
    // Get Indonesian version with full population
    const idResponse = await makeRequest(`/api/pages/${CONTACT_DOCUMENT_ID}?locale=id&populate=*`);
    const enResponse = await makeRequest(`/api/pages/${CONTACT_DOCUMENT_ID}?locale=en&populate=*`);
    
    if (idResponse.data) {
      console.log('🇮🇩 INDONESIAN VERSION:');
      console.log(`   Title: ${idResponse.data.title}`);
      console.log(`   Slug: ${idResponse.data.slug}`);
      console.log(`   Type: ${idResponse.data.page_type}`);
      
      if (idResponse.data.seo) {
        console.log(`   SEO Title: ${idResponse.data.seo.metaTitle}`);
      }
      
      if (idResponse.data.sections) {
        console.log(`   Sections (${idResponse.data.sections.length}):`);
        idResponse.data.sections.forEach((section, i) => {
          console.log(`     ${i + 1}. ${section.__component}`);
          if (section.__component === 'sections.hero' && section.buttons) {
            console.log(`        Hero button: "${section.buttons[0]?.label}" → ${section.buttons[0]?.url}`);
          }
          if (section.__component === 'sections.cta-strip' && section.button) {
            console.log(`        CTA button: "${section.button.label}" → ${section.button.url}`);
          }
        });
      }
    }
    
    if (enResponse.data) {
      console.log('\n🇺🇸 ENGLISH VERSION:');
      console.log(`   Title: ${enResponse.data.title}`);
      console.log(`   Slug: ${enResponse.data.slug}`);
      console.log(`   Type: ${enResponse.data.page_type}`);
      
      if (enResponse.data.seo) {
        console.log(`   SEO Title: ${enResponse.data.seo.metaTitle}`);
      }
      
      if (enResponse.data.sections) {
        console.log(`   Sections (${enResponse.data.sections.length}):`);
        enResponse.data.sections.forEach((section, i) => {
          console.log(`     ${i + 1}. ${section.__component}`);
          if (section.__component === 'sections.hero' && section.buttons) {
            console.log(`        Hero button: "${section.buttons[0]?.label}" → ${section.buttons[0]?.url}`);
          }
          if (section.__component === 'sections.cta-strip' && section.button) {
            console.log(`        CTA button: "${section.button.label}" → ${section.button.url}`);
          }
        });
      }
    }
    
    console.log('\n📋 CONTACT PAGE ARCHITECTURE:');
    console.log('   ✅ Hero with CTA to RFP');
    console.log('   ✅ Contact Info (ready for dynamic Site Settings)');
    console.log('   ✅ Form Labels (ready for Global Strings)');
    console.log('   ✅ CTA Strip to meeting scheduler');
    
    console.log('\n🔗 DYNAMIC CONTENT INTEGRATION:');
    console.log('   📞 Contact info should be pulled from: /api/site-settings');
    console.log('   🌐 Form labels should be pulled from: /api/global-strings');
    console.log('   🎯 Frontend can map these dynamically by locale');
    
    console.log('\n✅ Contact page analysis complete!');
    
  } catch (error) {
    console.error(`💥 Error: ${error.message}`);
  }
}

analyzeContactPage();