import { Suspense } from "react";
import PageSectionsSkeleton from "@/components/loading/PageSectionsSkeleton";

/**
 * Streaming boundary for public CMS section stacks — reserves hero height
 * while sections resolve to limit mobile CLS / LCP shift.
 */
export default function PublicPageSectionsSuspense({
  children,
  compact = false,
}) {
  return (
    <Suspense fallback={<PageSectionsSkeleton compact={compact} />}>
      {children}
    </Suspense>
  );
}
