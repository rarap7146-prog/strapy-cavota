import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  // Important: always return the modified config
  return mergeConfig(config, {
    server: {
      host: '0.0.0.0',
      port: 1337,
      allowedHosts: [
        'cavota.id',
        'www.cavota.id',
        'localhost',
        '127.0.0.1'
      ]
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    define: {
      global: 'globalThis',
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined,
        }
      },
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true
      }
    }
  });
};