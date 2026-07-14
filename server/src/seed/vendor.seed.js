import mongoose from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connectDB from "../config/db.js";
import Vendor from "../modules/vendor/vendor.model.js";

/**
 * Seeds filtered vendors only (no fake bulk vendors).
 *
 * Usage:
 *   npm run seed:vendors
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, "data/filtered-vendors.json");

function toSlug(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text, max) {
  const value = String(text || "").trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}…`;
}

function mapVendor(raw, index) {
  const slug = toSlug(raw.slug || raw.name);
  const shortDescription = truncate(
    stripHtml(raw.short_description || raw.overview || ""),
    2000
  );

  return {
    name: String(raw.name).trim(),
    slug,
    email: `vendor.${slug || index}@netcom.local`,
    description: shortDescription,
    shortDescription,
    overview: stripHtml(raw.overview || ""),
    overviewTitle: raw.overview_title || "",
    subHeading: raw.sub_heading || "",
    redirectUrl: raw.redirect_url || "",
    logoUrl: raw.logo || null,
    partnerLogo: raw.partner_logo || null,
    colorLogo: raw.color_logo || null,
    whiteLogo: raw.white_logo || null,
    vendorCatalogueLogo: raw.vendor_catalogue_logo || null,
    productCount: Number(raw.product_count) || 0,
    courseCount: Number(raw.course_count) || 0,
    certificationCount: Number(raw.certification_count) || 0,
    learnersCount: Number(raw.learners_count) || 0,
    status: "active",
    isVerified: Boolean(raw.logo || raw.partner_logo || raw.color_logo),
    categories: ["training", "certification"],
  };
}

async function seed() {
  await connectDB();

  const payload = JSON.parse(readFileSync(DATA_PATH, "utf8"));
  const rows = payload.filtered_vendors || [];
  if (!rows.length) {
    console.error("No vendors found in filtered-vendors.json");
    process.exit(1);
  }

  const docs = rows.map(mapVendor);

  console.log(`Clearing existing vendors...`);
  await Vendor.deleteMany({});

  const inserted = await Vendor.insertMany(docs, { ordered: false });
  console.log(`Seeded ${inserted.length} SkillHub vendors`);
  console.log(
    `Products planned: ${inserted.reduce((n, v) => n + v.productCount, 0)}`
  );
  console.log(
    `Courses planned: ${inserted.reduce((n, v) => n + v.courseCount, 0)}`
  );

  await mongoose.disconnect();
  console.log("Done. Disconnected.");
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
