'use client';

import { useDynamicContent } from '@/hooks/useDynamicContent';
import ReactMarkdown from 'react-markdown';
import { useState, FormEvent } from 'react';

interface DynamicContentSectionProps {
  data: {
    id: number
    title: string
    template: string
    content_template: string
    show_contact_email?: boolean
    show_whatsapp?: boolean
    show_socials?: boolean
    custom_fields?: any
  }
  locale: 'id' | 'en'
}

export function DynamicContentSection({ data, locale }: DynamicContentSectionProps) {
  const { siteSettings, globalStrings, loading, error, processTemplate } = useDynamicContent(locale);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget_band: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/next-api/rfp-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          locale
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitMessage({
          type: 'success',
          text: result.message || (locale === 'id' ? 'Pesan berhasil dikirim!' : 'Message sent successfully!')
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          budget_band: '',
          message: ''
        });
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setSubmitMessage({
        type: 'error',
        text: locale === 'id' 
          ? 'Gagal mengirim pesan. Silakan coba lagi.' 
          : 'Failed to send message. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="container-fluid py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container-fluid py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">{data.title}</h2>
          <div className="text-muted-foreground">
            {locale === 'id' ? 'Gagal memuat konten dinamis.' : 'Failed to load dynamic content.'}
          </div>
        </div>
      </section>
    );
  }

  // Process the content template
  const processedContent = processTemplate(data.content_template);

  // Handle contact_info template
  if (data.template === 'contact_info') {
    return (
      <section className="container-fluid py-16">
        <div className="max-w-4xl mx-auto">
          {data.title && (
            <h2 className="text-3xl font-bold text-center mb-12">{data.title}</h2>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="prose prose-lg dark:prose-invert">
                <ReactMarkdown>{processedContent}</ReactMarkdown>
              </div>
            </div>
            
            <div className="space-y-6">
              {data.show_contact_email && siteSettings?.contact_email && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-gradient rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <a 
                      href={`mailto:${siteSettings.contact_email}`} 
                      className="text-brand-blue hover:text-brand-purple transition-colors"
                    >
                      {siteSettings.contact_email}
                    </a>
                  </div>
                </div>
              )}
              
              {data.show_whatsapp && siteSettings?.whatsapp && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-brand-gradient rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <a 
                      href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`}
                      className="text-brand-blue hover:text-brand-purple transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {siteSettings.whatsapp}
                    </a>
                  </div>
                </div>
              )}
              
              {siteSettings?.contact_address && (
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-brand-gradient rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">{locale === 'id' ? 'Alamat' : 'Address'}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {siteSettings.contact_address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Handle form_section template
  if (data.template === 'form_section') {
    return (
      <section className="container-fluid py-16 bg-muted/30">
        <div className="max-w-2xl mx-auto">
          {data.title && (
            <h2 className="text-3xl font-bold text-center mb-8">{data.title}</h2>
          )}
          
          <div className="prose prose-lg dark:prose-invert mb-8">
            <ReactMarkdown>{processedContent}</ReactMarkdown>
          </div>
          
          {submitMessage && (
            <div className={`mb-6 p-4 rounded-lg ${
              submitMessage.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {submitMessage.text}
            </div>
          )}
          
          <form onSubmit={handleFormSubmit} className="space-y-6 bg-card p-8 rounded-lg border">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                {globalStrings?.name_label || (locale === 'id' ? 'Nama' : 'Name')}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
                disabled={submitting}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {globalStrings?.email_label || 'Email'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
                disabled={submitting}
              />
            </div>
            
            <div>
              <label htmlFor="budget_band" className="block text-sm font-medium mb-2">
                {globalStrings?.budget_label || (locale === 'id' ? 'Anggaran' : 'Budget')}
              </label>
              <select 
                id="budget_band"
                name="budget_band"
                value={formData.budget_band}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={submitting}
              >
                <option value="">
                  {locale === 'id' ? 'Pilih anggaran' : 'Select budget'}
                </option>
                <option value="under_50m_idr">
                  {locale === 'id' ? '< 50 Juta' : '< 50 Million IDR'}
                </option>
                <option value="from_50m_200m_idr">
                  {locale === 'id' ? '50 Juta - 200 Juta' : '50M - 200M IDR'}
                </option>
                <option value="from_200m_1b_idr">
                  {locale === 'id' ? '200 Juta - 1 Miliar' : '200M - 1B IDR'}
                </option>
                <option value="over_1b_idr">
                  {locale === 'id' ? '> 1 Miliar' : '> 1 Billion IDR'}
                </option>
                <option value="multi_million_usd">
                  {locale === 'id' ? 'Multi Juta USD' : 'Multi-Million USD'}
                </option>
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                {locale === 'id' ? 'Pesan' : 'Message'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                rows={4}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
                disabled={submitting}
              />
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-gradient text-white py-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting 
                ? (locale === 'id' ? 'Mengirim...' : 'Sending...') 
                : (globalStrings?.submit_label || (locale === 'id' ? 'Kirim Pesan' : 'Send Message'))
              }
            </button>
          </form>
        </div>
      </section>
    );
  }

  // Default template - just render the processed content
  return (
    <section className="container-fluid py-16">
      <div className="max-w-4xl mx-auto text-center">
        {data.title && (
          <h2 className="text-3xl font-bold mb-8">{data.title}</h2>
        )}
        <div className="prose prose-lg max-w-none dark:prose-invert mx-auto">
          <ReactMarkdown>{processedContent}</ReactMarkdown>
        </div>
      </div>
    </section>
  );
}