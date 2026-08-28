/** CMS item fields for `tabs_success_stories` */
export const TABS_SUCCESS_STORIES_ITEMS_CONFIG = {
  label: "Success story",
  actionLabel: "stories",
  fields: [
    {
      key: "icon",
      type: "select",
      label:
        "Tab icon (government, healthcare, finance, local, technology)",
      options: [
        { value: "government", label: "Government" },
        { value: "healthcare", label: "Healthcare" },
        { value: "finance", label: "Finance" },
        { value: "local", label: "Local" },
        { value: "technology", label: "Technology" },
      ],
    },
    { key: "label", type: "text", label: "Tab name", required: true },
    { key: "subtitle", type: "text", label: "Partner name" },
    { key: "title", type: "text", label: "Story headline", required: true },
    { key: "value", type: "text", label: "Partner logo URL" },
    { key: "image_url", type: "image", label: "Story image" },
    { key: "href", type: "url", label: "Video URL (optional)" },
    { key: "bg_color", type: "bg_color", label: "Panel gradient" },
    { key: "buttons", type: "buttons", label: "CTA button" },
  ],
  preview: "success_story",
};
