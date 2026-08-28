/** CMS item fields for `form_split` — register in lib/sections/configs/index.js */
export const FORM_SPLIT_ITEMS_CONFIG = {
  label: "Highlights",
  actionLabel: "highlights",
  fields: [
    { key: "title", type: "text", label: "Label" },
    { key: "subtitle", type: "text", label: "Detail" },
    { key: "body", type: "richtext", label: "Note" },
  ],
  preview: "form_highlight",
};
