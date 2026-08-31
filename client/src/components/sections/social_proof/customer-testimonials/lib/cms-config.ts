/** CMS item fields for `customer_testimonials` */
export const CUSTOMER_TESTIMONIALS_ITEMS_CONFIG = {
  label: "Customer testimonials",
  actionLabel: "testimonials",
  fields: [
    { key: "value", type: "text", label: "Star rating (1–5)" },
    { key: "body", type: "richtext", label: "Quote", required: true },
    { key: "title", type: "text", label: "Author name", required: true },
    { key: "image_url", type: "image", label: "Company logo" },
  ],
  preview: "customer_testimonial",
};
