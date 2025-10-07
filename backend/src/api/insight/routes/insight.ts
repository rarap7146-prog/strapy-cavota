export default {
  routes: [
    {
      method: 'GET',
      path: '/insights',
      handler: 'insight.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/insights/:id',
      handler: 'insight.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/insights',
      handler: 'insight.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/insights/:id',
      handler: 'insight.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/insights/:id',
      handler: 'insight.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};