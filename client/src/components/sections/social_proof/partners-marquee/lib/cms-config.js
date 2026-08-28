/** CMS item fields for `partners` / `partners_marquee` */
export const PARTNERS_MARQUEE_ITEMS_CONFIG = {
  label: "Partner logos",
  actionLabel: "partners",
  fields: [
    { key: "image_url", type: "image", label: "Logo image", required: true },
    { key: "title", type: "text", label: "Partner name", required: true },
    { key: "href", type: "url", label: "Link URL (optional)" },
  ],
  preview: "partner",
};
