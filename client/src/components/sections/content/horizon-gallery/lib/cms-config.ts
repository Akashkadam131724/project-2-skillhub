/** CMS item config for horizon_gallery panels. */
export const HORIZON_GALLERY_ITEMS_CONFIG = {
  label: "Gallery panels",
  actionLabel: "panels",
  fields: [
    { key: "image_url", type: "image", label: "Panel image" },
    { key: "title", type: "text", label: "Caption title" },
    { key: "subtitle", type: "text", label: "Caption subtitle" },
    { key: "body", type: "richtext", label: "Caption body" },
  ],
  preview: "gallery_panel",
};
