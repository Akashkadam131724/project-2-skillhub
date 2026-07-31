import PublicPageSections from "@/components/cms/PublicPageSections";
import { getPageSectionsResolved } from "@/lib/cms-api";
import { isrFetchOptions } from "@/lib/isr";

/**
 * Async server component — fetches resolved CMS sections.
 * Pair with PublicPageSectionsSuspense on public routes.
 * Pass ssr for fresh no-store fetches (e.g. course catalog pages).
 */
export default async function ResolvedPageSections({
  pageKey,
  entityId,
  pageContext,
  cacheTags = [],
  ssr = false,
}) {
  const fetchOptions = ssr
    ? { cache: "no-store" }
    : isrFetchOptions({
        tags: ["page-sections", pageKey, String(entityId), ...cacheTags],
      });

  const sectionsRes = await getPageSectionsResolved(
    pageKey,
    entityId,
    fetchOptions
  ).catch(() => ({ sections: [], page: null }));

  return (
    <PublicPageSections
      pageKey={pageKey}
      sections={sectionsRes.sections || []}
      initialTheme={sectionsRes.page?.theme || null}
      pageContext={pageContext}
    />
  );
}
