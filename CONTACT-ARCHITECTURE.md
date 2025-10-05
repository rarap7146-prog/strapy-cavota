# Contact Page Architecture Documentation

## 📋 Page Structure

### Basic Information
- **Translation Key**: `page-contact`
- **Slugs**: `kontak` (ID) / `contact` (EN)
- **Page Type**: `contact`
- **Document ID**: `dpur1aj283dfyhxl6zjj8vpv`

## 🧩 Sections Architecture

### 1. Hero Section
```json
{
  "__component": "sections.hero",
  "eyebrow": "Hubungi Kami / Contact Us",
  "heading": "Mari membangun masa depan digital bersama / Let's build the digital future together",
  "subheading": "Idea collaboration message...",
  "buttons": [
    {
      "label": "Ajukan Pitch / Start a Pitch", 
      "url": "/id/rfp / /en/rfp",
      "isExternal": false
    }
  ]
}
```

### 2. Contact Information (Dynamic)
```json
{
  "__component": "sections.rich-text",
  "content": "Static content with placeholder contact info"
}
```

**Frontend Integration**:
```javascript
// Fetch from Site Settings API
const siteSettings = await fetch('/api/site-settings?locale=id');

// Map to contact section
const contactInfo = {
  email: siteSettings.contact_email,
  whatsapp: siteSettings.whatsapp_url, 
  socials: siteSettings.socials
};
```

### 3. Inquiry Form (Dynamic Labels)
```json
{
  "__component": "sections.rich-text",
  "content": "Documentation about form labels"
}
```

**Frontend Integration**:
```javascript
// Fetch form labels by locale
const strings = await fetch('/api/global-strings?locale=id');

// Map to form fields
const formLabels = {
  name: strings.name_label,
  email: strings.email_label,
  budget: strings.budget_label,
  submit: strings.submit_label,
  success: strings.success_msg,
  error: strings.error_msg
};
```

### 4. CTA Strip
```json
{
  "__component": "sections.cta-strip",
  "text": "Ingin berdiskusi langsung? / Prefer to talk directly?",
  "button": {
    "label": "Jadwalkan Konsultasi / Schedule a Call",
    "url": "/id/meeting / /en/meeting",
    "isExternal": false
  }
}
```

## 🔗 Dynamic Content Sources

### Site Settings Structure
```json
{
  "contact_email": "hello@cavota.id",
  "whatsapp": "+62 812-3456-7890",
  "whatsapp_url": "https://wa.me/6281234567890", 
  "socials": [
    {
      "platform": "LinkedIn",
      "username": "@cavota-agency",
      "url": "https://linkedin.com/company/cavota"
    }
  ]
}
```

### Global Strings Structure
```json
{
  "name_label": "Nama / Name",
  "email_label": "Email / Email",
  "budget_label": "Kisaran Anggaran / Budget Range",
  "submit_label": "Kirim / Submit",
  "success_msg": "Terima kasih! / Thanks!",
  "error_msg": "Gagal mengirim / Failed to send"
}
```

## 🎯 Frontend Implementation

### Contact Information Section
```javascript
// Replace static contact info with dynamic data
const ContactInfo = ({ locale }) => {
  const [siteSettings, setSiteSettings] = useState(null);
  
  useEffect(() => {
    fetch(`/api/site-settings?locale=${locale}`)
      .then(res => res.json())
      .then(data => setSiteSettings(data));
  }, [locale]);

  return (
    <div>
      <h2>Contact Information</h2>
      <p>Email: <a href={`mailto:${siteSettings?.contact_email}`}>
        {siteSettings?.contact_email}
      </a></p>
      <p>WhatsApp: <a href={siteSettings?.whatsapp_url}>
        {siteSettings?.whatsapp}
      </a></p>
      {siteSettings?.socials?.map(social => (
        <a key={social.platform} href={social.url}>
          {social.platform}: {social.username}
        </a>
      ))}
    </div>
  );
};
```

### Inquiry Form
```javascript
// Use dynamic labels from Global Strings
const InquiryForm = ({ locale }) => {
  const [strings, setStrings] = useState(null);
  
  useEffect(() => {
    fetch(`/api/global-strings?locale=${locale}`)
      .then(res => res.json())
      .then(data => setStrings(data));
  }, [locale]);

  return (
    <form>
      <label>{strings?.name_label}</label>
      <input placeholder={strings?.name_placeholder} />
      
      <label>{strings?.email_label}</label>
      <input placeholder={strings?.email_placeholder} />
      
      <label>{strings?.budget_label}</label>
      <select>
        {strings?.budget_options?.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      
      <button type="submit">{strings?.submit_label}</button>
    </form>
  );
};
```

## 🔍 SEO Implementation

### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "mainEntity": {
    "@type": "DigitalMarketingAgency",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "areaServed": "ID",
      "availableLanguage": ["Indonesian", "English"]
    }
  }
}
```

## 📊 Benefits of This Architecture

1. **Centralized Content Management**: Contact info managed in Site Settings
2. **Automatic Localization**: Form labels from Global Strings
3. **Easy Updates**: Admin can update contact info globally
4. **Consistent UX**: Same form labels across all contact forms
5. **SEO Optimized**: Proper structured data for contact pages

## 🚀 Usage

### Create Contact Page
```bash
export STRAPI_TOKEN=your_token
node scripts/seed-page.js data/page-contact.json
```

### Analyze Structure  
```bash
node scripts/analyze-contact.js
```

### Access URLs
- 🇮🇩 Indonesian: `/kontak`
- 🇺🇸 English: `/contact`