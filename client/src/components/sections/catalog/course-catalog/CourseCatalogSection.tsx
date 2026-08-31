"use client";

import { useMemo } from "react";
import { catalogCmsSection } from "../shared/catalog-cms-section";
import CourseCatalogUi from "./CourseCatalogUi";
import type { CourseCatalogSectionProps } from "./lib/types";

export default function CourseCatalogSection({
  section_title,
  sub_title,
  pageContext,
  onEditField,
  id,
}: CourseCatalogSectionProps) {
  const catalogProps = useMemo(
    () =>
      catalogCmsSection({
        section_title,
        sub_title,
        onEditField,
        pageContext,
        withCatalogParams: true,
      }),
    [section_title, sub_title, onEditField, pageContext]
  );

  return <CourseCatalogUi id={id} {...catalogProps} />;
}
