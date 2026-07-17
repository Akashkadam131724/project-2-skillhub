/**
 * Banner / page / section background helpers — solid colors + CSS gradients.
 * Stored as hex, CSS var, or gradient CSS string.
 */

export const DEFAULT_BANNER_BG = "var(--ink)";

/** Dark solids — best with light / white text */
export const DARK_SOLID_PRESETS = [
  { label: "Navy", value: "var(--ink)" },
  { label: "Slate", value: "#0f172a" },
  { label: "Charcoal", value: "#111827" },
  { label: "Deep blue", value: "#1e3a5f" },
  { label: "Ocean", value: "#0c4a6e" },
  { label: "Forest", value: "#14532d" },
  { label: "Violet", value: "#4c1d95" },
  { label: "Wine", value: "#7f1d1d" },
  { label: "Stone", value: "#1c1917" },
];

/** Light solids — best with dark / ink text */
export const LIGHT_SOLID_PRESETS = [
  { label: "White", value: "#ffffff" },
  { label: "Off-white", value: "#f8fafc" },
  { label: "Soft grey", value: "#f1f5f9" },
  { label: "Mist", value: "#e2e8f0" },
  { label: "Sky soft", value: "#e0f2fe" },
  { label: "Mint soft", value: "#ecfdf5" },
  { label: "Lavender soft", value: "#f5f3ff" },
  { label: "Cyan", value: "#5ec8e8" },
  { label: "Sky", value: "#38bdf8" },
  { label: "Aqua", value: "#22d3ee" },
  { label: "Teal", value: "#14b8a6" },
  { label: "Blue", value: "#3b82f6" },
];

/** Dark gradients — readable under white text */
export const DARK_GRADIENT_PRESETS = [
  {
    label: "Midnight",
    value: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0b1f4d 100%)",
  },
  {
    label: "Ocean depth",
    value: "linear-gradient(160deg, #082f49 0%, #0e7490 50%, #164e63 100%)",
  },
  {
    label: "Aurora",
    value: "linear-gradient(125deg, #0f172a 0%, #1e1b4b 40%, #4c1d95 100%)",
  },
  {
    label: "Ember",
    value: "linear-gradient(145deg, #1c1917 0%, #7f1d1d 45%, #9a3412 100%)",
  },
  {
    label: "Forest mist",
    value: "linear-gradient(150deg, #052e16 0%, #14532d 50%, #0f766e 100%)",
  },
  {
    label: "Twilight",
    value: "linear-gradient(120deg, #020617 0%, #312e81 50%, #6d28d9 100%)",
  },
  {
    label: "Steel",
    value: "linear-gradient(180deg, #0f172a 0%, #334155 55%, #1e293b 100%)",
  },
  {
    label: "SkillHub",
    value:
      "linear-gradient(157.967deg, rgb(15, 23, 42) 0%, rgb(0, 35, 109) 50%, rgb(15, 23, 42) 100%)",
  },
];

/** Light gradients — best with dark text (or white on bright cyan bands) */
export const LIGHT_GRADIENT_PRESETS = [
  {
    label: "Paper wash",
    value: "linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)",
  },
  {
    label: "Soft blue",
    value: "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 55%, #dbeafe 100%)",
  },
  {
    label: "Soft mint",
    value: "linear-gradient(145deg, #f8fafc 0%, #ecfdf5 50%, #d1fae5 100%)",
  },
  {
    label: "Soft lavender",
    value: "linear-gradient(125deg, #faf5ff 0%, #f5f3ff 45%, #ede9fe 100%)",
  },
  {
    label: "Cyan wash",
    value: "linear-gradient(135deg, #67e8f9 0%, #5ec8e8 45%, #22d3ee 100%)",
  },
  {
    label: "Sky band",
    value: "linear-gradient(160deg, #7dd3fc 0%, #38bdf8 50%, #0ea5e9 100%)",
  },
  {
    label: "Aqua fade",
    value: "linear-gradient(120deg, #a5f3fc 0%, #5ec8e8 55%, #06b6d4 100%)",
  },
  {
    label: "Ocean light",
    value: "linear-gradient(145deg, #5eead4 0%, #5ec8e8 50%, #3b82f6 100%)",
  },
];

/** @deprecated use DARK_SOLID_PRESETS */
export const BANNER_SOLID_PRESETS = DARK_SOLID_PRESETS;

/** @deprecated use light cyan band subset */
export const BAND_SOLID_PRESETS = [
  { label: "Cyan", value: "#5ec8e8" },
  { label: "Sky", value: "#38bdf8" },
  { label: "Aqua", value: "#22d3ee" },
  { label: "Teal", value: "#14b8a6" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Indigo", value: "#6366f1" },
];

/** @deprecated use DARK_GRADIENT_PRESETS */
export const BANNER_GRADIENT_PRESETS = DARK_GRADIENT_PRESETS;

/** @deprecated use LIGHT_GRADIENT_PRESETS cyan subset */
export const BAND_GRADIENT_PRESETS = [
  {
    label: "Cyan wash",
    value: "linear-gradient(135deg, #67e8f9 0%, #5ec8e8 45%, #22d3ee 100%)",
  },
  {
    label: "Sky band",
    value: "linear-gradient(160deg, #7dd3fc 0%, #38bdf8 50%, #0ea5e9 100%)",
  },
  {
    label: "Aqua fade",
    value: "linear-gradient(120deg, #a5f3fc 0%, #5ec8e8 55%, #06b6d4 100%)",
  },
  {
    label: "Ocean light",
    value: "linear-gradient(145deg, #5eead4 0%, #5ec8e8 50%, #3b82f6 100%)",
  },
];

export const DEFAULT_STATS_BG =
  "linear-gradient(135deg, #67e8f9 0%, #5ec8e8 45%, #22d3ee 100%)";

export function isBannerGradient(value) {
  const s = String(value || "").trim().toLowerCase();
  return s.includes("gradient(");
}

export function resolveBannerBg(value) {
  const raw = String(value || "").trim();
  return raw || DEFAULT_BANNER_BG;
}

/** Inline style for a solid or gradient base layer */
export function bannerBgStyle(value) {
  const bg = resolveBannerBg(value);
  if (isBannerGradient(bg)) {
    return { backgroundImage: bg, backgroundColor: DEFAULT_BANNER_BG };
  }
  return { backgroundColor: bg };
}

/**
 * Overlay layer when a photo sits underneath — darkens image for white text.
 * Gradients render as the overlay; solids use opacity.
 */
export function bannerOverlayStyle(value, { hasImage = false } = {}) {
  const raw = String(value || "").trim();
  const bg = raw || DEFAULT_BANNER_BG;
  const custom = Boolean(raw);

  if (!hasImage) return bannerBgStyle(bg);

  if (isBannerGradient(bg)) {
    return {
      backgroundImage: bg,
      opacity: custom ? 0.78 : 0.75,
    };
  }

  return {
    backgroundColor: bg,
    opacity: custom ? 0.72 : 0.75,
  };
}
