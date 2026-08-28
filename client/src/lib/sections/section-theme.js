/**
 * Section theme — barrel re-export for backward-compatible imports.
 *
 * Static key lists: `./theme/section-theme.data.js`
 * Runtime helpers:  `./theme/section-theme.runtime.js`
 */

export {
  SECTION_THEME_VALUES,
  SECTION_THEME_OPTIONS,
  SECTION_THEME_BAND_SKIP_KEYS,
  SECTION_FIXED_BAND_THEME_KEYS,
  SECTION_FIXED_DARK_BAND_KEYS,
  SECTION_FIXED_LIGHT_BAND_KEYS,
  SECTION_OWN_BAND_KEYS,
  SECTION_INHERIT_DARK_BAND_KEYS,
  SECTION_ALTERNATION_SKIP_KEYS,
} from "./theme/section-theme.data.js";

export {
  isPageSurfaceTransparent,
  parseSectionThemeRaw,
  sectionThemeUiValue,
  normalizeSectionTheme,
  getRegistryDefaultBandTheme,
  resolveEffectiveSectionTheme,
  surfaceToneForSectionTheme,
  isSectionThemeLightBand,
  isSectionThemeDarkBand,
  isSurfaceToneDark,
  isPlacementDarkBand,
  sectionSoftLightGradientClass,
  sectionThemeFromProps,
  sectionThemeDataAttribute,
  sectionThemeBandClass,
  sectionSupportsBandTheme,
  sectionFixedBandThemeHint,
  sectionSkipsInheritedBandPaint,
  placementAdvancesAlternationIndex,
  computePlacementSurface,
} from "./theme/section-theme.runtime.js";

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
