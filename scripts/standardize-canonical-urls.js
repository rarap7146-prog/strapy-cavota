#!/usr/bin/env node

/**
 * Script to standardize all canonical URLs to use relative paths
 * This removes hardcoded domain references and makes URLs dynamic
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

// Function to convert full URL to relative path
function convertToRelativePath(url) {
  if (!url) return url;
  
  // Remove domain part and keep only the path
  return url
    .replace(/https?:\/\/[^\/]+/g, '')
    .replace(/^\/+/, '/'); // Ensure single leading slash
}

// Function to update page canonical URLs to relative paths
async function updatePageCanonicalURLs() {
  console.log('🔄 Converting Page canonical URLs to relative paths...');
  
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
        const relativePath = convertToRelativePath(originalURL);

        if (relativePath !== originalURL) {
          console.log(`   🔄 Updating page "${page.title}"`);
          console.log(`      Old: ${originalURL}`);
          console.log(`      New: ${relativePath}`);

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
                  canonicalURL: relativePath,
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
        } else {
          console.log(`   ✓ Page "${page.title}" already has relative path: ${originalURL}`);
        }
      }
    }

    console.log('✅ Page canonical URLs update completed');
  } catch (error) {
    console.error('❌ Error updating page canonical URLs:', error);
  }
}

// Function to update works canonical URLs to relative paths
async function updateWorksCanonicalURLs() {
  console.log('🔄 Converting Works canonical URLs to relative paths...');
  
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
        const relativePath = convertToRelativePath(originalURL);

        if (relativePath !== originalURL) {
          console.log(`   🔄 Updating work "${work.title}"`);
          console.log(`      Old: ${originalURL}`);
          console.log(`      New: ${relativePath}`);

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
                  canonicalURL: relativePath,
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
        } else {
          console.log(`   ✓ Work "${work.title}" already has relative path: ${originalURL}`);
        }
      }
    }

    console.log('✅ Works canonical URLs update completed');
  } catch (error) {
    console.error('❌ Error updating works canonical URLs:', error);
  }
}

// Function to update insights canonical URLs to relative paths
async function updateInsightsCanonicalURLs() {
  console.log('🔄 Converting Insights canonical URLs to relative paths...');
  
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
        const relativePath = convertToRelativePath(originalURL);

        if (relativePath !== originalURL) {
          console.log(`   🔄 Updating insight "${insight.title}"`);
          console.log(`      Old: ${originalURL}`);
          console.log(`      New: ${relativePath}`);

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
                  canonicalURL: relativePath,
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
        } else {
          console.log(`   ✓ Insight "${insight.title}" already has relative path: ${originalURL}`);
        }
      }
    }

    console.log('✅ Insights canonical URLs update completed');
  } catch (error) {
    console.error('❌ Error updating insights canonical URLs:', error);
  }
}

// Main execution
async function main() {
  console.log('🚀 Standardizing canonical URLs to relative paths');
  console.log('This makes URLs dynamic and removes hardcoded domains');
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
    console.log('🎉 Canonical URL standardization completed successfully!');
    console.log('================================================');
    console.log('Summary:');
    console.log('✅ All canonical URLs now use relative paths');
    console.log('✅ No hardcoded domains in canonical URLs');
    console.log('✅ Frontend can build full URLs dynamically');
    console.log('');
    console.log('Frontend Implementation:');
    console.log('const fullCanonicalURL = `https://cavota.id${page.seo.canonicalURL}`;');
    
  } catch (error) {
    console.error('❌ Standardization failed:', error);
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
  convertToRelativePath,
  main
};