import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Page from "../modules/cms/page.model.js";
import Section from "../modules/cms/section.model.js";

/**
 * Upserts Stats strip with enterprise metrics + cyan gradient bg,
 * tagged onto Home (and vendor detail).
 *
 * Usage:
 *   npm run seed:stats
 */

function item(fields, i = 0) {
  return {
    title: "",
    subtitle: "",
    body: "",
    label: "",
    value: "",
    image_url: "",
    icon: "",
    href: "",
    buttons: [],
    sort_order: i,
    status: true,
    ...fields,
  };
}

const STATS = [
  item({ value: "28+", label: "Years of Business Experience" }, 0),
  item({ value: "80%", label: "Of Fortune 1000 companies served" }, 1),
  item({ value: "40K+", label: "Companies served" }, 2),
  item({ value: "1300+", label: "Locations covered globally" }, 3),
  item({ value: "1 Million+", label: "Learners Trained" }, 4),
  item({ value: "96%", label: "Of Customers Recommended Us" }, 5),
  item({ value: "3300+", label: "Certified Instructors" }, 6),
  item({ value: "No. 1", label: "Microsoft Training Partner" }, 7),
];

const DEFAULT_BG =
  "linear-gradient(135deg, #67e8f9 0%, #5ec8e8 45%, #22d3ee 100%)";

const PAGE_TAGS = [
  { page_key: "home", sort_order: 18, status: true },
  { page_key: "vendor", sort_order: 3, status: true },
];

async function seed() {
  await connectDB();

  const fields = {
    key: "stats",
    name: "Stats Strip",
    description: "Metric grid on a colored / gradient band",
    section_title: "Why Leading Enterprises Choose SkillHub",
    sub_title: "",
    in_page_nav_title: "By the Numbers",
    button_title: "",
    target_url: "",
    data: { bg_color: DEFAULT_BG },
    buttons: [],
    items: STATS,
    content_scope: "page",
    status: true,
  };

  let section = await Section.findOne({ key: "stats" });
  if (!section) {
    section = new Section({ ...fields, pages: [] });
  } else {
    section.name = fields.name;
    section.description = fields.description;
    section.section_title = fields.section_title;
    section.sub_title = fields.sub_title;
    section.in_page_nav_title = fields.in_page_nav_title;
    section.data = { ...(section.data || {}), bg_color: DEFAULT_BG };
    section.buttons = [];
    section.items = fields.items;
    section.content_scope = fields.content_scope;
    section.status = true;
  }

  for (const tag of PAGE_TAGS) {
    const page = await Page.findOne({ key: tag.page_key });
    if (!page) {
      console.log(`  skip ${tag.page_key} (page missing)`);
      continue;
    }

    const tagPayload = {
      page: page._id,
      page_key: tag.page_key,
      sort_order: tag.sort_order,
      status: tag.status !== false,
      section_title: fields.section_title,
      sub_title: "",
      in_page_nav_title: fields.in_page_nav_title,
      buttons: [],
      items: fields.items,
      data: { bg_color: DEFAULT_BG },
    };

    const idx = section.pages.findIndex((p) => p.page_key === tag.page_key);
    if (idx >= 0) {
      const existing = section.pages[idx].toObject
        ? section.pages[idx].toObject()
        : section.pages[idx];
      section.pages[idx] = {
        ...existing,
        ...tagPayload,
        sort_order: existing.sort_order ?? tagPayload.sort_order,
        status: existing.status !== false,
      };
    } else {
      section.pages.push(tagPayload);
    }

    console.log(
      `  stats → ${tag.page_key}#${tag.sort_order} (${tag.status ? "on" : "off"})`
    );
  }

  await section.save();
  console.log(`Seeded stats · ${STATS.length} metrics · cyan gradient bg`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
