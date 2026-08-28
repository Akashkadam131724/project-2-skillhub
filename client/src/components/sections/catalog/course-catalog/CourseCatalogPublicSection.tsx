"use client";

import { useMemo } from "react";
import {
  catalogBaseParamsFromContext,
  catalogHideKeysFromContext,
} from "../shared/lib/context";
import CourseCatalogUi from "./CourseCatalogUi";
import {
  resolveCourseCatalogSubtitle,
  resolveCourseCatalogTitle,
} from "./lib/resolve-header";
import type { CourseCatalogSectionProps } from "./lib/types";

export default function CourseCatalogPublicSection({
  section_title,
  sub_title,
  pageContext,
  id,
}: CourseCatalogSectionProps) {
  const baseParams = useMemo(
    () => catalogBaseParamsFromContext(pageContext),
    [pageContext]
  );
  const hideFilterKeys = useMemo(
    () => catalogHideKeysFromContext(pageContext),
    [pageContext]
  );

  const title = resolveCourseCatalogTitle(section_title, pageContext);
  const subtitle = resolveCourseCatalogSubtitle(sub_title, pageContext);

  return (
    <CourseCatalogUi
      id={id}
      title={title}
      subtitle={subtitle}
      baseParams={baseParams}
      hideFilterKeys={hideFilterKeys}
    />
  );
}
