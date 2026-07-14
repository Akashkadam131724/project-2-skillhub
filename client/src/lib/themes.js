/**
 * Site color themes — applied via data-theme on <html>.
 * CSS vars: --brand, --brand-hover, --ink, --brand-soft, --brand-muted
 */

export const THEMES = [
  {
    id: "blue",
    label: "Blue",
    brand: "#1b4de4",
    brandHover: "#153fc0",
    ink: "#0b1f4d",
  },
  {
    id: "teal",
    label: "Teal",
    brand: "#0f766e",
    brandHover: "#0c5f59",
    ink: "#134e4a",
  },
  {
    id: "indigo",
    label: "Indigo",
    brand: "#4f46e5",
    brandHover: "#4338ca",
    ink: "#1e1b4b",
  },
  {
    id: "cyan",
    label: "Cyan",
    brand: "#0891b2",
    brandHover: "#0e7490",
    ink: "#164e63",
  },
  {
    id: "emerald",
    label: "Emerald",
    brand: "#059669",
    brandHover: "#047857",
    ink: "#064e3b",
  },
  {
    id: "violet",
    label: "Violet",
    brand: "#7c3aed",
    brandHover: "#6d28d9",
    ink: "#4c1d95",
  },
  {
    id: "navy",
    label: "Navy",
    brand: "#1e3a8a",
    brandHover: "#1e40af",
    ink: "#0f172a",
  },
  {
    id: "sky",
    label: "Sky",
    brand: "#0284c7",
    brandHover: "#0369a1",
    ink: "#0c4a6e",
  },
  {
    id: "slate",
    label: "Slate",
    brand: "#475569",
    brandHover: "#334155",
    ink: "#0f172a",
  },
];

export const THEME_IDS = THEMES.map((t) => t.id);
export const DEFAULT_THEME = "blue";
export const THEME_STORAGE_KEY = "skillhub-color-theme";

export function isThemeId(value) {
  return THEME_IDS.includes(String(value || ""));
}

export function getTheme(id) {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}

/** Apply theme to documentElement (client only). */
export function applyTheme(id) {
  if (typeof document === "undefined") return;
  const theme = getTheme(isThemeId(id) ? id : DEFAULT_THEME);
  const root = document.documentElement;
  root.setAttribute("data-theme", theme.id);
  root.classList.remove("dark");
  root.style.setProperty("--brand", theme.brand);
  root.style.setProperty("--brand-hover", theme.brandHover);
  root.style.setProperty("--ink", theme.ink);
}
