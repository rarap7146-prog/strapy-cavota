# Favicon Upload System

## Overview

This system allows you to upload a zip file containing all favicon and web app manifest files through Strapi, which are then automatically served by Next.js.

## Setup Instructions

### 1. Restart Strapi

First, restart Strapi to load the new favicon-settings content type:

```bash
cd /var/www/linkgacor.one
tmux send-keys -t cavota:0 C-c
sleep 2
tmux send-keys -t cavota:0 "cd backend && npm run develop" Enter
```

### 2. Prepare Your Favicon Files

Create a zip file containing these exact filenames:

```
favicons.zip
├── apple-touch-icon.png          (180x180px)
├── favicon.ico                   (16x16, 32x32, 48x48)
├── favicon.svg                   (vector, preferred)
├── favicon-96x96.png             (96x96px)
├── site.webmanifest              (web app manifest JSON)
├── web-app-manifest-192x192.png  (192x192px)
└── web-app-manifest-512x512.png  (512x512px)
```

**Recommended Tools to Generate Favicons**:
- https://realfavicongenerator.net/
- https://favicon.io/
- https://www.favicon-generator.org/

**Note**: The zip file can have any name, but the files inside MUST have these exact names.

### 3. Upload via API

Use the following methods to upload your favicon zip:

#### Option A: Using Postman/Insomnia

```
POST https://cavota.id/next-api/favicon-upload
Content-Type: multipart/form-data

Body:
- file: [select your favicons.zip file]
```

#### Option B: Using cURL

```bash
curl -X POST https://cavota.id/next-api/favicon-upload \
  -F "file=@/path/to/favicons.zip"
```

#### Option C: Using JavaScript/Fetch

```javascript
const formData = new FormData();
formData.append('file', faviconZipFile);

const response = await fetch('https://cavota.id/next-api/favicon-upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result);
```

### 4. Update Next.js Layout

Update your root layout to use the favicon metadata:

**File**: `frontend/app/(site)/[locale]/layout.tsx`

```typescript
import { generateFaviconMetadata } from '@/lib/favicons';

// Add to metadata generation
export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const locale = params.locale;
  
  // ... existing metadata code ...

  // Add favicon metadata
  const icons = await generateFaviconMetadata();

  return {
    // ... existing metadata ...
    icons,
  };
}
```

### 5. Verify Installation

Check if favicons are accessible:

```bash
# Check uploaded files
curl https://cavota.id/next-api/favicon-settings

# Test individual files
curl https://cavota.id/favicons/favicon.ico
curl https://cavota.id/favicons/apple-touch-icon.png
curl https://cavota.id/favicons/site.webmanifest
```

## File Specifications

### apple-touch-icon.png
- **Size**: 180x180 pixels
- **Format**: PNG
- **Purpose**: iOS home screen icon
- **Background**: Should be solid color (no transparency)

### favicon.ico
- **Sizes**: Multiple sizes in one file (16x16, 32x32, 48x48)
- **Format**: ICO
- **Purpose**: Legacy browser support
- **Tip**: Use online converter to combine PNG into ICO

### favicon.svg
- **Format**: SVG (vector)
- **Purpose**: Modern browsers, scalable
- **Tip**: Supports dark mode with prefers-color-scheme
- **Size**: Keep file size under 5KB

### favicon-96x96.png
- **Size**: 96x96 pixels
- **Format**: PNG
- **Purpose**: Google TV, Android Chrome

### site.webmanifest
- **Format**: JSON
- **Purpose**: Progressive Web App configuration
- **Example**:

```json
{
  "name": "Cavota",
  "short_name": "Cavota",
  "description": "Premium Digital Marketing Agency",
  "icons": [
    {
      "src": "/favicons/web-app-manifest-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/favicons/web-app-manifest-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "/"
}
```

### web-app-manifest-192x192.png
- **Size**: 192x192 pixels
- **Format**: PNG
- **Purpose**: Android Chrome app icon

### web-app-manifest-512x512.png
- **Size**: 512x512 pixels
- **Format**: PNG
- **Purpose**: Android splash screen

## Architecture

### How It Works

1. **Upload**: User uploads zip file to Strapi API endpoint
2. **Extraction**: Strapi extracts allowed files to `backend/public/favicons/`
3. **Storage**: Filenames stored in database (Single Type content)
4. **Serving**: Nginx serves files directly from `backend/public/favicons/`
5. **Next.js**: Fetches available files and generates metadata tags

### File Flow

```
[User] → [POST /next-api/favicon-upload]
         ↓
    [Next.js API Handler]
         ↓
    [Forward to Strapi]
         ↓
    [Extract ZIP]
         ↓
    [Save to backend/public/favicons/]
         ↓
    [Update Database]

[Next.js Layout] → [GET /next-api/favicon-settings]
                   ↓
              [Fetch from Strapi]
                   ↓
              [Return Available Files]
                   ↓
              [Generate <link> tags]
```

### Security

- ✅ Only allowed filenames are extracted
- ✅ Path traversal protection
- ✅ File type validation
- ✅ Files stored in dedicated directory
- ⚠️ No authentication required (consider adding for production)

## API Reference

### POST /next-api/favicon-upload

Upload favicon zip file (proxies to Strapi).

**Request**:
```
POST /next-api/favicon-upload
Content-Type: multipart/form-data

Body:
  file: [zip file]
```

**Response** (Success):
```json
{
  "message": "Favicon files uploaded successfully",
  "extractedFiles": [
    "apple-touch-icon.png",
    "favicon.ico",
    "favicon.svg",
    "favicon-96x96.png",
    "site.webmanifest",
    "web-app-manifest-192x192.png",
    "web-app-manifest-512x512.png"
  ],
  "settings": {
    "id": 1,
    "files": [...],
    "uploadedAt": "2025-10-08T00:00:00.000Z"
  }
}
```

**Response** (Error):
```json
{
  "error": {
    "message": "File must be a zip archive"
  }
}
```

### GET /next-api/favicon-settings

Get current favicon configuration (proxies to Strapi).

**Request**:
```
GET /next-api/favicon-settings
```

**Response**:
```json
{
  "data": {
    "id": 1,
    "files": ["favicon.ico", "apple-touch-icon.png", ...],
    "uploadedAt": "2025-10-08T00:00:00.000Z",
    "availableFiles": ["favicon.ico", "apple-touch-icon.png", ...]
  }
}
```

## Troubleshooting

### Files Not Extracting

**Problem**: Upload succeeds but files not in backend/public/favicons/

**Solution**:
1. Check Strapi logs: `tail -f backend/strapi.log`
2. Verify directory permissions: `ls -la backend/public/`
3. Create directory manually: `mkdir -p backend/public/favicons`
4. Check zip file structure (files should be at root, not in subfolder)

### Favicon Not Showing in Browser

**Problem**: Files uploaded but favicon not displaying

**Solutions**:
1. Hard refresh browser: `Ctrl+Shift+R` or `Cmd+Shift+R`
2. Clear browser cache
3. Check if files are accessible: `curl https://cavota.id/favicons/favicon.ico`
4. Rebuild Next.js: `npm run build` in frontend folder
5. Check Next.js metadata in page source: View → Developer → View Source

### Wrong File in Zip

**Problem**: Uploaded wrong favicon files

**Solution**:
1. Simply upload a new zip file
2. Old files will be overwritten
3. No need to delete old files manually

### Permission Denied

**Problem**: Cannot write to backend/public/favicons/

**Solution**:
```bash
# Set correct permissions
sudo chown -R $USER:$USER backend/public/favicons
chmod 755 backend/public/favicons
```

## Best Practices

### Design Guidelines

1. **Consistency**: Use the same logo/icon across all sizes
2. **Simplicity**: Favicons are small, keep design simple
3. **Contrast**: Ensure visibility on both light and dark backgrounds
4. **Brand Colors**: Match your brand identity

### Technical Guidelines

1. **Optimization**: Compress images to reduce file size
2. **Testing**: Test on multiple devices and browsers
3. **Dark Mode**: Consider SVG with dark mode support
4. **Updates**: Update all files together to maintain consistency

### Performance

1. **File Sizes**:
   - favicon.ico: < 15KB
   - PNG files: < 20KB each
   - SVG: < 5KB
   - webmanifest: < 2KB

2. **Caching**: Files are cached for 1 year (immutable)
3. **CDN**: Consider using CDN for faster delivery

## Testing Checklist

After uploading favicons, test on:

- [ ] Chrome Desktop (Windows/Mac/Linux)
- [ ] Firefox Desktop
- [ ] Safari Desktop (Mac)
- [ ] Edge Desktop (Windows)
- [ ] Chrome Mobile (Android)
- [ ] Safari Mobile (iOS)
- [ ] Check in incognito/private mode
- [ ] Verify in browser tab
- [ ] Verify in bookmarks
- [ ] Verify on home screen (mobile)
- [ ] Test PWA installation
- [ ] Validate webmanifest JSON

## Advanced: Custom Implementation

If you want to manually place favicons in Next.js public folder instead:

### Option 1: Next.js Public Folder

1. Place files in `frontend/public/`
2. Update `frontend/app/(site)/[locale]/layout.tsx`:

```typescript
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'manifest', url: '/site.webmanifest' },
    ],
  },
};
```

3. No need for API or upload system

### Option 2: Next.js Icon Convention

Use Next.js built-in icon convention:

1. Place these files in `frontend/app/`:
   - `icon.png` or `icon.ico`
   - `apple-icon.png`
   - `manifest.webmanifest`

2. Next.js automatically generates metadata

**Documentation**: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons

## References

- **Favicon Guidelines**: https://developers.google.com/web/fundamentals/design-and-ux/browser-customization/
- **Web App Manifest**: https://developer.mozilla.org/en-US/docs/Web/Manifest
- **Apple Touch Icon**: https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html
- **Next.js Metadata**: https://nextjs.org/docs/app/building-your-application/optimizing/metadata

---

**Created**: October 8, 2025  
**Version**: 1.0
