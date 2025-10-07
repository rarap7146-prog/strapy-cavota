// Strapi v5
export default () => ({
  seo: { enabled: true },
  // i18n is already enabled via Settings; no need to touch it here
  'populate-deep': {
    config: {
      defaultDepth: 5, // Default is 5 levels deep
    },
  },
});
