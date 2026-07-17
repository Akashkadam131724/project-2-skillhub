import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Section from "../modules/cms/section.model.js";
import EntityPageSection from "../modules/cms/entity-page-section.model.js";
import Vendor from "../modules/vendor/vendor.model.js";
import {
  applyContent,
  buildVendorOverrides,
  seedTemplateContent,
} from "./lib/cms-seed-shared.js";

/**
 * Seeds realistic CMS mapping content for EVERY page template’s sections,
 * then adds per-vendor entity overrides (with intentional blanks) so you can
 * compare live cascade vs CMS edit mode.
 *
 * Does NOT wipe pages/sections catalog — only fills content on existing tags.
 *
 * Usage:
 *   npm run seed:cms-content
 *   VENDOR_ID=6a53e652e1199e1507d50a36 npm run seed:cms-content
 *   VENDOR_SLUG=microsoft-training npm run seed:cms-content
 *
 * Defaults to Microsoft (microsoft) when no id/slug given.
 * For ALL entities use: npm run seed:entity-cms
 */

async function resolveVendor() {
  const id = process.env.VENDOR_ID || process.argv[2];
  const slug = process.env.VENDOR_SLUG;

  if (id && mongoose.Types.ObjectId.isValid(id)) {
    const v = await Vendor.findById(id);
    if (!v) throw new Error(`Vendor not found for id ${id}`);
    return v;
  }
  if (slug) {
    const v = await Vendor.findOne({ slug: String(slug).toLowerCase() });
    if (!v) throw new Error(`Vendor not found for slug ${slug}`);
    return v;
  }

  const fallback =
    (await Vendor.findOne({ slug: "microsoft" })) ||
    (await Vendor.findOne({ name: /microsoft/i })) ||
    (await Vendor.findOne({}));

  if (!fallback) {
    throw new Error("No vendors in DB — run npm run seed:vendors first");
  }
  return fallback;
}

async function seedVendorEntityOverrides(vendor) {
  const pageKey = "vendor";
  const entityId = vendor._id;
  const overrides = buildVendorOverrides(vendor, { emptyTestimonials: true });

  const sections = await Section.find({ "pages.page_key": pageKey });

  await EntityPageSection.deleteMany({
    page_key: pageKey,
    entity_id: entityId,
  });

  let created = 0;
  const skipped = [];

  for (const section of sections) {
    const tags = (section.pages || []).filter((t) => t.page_key === pageKey);
    for (const tag of tags) {
      const patch = overrides[section.key];
      if (!patch) {
        skipped.push(section.key);
        continue;
      }

      const doc = {
        page_key: pageKey,
        entity_id: entityId,
        page_tag_id: tag._id,
        section: section._id,
        section_key: section.key,
        status: true,
      };

      applyContent(doc, patch);
      await EntityPageSection.create(doc);
      created += 1;
    }
  }

  return { created, skipped };
}

async function seed() {
  await connectDB();

  const vendor = await resolveVendor();
  console.log(
    `Seeding CMS content · vendor=${vendor.name} (${vendor._id}) slug=${vendor.slug}`
  );

  const tagUpdates = await seedTemplateContent();
  console.log(`Updated ${tagUpdates} page-tag placements with template content`);

  const { created, skipped } = await seedVendorEntityOverrides(vendor);
  console.log(
    `Created ${created} entity overrides for ${vendor.name} on page "vendor"`
  );
  if (skipped.length) {
    console.log(
      `  Left blank (inherit template only): ${[...new Set(skipped)].join(", ")}`
    );
  }

  console.log(`
Intentional blanks / differences to try:
  • Live vendor page: testimonials hidden (entity items = [])
  • CMS mode: testimonials shows empty hint — add quotes there
  • related_courses: no entity override → inherits template titles
  • FAQ item “certification vouchers” has empty body
  • overview section_img_url left blank for CMS upload
  • stats: 3 metrics only (add a 4th in CMS)

Open: /vendor/${vendor.slug}?cms=true

For all vendors/products/courses: npm run seed:entity-cms
`);

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch(async (err) => {
  console.error("CMS content seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
