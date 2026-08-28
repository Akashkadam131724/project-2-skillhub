/** CMS item config for domain_search_band chips. */
export const DOMAIN_SEARCH_BAND_ITEMS_CONFIG = {
  label: "Domain chips",
  actionLabel: "domain chips",
  fields: [
    { key: "value", type: "text", label: "Chip text", required: true },
    { key: "label", type: "text", label: "Fallback chip label" },
  ],
  preview: "domain_chip",
};
