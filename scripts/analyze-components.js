#!/usr/bin/env node
"use strict";

/**
 * Analyze component structures from dashboard homepage data
 */

const fs = require('fs');

function analyzeHomepageStructure() {
  console.log('🔍 Analyzing Homepage Structure from Dashboard Data\n');
  
  try {
    const homepageData = JSON.parse(fs.readFileSync('homepage-id-full.json', 'utf8'));
    
    console.log('📋 PAGE METADATA:');
    console.log(`   Title: ${homepageData.title}`);
    console.log(`   Slug: ${homepageData.slug}`);
    console.log(`   Type: ${homepageData.page_type}`);
    console.log(`   Updated: ${homepageData.updatedAt}\n`);
    
    console.log('🔍 SEO STRUCTURE:');
    if (homepageData.seo) {
      Object.keys(homepageData.seo).forEach(key => {
        if (key !== 'id') {
          const value = homepageData.seo[key];
          if (typeof value === 'object') {
            console.log(`   ${key}: ${JSON.stringify(value, null, 4).replace(/\n/g, '\n       ')}`);
          } else {
            console.log(`   ${key}: ${value}`);
          }
        }
      });
    }
    
    console.log('\n📦 COMPONENT ANALYSIS:');
    console.log(`   Total Sections: ${homepageData.sections.length}\n`);
    
    // Group components by type
    const componentCounts = {};
    const componentStructures = {};
    
    homepageData.sections.forEach((section, index) => {
      const componentType = section.__component;
      
      // Count occurrences
      componentCounts[componentType] = (componentCounts[componentType] || 0) + 1;
      
      // Store structure example
      if (!componentStructures[componentType]) {
        const structureExample = { ...section };
        delete structureExample.id; // Remove internal ID
        componentStructures[componentType] = structureExample;
      }
      
      console.log(`   ${index + 1}. ${componentType}`);
      Object.keys(section).forEach(key => {
        if (key !== '__component' && key !== 'id') {
          const value = section[key];
          console.log(`      ${key}: ${typeof value === 'string' ? value.substring(0, 80) + (value.length > 80 ? '...' : '') : value}`);
        }
      });
      console.log('');
    });
    
    console.log('📊 COMPONENT SUMMARY:');
    Object.entries(componentCounts).forEach(([component, count]) => {
      console.log(`   ${component}: ${count} instances`);
    });
    
    console.log('\n📝 COMPONENT FIELD STRUCTURES:');
    Object.entries(componentStructures).forEach(([component, structure]) => {
      console.log(`\n   ${component.toUpperCase()}:`);
      console.log(`   ${JSON.stringify(structure, null, 4).replace(/\n/g, '\n   ')}`);
    });
    
    // Create a comprehensive template based on learned structure
    console.log('\n💾 Creating comprehensive template...');
    fs.writeFileSync('component-structures.json', JSON.stringify(componentStructures, null, 2));
    console.log('✅ Saved component structures to component-structures.json');
    
  } catch (error) {
    console.error(`💥 Error: ${error.message}`);
  }
}

analyzeHomepageStructure();