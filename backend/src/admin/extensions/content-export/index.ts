export default {
  register(app: any) {
    app.addMenuLink({
      to: '/content-export',
      icon: 'download',
      intlLabel: {
        id: 'content-export.plugin.name',
        defaultMessage: 'Content Export',
      },
      permissions: [
        // Only users with access to the content manager can see this
        {
          action: 'plugin::content-manager.explorer.read',
          subject: null,
        },
      ],
    });
  },
};