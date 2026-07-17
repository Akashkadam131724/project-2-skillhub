/**
 * Upserts tab section catalog entries only.
 *
 * This does not map sections onto pages or reset existing CMS content.
 *
 * Usage:
 *   npm run seed:tabs-sections
 */
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Section from "../modules/cms/section.model.js";
import { getSectionCatalogMeta } from "../modules/cms/section.catalog.js";

const TABS_SECTIONS = [
  {
    key: "feature_tabs",
    name: "Tabs — Vertical",
    description: "Vertical tabs with preview panel and optional child cards.",
    section_title: "Explore by category",
    sub_title: "Switch between grouped content without leaving the page.",
    in_page_nav_title: "Tabs",
  },
  {
    key: "tabs_vertical",
    name: "Tabs — Vertical",
    description: "Vertical tabs with preview panel and optional child cards.",
    section_title: "Explore by category",
    sub_title: "Switch between grouped content without leaving the page.",
    in_page_nav_title: "Tabs",
  },
  {
    key: "tabs_horizontal",
    name: "Tabs — Horizontal",
    description: "Horizontal pill tabs with preview panel and optional child cards.",
    section_title: "Explore by topic",
    sub_title: "Use horizontal tabs for compact category switching.",
    in_page_nav_title: "Topics",
  },
  {
    key: "tabs_underline",
    name: "Tabs — Underline",
    description: "Editorial underline tabs with preview panel and optional child cards.",
    section_title: "Choose a path",
    sub_title: "Use underline tabs for cleaner narrative pages.",
    in_page_nav_title: "Paths",
  },
  {
    key: "tabs_success_stories",
    name: "Tabs — Success Stories",
    description:
      "Industry icon tabs with split story panel — logo, headline, CTA, and optional video overlay.",
    section_title: "Client Success Stories: How We Empower Teams",
    sub_title: "",
    in_page_nav_title: "Success stories",
  },
];

async function upsertSection(def) {
  const meta = getSectionCatalogMeta(def.key) || {};
  const section = await Section.findOne({ key: def.key });
  const payload = {
    ...def,
    category: meta.category || "tabs",
    tags: meta.tags || ["tabs"],
    content_scope: "page",
    status: true,
    data: {},
    buttons: [],
  };

  if (!section) {
    await Section.create({ ...payload, pages: [] });
    return "created";
  }

  section.name = payload.name;
  section.description = payload.description;
  section.section_title = section.section_title || payload.section_title;
  section.sub_title = section.sub_title || payload.sub_title;
  section.in_page_nav_title =
    section.in_page_nav_title || payload.in_page_nav_title;
  section.category = payload.category;
  section.tags = payload.tags;
  section.content_scope = "page";
  section.status = true;
  if (!Array.isArray(section.buttons)) section.buttons = [];
  if (!section.data) section.data = {};
  await section.save();
  return "updated";
}

async function seed() {
  await connectDB();

  console.log("Upserting tab section catalog entries...");
  for (const def of TABS_SECTIONS) {
    const action = await upsertSection(def);
    console.log(`  ${action.padEnd(7)} ${def.key}`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch(async (err) => {
  console.error("Tabs section seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
