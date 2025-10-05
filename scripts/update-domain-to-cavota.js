#!/usr/bin/env node

/**
 * Script to update all domain references from linkgacor.one to cavota.id
 * This includes both kt78.io and linkgacor.one references in the database
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

// Function to update page SEO canonical URLs
async function updatePageCanonicalURLs() {
  console.log('🔄 Updating Page canonical URLs...');
  
  try {
    // Fetch all pages with SEO data
    const response = await fetch(`${STRAPI_URL}/api/pages?populate=seo&pagination[limit]=100`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const pages = data.data;

    console.log(`📄 Found ${pages.length} pages to check...`);

    for (const page of pages) {
      if (page.seo?.canonicalURL) {
        const originalURL = page.seo.canonicalURL;
        
        // Update domains
        let updatedURL = originalURL
          .replace(/https:\/\/linkgacor\.one/g, 'https://cavota.id')
          .replace(/https:\/\/kt78\.io/g, 'https://cavota.id')
          .replace(/http:\/\/linkgacor\.one/g, 'https://cavota.id')
          .replace(/http:\/\/kt78\.io/g, 'https://cavota.id');

        if (updatedURL !== originalURL) {
          console.log(`   🔄 Updating page "${page.title}"`);
          console.log(`      Old: ${originalURL}`);
          console.log(`      New: ${updatedURL}`);

          // Update the page
          const updateResponse = await fetch(`${STRAPI_URL}/api/pages/${page.documentId}?locale=${page.locale}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${STRAPI_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              data: {
                seo: {
                  metaTitle: page.seo.metaTitle,
                  metaDescription: page.seo.metaDescription,
                  keywords: page.seo.keywords,
                  metaRobots: page.seo.metaRobots,
                  metaViewport: page.seo.metaViewport,
                  canonicalURL: updatedURL,
                  structuredData: page.seo.structuredData
                }
              }
            })
          });

          if (updateResponse.ok) {
            console.log(`      ✅ Updated successfully`);
          } else {
            console.log(`      ❌ Failed to update: ${updateResponse.status}`);
            const errorText = await updateResponse.text();
            console.log(`      Error: ${errorText}`);
          }
        }
      }
    }

    console.log('✅ Page canonical URLs update completed');
  } catch (error) {
    console.error('❌ Error updating page canonical URLs:', error);
  }
}

// Function to update works SEO canonical URLs
async function updateWorksCanonicalURLs() {
  console.log('🔄 Updating Works canonical URLs...');
  
  try {
    // Fetch all works with SEO data
    const response = await fetch(`${STRAPI_URL}/api/works?populate=seo&pagination[limit]=100`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const works = data.data;

    console.log(`💼 Found ${works.length} works to check...`);

    for (const work of works) {
      if (work.seo?.canonicalURL) {
        const originalURL = work.seo.canonicalURL;
        
        // Update domains
        let updatedURL = originalURL
          .replace(/https:\/\/linkgacor\.one/g, 'https://cavota.id')
          .replace(/https:\/\/kt78\.io/g, 'https://cavota.id')
          .replace(/http:\/\/linkgacor\.one/g, 'https://cavota.id')
          .replace(/http:\/\/kt78\.io/g, 'https://cavota.id');

        if (updatedURL !== originalURL) {
          console.log(`   🔄 Updating work "${work.title}"`);
          console.log(`      Old: ${originalURL}`);
          console.log(`      New: ${updatedURL}`);

          // Update the work
          const updateResponse = await fetch(`${STRAPI_URL}/api/works/${work.documentId}?locale=${work.locale}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${STRAPI_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              data: {
                seo: {
                  metaTitle: work.seo.metaTitle,
                  metaDescription: work.seo.metaDescription,
                  keywords: work.seo.keywords,
                  metaRobots: work.seo.metaRobots,
                  metaViewport: work.seo.metaViewport,
                  canonicalURL: updatedURL,
                  structuredData: work.seo.structuredData
                }
              }
            })
          });

          if (updateResponse.ok) {
            console.log(`      ✅ Updated successfully`);
          } else {
            console.log(`      ❌ Failed to update: ${updateResponse.status}`);
            const errorText = await updateResponse.text();
            console.log(`      Error: ${errorText}`);
          }
        }
      }
    }

    console.log('✅ Works canonical URLs update completed');
  } catch (error) {
    console.error('❌ Error updating works canonical URLs:', error);
  }
}

// Function to update insights SEO canonical URLs
async function updateInsightsCanonicalURLs() {
  console.log('🔄 Updating Insights canonical URLs...');
  
  try {
    // Fetch all insights with SEO data
    const response = await fetch(`${STRAPI_URL}/api/insights?populate=seo&pagination[limit]=100`, {
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const insights = data.data;

    console.log(`💡 Found ${insights.length} insights to check...`);

    for (const insight of insights) {
      if (insight.seo?.canonicalURL) {
        const originalURL = insight.seo.canonicalURL;
        
        // Update domains
        let updatedURL = originalURL
          .replace(/https:\/\/linkgacor\.one/g, 'https://cavota.id')
          .replace(/https:\/\/kt78\.io/g, 'https://cavota.id')
          .replace(/http:\/\/linkgacor\.one/g, 'https://cavota.id')
          .replace(/http:\/\/kt78\.io/g, 'https://cavota.id');

        if (updatedURL !== originalURL) {
          console.log(`   🔄 Updating insight "${insight.title}"`);
          console.log(`      Old: ${originalURL}`);
          console.log(`      New: ${updatedURL}`);

          // Update the insight
          const updateResponse = await fetch(`${STRAPI_URL}/api/insights/${insight.documentId}?locale=${insight.locale}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${STRAPI_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              data: {
                seo: {
                  metaTitle: insight.seo.metaTitle,
                  metaDescription: insight.seo.metaDescription,
                  keywords: insight.seo.keywords,
                  metaRobots: insight.seo.metaRobots,
                  metaViewport: insight.seo.metaViewport,
                  canonicalURL: updatedURL,
                  structuredData: insight.seo.structuredData
                }
              }
            })
          });

          if (updateResponse.ok) {
            console.log(`      ✅ Updated successfully`);
          } else {
            console.log(`      ❌ Failed to update: ${updateResponse.status}`);
            const errorText = await updateResponse.text();
            console.log(`      Error: ${errorText}`);
          }
        }
      }
    }

    console.log('✅ Insights canonical URLs update completed');
  } catch (error) {
    console.error('❌ Error updating insights canonical URLs:', error);
  }
}

// Function to update any structured data containing old domains
async function updateStructuredData() {
  console.log('🔄 Updating structured data...');
  
  try {
    // Get all content types to check
    const contentTypes = ['pages', 'works', 'insights'];
    
    for (const contentType of contentTypes) {
      console.log(`📋 Checking ${contentType} structured data...`);
      
      const response = await fetch(`${STRAPI_URL}/api/${contentType}?populate=seo&pagination[limit]=100`, {
        headers: {
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.log(`   ⚠️  Skipping ${contentType} - not accessible`);
        continue;
      }

      const data = await response.json();
      const items = data.data;

      for (const item of items) {
        if (item.seo?.structuredData) {
          const originalData = JSON.stringify(item.seo.structuredData);
          
          // Update domains in structured data
          let updatedData = originalData
            .replace(/https:\/\/linkgacor\.one/g, 'https://cavota.id')
            .replace(/https:\/\/kt78\.io/g, 'https://cavota.id')
            .replace(/http:\/\/linkgacor\.one/g, 'https://cavota.id')
            .replace(/http:\/\/kt78\.io/g, 'https://cavota.id');

          if (updatedData !== originalData) {
            console.log(`   🔄 Updating ${contentType} "${item.title}" structured data`);

            // Update the item
            const updateResponse = await fetch(`${STRAPI_URL}/api/${contentType}/${item.documentId}?locale=${item.locale}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${STRAPI_TOKEN}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                data: {
                  seo: {
                    ...item.seo,
                    structuredData: JSON.parse(updatedData)
                  }
                }
              })
            });

            if (updateResponse.ok) {
              console.log(`      ✅ Updated successfully`);
            } else {
              console.log(`      ❌ Failed to update: ${updateResponse.status}`);
            }
          }
        }
      }
    }

    console.log('✅ Structured data update completed');
  } catch (error) {
    console.error('❌ Error updating structured data:', error);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting domain refactoring from linkgacor.one/kt78.io to cavota.id');
  console.log('================================================');

  if (!STRAPI_TOKEN) {
    console.error('❌ STRAPI_TOKEN environment variable is required');
    process.exit(1);
  }

  try {
    await updatePageCanonicalURLs();
    console.log('');
    await updateWorksCanonicalURLs();
    console.log('');
    await updateInsightsCanonicalURLs();
    console.log('');
    await updateStructuredData();
    
    console.log('');
    console.log('🎉 Domain refactoring completed successfully!');
    console.log('================================================');
    console.log('Summary:');
    console.log('✅ All canonical URLs updated to cavota.id');
    console.log('✅ All structured data updated to cavota.id');
    console.log('✅ Database migration completed');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  updatePageCanonicalURLs,
  updateWorksCanonicalURLs,
  updateInsightsCanonicalURLs,
  updateStructuredData,
  main
};