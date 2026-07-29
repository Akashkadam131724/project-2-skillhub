import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import SkillLevel from "../../../modules/skill-level/skill-level.model.js";
import Course from "../../../modules/course/course.model.js";
import { replaceCatalogDocs } from "../../lib/catalog-upsert.js";

/**
 * Seeds skill levels and assigns ONE level per course.
 *
 * Usage:
 *   npm run seed:skill-levels
 */

const SKILL_LEVELS = [
  {
    name: "Beginner",
    description: "Introductory courses for learners new to the topic.",
    sortOrder: 1,
  },
  {
    name: "Intermediate",
    description: "Courses for learners with some prior experience.",
    sortOrder: 2,
  },
  {
    name: "Advanced",
    description: "Deep-dive courses for experienced practitioners.",
    sortOrder: 3,
  },
  {
    name: "Expert",
    description: "Specialized mastery and leadership-level courses.",
    sortOrder: 4,
  },
];

async function seed() {
  await connectDB();

  const docs = SKILL_LEVELS.map((level) => ({
    ...level,
    status: "active",
  }));
  const { inserted, mode } = await replaceCatalogDocs(SkillLevel, docs, "slug");
  const levels = await SkillLevel.find({}).sort({ sortOrder: 1 }).lean();

  console.log(
    `${mode === "upsert" ? "Upserted" : "Seeded"} ${inserted} skill levels (${levels.length} in DB):`
  );
  for (const level of levels) {
    console.log(`  - ${level.name} (${level.slug})`);
  }

  const levelIds = levels.map((l) => l._id);
  const shouldMap = process.env.MAP_TO_COURSES === "1";
  const courseCount = await Course.countDocuments();

  if (!shouldMap) {
    console.log(
      "Skip course mapping (course.seed assigns taxonomy). Use MAP_TO_COURSES=1 to remap."
    );
  } else if (courseCount === 0) {
    console.log("No courses found — skip mapping. Run seed:courses first.");
  } else {
    console.log(
      `Assigning one skill level to each of ${courseCount.toLocaleString()} courses...`
    );
    const courses = await Course.find({}, { _id: 1 }).lean();
    const BATCH = 500;
    let updated = 0;

    for (let i = 0; i < courses.length; i += BATCH) {
      const slice = courses.slice(i, i + BATCH);
      const ops = slice.map((course, idx) => ({
        updateOne: {
          filter: { _id: course._id },
          update: {
            $set: { skillLevel: levelIds[(i + idx) % levelIds.length] },
          },
        },
      }));
      await Course.bulkWrite(ops, { ordered: false });
      updated += slice.length;
      console.log(
        `  Mapped ${updated.toLocaleString()} / ${courseCount.toLocaleString()}`
      );
    }
  }

  await mongoose.disconnect();
  console.log("Done. Disconnected.");
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
