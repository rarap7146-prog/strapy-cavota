import type { Schema, Struct } from '@strapi/strapi';

export interface MediaAsset extends Struct.ComponentSchema {
  collectionName: 'components_media_assets';
  info: {
    description: 'Media asset with metadata';
    displayName: 'Asset';
  };
  attributes: {
    alt: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    caption: Schema.Attribute.String;
    file: Schema.Attribute.Media<'images' | 'videos'> &
      Schema.Attribute.Required;
    kind: Schema.Attribute.Enumeration<['image', 'video']>;
  };
}

export interface MetricsKpi extends Struct.ComponentSchema {
  collectionName: 'components_metrics_kpis';
  info: {
    description: 'Key Performance Indicator metric';
    displayName: 'KPI';
  };
  attributes: {
    delta_auto: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    unit: Schema.Attribute.String;
    value_after: Schema.Attribute.Decimal;
    value_before: Schema.Attribute.Decimal;
  };
}

export interface ProjectScopeItem extends Struct.ComponentSchema {
  collectionName: 'components_project_scope_items';
  info: {
    description: 'Project scope item';
    displayName: 'Scope Item';
  };
  attributes: {
    description: Schema.Attribute.String;
    label: Schema.Attribute.String;
  };
}

export interface ProjectTimeframe extends Struct.ComponentSchema {
  collectionName: 'components_project_timeframes';
  info: {
    description: 'Project timeframe with start and end dates';
    displayName: 'Timeframe';
  };
  attributes: {
    end_date: Schema.Attribute.Date;
    start_date: Schema.Attribute.Date;
  };
}

export interface SectionsCapabilitiesGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_capabilities_grids';
  info: {
    description: 'Grid of capabilities or features with detailed descriptions';
    displayName: 'Capabilities Grid';
  };
  attributes: {
    items: Schema.Attribute.Component<'ui.feature-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsCaseCarousel extends Struct.ComponentSchema {
  collectionName: 'components_sections_case_carousels';
  info: {
    description: 'Case carousel with title and layout options';
    displayName: 'Case Carousel';
  };
  attributes: {
    layout: Schema.Attribute.Enumeration<['cards', 'highlight']> &
      Schema.Attribute.DefaultTo<'cards'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsCtaStrip extends Struct.ComponentSchema {
  collectionName: 'components_sections_cta_strips';
  info: {
    description: 'CTA strip with text and button';
    displayName: 'CTA Strip';
  };
  attributes: {
    button: Schema.Attribute.Component<'ui.link-item', false>;
    text: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsDynamicContent extends Struct.ComponentSchema {
  collectionName: 'components_sections_dynamic_contents';
  info: {
    description: 'Section that displays dynamic content from global strings and site settings';
    displayName: 'Dynamic Content';
  };
  attributes: {
    content_template: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    custom_fields: Schema.Attribute.JSON;
    show_contact_email: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    show_socials: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    show_whatsapp: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    template: Schema.Attribute.Enumeration<
      ['contact_info', 'form_section', 'company_info', 'custom']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'custom'>;
    title: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsFaq extends Struct.ComponentSchema {
  collectionName: 'components_sections_faqs';
  info: {
    description: 'FAQ section with title and FAQ items';
    displayName: 'FAQ';
  };
  attributes: {
    items: Schema.Attribute.Component<'ui.faq-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heroes';
  info: {
    description: 'Hero section with eyebrow, heading, subheading, buttons and media';
    displayName: 'Hero';
  };
  attributes: {
    buttons: Schema.Attribute.Component<'ui.link-item', true>;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    media: Schema.Attribute.Media<'images' | 'videos'>;
    style_variant: Schema.Attribute.Enumeration<
      ['default', 'image_right', 'image_left']
    > &
      Schema.Attribute.DefaultTo<'default'>;
    subheading: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsMetricsGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_metrics_grids';
  info: {
    description: 'Grid of performance metrics for showcasing results';
    displayName: 'Metrics Grid';
  };
  attributes: {
    metrics: Schema.Attribute.Component<'metrics.kpi', true>;
    style_variant: Schema.Attribute.Enumeration<
      ['default', 'compact', 'highlighted']
    > &
      Schema.Attribute.DefaultTo<'default'>;
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsMetricsShowcase extends Struct.ComponentSchema {
  collectionName: 'components_sections_metrics_showcases';
  info: {
    description: 'Display key performance metrics and results';
    displayName: 'Metrics Showcase';
  };
  attributes: {
    metrics: Schema.Attribute.Component<'ui.metric-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsPlaybook extends Struct.ComponentSchema {
  collectionName: 'components_sections_playbooks';
  info: {
    description: 'Playbook section with title and step items';
    displayName: 'Playbook';
  };
  attributes: {
    steps: Schema.Attribute.Component<'ui.step-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsProofBar extends Struct.ComponentSchema {
  collectionName: 'components_sections_proof_bars';
  info: {
    description: 'Proof bar with logos and optional note';
    displayName: 'Proof Bar';
  };
  attributes: {
    logos: Schema.Attribute.Media<'images', true>;
    note: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsRichText extends Struct.ComponentSchema {
  collectionName: 'components_sections_rich_texts';
  info: {
    description: 'Rich text content section';
    displayName: 'Rich Text';
  };
  attributes: {
    content: Schema.Attribute.RichText &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsServicesGrid extends Struct.ComponentSchema {
  collectionName: 'components_sections_services_grids';
  info: {
    description: 'Services grid with title and feature items';
    displayName: 'Services Grid';
  };
  attributes: {
    items: Schema.Attribute.Component<'ui.feature-item', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SectionsTestimonialCarousel extends Struct.ComponentSchema {
  collectionName: 'components_sections_testimonial_carousels';
  info: {
    description: 'Testimonial carousel with title and layout options';
    displayName: 'Testimonial Carousel';
  };
  attributes: {
    layout: Schema.Attribute.Enumeration<['cards', 'highlight', 'compact']> &
      Schema.Attribute.DefaultTo<'cards'>;
    max_items: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
          min: 3;
        },
        number
      > &
      Schema.Attribute.DefaultTo<6>;
    subtitle: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface SharedOpenGraph extends Struct.ComponentSchema {
  collectionName: 'components_shared_open_graphs';
  info: {
    displayName: 'openGraph';
    icon: 'project-diagram';
  };
  attributes: {
    ogDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
    ogImage: Schema.Attribute.Media<'images'>;
    ogTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    ogType: Schema.Attribute.String;
    ogUrl: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    keywords: Schema.Attribute.Text;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
        minLength: 50;
      }>;
    metaImage: Schema.Attribute.Media<'images'>;
    metaRobots: Schema.Attribute.String;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaViewport: Schema.Attribute.String;
    openGraph: Schema.Attribute.Component<'shared.open-graph', false>;
    structuredData: Schema.Attribute.JSON;
  };
}

export interface UiFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_ui_faq_items';
  info: {
    description: 'FAQ item with question and rich text answer';
    displayName: 'FAQ Item';
  };
  attributes: {
    answer: Schema.Attribute.RichText &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    question: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface UiFeatureItem extends Struct.ComponentSchema {
  collectionName: 'components_ui_feature_items';
  info: {
    description: 'Feature item with icon, title and description';
    displayName: 'Feature Item';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    icon: Schema.Attribute.Media<'images'>;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    subtitle: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    url: Schema.Attribute.String &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface UiLinkItem extends Struct.ComponentSchema {
  collectionName: 'components_ui_link_items';
  info: {
    description: 'Reusable link component with label and URL';
    displayName: 'Link Item';
  };
  attributes: {
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface UiMetricItem extends Struct.ComponentSchema {
  collectionName: 'components_ui_metric_items';
  info: {
    description: 'Individual metric display item';
    displayName: 'Metric Item';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    value: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

export interface UiStepItem extends Struct.ComponentSchema {
  collectionName: 'components_ui_step_items';
  info: {
    description: 'Step item with title and description for process flows';
    displayName: 'Step Item';
  };
  attributes: {
    description: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'media.asset': MediaAsset;
      'metrics.kpi': MetricsKpi;
      'project.scope-item': ProjectScopeItem;
      'project.timeframe': ProjectTimeframe;
      'sections.capabilities-grid': SectionsCapabilitiesGrid;
      'sections.case-carousel': SectionsCaseCarousel;
      'sections.cta-strip': SectionsCtaStrip;
      'sections.dynamic-content': SectionsDynamicContent;
      'sections.faq': SectionsFaq;
      'sections.hero': SectionsHero;
      'sections.metrics-grid': SectionsMetricsGrid;
      'sections.metrics-showcase': SectionsMetricsShowcase;
      'sections.playbook': SectionsPlaybook;
      'sections.proof-bar': SectionsProofBar;
      'sections.rich-text': SectionsRichText;
      'sections.services-grid': SectionsServicesGrid;
      'sections.testimonial-carousel': SectionsTestimonialCarousel;
      'shared.open-graph': SharedOpenGraph;
      'shared.seo': SharedSeo;
      'ui.faq-item': UiFaqItem;
      'ui.feature-item': UiFeatureItem;
      'ui.link-item': UiLinkItem;
      'ui.metric-item': UiMetricItem;
      'ui.step-item': UiStepItem;
    }
  }
}
