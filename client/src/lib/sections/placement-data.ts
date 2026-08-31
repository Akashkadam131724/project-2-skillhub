/** Shallow-merge placement `data` (catalog → tag → entity override). */
export function mergePlacementData(...layers: unknown[]) {
  const out: Record<string, unknown> = {};
  for (const layer of layers) {
    if (layer == null || typeof layer !== "object" || Array.isArray(layer)) {
      continue;
    }
    for (const [key, value] of Object.entries(layer as Record<string, unknown>)) {
      if (value !== undefined) {
        out[key] = value;
      }
    }
  }
  delete out.section_theme;
  return out;
}

function isEntityPlacementLayer(source: Record<string, unknown>) {
  return Boolean(
    source &&
      typeof source === "object" &&
      (source.entity_id != null ||
        source.entity_override_id != null ||
        source.page_tag_id != null ||
        source.items_override != null ||
        source.buttons_override != null)
  );
}

/**
 * Cascade items/buttons across placement layers (see server placement-data.utils.js).
 */
export function pickPlacementArrayField(
  field: string,
  ...sources: unknown[]
) {
  const overrideKey =
    field === "items"
      ? "items_override"
      : field === "buttons"
        ? "buttons_override"
        : null;

  for (const source of sources) {
    if (source == null || typeof source !== "object") continue;
    const row = source as Record<string, unknown>;
    if (!Object.prototype.hasOwnProperty.call(row, field)) continue;

    const value = row[field];
    if (!Array.isArray(value)) continue;

    if (
      overrideKey &&
      isEntityPlacementLayer(row) &&
      row[overrideKey] !== true &&
      value.length === 0
    ) {
      continue;
    }

    return value;
  }

  return [];
}
