import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Content, {
  normalizeContentPath,
} from "../modules/content/content.model.js";
import Page from "../modules/cms/page.model.js";

/**
 * Seeds Content catalog + page templates:
 *   - home    → dedicated homepage template (page-level permissions later)
 *   - content → blank template for free-form Content URLs
 *
 * Content.path is the real public URL (`/`, `/about-us`, `/company/careers`).
 *
 * Usage:
 *   npm run seed:contents
 */

const CONTENTS = [
  {
    name: "Enterprise-Grade Industry Solutions for Workforce Transformation",
    slug: "home",
    path: "/",
    description:
      "SkillHub delivers strategic, industry-aligned technology solutions that help enterprise leaders close capability gaps, accelerate digital initiatives, and achieve measurable business impact at scale.",
    status: "active",
    sortOrder: 0,
  },
  {
    name: "About Us",
    slug: "about-us",
    path: "/about-us",
    description: "Learn about SkillHub — mission, story, and approach.",
    status: "active",
    sortOrder: 10,
  },
  {
    name: "Our Team",
    slug: "our-team",
    path: "/our-team",
    description: "Meet the people behind SkillHub.",
    status: "active",
    sortOrder: 20,
  },
  {
    name: "Careers",
    slug: "company-careers",
    path: "/company/careers",
    description: "Join SkillHub — open roles and life at the company.",
    status: "active",
    sortOrder: 30,
  },
];

async function seed() {
  await connectDB();

  await Page.findOneAndUpdate(
    { key: "home" },
    {
      $set: {
        key: "home",
        name: "Home",
        description:
          "Marketing home page template (separate from free-form content pages)",
        entity_type: "content",
        status: true,
        is_sort_disabled: true,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("Upserted Page template: home");

  await Page.findOneAndUpdate(
    { key: "content" },
    {
      $set: {
        key: "content",
        name: "Content pages",
        description:
          "Free-form content pages (about-us, careers, …). No predefined sections.",
        entity_type: "content",
        status: true,
        is_sort_disabled: false,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("Upserted Page template: content");

  // Migrate legacy paths → real URL paths
  const all = await Content.find({}).lean();
  for (const doc of all) {
    const raw = doc.path ?? doc.slug ?? "/";
    const migrated = raw === "home" ? "/" : normalizeContentPath(raw);
    if (migrated !== doc.path) {
      await Content.updateOne({ _id: doc._id }, { $set: { path: migrated } });
      console.log(`Migrated path ${JSON.stringify(doc.path)} → ${migrated}`);
    }
  }

  for (const row of CONTENTS) {
    await Content.findOneAndUpdate(
      { slug: row.slug },
      { $set: row },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );
    console.log(`Upserted Content: ${row.slug} → ${row.path}`);
  }

  const count = await Content.countDocuments();
  console.log(`Content collection now has ${count} document(s)`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
