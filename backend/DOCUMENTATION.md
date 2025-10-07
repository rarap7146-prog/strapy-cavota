# Cavota Strapi Backend - Detailed Documentation

## Table of Contents

1. [Content Types](#content-types)
2. [Components Reference](#components-reference)
3. [API Collections](#api-collections)
4. [Admin Customizations](#admin-customizations)
5. [Database Schema](#database-schema)
6. [Best Practices](#best-practices)

---

## Content Types

### 1. Page (Collection Type)

**Purpose**: Dynamic page management for all website pages  
**Location**: `src/api/page/content-types/page/schema.json`  
**i18n**: Enabled (localized content)  
**SEO Plugin**: Enabled  
**Draft & Publish**: Yes

#### Attributes

| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `title` | string | Yes | Yes | Page title |
| `slug` | uid | Yes | Yes | URL-friendly identifier (auto-generated from title) |
| `translation_key` | uid | Yes | No | Links translations together (unique across all locales) |
| `page_type` | enumeration | Yes | No | Type of page: `home`, `services`, `about`, `contact`, `rfp`, `custom` |
| `seo` | component | No | Yes | SEO metadata (component: `shared.seo`) |
| `sections` | dynamiczone | No | Yes | Flexible page sections (see Dynamic Zones) |

#### Dynamic Zone Components

The `sections` field accepts these components:
- `sections.hero` - Hero section with CTA
- `sections.proof-bar` - Client logos showcase
- `sections.services-grid` - Service offerings grid
- `sections.case-carousel` - Portfolio carousel
- `sections.testimonial-carousel` - Client testimonials
- `sections.dynamic-content` - Custom content blocks
- `sections.playbook` - Step-by-step process
- `sections.cta-strip` - Call-to-action banner
- `sections.rich-text` - Rich text content
- `sections.faq` - Frequently asked questions
- `sections.metrics-grid` - Performance metrics

#### Usage Example

**API Request**:
```
GET /api/pages?filters[slug][$eq]=beranda&locale=id&populate[0]=sections&populate[1]=sections.items&populate[2]=sections.items.icon&populate[3]=sections.metrics&populate[4]=sections.buttons&populate[5]=sections.media&populate[6]=sections.steps&populate[7]=sections.testimonials&populate[8]=sections.media_web&populate[9]=sections.media_mobile&populate[10]=sections.logos&populate[11]=sections.button
```

**Why explicit population?**  
Dynamic zones in Strapi v5 only populate 1 level deep by default. Explicit population ensures all nested components and media are included.

---

### 2. Work (Collection Type)

**Purpose**: Portfolio case studies and work samples  
**Location**: `src/api/work/content-types/work/schema.json`  
**i18n**: Enabled  
**SEO Plugin**: Enabled  
**Draft & Publish**: Yes

#### Attributes

| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `title` | string | Yes | Yes | Work title |
| `slug` | uid | Yes | Yes | URL identifier |
| `translation_key` | string | Yes | No | Translation link |
| `summary` | text | No | Yes | Short description |
| `categories` | enumeration | No | No | Multiple: `ads`, `web`, `influencer`, `seo`, `apps`, `bot`, `mentorship` |
| `tags` | relation | No | No | Many-to-many with Tag collection |
| `industry` | string | No | No | Client industry |
| `objective` | text | No | No | Project objective |
| `scope` | component | No | No | Repeatable: `project.scope-item` |
| `timeframe` | component | No | No | Single: `project.timeframe` |
| `budget_band` | enumeration | No | No | `under_50m_idr`, `from_50m_200m_idr`, `from_200m_1b_idr`, `over_1b_idr`, `multi_million_usd` |
| `channels` | enumeration | No | No | Multiple: `google_ads`, `meta_ads`, `tiktok_ads`, `seo`, `android`, `telegram_bot`, `other` |
| `metrics` | component | No | No | Repeatable: `metrics.kpi` |
| `assets` | component | No | No | Repeatable: `media.asset` |
| `body` | richtext | No | Yes | Full case study content |
| `seo` | component | No | Yes | SEO metadata |
| `is_enterprise` | boolean | No | No | Enterprise client flag (default: false) |
| `related_cases` | relation | No | No | Many-to-many with Work (self-relation) |

#### Asset Management

Works can have multiple assets with different purposes:
- **feature_image**: Thumbnail for carousels (prioritized)
- **image**: Regular content images
- **video**: Video content

**Frontend Fallback Logic**:
1. Look for `kind: "feature_image"` first
2. Fall back to `kind: "image"`
3. Show placeholder if none

---

### 3. Testimonial (Collection Type)

**Purpose**: Client testimonials and case study quotes  
**Location**: `src/api/testimonial/content-types/testimonial/schema.json`  
**i18n**: Enabled (quote field only)  
**Draft & Publish**: Yes

#### Attributes

| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `quote` | text | Yes | Yes | Testimonial text |
| `name` | string | Yes | No | Client name |
| `title` | string | No | No | Client job title |
| `company` | string | No | No | Company name |
| `logo` | media | No | No | Company logo (images only) |
| `link` | string | No | No | Company website or LinkedIn |
| `related_case` | relation | No | No | Many-to-one with Work |

---

### 4. Site Settings (Single Type)

**Purpose**: Global site configuration and organization details  
**Location**: `src/api/site-settings/content-types/site-settings/schema.json`  
**i18n**: No (global across all locales)  
**Draft & Publish**: Yes

#### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `org_name` | string | Yes | Organization name |
| `logo` | media | No | Standard logo |
| `logo_2x` | media | No | High-res logo (2x) |
| `logo_dark` | media | No | Dark theme logo |
| `logo_dark_2x` | media | No | Dark theme logo (2x) |
| `contact_email` | email | No | Contact email |
| `contact_phone` | string | No | Phone number |
| `contact_address` | text | No | Physical address |
| `company_address` | text | No | Company registration address |
| `whatsapp` | string | No | WhatsApp number |
| `socials` | component | No | Repeatable: `ui.link-item` (social media links) |
| `available_locales` | enumeration | No | Multiple: `id`, `en` (default: both) |

**API Request**:
```
GET /api/site-settings?populate=*
```

---

### 5. Global Strings (Single Type)

**Purpose**: Navigation labels, CTAs, and UI strings  
**Location**: `src/api/global-strings/content-types/global-strings/schema.json`  
**i18n**: Enabled (all fields localized)  
**Draft & Publish**: Yes

#### Attributes Pattern

For each navigation item:
- `nav_[name]` (string) - Display label
- `nav_[name]_slug` (string) - URL slug

**Available Navigation Items**:
- `nav_home` / `nav_home_slug`
- `nav_work` / `nav_work_slug`
- `nav_services` / `nav_services_slug`
- `nav_insights` / `nav_insights_slug`
- `nav_about` / `nav_about_slug`
- `nav_contact` / `nav_contact_slug`

**CTA Buttons**:
- `cta_get_started`
- `cta_learn_more`
- `cta_view_work`
- `cta_get_in_touch`
- And many more...

**Footer Sections**:
- `footer_copyright`
- `footer_services_title`
- `footer_company_title`
- `footer_connect_title`

**API Request**:
```
GET /api/global-strings?locale=id
```

---

### 6. RFP Submission (Collection Type)

**Purpose**: Contact form submissions (Request for Proposal)  
**Location**: `src/api/rfp-submission/content-types/rfp-submission/schema.json`  
**i18n**: No  
**Draft & Publish**: No (immediate storage)  
**Security**: API token required (not publicly accessible)

#### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Submitter name |
| `email` | email | Yes | Contact email |
| `company` | string | No | Company name |
| `goals` | enumeration | No | Multiple: `awareness`, `leads`, `sales`, `app_installs`, `automation`, `other` |
| `scope` | enumeration | No | Multiple: `ads`, `web`, `influencer`, `seo`, `apps`, `bot`, `mentorship` |
| `budget_band` | enumeration | No | Same as Work budget bands |
| `timeline` | string | No | Project timeline |
| `message` | text | No | Additional message |
| `locale` | enumeration | Yes | Form language: `id` or `en` (default: `id`) |
| `source` | string | No | Form source/page |
| `status` | enumeration | Yes | `new`, `reviewed`, `contacted` (default: `new`) |

**Security Note**: Access controlled in `src/api/rfp-submission/controllers/rfp-submission.ts`

---

### 7. Tag (Collection Type)

**Purpose**: Content categorization and filtering  
**Location**: `src/api/tag/content-types/tag/schema.json`

#### Attributes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Tag name |
| `slug` | uid | Yes | URL-friendly identifier |
| `works` | relation | No | Many-to-many with Work |

---

### 8. Insight (Collection Type)

**Purpose**: Blog posts and insights (future feature)  
**Location**: `src/api/insight/content-types/insight/schema.json`  
**Status**: Prepared but not actively used

---

## Components Reference

### Section Components

#### 1. Hero (`sections.hero`)

**Purpose**: Primary hero section with CTA buttons  
**File**: `src/components/sections/hero.json`

**Attributes**:
| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `eyebrow` | string | No | Yes | Small text above heading |
| `heading` | string | Yes | Yes | Main headline |
| `subheading` | text | No | Yes | Supporting text |
| `buttons` | component | No | No | Repeatable: `ui.link-item` |
| `media_web` | media | No | No | Desktop/tablet image |
| `media_mobile` | media | No | No | Mobile-specific image |
| `style_variant` | enumeration | No | No | `default`, `image_right`, `image_left` |

**Frontend Behavior**:
- `media_web`: Shows on desktop (hidden on mobile)
- `media_mobile`: Shows on mobile (hidden on desktop)
- Falls back to `media_web` if `media_mobile` is missing

---

#### 2. Services Grid (`sections.services-grid`)

**Purpose**: Grid of service offerings  
**File**: `src/components/sections/services-grid.json`

**Attributes**:
| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `title` | string | Yes | Yes | Section title |
| `items` | component | No | No | Repeatable: `ui.feature-item` |

---

#### 3. Metrics Grid (`sections.metrics-grid`)

**Purpose**: Performance metrics showcase  
**File**: `src/components/sections/metrics-grid.json`

**Attributes**:
| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `title` | string | Yes | Yes | Section title |
| `subtitle` | text | No | Yes | Supporting text |
| `metrics` | component | No | No | Repeatable: `ui.metric-item` |
| `style_variant` | enumeration | No | No | `default`, `compact`, `highlighted` |

**Frontend Layout**:
- Mobile: 2 columns minimum
- Desktop: 2-4 columns (responsive)
- Text: Left-aligned (not centered)

---

#### 4. Case Carousel (`sections.case-carousel`)

**Purpose**: Portfolio work showcase  
**File**: `src/components/sections/case-carousel.json`

**Attributes**:
| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `title` | string | Yes | Yes | Section title |
| `layout` | enumeration | No | No | `cards`, `highlight` |

**Data Source**: Fetches from Work collection  
**API**: `GET /api/works?populate[assets][populate]=file`

**Frontend Logic**:
1. Filters works by published status
2. Looks for `feature_image` kind first
3. Falls back to regular `image` kind
4. Shows gradient background if no image

---

#### 5. Testimonial Carousel (`sections.testimonial-carousel`)

**Purpose**: Client testimonials showcase  
**File**: `src/components/sections/testimonial-carousel.json`

**Attributes**:
| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `title` | string | Yes | Yes | Section title |
| `subtitle` | text | No | Yes | Supporting text |
| `layout` | enumeration | No | No | `cards`, `highlight`, `compact` |
| `max_items` | integer | No | No | Max testimonials to show (3-12, default: 6) |

**Data Source**: Fetches from Testimonial collection  
**API**: `GET /api/testimonials`

---

#### 6. Proof Bar (`sections.proof-bar`)

**Purpose**: Client logos showcase (trust indicators)  
**File**: `src/components/sections/proof-bar.json`

**Attributes**:
| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `title` | string | No | Yes | Optional section title |
| `items` | component | No | No | Repeatable: `ui.proof-item` |
| `logos` | media | No | No | Multiple images (legacy field) |
| `note` | string | No | Yes | Optional note text |

**Note**: Can use either `items` (new) or `logos` (legacy) approach

---

#### 7. Playbook (`sections.playbook`)

**Purpose**: Step-by-step process/methodology  
**File**: `src/components/sections/playbook.json`

**Attributes**:
| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `title` | string | Yes | Yes | Section title |
| `steps` | component | No | No | Repeatable: `ui.step-item` |

---

#### 8. CTA Strip (`sections.cta-strip`)

**Purpose**: Call-to-action banner  
**File**: `src/components/sections/cta-strip.json`

**Attributes**:
| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `title` | string | No | Yes | Optional title |
| `subtitle` | string | No | Yes | Optional subtitle |
| `text` | string | Yes | Yes | Main CTA text |
| `button` | component | No | No | Single: `ui.link-item` |

---

#### 9. Rich Text (`sections.rich-text`)

**Purpose**: Free-form rich text content  
**File**: `src/components/sections/rich-text.json`

**Attributes**:
| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `content` | richtext | Yes | Yes | Rich text editor content |

**Supports**: Headings, paragraphs, lists, links, bold, italic, code blocks

---

#### 10. FAQ (`sections.faq`)

**Purpose**: Frequently asked questions  
**File**: `src/components/sections/faq.json`

**Attributes**:
| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `title` | string | Yes | Yes | Section title |
| `items` | component | No | No | Repeatable: `ui.faq-item` |

---

### UI Components

#### 1. Link Item (`ui.link-item`)

**Purpose**: Reusable link/button component  
**File**: `src/components/ui/link-item.json`

**Attributes**:
| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `label` | string | Yes | Yes | Button/link text |
| `url` | string | Yes | No | Destination URL |
| `isExternal` | boolean | No | No | Opens in new tab (default: false) |
| `icon` | enumeration | No | No | Icon name: `facebook`, `instagram`, `twitter`, `linkedin`, `youtube`, `tiktok`, `whatsapp`, `telegram`, `github`, `dribbble`, `behance`, `email`, `phone`, `website`, `other` |

**Usage**:
- Hero buttons
- CTA buttons
- Social media links
- Navigation links

---

#### 2. Feature Item (`ui.feature-item`)

**Purpose**: Service/feature card with icon  
**File**: `src/components/ui/feature-item.json`

**Attributes**:
| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `icon` | media | No | No | Feature icon (images only) |
| `title` | string | Yes | Yes | Feature title |
| `subtitle` | string | No | Yes | Optional subtitle |
| `description` | text | Yes | Yes | Feature description |
| `url` | string | No | Yes | Optional link |
| `badge` | string | No | Yes | Optional badge label |

**Usage**: Services grid items

---

#### 3. Metric Item (`ui.metric-item`)

**Purpose**: Individual performance metric  
**File**: `src/components/ui/metric-item.json`

**Attributes**:
| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `label` | string | Yes | Yes | Metric name |
| `value` | string | Yes | Yes | Metric value (e.g., "150%", "50K+") |
| `description` | text | No | Yes | Optional explanation |

**Usage**: Metrics grid section

---

#### 4. Step Item (`ui.step-item`)

**Purpose**: Process step in playbook  
**File**: `src/components/ui/step-item.json`

**Attributes**:
| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `title` | string | Yes | Yes | Step title |
| `description` | text | Yes | Yes | Step description |

**Frontend Rendering**: Automatically numbered (1, 2, 3...)

---

#### 5. FAQ Item (`ui.faq-item`)

**Purpose**: FAQ question and answer  
**File**: `src/components/ui/faq-item.json`

**Attributes**:
| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `question` | string | Yes | Yes | FAQ question |
| `answer` | richtext | Yes | Yes | Rich text answer |

**Frontend Behavior**: Accordion/collapsible UI

---

#### 6. Proof Item (`ui.proof-item`)

**Purpose**: Client logo group with note  
**File**: `src/components/ui/proof-item.json`

**Attributes**:
| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `note` | string | Yes | Yes | Description text |
| `logos` | media | No | No | Multiple logo images |

---

### Media Components

#### Asset (`media.asset`)

**Purpose**: Media file with metadata  
**File**: `src/components/media/asset.json`

**Attributes**:
| Field | Type | Required | Localized | Description |
|-------|------|----------|-----------|-------------|
| `kind` | enumeration | No | No | `feature_image`, `image`, `video` |
| `file` | media | Yes | No | Image or video file |
| `alt` | string | No | Yes | Alt text for images |
| `caption` | string | No | No | Optional caption |

**Kind Types**:
- **feature_image**: Thumbnail for work carousel (prioritized in frontend)
- **image**: Regular content image
- **video**: Video content

**Usage**: Work collection assets

---

### Project Components

#### 1. Scope Item (`project.scope-item`)

**Purpose**: Project scope description  
**File**: `src/components/project/scope-item.json`

**Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | string | No | Scope item label |
| `description` | string | No | Scope item description |

---

#### 2. Timeframe (`project.timeframe`)

**Purpose**: Project duration  
**File**: `src/components/project/timeframe.json`

**Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `start_date` | date | No | Project start date |
| `end_date` | date | No | Project end date |

---

### Metrics Components

#### KPI (`metrics.kpi`)

**Purpose**: Key Performance Indicator  
**File**: `src/components/metrics/kpi.json`

**Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | string | Yes | KPI name (e.g., "Conversion Rate") |
| `value_before` | decimal | No | Initial value |
| `value_after` | decimal | No | Final value |
| `unit` | string | No | Unit (e.g., "%", "K", "M") |
| `delta_auto` | boolean | No | Auto-calculate improvement (default: true) |

**Frontend Calculation**:
If `delta_auto` is true, frontend calculates percentage improvement:
```
improvement = ((value_after - value_before) / value_before) * 100
```

---

### Shared Components

#### 1. SEO (`shared.seo`)

**Purpose**: SEO metadata for pages  
**File**: `src/components/shared/seo.json`

**Attributes**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `metaTitle` | string | Yes | Max 60 chars | Page title |
| `metaDescription` | string | Yes | 50-160 chars | Meta description |
| `metaImage` | media | No | Images only | OG image |
| `openGraph` | component | No | Single | `shared.open-graph` component |
| `keywords` | text | No | - | SEO keywords |
| `metaRobots` | string | No | - | Robots directive |
| `metaViewport` | string | No | - | Viewport meta |
| `canonicalURL` | string | No | - | Canonical URL |
| `structuredData` | json | No | - | JSON-LD structured data |

---

#### 2. Open Graph (`shared.open-graph`)

**Purpose**: Social media preview data  
**File**: `src/components/shared/open-graph.json`

**Attributes**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ogTitle` | string | No | OG title (fallback to metaTitle) |
| `ogDescription` | string | No | OG description |
| `ogImage` | media | No | OG image |
| `ogType` | string | No | OG type (website, article, etc.) |

---

## Admin Customizations

### Export Page Button

**Location**: `src/admin/app.ts`  
**Purpose**: Export page data as JSON for backup/migration

**Features**:
1. **Automatic Injection**: Button appears below Save button on Page edit screen
2. **Deep Population**: Exports complete page with all nested components
3. **File Download**: Downloads as `page-{id}-export.json`
4. **Status Feedback**: Shows loading and success states

**Implementation Details**:

```typescript
// Button placement logic
1. Searches for Save/Publish button in DOM
2. Creates export button container
3. Appends below Save button
4. Retries multiple times to ensure button appears

// Export functionality
1. Extracts page ID from URL
2. Fetches: GET /api/pages/{id}?populate=deep
3. Converts to JSON blob
4. Triggers browser download
5. Shows success message for 2 seconds
```

**CSS Styling**:
- Primary color: `#4945ff` (Strapi blue)
- Hover: `#3730a3` (darker blue)
- Full width button
- Disabled state during export

**Navigation Handling**:
- Uses MutationObserver to detect page changes
- Removes old button
- Re-injects on new page load
- Works across admin navigation

---

## Database Schema

### Collections

#### Pages Table (`pages`)
- Primary key: `id`
- Unique: `translation_key`
- Indexes: `slug`, `page_type`, `locale`
- Relations: None (uses dynamic zone components)

#### Works Table (`works`)
- Primary key: `id`
- Unique: None (slug not unique across locales)
- Indexes: `slug`, `locale`
- Relations:
  - Many-to-many: `tags`
  - Many-to-many: `related_cases` (self)

#### Testimonials Table (`testimonials`)
- Primary key: `id`
- Relations:
  - Many-to-one: `work` (related_case)

#### Tags Table (`tags`)
- Primary key: `id`
- Unique: `slug`
- Relations:
  - Many-to-many: `works`

#### RFP Submissions Table (`rfp_submissions`)
- Primary key: `id`
- No relations
- Indexed: `status`, `locale`, `created_at`

### Component Storage

All components are stored in separate tables:
- `components_sections_heroes`
- `components_sections_services_grids`
- `components_ui_feature_items`
- `components_ui_metric_items`
- etc.

Connected via polymorphic relations in Strapi.

---

## Best Practices

### 1. Content Creation

#### Pages
1. **Always set translation_key**: Links translations together
2. **Use consistent slugs**: Keep URL structure predictable
3. **Optimize SEO**: Fill all SEO fields completely
4. **Test both locales**: Verify content in id and en

#### Works
1. **Add feature_image**: First asset with `kind: "feature_image"`
2. **Use multiple images**: Show project context
3. **Include metrics**: Demonstrate results
4. **Link related cases**: Cross-promote similar work

#### Testimonials
1. **Keep quotes concise**: 2-3 sentences ideal
2. **Include attribution**: Name, title, company
3. **Add logo**: Increases credibility
4. **Link to work**: Connect testimonial to case study

### 2. Media Management

#### Images
- **Max upload size**: 10MB (configurable)
- **Recommended formats**: WebP, PNG, JPG
- **Naming convention**: descriptive-filename.webp
- **Alt text**: Always add for accessibility

#### Organization
- Use folders: `uploads/logos/`, `uploads/work/`, etc.
- Delete unused media regularly
- Compress images before upload

### 3. API Usage

#### Population
- **Explicit for dynamic zones**: List all nested fields
- **Use `populate=deep`**: For quick testing
- **Cache responses**: On frontend for performance

#### Filtering
```javascript
// Good: Specific filter
?filters[slug][$eq]=home&locale=id

// Bad: Fetch all then filter in frontend
?pagination[pageSize]=100
```

### 4. Security

#### API Tokens
- **Never expose**: Keep tokens server-side only
- **Use read-only**: Unless write access needed
- **Rotate regularly**: Change tokens periodically

#### RFP Submissions
- **Token-only access**: Never public API
- **Validate input**: Sanitize form data
- **Monitor submissions**: Check for spam/abuse

### 5. Performance

#### Database
- **Index frequently queried fields**: slug, locale, status
- **Limit pagination**: Don't fetch 1000+ records
- **Use lean queries**: Only populate what you need

#### Admin Panel
- **Regular builds**: Run `npm run build` after changes
- **Clear browser cache**: After admin customizations
- **Monitor bundle size**: Keep admin panel fast

### 6. Internationalization

#### Translation Workflow
1. Create content in primary locale (id)
2. Save and publish
3. Switch to alternate locale (en)
4. Add translations
5. Use same `translation_key` for linking

#### Shared vs Localized
- **Localized**: User-facing text (titles, descriptions)
- **Shared**: Technical fields (IDs, slugs, dates)

### 7. Backups

#### Regular Backups
- **Export pages**: Use Export Page button weekly
- **Database dumps**: MySQL backup daily
- **Media backup**: Sync `public/uploads/` to S3/backup

#### Version Control
- **Commit schema changes**: API & component JSON files
- **Don't commit**: `.env`, `node_modules/`, `dist/`
- **Tag releases**: Git tags for major content updates

---

## Troubleshooting Guide

### 1. Content Not Appearing

**Symptom**: New content doesn't show on frontend

**Solutions**:
1. Check if content is **Published** (not Draft)
2. Verify correct **locale** is selected
3. Check **API populate** syntax
4. Clear frontend cache/revalidate
5. Check Strapi logs: `backend/strapi.log`

---

### 2. Images Not Loading

**Symptom**: Images broken or 404

**Solutions**:
1. Check file uploaded to `public/uploads/`
2. Verify file permissions (readable by web server)
3. Check image URL format:
   ```
   http://localhost:1337/uploads/filename.png
   ```
4. Populate media fields in API request:
   ```
   ?populate[sections][populate][media]=*
   ```

---

### 3. Nested Components Not Populating

**Symptom**: API returns empty objects for nested components

**Solutions**:
1. **Dynamic zones require explicit population**:
   ```
   populate[0]=sections
   populate[1]=sections.items
   populate[2]=sections.items.icon
   ```
2. Or use populate-deep:
   ```
   ?populate=deep
   ```
3. Check component nesting depth (max 5 levels with populate-deep)

---

### 4. Export Button Not Appearing

**Symptom**: Export Page button missing in admin

**Solutions**:
1. Rebuild admin panel: `npm run build`
2. Hard refresh browser: Ctrl+Shift+R
3. Check browser console for errors
4. Verify you're on a Page edit screen (not list view)
5. Check `src/admin/app.ts` is correctly configured

---

### 5. API Returns 500 Error

**Symptom**: API request returns internal server error

**Solutions**:
1. Check Strapi logs: `backend/strapi.log`
2. Common cause: Invalid population syntax for dynamic zones
3. Simplify query and add population gradually
4. Restart Strapi: `npm run develop`

---

### 6. Translation Key Conflicts

**Symptom**: "Duplicate translation_key" error

**Solutions**:
1. `translation_key` must be unique across ALL locales
2. Use format: `page-home`, `work-case-1`, etc.
3. If conflict, change key and re-save all locales

---

### 7. RFP Submissions Not Saving

**Symptom**: Form submissions not appearing in admin

**Solutions**:
1. Check API token is valid
2. Verify endpoint: `POST /api/rfp-submissions`
3. Check request headers:
   ```
   Authorization: Bearer {token}
   Content-Type: application/json
   ```
4. Review access permissions in controller

---

## Maintenance Tasks

### Daily
- [ ] Monitor error logs
- [ ] Check RFP submissions
- [ ] Verify site is loading

### Weekly
- [ ] Export pages (backup)
- [ ] Review media library (delete unused)
- [ ] Check for Strapi updates

### Monthly
- [ ] Database backup
- [ ] Rotate API tokens
- [ ] Review and clean draft content
- [ ] Performance audit

---

## Additional Resources

- **Strapi Documentation**: https://docs.strapi.io
- **Strapi v5 Release**: https://strapi.io/v5
- **API Reference**: http://localhost:1337/documentation (when enabled)
- **Community**: https://discord.strapi.io

---

**Document Version**: 1.0  
**Last Updated**: October 2025  
**Strapi Version**: 5.25.0
