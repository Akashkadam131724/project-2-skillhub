"use client";

import { catalogCmsSection } from "../shared/catalog-cms-section";
import RelatedCoursesClient from "./RelatedCoursesClient";
import type { RelatedCoursesSectionProps } from "./lib/types";

export default function RelatedCoursesSection({
  section_title,
  sub_title,
  pageContext,
  onEditField,
  id,
}: RelatedCoursesSectionProps) {
  return (
    <RelatedCoursesClient
      id={id}
      cmsMode
      section_title={section_title}
      sub_title={sub_title}
      pageContext={pageContext}
      onEditField={onEditField}
      {...catalogCmsSection({ section_title, sub_title, onEditField })}
    />
  );
}
