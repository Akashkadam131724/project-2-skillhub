/**
 * Per-placement section theme — top-level `section_theme` on placements.
 * Legacy rows may still have `data.section_theme`. `inherit` follows page alternation.
 */

import { sectionUsesAltSurface } from "@/lib/section-registry";
import { surfaceToneForMode } from "@/lib/theme";

export {
  SECTION_SURFACE_LIGHT_CARD,
  SECTION_SURFACE_DARK_OVERLAY,
  SECTION_LIGHT_CARD_CLASS,
  sectionLightCardSurfaceProps,
  SECTION_ITEM_TITLE_CLASS,
  SECTION_ITEM_MUTED_CLASS,
  DS_TEXT,
  DS_FIELD,
  DS_CARD,
  DS_BAND,
} from "@/lib/section-design-system";

export const SECTION_THEME_VALUES = ["inherit", "light", "dark"];

export const SECTION_THEME_OPTIONS = [
  { value: "inherit", label: "Inherit (page theme)" },
  { value: "light", label: "Light band" },
  { value: "dark", label: "Dark band" },
];

/** @param {object} placement — section / resolved placement (optional `.data`) */
export function normalizeSectionTheme(_placement) {
  // Band light/dark is controlled by page theme (surface mode) only — not per-section overrides.
  return "inherit";
}

/** Maps section theme to SectionSurface tone (null = keep computed tone). */
export function surfaceToneForSectionTheme(theme) {
  if (theme === "dark") return "dark";
  if (theme === "light") return "white";
  return null;
}

/** True when CMS section theme forces a light band (white surface + ink text). */
export function isSectionThemeLightBand(placement) {
  return normalizeSectionTheme(placement) === "light";
}

/** True when CMS section theme forces a dark band (ink surface + light text). */
export function isSectionThemeDarkBand(placement) {
  return normalizeSectionTheme(placement) === "dark";
}

/** Dark band from CMS theme and/or page alternation (surfaceTone). */
export function isPlacementDarkBand({
  section_theme,
  sectionTheme,
  surfaceTone,
} = {}) {
  const t = normalizeSectionTheme({
    section_theme: section_theme ?? sectionTheme,
  });
  if (t === "dark") return true;
  if (t === "light") return false;
  return surfaceTone === "dark";
}

/**
 * Soft top gradient for alt sections — only on inherit + non-dark page band.
 * Forced light/dark themes rely on SectionSurface; dark bands must stay clear.
 */
export function sectionSoftLightGradientClass(sectionTheme, surfaceTone) {
  const t = normalizeSectionTheme(
    typeof sectionTheme === "string"
      ? { section_theme: sectionTheme }
      : sectionTheme || {}
  );
  if (t === "dark" || t === "light") return "";
  if (surfaceTone === "dark") return "";
  return "bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_40%,#ffffff_100%)] dark:bg-none";
}

/** Item / card titles inside SectionFrame sections — see DS_TEXT in section-design-system.js */

/** Read theme from common section component props. */
export function sectionThemeFromProps(props = {}) {
  return normalizeSectionTheme({
    section_theme: props.section_theme ?? props.sectionTheme,
  });
}

export function sectionThemeDataAttribute(themeOrPlacement) {
  const t =
    typeof themeOrPlacement === "string"
      ? normalizeSectionTheme({ section_theme: themeOrPlacement })
      : normalizeSectionTheme(themeOrPlacement);
  if (t === "inherit") return undefined;
  return t;
}

/** Band background when section theme forces light/dark (not for inherit). */
export function sectionThemeBandClass(themePref) {
  if (themePref === "dark") return "bg-ink text-white";
  if (themePref === "light") return "bg-white text-slate-800";
  return "";
}

/** Sections that ship their own full-bleed background — theme only adjusts text tokens. */
export const SECTION_THEME_BAND_SKIP_KEYS = new Set([
  "in_page_nav",
  "cta_band",
  "split_cta",
  "promo_modal",
]);

/** Full-bleed sections that default to a dark band when section_theme is inherit. */
export const SECTION_INHERIT_DARK_BAND_KEYS = new Set([
  "cta_band",
  "split_cta",
  "domain_search_band",
  "statement_band",
  "editorial_banner",
  "video_banner",
  "hero_stats",
  "metric_rail",
]);

/**
 * Same surface / theme resolution as live page stack (one placement).
 * @param {{ current: number }} [altIndex] - mutable counter for alternating bands
 */
export function computePlacementSurface(
  section,
  { pageSurfaceMode = "alternating", altIndex = { current: 0 } } = {}
) {
  const themePref = normalizeSectionTheme(section);
  const themeTone = surfaceToneForSectionTheme(themePref);
  const hasCustomBg = Boolean(
    section?.section_bg_img ||
    section?.section_bg_color ||
    section?.data?.bg_color
  );
  const mode = pageSurfaceMode || "alternating";
  const isTransparent =
    String(mode).toLowerCase() === "transparent" ||
    String(mode).toLowerCase() === "none";
  const usesAlt =
    !hasCustomBg &&
    !isTransparent &&
    sectionUsesAltSurface(section?.section_key, section?.render_key);

  let surfaceTone;
  if (themeTone) {
    surfaceTone = themeTone;
  } else if (isTransparent && !hasCustomBg) {
    surfaceTone = null;
  } else if (usesAlt) {
    surfaceTone = surfaceToneForMode(mode, altIndex.current);
    altIndex.current += 1;
  }

  return {
    sectionTheme: themePref,
    surfaceTone: hasCustomBg && !themeTone ? undefined : surfaceTone,
  };
}
