/** CMS item config for stats strip. */
export const STATS_ITEMS_CONFIG = {
  label: "Stats",
  actionLabel: "stats",
  fields: [
    { key: "value", type: "text", label: "Stat value", required: true },
    { key: "label", type: "text", label: "Stat label", required: true },
  ],
  preview: "stat",
};
