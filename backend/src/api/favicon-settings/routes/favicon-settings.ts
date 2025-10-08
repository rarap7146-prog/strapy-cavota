/**
 * Favicon Settings API
 * Allows uploading and managing favicon files via zip upload
 * 
 * API: POST /api/favicon-settings/upload
 * API: GET /api/favicon-settings
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/favicon-settings/upload',
      handler: 'favicon-settings.upload',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/favicon-settings',
      handler: 'favicon-settings.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/favicon-settings',
      handler: 'favicon-settings.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
