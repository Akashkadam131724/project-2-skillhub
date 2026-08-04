import {
  getEntityPageSections,
  getPage,
  listPageSections,
  listSections,
} from "@/lib/api/cms-api";
import { mergePlacements } from "@/components/cms/pages/live/merge-placements";

/** Section catalog for the Add tab (lazy). Display content comes from page-sections. */
export async function fetchSectionCatalog() {
  const res = await listSections({ status: true });
  return res.data || [];
}

/**
 * Load mapped placements for live edit.
 *
 * Content is resolved on the API:
 *  - GET /page-sections → scope-aware Section + tag fields
 *  - GET /page-sections/entity → entity extras hydrated from Section
 *
 * Catalog is optional (Add tab / fallback). Pass cached catalog on reload.
 */
export async function fetchLivePlacements(
  pageKey,
  entityId,
  {
    catalog = [],
    sortDisabled = true,
    fetchPage = true,
    fetchCatalog = false,
  } = {}
) {
  const [tagsRes, overridesRes, pageRes, catalogList] = await Promise.all([
    listPageSections({ page_key: pageKey }),
    getEntityPageSections({ page_key: pageKey, entity_id: entityId }),
    fetchPage ? getPage(pageKey).catch(() => null) : Promise.resolve(null),
    fetchCatalog ? fetchSectionCatalog() : Promise.resolve(catalog || []),
  ]);

  const disabled = fetchPage
    ? pageRes?.data?.is_sort_disabled !== false
    : sortDisabled;

  const resolvedCatalog = Array.isArray(catalogList) ? catalogList : [];

  const sections = mergePlacements(
    tagsRes.data || [],
    overridesRes.data || [],
    entityId,
    resolvedCatalog,
    disabled
  );

  return {
    sections,
    catalog: resolvedCatalog,
    sortDisabled: disabled,
    pageDoc: pageRes?.data || null,
  };
}
