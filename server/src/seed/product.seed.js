import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Vendor from "../modules/vendor/vendor.model.js";
import Product from "../modules/product/product.model.js";

/**
 * Seeds products from each vendor's productCount.
 * If a vendor has courses but 0 products, creates 1 fallback product.
 *
 * Usage:
 *   npm run seed:products
 */

const PRODUCT_SUFFIXES = [
  "Fundamentals",
  "Essentials",
  "Associate",
  "Professional",
  "Specialty",
  "Administrator",
  "Developer",
  "Architect",
  "Security",
  "Cloud",
  "Data",
  "AI & Automation",
  "Networking",
  "Operations",
  "Leadership",
  "Certification Path",
];

function toSlug(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function productCountFor(vendor) {
  const count = Number(vendor.productCount) || 0;
  if (count > 0) return count;
  // Vendors like ISTQB / SkillHub may have courses but no products
  return Number(vendor.courseCount) > 0 ? 1 : 0;
}

function buildProductsForVendor(vendor) {
  const count = productCountFor(vendor);
  const products = [];

  for (let i = 1; i <= count; i++) {
    const suffix = PRODUCT_SUFFIXES[(i - 1) % PRODUCT_SUFFIXES.length];
    const name =
      count === 1
        ? `${vendor.name} Training`
        : `${vendor.name} ${suffix}${i > PRODUCT_SUFFIXES.length ? ` ${Math.ceil(i / PRODUCT_SUFFIXES.length)}` : ""}`;

    products.push({
      name: name.slice(0, 120),
      slug: toSlug(`${vendor.slug}-${suffix}-${i}`),
      description:
        vendor.shortDescription ||
        `${name} — product catalog entry for ${vendor.name}.`,
      category: "training",
      status: "active",
      images: vendor.logoUrl ? [vendor.logoUrl] : [],
      vendor: vendor._id,
    });
  }

  return products;
}

async function seed() {
  await connectDB();

  const vendors = await Vendor.find({}).sort({ name: 1 }).lean();
  if (!vendors.length) {
    console.error("No vendors found. Run `npm run seed:vendors` first.");
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`Vendors available: ${vendors.length}`);
  console.log("Clearing existing products...");
  await Product.deleteMany({});

  const docs = vendors.flatMap(buildProductsForVendor);
  if (!docs.length) {
    console.error("No products to insert.");
    await mongoose.disconnect();
    process.exit(1);
  }

  // Ensure unique slugs if collisions occur
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

  await Product.insertMany(docs, { ordered: false });
  const total = await Product.countDocuments();
  console.log(`Seeded ${total} products across ${vendors.length} vendors`);

  for (const vendor of vendors.slice(0, 5)) {
    const count = await Product.countDocuments({ vendor: vendor._id });
    console.log(`  ${vendor.name}: ${count} products`);
  }

  await mongoose.disconnect();
  console.log("Done. Disconnected.");
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
