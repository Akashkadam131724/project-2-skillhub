/** CMS item fields for `key_benefits` — register in lib/sections/configs/index.js */
export const KEY_BENEFITS_ITEMS_CONFIG = {
  label: "Benefit cards",
  actionLabel: "benefits",
  fields: [
    { key: "image_url", type: "image", label: "Card image", required: true },
    { key: "title", type: "text", label: "Benefit", required: true },
    { key: "body", type: "richtext", label: "Description" },
    { key: "buttons", type: "buttons", label: "Buttons" },
  ],
  preview: "benefit",
};
