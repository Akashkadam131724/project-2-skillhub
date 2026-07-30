/**
 * Seed Content pages for NetCom CMS category/header routes.
 *
 *   npm run netcom:categories   # refresh netcom-categories.json (optional)
 *   npm run seed:step -- netcom-category-pages
 */
import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import {
  applyContentPlacements,
  ensureContent,
  ensureContentPageTemplate,
} from "../../lib/content-page-seed-helpers.js";
import {
  allNetcomCategoryPageDefs,
  NETCOM_CATEGORY_PATHS,
} from "../../lib/netcom-category-content-pages.js";

async function seed() {
  await connectDB();
  console.log("Seeding NetCom category content pages…");

  await ensureContentPageTemplate();

  const pages = allNetcomCategoryPageDefs();
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
  Pages: ${pages.length}
  Paths: ${NETCOM_CATEGORY_PATHS.length}
`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
