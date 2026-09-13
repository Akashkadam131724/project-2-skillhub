import {
  CATEGORY_SLUG,
  SECTION_CATEGORIES,
  SECTION_NAMES,
  buildCategoryPagePlacements,
  buildShowcasePlacement,
  sectionsInCategory,
} from "./static-samples";
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
  return (
    (CATEGORY_SLUG as Record<string, string>)[categoryKey] ||
    String(categoryKey).replace(/_/g, "-")
  );
}

export function getCategoryShowcaseTitle(categoryKey: string) {
  const cat = SECTION_CATEGORIES.find((c) => c.key === categoryKey);
  return cat?.name || categoryKey;
}

function sectionDisplayName(sectionKey: string) {
  return (SECTION_NAMES as Record<string, string>)[sectionKey] || sectionKey;
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
      name: (SECTION_NAMES as Record<string, string>)[key] || key,
    };
  });
}

/** @deprecated Prefer listCategoryLibrarySections + per-section pages. */
export function getStaticCategoryShowcase(categorySlug: string) {
  const categoryKey = categoryKeyFromSlug(categorySlug);
  if (!categoryKey || !sectionsInCategory(categoryKey).length) {
    return null;
  }

  return {
    categoryKey,
    title: getCategoryShowcaseTitle(categoryKey),
    sections: normalizeShowcasePlacements(
      buildCategoryPagePlacements(categoryKey)
    ),
  };
}

export {
  CATEGORY_SLUG,
  SECTION_CATEGORIES,
  SECTION_NAMES,
  buildCategoryPagePlacements,
  buildShowcasePlacement,
  sectionsInCategory,
} from "./static-samples";
