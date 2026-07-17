import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Section from "../modules/cms/section.model.js";
import { getSectionCatalogMeta } from "../modules/cms/section.catalog.js";

/**
 * Upserts page_testimonials — page-scoped variant of customer_testimonials.
 * Uses render_key so the same React carousel renders without a registry duplicate.
 *
 * Usage:
 *   npm run seed:page-testimonials
 */

async function seed() {
  await connectDB();

  const catalog = getSectionCatalogMeta("page_testimonials") || {};
  const globalSection = await Section.findOne({ key: "customer_testimonials" });

  const fields = {
    key: "page_testimonials",
    render_key: catalog.render_key || "customer_testimonials",
    name: "Page Testimonials",
    description:
      "Per-page customer quotes carousel — editable on each content page",
    section_title: "What teams say",
    sub_title: "",
    in_page_nav_title: "Stories",
    button_title: "",
    target_url: "",
    data: {},
    buttons: [],
    items: [],
    content_scope: "page",
    category: catalog.category || "social_proof",
    tags: catalog.tags || ["carousel", "reviews", "page"],
    section_preview_img: globalSection?.section_preview_img || "",
    status: true,
  };

  let section = await Section.findOne({ key: "page_testimonials" });
  if (!section) {
    section = new Section({ ...fields, pages: [] });
    console.log("  + created page_testimonials");
  } else {
    section.render_key = fields.render_key;
    section.name = fields.name;
    section.description = fields.description;
    section.section_title = fields.section_title;
    section.sub_title = fields.sub_title;
    section.in_page_nav_title = fields.in_page_nav_title;
    section.content_scope = "page";
    section.category = fields.category;
    section.tags = fields.tags;
    section.status = true;
    if (fields.section_preview_img && !section.section_preview_img) {
      section.section_preview_img = fields.section_preview_img;
    }
    console.log("  updated page_testimonials");
  }

  await section.save();
  console.log(
    `Seeded page_testimonials (page-scoped · render_key: ${section.render_key})`
  );
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
