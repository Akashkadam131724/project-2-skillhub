import type { CatalogPageContext } from "../../shared/lib/types";

export function resolveCourseCatalogTitle(
  sectionTitle?: string,
  pageContext?: CatalogPageContext | null
): string {
  return (
    (sectionTitle && String(sectionTitle).trim()) ||
    pageContext?.catalogTitle ||
    (pageContext?.entityName
      ? `${pageContext.entityName} Courses`
      : "Courses")
  );
}

export function resolveCourseCatalogSubtitle(
  sectionSubtitle?: string,
  pageContext?: CatalogPageContext | null
): string {
  return (
    (sectionSubtitle && String(sectionSubtitle).trim()) ||
    pageContext?.catalogSubtitle ||
    ""
  );
}
