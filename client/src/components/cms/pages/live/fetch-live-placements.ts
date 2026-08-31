import {
  getEntityPageSections,
  getPage,
  listPageSections,
  listSections,
} from "@/lib/api/cms-api";
import { mergePlacements } from "@/components/cms/pages/live/merge-placements";
import type {
  FetchLivePlacementsOptions,
  FetchLivePlacementsResult,
  SectionCatalogEntry,
} from "../types";

/** Section catalog for the Add tab (lazy). Display content comes from page-sections. */
export async function fetchSectionCatalog(): Promise<SectionCatalogEntry[]> {
  const res = await listSections({ status: true });
  return (res.data || []) as SectionCatalogEntry[];
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
  pageKey: string,
  entityId: string | number,
  {
    catalog = [],
    sortDisabled = true,
    fetchPage = true,
    fetchCatalog = false,
  }: FetchLivePlacementsOptions = {}
): Promise<FetchLivePlacementsResult> {
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
