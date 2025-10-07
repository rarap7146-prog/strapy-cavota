export default ({ strapi }: { strapi: any }) => ({
  async exportPage(ctx: any) {
    try {
      const pages = await strapi.documents('api::page.page').findMany({
        locale: 'all',
        populate: '*'
      });

      const exportInterface = `<!DOCTYPE html>
<html><head><title>Content Export</title></head>
<body><h1>Content Export Tool</h1>
${pages.map((page: any) => `
<div style="margin: 20px; padding: 15px; border: 1px solid #ddd;">
<h3>${page.title || page.slug} (${page.locale})</h3>
<a href="/api/content-export/${page.slug}?locale=${page.locale}" style="background: #007cba; color: white; padding: 8px 15px; text-decoration: none; border-radius: 4px;">Export JSON</a>
</div>
`).join('')}
</body></html>`;

      ctx.type = 'text/html';
      ctx.body = exportInterface;
    } catch (err) {
      ctx.badRequest('Error', { error: err.message });
    }
  },

  async exportPageBySlug(ctx: any) {
    try {
      const { slug } = ctx.params;
      const { locale = 'id' } = ctx.query;

      const pages = await strapi.documents('api::page.page').findMany({
        filters: { slug: { $eq: slug } },
        locale: locale,
        populate: {
          sections: { populate: '*' },
          seo: { populate: '*' }
        }
      });

      if (!pages || pages.length === 0) {
        return ctx.notFound('Page not found');
      }

      const page = pages[0];
      
      const exportData = {
        page_info: {
          slug: page.slug,
          locale: page.locale,
          title: page.title,
          exported_at: new Date().toISOString()
        },
        seo: {
          meta_title: {
            current_value: page.seo?.metaTitle || '',
            max_length: 60
          },
          meta_description: {
            current_value: page.seo?.metaDescription || '',
            max_length: 160
          }
        },
        sections: {}
      };

      if (page.sections) {
        page.sections.forEach((section: any, index: number) => {
          const key = `section_${index + 1}_${section.__component.replace('sections.', '')}`;
          const fields: any = {
            component_type: section.__component
          };

          // Extract basic fields
          ['title', 'subtitle', 'content', 'buttonText', 'buttonLink', 'description'].forEach(field => {
            if (section[field] !== undefined && section[field] !== null) {
              fields[field] = { current_value: section[field] || '' };
            }
          });

          // Handle nested components
          switch (section.__component) {
            case 'sections.services-grid':
              if (section.items && Array.isArray(section.items)) {
                fields.services = section.items.map((item: any) => ({
                  title: { current_value: item.title || '' },
                  description: { current_value: item.description || '' },
                  icon: item.icon ? { current_value: item.icon.url || '' } : null
                }));
              }
              break;

            case 'sections.metrics-grid':
              if (section.metrics && Array.isArray(section.metrics)) {
                fields.metrics = section.metrics.map((metric: any) => ({
                  number: { current_value: metric.number || '' },
                  label: { current_value: metric.label || '' }
                }));
              }
              break;

            case 'sections.testimonial-carousel':
              if (section.testimonial && Array.isArray(section.testimonial)) {
                fields.testimonials = section.testimonial.map((testimonial: any) => ({
                  name: { current_value: testimonial.name || '' },
                  position: { current_value: testimonial.position || '' },
                  company: { current_value: testimonial.company || '' },
                  content: { current_value: testimonial.content || '' },
                  rating: { current_value: testimonial.rating || '' }
                }));
              }
              break;

            case 'sections.case-carousel':
              if (section.cases && Array.isArray(section.cases)) {
                fields.cases = section.cases.map((caseItem: any) => ({
                  title: { current_value: caseItem.title || '' },
                  description: { current_value: caseItem.description || '' },
                  company: { current_value: caseItem.company || '' },
                  industry: { current_value: caseItem.industry || '' },
                  result: { current_value: caseItem.result || '' }
                }));
              }
              break;

            case 'sections.playbook':
              if (section.steps && Array.isArray(section.steps)) {
                fields.steps = section.steps.map((step: any, i: number) => ({
                  title: { current_value: step.title || '' },
                  description: { current_value: step.description || '' },
                  number: { current_value: step.number || (i + 1).toString() }
                }));
              }
              break;
          }

          exportData.sections[key] = fields;
        });
      }

      ctx.body = exportData;
    } catch (err) {
      ctx.badRequest('Error exporting page', { error: err.message });
    }
  }
});
