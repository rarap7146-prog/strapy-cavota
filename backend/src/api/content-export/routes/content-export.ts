export default {
  routes: [
    {
      method: 'GET',
      path: '/content-export',
      handler: 'content-export.exportPage',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/content-export/:slug',
      handler: 'content-export.exportPageBySlug',
      config: {
        auth: false,
      },
    }
  ],
};
