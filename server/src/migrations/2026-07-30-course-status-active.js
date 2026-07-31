import mongoose from "mongoose";
import connectDB from "../config/db.js";

/**
 * Migration: set course status on legacy rows (missing / draft → active).
 *
 * Run:
 *   npm run migrate:course-status-active
 */
async function migrate() {
  await connectDB();

  const courses = mongoose.connection.collection("courses");

  const before = await courses
    .aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])
    .toArray();

  console.log("Course status before:", before);

  const result = await courses.updateMany(
    {
      $or: [
        { status: { $exists: false } },
        { status: null },
        { status: "" },
        { status: "draft" },
      ],
    },
    { $set: { status: "active" } }
  );

  const after = await courses
    .aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])
    .toArray();

  console.log(
    `Updated ${result.modifiedCount.toLocaleString()} courses → status: active`
  );
  console.log("Course status after:", after);

  await mongoose.disconnect();
  console.log("Done.");
}

migrate().catch(async (err) => {
  console.error("Migration failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
