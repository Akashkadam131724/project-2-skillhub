import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import {
  applyContentPlacements,
  ensureContent,
  ensureContentPageTemplate,
} from "../../lib/content-page-seed-helpers.js";
import { buildSolutionPlacements } from "../../lib/feed-seed-shared.js";
import {
  loadUploadsManifest,
  solutionFolders,
} from "../../lib/upload-manifest.js";

function slugFromPath(pathname) {
  const parts = String(pathname || "")
    .split("/")
    .filter(Boolean);
  return parts[parts.length - 1] || "page";
}

async function seed() {
  await connectDB();
  console.log("Seeding content pages from uploads manifest…");

  const manifest = loadUploadsManifest();
  const folders = solutionFolders(manifest);
  console.log(`  Found ${folders.length} page asset folder(s) with suggested routes`);

  await ensureContentPageTemplate();

  let pageCount = 0;
  let placementCount = 0;

  for (let i = 0; i < folders.length; i++) {
    const folder = folders[i];
    const sp = folder.suggestedPage;
    const path = sp.path;
    const slug = slugFromPath(path);
    const copy = buildSolutionPlacements(folder, manifest);
    const description =
      copy.find((p) => p.section_key === "overview")?.data?.body?.replace(/<[^>]+>/g, "") ||
      sp.title;

    const contentDoc = await ensureContent({
      name: sp.title || folder.label,
      slug,
      path,
      description: description.slice(0, 280),
      status: "active",
      sortOrder: 100 + i * 5,
    });

    const n = await applyContentPlacements(contentDoc, copy);
    pageCount += 1;
    placementCount += n;
    console.log(`  ✓ ${path} (${n} sections, folder=${folder.id})`);
  }

  console.log(`
Done.
  Content pages: ${pageCount}
  Section placements: ${placementCount}
  Try: ${folders[0]?.suggestedPage?.path || "/solutions/business-ai"}
`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
