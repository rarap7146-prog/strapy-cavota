import type { Schema, Struct } from '@strapi/strapi';

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
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
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
      'sections.case-carousel': SectionsCaseCarousel;
      'sections.cta-strip': SectionsCtaStrip;
      'sections.faq': SectionsFaq;
      'sections.hero': SectionsHero;
      'sections.playbook': SectionsPlaybook;
      'sections.proof-bar': SectionsProofBar;
      'sections.rich-text': SectionsRichText;
      'sections.services-grid': SectionsServicesGrid;
      'shared.open-graph': SharedOpenGraph;
      'shared.seo': SharedSeo;
      'ui.faq-item': UiFaqItem;
      'ui.feature-item': UiFeatureItem;
      'ui.link-item': UiLinkItem;
      'ui.step-item': UiStepItem;
    }
  }
}
