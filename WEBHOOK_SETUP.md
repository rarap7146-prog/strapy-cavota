# Strapi Webhook Setup for Next.js Auto-Revalidation

## Overview

This guide shows you how to configure Strapi webhooks to automatically refresh Next.js pages when content is updated in Strapi CMS.

## How It Works

```
[Content Update in Strapi]
         ↓
[Webhook Triggered]
         ↓
[POST to Next.js Webhook Handler]
         ↓
[Revalidate Affected Pages]
         ↓
[Next.js Rebuilds Pages]
         ↓
[Users See Updated Content]
```

## Step-by-Step Setup

### Step 1: Access Strapi Webhook Settings

1. Open Strapi Admin Panel: https://cavota.id/admin
2. Navigate to **Settings** (gear icon in sidebar)
3. Under **Global Settings**, click **Webhooks**
4. Click **Add new webhook** button

### Step 2: Configure Webhook

**Basic Settings**:

| Field | Value |
|-------|-------|
| **Name** | `Next.js Auto Revalidation` |
| **URL** | `https://cavota.id/next-api/strapi-webhook` |
| **Headers** | Leave empty (or add custom headers if needed) |
| **Events** | Select events (see below) |

**Events to Enable**:

Select these events for each content type you want to auto-update:

#### For Pages:
- ✅ `entry.create` (page)
- ✅ `entry.update` (page)
- ✅ `entry.publish` (page)
- ✅ `entry.unpublish` (page)
- ✅ `entry.delete` (page)

#### For Insights:
- ✅ `entry.create` (insight)
- ✅ `entry.update` (insight)
- ✅ `entry.publish` (insight)
- ✅ `entry.unpublish` (insight)
- ✅ `entry.delete` (insight)

#### For Works:
- ✅ `entry.create` (work)
- ✅ `entry.update` (work)
- ✅ `entry.publish` (work)
- ✅ `entry.unpublish` (work)
- ✅ `entry.delete` (work)

#### For Global Content:
- ✅ `entry.update` (global-strings)
- ✅ `entry.update` (site-settings)
- ✅ `entry.create` (testimonial)
- ✅ `entry.update` (testimonial)
- ✅ `entry.delete` (testimonial)

### Step 3: Save Webhook

1. Click **Save** button at the bottom
2. Webhook is now active

### Step 4: Test Webhook

#### Test in Strapi Admin:

1. Go to your webhook settings
2. Click on the webhook you just created
3. Look for **Trigger** section
4. Click **Trigger** button to send test request
5. Check **Recent deliveries** section to see if request succeeded

#### Test with Real Content:

1. Edit any page in Strapi (e.g., update homepage title)
2. Click **Save** and **Publish**
3. Check webhook logs in **Recent deliveries**
4. Wait 1-2 seconds
5. Refresh your frontend: https://cavota.id
6. Content should be updated!

### Step 5: Monitor Webhook

**Check Webhook Logs in Strapi**:

1. Go to **Settings** → **Webhooks**
2. Click on your webhook
3. Scroll to **Recent deliveries** section
4. You'll see:
   - Request timestamp
   - HTTP status code (200 = success)
   - Response body

**Check Next.js Logs**:

```bash
# View Next.js logs
tail -f /var/www/linkgacor.one/frontend/next-production.log

# Or via tmux
tmux attach -t cavota
# Press Ctrl+B then 1 (to go to Next.js window)
# You'll see webhook logs like:
# [Webhook] Received: entry.update for page
# [Webhook] ✓ Revalidated: /id/tentang
```

## Webhook Behavior

### What Gets Revalidated

The webhook handler automatically revalidates relevant pages based on content type:

| Content Type | Pages Revalidated |
|--------------|-------------------|
| **Page** | `/id/{slug}`, `/en/{slug}`, both homepages |
| **Insight** | `/id/wawasan/{slug}`, `/en/insights/{slug}`, AMP versions, listing pages |
| **Work** | `/id/karya/{slug}`, `/en/work/{slug}`, listing pages |
| **Global Strings** | All pages (homepage) |
| **Site Settings** | All pages (homepage) |
| **Testimonial** | Homepage |

### Revalidation Time

- **Immediate**: Webhook triggers within 1 second of save
- **Rebuild**: Pages rebuild in 1-3 seconds
- **Total**: Content updates visible in 2-5 seconds

### Multiple Locales

- Both Indonesian (`id`) and English (`en`) versions are revalidated
- Ensures consistency across all languages

## Advanced Configuration

### Custom Headers (Optional)

If you want to add authentication:

1. In webhook settings, add header:
   ```
   Authorization: Bearer your-secret-token
   ```

2. Update Next.js webhook handler to validate:

**File**: `frontend/app/next-api/strapi-webhook/route.ts`

```typescript
export async function POST(request: Request) {
  // Validate authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader !== 'Bearer your-secret-token') {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // ... rest of handler
}
```

### Selective Revalidation

If you want to revalidate only specific pages:

1. Modify webhook handler to check `page_type` or other fields
2. Skip revalidation for certain content
3. Example: Only revalidate published content

### Retry Configuration

Strapi automatically retries failed webhooks:

- **Retries**: Up to 5 attempts
- **Backoff**: Exponential (1s, 2s, 4s, 8s, 16s)
- **Timeout**: 30 seconds per request

## Troubleshooting

### Webhook Not Firing

**Problem**: Content updates don't trigger webhook

**Solutions**:
1. Check webhook is **Enabled** in Strapi
2. Verify correct events are selected
3. Check Strapi logs: `tail -f backend/strapi.log`
4. Restart Strapi: `tmux send-keys -t cavota:0 C-c && sleep 2 && tmux send-keys -t cavota:0 "cd backend && npm run develop" Enter`

### Webhook Returns Error

**Problem**: Webhook logs show 404 or 500 error

**Solutions**:

**404 Not Found**:
- Check URL is correct: `https://cavota.id/next-api/strapi-webhook`
- Ensure Next.js is running
- Verify nginx routing for `/next-api/` paths

**500 Internal Server Error**:
- Check Next.js logs for errors
- Verify `REVALIDATE_SECRET` is set in `.env.local`
- Check revalidation API is working: 
  ```bash
  curl -X POST "https://cavota.id/next-api/revalidate?path=/id&secret=YOUR_SECRET"
  ```

**Connection Timeout**:
- Check Next.js server is running: `tmux capture-pane -t cavota:1 -p | tail -5`
- Verify port 3001 is accessible
- Check nginx configuration

### Content Not Updating

**Problem**: Webhook succeeds but content still old

**Solutions**:

1. **Clear Next.js Cache**:
   ```bash
   rm -rf /var/www/linkgacor.one/frontend/.next/cache/
   cd /var/www/linkgacor.one/frontend && npm run build
   tmux send-keys -t cavota:1 C-c && sleep 2 && tmux send-keys -t cavota:1 "npm run start -- -p 3001" Enter
   ```

2. **Hard Refresh Browser**:
   - Chrome/Firefox: `Ctrl+Shift+R`
   - Safari: `Cmd+Shift+R`
   - Or use incognito/private mode

3. **Check Cache Headers**:
   ```bash
   curl -I https://cavota.id/id/tentang
   # Look for Cache-Control header
   ```

4. **Verify Revalidation Logs**:
   ```bash
   tail -f /var/www/linkgacor.one/frontend/next-production.log | grep -i revalidate
   ```

### Webhook Too Slow

**Problem**: Takes too long to update content

**Solutions**:

1. **Optimize Revalidation**:
   - Reduce number of paths being revalidated
   - Only revalidate changed content, not entire site

2. **Use ISR Instead of SSG**:
   - Add `revalidate` to page components:
   ```typescript
   export const revalidate = 60; // Revalidate every 60 seconds
   ```

3. **Background Revalidation**:
   - Webhook triggers revalidation
   - Next.js rebuilds in background
   - Serves stale content while rebuilding

## Testing Guide

### Manual Test

1. **Update Content**:
   - Go to Strapi admin
   - Edit any page (e.g., About page)
   - Change title or content
   - Save and Publish

2. **Wait 2-3 Seconds**

3. **Check Frontend**:
   - Open https://cavota.id/id/tentang
   - Content should be updated
   - View page source to verify

### Automated Test

Create a test script:

```bash
#!/bin/bash

# Test webhook endpoint
curl -X POST https://cavota.id/next-api/strapi-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "entry.update",
    "model": "page",
    "entry": {
      "id": 1,
      "slug": "tentang",
      "locale": "id"
    }
  }'

echo "\nWebhook sent. Waiting 3 seconds..."
sleep 3

echo "Checking if page was revalidated..."
curl -I https://cavota.id/id/tentang | grep -i "x-nextjs-cache"
```

Save as `test-webhook.sh` and run: `bash test-webhook.sh`

## Performance Impact

### Server Load

- **Per Webhook**: ~100-500ms processing time
- **Per Revalidation**: ~1-3 seconds rebuild time
- **Concurrent Updates**: Handled in parallel

### Optimization Tips

1. **Batch Updates**: 
   - Edit multiple fields before publishing
   - One webhook = one revalidation cycle

2. **Schedule Updates**:
   - Make bulk updates during low-traffic hours
   - Reduces impact on active users

3. **Monitor Resources**:
   ```bash
   # Check server resources
   top
   # or
   htop
   ```

## Best Practices

### Content Workflow

1. ✅ Draft content first (no webhook triggered)
2. ✅ Review and preview
3. ✅ Publish when ready (webhook triggers)
4. ✅ Verify on frontend

### Webhook Management

1. ✅ Use descriptive webhook names
2. ✅ Document webhook purpose
3. ✅ Monitor webhook logs regularly
4. ✅ Test after Strapi/Next.js updates
5. ✅ Keep webhook URL updated if domain changes

### Debugging

1. ✅ Enable verbose logging in development
2. ✅ Check both Strapi and Next.js logs
3. ✅ Use webhook test feature before going live
4. ✅ Set up error monitoring (optional: Sentry, LogRocket)

## Alternative: Manual Revalidation

If you prefer manual control, you can disable webhooks and revalidate manually:

### Via API Call

```bash
curl -X POST "https://cavota.id/next-api/revalidate?path=/id/tentang&secret=YOUR_SECRET"
```

### Via Admin UI (Future Enhancement)

You could create a Strapi admin panel button to manually trigger revalidation.

## Webhook Payload Reference

### Example Payload (Page Update)

```json
{
  "event": "entry.update",
  "createdAt": "2025-10-08T12:34:56.789Z",
  "model": "page",
  "uid": "api::page.page",
  "entry": {
    "id": 5,
    "documentId": "abc123xyz789",
    "slug": "tentang",
    "title": "Tentang Kami",
    "locale": "id",
    "publishedAt": "2025-10-08T12:34:56.789Z",
    "updatedAt": "2025-10-08T12:34:56.789Z",
    "createdAt": "2025-10-01T00:00:00.000Z"
  }
}
```

### Example Payload (Insight Publish)

```json
{
  "event": "entry.publish",
  "createdAt": "2025-10-08T12:34:56.789Z",
  "model": "insight",
  "uid": "api::insight.insight",
  "entry": {
    "id": 12,
    "documentId": "xyz789abc123",
    "slug": "strategi-digital-marketing-2025",
    "title": "Strategi Digital Marketing 2025",
    "locale": "id",
    "publishedAt": "2025-10-08T12:34:56.789Z"
  }
}
```

## Security Considerations

### Production Recommendations

1. **Add Authentication**:
   - Use bearer token in webhook header
   - Validate in Next.js handler

2. **Rate Limiting**:
   - Limit webhook requests per minute
   - Prevent abuse/DDoS

3. **IP Whitelist** (Optional):
   - Only allow requests from Strapi server IP
   - Configure in nginx

4. **HTTPS Only**:
   - Always use HTTPS for webhooks
   - Prevent man-in-the-middle attacks

5. **Secret Rotation**:
   - Change `REVALIDATE_SECRET` periodically
   - Update in both .env files

## Monitoring & Logging

### Set Up Monitoring

```bash
# Create webhook log file
touch /var/www/linkgacor.one/frontend/webhook.log

# Watch webhook activity
tail -f /var/www/linkgacor.one/frontend/webhook.log
```

### Add Custom Logging

Update webhook handler to log to file:

```typescript
import fs from 'fs';

const logFile = '/var/www/linkgacor.one/frontend/webhook.log';

export async function POST(request: Request) {
  const timestamp = new Date().toISOString();
  const payload = await request.json();
  
  // Log to file
  fs.appendFileSync(logFile, `${timestamp} - ${JSON.stringify(payload)}\n`);
  
  // ... rest of handler
}
```

## FAQ

**Q: How often can I trigger webhooks?**  
A: No hard limit, but avoid spam. Strapi has built-in rate limiting.

**Q: Do webhooks work in development?**  
A: Yes, but Strapi must be able to reach Next.js URL (might need ngrok for local dev).

**Q: Can I use webhooks with ISR?**  
A: Yes! Webhooks complement ISR by providing on-demand revalidation.

**Q: What if webhook fails?**  
A: Strapi retries automatically. Pages will update on next automatic revalidation (if using ISR).

**Q: Can I have multiple webhooks?**  
A: Yes! Create separate webhooks for different purposes (staging, production, analytics).

## References

- **Strapi Webhooks**: https://docs.strapi.io/dev-docs/configurations/webhooks
- **Next.js Revalidation**: https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration
- **On-Demand Revalidation**: https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating

---

**Created**: October 8, 2025  
**Version**: 1.0  
**Status**: Production Ready ✅
