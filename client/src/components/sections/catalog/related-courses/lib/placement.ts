import { catalogBaseParamsFromContext } from "../../shared/lib/context";
import type { CatalogPageContext } from "../../shared/lib/types";
import type { RelatedCoursesSectionProps } from "./types";

export function hasRelatedCoursesContext(
  pageContext?: CatalogPageContext | null
): boolean {
  return Object.keys(catalogBaseParamsFromContext(pageContext)).length > 0;
}

export function isRelatedCoursesPlacementShowable(
  props: RelatedCoursesSectionProps,
  cmsMode = false
): boolean {
  if (cmsMode) return true;
  return hasRelatedCoursesContext(props.pageContext);
}
