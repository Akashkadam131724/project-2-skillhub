/** CMS item fields for `process_steps` — register in lib/sections/configs/index.js */
export const PROCESS_STEPS_ITEMS_CONFIG = {
  label: "Process steps",
  actionLabel: "steps",
  fields: [
    { key: "title", type: "text", label: "Step title", required: true },
    { key: "subtitle", type: "text", label: "Short label" },
    { key: "body", type: "richtext", label: "Description" },
  ],
  preview: "process_step",
};
