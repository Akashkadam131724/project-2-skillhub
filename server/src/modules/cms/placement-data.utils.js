/**
 * Shallow-merge placement `data` objects (catalog → template tag → entity).
 * Entity layers only store deltas; merged view keeps all keys.
 */
export function mergePlacementData(...layers) {
  const out = {};
  for (const layer of layers) {
    if (layer == null || typeof layer !== "object" || Array.isArray(layer)) {
      continue;
    }
    for (const [key, value] of Object.entries(layer)) {
      if (value !== undefined) {
        out[key] = value;
      }
    }
  }
  delete out.section_theme;
  return out;
}

/** Drop empty data object → null for Mongo (inherit lower layers). */
export function normalizePlacementDataPatch(merged) {
  if (merged == null) return null;
  if (typeof merged !== "object" || Array.isArray(merged)) return merged;
  if (Object.keys(merged).length === 0) return null;
  return merged;
}
