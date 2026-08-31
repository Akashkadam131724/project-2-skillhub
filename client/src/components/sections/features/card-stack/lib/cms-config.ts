/** CMS item fields for `card_stack` — register in lib/sections/configs/index.js */
export const CARD_STACK_ITEMS_CONFIG = {
  label: "Stack cards",
  actionLabel: "cards",
  fields: [
    { key: "image_url", type: "image", label: "Card image" },
    { key: "value", type: "text", label: "Eyebrow / number" },
    { key: "title", type: "text", label: "Title" },
    { key: "subtitle", type: "text", label: "Subtitle" },
    { key: "body", type: "richtext", label: "Body" },
  ],
  preview: "stack_card",
};
