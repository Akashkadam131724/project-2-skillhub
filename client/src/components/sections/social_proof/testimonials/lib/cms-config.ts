/** CMS item fields for `testimonials` */
export const TESTIMONIALS_ITEMS_CONFIG = {
  label: "Testimonials",
  actionLabel: "testimonials",
  fields: [
    { key: "body", type: "richtext", label: "Quote", required: true },
    { key: "title", type: "text", label: "Author", required: true },
  ],
  preview: "testimonial",
};
