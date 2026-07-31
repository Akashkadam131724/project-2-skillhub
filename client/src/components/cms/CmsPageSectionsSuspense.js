import { Suspense } from "react";
import PageSectionsSkeleton from "@/components/PageSectionsSkeleton";

/**
 * Suspense boundary for CmsLivePageSections (uses useSearchParams).
 */
export default function CmsPageSectionsSuspense({
  children,
  compact = false,
}) {
  return (
    <Suspense fallback={<PageSectionsSkeleton compact={compact} />}>
      {children}
    </Suspense>
  );
}
