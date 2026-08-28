/** CMS item fields for `faq_two_column` — register in lib/sections/configs/index.js */
export const FAQ_TWO_COLUMN_ITEMS_CONFIG = {
  label: "FAQ",
  actionLabel: "FAQ",
  fields: [
    {
      key: "title",
      type: "text",
      label: "Question",
      required: true,
      errors: { required: "Question is required" },
    },
    {
      key: "body",
      type: "richtext",
      label: "Answer",
      required: true,
      errors: { required: "Answer is required" },
    },
    { key: "buttons", type: "buttons", label: "Buttons" },
  ],
  preview: "faq",
};
