/** CMS item fields for `text_media` — register in lib/sections/configs/index.js */
export const TEXT_MEDIA_ITEMS_CONFIG = {
  label: "Text + media rows",
  actionLabel: "rows",
  fields: [
    { key: "image_url", type: "image", label: "Media image" },
    { key: "title", type: "text", label: "Headline", required: true },
    {
      key: "body",
      type: "richtext",
      label: "Body (rich text — add links here)",
    },
    {
      key: "value",
      type: "radio",
      label: "Media side (start or end)",
      required: true,
      options: [
        { value: "start", label: "Media start (left)" },
        { value: "end", label: "Media end (right)" },
      ],
      errors: { required: "Choose which side the media sits on" },
    },
  ],
  preview: "text_media",
};
