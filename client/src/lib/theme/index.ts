/**
 * Client-side theme helpers — keep in sync with server theme.utils.js
 */

import {
  defaultSurfacePattern,
  normalizeSurfacePattern,
  resolveSurfacePattern,
  isPageSurfaceTransparent,
} from "./surface-patterns";
import {
  DEFAULT_FONT_FAMILY,
  fontFamilyStack,
  resolveThemeFontKey,
} from "./fonts";

export {
  SURFACE_MODES,
  SURFACE_MODE_GROUPS,
  SURFACE_MODE_VALUES,
  surfaceModeLabel,
  surfacePatternLabel,
  isPageSurfaceTransparent,
  isSurfacePatternTransparent,
  surfaceToneForMode,
  isSurfaceToneLight,
  isSurfaceBandLight,
  surfaceToneBandClass,
  surfaceBandShellClass,
  surfaceTonePreviewBg,
  surfaceTonePreviewLabel,
  surfaceBandPreviewBg,
  surfaceBandPreviewLabel,
  surfaceBandStyle,
  defaultSurfacePattern,
  normalizeSurfacePattern,
  resolveSurfacePattern,
  legacyPatternFromMode,
  surfaceBandAtIndex,
  resolveSurfaceBand,
  bandThemeFromBg,
} from "./surface-patterns";

export {
  DEFAULT_FONT_DISPLAY,
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SANS,
  FONT_PRESETS,
  fontFamilyStack,
  googleFontsStylesheetHref,
  resolveFontPreset,
  resolveThemeFontKey,
} from "./fonts";

export const THEME_PRESETS = {
  // Old homepage banner palette
  skillhub: {
    brand_primary: "#00236d",
    brand_hover: "#001a52",
    ink: "#0f172a",
    accent_blue: "#3b82f6",
    accent_purple: "#a855f7",
    accent_cyan: "#06b6d4",
    label: "SkillHub",
  },

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

export const SURFACE_DARK_BG = "#0f172a";
export const SURFACE_DARK_BG_SOFT = "#1e293b";

export const THEME_COLOR_KEYS = [
  "brand_primary",
  "brand_hover",
  "ink",
  "accent_blue",
  "accent_purple",
  "accent_cyan",
] as const;

export const THEME_FIELD_KEYS = [
  "preset",
  ...THEME_COLOR_KEYS,
  "font_family",
  "font_sans",
  "font_display",
  "surface_mode",
  "surface_pattern",
];

export function defaultSiteTheme() {
  return {
    preset: "blue",
    ...THEME_PRESETS.blue,
    font_family: DEFAULT_FONT_FAMILY,
    font_sans: DEFAULT_FONT_FAMILY,
    font_display: DEFAULT_FONT_FAMILY,
    surface_mode: "custom",
    surface_pattern: defaultSurfacePattern(),
  };
}

export function emptyPageTheme() {
  return {
    preset: null,
    brand_primary: null,
    brand_hover: null,
    ink: null,
    accent_blue: null,
    accent_purple: null,
    accent_cyan: null,
    font_family: null,
    font_sans: null,
    font_display: null,
    surface_mode: null,
    surface_pattern: null,
  };
}

function hasValue(v: unknown) {
  return v !== null && v !== undefined && String(v).trim() !== "";
}

/**
 * Normalize stored page/entity theme so blank strings read as inherit (null).
 */
export function normalizePageTheme(theme: unknown) {
  const out: Record<string, unknown> = { ...emptyPageTheme() };
  if (!theme || typeof theme !== "object") return out;
  const source = theme as Record<string, unknown>;
  for (const key of THEME_FIELD_KEYS) {
    const v = source[key];
    if (key === "surface_pattern") {
      out.surface_pattern =
        v && typeof v === "object" ? normalizeSurfacePattern(v) : null;
      continue;
    }
    out[key] = hasValue(v) ? v : null;
  }
  return out;
}

/** Full theme payload for API save (always sends every field). */
export function themeForApiSave(theme: unknown) {
  return normalizePageTheme(theme);
}

function presetColor(
  preset: Record<string, unknown>,
  key: (typeof THEME_COLOR_KEYS)[number]
) {
  if (hasValue(preset[key])) return String(preset[key]);
  if (key === "accent_blue") return String(preset.brand_primary || "");
  if (key === "accent_purple") return String(preset.brand_hover || "");
  if (key === "accent_cyan") return String(preset.ink || "");
  return "";
}

function fillMissingPresetColors(
  out: Record<string, unknown>,
  preset: Record<string, unknown>,
  override?: Record<string, unknown>
) {
  const source = override || out;
  for (const key of THEME_COLOR_KEYS) {
    if (hasValue(source[key])) continue;
    const next = presetColor(preset, key);
    if (next) out[key] = next;
  }
}

export function applyPresetFill(theme: Record<string, unknown> | null | undefined) {
  const out: Record<string, unknown> = { ...(theme || {}) };
  const presets = THEME_PRESETS as Record<string, Record<string, unknown>>;
  const preset = presets[String(out.preset || "").toLowerCase()];
  if (!preset) return out;
  fillMissingPresetColors(out, preset);
  return out;
}

export function mergeTheme(...layers: unknown[]) {
  let out = applyPresetFill({ ...defaultSiteTheme() }) as Record<string, unknown>;

  for (const layer of layers) {
    if (!layer || typeof layer !== "object") continue;
    const override = layer as Record<string, unknown>;
    const presets = THEME_PRESETS as Record<string, Record<string, unknown>>;

    for (const key of THEME_FIELD_KEYS) {
      if (key === "surface_pattern") {
        if (override.surface_pattern !== undefined && override.surface_pattern !== null) {
          out.surface_pattern = normalizeSurfacePattern(override.surface_pattern);
          out.surface_mode = "custom";
        }
        continue;
      }
      if (hasValue(override[key])) out[key] = override[key];
    }

    if (hasValue(override.preset)) {
      const preset = presets[String(override.preset).toLowerCase()];
      if (preset) fillMissingPresetColors(out, preset, override);
    }
  }

  return out;
}

/** CSS custom properties for brand / ink */
export function themeCssVars(theme: unknown) {
  const t = applyPresetFill({
    ...defaultSiteTheme(),
    ...((theme as Record<string, unknown>) || {}),
  });
  const vars: Record<string, string> = {};
  if (hasValue(t.brand_primary)) vars["--brand"] = String(t.brand_primary);
  if (hasValue(t.brand_hover)) vars["--brand-hover"] = String(t.brand_hover);
  if (hasValue(t.ink)) vars["--ink"] = String(t.ink);
  if (hasValue(t.accent_blue)) vars["--accent-blue"] = String(t.accent_blue);
  if (hasValue(t.accent_purple)) vars["--accent-purple"] = String(t.accent_purple);
  if (hasValue(t.accent_cyan)) vars["--accent-cyan"] = String(t.accent_cyan);
  const fontKey = resolveThemeFontKey(t);
  vars["--font-sans"] = fontFamilyStack(fontKey);
  vars["--font-display"] = fontFamilyStack(fontKey);
  return vars;
}

/** Inline page background from solid surface pattern. */
export function pageBgStyle(theme: unknown) {
  const t = applyPresetFill({
    ...defaultSiteTheme(),
    ...((theme as Record<string, unknown>) || {}),
  });
  const pattern = resolveSurfacePattern(t);
  if (isPageSurfaceTransparent(pattern)) {
    return undefined;
  }
  const solidBand = pattern.layout === "solid" ? pattern.bands[0] : null;
  if (solidBand?.bg) {
    const bg = String(solidBand.bg).trim();
    if (bg.toLowerCase().includes("gradient(")) {
      return { backgroundImage: bg };
    }
    if (bg === "var(--ink)") {
      return { backgroundColor: t.ink || SURFACE_DARK_BG };
    }
    return { backgroundColor: bg };
  }
  return undefined;
}
