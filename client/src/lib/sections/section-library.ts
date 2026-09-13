/** Page template for section library showcases (page_key `section`). */
export const SECTION_PAGE_KEY = "section";

export const SECTION_LIBRARY_INDEX_PATH = "/cms/section";

export function sectionCategoryHref(slugOrKey?: string) {
  if (!slugOrKey) return SECTION_LIBRARY_INDEX_PATH;
  const slug = String(slugOrKey).replace(/_/g, "-");
  return `${SECTION_LIBRARY_INDEX_PATH}/${slug}`;
}

/** `split_cta` → `split-cta` for URLs. */
export function sectionSlugFromKey(sectionKey?: string) {
  return String(sectionKey || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
}

/** `split-cta` → `split_cta` from URLs. */
export function sectionKeyFromSlug(sectionSlug?: string) {
  return String(sectionSlug || "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");
}

/** `/cms/section/{category}/{section}` */
export function sectionLibrarySectionHref(
  categorySlugOrKey?: string,
  sectionKeyOrSlug?: string
) {
  const categoryPath = sectionCategoryHref(categorySlugOrKey);
  if (!sectionKeyOrSlug) return categoryPath;
  return `${categoryPath}/${sectionSlugFromKey(sectionKeyOrSlug)}`;
}
