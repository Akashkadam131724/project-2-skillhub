/**
 * Public section library (page_key `section`, entity_type `section`).
 * Seeds SectionLibrary entities + EntityPageSection showcase placements.
 *
 *   GET /section           — index
 *   GET /section/:slug     — category previews
 *
 * Usage:
 *   npm run seed:section-library
 */
import connectDB from "../../../config/db.js";
import Page from "../../../modules/cms/page.model.js";
import Section from "../../../modules/cms/section.model.js";
import SectionCategory from "../../../modules/cms/section-category.model.js";
import SectionLibrary from "../../../modules/cms/section-library.model.js";
import EntityPageSection from "../../../modules/cms/entity-page-section.model.js";
import { getSectionCatalogMeta } from "../../../modules/cms/section.catalog.js";
import { resolveSectionCategoryId } from "../../../modules/cms/section-category.utils.js";
import { syncSectionCategoriesFromCatalog } from "../../../modules/cms/section-category-sync.js";
import {
  SECTION_CATEGORIES,
  CATEGORY_SLUG,
  SECTION_NAMES,
  buildIndexPagePlacements,
  buildCategoryPagePlacements,
  sectionsInCategory,
} from "../../lib/section-showcase-samples.js";
import { rebuildShowcasePlacements } from "../../../modules/cms/section-library.service.js";
import { replaceEntityExtras } from "../../lib/replace-entity-extras.js";

async function upsertSectionCategories() {
  for (let i = 0; i < SECTION_CATEGORIES.length; i++) {
    const cat = SECTION_CATEGORIES[i];
    await SectionCategory.findOneAndUpdate(
      { key: cat.key },
      {
        $set: { name: cat.name, sort_order: i, status: true },
        $setOnInsert: { key: cat.key, description: "" },
      },
      { upsert: true }
    );
  }
}

async function ensureSectionPage() {
  return Page.findOneAndUpdate(
    { key: "section" },
    {
      $set: {
        key: "section",
        name: "Section library",
        description:
          "Public showcase surfaces for CMS section components (not a content page).",
        entity_type: "section",
        status: true,
        is_sort_disabled: false,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function ensureSection(key) {
  const catalog = getSectionCatalogMeta(key) || {};
  const catId = catalog.category
    ? await resolveSectionCategoryId(catalog.category)
    : null;
  let section = await Section.findOne({ key });
  if (!section) {
    section = await Section.create({
      key,
      name: SECTION_NAMES[key] || key,
      description: `Showcase · ${key}`,
      status: true,
      content_scope: "page",
      ...(catId ? { section_category: catId } : {}),
    });
    console.log(`  + section ${key}`);
  } else if (catId) {
    await Section.updateOne(
      { _id: section._id },
      { $set: { section_category: catId } }
    );
  }
  return section;
}

async function replaceExtras(entityId, placements, sectionByKey) {
  await replaceEntityExtras(EntityPageSection, {
    pageKey: "section",
    entityId,
    placements,
    sectionByKey,
    pageTagId: null,
  });
}

function allSectionKeys() {
  const keys = new Set(["in_page_nav", "hero_centered", "cta_band"]);
  for (const cat of SECTION_CATEGORIES) {
    for (const key of sectionsInCategory(cat.key)) keys.add(key);
  }
  return [...keys];
}

async function seedShowcase(showcaseKey, meta, sectionByKey) {
  const library = await SectionLibrary.findOneAndUpdate(
    { showcase_key: showcaseKey },
    {
      $set: {
        showcase_key: showcaseKey,
        name: meta.name,
        description: meta.description || "",
        path_segment: meta.path_segment ?? "",
        status: true,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const placements = await rebuildShowcasePlacements(showcaseKey);
  await replaceExtras(library._id, placements, sectionByKey);
  return { library, count: placements.length };
}

async function seed() {
  await connectDB();
  console.log("Seeding public section library (page_key: section)…");

  await ensureSectionPage();

  await upsertSectionCategories();

  const sectionByKey = new Map();
  for (const key of allSectionKeys()) {
    sectionByKey.set(key, await ensureSection(key));
  }

  const index = await seedShowcase(
    "index",
    {
      name: "Section library",
      description: "Browse all CMS section categories and live previews.",
      path_segment: "",
    },
    sectionByKey
  );
  console.log(`  ✓ /cms/section (${index.count} placements)`);

  for (const cat of SECTION_CATEGORIES) {
    const slug = CATEGORY_SLUG[cat.key] || cat.key;
    const result = await seedShowcase(
      cat.key,
      {
        name: `${cat.name} sections`,
        description: `Live previews for ${cat.name} layouts.`,
        path_segment: slug,
      },
      sectionByKey
    );
    const n = sectionsInCategory(cat.key).length;
    console.log(`  ✓ /cms/section/${slug} (${n} types · ${result.count} placements)`);
  }

  const { linked, uncategorized } = await syncSectionCategoriesFromCatalog();
  console.log(`\nSynced section_category on ${linked} sections`);
  if (uncategorized.length) {
    console.log(`Uncategorized keys: ${uncategorized.join(", ")}`);
  }

  console.log("\nDone. Open /cms/section on the client.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
