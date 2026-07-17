/**
 * Content pages that showcase every CMS section by category.
 *
 *   /sections              — index with links to all categories
 *   /sections/hero         — 13 hero layouts
 *   /sections/content      — 12 content sections
 *   /sections/features     — 11 feature & card sections
 *   /sections/tabs         — 5 tab variants
 *   /sections/accordion    — FAQ accordion
 *   /sections/catalog      — 7 catalog & learning sections
 *   /sections/social-proof — 6 social proof sections
 *   /sections/data         — stats + metric rail
 *   /sections/navigation   — in-page nav
 *
 * Usage:
 *   npm run seed:sections-showcase
 */
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Content from "../modules/content/content.model.js";
import Page from "../modules/cms/page.model.js";
import Section from "../modules/cms/section.model.js";
import EntityPageSection from "../modules/cms/entity-page-section.model.js";
import { getSectionCatalogMeta } from "../modules/cms/section.catalog.js";
import {
  SECTION_CATEGORIES,
  CATEGORY_SLUG,
  SECTION_NAMES,
  buildIndexPagePlacements,
  buildCategoryPagePlacements,
  sectionsInCategory,
} from "./lib/section-showcase-samples.js";

const INDEX_PATH = "/sections";

const CATEGORY_PAGES = SECTION_CATEGORIES.map((cat) => ({
  categoryKey: cat.key,
  path: `/sections/${CATEGORY_SLUG[cat.key] || cat.key}`,
  slug: `sections-${CATEGORY_SLUG[cat.key] || cat.key}`,
  name: `${cat.name} sections`,
  description: `Live previews of all ${cat.name} section layouts in the SkillHub CMS library.`,
}));

function allSectionKeys() {
  const keys = new Set(["in_page_nav", "hero_centered", "cta_band"]);
  for (const cat of SECTION_CATEGORIES) {
    for (const key of sectionsInCategory(cat.key)) keys.add(key);
  }
  return [...keys];
}

async function ensureContentPage() {
  return Page.findOneAndUpdate(
    { key: "content" },
    {
      $set: {
        key: "content",
        name: "Content page",
        description: "Free-form content pages.",
        entity_type: "content",
        status: true,
        is_sort_disabled: false,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function ensureSection(key) {
  const catalog = getSectionCatalogMeta(key) || {};
  let section = await Section.findOne({ key });
  if (!section) {
    section = await Section.create({
      key,
      name: SECTION_NAMES[key] || key,
      description: `Showcase section · ${key}`,
      status: true,
      category: catalog.category || "",
      tags: catalog.tags || [],
      content_scope: "page",
    });
    console.log(`  + section ${key}`);
  }
  return section;
}

async function replaceExtras(pageKey, entityId, placements, sectionByKey) {
  await EntityPageSection.deleteMany({
    page_key: pageKey,
    entity_id: entityId,
    page_tag_id: null,
  });

  for (const p of placements) {
    const section = sectionByKey.get(p.section_key);
    if (!section) {
      console.warn(`  ! missing section ${p.section_key} — skip`);
      continue;
    }
    await EntityPageSection.create({
      page_key: pageKey,
      entity_id: entityId,
      page_tag_id: null,
      section: section._id,
      section_key: section.key,
      sort_order: p.sort_order,
      status: p.status !== false,
      section_title: p.section_title ?? null,
      sub_title: p.sub_title ?? null,
      in_page_nav_title: p.in_page_nav_title ?? null,
      section_bg_img: p.section_bg_img ?? null,
      section_bg_color: p.section_bg_color ?? null,
      section_img_url: p.section_img_url ?? null,
      data: p.data ?? null,
      buttons: Array.isArray(p.buttons) ? p.buttons : undefined,
      items: Array.isArray(p.items) ? p.items : undefined,
    });
  }
}

async function upsertContentPage(def, placements, sectionByKey) {
  const content = await Content.findOneAndUpdate(
    { path: def.path },
    {
      $set: {
        path: def.path,
        slug: def.slug,
        name: def.name,
        description: def.description,
        status: "active",
        sortOrder: def.sortOrder ?? 20,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );

  await replaceExtras("content", content._id, placements, sectionByKey);
  return { content, count: placements.length };
}

async function seed() {
  await connectDB();
  console.log("Seeding section library showcase content pages…");

  await ensureContentPage();

  const sectionByKey = new Map();
  for (const key of allSectionKeys()) {
    sectionByKey.set(key, await ensureSection(key));
  }

  const indexPlacements = buildIndexPagePlacements();
  const index = await upsertContentPage(
    {
      path: INDEX_PATH,
      slug: "sections",
      name: "Section library",
      description:
        "Index of all SkillHub CMS section categories with links to live previews.",
      sortOrder: 15,
    },
    indexPlacements,
    sectionByKey
  );
  console.log(`  ✓ ${INDEX_PATH} (${index.count} sections)`);

  for (let i = 0; i < CATEGORY_PAGES.length; i += 1) {
    const def = CATEGORY_PAGES[i];
    const placements = buildCategoryPagePlacements(def.categoryKey);
    const result = await upsertContentPage(
      { ...def, sortOrder: 16 + i },
      placements,
      sectionByKey
    );
    const n = sectionsInCategory(def.categoryKey).length;
    console.log(`  ✓ ${def.path} (${n} section types · ${result.count} placements)`);
  }

  console.log("\nDone. Open:");
  console.log(`  ${INDEX_PATH}`);
  for (const def of CATEGORY_PAGES) {
    console.log(`  ${def.path}`);
  }
  console.log(`\nLive edit: ${INDEX_PATH}?cms=true`);

  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("Sections showcase seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
