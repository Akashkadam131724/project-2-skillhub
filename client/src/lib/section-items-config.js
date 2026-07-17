/**
 * Which mapping `items[]` fields each section’s UI uses — drives the CMS form.
 * Sections omitted here do not use items (e.g. overview uses data.body instead).
 */

export const SECTION_ITEMS_CONFIG = {
  text_media: {
    label: "Text + media rows",
    actionLabel: "rows",
    fields: ["image_url", "title", "body", "value"],
    fieldLabels: {
      image_url: "Media image",
      title: "Headline",
      body: "Body (rich text — add links here)",
      value: "Media side (start or end)",
    },
    preview: "text_media",
  },
  faq: {
    label: "FAQ",
    actionLabel: "FAQ",
    fields: ["title", "body", "buttons"],
    fieldLabels: { title: "Question", body: "Answer" },
    preview: "faq",
  },
  key_benefits: {
    label: "Benefit cards",
    actionLabel: "benefits",
    fields: ["image_url", "title", "body", "buttons"],
    fieldLabels: {
      image_url: "Card image",
      title: "Benefit",
      body: "Description",
    },
    preview: "benefit",
  },
  team: {
    label: "Team members",
    actionLabel: "members",
    fields: ["image_url", "title", "subtitle", "body"],
    fieldLabels: {
      image_url: "Photo",
      title: "Name",
      subtitle: "Role / title",
      body: "Short bio",
    },
    preview: "benefit",
  },
  feature_spotlight: {
    label: "Spotlight cards",
    actionLabel: "spotlights",
    fields: ["image_url", "value", "title", "subtitle", "body"],
    fieldLabels: {
      image_url: "Background image",
      value: "Metric / eyebrow",
      title: "Title",
      subtitle: "Subtitle",
      body: "Description",
    },
    preview: "benefit",
  },
  process_steps: {
    label: "Process steps",
    actionLabel: "steps",
    fields: ["title", "subtitle", "body"],
    fieldLabels: {
      title: "Step title",
      subtitle: "Short label",
      body: "Description",
    },
    preview: "benefit",
  },
  contact_us: {
    label: "Contact channels",
    actionLabel: "channels",
    fields: ["icon", "title", "subtitle", "body", "href"],
    fieldLabels: {
      icon: "Type (email / phone / location)",
      title: "Label",
      subtitle: "Value (email, phone, address)",
      body: "Note (optional)",
      href: "Link (mailto:, tel:, maps…)",
    },
    preview: "benefit",
  },
  contact_form: {
    label: "Contact channels",
    actionLabel: "channels",
    fields: ["icon", "title", "subtitle", "body", "href"],
    fieldLabels: {
      icon: "Type (email / phone / location)",
      title: "Label",
      subtitle: "Value",
      body: "Note (optional)",
      href: "Link (mailto:, tel:…)",
    },
    preview: "benefit",
  },
  bento_grid: {
    label: "Bento cells",
    actionLabel: "cells",
    fields: ["image_url", "value", "title", "subtitle", "body"],
    fieldLabels: {
      image_url: "Background image",
      value: "Metric / label",
      title: "Title",
      subtitle: "Subtitle",
      body: "Description",
    },
    preview: "benefit",
  },
  horizon_gallery: {
    label: "Gallery panels",
    actionLabel: "panels",
    fields: ["image_url", "title", "subtitle", "body"],
    fieldLabels: {
      image_url: "Panel image",
      title: "Caption title",
      subtitle: "Caption subtitle",
      body: "Caption body",
    },
    preview: "benefit",
  },
  split_narrative: {
    label: "Story chapters",
    actionLabel: "chapters",
    fields: ["image_url", "value", "title", "subtitle", "body"],
    fieldLabels: {
      image_url: "Chapter image",
      value: "Chapter label",
      title: "Title",
      subtitle: "Subtitle",
      body: "Body",
    },
    preview: "benefit",
  },
  pillar_destinations: {
    label: "Destination pillars",
    actionLabel: "pillars",
    fields: ["image_url", "title", "subtitle", "body", "href"],
    fieldLabels: {
      image_url: "Background image",
      title: "Title",
      subtitle: "Subtitle",
      body: "Description",
      href: "Link URL",
    },
    preview: "benefit",
  },
  card_stack: {
    label: "Stack cards",
    actionLabel: "cards",
    fields: ["image_url", "value", "title", "subtitle", "body"],
    fieldLabels: {
      image_url: "Card image",
      value: "Eyebrow / number",
      title: "Title",
      subtitle: "Subtitle",
      body: "Body",
    },
    preview: "benefit",
  },
  feature_tabs: {
    label: "Feature tabs",
    actionLabel: "tabs",
    fields: ["image_url", "value", "title", "subtitle", "body"],
    fieldLabels: {
      image_url: "Preview image",
      value: "Tab label",
      title: "Title",
      subtitle: "Subtitle",
      body: "Description",
    },
    preview: "benefit",
  },
  pricing_tiers: {
    label: "Pricing plans",
    actionLabel: "plans",
    fields: ["title", "value", "subtitle", "body", "label", "href", "icon"],
    fieldLabels: {
      title: "Plan name",
      value: "Price",
      subtitle: "Period (e.g. /mo)",
      body: "Features (one per line)",
      label: "Badge (use popular)",
      href: "CTA URL",
      icon: "CTA label",
    },
    preview: "benefit",
  },
  masonry_quotes: {
    label: "Quotes",
    actionLabel: "quotes",
    fields: ["body", "subtitle", "value", "image_url"],
    fieldLabels: {
      body: "Quote",
      subtitle: "Author name",
      value: "Role / company",
      image_url: "Avatar",
    },
    preview: "testimonial",
  },
  metric_rail: {
    label: "Metrics",
    actionLabel: "metrics",
    fields: ["value", "label"],
    fieldLabels: { value: "Metric value", label: "Metric label" },
    preview: "stat",
  },
  template_gallery: {
    label: "Template cards",
    actionLabel: "templates",
    fields: ["image_url", "value", "title", "subtitle", "body"],
    fieldLabels: {
      image_url: "Template image",
      value: "Category label",
      title: "Template name",
      subtitle: "Short description",
      body: "Body",
    },
    preview: "benefit",
  },
  builder_feature_cards: {
    label: "Builder features",
    actionLabel: "features",
    fields: ["value", "title", "subtitle", "body"],
    fieldLabels: {
      value: "Number / icon text",
      title: "Feature title",
      subtitle: "Short label",
      body: "Description",
    },
    preview: "benefit",
  },
  domain_search_band: {
    label: "Domain chips",
    actionLabel: "domain chips",
    fields: ["value", "label"],
    fieldLabels: {
      value: "Chip text",
      label: "Fallback chip label",
    },
    preview: "stat",
  },
  website_build_steps: {
    label: "Build steps",
    actionLabel: "steps",
    fields: ["title", "subtitle", "body"],
    fieldLabels: {
      title: "Step title",
      subtitle: "Short label",
      body: "Description",
    },
    preview: "benefit",
  },
  why_choose: {
    label: "Feature cards",
    actionLabel: "features",
    fields: ["image_url", "icon", "title", "body"],
    fieldLabels: {
      image_url: "Icon image",
      icon: "Icon URL (alt)",
      title: "Feature title",
      body: "Description",
    },
    preview: "why_choose",
  },
  stats: {
    label: "Stats",
    actionLabel: "stats",
    fields: ["value", "label"],
    fieldLabels: { value: "Stat value", label: "Stat label" },
    preview: "stat",
  },
  testimonials: {
    label: "Testimonials",
    actionLabel: "testimonials",
    fields: ["body", "title"],
    fieldLabels: { body: "Quote", title: "Author" },
    preview: "testimonial",
  },
  customer_testimonials: {
    label: "Customer testimonials",
    actionLabel: "testimonials",
    fields: ["value", "body", "title", "image_url"],
    fieldLabels: {
      value: "Star rating (1–5)",
      body: "Quote",
      title: "Author name",
      image_url: "Company logo",
    },
    preview: "customer_testimonial",
  },
  resources: {
    label: "Resources",
    actionLabel: "resources",
    fields: ["title", "body", "href", "buttons"],
    fieldLabels: {
      title: "Resource name",
      body: "Description",
      href: "Link URL",
    },
    preview: "resource",
  },
  curriculum: {
    label: "Modules",
    actionLabel: "modules",
    fields: ["title"],
    fieldLabels: { title: "Module name" },
    preview: "curriculum",
  },
  partners: {
    label: "Partner logos",
    actionLabel: "partners",
    fields: ["image_url", "title", "href"],
    fieldLabels: {
      image_url: "Logo image",
      title: "Partner name",
      href: "Link URL (optional)",
    },
    preview: "partner",
  },
  partners_marquee: {
    label: "Partner logos",
    actionLabel: "partners",
    fields: ["image_url", "title", "href"],
    fieldLabels: {
      image_url: "Logo image",
      title: "Partner name",
      href: "Link URL (optional)",
    },
    preview: "partner",
  },
  training_options: {
    label: "Training options",
    actionLabel: "options",
    fields: ["image_url", "title", "body"],
    fieldLabels: {
      image_url: "Card image",
      title: "Option title",
      body: "Description",
    },
    preview: "training_option",
  },
  awards: {
    label: "Awards",
    actionLabel: "awards",
    fields: ["image_url", "title", "body"],
    fieldLabels: {
      image_url: "Award badge / logo",
      title: "Award title",
      body: "Description",
    },
    preview: "award",
  },
  hero_stats: {
    label: "Hero stats",
    actionLabel: "stats",
    fields: ["value", "label"],
    fieldLabels: { value: "Stat value", label: "Stat label" },
    preview: "stat",
  },
  hero_media: {
    label: "Banner slides",
    actionLabel: "banners",
    fields: [
      "image_url",
      "bg_color",
      "icon",
      "href",
      "title",
      "subtitle",
      "body",
      "buttons",
    ],
    fieldLabels: {
      image_url: "Banner background image",
      bg_color: "Background (color or gradient)",
      icon: "Right-side image",
      href: "Video URL (optional)",
      title: "Headline",
      subtitle: "Subtitle",
      body: "Body (optional)",
    },
    preview: "hero_banner",
  },
  video_banner: {
    label: "Video banner",
    actionLabel: "video",
    fields: ["href", "image_url", "title", "subtitle", "buttons"],
    fieldLabels: {
      href: "Video URL",
      image_url: "Fallback image",
      title: "Overlay title",
      subtitle: "Overlay subtitle",
      buttons: "Overlay buttons",
    },
    preview: "hero_banner",
  },
  cast_profiles: {
    label: "Cast profiles",
    actionLabel: "profiles",
    fields: ["image_url", "value", "title", "subtitle", "body"],
    fieldLabels: {
      image_url: "Portrait photo",
      value: "Badge (e.g. Lead)",
      title: "Actor name",
      subtitle: "Character name",
      body: "Short bio",
    },
    preview: "benefit",
  },
};

export function sectionUsesItems(key) {
  return Boolean(SECTION_ITEMS_CONFIG[String(key || "").toLowerCase()]);
}

export function getSectionItemsConfig(key) {
  return SECTION_ITEMS_CONFIG[String(key || "").toLowerCase()] || null;
}

/** Alias — item-driven sections require items on the public page */
export function sectionRequiresItems(key) {
  return sectionUsesItems(key);
}
