/** CMS item config for metric_rail. */
export const METRIC_RAIL_ITEMS_CONFIG = {
  label: "Metrics",
  actionLabel: "metrics",
  fields: [
    { key: "value", type: "text", label: "Metric value", required: true },
    { key: "label", type: "text", label: "Metric label", required: true },
  ],
  preview: "stat",
};
