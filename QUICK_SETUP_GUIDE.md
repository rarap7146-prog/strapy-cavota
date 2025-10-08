# Quick Setup Guide - All Three Features

This is a quick reference guide for the three new features. For detailed documentation, see individual files.

## 🎯 Overview

| Feature | Documentation | Status |
|---------|---------------|--------|
| 1. Favicon Upload | [FAVICON_SETUP.md](./FAVICON_SETUP.md) | ✅ Code Ready |
| 2. Webhook Auto-Revalidation | [WEBHOOK_SETUP.md](./WEBHOOK_SETUP.md) | ✅ Code Ready |
| 3. Google Tag Manager | [GTM_SETUP.md](./GTM_SETUP.md) | ✅ Guide Ready |

---

## 1️⃣ Favicon Upload System

### Quick Start

**Step 1: Restart Strapi**
```bash
cd /var/www/linkgacor.one
tmux send-keys -t cavota:0 C-c
sleep 2
tmux send-keys -t cavota:0 "cd backend && npm run develop" Enter
```

**Step 2: Generate Favicons**
- Visit https://realfavicongenerator.net/
- Upload your logo
- Download the generated zip file

**Step 3: Upload via API**
```bash
curl -X POST https://cavota.id/next-api/favicon-upload \
  -F "file=@/path/to/favicons.zip"
```

**Step 4: Verify**
```bash
curl https://cavota.id/favicons/favicon.ico
```

### API Endpoints

- **Upload**: `POST /next-api/favicon-upload` (multipart/form-data)
- **Settings**: `GET /next-api/favicon-settings`
- **Files**: `GET /favicons/{filename}`

### Required Files in ZIP

```
favicons.zip
├── apple-touch-icon.png          (180x180px)
├── favicon.ico                   (multi-size)
├── favicon.svg                   (vector)
├── favicon-96x96.png             (96x96px)
├── site.webmanifest              (JSON)
├── web-app-manifest-192x192.png  (192x192px)
└── web-app-manifest-512x512.png  (512x512px)
```

### Integration in Next.js

Add to `frontend/app/(site)/[locale]/layout.tsx`:

```typescript
import { generateFaviconMetadata } from '@/lib/favicons';

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const icons = await generateFaviconMetadata();
  
  return {
    // ... other metadata
    icons,
  };
}
```

**Full Guide**: [FAVICON_SETUP.md](./FAVICON_SETUP.md)

---

## 2️⃣ Strapi Webhook for Auto-Revalidation

### Quick Start

**Step 1: Open Strapi Admin**
- Go to https://cavota.id/admin
- Navigate to **Settings** → **Webhooks**
- Click **Add new webhook**

**Step 2: Configure Webhook**

| Field | Value |
|-------|-------|
| Name | `Next.js Auto Revalidation` |
| URL | `https://cavota.id/next-api/strapi-webhook` |

**Step 3: Select Events**

Enable these events:
- ✅ `entry.create` (page, insight, work)
- ✅ `entry.update` (page, insight, work, global-strings, site-settings)
- ✅ `entry.publish` (page, insight, work)
- ✅ `entry.unpublish` (page, insight, work)
- ✅ `entry.delete` (page, insight, work)

**Step 4: Save and Test**

1. Click **Save**
2. Edit any page in Strapi
3. Click **Publish**
4. Wait 2-3 seconds
5. Refresh frontend to see changes

### How It Works

```
[Content Update in Strapi]
         ↓
[Webhook → /next-api/strapi-webhook]
         ↓
[Determine Affected Pages]
         ↓
[Call /next-api/revalidate for Each]
         ↓
[Next.js Rebuilds Pages]
         ↓
[Changes Live in 2-5 Seconds]
```

### What Gets Revalidated

| Content Type | Revalidated Paths |
|--------------|-------------------|
| **Page** | `/id/{slug}`, `/en/{slug}` |
| **Insight** | `/id/wawasan/{slug}`, `/en/insights/{slug}`, listing pages, AMP |
| **Work** | `/id/karya/{slug}`, `/en/work/{slug}`, listing pages |
| **Global** | Homepage (all locales) |

### Monitoring

**Check Webhook Logs**:
```bash
tail -f /var/www/linkgacor.one/frontend/next-production.log | grep -i webhook
```

**Check Recent Deliveries**:
- Strapi Admin → Settings → Webhooks
- Click on webhook → Recent deliveries
- Should show 200 status code

**Full Guide**: [WEBHOOK_SETUP.md](./WEBHOOK_SETUP.md)

---

## 3️⃣ Google Tag Manager Setup

### Quick Start

**Step 1: Create GTM Component**

Create `frontend/components/GoogleTagManager.tsx`:

```typescript
'use client';

import Script from 'next/script';

interface GoogleTagManagerProps {
  gtmId: string;
}

export function GoogleTagManager({ gtmId }: GoogleTagManagerProps) {
  return (
    <Script
      id="gtm-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `,
      }}
    />
  );
}

export function GoogleTagManagerNoScript({ gtmId }: GoogleTagManagerProps) {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
```

**Step 2: Add to Layout**

Update `frontend/app/(site)/[locale]/layout.tsx`:

```typescript
import { GoogleTagManager, GoogleTagManagerNoScript } from '@/components/GoogleTagManager';

export default async function RootLayout({ children, params }: LayoutProps) {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX';

  return (
    <html lang={locale}>
      <body>
        <GoogleTagManagerNoScript gtmId={GTM_ID} />
        
        <div className="min-h-screen flex flex-col">
          {children}
        </div>

        <GoogleTagManager gtmId={GTM_ID} />
      </body>
    </html>
  );
}
```

**Step 3: Add Environment Variable**

Add to `frontend/.env.local`:

```env
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

Replace `GTM-XXXXXXX` with your actual GTM ID.

**Step 4: Build and Deploy**

```bash
cd /var/www/linkgacor.one/frontend
npm run build
tmux send-keys -t cavota:1 C-c
sleep 2
tmux send-keys -t cavota:1 "npm run start -- -p 3001" Enter
```

**Step 5: Test**

1. Open https://cavota.id
2. Open DevTools → Console
3. Check for GTM loaded
4. Open DevTools → Network
5. Filter by "gtm"
6. Should see gtm.js loaded

### Performance Strategy

✅ **Use `afterInteractive`** - Best balance (recommended)
- Loads after page becomes interactive
- Doesn't block initial render
- Captures early interactions
- PageSpeed score: 95+

⚡ **Use `worker` (Partytown)** - Maximum performance
- Runs GTM in web worker
- Zero main thread blocking
- PageSpeed score: 98+
- Requires testing all tags

### Track Page Views

Create `frontend/hooks/useGTM.ts`:

```typescript
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function useGTM() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'pageview',
        page: pathname,
        query: searchParams?.toString() || '',
      });
    }
  }, [pathname, searchParams]);
}
```

Use in layout:

```typescript
import { useGTM } from '@/hooks/useGTM';

export default function RootLayout({ children }: LayoutProps) {
  useGTM(); // Track page views
  
  return <html><body>{children}</body></html>;
}
```

**Full Guide**: [GTM_SETUP.md](./GTM_SETUP.md)

---

## 🔧 Important Notes

### API Routing

⚠️ **Remember**: Use `/next-api/` for Next.js APIs, NOT `/api/`

- ❌ `/api/` → Strapi (configured in nginx)
- ✅ `/next-api/` → Next.js API routes

### Nginx Configuration

Already configured in nginx:
- `/api/*` → Proxies to Strapi backend (port 1337)
- `/next-api/*` → Proxies to Next.js (port 3001)
- `/favicons/*` → Serves static files from Strapi public folder

### Environment Variables

Make sure these are set in `frontend/.env.local`:

```env
STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_URL=https://cavota.id
NEXT_PUBLIC_SITE_URL=https://cavota.id
REVALIDATE_SECRET=your-secret-key-here
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

---

## 📊 Feature Comparison

| Feature | Setup Time | Complexity | Impact |
|---------|------------|------------|--------|
| Favicon Upload | 15 min | ⭐⭐ Easy | High (Branding) |
| Webhook | 10 min | ⭐⭐ Easy | High (Auto-update) |
| GTM | 20 min | ⭐⭐⭐ Medium | High (Analytics) |

---

## 🚀 Deployment Checklist

After implementing any feature:

- [ ] Test in development (`npm run dev`)
- [ ] Build production (`npm run build`)
- [ ] Restart server (via tmux)
- [ ] Test on production (https://cavota.id)
- [ ] Check browser console for errors
- [ ] Monitor logs (`tail -f next-production.log`)
- [ ] Commit changes to git
- [ ] Push to GitHub

---

## 🆘 Quick Troubleshooting

### Favicon Not Showing
1. Hard refresh: `Ctrl+Shift+R`
2. Check file exists: `curl https://cavota.id/favicons/favicon.ico`
3. Clear Next.js cache and rebuild

### Webhook Not Working
1. Check webhook enabled in Strapi admin
2. Verify URL: `https://cavota.id/next-api/strapi-webhook`
3. Check Next.js logs: `tail -f next-production.log`
4. Test manually: `curl -X POST https://cavota.id/next-api/strapi-webhook`

### GTM Not Loading
1. Verify `NEXT_PUBLIC_GTM_ID` is set
2. Check browser console for errors
3. Use Google Tag Assistant extension
4. Rebuild Next.js

---

## 📚 Documentation Index

- **[FAVICON_SETUP.md](./FAVICON_SETUP.md)** - Complete favicon upload guide
- **[WEBHOOK_SETUP.md](./WEBHOOK_SETUP.md)** - Webhook configuration guide  
- **[GTM_SETUP.md](./GTM_SETUP.md)** - Google Tag Manager implementation
- **[SEO_SETUP.md](./frontend/SEO_SETUP.md)** - Sitemap and robots.txt
- **[DOCUMENTATION.md](./backend/DOCUMENTATION.md)** - Strapi backend reference
- **[DOCUMENTATION.md](./frontend/DOCUMENTATION.md)** - Next.js frontend reference

---

## 💡 Next Steps

After completing basic setup:

1. **Favicon**: Generate and upload your brand favicon
2. **Webhook**: Set up in Strapi admin for auto-updates
3. **GTM**: Configure your tracking tags in GTM dashboard
4. **Testing**: Test all features thoroughly
5. **Monitoring**: Set up analytics and error tracking
6. **Optimization**: Monitor PageSpeed and optimize as needed

---

**Last Updated**: October 8, 2025  
**Version**: 1.0  
**Status**: All Features Code-Complete ✅
