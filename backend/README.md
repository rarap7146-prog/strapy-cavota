# Cavota Strapi Backend

## Overview

This is a **Strapi v5.25.0** headless CMS backend powering the Cavota website. It provides a flexible content management system with internationalization (i18n), SEO optimization, and a custom page builder using dynamic zones.

## Tech Stack

- **Strapi**: 5.25.0
- **Node.js**: 22.20.0
- **Database**: MySQL (strapi5_db)
- **Port**: 1337 (development)

## Quick Start

### Prerequisites
- Node.js 22.x
- MySQL database running
- `.env` file configured (see `.env.example`)

### Installation
```bash
# Install dependencies
npm install

# Development mode (with auto-reload)
npm run develop

# Production build
npm run build

# Production start
npm run start
```

### Process Management
The backend runs in a tmux session managed by the main tmux session:
```bash
# Check tmux session
tmux attach -t cavota

# Window 0: Strapi backend
# Window 1: Next.js frontend
```

## Project Structure

```
backend/
├── config/          # Configuration files
├── src/
│   ├── admin/       # Admin panel customizations
│   ├── api/         # API collections
│   │   ├── page/           # Dynamic pages
│   │   ├── work/           # Portfolio cases
│   │   ├── testimonial/    # Client testimonials
│   │   ├── site-settings/  # Site configuration
│   │   ├── global-strings/ # Navigation & labels
│   │   ├── rfp-submission/ # Form submissions
│   │   ├── insight/        # Blog/insights (future)
│   │   └── tag/            # Content tags
│   ├── components/  # Reusable components
│   │   ├── sections/  # Page section components
│   │   ├── ui/        # UI components
│   │   ├── media/     # Media components
│   │   ├── shared/    # Shared components (SEO)
│   │   ├── project/   # Project-specific components
│   │   └── metrics/   # Metric components
│   ├── extensions/  # Plugin extensions
│   ├── middlewares/ # Custom middlewares
│   └── plugins/     # Custom plugins
├── public/          # Public assets & uploads
├── database/        # Database migrations
└── types/           # TypeScript definitions
```

## Core Concepts

### 1. Content Types

#### Collection Types (Multiple entries)
- **Page**: Dynamic pages with flexible sections
- **Work**: Portfolio case studies
- **Testimonial**: Client testimonials
- **RFP Submission**: Contact form submissions
- **Tag**: Content categorization
- **Insight**: Blog posts (future)

#### Single Types (One entry)
- **Site Settings**: Global site configuration
- **Global Strings**: UI labels and navigation

### 2. Dynamic Zones

Pages use **Dynamic Zones** to allow flexible content composition. Each page can have multiple sections arranged in any order:

- Hero Section
- Proof Bar (logos)
- Services Grid
- Case Carousel
- Testimonial Carousel
- Metrics Grid
- Playbook (steps)
- CTA Strip
- Rich Text
- FAQ
- Dynamic Content

### 3. Internationalization (i18n)

**Supported Locales**: `id` (Indonesian), `en` (English)

Content can be:
- **Localized**: Different content per language (e.g., titles, descriptions)
- **Shared**: Same across all languages (e.g., IDs, technical fields)

Each localized content type has:
- `translation_key`: Links translations together
- `locale`: Specifies the language

### 4. SEO Plugin

Every page and work item has SEO fields:
- Meta title & description
- Meta image (Open Graph)
- Keywords
- Canonical URL
- Structured data (JSON-LD)
- Robots meta
- Open Graph data

## Environment Variables

Key variables in `.env`:

```bash
# Server
HOST=0.0.0.0
PORT=1337
STRAPI_ADMIN_BACKEND_URL=https://cavota.id

# Security
APP_KEYS=...
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
JWT_SECRET=...

# Database
DATABASE_CLIENT=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=strapi5_db
DATABASE_USERNAME=strapi_user
DATABASE_PASSWORD=...

# Frontend Integration
REVALIDATE_SECRET=...
```

## Custom Features

### 1. Export Page Button

**Location**: Admin panel → Pages → Edit page
**Functionality**: Exports the complete page data as JSON

**Implementation**: `src/admin/app.ts`
- Adds a custom "Export Page" button below the Save button
- Fetches page data with deep population
- Downloads as JSON file
- Auto-repositions on navigation

### 2. RFP Form Protection

**Security**: RFP submissions are API-token-only
- Not accessible via public API
- Requires authentication token
- Configured in `src/api/rfp-submission/controllers/rfp-submission.ts`

### 3. Deep Population Plugin

**Plugin**: `strapi-plugin-populate-deep`
**Purpose**: Automatically populates nested relations up to 5 levels
**Usage**: Add `?populate=deep` to API requests

## API Endpoints

### Public API

```
GET /api/pages?filters[slug][$eq]=home&locale=id
GET /api/works?populate[assets][populate]=file
GET /api/testimonials
GET /api/site-settings?populate=*
GET /api/global-strings?locale=id
GET /api/tags
```

### Protected Endpoints

```
POST /api/rfp-submissions (requires API token)
```

## Configuration Files

### `config/server.ts`
Basic server configuration (host, port, app keys)

### `config/database.ts`
Database connection settings (MySQL, PostgreSQL, SQLite support)

### `config/middlewares.ts`
Middleware stack including custom `admin-content-export`

### `config/plugins.ts`
Plugin configuration:
- SEO plugin
- i18n (via settings)
- populate-deep (depth: 5)

## Development Workflow

1. **Start development server**:
   ```bash
   npm run develop
   ```

2. **Access admin panel**:
   ```
   http://localhost:1337/admin
   ```

3. **Create/Edit content**:
   - Navigate to Content Manager
   - Select content type
   - Add/edit entries
   - Publish changes

4. **API automatically updates**:
   - Changes are immediately available via API
   - Frontend can revalidate on-demand

## Production Deployment

1. **Build admin panel**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm run start
   ```

3. **Process management**:
   - Use tmux for persistent sessions
   - Backend runs on port 1337
   - Nginx proxies to domain

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 1337
lsof -ti:1337 | xargs kill -9
```

### Database Connection Issues
- Verify MySQL is running
- Check credentials in `.env`
- Ensure database `strapi5_db` exists

### Admin Panel Not Loading
- Clear browser cache
- Rebuild admin: `npm run build`
- Check console for errors

### API Not Populating Relations
- Use explicit populate syntax
- For dynamic zones: `populate[0]=sections&populate[1]=sections.items...`
- Or use `?populate=deep` with populate-deep plugin

## Security Notes

1. **Never commit `.env`** - contains sensitive keys
2. **API tokens** - stored securely, never exposed to frontend
3. **CORS** - configured in middlewares for cavota.id domain
4. **RFP submissions** - protected, requires authentication
5. **Admin access** - use strong passwords, restrict by IP if possible

## Support

For issues or questions:
- Check Strapi v5 documentation: https://docs.strapi.io
- Review error logs: `backend/strapi.log`
- Check tmux session: `tmux attach -t cavota`

---

**Version**: 0.1.0  
**Last Updated**: October 2025
