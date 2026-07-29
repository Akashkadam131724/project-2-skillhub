/**
 * Upsert section categories and assign Section.section_category from the
 * canonical catalog (SECTION_CATALOG_META) — aligned with UI component folders.
 *
 * Usage: npm run seed:section-categories
 */
import connectDB from "../../../config/db.js";
import SectionCategory from "../../../modules/cms/section-category.model.js";
import { SECTION_CATEGORIES } from "../../../modules/cms/section.catalog.js";
import { syncSectionCategoriesFromCatalog } from "../../../modules/cms/section-category-sync.js";

async function seed() {
  await connectDB();

  for (let i = 0; i < SECTION_CATEGORIES.length; i++) {
    const cat = SECTION_CATEGORIES[i];
    await SectionCategory.findOneAndUpdate(
      { key: cat.key },
      {
        $set: {
          name: cat.name,
          sort_order: i,
          status: true,
        },
        $setOnInsert: { key: cat.key, description: "" },
      },
      { upsert: true, new: true }
    );
  }

  const { linked, uncategorized } = await syncSectionCategoriesFromCatalog();

  console.log(`Upserted ${SECTION_CATEGORIES.length} section categories`);
  console.log(`Linked section_category on ${linked} sections (from catalog meta)`);
  if (uncategorized.length) {
    console.log(
      `Uncategorized (${uncategorized.length}): ${uncategorized.slice(0, 30).join(", ")}${uncategorized.length > 30 ? "…" : ""}`
    );
  }
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
