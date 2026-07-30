/**
 * Component gallery — themed content pages with one section per CMS category.
 *
 *   npm run seed:step -- component-gallery-pages
 */
import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import Section from "../../../modules/cms/section.model.js";
import { getSectionCatalogMeta } from "../../../modules/cms/section.catalog.js";
import { resolveSectionCategoryId } from "../../../modules/cms/section-category.utils.js";
import { SECTION_CATEGORIES } from "../../../modules/cms/section.catalog.js";
import {
  applyContentPlacements,
  ensureContent,
  ensureContentPageTemplate,
} from "../../lib/content-page-seed-helpers.js";
import {
  allComponentGalleryPageDefs,
  COMPONENT_THEME_PAGES,
  buildComponentCategoryPagePlacements,
} from "../../lib/component-gallery-content-pages.js";
import { sectionsInCategory } from "../../lib/section-showcase-samples.js";

async function ensureSection(def) {
  let section = await Section.findOne({ key: def.key });
  if (section) return section;
  const catalog = getSectionCatalogMeta(def.key);
  const catId = catalog?.category
    ? await resolveSectionCategoryId(catalog.category)
    : null;
  return Section.create({
    ...def,
    status: true,
    pages: [],
    ...(catId ? { section_category: catId } : {}),
  });
}

function allSectionKeysForGallery() {
  const keys = new Set(["in_page_nav", "editorial_banner", "cta_band", "stats", "pillar_destinations", "feature_spotlight"]);
  for (const cat of SECTION_CATEGORIES) {
    for (const key of sectionsInCategory(cat.key)) keys.add(key);
  }
  return [...keys];
}

async function seed() {
  await connectDB();
  console.log("Seeding component gallery pages (one section per category)…");

  await ensureContentPageTemplate();

  for (const key of allSectionKeysForGallery()) {
    const catalog = getSectionCatalogMeta(key);
    await ensureSection({
      key,
      name: key,
      description: `Component gallery · ${key}`,
      content_scope: "page",
      ...(catalog?.category ? {} : {}),
    });
  }

  const pages = allComponentGalleryPageDefs();
  for (const page of pages) {
    const contentDoc = await ensureContent({
      name: page.name,
      slug: page.slug,
      path: page.path,
      description: page.description,
      status: "active",
      sortOrder: page.sortOrder,
    });
    const placements = typeof page.placements === "function" ? page.placements() : page.placements;
    const n = await applyContentPlacements(contentDoc, placements);
    if (page.path !== "/components") {
      const sample = buildComponentCategoryPagePlacements(page);
      console.log(`  ✓ ${page.path} (${n} sections · ${sample.length} placements)`);
    } else {
      console.log(`  ✓ ${page.path} (${n} sections)`);
    }
  }

  console.log(`
Done.
  Hub: /components
  Themed pages: ${COMPONENT_THEME_PAGES.length}
  Open: http://localhost:3001/components
`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
