/** Page template for section library showcases (page_key `section`). */
export const SECTION_PAGE_KEY = "section";

export const SECTION_LIBRARY_INDEX_PATH = "/cms/section";

export function sectionCategoryHref(slugOrKey) {
  if (!slugOrKey) return SECTION_LIBRARY_INDEX_PATH;
  const slug = String(slugOrKey).replace(/_/g, "-");
  return `${SECTION_LIBRARY_INDEX_PATH}/${slug}`;
}
