"use client";

import CmsPagePreviewStack from "@/components/cms/sections/CmsPagePreviewStack";
import { placementKey } from "@/lib/sections/page-sections-stack";
import { previewSrc } from "@/components/cms/pages/live/field-meta";
import { useCmsLivePagePlacements } from "@/components/cms/pages/live/useCmsLivePagePlacements";

/** Compact mapped-order preview stack. */
export default function PreviewSectionsTab() {
  const { sections, catalog } = useCmsLivePagePlacements();

  return (
    <CmsPagePreviewStack
      emptyMessage="No sections mapped on this page yet."
      items={sections.map((s) => ({
        id: String(placementKey(s)),
        section_key: String(s.section_key || ""),
        sort_order: s.sort_order,
        hidden: s.status === false,
        content_scope: s.content_scope,
        preview: previewSrc(s, catalog),
      }))}
    />
  );
}
