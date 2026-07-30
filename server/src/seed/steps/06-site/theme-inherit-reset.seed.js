import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import Page from "../../../modules/cms/page.model.js";
import Section from "../../../modules/cms/section.model.js";
import EntityPageSection from "../../../modules/cms/entity-page-section.model.js";
import EntityPageTheme from "../../../modules/cms/entity-page-theme.model.js";
import { emptyPageTheme } from "../../../modules/cms/theme.utils.js";

/**
 * Clear per-page / per-entity theme overrides so live pages inherit SiteTheme only.
 * Clears section band theme overrides (catalog, tag, entity) → inherit site surface_mode.
 *
 * Usage: npm run seed:theme-inherit-reset
 */
async function seed() {
  await connectDB();

  const themeDelete = await EntityPageTheme.deleteMany({});
  console.log(`Removed ${themeDelete.deletedCount} entity page theme row(s)`);

  const emptyTheme = emptyPageTheme();
  const pageReset = await Page.updateMany({}, { $set: { theme: emptyTheme } });
  console.log(`Reset template theme on ${pageReset.modifiedCount} page(s)`);

  const catalogReset = await Section.updateMany(
    { section_theme: { $nin: ["", null] } },
    { $set: { section_theme: "" } }
  );
  console.log(
    `Cleared catalog section_theme on ${catalogReset.modifiedCount} section(s)`
  );

  let tagsCleared = 0;
  const tagCursor = Section.find({
    pages: { $elemMatch: { section_theme: { $nin: ["", null] } } },
  });
  for await (const doc of tagCursor) {
    let dirty = false;
    for (const tag of doc.pages || []) {
      if (String(tag.section_theme || "").trim()) {
        tag.section_theme = "";
        dirty = true;
        tagsCleared += 1;
      }
    }
    if (dirty) await doc.save();
  }
  if (tagsCleared) {
    console.log(`Cleared section_theme on ${tagsCleared} page tag(s)`);
  }

  const epsReset = await EntityPageSection.updateMany(
    { section_theme: { $nin: ["", null] } },
    { $set: { section_theme: null } }
  );
  console.log(
    `Cleared entity section_theme on ${epsReset.modifiedCount} placement(s)`
  );

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
