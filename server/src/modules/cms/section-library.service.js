import Section from "./section.model.js";
import SectionCategory from "./section-category.model.js";
import SectionLibrary from "./section-library.model.js";
import { resolvePageSections } from "./resolve.js";
import {
  buildCategoryPagePlacements,
  buildIndexPagePlacements,
  sectionsInCategory,
  CATEGORY_SLUG,
  SECTION_CATEGORIES,
} from "../../seed/lib/section-showcase-samples.js";

export { CATEGORY_SLUG, SECTION_CATEGORIES };

const SLUG_TO_CATEGORY = Object.fromEntries(
  Object.entries(CATEGORY_SLUG).map(([key, slug]) => [slug, key])
);

export function categoryKeyFromSlug(slug) {
  const raw = String(slug || "").trim().toLowerCase();
  if (!raw || raw === "index") return "index";
  return SLUG_TO_CATEGORY[raw] || raw.replace(/-/g, "_");
}

export function categorySlugFromKey(categoryKey) {
  if (!categoryKey || categoryKey === "index") return "";
  return CATEGORY_SLUG[categoryKey] || String(categoryKey).replace(/_/g, "-");
}

export function publicPathForShowcase(showcaseKey) {
  if (!showcaseKey || showcaseKey === "index") return "/cms/section";
  const slug = categorySlugFromKey(showcaseKey);
  return slug ? `/cms/section/${slug}` : "/cms/section";
}

async function activeSectionKeysForCategory(categoryKey) {
  const wanted = sectionsInCategory(categoryKey);
  const sections = await Section.find({
    key: { $in: wanted },
    status: true,
  })
    .select("key")
    .lean();
  const active = new Set(sections.map((s) => s.key));
  return wanted.filter((k) => active.has(k));
}

function filterCategoryPlacements(placements, allowedKeys) {
  const allowed = new Set(allowedKeys);
  const always = new Set([
    "in_page_nav",
    "hero_centered",
    "cta_band",
  ]);
  return placements.filter((p) => {
    const key = p.section_key;
    if (always.has(key)) return true;
    return allowed.has(key);
  });
}

export async function listSectionLibraryCategories() {
  const categories = await SectionCategory.find({ status: true })
    .sort({ sort_order: 1, name: 1 })
    .lean();

  const enriched = await Promise.all(
    categories.map(async (cat) => {
      const keys = await activeSectionKeysForCategory(cat.key);
      return {
        ...cat,
        id: cat._id,
        section_count: keys.length,
        href: publicPathForShowcase(cat.key),
        slug: categorySlugFromKey(cat.key),
      };
    })
  );

  const uncategorized = await Section.find({
    $or: [{ section_category: null }, { section_category: { $exists: false } }],
    status: true,
  }).countDocuments();

  return {
    categories: enriched,
    uncategorized_count: uncategorized,
  };
}

export async function getShowcaseByKey(showcaseKey) {
  const key = String(showcaseKey || "index").toLowerCase();
  const library = await SectionLibrary.findByShowcaseKey(key).lean();
  if (!library || !library.status) {
    return { error: { status: 404, message: "Showcase not found" } };
  }

  const entityId = String(library._id);
  const resolved = await resolvePageSections("section", entityId);
  if (resolved.error) return resolved;

  return {
    showcase: {
      ...library,
      id: library._id,
      public_path: publicPathForShowcase(library.showcase_key),
    },
    ...resolved,
  };
}

export async function rebuildShowcasePlacements(showcaseKey) {
  const key = String(showcaseKey || "index").toLowerCase();
  let placements;
  if (key === "index") {
    placements = buildIndexPagePlacements();
  } else {
    const allowed = await activeSectionKeysForCategory(key);
    placements = filterCategoryPlacements(
      buildCategoryPagePlacements(key),
      allowed
    );
  }
  return placements;
}
