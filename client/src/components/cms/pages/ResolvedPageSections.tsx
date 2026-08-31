import PublicPageSections from "@/components/cms/pages/PublicPageSections";
import { getPageSectionsResolved } from "@/lib/api/cms-api";
import type { ResolvedPageSectionsProps } from "./types";

/**
 * Async server component — fetches resolved CMS sections (no-store / SSR).
 * Pair with PublicPageSectionsSuspense on public routes.
 */
export default async function ResolvedPageSections({
  pageKey,
  entityId,
  pageContext,
}: ResolvedPageSectionsProps) {
  const sectionsRes = await getPageSectionsResolved(pageKey, entityId, {
    cache: "no-store",
  }).catch(() => ({ sections: [], page: null }));

  return (
    <PublicPageSections
      pageKey={pageKey}
      sections={sectionsRes.sections || []}
      initialTheme={(sectionsRes.page?.theme as Record<string, unknown> | null) || null}
      pageContext={pageContext}
    />
  );
}
