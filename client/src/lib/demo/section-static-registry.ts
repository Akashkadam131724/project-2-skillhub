/** Sections in the catalog without a Static preview (API-driven layouts). */
export const SECTION_STATIC_UNAVAILABLE = new Set([
  "related_courses",
  "products",
  "catalog",
  "entity_directory",
  "blog_directory",
]);

/** Sections that need custom preview UI on the demo page. */
export const SECTION_STATIC_SPECIAL = new Set(["promo_modal"]);

export function isSectionStaticUnavailable(sectionKey: string) {
  return SECTION_STATIC_UNAVAILABLE.has(sectionKey);
}

export function isSectionStaticSpecial(sectionKey: string) {
  return SECTION_STATIC_SPECIAL.has(sectionKey);
}
