/**
 * work controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::work.work', ({ strapi }) => ({
  // Extend the core controller with i18n methods
  ...factories.createCoreController('api::work.work'),

  async seedI18n(ctx: any) {
    try {
      console.log('🚀 Starting i18n seed process...');
      
      // Use the work service
      const results = await strapi.service('api::work.work').seedSampleData();
      
      const successful = results.filter((r: any) => r.success);
      const failed = results.filter((r: any) => !r.success);
      
      ctx.body = {
        success: true,
        message: 'i18n seeding completed',
        summary: {
          total: results.length,
          successful: successful.length,
          failed: failed.length
        },
        results: results
      };
      
    } catch (error: any) {
      console.error('❌ Seeding error:', error);
      ctx.body = {
        success: false,
        error: error.message
      };
      ctx.status = 500;
    }
  },
  
  async verifyI18n(ctx: any) {
    try {
      console.log('🔍 Verifying i18n structure...');
      
      const verification = await strapi.service('api::work.work').verifyI18nStructure();
      
      ctx.body = {
        success: true,
        ...verification
      };
      
    } catch (error: any) {
      console.error('❌ Verification error:', error);
      ctx.body = {
        success: false,
        error: error.message
      };
      ctx.status = 500;
    }
  },

  async createI18nWork(ctx: any) {
    try {
      const { translation_key, indonesian, english, tags } = ctx.request.body;
      
      if (!translation_key || !indonesian || !english) {
        ctx.body = {
          success: false,
          error: 'Missing required fields: translation_key, indonesian, english'
        };
        ctx.status = 400;
        return;
      }
      
      const result = await strapi.service('api::work.work').createWithProperI18n({
        translation_key,
        indonesian,
        english,
        tags: tags || []
      });
      
      if (result.success) {
        ctx.body = {
          success: true,
          message: `Work created with proper i18n: ${result.action}`,
          data: {
            documentId: result.documentId,
            indonesian: result.indonesian,
            english: result.english
          }
        };
      } else {
        ctx.body = {
          success: false,
          error: result.error
        };
        ctx.status = 500;
      }
      
    } catch (error: any) {
      console.error('❌ Create i18n work error:', error);
      ctx.body = {
        success: false,
        error: error.message
      };
      ctx.status = 500;
    }
  }
}));
