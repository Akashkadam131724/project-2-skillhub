/** CMS item fields for `timeline_vertical` — register in lib/sections/configs/index.js */
export const TIMELINE_VERTICAL_ITEMS_CONFIG = {
  label: "Timeline steps",
  actionLabel: "milestones",
  fields: [
    { key: "title", type: "text", label: "Milestone", required: true },
    { key: "subtitle", type: "text", label: "Date / phase" },
    { key: "body", type: "richtext", label: "Description" },
    { key: "buttons", type: "buttons", label: "Buttons" },
  ],
  preview: "timeline_step",
};
