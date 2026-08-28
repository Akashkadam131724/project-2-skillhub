/** CMS item config for template_gallery cards. */
export const TEMPLATE_GALLERY_ITEMS_CONFIG = {
  label: "Template cards",
  actionLabel: "templates",
  fields: [
    { key: "image_url", type: "image", label: "Template image" },
    { key: "value", type: "text", label: "Category label" },
    { key: "title", type: "text", label: "Template name" },
    { key: "subtitle", type: "text", label: "Short description" },
    { key: "body", type: "richtext", label: "Body" },
  ],
  preview: "template_card",
};
