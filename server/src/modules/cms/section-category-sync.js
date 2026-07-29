import Section from "./section.model.js";
import { getSectionCatalogMeta } from "./section.catalog.js";
import { getSectionCategoryIdMap } from "./section-category.utils.js";

/**
 * Assign Section.section_category from SECTION_CATALOG_META (matches UI / component folders).
 */
export async function syncSectionCategoriesFromCatalog() {
  const catMap = await getSectionCategoryIdMap();
  const sections = await Section.find({}).select("key").lean();

  let linked = 0;
  const uncategorized = [];

  for (const row of sections) {
    const meta = getSectionCatalogMeta(row.key);
    const categoryKey = meta?.category || "";
    const catId = catMap.get(categoryKey);
    if (!catId) {
      uncategorized.push(row.key);
      continue;
    }
    await Section.updateOne(
      { key: row.key },
      {
        $set: { section_category: catId },
        $unset: { category: "", tags: "" },
      }
    );
    linked += 1;
  }

  return { linked, uncategorized };
}
