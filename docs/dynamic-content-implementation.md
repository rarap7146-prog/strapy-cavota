# Dynamic Content Implementation Guide

## Overview
The dynamic-content component allows you to integrate global strings and site settings into your pages dynamically, avoiding hardcoded content and enabling easy multilingual management.

## Component Structure

### Fields
- `title`: Section title
- `template`: Template type (contact_info, form_section, company_info, custom)
- `content_template`: Markdown content with placeholder variables
- `show_contact_email`: Boolean to show/hide contact email from site settings
- `show_whatsapp`: Boolean to show/hide WhatsApp from site settings
- `show_socials`: Boolean to show/hide social media from site settings
- `custom_fields`: JSON object for additional global string field mappings

### Template Types
1. **contact_info**: For contact information sections
2. **form_section**: For forms with dynamic labels and messages
3. **company_info**: For company information
4. **custom**: For custom content with flexible field mapping

## API Endpoints

### Global Strings
```bash
GET /api/global-strings?locale=id
GET /api/global-strings?locale=en
```

**Available Fields:**
- Navigation: `nav_home`, `nav_work`, `nav_services`, `nav_insights`, `nav_about`, `nav_contact`, `nav_rfp`
- CTAs: `cta_primary`, `cta_secondary`
- Form Labels: `name_label`, `email_label`, `budget_label`, `submit_label`
- Messages: `success_msg`, `error_msg`

### Site Settings
```bash
GET /api/site-settings
```

**Available Fields:**
- `org_name`: Organization name
- `contact_email`: Contact email address
- `whatsapp`: WhatsApp number
- `available_locales`: Available language locales

## Implementation Examples

### 1. Contact Information Section

**Strapi Data:**
```json
{
  "__component": "sections.dynamic-content",
  "title": "Contact Information",
  "template": "contact_info",
  "show_contact_email": true,
  "show_whatsapp": true,
  "show_socials": true,
  "content_template": "# Contact Information\n\n**Email**: {{site_settings.contact_email}}\n**WhatsApp**: {{site_settings.whatsapp}}\n\n**Operating Hours:**\nMonday - Friday: 09:00 - 18:00 WIB"
}
```

**Frontend Implementation:**
```javascript
// Fetch data
const siteSettings = await fetch('/api/site-settings').then(r => r.json());
const globalStrings = await fetch(`/api/global-strings?locale=${locale}`).then(r => r.json());

// Process template
function processTemplate(template, data) {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    const keys = path.split('.');
    let value = data;
    for (const key of keys) {
      value = value[key];
    }
    return value || match;
  });
}

// Apply to content
const processedContent = processTemplate(section.content_template, {
  site_settings: siteSettings.data,
  global_strings: globalStrings.data
});
```

### 2. Form Section with Dynamic Labels

**Strapi Data:**
```json
{
  "__component": "sections.dynamic-content",
  "title": "Inquiry Form",
  "template": "form_section",
  "content_template": "# Inquiry Form\n\n**Labels:**\n- Name: {{global_strings.name_label}}\n- Email: {{global_strings.email_label}}",
  "custom_fields": {
    "form_labels": ["name_label", "email_label", "budget_label", "submit_label"],
    "messages": ["success_msg", "error_msg"]
  }
}
```

**Frontend Form Component:**
```javascript
// Extract form-specific data
const formLabels = {};
const messages = {};

if (section.custom_fields?.form_labels) {
  section.custom_fields.form_labels.forEach(field => {
    formLabels[field] = globalStrings.data[field];
  });
}

if (section.custom_fields?.messages) {
  section.custom_fields.messages.forEach(field => {
    messages[field] = globalStrings.data[field];
  });
}

// Use in form
<form>
  <label>{formLabels.name_label}</label>
  <input name="name" />
  
  <label>{formLabels.email_label}</label>
  <input name="email" />
  
  <button>{formLabels.submit_label}</button>
</form>
```

## React/Next.js Implementation

### Hook for Dynamic Content
```javascript
import { useState, useEffect } from 'react';

export const useDynamicContent = (locale = 'id') => {
  const [siteSettings, setSiteSettings] = useState(null);
  const [globalStrings, setGlobalStrings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, stringsRes] = await Promise.all([
          fetch('/api/site-settings'),
          fetch(`/api/global-strings?locale=${locale}`)
        ]);

        const settings = await settingsRes.json();
        const strings = await stringsRes.json();

        setSiteSettings(settings.data);
        setGlobalStrings(strings.data);
      } catch (error) {
        console.error('Failed to fetch dynamic content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  const processTemplate = (template) => {
    if (!siteSettings || !globalStrings) return template;

    return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const keys = path.split('.');
      const data = {
        site_settings: siteSettings,
        global_strings: globalStrings
      };

      let value = data;
      for (const key of keys) {
        value = value?.[key];
      }
      return value || match;
    });
  };

  return {
    siteSettings,
    globalStrings,
    loading,
    processTemplate
  };
};
```

### Dynamic Content Component
```javascript
import { useDynamicContent } from './hooks/useDynamicContent';
import { ReactMarkdown } from 'react-markdown';

export const DynamicContentSection = ({ section, locale }) => {
  const { siteSettings, globalStrings, loading, processTemplate } = useDynamicContent(locale);

  if (loading) return <div>Loading...</div>;

  const processedContent = processTemplate(section.content_template);

  return (
    <section className="dynamic-content">
      {section.title && <h2>{section.title}</h2>}
      
      <ReactMarkdown>{processedContent}</ReactMarkdown>
      
      {/* Conditional elements based on template flags */}
      {section.template === 'contact_info' && (
        <div className="contact-details">
          {section.show_contact_email && siteSettings?.contact_email && (
            <a href={`mailto:${siteSettings.contact_email}`}>
              {siteSettings.contact_email}
            </a>
          )}
          
          {section.show_whatsapp && siteSettings?.whatsapp && (
            <a href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`}>
              {siteSettings.whatsapp}
            </a>
          )}
        </div>
      )}
    </section>
  );
};
```

## Best Practices

### 1. Caching
- Cache global strings and site settings in localStorage or session storage
- Implement cache invalidation based on content updates
- Use SWR or React Query for automatic cache management

### 2. Error Handling
- Always provide fallback content for failed API calls
- Display placeholder values for missing template variables
- Log template processing errors for debugging

### 3. Performance
- Fetch global data once per session/page load
- Use template memoization for repeated processing
- Implement lazy loading for non-critical dynamic content

### 4. SEO Considerations
- Ensure dynamic content is rendered server-side for SEO
- Include processed content in meta tags when applicable
- Use structured data from dynamic content appropriately

## Contact Page Example

The contact page now uses two dynamic-content sections:

1. **Contact Information Section**: Displays email, WhatsApp, and operating hours using site settings
2. **Form Section**: Uses global strings for form labels, success/error messages

This approach eliminates hardcoded content and makes the contact page fully dynamic and multilingual.

## Troubleshooting

### Common Issues
1. **Template variables not replacing**: Check API data structure and variable path syntax
2. **403 Forbidden on APIs**: Verify API permissions are configured correctly
3. **Missing translations**: Ensure global strings exist for all locales
4. **Markdown not rendering**: Verify markdown processor is properly configured

### Debugging
```javascript
// Debug template processing
console.log('Template:', section.content_template);
console.log('Site Settings:', siteSettings);
console.log('Global Strings:', globalStrings);
console.log('Processed:', processTemplate(section.content_template));
```