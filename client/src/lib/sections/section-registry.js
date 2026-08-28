import {
  SECTION_ITEMS_CONFIG,
  sectionUsesItems,
  getSectionItemsConfig,
  sectionRequiresItems,
  resolveSectionBehaviorKey,
} from "./section-items-config.js";
import { getManifestEntry } from "./section-manifest-resolve";
import {
  SECTION_CATALOG,
  SECTION_CATEGORIES,
  SECTION_SURFACE,
  SECTION_USES_IMAGE,
  KNOWN_SECTION_KEYS,
  getSectionCatalogMeta,
  getSectionCatalogMetaByBehavior,
} from "./section-catalog.js";

export {
  SECTION_CATALOG,
  SECTION_CATEGORIES,
  SECTION_SURFACE,
  SECTION_USES_IMAGE,
  KNOWN_SECTION_KEYS,
  getSectionCatalogMeta,
  getSectionCatalogMetaByBehavior,
} from "./section-catalog.js";

/**
 * Sections whose layout uses `section_bg_img` / `section_bg_color` on the global shell.
 * All sections participate — editors can set band bg on any block.
 */
export function sectionUsesBg(_key) {
  return true;
}

/** All sections can edit section_bg_color on the global shell */
export function sectionUsesBgColor(_key) {
  return true;
}

export function sectionUsesImage(key, renderKey) {
  const behavior = resolveSectionBehaviorKey(key, renderKey);
  return Boolean(getSectionCatalogMetaByBehavior(behavior)?.uses_section_image);
}

export {
  SECTION_ITEMS_CONFIG,
  sectionUsesItems,
  getSectionItemsConfig,
  sectionRequiresItems,
  resolveSectionBehaviorKey,
};

export {
  shouldRenderPlacement,
  placementHasMeaningfulContent,
  placementHasFieldContent,
  placementHasRequiredItems,
  sectionProbeFromProps,
} from "./item-types.js";

/** True when a React renderer exists for this section key (incl. render_key variants) */
export function isKnownSectionKey(key, renderKey) {
  const behavior = resolveSectionBehaviorKey(key, renderKey);
  return Boolean(getManifestEntry(behavior)?.loadPublic);
}
