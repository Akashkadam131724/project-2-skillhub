/**
 * Client-side theme helpers — keep in sync with server theme.utils.js
 */

export const THEME_PRESETS = {
  // Existing
  blue: { brand_primary: "#1b4de4", brand_hover: "#153fc0", ink: "#0b1f4d", label: "Blue" },
  navy: { brand_primary: "#1e3a8a", brand_hover: "#1e40af", ink: "#0f172a", label: "Navy" },
  slate: { brand_primary: "#475569", brand_hover: "#334155", ink: "#0f172a", label: "Slate" },
  charcoal: { brand_primary: "#374151", brand_hover: "#1f2937", ink: "#111827", label: "Charcoal" },
  steel: { brand_primary: "#3b82a0", brand_hover: "#2f6880", ink: "#0f2740", label: "Steel" },
  teal: { brand_primary: "#0f766e", brand_hover: "#0c5f59", ink: "#134e4a", label: "Teal" },
  forest: { brand_primary: "#166534", brand_hover: "#14532d", ink: "#052e16", label: "Forest" },
  indigo: { brand_primary: "#4338ca", brand_hover: "#3730a3", ink: "#1e1b4b", label: "Indigo" },
  ocean: { brand_primary: "#0369a1", brand_hover: "#075985", ink: "#0c4a6e", label: "Ocean" },
  graphite: { brand_primary: "#4b5563", brand_hover: "#374151", ink: "#111827", label: "Graphite" },
  burgundy: { brand_primary: "#9f1239", brand_hover: "#881337", ink: "#4c0519", label: "Burgundy" },
  bronze: { brand_primary: "#92400e", brand_hover: "#78350f", ink: "#451a03", label: "Bronze" },
  midnight: { brand_primary: "#1e293b", brand_hover: "#0f172a", ink: "#020617", label: "Midnight" },
  royal: { brand_primary: "#1d4ed8", brand_hover: "#1e40af", ink: "#172554", label: "Royal" },
  emerald: { brand_primary: "#047857", brand_hover: "#065f46", ink: "#064e3b", label: "Emerald" },
  plum: { brand_primary: "#6b21a8", brand_hover: "#581c87", ink: "#3b0764", label: "Plum" },
  sapphire: { brand_primary: "#155e97", brand_hover: "#0f4c7a", ink: "#0c3a5e", label: "Sapphire" },
  olive: { brand_primary: "#4d7c0f", brand_hover: "#3f6212", ink: "#1a2e05", label: "Olive" },
  espresso: { brand_primary: "#573b2a", brand_hover: "#44301f", ink: "#231a12", label: "Espresso" },
  gunmetal: { brand_primary: "#334155", brand_hover: "#1e293b", ink: "#0f172a", label: "Gunmetal" },

  // Dark bluish — professional
  cobalt: { brand_primary: "#1e40af", brand_hover: "#1e3a8a", ink: "#0b1638", label: "Cobalt" },
  admiral: { brand_primary: "#1e4a8c", brand_hover: "#163a70", ink: "#0a1628", label: "Admiral" },
  atlantic: { brand_primary: "#0b5f8a", brand_hover: "#084868", ink: "#062033", label: "Atlantic" },
  denim: { brand_primary: "#2b5a8a", brand_hover: "#21456b", ink: "#0f1e2e", label: "Denim" },
  abyss: { brand_primary: "#1a3a5c", brand_hover: "#132c46", ink: "#070f18", label: "Abyss" },
  twilight: { brand_primary: "#2a3f8f", brand_hover: "#223272", ink: "#0d1228", label: "Twilight" },
  frost: { brand_primary: "#3b6ea8", brand_hover: "#2f5886", ink: "#142436", label: "Frost" },
  corporate: { brand_primary: "#0f3d7a", brand_hover: "#0c3162", ink: "#081628", label: "Corporate" },
  arctic: { brand_primary: "#2563a8", brand_hover: "#1d4f86", ink: "#0e2438", label: "Arctic" },
  deep_sea: { brand_primary: "#0e4d6b", brand_hover: "#0b3b52", ink: "#061820", label: "Deep Sea" },

  // Greenish — professional
  moss: { brand_primary: "#3f6b4a", brand_hover: "#33563c", ink: "#142018", label: "Moss" },
  sage: { brand_primary: "#5a7a5e", brand_hover: "#48624b", ink: "#1a241c", label: "Sage" },
  pine: { brand_primary: "#1f5c45", brand_hover: "#184a37", ink: "#0a1f17", label: "Pine" },
  jade: { brand_primary: "#0d7377", brand_hover: "#0a5c5f", ink: "#062628", label: "Jade" },
  verdant: { brand_primary: "#2f6b3a", brand_hover: "#25562e", ink: "#102016", label: "Verdant" },
  kelp: { brand_primary: "#3d6b4f", brand_hover: "#315640", ink: "#152218", label: "Kelp" },
  cedar: { brand_primary: "#4a6b3a", brand_hover: "#3b562e", ink: "#182214", label: "Cedar" },
  mint: { brand_primary: "#2d8a6e", brand_hover: "#246e58", ink: "#0f2e26", label: "Mint" },
  fern: { brand_primary: "#3a7a4a", brand_hover: "#2e623b", ink: "#142418", label: "Fern" },
  lagoon: { brand_primary: "#0f7a6a", brand_hover: "#0c6155", ink: "#062820", label: "Lagoon" },
};

export const SURFACE_MODES = [
  { value: "alternating", label: "Alternating white / grey" },
  { value: "light", label: "All light" },
  { value: "muted", label: "All muted grey" },
  { value: "dark", label: "All dark (ink)" },
  { value: "transparent", label: "No surface (transparent)" },
];

export const THEME_FIELD_KEYS = [
  "preset",
  "brand_primary",
  "brand_hover",
  "ink",
  "page_bg_color",
  "page_bg_img",
  "surface_mode",
];

export function defaultSiteTheme() {
  return {
    preset: "blue",
    ...THEME_PRESETS.blue,
    page_bg_color: "",
    page_bg_img: "",
    surface_mode: "alternating",
  };
}

export function emptyPageTheme() {
  return {
    preset: null,
    brand_primary: null,
    brand_hover: null,
    ink: null,
    page_bg_color: null,
    page_bg_img: null,
    surface_mode: null,
  };
}

function hasValue(v) {
  return v !== null && v !== undefined && String(v).trim() !== "";
}

/**
 * Normalize stored page/entity theme so blank strings read as inherit (null).
 */
export function normalizePageTheme(theme) {
  const out = { ...emptyPageTheme() };
  if (!theme || typeof theme !== "object") return out;
  for (const key of THEME_FIELD_KEYS) {
    const v = theme[key];
    out[key] = hasValue(v) ? v : null;
  }
  return out;
}

export function applyPresetFill(theme) {
  const out = { ...(theme || {}) };
  const preset = THEME_PRESETS[String(out.preset || "").toLowerCase()];
  if (!preset) return out;
  if (!hasValue(out.brand_primary)) out.brand_primary = preset.brand_primary;
  if (!hasValue(out.brand_hover)) out.brand_hover = preset.brand_hover;
  if (!hasValue(out.ink)) out.ink = preset.ink;
  return out;
}

export function mergeTheme(...layers) {
  let out = applyPresetFill({ ...defaultSiteTheme() });

  for (const layer of layers) {
    if (!layer || typeof layer !== "object") continue;
    const override = layer;

    for (const key of THEME_FIELD_KEYS) {
      if (hasValue(override[key])) out[key] = override[key];
    }

    if (hasValue(override.preset)) {
      const preset = THEME_PRESETS[String(override.preset).toLowerCase()];
      if (preset) {
        if (!hasValue(override.brand_primary))
          out.brand_primary = preset.brand_primary;
        if (!hasValue(override.brand_hover))
          out.brand_hover = preset.brand_hover;
        if (!hasValue(override.ink)) out.ink = preset.ink;
      }
    }
  }

  return out;
}

/** CSS custom properties for brand / ink */
export function themeCssVars(theme) {
  const t = applyPresetFill({ ...defaultSiteTheme(), ...(theme || {}) });
  const vars = {};
  if (hasValue(t.brand_primary)) vars["--brand"] = t.brand_primary;
  if (hasValue(t.brand_hover)) vars["--brand-hover"] = t.brand_hover;
  if (hasValue(t.ink)) vars["--ink"] = t.ink;
  return vars;
}

/** Inline page background from theme (color or image) */
export function pageBgStyle(theme) {
  const t = theme || {};
  const img = String(t.page_bg_img || "").trim();
  const color = String(t.page_bg_color || "").trim();
  if (img) {
    return {
      backgroundImage: `url(${img})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }
  if (color) {
    if (color.toLowerCase().includes("gradient(")) {
      return { backgroundImage: color };
    }
    return { backgroundColor: color };
  }
  return undefined;
}

/**
 * Resolve section surface tone from page theme surface_mode.
 * Returns null for transparent / none — section stays clear so page bg shows
 * (unless the section has its own section_bg_*).
 */
export function surfaceToneForMode(surfaceMode, altIndex) {
  const mode = String(surfaceMode || "alternating").toLowerCase();
  if (mode === "transparent" || mode === "none") return null;
  if (mode === "light") return "white";
  if (mode === "muted") return "muted";
  if (mode === "dark") return "dark";
  // alternating
  return altIndex % 2 === 0 ? "white" : "muted";
}
