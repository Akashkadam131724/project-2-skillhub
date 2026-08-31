/** CMS item config for `feature_spotlight` — register in lib/sections/configs/index.js */
export const FEATURE_SPOTLIGHT_ITEMS_CONFIG = {
  label: "Spotlight cards",
  actionLabel: "spotlights",
  fields: [
    { key: "image_url", type: "image", label: "Background image" },
    { key: "value", type: "text", label: "Metric / eyebrow" },
    { key: "title", type: "text", label: "Title", required: true },
    { key: "subtitle", type: "text", label: "Subtitle" },
    { key: "body", type: "richtext", label: "Description" },
  ],
  preview: "spotlight",
};
