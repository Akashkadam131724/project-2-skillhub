import mongoose from "mongoose";
import connectDB from "../config/db.js";
import SkillingArea from "../modules/skilling-area/skilling-area.model.js";
import Course from "../modules/course/course.model.js";

/**
 * Seeds skilling areas and maps them onto courses (many-to-many).
 *
 * Usage:
 *   npm run seed:skilling-areas
 */

const SKILLING_AREAS = [
  {
    name: "AI & Data",
    description: "Artificial intelligence, machine learning, and data skills.",
    sortOrder: 1,
  },
  {
    name: "Cloud",
    description: "Cloud platforms, infrastructure, and services.",
    sortOrder: 2,
  },
  {
    name: "Security",
    description: "Cybersecurity, compliance, and risk management.",
    sortOrder: 3,
  },
  {
    name: "Networking",
    description: "Network design, routing, and connectivity.",
    sortOrder: 4,
  },
  {
    name: "App Development",
    description: "Application design, coding, and modern delivery.",
    sortOrder: 5,
  },
  {
    name: "Architecture & Design",
    description: "Solution architecture and system design.",
    sortOrder: 6,
  },
  {
    name: "Business Application",
    description: "Business apps, ERP, CRM, and productivity platforms.",
    sortOrder: 7,
  },
  {
    name: "Business Process",
    description: "Process improvement, automation, and operations.",
    sortOrder: 8,
  },
  {
    name: "Business & Leadership",
    description: "Leadership, management, and business strategy skills.",
    sortOrder: 9,
  },
];

function pickRandomAreas(areaIds, min = 1, max = 3) {
  const count = Math.min(
    areaIds.length,
    Math.floor(Math.random() * (max - min + 1)) + min
  );
  const shuffled = [...areaIds].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

async function seed() {
  await connectDB();

  console.log("Clearing existing skilling areas...");
  await SkillingArea.deleteMany({});

  const areas = await SkillingArea.insertMany(
    SKILLING_AREAS.map((area) => ({
      ...area,
      status: "active",
    }))
  );

  console.log(`Seeded ${areas.length} skilling areas:`);
  for (const area of areas) {
    console.log(`  - ${area.name} (${area.slug})`);
  }

  const areaIds = areas.map((a) => a._id);
  const shouldMap = process.env.MAP_TO_COURSES === "1";
  const courseCount = await Course.countDocuments();

  if (!shouldMap) {
    console.log(
      "Skip course mapping (course.seed assigns taxonomy). Use MAP_TO_COURSES=1 to remap."
    );
  } else if (courseCount === 0) {
    console.log("No courses found — skip mapping. Run seed:courses first.");
  } else {
    console.log(`Mapping skilling areas onto ${courseCount.toLocaleString()} courses...`);
    const courses = await Course.find({}, { _id: 1 }).lean();
    const BATCH = 500;
    let updated = 0;

    for (let i = 0; i < courses.length; i += BATCH) {
      const slice = courses.slice(i, i + BATCH);
      const ops = slice.map((course) => ({
        updateOne: {
          filter: { _id: course._id },
          update: { $set: { skillingAreas: pickRandomAreas(areaIds) } },
        },
      }));
      await Course.bulkWrite(ops, { ordered: false });
      updated += slice.length;
      console.log(`  Mapped ${updated.toLocaleString()} / ${courseCount.toLocaleString()}`);
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
