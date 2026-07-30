/**
 * Campaign & promotion content pages with upload imagery.
 *
 *   npm run seed:step -- campaign-promotion-pages
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
  allCampaignPromotionPageDefs,
  CAMPAIGN_CHILD_PAGES,
  PROMOTION_CHILD_PAGES,
} from "../../lib/campaign-promotion-content-pages.js";

const MANAGED_SECTIONS = [
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
  console.log("Seeding campaign & promotion content pages…");

  await ensureContentPageTemplate();
  for (const def of MANAGED_SECTIONS) {
    await ensureSection(def);
  }

  const pages = allCampaignPromotionPageDefs();
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
  Campaigns hub: /campaigns (${CAMPAIGN_CHILD_PAGES.length} offers)
  Promotions hub: /promotions (${PROMOTION_CHILD_PAGES.length} offers)
  Open: http://localhost:3001/campaigns
`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
