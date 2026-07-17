import mongoose from "mongoose";
import connectDB from "../config/db.js";
import SiteTheme from "../modules/cms/site-theme.model.js";
import { defaultSiteTheme } from "../modules/cms/theme.utils.js";

/**
 * Upserts the singleton site theme.
 *
 * Usage:
 *   npm run seed:site-theme
 */
async function seed() {
  await connectDB();
  const defaults = defaultSiteTheme();
  const doc = await SiteTheme.findOneAndUpdate(
    { key: "default" },
    { $set: { key: "default", ...defaults } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(
    `Seeded site theme · preset=${doc.preset} · brand=${doc.brand_primary} · surface=${doc.surface_mode}`
  );
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
