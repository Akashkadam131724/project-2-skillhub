"use client";

import CmsLivePageSections from "@/components/cms/CmsLivePageSections";

/** Section stack only (category showcase). */
export default function SectionLibraryPageBody({
  pageKey,
  entityId,
  entityLabel,
  initialSections,
  initialTheme,
  pageContext,
}) {
  return (
    <CmsLivePageSections
      pageKey={pageKey}
      entityId={entityId}
      entityLabel={entityLabel}
      initialSections={initialSections}
      initialTheme={initialTheme}
      pageContext={pageContext}
      cmsMode
    />
  );
}
