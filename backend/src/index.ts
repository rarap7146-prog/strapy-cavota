import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Set up permissions for rfp-submission - restrict public access
    try {
      // Disable all public permissions for rfp-submission
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'public' }
      });

      if (publicRole) {
        // Remove all permissions for rfp-submission from public role
        await strapi.query('plugin::users-permissions.permission').deleteMany({
          where: {
            role: publicRole.id,
            action: {
              $in: ['api::rfp-submission.rfp-submission.find', 'api::rfp-submission.rfp-submission.findOne', 'api::rfp-submission.rfp-submission.create', 'api::rfp-submission.rfp-submission.update', 'api::rfp-submission.rfp-submission.delete']
            }
          }
        });
      }

      // Ensure authenticated users also can't access rfp-submission
      const authenticatedRole = await strapi.query('plugin::users-permissions.role').findOne({
        where: { type: 'authenticated' }
      });

      if (authenticatedRole) {
        // Remove all permissions for rfp-submission from authenticated role
        await strapi.query('plugin::users-permissions.permission').deleteMany({
          where: {
            role: authenticatedRole.id,
            action: {
              $in: ['api::rfp-submission.rfp-submission.find', 'api::rfp-submission.rfp-submission.findOne', 'api::rfp-submission.rfp-submission.create', 'api::rfp-submission.rfp-submission.update', 'api::rfp-submission.rfp-submission.delete']
            }
          }
        });
      }

      strapi.log.info('RFP Submission permissions configured - access restricted to API tokens only');
    } catch (error) {
      strapi.log.error('Error configuring RFP Submission permissions:', error);
    }
  },
};
