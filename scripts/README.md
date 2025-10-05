# Strapi v5 Work Entry Seeder

This script creates idempotent work entries in Strapi v5 with proper localization support. Each work entry will have both Indonesian (default) and English localizations sharing the same `documentId`.

## Features

- ✅ **Single Document**: Creates ONE document with TWO localizations (same `documentId`)
- ✅ **Idempotent**: Safe to run multiple times without creating duplicates
- ✅ **JSON-driven**: Configure data via JSON files instead of hardcoded values
- ✅ **Tag Management**: Automatically creates tags if they don't exist
- ✅ **Full Localization**: Both locales are properly linked and published

## Usage

### Basic Usage
```bash
# Load environment variables and run with default JSON file
export $(cat .env | grep -v '^#' | xargs)
node scripts/seed-work-enterprise.js
```

### Custom JSON File
```bash
# Run with a specific JSON file
export $(cat .env | grep -v '^#' | xargs)
node scripts/seed-work-enterprise.js data/my-custom-work.json
```

## JSON Format

The JSON file must follow this structure:

### Required Fields
```json
{
  "translation_key": "unique-key-for-this-work",
  "tags": ["tag1", "tag2"],
  "locales": {
    "id": {
      "title": "Indonesian Title",
      "slug": "indonesian-slug",
      "summary": "Indonesian summary",
      "body": "Indonesian content"
    },
    "en": {
      "title": "English Title", 
      "slug": "english-slug",
      "summary": "English summary",
      "body": "English content"
    }
  }
}
```

### Optional Fields

You can include these optional fields in each locale:

| Field | Type | Valid Values | Description |
|-------|------|--------------|-------------|
| `categories` | string | `ads`, `web`, `influencer`, `seo`, `apps`, `bot`, `mentorship` | Work category |
| `channels` | string | `google_ads`, `meta_ads`, `tiktok_ads`, `seo`, `android`, `telegram_bot`, `other` | Marketing channel |
| `budget_band` | string | `under_100_usd`, `100_1k_usd`, `1k_10k_usd`, `10k_100k_usd`, `100k_1m_usd`, `multi_million_usd` | Budget range |
| `industry` | string | Any string | Industry/sector |
| `objective` | string | Any string | Campaign objective |
| `is_enterprise` | boolean | `true`/`false` | Enterprise client flag |
| `metrics` | array | Array of metric objects | Performance metrics |

### Metrics Format
```json
"metrics": [
  {
    "label": "ROAS",
    "value_before": 1.6,
    "value_after": 2.4,
    "unit": "x"
  },
  {
    "label": "CPA",
    "value_before": 1.0,
    "value_after": 0.82,
    "unit": "index"
  }
]
```

## Files

- `scripts/seed-work-enterprise.js` - Main seeder script
- `data/work-enterprise.json` - Sample work entry data
- `data/work-template.json` - Template showing all available fields

## Environment Variables

Make sure these are set in your `.env` file:

```bash
STRAPI_URL=https://cavota.id
STRAPI_TOKEN=your_full_access_token_here
```

## Verification

After running the script, verify the results:

1. **Check both locales exist:**
   ```bash
   curl -H "Authorization: Bearer $STRAPI_TOKEN" \
     "https://cavota.id/api/works?filters[translation_key][\$eq]=your-translation-key&locale=id"
   
   curl -H "Authorization: Bearer $STRAPI_TOKEN" \
     "https://cavota.id/api/works?filters[translation_key][\$eq]=your-translation-key&locale=en"
   ```

2. **Check localization linking:**
   ```bash
   curl -H "Authorization: Bearer $STRAPI_TOKEN" \
     "https://cavota.id/api/works/DOCUMENT_ID?populate=localizations"
   ```

3. **Admin UI**: In Strapi admin, the work collection should show one row with "Available in: English (en), Indonesian (id)"

## Permissions

Your API token needs these permissions:
- **Work**: Create, Read, Update, Publish
- **Tag**: Create, Read, Update, Publish  
- **i18n**: Localization permissions enabled

## Troubleshooting

- **401/403 errors**: Check API token permissions
- **ValidationError**: Verify field values match allowed enum values
- **Different documentIds**: This shouldn't happen with the current implementation, contact support

## Examples

See the provided JSON files:
- `data/work-enterprise.json` - Working example
- `data/work-template.json` - Template with all fields and comments