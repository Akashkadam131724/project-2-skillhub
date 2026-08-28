/** CMS item fields for `trust_badges` — register in lib/sections/configs/index.js */
export const TRUST_BADGES_ITEMS_CONFIG = {
  label: "Trust badges",
  actionLabel: "badges",
  fields: [
    { key: "image_url", type: "image", label: "Logo / badge" },
    { key: "title", type: "text", label: "Label" },
    { key: "subtitle", type: "text", label: "Caption" },
    { key: "value", type: "text", label: "Fallback icon text" },
  ],
  preview: "trust_badge",
};
