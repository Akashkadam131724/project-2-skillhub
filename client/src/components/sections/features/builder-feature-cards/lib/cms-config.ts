/** CMS item fields for `builder_feature_cards` — register in lib/sections/configs/index.js */
export const BUILDER_FEATURE_CARDS_ITEMS_CONFIG = {
  label: "Builder features",
  actionLabel: "features",
  fields: [
    { key: "value", type: "text", label: "Number / icon text" },
    { key: "title", type: "text", label: "Feature title" },
    { key: "subtitle", type: "text", label: "Short label" },
    { key: "body", type: "richtext", label: "Description" },
  ],
  preview: "builder_feature",
};
