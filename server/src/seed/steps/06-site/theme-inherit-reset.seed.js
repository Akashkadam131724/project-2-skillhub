import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import Page from "../../../modules/cms/page.model.js";
import Section from "../../../modules/cms/section.model.js";
import EntityPageSection from "../../../modules/cms/entity-page-section.model.js";
import EntityPageTheme from "../../../modules/cms/entity-page-theme.model.js";
import SiteTheme from "../../../modules/cms/site-theme.model.js";

/**
 * One-shot purge of retired page backgrounds and section band fields.
 *
 * Usage: npm run seed:theme-inherit-reset
 */
async function seed() {
  await connectDB();

  const sectionKeys = [
    "section_bg_img",
    "section_bg_color",
    "section_theme",
  ];
  const pageThemeKeys = ["page_bg_color", "page_bg_img"];

  const pageUnset = Object.fromEntries(
    pageThemeKeys.map((key) => [`theme.${key}`, ""])
  );
  const pageReset = await Page.collection.updateMany({}, { $unset: pageUnset });
  console.log(
    `Purged retired page theme fields from ${pageReset.modifiedCount} page(s)`
  );

  const siteThemeUnset = Object.fromEntries(
    pageThemeKeys.map((key) => [key, ""])
  );
  const siteThemeReset = await SiteTheme.collection.updateMany(
    {},
    { $unset: siteThemeUnset }
  );
  console.log(
    `Purged retired page theme fields from ${siteThemeReset.modifiedCount} site theme(s)`
  );

  const entityThemeUnset = Object.fromEntries(
    pageThemeKeys.map((key) => [`theme.${key}`, ""])
  );
  const entityThemeReset = await EntityPageTheme.collection.updateMany(
    {},
    { $unset: entityThemeUnset }
  );
  console.log(
    `Purged retired page theme fields from ${entityThemeReset.modifiedCount} entity theme(s)`
  );

  const catalogUnset = Object.fromEntries(sectionKeys.map((key) => [key, ""]));
  const catalogReset = await Section.collection.updateMany(
    {},
    { $unset: catalogUnset }
  );
  console.log(
    `Purged retired band fields from ${catalogReset.modifiedCount} catalog section(s)`
  );

  const tagUnset = Object.fromEntries(
    sectionKeys.map((key) => [`pages.$[].${key}`, ""])
  );
  const tagReset = await Section.collection.updateMany(
    { "pages.0": { $exists: true } },
    { $unset: tagUnset }
  );
  console.log(
    `Purged retired band fields from ${tagReset.modifiedCount} tagged section document(s)`
  );

  const entityUnset = Object.fromEntries(sectionKeys.map((key) => [key, ""]));
  const epsReset = await EntityPageSection.collection.updateMany(
    {},
    { $unset: entityUnset }
  );
  console.log(
    `Purged retired band fields from ${epsReset.modifiedCount} entity placement(s)`
  );

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
