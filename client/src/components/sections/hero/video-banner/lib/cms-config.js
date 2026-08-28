/** CMS item fields for `video_banner` */
export const VIDEO_BANNER_ITEMS_CONFIG = {
  label: "Video banner",
  actionLabel: "video",
  fields: [
    { key: "href", type: "url", label: "Video URL" },
    { key: "image_url", type: "image", label: "Fallback image" },
    { key: "title", type: "text", label: "Overlay title" },
    { key: "subtitle", type: "text", label: "Overlay subtitle" },
    { key: "buttons", type: "buttons", label: "Overlay buttons" },
  ],
  preview: "hero_banner",
};
