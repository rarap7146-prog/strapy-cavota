'use client';

import { useState, useEffect } from 'react';

interface SiteSettings {
  org_name: string;
  contact_email: string;
  whatsapp: string;
  contact_phone: string;
  contact_address: string;
  available_locales: string;
}

interface GlobalStrings {
  nav_home: string;
  nav_work: string;
  nav_services: string;
  nav_insights: string;
  nav_about: string;
  nav_contact: string;
  nav_rfp: string;
  cta_primary: string;
  cta_secondary: string;
  name_label: string;
  email_label: string;
  budget_label: string;
  submit_label: string;
  success_msg: string;
  error_msg: string;
  [key: string]: any;
}

export const useDynamicContent = (locale: 'id' | 'en' = 'id') => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [globalStrings, setGlobalStrings] = useState<GlobalStrings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [settingsRes, stringsRes] = await Promise.all([
          fetch('/api/proxy/site-settings'),
          fetch(`/api/proxy/global-strings?locale=${locale}`)
        ]);

        if (!settingsRes.ok || !stringsRes.ok) {
          throw new Error('Failed to fetch dynamic content data');
        }

        const settingsData = await settingsRes.json();
        const stringsData = await stringsRes.json();

        setSiteSettings(settingsData.data);
        setGlobalStrings(stringsData.data);
      } catch (err) {
        console.error('Failed to fetch dynamic content:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  const processTemplate = (template: string): string => {
    if (!siteSettings || !globalStrings || !template) return template;

    return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const keys = path.trim().split('.');
      const data = {
        site_settings: siteSettings,
        global_strings: globalStrings
      };

      let value: any = data;
      for (const key of keys) {
        value = value?.[key];
      }
      
      return value !== undefined && value !== null ? String(value) : match;
    });
  };

  return {
    siteSettings,
    globalStrings,
    loading,
    error,
    processTemplate
  };
};