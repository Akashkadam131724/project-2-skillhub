import {
  CATEGORY_SLUG,
  SECTION_CATEGORIES,
  SECTION_NAMES,
  sectionsInCategory,
} from "./catalog-index";
import { buildShowcasePlacement } from "./static-samples";
import {
  sectionKeyFromSlug,
  sectionSlugFromKey,
} from "@/lib/sections/section-library";

const SLUG_TO_CATEGORY = Object.fromEntries(
  Object.entries(CATEGORY_SLUG).map(([key, slug]) => [slug, key])
);

/** URL slug → category key (e.g. `social-proof` → `social_proof`) */
export function categoryKeyFromSlug(slug?: string) {
  const raw = String(slug || "").trim().toLowerCase();
  if (!raw) return "";
  return SLUG_TO_CATEGORY[raw] || raw.replace(/-/g, "_");
}

export function categorySlugFromKey(categoryKey?: string) {
  if (!categoryKey) return "";
  return CATEGORY_SLUG[categoryKey] || String(categoryKey).replace(/_/g, "-");
}

export function getCategoryShowcaseTitle(categoryKey: string) {
  const cat = SECTION_CATEGORIES.find((c) => c.key === categoryKey);
  return cat?.name || categoryKey;
}

function sectionDisplayName(sectionKey: string) {
  return SECTION_NAMES[sectionKey] || sectionKey;
}

/** Category page — cards only (no stacked previews). */
export function listCategoryLibrarySections(categorySlug: string) {
  const categoryKey = categoryKeyFromSlug(categorySlug);
  if (!categoryKey) return null;

  const keys = sectionsInCategory(categoryKey);
  if (!keys.length) return null;

  return {
    categoryKey,
    categorySlug: categorySlugFromKey(categoryKey),
    title: getCategoryShowcaseTitle(categoryKey),
    sections: keys.map((key) => ({
      key,
      slug: sectionSlugFromKey(key),
      name: sectionDisplayName(key),
    })),
  };
}

/** Single-section preview page. */
export function getStaticSectionShowcase(
  categorySlug: string,
  sectionSlug: string
) {
  const categoryKey = categoryKeyFromSlug(categorySlug);
  const sectionKey = sectionKeyFromSlug(sectionSlug);
  if (!categoryKey || !sectionKey) return null;

  const keys = sectionsInCategory(categoryKey);
  if (!keys.includes(sectionKey)) return null;

  return {
    categoryKey,
    categorySlug: categorySlugFromKey(categoryKey),
    categoryTitle: getCategoryShowcaseTitle(categoryKey),
    sectionKey,
    sectionSlug: sectionSlugFromKey(sectionKey),
    name: sectionDisplayName(sectionKey),
    sections: normalizeShowcasePlacements([
      buildShowcasePlacement(sectionKey, 0),
    ]),
  };
}

/** Shape static placements for PublicPageSections */
export function normalizeShowcasePlacements(
  placements: Array<Record<string, unknown>> = []
) {
  return placements.map((placement, index) => {
    const key = String(placement.section_key || "").toLowerCase();
    return {
      ...placement,
      section_key: key,
      placement_id: `showcase-${key}-${index}`,
      status: true,
      name: SECTION_NAMES[key] || key,
    };
  });
}

export {
  CATEGORY_SLUG,
  SECTION_CATEGORIES,
  SECTION_NAMES,
  buildShowcasePlacement,
  sectionsInCategory,
} from "./static-samples";

export { hasStaticDemoPlacement, getStaticDemoPlacement } from "./demo-placements";
