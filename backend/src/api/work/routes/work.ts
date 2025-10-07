export default {
  routes: [
    {
      method: 'GET',
      path: '/works',
      handler: 'work.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/works/:id',
      handler: 'work.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/works',
      handler: 'work.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/works/:id',
      handler: 'work.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/works/:id',
      handler: 'work.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    // i18n specific routes
    {
      method: 'POST',
      path: '/works/seed-i18n',
      handler: 'work.seedI18n',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/works/verify-i18n',
      handler: 'work.verifyI18n',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/works/create-i18n',
      handler: 'work.createI18nWork',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};