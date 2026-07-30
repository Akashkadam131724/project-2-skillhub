import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import EntityPageSection from "../../../modules/cms/entity-page-section.model.js";
import SkillingArea from "../../../modules/skilling-area/skilling-area.model.js";
import Industry from "../../../modules/industry/industry.model.js";
import {
  buildTagIndex,
  overridesToDocs,
  seedTemplateContent,
} from "../../lib/cms-seed-shared.js";
import {
  buildIndustryOverrides,
  buildSkillingAreaOverrides,
} from "../../lib/feed-seed-shared.js";
import { loadUploadsManifest } from "../../lib/upload-manifest.js";
import { seedSafeMode, logSafeMode } from "../../lib/seed-env.js";

const ENTITY_PAGE_KEYS = ["skilling_area", "industry"];
const BATCH = 500;

async function insertBatched(docs) {
  let inserted = 0;
  for (let i = 0; i < docs.length; i += BATCH) {
    const chunk = docs.slice(i, i + BATCH);
    if (!chunk.length) continue;
    await EntityPageSection.insertMany(chunk, { ordered: false });
    inserted += chunk.length;
  }
  return inserted;
}

async function persistOverrideDocs(docs) {
  if (!docs.length) return 0;

  if (seedSafeMode()) {
    logSafeMode(`upsert ${docs.length} skilling/industry override(s) (no delete)`);
    let n = 0;
    for (const doc of docs) {
      await EntityPageSection.findOneAndUpdate(
        {
          page_key: doc.page_key,
          entity_id: doc.entity_id,
          page_tag_id: doc.page_tag_id,
        },
        { $set: doc },
        { upsert: true }
      );
      n += 1;
    }
    return n;
  }

  return insertBatched(docs);
}

async function seedSkillingAreas(tagIndex, manifest) {
  const areas = await SkillingArea.find({ status: "active" }).lean();
  const docs = [];
  for (const area of areas) {
    const overrides = buildSkillingAreaOverrides(area, manifest);
    docs.push(
      ...overridesToDocs(
        "skilling_area",
        area._id,
        overrides,
        tagIndex.get("skilling_area")
      )
    );
  }
  return { count: areas.length, docs };
}

async function seedIndustries(tagIndex, manifest) {
  const industries = await Industry.find({ status: "active" }).lean();
  const docs = [];
  for (const industry of industries) {
    const overrides = buildIndustryOverrides(industry, manifest);
    docs.push(
      ...overridesToDocs(
        "industry",
        industry._id,
        overrides,
        tagIndex.get("industry")
      )
    );
  }
  return { count: industries.length, docs };
}

async function seed() {
  await connectDB();
  console.log("Seeding entity CMS for skilling areas + industries…");

  const manifest = loadUploadsManifest();
  const tagUpdates = await seedTemplateContent();
  console.log(`  ✓ ${tagUpdates} template tag placements updated`);

  const tagIndex = await buildTagIndex(ENTITY_PAGE_KEYS);

  if (!seedSafeMode()) {
    await EntityPageSection.deleteMany({
      page_key: { $in: ENTITY_PAGE_KEYS },
    });
    console.log("  ✓ cleared prior skilling_area / industry entity overrides");
  } else {
    logSafeMode("keeping existing EntityPageSection rows; upserting seed defaults");
  }

  const [areaRes, industryRes] = await Promise.all([
    seedSkillingAreas(tagIndex, manifest),
    seedIndustries(tagIndex, manifest),
  ]);

  const allDocs = [...areaRes.docs, ...industryRes.docs];
  const inserted = await persistOverrideDocs(allDocs);

  console.log(`
Done.
  Skilling areas: ${areaRes.count}
  Industries:     ${industryRes.count}
  Overrides:      ${inserted}

Try: /skilling-areas/<slug>  /industries/<slug>
`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
