export default {
  register(app: any) {
    // Add a menu link to the admin panel
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

    // Register the page component
    app.registerPlugin({
      id: 'content-export',
      name: 'Content Export',
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    const importedTrads = await Promise.all(
      locales.map((locale: string) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: data,
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};