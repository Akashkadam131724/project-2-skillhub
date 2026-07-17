/**
 * Seeds fixed CMS section content on ALL vendor, product, and course detail pages.
 *
 * - Applies shared template defaults (Section.pages[] tags)
 * - Creates EntityPageSection overrides per entity with real catalog data
 *
 * Prerequisites: npm run seed:vendors && seed:products && seed:courses && seed:pages
 *
 * Usage:
 *   npm run seed:entity-cms
 */
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Section from "../modules/cms/section.model.js";
import Page from "../modules/cms/page.model.js";
import EntityPageSection from "../modules/cms/entity-page-section.model.js";
import Vendor from "../modules/vendor/vendor.model.js";
import Product from "../modules/product/product.model.js";
import Course from "../modules/course/course.model.js";
import {
  buildCourseOverrides,
  buildProductOverrides,
  buildVendorOverrides,
  overridesToDocs,
  buildTagIndex,
  seedTemplateContent,
} from "./lib/cms-seed-shared.js";

const ENTITY_PAGE_KEYS = ["vendor", "product", "course"];
const BATCH = 400;

async function ensureFixedTemplates() {
  await Page.updateMany(
    { key: { $in: ENTITY_PAGE_KEYS } },
    { $set: { is_sort_disabled: true } }
  );

  // One testimonial section on vendor/product — disable duplicate customer_testimonials
  for (const pageKey of ["vendor", "product"]) {
    const sections = await Section.find({ "pages.page_key": pageKey });
    for (const section of sections) {
      if (section.key !== "customer_testimonials") continue;
      let dirty = false;
      for (const tag of section.pages || []) {
        if (tag.page_key === pageKey && tag.status !== false) {
          tag.status = false;
          dirty = true;
        }
      }
      if (dirty) await section.save();
    }
  }
}

async function insertBatched(docs) {
  let inserted = 0;
  for (let i = 0; i < docs.length; i += BATCH) {
    const chunk = docs.slice(i, i + BATCH);
    if (!chunk.length) continue;
    await EntityPageSection.insertMany(chunk, { ordered: false });
    inserted += chunk.length;
  }
  return inserted;
}

async function seedVendors(tagIndex) {
  const vendors = await Vendor.find({ status: "active" }).lean();
  const docs = [];
  for (const vendor of vendors) {
    const overrides = buildVendorOverrides(vendor);
    docs.push(
      ...overridesToDocs("vendor", vendor._id, overrides, tagIndex.get("vendor"))
    );
  }
  return { count: vendors.length, docs };
}

async function seedProducts(tagIndex) {
  const products = await Product.find({ status: "active" })
    .populate("vendor", "name slug redirectUrl logoUrl")
    .lean();
  const docs = [];
  for (const product of products) {
    const overrides = buildProductOverrides(product, product.vendor);
    docs.push(
      ...overridesToDocs(
        "product",
        product._id,
        overrides,
        tagIndex.get("product")
      )
    );
  }
  return { count: products.length, docs };
}

async function seedCourses(tagIndex) {
  const courses = await Course.find({})
    .populate({
      path: "product",
      select: "name slug vendor",
      populate: { path: "vendor", select: "name slug redirectUrl" },
    })
    .lean();
  const docs = [];
  for (const course of courses) {
    const overrides = buildCourseOverrides(
      course,
      course.product,
      course.product?.vendor
    );
    docs.push(
      ...overridesToDocs("course", course._id, overrides, tagIndex.get("course"))
    );
  }
  return { count: courses.length, docs };
}

async function seed() {
  await connectDB();
  console.log("Seeding entity CMS content for vendor / product / course pages…");

  const tagUpdates = await seedTemplateContent();
  console.log(`  ✓ ${tagUpdates} template tag placements updated`);

  await ensureFixedTemplates();
  console.log("  ✓ entity templates locked (is_sort_disabled) + testimonial deduped");

  const tagIndex = await buildTagIndex(ENTITY_PAGE_KEYS);

  await EntityPageSection.deleteMany({
    page_key: { $in: ENTITY_PAGE_KEYS },
  });
  console.log("  ✓ cleared prior vendor/product/course entity overrides");

  const [vendorRes, productRes, courseRes] = await Promise.all([
    seedVendors(tagIndex),
    seedProducts(tagIndex),
    seedCourses(tagIndex),
  ]);

  const allDocs = [
    ...vendorRes.docs,
    ...productRes.docs,
    ...courseRes.docs,
  ];
  const inserted = await insertBatched(allDocs);

  console.log(`
Done.
  Vendors:  ${vendorRes.count} entities
  Products: ${productRes.count} entities
  Courses:  ${courseRes.count} entities
  Overrides inserted: ${inserted}

Try: /vendor/aws  /product/<slug>  /course/<slug>
CMS:  add ?cms=true
`);

  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("Entity CMS seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
