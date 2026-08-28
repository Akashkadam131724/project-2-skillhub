"use client";

import { useMemo } from "react";
import CmsEditable from "@/components/cms/primitives/CmsEditable";
import {
  catalogBaseParamsFromContext,
  catalogHideKeysFromContext,
} from "../shared/lib/context";
import CourseCatalogUi from "./CourseCatalogUi";
import type { CourseCatalogSectionProps } from "./lib/types";

export default function CourseCatalogSection({
  section_title,
  sub_title,
  pageContext,
  onEditField,
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

  return (
    <CourseCatalogUi
      id={id}
      baseParams={baseParams}
      hideFilterKeys={hideFilterKeys}
      titleSlot={
        <CmsEditable
          cmsMode
          field="section_title"
          label="Title"
          onEditField={onEditField}
        >
          {section_title ? (
            <h2 className="section-theme-heading m-0 max-w-3xl font-[family-name:var(--font-display)] text-3xl leading-[1.1] font-semibold tracking-tight sm:text-4xl">
              {section_title}
            </h2>
          ) : (
            <h2 className="section-theme-placeholder m-0 text-3xl leading-tight font-semibold italic sm:text-4xl">
              Add title…
            </h2>
          )}
        </CmsEditable>
      }
      subtitleSlot={
        <CmsEditable
          cmsMode
          field="sub_title"
          label="Subtitle"
          onEditField={onEditField}
        >
          {sub_title ? (
            <p className="section-theme-muted m-0 max-w-2xl text-base leading-relaxed">
              {sub_title}
            </p>
          ) : (
            <p className="section-theme-placeholder m-0 text-base leading-relaxed italic">
              Add subtitle…
            </p>
          )}
        </CmsEditable>
      }
    />
  );
}
