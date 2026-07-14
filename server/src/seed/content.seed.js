import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Content from "../modules/content/content.model.js";
import Page from "../modules/cms/page.model.js";

/**
 * Seeds Content catalog + ensures Home page template (entity_type: content).
 * Does not modify section tags — use seed:heroes to attach homepage heroes.
 *
 * Usage:
 *   npm run seed:contents
 */

const CONTENTS = [
  {
    name: "Enterprise-Grade Industry Solutions for Workforce Transformation",
    slug: "home",
    description:
      "SkillHub delivers strategic, industry-aligned technology solutions that help enterprise leaders close capability gaps, accelerate digital initiatives, and achieve measurable business impact at scale.",
    status: "active",
    sortOrder: 0,
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
        description: "Marketing home page",
        entity_type: "content",
        status: true,
        is_sort_disabled: true,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log("Upserted Page template: home (entity_type: content)");

  for (const row of CONTENTS) {
    await Content.findOneAndUpdate(
      { slug: row.slug },
      { $set: row },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );
    console.log(`Upserted Content: ${row.slug}`);
  }

  const count = await Content.countDocuments();
  console.log(`Content collection now has ${count} document(s)`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
