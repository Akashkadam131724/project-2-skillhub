/** CMS item fields for `faq` — register in lib/sections/configs/index.js */
export const FAQ_ITEMS_CONFIG = {
  label: "FAQ",
  actionLabel: "FAQ",
  fields: [
    {
      key: "title",
      type: "text",
      label: "Question",
      required: true,
      minLength: 5,
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
