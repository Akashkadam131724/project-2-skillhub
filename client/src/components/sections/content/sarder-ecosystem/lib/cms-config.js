/** CMS nested groups + logo link rows for sarder_ecosystem */
export const SARDER_ECOSYSTEM_ITEMS_CONFIG = {
  label: "Ecosystem groups",
  actionLabel: "groups",
  nestedTabs: true,
  fields: [{ key: "title", type: "text", label: "Group title", required: true }],
  childFields: [
    { key: "title", type: "text", label: "Link label", required: true },
    { key: "image_url", type: "image", label: "Logo", required: true },
    { key: "subtitle", type: "text", label: "Logo alt text" },
    {
      key: "href",
      type: "url",
      label: "URL",
      hint: "Leave empty for a non-clickable card",
    },
  ],
  preview: "generic",
};
