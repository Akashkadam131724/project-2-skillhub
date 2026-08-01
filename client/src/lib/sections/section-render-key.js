import {
  getSectionCatalogMeta,
  isKnownSectionKey,
  SECTION_CATALOG,
} from "@/lib/sections/section-registry";

function sectionKeyOf(section) {
  return String(section?.key || section?.section_key || "")
    .toLowerCase()
    .trim();
}

/** Component key for UI + items config — DB render_key, then catalog, then section key */
export function effectiveRenderKey(section) {
  if (!section) return "";
  const fromDb = String(section.render_key || "").toLowerCase().trim();
  if (fromDb) return fromDb;
  const key = sectionKeyOf(section);
  const catalog = getSectionCatalogMeta(key);
  if (catalog?.render_key) {
    return String(catalog.render_key).toLowerCase();
  }
  return key;
}

/** render_key value to pass into getSectionItemsConfig (empty when key is the component) */
export function itemsConfigRenderKey(section) {
  const key = sectionKeyOf(section);
  const fromDb = String(section?.render_key || "").toLowerCase().trim();
  if (fromDb) return fromDb;
  const inferred = inferMissingRenderKey(section);
  if (inferred) return inferred;
  const component = effectiveRenderKey(section);
  if (!component || component === key) return "";
  return component;
}

/** render_key for placements / component resolution (never omits inferred value) */
export function placementRenderKey(section) {
  return itemsConfigRenderKey(section);
}

/** Persist missing render_key on a section row when it can be inferred */
export async function ensureSectionRenderKeySaved(section, updateSection) {
  const patch = missingRenderKeyPatch(section);
  if (!patch || !section?.key) {
    return { section, patched: false };
  }
  await updateSection(section.key, patch);
  return { section: { ...section, ...patch }, patched: true };
}

/** render_key to persist when creating a variant with a new section key */
export function variantRenderKeyForCreate(sectionKey, componentKey) {
  const key = String(sectionKey || "").toLowerCase().trim();
  const component = String(componentKey || "").toLowerCase().trim();
  if (!component || component === key) return "";
  return component;
}

/** Catalog row that should have render_key in DB but does not */
export function catalogRenderKeyBackfill(section) {
  const key = sectionKeyOf(section);
  if (!key || String(section?.render_key || "").trim()) return null;
  const catalog = getSectionCatalogMeta(key);
  if (!catalog?.render_key) return null;
  const rk = String(catalog.render_key).toLowerCase();
  if (!rk || rk === key) return null;
  return rk;
}

/**
 * Guess render_key for custom variants (e.g. contact_us_two → contact_us).
 * Used only to repair rows missing render_key in the DB.
 */
export function inferMissingRenderKey(section) {
  const catalog = catalogRenderKeyBackfill(section);
  if (catalog) return catalog;

  const key = sectionKeyOf(section);
  if (!key || String(section?.render_key || "").trim()) return null;
  if (isKnownSectionKey(key)) return null;

  const candidates = [];
  for (const entry of SECTION_CATALOG) {
    const component = String(entry.render_key || entry.key || "").toLowerCase();
    if (!component || component === key) continue;
    if (
      key.startsWith(`${component}_`) ||
      key.endsWith(`_${component}`) ||
      key.includes(`_${component}_`)
    ) {
      candidates.push(component);
    }
  }

  if (!candidates.length) return null;
  candidates.sort((a, b) => b.length - a.length);
  const best = candidates[0];
  return isKnownSectionKey(key, best) ? best : null;
}

/** render_key patch to apply before save, or null when DB row is fine */
export function missingRenderKeyPatch(section) {
  const inferred = inferMissingRenderKey(section);
  if (!inferred) return null;
  return { render_key: inferred };
}
