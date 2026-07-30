/**
 * Homepage spotlight linking to PNG visual insight guides.
 *
 *   npm run seed:step -- home-insights-spotlight
 */
import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import Page from "../../../modules/cms/page.model.js";
import Section from "../../../modules/cms/section.model.js";
import { getSectionCatalogMeta } from "../../../modules/cms/section.catalog.js";
import { btn, item } from "../../lib/content-page-seed-helpers.js";
import { INSIGHT_CHILD_PAGES } from "../../lib/png-insights-content-pages.js";
import { loadUploadsManifest, PNG_FOLDER_IDS, findPngByPattern } from "../../lib/upload-manifest.js";

const HOME_KEY = "home";
const SECTION_KEY = "feature_spotlight";
const SORT_ORDER = 22;

function buildHomeInsightsItems() {
  const m = loadUploadsManifest();
  const featured = INSIGHT_CHILD_PAGES.slice(0, 8);

  return featured.map((child, i) => {
    const img = findPngByPattern(PNG_FOLDER_IDS, m, child.pngPattern);
    return item(
      {
        value: child.eyebrow,
        title: child.name,
        subtitle: child.description,
        body: `<p>${child.description}</p>`,
        image_url: img,
        href: child.path,
        buttons: [btn("Read guide", { target_url: child.path, variant: "link" })],
      },
      i
    );
  });
}

async function seed() {
  await connectDB();
  console.log("Seeding home insights spotlight…");

  const page = await Page.findOne({ key: HOME_KEY });
  if (!page) {
    console.warn("Home page template missing — run seed:pages first");
    await mongoose.disconnect();
    return;
  }

  const meta = getSectionCatalogMeta(SECTION_KEY) || {};
  const items = buildHomeInsightsItems();
  const fields = {
    key: SECTION_KEY,
    name: "Feature Spotlight",
    description: "Asymmetric spotlight cards",
    section_title: "Visual learning guides",
    sub_title:
      "Long-form insight pages illustrated with transparent PNG artwork — AI, analytics, service, and modern work.",
    in_page_nav_title: "Insights",
    content_scope: "page",
    category: meta.category || "features",
    tags: meta.tags || ["spotlight", "insights"],
    status: true,
    buttons: [
      btn("All visual guides", { target_url: "/insights", sort_order: 0 }),
      btn("Get started", { variant: "secondary", target_url: "/get-started", sort_order: 1 }),
    ],
    data: {},
    items,
  };

  let section = await Section.findOne({ key: SECTION_KEY });
  if (!section) {
    section = new Section({ ...fields, pages: [] });
  } else {
    Object.assign(section, fields);
  }

  const tagPayload = {
    page: page._id,
    page_key: HOME_KEY,
    sort_order: SORT_ORDER,
    status: true,
    section_title: fields.section_title,
    sub_title: fields.sub_title,
    in_page_nav_title: fields.in_page_nav_title,
    buttons: fields.buttons,
    items: fields.items,
    data: fields.data,
  };

  const idx = (section.pages || []).findIndex((p) => p.page_key === HOME_KEY && p.sort_order === SORT_ORDER);
  if (idx >= 0) {
    section.pages[idx] = { ...section.pages[idx].toObject?.() ?? section.pages[idx], ...tagPayload };
  } else {
    const conflict = section.pages.findIndex(
      (p) => p.page_key === HOME_KEY && p.in_page_nav_title === "Insights"
    );
    if (conflict >= 0) {
      section.pages[conflict] = { ...section.pages[conflict].toObject?.() ?? section.pages[conflict], ...tagPayload };
    } else {
      section.pages.push(tagPayload);
    }
  }

  await section.save();
  console.log(`  ✓ home#${SORT_ORDER} insights spotlight (${items.length} cards → /insights)`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
