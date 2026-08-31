/** CMS item config for split_narrative chapters. */
export const SPLIT_NARRATIVE_ITEMS_CONFIG = {
  label: "Story chapters",
  actionLabel: "chapters",
  fields: [
    { key: "image_url", type: "image", label: "Chapter image" },
    { key: "value", type: "text", label: "Chapter label" },
    { key: "title", type: "text", label: "Title" },
    { key: "subtitle", type: "text", label: "Subtitle" },
    { key: "body", type: "richtext", label: "Body" },
  ],
  preview: "story_chapter",
};
