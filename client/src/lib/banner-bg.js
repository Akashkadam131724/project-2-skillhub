/**
 * Banner slide background helpers — solid colors + CSS gradients.
 * Stored in item.bg_color (hex or gradient CSS string).
 */

export const DEFAULT_BANNER_BG = "var(--ink)";

export const BANNER_SOLID_PRESETS = [
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

/** Light / band solids — white titles (stats strip, etc.) */
export const BAND_SOLID_PRESETS = [
  { label: "Cyan", value: "#5ec8e8" },
  { label: "Sky", value: "#38bdf8" },
  { label: "Aqua", value: "#22d3ee" },
  { label: "Teal", value: "#14b8a6" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Indigo", value: "#6366f1" },
];

/** Themed dark gradients — readable under white text */
export const BANNER_GRADIENT_PRESETS = [
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

/** Light band gradients — white titles on cyan / sky (stats strip) */
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
