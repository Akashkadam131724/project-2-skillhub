/**
 * Homepage cards linking to static project / showcase pages.
 *
 *   npm run seed:step -- home-project-links
 */
import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import Page from "../../../modules/cms/page.model.js";
import Section from "../../../modules/cms/section.model.js";
import { getSectionCatalogMeta } from "../../../modules/cms/section.catalog.js";
import { btn, item } from "../../lib/content-page-seed-helpers.js";
import { PROJECT_NAV_LINKS } from "../../lib/project-nav-links.js";
import { loadUploadsManifest, pickFolderImage } from "../../lib/upload-manifest.js";

const HOME_KEY = "home";
const SECTION_KEY = "feature_spotlight";
const SORT_ORDER = 5;

const CARD_THEMES = [
  { folderId: "business-tech", eyebrow: "Platform" },
  { folderId: "business-ai", eyebrow: "CMS" },
  { folderId: "business-cloud", eyebrow: "Catalog" },
  { folderId: "business-architecture-design", eyebrow: "Sections" },
  { folderId: "business-ai-pngs", eyebrow: "Components" },
  { folderId: "business-leadership", eyebrow: "Guides" },
  { folderId: "business-networking", eyebrow: "Showcase" },
  { folderId: "business-health", eyebrow: "Campus" },
  { folderId: "business-stock", eyebrow: "Demo" },
];

function buildItems() {
  const m = loadUploadsManifest();
  const links = PROJECT_NAV_LINKS.filter((l) => l.href !== "/");

  return links.map((link, i) => {
    const theme = CARD_THEMES[i % CARD_THEMES.length];
    const img = pickFolderImage(theme.folderId, m, i);
    return item(
      {
        value: theme.eyebrow,
        title: link.name,
        subtitle: link.href,
        body: `<p>Open <strong>${link.name}</strong> — part of the SkillHub demo and showcase.</p>`,
        image_url: img,
        href: link.href,
        buttons: [btn("Open page", { target_url: link.href, variant: "link" })],
      },
      i
    );
  });
}

async function seed() {
  await connectDB();
  console.log("Seeding homepage project / showcase links…");

  const page = await Page.findOne({ key: HOME_KEY });
  if (!page) {
    console.warn("Home page template missing — run seed:pages first");
    await mongoose.disconnect();
    return;
  }

  const meta = getSectionCatalogMeta(SECTION_KEY) || {};
  const items = buildItems();
  const fields = {
    key: SECTION_KEY,
    name: "Feature Spotlight",
    description: "Project and showcase destination cards",
    section_title: "Explore this project",
    sub_title:
      "Static demo pages for the CMS, catalog, sections library, components gallery, and visual guides.",
    in_page_nav_title: "Project",
    content_scope: "page",
    category: meta.category || "features",
    tags: meta.tags || ["spotlight", "project"],
    status: true,
    buttons: [
      btn("How it works", { target_url: "/how-it-works", sort_order: 0 }),
      btn("CMS preview", { variant: "secondary", target_url: "/cms-preview", sort_order: 1 }),
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

  const idx = (section.pages || []).findIndex(
    (p) => p.page_key === HOME_KEY && p.in_page_nav_title === "Project"
  );
  if (idx >= 0) {
    section.pages[idx] = {
      ...(section.pages[idx].toObject?.() ?? section.pages[idx]),
      ...tagPayload,
    };
  } else {
    section.pages.push(tagPayload);
  }

  await section.save();
  console.log(`  ✓ home#${SORT_ORDER} project links (${items.length} cards)`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
