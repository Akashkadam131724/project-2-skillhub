/** CMS item fields for `learning_path` */
export const LEARNING_PATH_ITEMS_CONFIG = {
  label: "Path steps",
  actionLabel: "steps",
  fields: [
    { key: "value", type: "text", label: "Step number" },
    { key: "title", type: "text", label: "Module", required: true },
    { key: "subtitle", type: "text", label: "Duration / format" },
    { key: "body", type: "richtext", label: "Description" },
    { key: "buttons", type: "buttons", label: "Buttons" },
  ],
  preview: "learning_step",
};
