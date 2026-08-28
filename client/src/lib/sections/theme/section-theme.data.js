/**
 * Section theme — static key lists and CMS option metadata.
 *
 * Runtime helpers: `../section-theme.js` (re-exports this file).
 * When adding a section with special band behavior, update the relevant Set below.
 */

/** Allowed `section_theme` values on placements. */
export const SECTION_THEME_VALUES = ["inherit", "light", "dark"];

/** CMS band theme picker labels. */
export const SECTION_THEME_OPTIONS = [
  { value: "inherit", label: "Inherit (site page theme)" },
  { value: "light", label: "Light band" },
  { value: "dark", label: "Dark band" },
];

/**
 * Sections that ship their own full-bleed background — theme only adjusts text tokens.
 * Also used by SectionThemeWrap / page-section-placement (no SectionSurface band).
 */
export const SECTION_THEME_BAND_SKIP_KEYS = new Set([
  "in_page_nav",
  "cta_band",
  "split_cta",
  "promo_modal",
]);

/**
 * Sections with a baked-in light or dark palette — band theme has no effect on layout.
 * Hide the theme switch in Section band editors.
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

/** Fixed dark full-bleed sections — used for CMS hint copy. */
export const SECTION_FIXED_DARK_BAND_KEYS = new Set([
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

/** Fixed light full-bleed sections — used for CMS hint copy. */
export const SECTION_FIXED_LIGHT_BAND_KEYS = new Set([
  "orbit_hero",
  "template_gallery",
]);

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

/**
 * Full-bleed sections that default to a dark band when section_theme is inherit.
 * Registry seed hint only — not a runtime override.
 */
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

/** Placements that never advance the page white/grey alternation counter. */
export const SECTION_ALTERNATION_SKIP_KEYS = new Set([
  "in_page_nav",
  "promo_modal",
]);
