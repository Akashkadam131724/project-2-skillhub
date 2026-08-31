/**
 * Button icon catalog — grouped presets for CMS + ButtonIcon registry.
 * Add icons here; labels drive the editor optgroups.
 */

export const BUTTON_ICON_GROUPS = [
  {
    id: "system",
    label: "System",
    icons: ["auto", "none"],
  },
  {
    id: "arrows",
    label: "Arrows & chevrons",
    icons: [
      "arrow-right",
      "arrow-left",
      "arrow-down",
      "arrow-up",
      "chevron-right",
      "chevron-left",
      "chevron-down",
      "chevron-up",
    ],
  },
  {
    id: "links",
    label: "Links & files",
    icons: ["link", "external", "download", "pdf", "file", "share"],
  },
  {
    id: "media",
    label: "Media",
    icons: ["play", "youtube"],
  },
  {
    id: "contact",
    label: "Contact",
    icons: ["mail", "phone", "map-pin", "form", "chat"],
  },
  {
    id: "commerce",
    label: "Commerce & actions",
    icons: ["cart", "check", "plus", "minus", "search", "calendar", "clock"],
  },
  {
    id: "content",
    label: "Content & learning",
    icons: ["book", "graduation", "building", "globe", "star", "sparkle"],
  },
  {
    id: "ui",
    label: "UI",
    icons: ["user", "settings", "info", "heart"],
  },
];

/** Flat list of all selectable icon preset ids */
export const BUTTON_ICON_PRESETS = BUTTON_ICON_GROUPS.flatMap((g) => g.icons);

export const BUTTON_ICON_LABELS = {
  auto: "Auto (from action)",
  none: "No icon",
  "arrow-right": "Arrow →",
  "arrow-left": "Arrow ←",
  "arrow-down": "Arrow ↓",
  "arrow-up": "Arrow ↑",
  "chevron-right": "Chevron ›",
  "chevron-left": "Chevron ‹",
  "chevron-down": "Chevron ˅",
  "chevron-up": "Chevron ˄",
  link: "Link",
  external: "External link",
  download: "Download",
  pdf: "PDF",
  file: "Document",
  share: "Share",
  play: "Play",
  youtube: "YouTube",
  mail: "Email",
  phone: "Phone",
  "map-pin": "Location",
  form: "Form",
  chat: "Chat / message",
  cart: "Cart",
  check: "Check / confirm",
  plus: "Plus / add",
  minus: "Minus / remove",
  search: "Search",
  calendar: "Calendar",
  clock: "Clock / schedule",
  book: "Book",
  graduation: "Graduation / course",
  building: "Building / enterprise",
  globe: "Globe / web",
  star: "Star",
  sparkle: "Sparkle / featured",
  user: "User / profile",
  settings: "Settings",
  info: "Info",
  heart: "Heart / favorite",
};

export function isButtonIconPreset(value: unknown) {
  const id = String(value || "").trim().toLowerCase();
  return BUTTON_ICON_PRESETS.includes(id);
}

export function buttonIconLabel(id: string) {
  return BUTTON_ICON_LABELS[id as keyof typeof BUTTON_ICON_LABELS] || id;
}
