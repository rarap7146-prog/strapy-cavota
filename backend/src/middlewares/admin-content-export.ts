export default () => {
  return async (ctx: any, next: any) => {
    // Check if this is a request to the admin content export route
    if (ctx.url === '/admin/content-export' || ctx.url === '/admin/content-export/') {
      // Redirect to the API endpoint
      ctx.redirect('/api/content-export');
      return;
    }
    
    await next();
  };
};