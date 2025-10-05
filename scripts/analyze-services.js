#!/usr/bin/env node

/**
 * CAVOTA Services Page Structure Analyzer
 * Analyzes the Services page to verify content structure and component fields
 */

const dotenv = require('dotenv');
const axios = require('axios');
const https = require('https');

dotenv.config();

const STRAPI_TOKEN = process.env.STRAPI_TOKEN;
const STRAPI_URL = process.env.STRAPI_URL || 'https://cavota.id';

if (!STRAPI_TOKEN) {
  console.error('❌ STRAPI_TOKEN environment variable is required');
  process.exit(1);
}

async function makeRequest(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json',
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    });

    return response.data;
  } catch (error) {
    console.error(`❌ Request failed: ${error.message}`);
    return null;
  }
}

function analyzeComponent(component, depth = 0) {
  const indent = '  '.repeat(depth);
  const type = component.__component;
  
  console.log(`${indent}📦 ${type}`);
  
  // Analyze based on component type
  switch (type) {
    case 'sections.hero':
      console.log(`${indent}   • Title: "${component.title?.substring(0, 50)}..."`);
      console.log(`${indent}   • Subtitle: "${component.subtitle?.substring(0, 40)}..."`);
      console.log(`${indent}   • Buttons: ${component.buttons?.length || 0} buttons`);
      if (component.buttons?.length > 0) {
        component.buttons.forEach((btn, i) => {
          console.log(`${indent}     ${i + 1}. "${btn.label}" → ${btn.url}`);
        });
      }
      break;
      
    case 'sections.services-grid':
      console.log(`${indent}   • Title: "${component.title}"`);
      console.log(`${indent}   • Items: ${component.items?.length || 0} services`);
      if (component.items?.length > 0) {
        component.items.forEach((item, i) => {
          const subtitle = item.subtitle ? ` (${item.subtitle})` : '';
          const url = item.url ? ` → ${item.url}` : '';
          console.log(`${indent}     ${i + 1}. ${item.title}${subtitle}${url}`);
        });
      }
      break;
      
    case 'sections.playbook':
      console.log(`${indent}   • Title: "${component.title}"`);
      console.log(`${indent}   • Steps: ${component.steps?.length || 0} steps`);
      if (component.steps?.length > 0) {
        component.steps.forEach((step, i) => {
          console.log(`${indent}     ${i + 1}. ${step.title}`);
        });
      }
      break;
      
    case 'sections.proof-bar':
      console.log(`${indent}   • Note: "${component.note}"`);
      console.log(`${indent}   • Logos: ${component.logos?.length || 0} logos`);
      break;
      
    case 'sections.cta-strip':
      console.log(`${indent}   • Title: "${component.title}"`);
      console.log(`${indent}   • Button: "${component.button?.label}" → ${component.button?.url}`);
      break;
      
    default:
      console.log(`${indent}   • Unknown component type`);
  }
}

function analyzePage(pageData, locale) {
  const page = pageData.data[0];
  if (!page) {
    console.log(`❌ No page found for locale: ${locale}`);
    return;
  }

  console.log(`\n🎯 SERVICES PAGE ANALYSIS (${locale.toUpperCase()})`);
  console.log(`═══════════════════════════════════════`);
  console.log(`📄 Page: ${page.title}`);
  console.log(`🔗 Slug: /${page.slug}`);
  console.log(`🆔 ID: ${page.id} | Document ID: ${page.documentId}`);
  console.log(`📑 Type: ${page.page_type}`);
  
  // SEO Analysis
  if (page.seo) {
    console.log(`\n🔍 SEO CONFIGURATION:`);
    console.log(`   • Meta Title: "${page.seo.metaTitle}" (${page.seo.metaTitle?.length || 0}/60 chars)`);
    console.log(`   • Meta Description: "${page.seo.metaDescription?.substring(0, 80)}..." (${page.seo.metaDescription?.length || 0} chars)`);
    console.log(`   • Keywords: ${page.seo.keywords?.length || 0} keywords`);
    console.log(`   • Robots: ${page.seo.metaRobots}`);
    console.log(`   • Canonical: ${page.seo.canonicalURL}`);
  }

  // Sections Analysis
  console.log(`\n📋 CONTENT SECTIONS (${page.sections?.length || 0} sections):`);
  if (page.sections?.length > 0) {
    page.sections.forEach((section, index) => {
      console.log(`\n${index + 1}. ──────────────────────────`);
      analyzeComponent(section, 1);
    });
  }

  // Localizations
  if (page.localizations?.length > 0) {
    console.log(`\n🌐 LOCALIZATIONS:`);
    page.localizations.forEach(loc => {
      console.log(`   • ${loc.locale}: ${loc.title}`);
    });
  }
}

async function main() {
  console.log('🔍 CAVOTA Services Page Structure Analyzer');
  console.log('============================================');

  // Analyze Indonesian version
  const idUrl = `${STRAPI_URL}/api/pages?filters[translation_key][$eq]=page-services&locale=id&populate=*`;
  console.log(`\n📡 Fetching Indonesian page...`);
  const idData = await makeRequest(idUrl);
  
  if (idData) {
    analyzePage(idData, 'id');
  }

  // Analyze English version  
  const enUrl = `${STRAPI_URL}/api/pages?filters[translation_key][$eq]=page-services&locale=en&populate=*`;
  console.log(`\n📡 Fetching English page...`);
  const enData = await makeRequest(enUrl);
  
  if (enData) {
    analyzePage(enData, 'en');
  }

  console.log(`\n✨ Analysis complete!`);
  console.log(`\n🔗 Dashboard URLs:`);
  console.log(`   • ID: https://cavota.id/admin/content-manager/collection-types/api::page.page/${idData?.data?.[0]?.documentId}?locale=id`);
  console.log(`   • EN: https://cavota.id/admin/content-manager/collection-types/api::page.page/${enData?.data?.[0]?.documentId}?locale=en`);
}

main().catch(console.error);