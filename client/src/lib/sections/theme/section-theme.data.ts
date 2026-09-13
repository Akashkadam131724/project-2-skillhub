/**
 * Section theme — static key lists and CMS option metadata.
 *
 * Runtime helpers: `../section-theme.js` (re-exports this file).
 *
 * Theme model (simplified):
 *  - Site / page: colors + surface pattern (white/grey stripes for normal sections)
 *  - Section bands / section_theme / section_bg_*: removed from the product
 *  - Dark sections: baked into the component — listed in SECTION_DARK_BG_KEYS
 */

/** @deprecated Placement section_theme is ignored at runtime. Kept for stale CMS labels. */
export const SECTION_THEME_VALUES = ["inherit", "light", "dark"];

/** @deprecated */
export const SECTION_THEME_OPTIONS = [
  { value: "inherit", label: "Inherit (site page theme)" },
  { value: "light", label: "Light band" },
  { value: "dark", label: "Dark band" },
];

/**
 * Canonical list — sections that always paint their own dark (or ink) background.
 * They skip page surface-pattern striping. Keep this list updated when adding dark sections.
 */
export const SECTION_DARK_BG_KEYS = new Set([
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
  "metric_rail",
  "vendor_link_grid",
]);

/**
 * Sections that ship their own full-bleed background (dark or otherwise) —
 * no page surface stripe paint from SectionSurface.
 */
export const SECTION_THEME_BAND_SKIP_KEYS = new Set([
  "in_page_nav",
  "cta_band",
  "split_cta",
  "promo_modal",
  ...SECTION_DARK_BG_KEYS,
]);

/**
 * @deprecated Prefer SECTION_DARK_BG_KEYS. Alias for older imports.
 */
export const SECTION_FIXED_BAND_THEME_KEYS = new Set([
  ...SECTION_DARK_BG_KEYS,
  "orbit_hero",
  "template_gallery",
  "sarder_ecosystem",
  "in_page_nav",
  "promo_modal",
]);

/** @deprecated Use SECTION_DARK_BG_KEYS */
export const SECTION_FIXED_DARK_BAND_KEYS = SECTION_DARK_BG_KEYS;

/** Fixed light full-bleed sections — skip stripe; component owns palette. */
export const SECTION_FIXED_LIGHT_BAND_KEYS = new Set([
  "orbit_hero",
  "template_gallery",
  "sarder_ecosystem",
]);

/**
 * Sections that paint their own band — skip page alternating fill.
 * Includes dark list + light fixed heroes/galleries.
 */
export const SECTION_OWN_BAND_KEYS = new Set([
  ...SECTION_DARK_BG_KEYS,
  ...SECTION_FIXED_LIGHT_BAND_KEYS,
]);

/**
 * @deprecated Registry seed hint only — runtime no longer forces dark via section_theme.
 */
export const SECTION_INHERIT_DARK_BAND_KEYS = SECTION_DARK_BG_KEYS;

/** Placements that never advance the page white/grey alternation counter. */
export const SECTION_ALTERNATION_SKIP_KEYS = new Set([
  "in_page_nav",
  "promo_modal",
  ...SECTION_DARK_BG_KEYS,
  ...SECTION_FIXED_LIGHT_BAND_KEYS,
]);
