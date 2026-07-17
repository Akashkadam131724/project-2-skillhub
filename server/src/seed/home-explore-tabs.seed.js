/**
 * Adds a meaningful Feature Tabs section on the homepage,
 * seeded from live catalog counts (vendors, products, courses, blogs).
 *
 * Usage:
 *   npm run seed:home-explore-tabs
 */
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Page from "../modules/cms/page.model.js";
import Section from "../modules/cms/section.model.js";
import Vendor from "../modules/vendor/vendor.model.js";
import Product from "../modules/product/product.model.js";
import Course from "../modules/course/course.model.js";
import Blog from "../modules/blog/blog.model.js";
import { getSectionCatalogMeta } from "../modules/cms/section.catalog.js";
import { buildHomeExploreTabsContent } from "./lib/cms-seed-shared.js";

async function catalogCounts() {
  const [vendors, products, courses, blogs] = await Promise.all([
    Vendor.countDocuments({ status: "active" }),
    Product.countDocuments({ status: "active" }),
    Course.countDocuments({}),
    Blog.countDocuments({ status: "active" }),
  ]);
  return { vendors, products, courses, blogs };
}

async function upsertFeatureTabs(page, content, sortOrder) {
  const meta = getSectionCatalogMeta("feature_tabs") || {};
  const fields = {
    key: "feature_tabs",
    name: "Feature Tabs",
    description:
      "Tabbed catalog paths with preview panel (vendors → products → courses → blogs)",
    section_title: content.section_title,
    sub_title: content.sub_title,
    in_page_nav_title: content.in_page_nav_title,
    content_scope: "page",
    category: meta.category || "features",
    tags: meta.tags || ["tabs", "preview"],
    status: true,
    buttons: content.buttons || [],
    data: {},
    items: content.items || [],
  };

  let section = await Section.findOne({ key: "feature_tabs" });
  if (!section) {
    section = new Section({ ...fields, pages: [] });
  } else {
    section.name = fields.name;
    section.description = fields.description;
    section.section_title = fields.section_title;
    section.sub_title = fields.sub_title;
    section.in_page_nav_title = fields.in_page_nav_title;
    section.content_scope = "page";
    section.category = fields.category;
    section.tags = fields.tags;
    section.status = true;
    section.buttons = fields.buttons;
    section.items = fields.items;
    section.data = fields.data;
  }

  const tagPayload = {
    page: page._id,
    page_key: "home",
    sort_order: sortOrder,
    status: true,
    section_title: fields.section_title,
    sub_title: fields.sub_title,
    in_page_nav_title: fields.in_page_nav_title,
    buttons: fields.buttons,
    items: fields.items,
    data: fields.data,
  };

  const idx = section.pages.findIndex((p) => p.page_key === "home");
  if (idx >= 0) {
    const existing = section.pages[idx].toObject
      ? section.pages[idx].toObject()
      : section.pages[idx];
    section.pages[idx] = { ...existing, ...tagPayload };
  } else {
    section.pages.push(tagPayload);
  }

  await section.save();
  return section;
}

async function seed() {
  await connectDB();

  console.log("Seeding homepage Explore tabs from catalog counts…");

  const page = await Page.findOneAndUpdate(
    { key: "home" },
    {
      $setOnInsert: {
        key: "home",
        name: "Home",
        description: "Marketing home page (Content entity)",
        entity_type: "content",
        status: true,
      },
    },
    { upsert: true, new: true }
  );

  const counts = await catalogCounts();
  console.log(
    `  catalog: ${counts.vendors} vendors · ${counts.products} products · ${counts.courses} courses · ${counts.blogs} blogs`
  );

  const content = buildHomeExploreTabsContent(counts);
  const sortOrder = Number(process.env.HOME_EXPLORE_SORT || 4);
  await upsertFeatureTabs(page, content, sortOrder);

  console.log(
    `  ✓ feature_tabs → home#${sortOrder} · ${content.items.filter((i) => i.item_type === "tab").length} tabs · ${content.items.length} rows`
  );
  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch(async (err) => {
  console.error("Home explore tabs seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
