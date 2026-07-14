/**
 * Merge URL search params with locked base params (base wins).
 */
export function mergeCatalogParams(searchParams = {}, baseParams = {}) {
  const merged = { ...searchParams };
  for (const [key, value] of Object.entries(baseParams)) {
    if (value === undefined || value === null || value === "") continue;
    merged[key] = String(value);
  }
  return merged;
}

export function lockedParamEntries(lockedParams = {}) {
  return Object.entries(lockedParams).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );
}

/** Apply locked params onto a URLSearchParams instance (mutates). */
export function applyLockedParams(params, lockedParams = {}) {
  for (const [key, value] of lockedParamEntries(lockedParams)) {
    params.set(key, String(value));
  }
  return params;
}
