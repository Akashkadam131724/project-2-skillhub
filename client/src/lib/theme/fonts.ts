/** Curated Google fonts — keys are stored on site / page theme. */

export const FONT_PRESETS = {
  manrope: {
    label: "Manrope",
    family: "Manrope",
    google: "Manrope:wght@400;500;600;700;800",
    bundled: true,
  },
  fraunces: {
    label: "Fraunces",
    family: "Fraunces",
    google: "Fraunces:opsz,wght@9..144,400;500;600;700",
    bundled: true,
  },
  inter: {
    label: "Inter",
    family: "Inter",
    google: "Inter:wght@400;500;600;700",
  },
  source_sans: {
    label: "Source Sans 3",
    family: "Source Sans 3",
    google: "Source+Sans+3:wght@400;500;600;700",
  },
  dm_sans: {
    label: "DM Sans",
    family: "DM Sans",
    google: "DM+Sans:wght@400;500;600;700",
  },
  outfit: {
    label: "Outfit",
    family: "Outfit",
    google: "Outfit:wght@400;500;600;700",
  },
  poppins: {
    label: "Poppins",
    family: "Poppins",
    google: "Poppins:wght@400;500;600;700",
  },
  nunito_sans: {
    label: "Nunito Sans",
    family: "Nunito Sans",
    google: "Nunito+Sans:wght@400;500;600;700",
  },
  ibm_plex_sans: {
    label: "IBM Plex Sans",
    family: "IBM Plex Sans",
    google: "IBM+Plex+Sans:wght@400;500;600;700",
  },
  space_grotesk: {
    label: "Space Grotesk",
    family: "Space Grotesk",
    google: "Space+Grotesk:wght@400;500;600;700",
  },
  playfair: {
    label: "Playfair Display",
    family: "Playfair Display",
    google: "Playfair+Display:wght@400;500;600;700",
  },
  libre_baskerville: {
    label: "Libre Baskerville",
    family: "Libre Baskerville",
    google: "Libre+Baskerville:wght@400;700",
  },
} as const;

export type FontPresetKey = keyof typeof FONT_PRESETS;

/** One site-wide face — banner title, body, and headings. */
export const DEFAULT_FONT_FAMILY: FontPresetKey = "manrope";
export const DEFAULT_FONT_SANS = DEFAULT_FONT_FAMILY;
export const DEFAULT_FONT_DISPLAY = DEFAULT_FONT_FAMILY;

export function resolveFontPreset(key: unknown) {
  const raw = String(key || "")
    .trim()
    .toLowerCase() as FontPresetKey;
  return FONT_PRESETS[raw] || FONT_PRESETS[DEFAULT_FONT_FAMILY];
}

export function resolveThemeFontKey(theme: unknown) {
  const source =
    theme && typeof theme === "object"
      ? (theme as Record<string, unknown>)
      : {};
  for (const key of ["font_family", "font_sans", "font_display"]) {
    const raw = String(source[key] || "")
      .trim()
      .toLowerCase();
    if (raw && raw in FONT_PRESETS) return raw as FontPresetKey;
  }
  return DEFAULT_FONT_FAMILY;
}

export function fontFamilyStack(key: unknown) {
  const preset = resolveFontPreset(key);
  return `"${preset.family}", ui-sans-serif, system-ui, sans-serif`;
}

export function googleFontsStylesheetHref(theme: unknown) {
  const key = resolveThemeFontKey(theme);
  const preset = FONT_PRESETS[key];
  if (!preset || ("bundled" in preset && preset.bundled)) return "";
  return `https://fonts.googleapis.com/css2?family=${preset.google}&display=swap`;
}
