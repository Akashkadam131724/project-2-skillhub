"use client";

import { Suspense, useMemo } from "react";
import SectionFrame from "./SectionFrame";
import CourseCatalogClient from "@/components/catalog/CourseCatalogClient";

/** Build locked catalog filters from entity pageContext */
export function catalogBaseParamsFromContext(pageContext) {
  const ctx = pageContext || {};
  if (ctx.catalogBaseParams) return ctx.catalogBaseParams;

  const entityId = ctx.entityId;
  const entityType = ctx.entityType;
  if (!entityId || !entityType) return {};

  switch (entityType) {
    case "vendor":
      return { vendor: String(entityId) };
    case "product":
      return {
        product: String(entityId),
        ...(ctx.vendorId ? { vendor: String(ctx.vendorId) } : {}),
      };
    case "industry":
      return { industry: String(entityId) };
    case "skilling_area":
      return { skillingArea: String(entityId) };
    default:
      return {};
  }
}

export function catalogHideKeysFromContext(pageContext) {
  const ctx = pageContext || {};
  if (ctx.catalogHideFilterKeys) return ctx.catalogHideFilterKeys;
  return Object.keys(catalogBaseParamsFromContext(ctx));
}

/**
 * Course catalog CMS section — owns its own catalog UI.
 * Title/subtitle: CMS custom value wins; otherwise pageContext.catalogTitle /
 * catalogSubtitle (dynamic from the entity page).
 */
export default function CatalogSection({
  section_title,
  sub_title,
  pageContext,
  ...frameProps
}) {
  const baseParams = useMemo(
    () => catalogBaseParamsFromContext(pageContext),
    [pageContext]
  );
  const hideFilterKeys = useMemo(
    () => catalogHideKeysFromContext(pageContext),
    [pageContext]
  );

  const title =
    (section_title && String(section_title).trim()) ||
    pageContext?.catalogTitle ||
    (pageContext?.entityName
      ? `${pageContext.entityName} Courses`
      : "Courses");

  const subtitle =
    (sub_title && String(sub_title).trim()) ||
    pageContext?.catalogSubtitle ||
    "";

  return (
    <SectionFrame id="catalog" title={title} subtitle={subtitle} {...frameProps}>
      <Suspense
        fallback={
          <div className="h-40 animate-pulse rounded-xl bg-slate-200/60 dark:bg-slate-800" />
        }
      >
        <CourseCatalogClient
          baseParams={baseParams}
          hideFilterKeys={hideFilterKeys}
        />
      </Suspense>
    </SectionFrame>
  );
}
