/** CMS item fields for `why_choose` — register in lib/sections/configs/index.js */
export const WHY_CHOOSE_ITEMS_CONFIG = {
  label: "Feature cards",
  actionLabel: "features",
  fields: [
    { key: "image_url", type: "image", label: "Icon image" },
    { key: "icon", type: "text", label: "Icon URL (alt)" },
    { key: "title", type: "text", label: "Feature title", required: true },
    { key: "body", type: "richtext", label: "Description" },
  ],
  preview: "why_choose",
};
