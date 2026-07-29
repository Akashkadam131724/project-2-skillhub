/** Shallow-merge placement `data` (catalog → tag → entity override). */
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
