/** CMS item fields for `masonry_quotes` */
export const MASONRY_QUOTES_ITEMS_CONFIG = {
  label: "Quotes",
  actionLabel: "quotes",
  fields: [
    { key: "body", type: "richtext", label: "Quote" },
    { key: "subtitle", type: "text", label: "Author name" },
    { key: "value", type: "text", label: "Role / company" },
    { key: "image_url", type: "image", label: "Avatar" },
  ],
  preview: "testimonial",
};
