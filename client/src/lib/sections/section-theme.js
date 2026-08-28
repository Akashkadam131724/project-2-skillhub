/**
 * Per-placement section theme — top-level `section_theme` on placements.
 * Legacy rows may still have `data.section_theme`. `inherit` follows page alternation.
 */

import {
  isPageSurfaceTransparent,
  resolveSurfacePattern,
  surfaceBandAtIndex,
} from "@/lib/theme";

export { isPageSurfaceTransparent };

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
} from "./section-design-system";

export const SECTION_THEME_VALUES = ["inherit", "light", "dark"];

export const SECTION_THEME_OPTIONS = [
  { value: "inherit", label: "Inherit (site page theme)" },
  { value: "light", label: "Light band" },
  { value: "dark", label: "Dark band" },
];

/** UI / API raw value → canonical theme token. */
export function parseSectionThemeRaw(raw) {
  const v = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (!v || v === "inherit") return "inherit";
  if (v === "light" || v === "dark") return v;
  return "inherit";
}

/** Value stored at the current edit layer (null/"" = inherit at this layer). */
export function sectionThemeUiValue(raw) {
  return parseSectionThemeRaw(raw);
}

/**
 * Resolved placement `section_theme` after catalog → template → page cascade.
 * @param {object} placement
 */
export function normalizeSectionTheme(placement) {
  if (!placement) return "inherit";
  const raw =
    placement.section_theme ??
    placement.sectionTheme ??
    placement.data?.section_theme;
  return parseSectionThemeRaw(raw);
}

/**
 * Registry fallback when every layer is inherit (code default before DB seed).
 */
export function getRegistryDefaultBandTheme(sectionKey, renderKey) {
  const key = String(renderKey || sectionKey || "")
    .trim()
    .toLowerCase();
  if (!key) return "inherit";
  if (SECTION_INHERIT_DARK_BAND_KEYS.has(key)) return "dark";
  return "inherit";
}

/**
 * Theme used for rendering bands / tokens — placement cascade only.
 * Registry defaults (SECTION_INHERIT_DARK_BAND_KEYS) are seed hints, not runtime overrides.
 */
export function resolveEffectiveSectionTheme(placement) {
  return normalizeSectionTheme(placement);
}

/** Maps section theme to SectionSurface tone (null = keep computed tone). */
export function surfaceToneForSectionTheme(theme) {
  if (theme === "dark") return "dark";
  if (theme === "light") return "white";
  return null;
}
export function isSectionThemeLightBand(placement) {
  return normalizeSectionTheme(placement) === "light";
}

/** True when CMS section theme forces a dark band (ink surface + light text). */
export function isSectionThemeDarkBand(placement) {
  return normalizeSectionTheme(placement) === "dark";
}

/** True when surface tone is a dark band (charcoal or brand ink). */
export function isSurfaceToneDark(surfaceTone) {
  return surfaceTone === "dark" || surfaceTone === "dark_ink";
}

/** Dark band from CMS theme and/or page alternation (surfaceBand / surfaceTone). */
export function isPlacementDarkBand({
  section_theme,
  sectionTheme,
  surfaceTone,
  surfaceBand,
} = {}) {
  const t = normalizeSectionTheme({
    section_theme: section_theme ?? sectionTheme,
  });
  if (t === "dark") return true;
  if (t === "light") return false;
  if (surfaceBand?.theme === "dark") return true;
  if (surfaceBand?.theme === "light") return false;
  return isSurfaceToneDark(surfaceTone);
}

/**
 * @deprecated Band background comes from SectionSurface / page theme only.
 */
export function sectionSoftLightGradientClass() {
  return "";
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

/**
 * Sections with a baked-in light or dark palette — band theme has no effect on layout.
 * Hide the theme switch in Section band editors (e.g. editorial_banner: always dark + white text).
 */
export const SECTION_FIXED_BAND_THEME_KEYS = new Set([
  /* Always dark, light text */
  "editorial_banner",
  "statement_band",
  "cta_band",
  "split_cta",
  "video_banner",
  "site_builder_hero",
  "domain_search_band",
  "horizon_gallery",
  "hero_media",
  "hero_gradient_slider",
  /* Fixed light / warm palette */
  "orbit_hero",
  "template_gallery",
  /* Chrome / overlay */
  "in_page_nav",
  "promo_modal",
]);

/** True when band light/dark theme can be changed for this section type. */
export function sectionSupportsBandTheme(sectionKey, renderKey) {
  const key = String(renderKey || sectionKey || "")
    .trim()
    .toLowerCase();
  if (!key) return true;
  return !SECTION_FIXED_BAND_THEME_KEYS.has(key);
}

export function sectionFixedBandThemeHint(sectionKey, renderKey) {
  const key = String(renderKey || sectionKey || "")
    .trim()
    .toLowerCase();
  if (!sectionSupportsBandTheme(sectionKey, renderKey)) {
    const darkKeys = new Set([
      "editorial_banner",
      "statement_band",
      "cta_band",
      "split_cta",
      "video_banner",
      "site_builder_hero",
      "domain_search_band",
      "horizon_gallery",
      "hero_media",
      "hero_gradient_slider",
    ]);
    if (darkKeys.has(key)) {
      return "This section uses a fixed dark band with light text — band theme does not apply.";
    }
    if (key === "orbit_hero" || key === "template_gallery") {
      return "This section uses a fixed light palette — band theme does not apply.";
    }
    return "This section uses a fixed style — band theme does not apply.";
  }
  return "";
}

/**
 * Hero / banner sections that paint their own band when `section_theme` is inherit
 * and no section background is set — skip page alternating fill from SectionSurface.
 */
export const SECTION_OWN_BAND_KEYS = new Set([
  "hero_media",
  "hero_gradient_slider",
  "editorial_banner",
  "statement_band",
  "video_banner",
  "site_builder_hero",
  "orbit_hero",
  "domain_search_band",
  "horizon_gallery",
  "template_gallery",
]);

/** True when SectionSurface should not paint inherited page band fill. */
export function sectionSkipsInheritedBandPaint(sectionKey) {
  const key = String(sectionKey || "")
    .trim()
    .toLowerCase();
  return (
    SECTION_OWN_BAND_KEYS.has(key) || SECTION_THEME_BAND_SKIP_KEYS.has(key)
  );
}

/**
 * True when a placement should advance the page band alternation counter.
 * Heroes / CTAs with their own band, nav, and overlays do not consume a slot.
 */
export function placementAdvancesAlternationIndex(section) {
  const key = String(section?.section_key || "")
    .trim()
    .toLowerCase();
  if (!key || key === "in_page_nav" || key === "promo_modal") return false;
  if (SECTION_THEME_BAND_SKIP_KEYS.has(key)) return false;
  if (sectionSkipsInheritedBandPaint(key)) return false;
  return true;
}

/** Full-bleed sections that default to a dark band when section_theme is inherit. */
export const SECTION_INHERIT_DARK_BAND_KEYS = new Set([
  "cta_band",
  "split_cta",
  "domain_search_band",
  "statement_band",
  "editorial_banner",
  "video_banner",
  "metric_rail",
  "vendor_link_grid",
]);

/**
 * Same surface / theme resolution as live page stack (one placement).
 * @param {{ current: number }} [altIndex] - mutable counter for alternating bands
 */
export function computePlacementSurface(
  section,
  { pageTheme, pageSurfaceMode, altIndex = { current: 0 } } = {}
) {
  const themePref = normalizeSectionTheme(section);
  const themeTone = surfaceToneForSectionTheme(themePref);
  const hasCustomBg = Boolean(
    section?.section_bg_img ||
    section?.section_bg_color ||
    section?.data?.bg_color
  );
  const resolvedTheme =
    pageTheme && typeof pageTheme === "object"
      ? pageTheme
      : { surface_mode: pageSurfaceMode || "alternating" };
  const pattern = resolveSurfacePattern(resolvedTheme);
  const isTransparent = isPageSurfaceTransparent(pattern);

  let surfaceBand;
  let surfaceTone;
  let surfaceBandIndex;
  if (isTransparent && !hasCustomBg) {
    surfaceBand = null;
    surfaceTone = null;
  } else if (themeTone) {
    surfaceTone = themeTone;
    surfaceBand = null;
  } else if (!hasCustomBg) {
    const index = altIndex.current;
    surfaceBand = surfaceBandAtIndex(pattern, index, {
      ink: resolvedTheme.ink,
    });
    surfaceBandIndex = index;
    if (placementAdvancesAlternationIndex(section)) {
      altIndex.current += 1;
    }
    surfaceTone = undefined;
  }

  return {
    sectionTheme: themePref,
    surfaceBand: hasCustomBg && !themeTone ? undefined : surfaceBand,
    surfaceTone: hasCustomBg && !themeTone ? undefined : surfaceTone,
    surfaceBandIndex,
  };
}
