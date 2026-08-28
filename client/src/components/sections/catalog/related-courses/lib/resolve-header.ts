import type { CatalogPageContext } from "../../shared/lib/types";

export function resolveRelatedCoursesTitle(
  sectionTitle?: string,
  _pageContext?: CatalogPageContext | null
): string {
  return (sectionTitle && String(sectionTitle).trim()) || "Featured courses";
}

export function resolveRelatedCoursesSubtitle(
  sectionSubtitle?: string
): string {
  return (
    (sectionSubtitle && String(sectionSubtitle).trim()) ||
    "A quick look at popular training paths from this catalog."
  );
}
