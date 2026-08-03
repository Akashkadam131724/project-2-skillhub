"use client";

import { CmsLiveEditProvider } from "@/components/cms/pages/live/CmsLiveEditContext";
import CmsLivePageSections from "@/components/cms/pages/CmsLivePageSections";

/** Section stack only (category showcase). */
export default function SectionLibraryPageBody({
  pageKey,
  entityId,
  entityLabel,
  initialTheme,
  pageContext,
  publicHref = null,
}) {
  return (
    <CmsLiveEditProvider
      pageKey={pageKey}
      entityId={entityId}
      entityLabel={entityLabel}
      initialTheme={initialTheme}
      pageContext={pageContext}
      publicHref={publicHref}
    >
      <CmsLivePageSections />
    </CmsLiveEditProvider>
  );
}
