export default {
  routes: [
    {
      method: 'GET',
      path: '/global-strings',
      handler: 'global-strings.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/global-strings',
      handler: 'global-strings.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/global-strings',
      handler: 'global-strings.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};