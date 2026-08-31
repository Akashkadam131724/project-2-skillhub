/** CMS item fields for `pricing_tiers` — register in lib/sections/configs/index.js */
export const PRICING_TIERS_ITEMS_CONFIG = {
  label: "Pricing plans",
  actionLabel: "plans",
  fields: [
    { key: "title", type: "text", label: "Plan name", required: true },
    {
      key: "value",
      type: "text",
      label: "Price",
      required: true,
      errors: { required: "Price is required" },
    },
    { key: "subtitle", type: "text", label: "Period (e.g. /mo)" },
    { key: "body", type: "richtext", label: "Features (one per line)" },
    {
      key: "label",
      type: "radio",
      label: "Badge (use popular)",
      options: [
        { value: "", label: "None" },
        { value: "popular", label: "Popular" },
      ],
    },
    { key: "href", type: "url", label: "CTA URL" },
    { key: "icon", type: "text", label: "CTA label" },
  ],
  preview: "pricing_plan",
};
