/**
 * Apply catalog thumbnails from disk:
 *   server/uploads/section-previews/{section_key}.png
 * → Section.section_preview_img = /uploads/section-previews/{section_key}.png
 *
 * Usage:
 *   npm run seed:section-previews
 *   SEED_SAFE=1 npm run seed:section-previews   # only rows with empty preview
 */
import connectDB from "../../../config/db.js";
import Section from "../../../modules/cms/section.model.js";
import { seedSafeMode, logSafeMode } from "../../lib/seed-env.js";
import {
  listSectionPreviewFilesOnDisk,
  sectionPreviewUrlForKey,
} from "../../lib/section-preview-paths.js";

async function seed() {
  await connectDB();
  const onlyIfEmpty = seedSafeMode();
  logSafeMode(
    onlyIfEmpty
      ? "section-previews — skip rows that already have section_preview_img"
      : "section-previews — overwrite from uploads/section-previews"
  );

  const onDisk = new Set(listSectionPreviewFilesOnDisk());
  if (!onDisk.size) {
    console.log(
      "No PNG files in uploads/section-previews/. Add {section_key}.png files and re-run."
    );
    process.exit(0);
  }

  const sections = await Section.find({}).select("key section_preview_img").lean();
  let updated = 0;
  let skipped = 0;
  let missingFile = 0;
  const unknownFiles = [...onDisk];

  for (const row of sections) {
    const url = sectionPreviewUrlForKey(row.key);
    if (!url) {
      missingFile += 1;
      continue;
    }
    const fileKey = url.split("/").pop()?.replace(/\.png$/i, "") || "";
    const idx = unknownFiles.indexOf(fileKey);
    if (idx >= 0) unknownFiles.splice(idx, 1);

    if (onlyIfEmpty && String(row.section_preview_img || "").trim()) {
      skipped += 1;
      continue;
    }

    await Section.updateOne(
      { _id: row._id },
      { $set: { section_preview_img: url } }
    );
    updated += 1;
    console.log(`  ✓ ${row.key} → ${url}`);
  }

  console.log(
    `\nUpdated ${updated} section preview(s)` +
      (skipped ? `, skipped ${skipped} (already set)` : "") +
      (missingFile ? `, ${missingFile} section(s) without a matching PNG` : "")
  );
  if (unknownFiles.length) {
    console.log(
      `PNG files with no Section row (${unknownFiles.length}): ${unknownFiles.slice(0, 20).join(", ")}${unknownFiles.length > 20 ? "…" : ""}`
    );
  }
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
