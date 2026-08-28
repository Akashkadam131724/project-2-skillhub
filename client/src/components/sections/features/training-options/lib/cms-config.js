/** CMS item fields for `training_options` — register in lib/sections/configs/index.js */
export const TRAINING_OPTIONS_ITEMS_CONFIG = {
  label: "Training options",
  actionLabel: "options",
  fields: [
    { key: "image_url", type: "image", label: "Card image" },
    { key: "title", type: "text", label: "Option title", required: true },
    { key: "body", type: "richtext", label: "Description" },
  ],
  preview: "training_option",
};
