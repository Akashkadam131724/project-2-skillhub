/** Default course catalog page size */
export const CATALOG_PAGE_SIZE = 14;

/**
 * @deprecated Use CSS var `--catalog-scroll-offset` and scrollToCatalogAnchor() instead.
 */
export const CATALOG_SCROLL_OFFSET = 124;

/**
 * Merge URL search params with locked base params (base wins).
 */
export function mergeCatalogParams(
  searchParams: Record<string, string | string[] | undefined> = {},
  baseParams: Record<string, string | number | undefined> = {}
) {
  const merged: Record<string, string | string[] | undefined> = { ...searchParams };
  for (const [key, value] of Object.entries(baseParams)) {
    if (value === undefined || value === null || value === "") continue;
    merged[key] = String(value);
  }
  return merged;
}

export function lockedParamEntries(
  lockedParams: Record<string, string | number | boolean | null | undefined> = {}
) {
  return Object.entries(lockedParams).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );
}

/** Apply locked params onto a URLSearchParams instance (mutates). */
export function applyLockedParams(
  params: URLSearchParams,
  lockedParams: Record<string, string | number | boolean | null | undefined> = {}
) {
  for (const [key, value] of lockedParamEntries(lockedParams)) {
    params.set(key, String(value));
  }
  return params;
}
