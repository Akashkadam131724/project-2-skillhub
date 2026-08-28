/** CMS item fields for `awards` — register in lib/sections/configs/index.js */
export const AWARDS_ITEMS_CONFIG = {
  label: "Awards",
  actionLabel: "awards",
  fields: [
    { key: "image_url", type: "image", label: "Award badge / logo" },
    { key: "title", type: "text", label: "Award title", required: true },
    { key: "body", type: "richtext", label: "Description" },
  ],
  preview: "award",
};
