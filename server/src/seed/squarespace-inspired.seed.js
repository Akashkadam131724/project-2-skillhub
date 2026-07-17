/**
 * Squarespace-inspired website builder landing page.
 * Original section keys, original copy, no Squarespace assets.
 *
 * Page:
 *   /site-builder
 *
 * Usage:
 *   npm run seed:squarespace-inspired
 */
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Content from "../modules/content/content.model.js";
import Page from "../modules/cms/page.model.js";
import Section from "../modules/cms/section.model.js";
import EntityPageSection from "../modules/cms/entity-page-section.model.js";
import { getSectionCatalogMeta } from "../modules/cms/section.catalog.js";

function btn(label, opts = {}) {
  return {
    label,
    variant: opts.variant || "primary",
    action_type: opts.action_type || "url",
    target_url: opts.target_url || "",
    target_id: opts.target_id || "",
    form_key: opts.form_key || "",
    open_in_new_tab: Boolean(opts.open_in_new_tab),
    sort_order: opts.sort_order ?? 0,
    status: opts.status !== false,
  };
}

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

const SECTIONS = [
  ["site_builder_hero", "Site Builder Hero", "Editorial black/white website-builder hero"],
  ["template_gallery", "Template Gallery", "Oversized website template gallery"],
  ["builder_feature_cards", "Builder Feature Cards", "Monochrome builder capability cards"],
  ["domain_search_band", "Domain Search Band", "Domain search mock band with TLD chips"],
  ["website_build_steps", "Website Build Steps", "Numbered guide for building a website"],
];

async function ensureSection([key, name, description]) {
  const catalog = getSectionCatalogMeta(key);
  let section = await Section.findOne({ key });
  if (!section) {
    section = await Section.create({
      key,
      name,
      description,
      section_title: "",
      sub_title: "",
      in_page_nav_title: "",
      content_scope: "page",
      status: true,
      buttons: [],
      items: [],
      data: {},
      category: catalog?.category || "",
      tags: catalog?.tags || [],
      pages: [],
    });
    console.log(`  + created section ${key}`);
  } else {
    section.name = name;
    section.description = description;
    section.content_scope = "page";
    section.status = true;
    if (catalog) {
      section.category = catalog.category;
      section.tags = catalog.tags;
    }
    await section.save();
  }
  return section;
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

async function ensureContent(doc) {
  return Content.findOneAndUpdate(
    { path: doc.path },
    { $set: doc },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
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
      console.warn(`  ! missing section ${p.section_key}`);
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

const PAGE = [
  {
    section_key: "site_builder_hero",
    sort_order: 0,
    section_title: "A site makes the idea real",
    sub_title:
      "Start with a designer-quality website, then add selling, scheduling, domains, and marketing tools as your business grows.",
    section_img_url:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
    data: {
      label: "Website builder",
      body: "<p>Inspired by the editorial confidence of Squarespace, built as an original SkillHub CMS page.</p>",
    },
    buttons: [
      btn("Start free trial", { target_url: "/get-started", sort_order: 0 }),
      btn("Browse templates", {
        variant: "secondary",
        target_url: "#templates",
        sort_order: 1,
      }),
    ],
  },
  {
    section_key: "builder_feature_cards",
    sort_order: 1,
    section_title: "Everything your site needs to grow",
    sub_title:
      "A single platform for publishing, selling, appointments, campaigns, and performance insights.",
    items: [
      item({ value: "01", title: "Sell online", subtitle: "Storefront + checkout", body: "<p>Launch products, services, digital downloads, subscriptions, and secure checkout flows.</p>" }, 0),
      item({ value: "02", title: "Book services", subtitle: "Scheduling built in", body: "<p>Let clients reserve sessions, classes, and consultations directly from your website.</p>" }, 1),
      item({ value: "03", title: "Market everywhere", subtitle: "Email + SEO", body: "<p>Create campaigns, improve discoverability, and connect social channels from one place.</p>" }, 2),
      item({ value: "04", title: "Measure growth", subtitle: "Analytics that matter", body: "<p>Track traffic, sales, and content performance so you know what to improve next.</p>" }, 3),
    ],
  },
  {
    section_key: "template_gallery",
    sort_order: 2,
    section_title: "Start with a template designed for your business",
    sub_title:
      "Editorial layouts for creators, stores, service businesses, educators, and events.",
    items: [
      item({ value: "Portfolio", title: "Northline Studio", subtitle: "A bold portfolio for photographers and artists.", image_url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80" }, 0),
      item({ value: "Store", title: "Field Goods", subtitle: "A clean shopfront for modern products.", image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80" }, 1),
      item({ value: "Services", title: "Practice House", subtitle: "A polished services site with booking paths.", image_url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80" }, 2),
      item({ value: "Events", title: "Gather Hall", subtitle: "A visual event landing page with ticket-ready sections.", image_url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80" }, 3),
      item({ value: "Education", title: "Open Class", subtitle: "A site for classes, coaching, and content memberships.", image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80" }, 4),
    ],
  },
  {
    section_key: "domain_search_band",
    sort_order: 3,
    section_title: "Find the perfect domain for your site",
    sub_title:
      "Search, claim, and connect a professional domain from the same place you build your website.",
    data: { domain: "yourbrand.studio" },
    items: [
      item({ value: ".com from $10" }, 0),
      item({ value: ".studio" }, 1),
      item({ value: ".shop" }, 2),
      item({ value: "SSL included" }, 3),
      item({ value: "WHOIS privacy" }, 4),
    ],
    buttons: [btn("Search domains", { target_url: "/get-started", sort_order: 0 })],
  },
  {
    section_key: "website_build_steps",
    sort_order: 4,
    section_title: "How to build your website",
    sub_title:
      "A guided path from blank idea to live business presence.",
    items: [
      item({ title: "Choose your starting point", subtitle: "Template or guided builder", body: "<p>Pick a professionally designed layout or answer a few questions to generate a first draft.</p>" }, 0),
      item({ title: "Customize the design", subtitle: "Fonts, colors, images", body: "<p>Make the site feel like your brand with simple layout, type, and visual controls.</p>" }, 1),
      item({ title: "Add pages and tools", subtitle: "Store, scheduling, blog", body: "<p>Build a portfolio, publish content, sell products, accept bookings, or collect donations.</p>" }, 2),
      item({ title: "Connect your domain", subtitle: "Make it official", body: "<p>Claim a domain, add SEO metadata, and launch with secure hosting.</p>" }, 3),
      item({ title: "Grow with marketing", subtitle: "Email + analytics", body: "<p>Promote your site, learn what works, and keep improving after launch.</p>" }, 4),
    ],
  },
  {
    section_key: "site_builder_hero",
    sort_order: 5,
    section_title: "Start your website today",
    sub_title:
      "Turn your project, service, store, or portfolio into a polished online presence.",
    section_img_url:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1600&q=80",
    data: { label: "Ready to launch" },
    buttons: [
      btn("Get started", { target_url: "/get-started", sort_order: 0 }),
      btn("See templates", { variant: "secondary", target_url: "#templates", sort_order: 1 }),
    ],
  },
];

async function seed() {
  await connectDB();
  await ensureContentPage();

  const page = await ensureContent({
    name: "Site Builder",
    slug: "site-builder",
    path: "/site-builder",
    description: "Squarespace-inspired website builder landing page built with original CMS sections.",
    status: "active",
    sortOrder: 240,
  });

  const sectionByKey = new Map();
  for (const def of SECTIONS) {
    const section = await ensureSection(def);
    sectionByKey.set(section.key, section);
  }

  console.log(`Mapping Site Builder (${page._id})...`);
  await replaceExtras("content", page._id, PAGE, sectionByKey);
  console.log(`  ${PAGE.length} placements`);

  console.log("\nDone.");
  console.log("  http://localhost:3001/site-builder");
  console.log("  CMS: append ?cms=1");

  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("squarespace-inspired seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
