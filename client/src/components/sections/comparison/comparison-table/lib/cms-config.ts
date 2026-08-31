/** CMS item fields for `comparison_table` — register in lib/sections/configs/index.js */
export const COMPARISON_TABLE_ITEMS_CONFIG = {
  label: "Comparison rows",
  actionLabel: "rows",
  fields: [
    { key: "title", type: "text", label: "Option" },
    { key: "value", type: "text", label: "Highlight" },
    { key: "subtitle", type: "text", label: "Short label" },
    { key: "body", type: "richtext", label: "Notes" },
    { key: "buttons", type: "buttons", label: "Buttons" },
  ],
  preview: "comparison_row",
};
