"use client";

import RelatedCoursesClient from "./RelatedCoursesClient";
import { isRelatedCoursesPlacementShowable } from "./lib/placement";
import type { RelatedCoursesSectionProps } from "./lib/types";

export default function RelatedCoursesPublicSection(
  props: RelatedCoursesSectionProps
) {
  if (!isRelatedCoursesPlacementShowable(props, false)) return null;
  return <RelatedCoursesClient {...props} />;
}
