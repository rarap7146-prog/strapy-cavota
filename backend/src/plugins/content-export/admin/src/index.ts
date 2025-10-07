import { prefixPluginTranslations } from '@strapi/helper-plugin';

const pluginPkg = require('../../package.json');
const pluginId = pluginPkg.strapi.name;

export default {
  register(app: any) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: 'download',
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'Content Export',
      },
      permissions: [
        {
          action: 'plugin::content-manager.explorer.read',
          subject: null,
        },
      ],
    });

    app.registerPlugin({
      id: pluginId,
      initializer: () => null,
      isReady: false,
      name: pluginPkg.strapi.displayName || pluginPkg.strapi.name,
    });
  },

  bootstrap() {},
  async registerTrads({ locales }: { locales: string[] }) {
    const importedTrads = await Promise.all(
      locales.map((locale: string) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
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