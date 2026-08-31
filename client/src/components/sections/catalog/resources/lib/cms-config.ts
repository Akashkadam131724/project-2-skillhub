/** CMS item fields for `resources` — register in lib/sections/configs/index.js */
export const RESOURCES_ITEMS_CONFIG = {
  label: "Resources",
  actionLabel: "resources",
  fields: [
    { key: "title", type: "text", label: "Resource name", required: true },
    { key: "body", type: "richtext", label: "Description" },
    { key: "href", type: "url", label: "Link URL" },
    { key: "buttons", type: "buttons", label: "Buttons" },
  ],
  preview: "resource",
};
