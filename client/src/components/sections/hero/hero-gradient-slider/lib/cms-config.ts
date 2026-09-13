import { HERO_GRADIENT_SLIDER_STAT_ICON_OPTIONS } from "./stat-icons";

/** CMS nested slides + optional stats for `hero_gradient_slider` */
export const HERO_GRADIENT_SLIDER_ITEMS_CONFIG = {
  label: "Slides",
  actionLabel: "slides",
  nestedTabs: true,
  fields: [
    { key: "title", type: "text", label: "Headline", required: true },
    { key: "body", type: "richtext", label: "Body" },
    { key: "image_url", type: "image", label: "Side image" },
    {
      key: "buttons",
      type: "buttons",
      label: "Buttons",
      hint: "Add a YouTube button for Watch video — label, URL, and style are all editable.",
    },
  ],
  childFields: [
    { key: "value", type: "text", label: "Stat value", required: true },
    { key: "label", type: "text", label: "Stat label", required: true },
    {
      key: "icon",
      type: "select",
      label: "Icon",
      hint: "Keys from the shared icon catalog. Add new icons there first.",
      options: HERO_GRADIENT_SLIDER_STAT_ICON_OPTIONS,
    },
  ],
  preview: "hero_banner",
};
