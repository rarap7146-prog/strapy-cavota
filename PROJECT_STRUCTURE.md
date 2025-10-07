# Cavota Project Structure

## Overview
This project has been reorganized to have a clean separation between frontend and backend components.

## Directory Structure

```
/var/www/linkgacor.one/
├── backend/                    # Strapi CMS Backend
│   ├── src/                   # Strapi source code
│   ├── config/                # Strapi configuration
│   ├── data/                  # Database data
│   ├── dist/                  # Compiled Strapi build
│   ├── node_modules/          # Backend dependencies
│   ├── package.json           # Backend package configuration
│   ├── .env                   # Backend environment variables
│   └── ...                    # Other Strapi files
├── frontend/                   # Next.js Frontend
│   ├── app/                   # Next.js App Router
│   ├── components/            # React components
│   ├── lib/                   # Utilities and configurations
│   ├── .next/                 # Next.js build output
│   ├── node_modules/          # Frontend dependencies
│   ├── package.json           # Frontend package configuration
│   └── ...                    # Other Next.js files
├── logs/                       # PM2 logs for both apps
├── ecosystem.config.js         # PM2 configuration
├── pm2-cavota.sh              # PM2 management script
└── docs/                      # Project documentation
```

## Services

### Backend (Strapi CMS)
- **Port**: 1337
- **URL**: http://localhost:1337
- **Admin Panel**: https://cavota.id/admin
- **API Endpoint**: https://cavota.id/api

### Frontend (Next.js)
- **Port**: 3001
- **URL**: http://localhost:3001
- **Public URL**: https://cavota.id

## PM2 Management

The project uses PM2 for process management with the following applications:

1. **cavota-strapi**: Strapi backend running from `/var/www/linkgacor.one/backend`
2. **cavota-frontend**: Next.js frontend running from `/var/www/linkgacor.one/frontend`

### Commands

```bash
# Start all services
pm2 start ecosystem.config.js

# Stop all services
pm2 stop all

# Restart all services
pm2 restart all

# View status
pm2 status

# View logs (use --nostream flag)
pm2 logs --nostream

# Save PM2 configuration
pm2 save
```

## Development Workflow

### Backend Development
```bash
cd /var/www/linkgacor.one/backend
npm run develop  # Development mode
npm run build    # Production build
npm start        # Production mode
```

### Frontend Development
```bash
cd /var/www/linkgacor.one/frontend
npm run dev      # Development mode
npm run build    # Production build
npm start        # Production mode
```

## Environment Configuration

- Backend environment variables are in `/var/www/linkgacor.one/backend/.env`
- Frontend environment variables are in `/var/www/linkgacor.one/frontend/.env.local`

## Nginx Configuration

The Nginx configuration routes:
- `/admin`, `/api`, `/uploads`, `/_health` → Strapi backend (port 1337)
- All other requests → Next.js frontend (port 3001)

## Notes

- Always rebuild the frontend after code changes: `npm run build`
- Use `pm2 logs --nostream` to avoid streaming issues
- Both services auto-restart on failure via PM2
- Logs are stored in `/var/www/linkgacor.one/logs/`