import {
  SECTION_ITEMS_CONFIG,
  sectionUsesItems,
  getSectionItemsConfig,
  sectionRequiresItems,
  resolveSectionBehaviorKey,
} from "./section-items-config";
import { getManifestEntry } from "./section-manifest-resolve";
import {
  SECTION_CATALOG,
  SECTION_CATEGORIES,
  SECTION_SURFACE,
  SECTION_USES_IMAGE,
  KNOWN_SECTION_KEYS,
  getSectionCatalogMeta,
  getSectionCatalogMetaByBehavior,
} from "./section-catalog";

export {
  SECTION_CATALOG,
  SECTION_CATEGORIES,
  SECTION_SURFACE,
  SECTION_USES_IMAGE,
  KNOWN_SECTION_KEYS,
  getSectionCatalogMeta,
  getSectionCatalogMetaByBehavior,
} from "./section-catalog";

/**
 * Sections whose layout uses `section_bg_img` / `section_bg_color` on the global shell.
 * All sections participate — editors can set band bg on any block.
 */
export function sectionUsesBg(_key?: string) {
  return true;
}

/** All sections can edit section_bg_color on the global shell */
export function sectionUsesBgColor(_key?: string) {
  return true;
}

export function sectionUsesImage(
  key?: string | null,
  renderKey?: string | null
) {
  const behavior = resolveSectionBehaviorKey(
    key ?? undefined,
    renderKey ?? undefined
  );
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
} from "./item-types";

/** True when a React renderer exists for this section key (incl. render_key variants) */
export function isKnownSectionKey(key?: string, renderKey?: string) {
  const behavior = resolveSectionBehaviorKey(key, renderKey);
  return Boolean(getManifestEntry(behavior)?.loadPublic);
}
