/** CMS item config for website_build_steps. */
export const WEBSITE_BUILD_STEPS_ITEMS_CONFIG = {
  label: "Build steps",
  actionLabel: "steps",
  fields: [
    { key: "title", type: "text", label: "Step title", required: true },
    { key: "subtitle", type: "text", label: "Short label" },
    { key: "body", type: "richtext", label: "Description" },
  ],
  preview: "build_step",
};
