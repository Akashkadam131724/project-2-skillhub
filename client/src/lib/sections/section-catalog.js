/**
 * CMS section catalog — static metadata only.
 *
 * Add rows in `section-catalog.entries.js` (mirror server `section.catalog.js`).
 * Runtime helpers: `section-registry.js`; loaders: `section-manifest.ts`.
 *
 * For new sections, prefer a `section.blueprint.ts` in the component folder — see
 * `blueprint/` and user-guide integration steps.
 */

import { SECTION_CATALOG_ENTRIES } from "./section-catalog.entries.js";

export const SECTION_CATALOG = SECTION_CATALOG_ENTRIES;

/** @deprecated Derived map — prefer `getSectionCatalogMeta(key)?.surface` */
export const SECTION_SURFACE = Object.fromEntries(
  SECTION_CATALOG.map((entry) => [entry.key, entry.surface])
);

/** @deprecated Derived set — prefer catalog `uses_section_image` */
export const SECTION_USES_IMAGE = new Set(
  SECTION_CATALOG.filter((entry) => entry.uses_section_image).map((entry) => entry.key)
);

export const KNOWN_SECTION_KEYS = SECTION_CATALOG.map((s) => s.key);

export const SECTION_CATEGORIES = [
  { key: "hero", name: "Hero" },
  { key: "content", name: "Content" },
  { key: "features", name: "Features & cards" },
  { key: "tabs", name: "Tabs" },
  { key: "accordion", name: "Accordion" },
  { key: "catalog", name: "Catalog & learning" },
  { key: "social_proof", name: "Social proof" },
  { key: "data", name: "Data & stats" },
  { key: "navigation", name: "Navigation" },
  { key: "overlays", name: "Overlays & modals" },
  { key: "forms", name: "Forms & capture" },
  { key: "comparison", name: "Compare & choose" },
  { key: "media", name: "Media & galleries" },
  { key: "timeline", name: "Timeline & journey" },
  { key: "pricing", name: "Pricing & packages" },
  { key: "trust", name: "Trust & compliance" },
  { key: "cta", name: "Calls to action" },
  { key: "learning", name: "Learning experience" },
];

/** Catalog row by CMS `section_key` (not behavior / render_key). */
export function getSectionCatalogMeta(key) {
  const normalized = String(key || "").toLowerCase();
  return SECTION_CATALOG.find((section) => section.key === normalized) || null;
}

/** Catalog row for resolved behavior key (manifest + image/surface flags). */
export function getSectionCatalogMetaByBehavior(behaviorKey) {
  const normalized = String(behaviorKey || "").toLowerCase();
  return (
    SECTION_CATALOG.find(
      (section) =>
        section.key === normalized || section.render_key === normalized
    ) || null
  );
}
