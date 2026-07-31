import PublicPageSections from "@/components/cms/PublicPageSections";
import { getPageSectionsResolved } from "@/lib/cms-api";

/**
 * Async server component — fetches resolved CMS sections (no-store / SSR).
 * Pair with PublicPageSectionsSuspense on public routes.
 */
export default async function ResolvedPageSections({
  pageKey,
  entityId,
  pageContext,
}) {
  const sectionsRes = await getPageSectionsResolved(pageKey, entityId, {
    cache: "no-store",
  }).catch(() => ({ sections: [], page: null }));

  return (
    <PublicPageSections
      pageKey={pageKey}
      sections={sectionsRes.sections || []}
      initialTheme={sectionsRes.page?.theme || null}
      pageContext={pageContext}
    />
  );
}
