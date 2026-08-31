/** CMS item fields for `media_mosaic` */
export const MEDIA_MOSAIC_ITEMS_CONFIG = {
  label: "Mosaic tiles",
  actionLabel: "tiles",
  fields: [
    { key: "image_url", type: "image", label: "Image" },
    { key: "title", type: "text", label: "Title" },
    { key: "subtitle", type: "text", label: "Caption" },
    { key: "buttons", type: "buttons", label: "Buttons" },
  ],
  preview: "mosaic_tile",
};
