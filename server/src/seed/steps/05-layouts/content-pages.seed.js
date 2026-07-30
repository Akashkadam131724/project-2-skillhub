/**
 * Business marketing content pages — local /uploads/ images only.
 *
 * Pages: /about-us, /our-team, /solutions, /get-started
 *
 *   npm run seed:step -- content-pages
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
import { BUSINESS_CONTENT_PAGES } from "../../lib/business-content-pages.js";

const MANAGED_SECTIONS = [
  { key: "team", name: "Team", description: "Team member grid", content_scope: "page" },
  { key: "editorial_banner", name: "Editorial Banner", description: "Full-bleed editorial hero", content_scope: "page" },
  { key: "feature_spotlight", name: "Feature Spotlight", description: "Asymmetric spotlight cards", content_scope: "page" },
  { key: "process_steps", name: "Process Steps", description: "Numbered process steps", content_scope: "page" },
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
  console.log("Seeding business content pages (uploads images)…");

  await ensureContentPageTemplate();
  for (const def of MANAGED_SECTIONS) {
    await ensureSection(def);
  }

  for (const page of BUSINESS_CONTENT_PAGES) {
    const contentDoc = await ensureContent({
      name: page.name,
      slug: page.slug,
      path: page.path,
      description: page.description,
      status: "active",
      sortOrder: page.sortOrder,
    });
    const placements = page.placements();
    const n = await applyContentPlacements(contentDoc, placements);
    console.log(`  ✓ ${page.path} (${n} sections)`);
  }

  console.log(`
Done.
  ${BUSINESS_CONTENT_PAGES.map((p) => p.path).join("\n  ")}
`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
