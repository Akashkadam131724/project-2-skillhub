/** CMS item config for `pillar_destinations` — register in lib/sections/configs/index.js */
export const PILLAR_DESTINATIONS_ITEMS_CONFIG = {
  label: "Destination pillars",
  actionLabel: "pillars",
  fields: [
    { key: "image_url", type: "image", label: "Background image" },
    { key: "title", type: "text", label: "Title" },
    { key: "subtitle", type: "text", label: "Subtitle" },
    { key: "body", type: "richtext", label: "Description" },
    { key: "href", type: "url", label: "Link URL" },
  ],
  preview: "pillar",
};
