import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Page from "../modules/cms/page.model.js";
import Section from "../modules/cms/section.model.js";

/**
 * Upserts global In-Page Navigation section and tags it onto pages
 * that use dynamic CMS body sections.
 *
 * Links are not stored on this section — they come from each placement's
 * in_page_nav_title on sections *below* this block.
 *
 * Usage:
 *   npm run seed:in-page-nav
 */

const PAGE_TAGS = [
  { page_key: "home", sort_order: 10, status: true },
  { page_key: "product", sort_order: 0, status: true },
  { page_key: "course", sort_order: 0, status: true },
  { page_key: "vendor", sort_order: 0, status: true },
  { page_key: "industry", sort_order: 0, status: true },
  { page_key: "skilling_area", sort_order: 0, status: true },
];

async function seed() {
  await connectDB();

  const fields = {
    key: "in_page_nav",
    name: "In-Page Navigation",
    description:
      "Sticky on-page nav. Links come from sections below this placement (in_page_nav_title).",
    section_title: "",
    sub_title: "",
    in_page_nav_title: "",
    button_title: "",
    target_url: "",
    data: {},
    buttons: [],
    items: [],
    content_scope: "global",
    status: true,
  };

  let section = await Section.findOne({ key: "in_page_nav" });
  if (!section) {
    section = new Section({ ...fields, pages: [] });
  } else {
    section.name = fields.name;
    section.description = fields.description;
    section.section_title = fields.section_title;
    section.sub_title = fields.sub_title;
    section.in_page_nav_title = fields.in_page_nav_title;
    section.data = {};
    section.buttons = [];
    section.items = [];
    section.content_scope = "global";
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
      section_title: "",
      sub_title: "",
      in_page_nav_title: "",
      buttons: [],
      items: [],
      data: {},
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
      `  in_page_nav → ${tag.page_key}#${tag.sort_order} (${tag.status ? "on" : "off"})`
    );
  }

  await section.save();
  console.log("Seeded in_page_nav (global)");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
