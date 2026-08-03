import {
  getEntityPageSections,
  getPage,
  listPageSections,
  listSections,
} from "@/lib/api/cms-api";
import { mergePlacements } from "@/components/cms/pages/live/merge-placements";

/**
 * Load mapped placements for live edit.
 * Pass cached `catalog` + `sortDisabled` on reload — do not refetch them every time.
 */
export async function fetchLivePlacements(
  pageKey,
  entityId,
  { catalog = [], sortDisabled = true, fetchPage = true } = {}
) {
  const [tagsRes, overridesRes, pageRes] = await Promise.all([
    listPageSections({ page_key: pageKey }),
    getEntityPageSections({ page_key: pageKey, entity_id: entityId }),
    fetchPage ? getPage(pageKey).catch(() => null) : Promise.resolve(null),
  ]);

  const disabled = fetchPage
    ? pageRes?.data?.is_sort_disabled !== false
    : sortDisabled;

  const sections = mergePlacements(
    tagsRes.data || [],
    overridesRes.data || [],
    entityId,
    catalog,
    disabled
  );

  return {
    sections,
    sortDisabled: disabled,
    pageDoc: pageRes?.data || null,
  };
}

/** Section catalog for the Add tab only. */
export async function fetchSectionCatalog() {
  const res = await listSections({ status: true });
  return res.data || [];
}
