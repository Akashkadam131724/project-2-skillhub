/**
 * PNG visual insight pages — long-form guides with transparent upload artwork.
 *
 *   npm run seed:step -- png-insights-pages
 */
import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import Section from "../../../modules/cms/section.model.js";
import { getSectionCatalogMeta } from "../../../modules/cms/section.catalog.js";
import { resolveSectionCategoryId } from "../../../modules/cms/section-category.utils.js";
import {
  applyContentPlacements,
  ensureContent,
  ensureContentPageTemplate,
} from "../../lib/content-page-seed-helpers.js";
import {
  allPngInsightPageDefs,
  INSIGHT_CHILD_PAGES,
} from "../../lib/png-insights-content-pages.js";

const MANAGED_SECTIONS = [
  { key: "editorial_banner", name: "Editorial Banner", description: "Full-bleed editorial hero", content_scope: "page" },
  { key: "feature_spotlight", name: "Feature Spotlight", description: "Asymmetric spotlight cards", content_scope: "page" },
  { key: "text_media", name: "Text Media", description: "Alternating text and media blocks", content_scope: "page" },
  { key: "process_steps", name: "Process Steps", description: "Numbered process steps", content_scope: "page" },
  { key: "stats", name: "Stats", description: "Statistics band", content_scope: "page" },
  { key: "faq", name: "FAQ", description: "Frequently asked questions", content_scope: "page" },
  { key: "cta_band", name: "CTA Band", description: "Call-to-action band", content_scope: "page" },
];

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

async function seed() {
  await connectDB();
  console.log("Seeding PNG visual insight pages…");

  await ensureContentPageTemplate();
  for (const def of MANAGED_SECTIONS) {
    await ensureSection(def);
  }

  const pages = allPngInsightPageDefs();
  for (const page of pages) {
    const contentDoc = await ensureContent({
      name: page.name,
      slug: page.slug,
      path: page.path,
      description: page.description,
      status: "active",
      sortOrder: page.sortOrder,
    });
    const n = await applyContentPlacements(contentDoc, page.placements());
    console.log(`  ✓ ${page.path} (${n} sections)`);
  }

  console.log(`
Done.
  Insights hub: /insights (${INSIGHT_CHILD_PAGES.length} guides)
  Open: http://localhost:3001/insights
`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
