import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Industry from "../modules/industry/industry.model.js";
import Course from "../modules/course/course.model.js";

/**
 * Seeds industries and maps them onto courses (many-to-many).
 *
 * Usage:
 *   npm run seed:industries
 */

const INDUSTRIES = [
  {
    name: "Information Technology",
    description: "Software, infrastructure, and digital services.",
    sortOrder: 1,
  },
  {
    name: "Finance & Banking",
    description: "Banking, fintech, insurance, and capital markets.",
    sortOrder: 2,
  },
  {
    name: "Healthcare",
    description: "Hospitals, pharma, and health technology.",
    sortOrder: 3,
  },
  {
    name: "Education",
    description: "Schools, universities, and edtech organizations.",
    sortOrder: 4,
  },
  {
    name: "Government",
    description: "Public sector and civic technology.",
    sortOrder: 5,
  },
  {
    name: "Retail & Ecommerce",
    description: "Retail operations and digital commerce.",
    sortOrder: 6,
  },
  {
    name: "Manufacturing",
    description: "Industrial production and supply chain.",
    sortOrder: 7,
  },
  {
    name: "Telecommunications",
    description: "Telecom networks and communication services.",
    sortOrder: 8,
  },
];

function pickRandomIndustries(industryIds, min = 1, max = 3) {
  const count = Math.min(
    industryIds.length,
    Math.floor(Math.random() * (max - min + 1)) + min
  );
  const shuffled = [...industryIds].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

async function seed() {
  await connectDB();

  console.log("Clearing existing industries...");
  await Industry.deleteMany({});

  const industries = await Industry.insertMany(
    INDUSTRIES.map((item) => ({
      ...item,
      status: "active",
    }))
  );

  console.log(`Seeded ${industries.length} industries:`);
  for (const industry of industries) {
    console.log(`  - ${industry.name} (${industry.slug})`);
  }

  const industryIds = industries.map((i) => i._id);
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
      `Mapping industries onto ${courseCount.toLocaleString()} courses...`
    );
    const courses = await Course.find({}, { _id: 1 }).lean();
    const BATCH = 500;
    let updated = 0;

    for (let i = 0; i < courses.length; i += BATCH) {
      const slice = courses.slice(i, i + BATCH);
      const ops = slice.map((course) => ({
        updateOne: {
          filter: { _id: course._id },
          update: { $set: { industries: pickRandomIndustries(industryIds) } },
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
