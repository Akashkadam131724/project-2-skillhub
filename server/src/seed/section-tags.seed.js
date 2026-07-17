/**
 * Backfill Section.category + Section.tags from the canonical catalog.
 *
 *   npm run seed:section-tags
 *
 * Safe to re-run — updates known keys; leaves unknown keys untouched unless
 * FORCE=1 (then clears empty category/tags only for known keys).
 */
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Section from "../modules/cms/section.model.js";
import {
  SECTION_CATALOG_META,
  getSectionCatalogMeta,
} from "../modules/cms/section.catalog.js";

async function seed() {
  await connectDB();

  const keys = Object.keys(SECTION_CATALOG_META);
  let updated = 0;
  let skipped = 0;

  for (const key of keys) {
    const meta = getSectionCatalogMeta(key);
    if (!meta) continue;

    const section = await Section.findOne({ key });
    if (!section) {
      skipped += 1;
      continue;
    }

    section.category = meta.category;
    section.tags = meta.tags;
    await section.save();
    updated += 1;
    console.log(`  ${key} → ${meta.category} [${meta.tags.join(", ")}]`);
  }

  console.log(
    `\nUpdated ${updated} sections (${skipped} catalog keys not in DB yet)`
  );
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("section-tags seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
