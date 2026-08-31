/** CMS item fields for `hero_stats` */
export const HERO_STATS_ITEMS_CONFIG = {
  label: "Hero stats",
  actionLabel: "stats",
  fields: [
    { key: "value", type: "text", label: "Stat value", required: true },
    { key: "label", type: "text", label: "Stat label", required: true },
  ],
  preview: "stat",
};
