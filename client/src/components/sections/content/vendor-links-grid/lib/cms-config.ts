/** CMS item fields for vendor_link_grid link rows. */
export const VENDOR_LINK_GRID_ITEMS_CONFIG = {
  label: "Vendor links",
  actionLabel: "links",
  fields: [
    { key: "title", type: "text", label: "Label", required: true },
    { key: "href", type: "url", label: "URL", required: true },
    { key: "image_url", type: "image", label: "Icon" },
  ],
  preview: "generic",
};
