import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import Content from "../../../modules/content/content.model.js";
import EntityPageSection from "../../../modules/cms/entity-page-section.model.js";
import { CORE_CONTENT_PATHS } from "../../data/content-site-map.js";
import { seedSafeMode, logSafeMode } from "../../lib/seed-env.js";

/**
 * Remove Content pages outside the business site map (+ delete their EPS).
 *
 *   npm run seed:step -- content-purge
 */
async function seed() {
  await connectDB();
  console.log("Purging non-business content pages…");

  const allowed = new Set(CORE_CONTENT_PATHS);
  const all = await Content.find({}).select("_id path slug name").lean();

  const toRemove = all.filter((doc) => {
    const path = doc.path || "/";
    if (path === "/") return false;
    return !allowed.has(path);
  });

  if (!toRemove.length) {
    console.log("  ✓ no extra content pages to remove");
    await mongoose.disconnect();
    return;
  }

  if (seedSafeMode()) {
    logSafeMode(
      `would remove ${toRemove.length} content page(s) — run without SEED_SAFE to purge`
    );
    for (const doc of toRemove.slice(0, 20)) {
      console.log(`  - ${doc.path} (${doc.name})`);
    }
    if (toRemove.length > 20) console.log(`  … and ${toRemove.length - 20} more`);
    await mongoose.disconnect();
    return;
  }

  const ids = toRemove.map((d) => d._id);
  const eps = await EntityPageSection.deleteMany({
    page_key: "content",
    entity_id: { $in: ids },
  });
  const deleted = await Content.deleteMany({ _id: { $in: ids } });

  console.log(`  ✓ removed ${deleted.deletedCount} content page(s)`);
  console.log(`  ✓ removed ${eps.deletedCount} content EntityPageSection row(s)`);
  for (const doc of toRemove) {
    console.log(`    − ${doc.path}`);
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
