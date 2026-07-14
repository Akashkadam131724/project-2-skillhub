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
