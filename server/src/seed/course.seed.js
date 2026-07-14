import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Vendor from "../modules/vendor/vendor.model.js";
import Product from "../modules/product/product.model.js";
import Course from "../modules/course/course.model.js";
import SkillingArea from "../modules/skilling-area/skilling-area.model.js";
import SkillLevel from "../modules/skill-level/skill-level.model.js";
import Industry from "../modules/industry/industry.model.js";

/**
 * Seeds courses from each vendor's courseCount, distributed across that vendor's products.
 *
 * Usage:
 *   npm run seed:courses
 */

const COURSE_TYPES = [
  "Getting Started",
  "Fundamentals",
  "Hands-on Workshop",
  "Certification Prep",
  "Advanced Mastery",
  "Best Practices",
  "Architecture Deep Dive",
  "Admin Crash Course",
  "Developer Bootcamp",
  "Security Essentials",
];

function toSlug(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function pickMany(ids, i, min = 1, max = 3) {
  if (!ids.length) return [];
  const count = Math.min(ids.length, (i % (max - min + 1)) + min);
  const picked = [];
  for (let n = 0; n < count; n++) {
    picked.push(ids[(i + n) % ids.length]);
  }
  return [...new Set(picked.map(String))].map(
    (id) => new mongoose.Types.ObjectId(id)
  );
}

function pickOne(ids, i) {
  if (!ids.length) return null;
  return ids[i % ids.length];
}

async function seed() {
  await connectDB();

  const vendors = await Vendor.find({}).lean();
  if (!vendors.length) {
    console.error("No vendors found. Run `npm run seed:vendors` first.");
    await mongoose.disconnect();
    process.exit(1);
  }

  const products = await Product.find({}, { _id: 1, vendor: 1, name: 1, slug: 1 }).lean();
  if (!products.length) {
    console.error("No products found. Run `npm run seed:products` first.");
    await mongoose.disconnect();
    process.exit(1);
  }

  const [areas, levels, industries] = await Promise.all([
    SkillingArea.find({}, { _id: 1 }).lean(),
    SkillLevel.find({}, { _id: 1 }).lean(),
    Industry.find({}, { _id: 1 }).lean(),
  ]);

  const areaIds = areas.map((a) => a._id);
  const levelIds = levels.map((l) => l._id);
  const industryIds = industries.map((i) => i._id);

  if (!areaIds.length) console.warn("No skilling areas — run seed:skilling-areas");
  if (!levelIds.length) console.warn("No skill levels — run seed:skill-levels");
  if (!industryIds.length) console.warn("No industries — run seed:industries");

  const productsByVendor = new Map();
  for (const product of products) {
    const key = String(product.vendor);
    if (!productsByVendor.has(key)) productsByVendor.set(key, []);
    productsByVendor.get(key).push(product);
  }

  console.log("Clearing existing courses...");
  await Course.deleteMany({});

  const docs = [];
  let courseIndex = 0;

  for (const vendor of vendors) {
    const vendorProducts = productsByVendor.get(String(vendor._id)) || [];
    const targetCourses = Number(vendor.courseCount) || 0;
    if (!targetCourses || !vendorProducts.length) continue;

    for (let i = 1; i <= targetCourses; i++) {
      courseIndex += 1;
      const product = vendorProducts[(i - 1) % vendorProducts.length];
      const type = COURSE_TYPES[(i - 1) % COURSE_TYPES.length];
      const name = `${vendor.name}: ${type} ${i}`.slice(0, 120);

      docs.push({
        name,
        slug: toSlug(`${vendor.slug}-course-${i}`),
        description:
          vendor.shortDescription ||
          `${name} mapped to ${product.name} for ${vendor.name}.`,
        product: product._id,
        skillLevel: pickOne(levelIds, courseIndex),
        skillingAreas: pickMany(areaIds, courseIndex),
        industries: pickMany(industryIds, courseIndex),
      });
    }
  }

  // Ensure unique slugs
  const seen = new Set();
  for (const doc of docs) {
    let slug = doc.slug;
    let n = 2;
    while (seen.has(slug)) {
      slug = `${doc.slug}-${n}`;
      n += 1;
    }
    doc.slug = slug;
    seen.add(slug);
  }

  const BATCH = 1000;
  for (let i = 0; i < docs.length; i += BATCH) {
    const slice = docs.slice(i, i + BATCH);
    await Course.insertMany(slice, { ordered: false });
    console.log(
      `Inserted ${Math.min(i + BATCH, docs.length).toLocaleString()} / ${docs.length.toLocaleString()}`
    );
  }

  const total = await Course.countDocuments();
  console.log(`\nSeeded ${total.toLocaleString()} courses`);

  for (const vendor of vendors.slice(0, 5)) {
    const vendorProducts = productsByVendor.get(String(vendor._id)) || [];
    const ids = vendorProducts.map((p) => p._id);
    const count = ids.length
      ? await Course.countDocuments({ product: { $in: ids } })
      : 0;
    console.log(
      `  ${vendor.name}: planned ${vendor.courseCount}, seeded ${count}`
    );
  }

  await mongoose.disconnect();
  console.log("\nDone. Disconnected.");
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
