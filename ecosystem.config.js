module.exports = {
  apps: [
    {
      name: 'cavota-strapi',
      cwd: '/var/www/linkgacor.one/backend',
      script: './node_modules/.bin/strapi',
      args: 'develop',
      env: {
        NODE_ENV: 'development',
        PORT: 1337,
        HOST: '0.0.0.0',
        STRAPI_DISABLE_UPDATE_NOTIFICATION: 'true',
        STRAPI_TELEMETRY_DISABLED: 'true'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '/var/www/linkgacor.one/logs/strapi-error.log',
      out_file: '/var/www/linkgacor.one/logs/strapi-out.log',
      log_file: '/var/www/linkgacor.one/logs/strapi-combined.log',
      time: true,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
    {
      name: 'cavota-frontend',
      cwd: '/var/www/linkgacor.one/frontend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: '../logs/frontend-error.log',
      out_file: '../logs/frontend-out.log',
      log_file: '../logs/frontend-combined.log',
      time: true
    }
  ]
}