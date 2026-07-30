import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import Page from "../../../modules/cms/page.model.js";
import { normalizeSurfacePattern } from "../../../modules/cms/theme.utils.js";

/** Default template themes — distinct surface bands per page type. */
const TEMPLATE_THEMES = {
  home: {
    preset: "blue",
    surface_mode: "custom",
    surface_pattern: normalizeSurfacePattern({
      layout: "cycle",
      bands: [
        { id: "white", label: "White", bg: "#ffffff" },
        { id: "sky", label: "Sky", bg: "#f0f7ff" },
      ],
    }),
  },
  content: {
    preset: "ocean",
    surface_mode: "custom",
    surface_pattern: normalizeSurfacePattern({
      layout: "cycle",
      bands: [
        { id: "white", label: "White", bg: "#ffffff" },
        { id: "slate", label: "Slate", bg: "#f1f5f9" },
        { id: "mist", label: "Mist", bg: "#f8fafc" },
      ],
    }),
  },
  vendor: {
    preset: "cobalt",
    surface_mode: "custom",
    surface_pattern: normalizeSurfacePattern({
      layout: "cycle",
      bands: [
        { id: "white", label: "White", bg: "#ffffff" },
        { id: "cool", label: "Cool", bg: "#eef4ff" },
      ],
    }),
  },
  product: {
    preset: "indigo",
    surface_mode: "custom",
    surface_pattern: normalizeSurfacePattern({
      layout: "cycle",
      bands: [
        { id: "white", label: "White", bg: "#ffffff" },
        { id: "lavender", label: "Lavender", bg: "#f5f3ff" },
      ],
    }),
  },
  course: {
    preset: "teal",
    surface_mode: "custom",
    surface_pattern: normalizeSurfacePattern({
      layout: "cycle",
      bands: [
        { id: "white", label: "White", bg: "#ffffff" },
        { id: "mint", label: "Mint", bg: "#ecfdf5" },
      ],
    }),
  },
  industry: {
    preset: "steel",
    surface_mode: "custom",
    surface_pattern: normalizeSurfacePattern({
      layout: "cycle",
      bands: [
        { id: "white", label: "White", bg: "#ffffff" },
        { id: "sand", label: "Sand", bg: "#faf8f5" },
      ],
    }),
  },
  skilling_area: {
    preset: "emerald",
    surface_mode: "custom",
    surface_pattern: normalizeSurfacePattern({
      layout: "cycle",
      bands: [
        { id: "white", label: "White", bg: "#ffffff" },
        { id: "sage", label: "Sage", bg: "#f0fdf4" },
      ],
    }),
  },
  blog: {
    preset: "slate",
    surface_mode: "custom",
    surface_pattern: normalizeSurfacePattern({
      layout: "cycle",
      bands: [
        { id: "white", label: "White", bg: "#ffffff" },
        { id: "grey", label: "Grey", bg: "#f8fafc" },
      ],
    }),
  },
};

async function seed() {
  await connectDB();
  console.log("Seeding default page template themes…");

  let updated = 0;
  for (const [key, theme] of Object.entries(TEMPLATE_THEMES)) {
    const doc = await Page.findOneAndUpdate(
      { key },
      { $set: { theme } },
      { new: true }
    );
    if (doc) {
      updated += 1;
      console.log(`  ✓ ${key} · preset=${theme.preset}`);
    } else {
      console.warn(`  ! page template not found: ${key}`);
    }
  }

  console.log(`\nDone. Updated ${updated} template theme(s).`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
