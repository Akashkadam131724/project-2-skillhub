/**
 * Shared CMS theme shape — SiteTheme (global) + Page.theme (template override).
 * Empty / null page fields inherit from the site theme.
 */

export const THEME_PRESETS = {
  // Existing
  blue: { brand_primary: "#1b4de4", brand_hover: "#153fc0", ink: "#0b1f4d" },
  navy: { brand_primary: "#1e3a8a", brand_hover: "#1e40af", ink: "#0f172a" },
  slate: { brand_primary: "#475569", brand_hover: "#334155", ink: "#0f172a" },
  charcoal: { brand_primary: "#374151", brand_hover: "#1f2937", ink: "#111827" },
  steel: { brand_primary: "#3b82a0", brand_hover: "#2f6880", ink: "#0f2740" },
  teal: { brand_primary: "#0f766e", brand_hover: "#0c5f59", ink: "#134e4a" },
  forest: { brand_primary: "#166534", brand_hover: "#14532d", ink: "#052e16" },
  indigo: { brand_primary: "#4338ca", brand_hover: "#3730a3", ink: "#1e1b4b" },
  ocean: { brand_primary: "#0369a1", brand_hover: "#075985", ink: "#0c4a6e" },
  graphite: { brand_primary: "#4b5563", brand_hover: "#374151", ink: "#111827" },
  burgundy: { brand_primary: "#9f1239", brand_hover: "#881337", ink: "#4c0519" },
  bronze: { brand_primary: "#92400e", brand_hover: "#78350f", ink: "#451a03" },
  midnight: { brand_primary: "#1e293b", brand_hover: "#0f172a", ink: "#020617" },
  royal: { brand_primary: "#1d4ed8", brand_hover: "#1e40af", ink: "#172554" },
  emerald: { brand_primary: "#047857", brand_hover: "#065f46", ink: "#064e3b" },
  plum: { brand_primary: "#6b21a8", brand_hover: "#581c87", ink: "#3b0764" },
  sapphire: { brand_primary: "#155e97", brand_hover: "#0f4c7a", ink: "#0c3a5e" },
  olive: { brand_primary: "#4d7c0f", brand_hover: "#3f6212", ink: "#1a2e05" },
  espresso: { brand_primary: "#573b2a", brand_hover: "#44301f", ink: "#231a12" },
  gunmetal: { brand_primary: "#334155", brand_hover: "#1e293b", ink: "#0f172a" },

  // Dark bluish — professional
  cobalt: { brand_primary: "#1e40af", brand_hover: "#1e3a8a", ink: "#0b1638" },
  admiral: { brand_primary: "#1e4a8c", brand_hover: "#163a70", ink: "#0a1628" },
  atlantic: { brand_primary: "#0b5f8a", brand_hover: "#084868", ink: "#062033" },
  denim: { brand_primary: "#2b5a8a", brand_hover: "#21456b", ink: "#0f1e2e" },
  abyss: { brand_primary: "#1a3a5c", brand_hover: "#132c46", ink: "#070f18" },
  twilight: { brand_primary: "#2a3f8f", brand_hover: "#223272", ink: "#0d1228" },
  frost: { brand_primary: "#3b6ea8", brand_hover: "#2f5886", ink: "#142436" },
  corporate: { brand_primary: "#0f3d7a", brand_hover: "#0c3162", ink: "#081628" },
  arctic: { brand_primary: "#2563a8", brand_hover: "#1d4f86", ink: "#0e2438" },
  deep_sea: { brand_primary: "#0e4d6b", brand_hover: "#0b3b52", ink: "#061820" },

  // Greenish — professional
  moss: { brand_primary: "#3f6b4a", brand_hover: "#33563c", ink: "#142018" },
  sage: { brand_primary: "#5a7a5e", brand_hover: "#48624b", ink: "#1a241c" },
  pine: { brand_primary: "#1f5c45", brand_hover: "#184a37", ink: "#0a1f17" },
  jade: { brand_primary: "#0d7377", brand_hover: "#0a5c5f", ink: "#062628" },
  verdant: { brand_primary: "#2f6b3a", brand_hover: "#25562e", ink: "#102016" },
  kelp: { brand_primary: "#3d6b4f", brand_hover: "#315640", ink: "#152218" },
  cedar: { brand_primary: "#4a6b3a", brand_hover: "#3b562e", ink: "#182214" },
  mint: { brand_primary: "#2d8a6e", brand_hover: "#246e58", ink: "#0f2e26" },
  fern: { brand_primary: "#3a7a4a", brand_hover: "#2e623b", ink: "#142418" },
  lagoon: { brand_primary: "#0f7a6a", brand_hover: "#0c6155", ink: "#062820" },
};

export const SURFACE_MODES = [
  "alternating",
  "light",
  "dark",
  "muted",
  "transparent",
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

/** Empty template override — inherit everything from site */
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
 * Apply named preset colors when preset is set and individual colors are empty.
 */
export function applyPresetFill(theme) {
  const out = { ...(theme || {}) };
  const presetKey = String(out.preset || "").toLowerCase();
  const preset = THEME_PRESETS[presetKey];
  if (!preset) return out;
  if (!hasValue(out.brand_primary)) out.brand_primary = preset.brand_primary;
  if (!hasValue(out.brand_hover)) out.brand_hover = preset.brand_hover;
  if (!hasValue(out.ink)) out.ink = preset.ink;
  return out;
}

/**
 * Merge theme layers left → right (later wins when non-empty).
 * Typical: mergeTheme(siteTheme, page.theme, entityPageTheme.theme)
 */
export function mergeTheme(...layers) {
  let out = applyPresetFill({ ...defaultSiteTheme() });

  for (const layer of layers) {
    if (!layer || typeof layer !== "object") continue;
    const override = layer;

    for (const key of THEME_FIELD_KEYS) {
      if (hasValue(override[key])) {
        out[key] = override[key];
      }
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

/**
 * Mongoose subdocument fields for SiteTheme (required defaults)
 * or Page.theme (nullable inherit).
 */
export function themeSchemaFields({ nullable = false } = {}) {
  const strDefault = nullable ? null : "";
  return {
    preset: {
      type: String,
      trim: true,
      lowercase: true,
      default: nullable ? null : "blue",
    },
    brand_primary: { type: String, trim: true, default: strDefault },
    brand_hover: { type: String, trim: true, default: strDefault },
    ink: { type: String, trim: true, default: strDefault },
    page_bg_color: {
      type: String,
      trim: true,
      default: strDefault,
      maxlength: 400,
    },
    page_bg_img: { type: String, trim: true, default: strDefault },
    surface_mode: {
      type: String,
      enum: nullable ? [...SURFACE_MODES, null] : SURFACE_MODES,
      default: nullable ? null : "alternating",
    },
  };
}

/** Pick only known theme keys from a request body */
export function pickThemePatch(body = {}) {
  if (!body || typeof body !== "object") return {};
  const patch = {};
  for (const key of THEME_FIELD_KEYS) {
    if (body[key] !== undefined) patch[key] = body[key];
  }
  return patch;
}
