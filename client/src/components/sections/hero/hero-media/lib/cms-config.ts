/** CMS item fields for `hero_media` */
export const HERO_MEDIA_ITEMS_CONFIG = {
  label: "Banner slides",
  actionLabel: "banners",
  fields: [
    { key: "image_url", type: "image", label: "Banner background image" },
    { key: "bg_color", type: "bg_color", label: "Background (color or gradient)" },
    { key: "icon", type: "text", label: "Right-side image" },
    { key: "href", type: "url", label: "Video URL (optional)" },
    { key: "title", type: "text", label: "Headline", required: true },
    { key: "subtitle", type: "text", label: "Subtitle" },
    { key: "body", type: "richtext", label: "Body (optional)" },
    { key: "buttons", type: "buttons", label: "Buttons" },
  ],
  preview: "hero_banner",
};
