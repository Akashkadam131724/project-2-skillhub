import SectionCategory from "./section-category.model.js";

export function categoryKeyFromSection(section) {
  const cat = section?.section_category;
  if (cat && typeof cat === "object" && cat.key) {
    return String(cat.key).toLowerCase();
  }
  if (section?.category_key) {
    return String(section.category_key).toLowerCase();
  }
  return "";
}

export function formatSectionJson(section) {
  if (!section) return section;
  const plain = section.toObject ? section.toObject({ virtuals: true }) : { ...section };
  const categoryKey = categoryKeyFromSection(plain);
  const cat = plain.section_category;
  const sectionCategoryId =
    cat && typeof cat === "object" ? cat._id : cat || null;

  return {
    ...plain,
    section_category: sectionCategoryId,
    category_key: categoryKey,
    category: categoryKey,
  };
}

export function formatSectionsJson(sections) {
  return (sections || []).map((s) => formatSectionJson(s));
}

export async function resolveSectionCategoryId(categoryKey) {
  const key = String(categoryKey || "").toLowerCase().trim();
  if (!key) return null;
  const doc = await SectionCategory.findByKey(key).select("_id").lean();
  return doc?._id || null;
}

export async function getSectionCategoryIdMap() {
  const docs = await SectionCategory.find({ status: { $ne: false } })
    .select("key")
    .lean();
  return new Map(docs.map((d) => [d.key, d._id]));
}
