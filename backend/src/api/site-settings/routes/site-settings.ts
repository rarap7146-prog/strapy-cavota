export default {
  routes: [
    {
      method: 'GET',
      path: '/site-settings',
      handler: 'site-settings.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/site-settings',
      handler: 'site-settings.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/site-settings',
      handler: 'site-settings.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};