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

function isEntityPlacementLayer(source) {
  return Boolean(
    source &&
      typeof source === "object" &&
      (source.entity_id != null ||
        source.page_tag_id != null ||
        source.items_override != null ||
        source.buttons_override != null)
  );
}

/**
 * Cascade items/buttons across placement layers.
 * Entity overrides may store mongoose `[]` after theme-only saves — treat as inherit
 * unless `items_override` / `buttons_override` is true.
 */
export function pickPlacementArrayField(field, ...sources) {
  const overrideKey =
    field === "items"
      ? "items_override"
      : field === "buttons"
        ? "buttons_override"
        : null;

  for (const source of sources) {
    if (source == null || typeof source !== "object") continue;
    if (!Object.prototype.hasOwnProperty.call(source, field)) continue;

    const value = source[field];
    if (!Array.isArray(value)) continue;

    if (
      overrideKey &&
      isEntityPlacementLayer(source) &&
      source[overrideKey] !== true &&
      value.length === 0
    ) {
      continue;
    }

    return value;
  }

  return [];
}
