import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Page from "../modules/cms/page.model.js";
import Section from "../modules/cms/section.model.js";
import EntityPageSection from "../modules/cms/entity-page-section.model.js";
import { getSectionCatalogMeta } from "../modules/cms/section.catalog.js";

/**
 * Seeds page templates + body sections (NO banner/hero).
 *
 * Banner rule:
 *   Hero comes from the page/entity document (Product.name, Vendor.overview,
 *   Course title, etc.) via DetailShell / PageBanner — not from CMS Sections.
 *   CMS only owns body blocks below the hero.
 *
 * Usage:
 *   npm run seed:pages
 */

const PAGES = [
  {
    key: "home",
    name: "Home",
    description: "Marketing home page (Content entity)",
    entity_type: "content",
    status: true,
  },
  {
    key: "product",
    name: "Product Detail",
    description: "Single product page",
    entity_type: "product",
    status: true,
    is_sort_disabled: true,
  },
  {
    key: "course",
    name: "Course Detail",
    description: "Single course page",
    entity_type: "course",
    status: true,
    is_sort_disabled: true,
  },
  {
    key: "vendor",
    name: "Vendor Detail",
    description: "Single vendor page",
    entity_type: "vendor",
    status: true,
    is_sort_disabled: true,
  },
  {
    key: "industry",
    name: "Industry Detail",
    description: "Single industry page",
    entity_type: "industry",
    status: true,
    is_sort_disabled: true,
  },
  {
    key: "skilling_area",
    name: "Skilling Area Detail",
    description: "Single skilling area page",
    entity_type: "skilling_area",
    status: true,
    is_sort_disabled: true,
  },
  {
    key: "blog",
    name: "Blog Detail",
    description: "Single editorial article page",
    entity_type: "blog",
    status: true,
    is_sort_disabled: true,
  },
];

/** Body sections only — never store hero/banner here */
const SECTIONS = [
  {
    key: "overview",
    name: "Overview",
    description: "Rich overview / about block under the hero",
    section_title: "Overview",
    in_page_nav_title: "Overview",
    sub_title: "What you need to know at a glance.",
    button_title: "",
    target_url: "",
    data: { body: "" },
    status: true,
  },
  {
    key: "text_media",
    name: "Text + Media",
    description: "Two-column text + image rows (media start or end)",
    section_title: "",
    in_page_nav_title: "Learning Paths",
    sub_title: "",
    button_title: "",
    target_url: "",
    data: {},
    content_scope: "page",
    status: true,
  },
  {
    key: "key_benefits",
    name: "Key Benefits",
    description: "Bullet / card list of benefits",
    section_title: "Key Benefits",
    in_page_nav_title: "Key Benefits",
    sub_title: "Why teams choose this path.",
    button_title: "",
    target_url: "",
    data: {},
    status: true,
  },
  {
    key: "why_choose",
    name: "Why Choose",
    description: "Navy band with icon feature cards (Why Choose SkillHub)",
    section_title: "Why Choose SkillHub?",
    in_page_nav_title: "Why Choose",
    sub_title: "",
    button_title: "",
    target_url: "",
    data: {},
    status: true,
  },
  {
    key: "stats",
    name: "Stats Strip",
    description: "Metric row (learners, courses, partners…)",
    section_title: "Why Leading Enterprises Choose SkillHub",
    in_page_nav_title: "By the Numbers",
    sub_title: "",
    button_title: "",
    target_url: "",
    data: {},
    status: true,
  },
  {
    key: "related_courses",
    name: "Related Courses",
    description: "Course grid / carousel block",
    section_title: "Related Courses",
    in_page_nav_title: "Related Courses",
    sub_title: "Continue learning with these programs.",
    button_title: "View catalog",
    target_url: "/courses",
    data: {},
    status: true,
  },
  {
    key: "curriculum",
    name: "Curriculum",
    description: "Outline / modules / learning path",
    section_title: "Curriculum",
    in_page_nav_title: "Curriculum",
    sub_title: "What you will cover.",
    button_title: "",
    target_url: "",
    data: {},
    status: true,
  },
  {
    key: "partners",
    name: "Partners",
    description: "Logo strip (legacy key — prefer partners_marquee)",
    section_title:
      "Trusted Training Partner for Organizations Across the Globe",
    in_page_nav_title: "Trusted Partners",
    sub_title: "",
    button_title: "",
    target_url: "",
    data: {},
    content_scope: "global",
    status: true,
  },
  {
    key: "partners_marquee",
    name: "Partners — Logo Marquee",
    description: "Centered title + infinite partner logo strip (global)",
    section_title:
      "Trusted Training Partner for Organizations Across the Globe",
    in_page_nav_title: "Trusted Partners",
    sub_title: "",
    button_title: "",
    target_url: "",
    data: {},
    content_scope: "global",
    status: true,
  },
  {
    key: "training_options",
    name: "Training Options",
    description: "Flexible training modality cards (image + title + body)",
    section_title: "Flexible Training Options to Fit Every Learning Style",
    in_page_nav_title: "Training Options",
    sub_title: "",
    button_title: "",
    target_url: "",
    data: {},
    content_scope: "page",
    status: true,
  },
  {
    key: "awards",
    name: "Awards & Recognition",
    description: "Award badge cards with optional CTA",
    section_title: "Globally Recognized for Excellence in Learning & Innovation",
    in_page_nav_title: "Awards",
    sub_title: "",
    button_title: "View All Awards",
    target_url: "/awards",
    data: {},
    content_scope: "page",
    status: true,
  },
  {
    key: "in_page_nav",
    name: "In-Page Navigation",
    description:
      "Sticky on-page nav. Links come from sections below this placement.",
    section_title: "",
    in_page_nav_title: "",
    sub_title: "",
    button_title: "",
    target_url: "",
    data: {},
    content_scope: "global",
    status: true,
  },
  {
    key: "testimonials",
    name: "Testimonials",
    description: "Learner / customer quotes",
    section_title: "What Learners Say",
    in_page_nav_title: "What Learners Say",
    sub_title: "Real outcomes from enterprise teams.",
    button_title: "View success stories",
    target_url: "/success-stories",
    data: {},
    status: true,
  },
  {
    key: "customer_testimonials",
    name: "Customer Testimonials",
    description: "Carousel with star rating, quote, author, and company logo",
    section_title: "Customer Testimonials",
    in_page_nav_title: "Testimonials",
    sub_title: "",
    button_title: "",
    target_url: "",
    data: {},
    content_scope: "global",
    status: true,
  },
  {
    key: "faq",
    name: "FAQ",
    description: "Frequently asked questions",
    section_title: "Frequently Asked Questions",
    in_page_nav_title: "Frequently Asked Questions",
    sub_title: "Answers to common questions.",
    button_title: "",
    target_url: "",
    data: {},
    status: true,
  },
  {
    key: "resources",
    name: "Resources",
    description: "Downloads, guides, related links",
    section_title: "Resources",
    in_page_nav_title: "Resources",
    sub_title: "Guides and materials to go further.",
    button_title: "",
    target_url: "",
    data: {},
    status: true,
  },
  {
    key: "products",
    name: "Products Grid",
    description: "Product cards grid (data from the entity page)",
    section_title: "Products",
    in_page_nav_title: "Products",
    sub_title: "Explore products in this catalog.",
    button_title: "",
    target_url: "",
    data: {},
    status: true,
  },
  {
    key: "catalog",
    name: "Course Catalog",
    description: "Filterable course catalog block",
    section_title: "",
    sub_title: "",
    button_title: "",
    target_url: "",
    data: {},
    status: true,
  },
  {
    key: "entity_directory",
    name: "Entity Directory",
    description:
      "Searchable directory of vendors, products, industries, or skilling areas",
    section_title: "",
    sub_title: "",
    button_title: "",
    target_url: "",
    data: { directory_type: "vendor" },
    content_scope: "page",
    status: true,
  },
  {
    key: "latest_blogs",
    name: "Latest Blogs",
    description: "Dynamic grid of the latest published editorial articles",
    section_title: "Ideas worth sharing",
    sub_title:
      "Fresh thinking on workforce learning, technology, and organizational capability.",
    button_title: "",
    target_url: "/blogs",
    data: { limit: 3 },
    content_scope: "global",
    status: true,
  },
  {
    key: "blog_directory",
    name: "Blog Directory",
    description: "Searchable journal listing with featured story and pagination",
    section_title: "Fresh from the journal",
    sub_title:
      "Research, playbooks, and perspectives on learning, technology, and organizational capability.",
    button_title: "",
    target_url: "",
    data: { limit: 10 },
    content_scope: "page",
    status: true,
  },
  {
    key: "hero_classic",
    name: "Hero — Classic",
    description: "Navy gradient hero with atmosphere",
    section_title: "Enterprise-Grade Industry Solutions for Workforce Transformation",
    sub_title:
      "SkillHub delivers strategic, industry-aligned technology solutions that help enterprise leaders close capability gaps.",
    in_page_nav_title: "",
    data: {},
    content_scope: "page",
    status: true,
  },
  {
    key: "hero_split",
    name: "Hero — Split",
    description: "Copy left, image right",
    section_title: "Train teams that ship",
    sub_title: "Split layout hero with optional media.",
    in_page_nav_title: "",
    data: {},
    content_scope: "page",
    status: true,
  },
  {
    key: "hero_centered",
    name: "Hero — Centered",
    description: "Centered editorial hero",
    section_title: "Skill with confidence",
    sub_title: "Centered marketing hero for campaigns.",
    in_page_nav_title: "",
    data: {},
    content_scope: "page",
    status: true,
  },
  {
    key: "hero_minimal",
    name: "Hero — Minimal",
    description: "Light compact hero",
    section_title: "Workforce transformation",
    sub_title: "Minimal hero with accent rule.",
    in_page_nav_title: "",
    data: {},
    content_scope: "page",
    status: true,
  },
  {
    key: "hero_media",
    name: "Hero — Media Slider",
    description: "Full-bleed banner slider (items = slides)",
    section_title: "",
    sub_title: "",
    in_page_nav_title: "",
    data: {},
    content_scope: "page",
    status: true,
  },
  {
    key: "hero_stats",
    name: "Hero — Stats",
    description: "Hero with proof stats",
    section_title: "Trusted by enterprise teams",
    sub_title: "Outcomes you can measure.",
    in_page_nav_title: "",
    data: {},
    content_scope: "page",
    status: true,
  },
  {
    key: "hero_asymmetric",
    name: "Hero — Asymmetric",
    description: "Oversized title with side CTA rail",
    section_title: "Build skills that stick",
    sub_title: "Asymmetric layout with CTA rail.",
    in_page_nav_title: "",
    data: {},
    content_scope: "page",
    status: true,
  },
  {
    key: "hero_dual_cta",
    name: "Hero — Dual CTA",
    description: "Soft wash hero with dual CTAs",
    section_title: "Two paths. One outcome.",
    sub_title: "Dual CTA hero for catalog + vendors.",
    in_page_nav_title: "",
    data: {},
    content_scope: "page",
    status: true,
  },
];

/**
 * Default placements (no banner). Sort starts at 1 for first body section.
 * Homepage heroes are mapped here — only hero_classic enabled by default.
 */
const SECTION_PAGE_TAGS = {
  overview: [
    { page_key: "product", sort_order: 1, status: true },
    { page_key: "course", sort_order: 1, status: true },
    { page_key: "vendor", sort_order: 1, status: true },
    { page_key: "industry", sort_order: 1, status: true },
    { page_key: "skilling_area", sort_order: 1, status: true },
  ],
  text_media: [
    { page_key: "home", sort_order: 12, status: true },
  ],
  key_benefits: [
    { page_key: "product", sort_order: 2, status: true },
    { page_key: "course", sort_order: 2, status: true },
    { page_key: "vendor", sort_order: 2, status: true },
  ],
  why_choose: [
    { page_key: "home", sort_order: 16, status: true },
  ],
  stats: [
    { page_key: "home", sort_order: 18, status: true },
    { page_key: "vendor", sort_order: 3, status: true },
  ],
  related_courses: [
    { page_key: "product", sort_order: 3, status: true },
    { page_key: "vendor", sort_order: 4, status: true },
    { page_key: "industry", sort_order: 2, status: true },
    { page_key: "skilling_area", sort_order: 2, status: true },
    { page_key: "course", sort_order: 4, status: true },
  ],
  curriculum: [
    { page_key: "course", sort_order: 3, status: true },
    { page_key: "product", sort_order: 4, status: true },
  ],
  partners: [],
  partners_marquee: [
    { page_key: "home", sort_order: 20, status: true },
  ],
  training_options: [
    { page_key: "home", sort_order: 22, status: true },
  ],
  awards: [
    { page_key: "home", sort_order: 24, status: true },
  ],
  in_page_nav: [
    { page_key: "home", sort_order: 10, status: true },
    { page_key: "product", sort_order: 0, status: true },
    { page_key: "course", sort_order: 0, status: true },
    { page_key: "vendor", sort_order: 0, status: true },
    { page_key: "industry", sort_order: 0, status: true },
    { page_key: "skilling_area", sort_order: 0, status: true },
  ],
  testimonials: [
    { page_key: "product", sort_order: 5, status: true },
    { page_key: "vendor", sort_order: 5, status: true },
  ],
  customer_testimonials: [
    { page_key: "home", sort_order: 26, status: true },
  ],
  faq: [
    { page_key: "product", sort_order: 6, status: true },
    { page_key: "course", sort_order: 5, status: true },
    { page_key: "vendor", sort_order: 6, status: true },
    { page_key: "industry", sort_order: 3, status: true },
    { page_key: "skilling_area", sort_order: 3, status: true },
  ],
  resources: [
    { page_key: "course", sort_order: 6, status: true },
    { page_key: "product", sort_order: 7, status: true },
  ],
  /** Products grid — vendor + product detail */
  products: [
    { page_key: "vendor", sort_order: 8, status: true },
    { page_key: "product", sort_order: 9, status: true },
  ],
  /** Course catalog — vendor / product / industry / skilling */
  catalog: [
    { page_key: "vendor", sort_order: 9, status: true },
    { page_key: "product", sort_order: 10, status: true },
    { page_key: "industry", sort_order: 5, status: true },
    { page_key: "skilling_area", sort_order: 5, status: true },
  ],
  latest_blogs: [{ page_key: "home", sort_order: 14, status: true }],
  hero_classic: [{ page_key: "home", sort_order: 1, status: true }],
  hero_split: [{ page_key: "home", sort_order: 2, status: false }],
  hero_centered: [{ page_key: "home", sort_order: 3, status: false }],
  hero_minimal: [{ page_key: "home", sort_order: 4, status: false }],
  hero_media: [{ page_key: "home", sort_order: 5, status: false }],
  hero_stats: [{ page_key: "home", sort_order: 6, status: false }],
  hero_asymmetric: [{ page_key: "home", sort_order: 7, status: false }],
  hero_dual_cta: [{ page_key: "home", sort_order: 8, status: false }],
};

async function seed() {
  await connectDB();

  console.log("Clearing pages / sections / entity overrides...");
  await Promise.all([
    EntityPageSection.deleteMany({}),
    Section.deleteMany({}),
    Page.deleteMany({}),
  ]);

  try {
    await mongoose.connection.db.collection("pagesections").drop();
    console.log("Dropped legacy pagesections collection");
  } catch {
    // ignore if missing
  }

  const pages = await Page.insertMany(PAGES);
  const pageByKey = Object.fromEntries(pages.map((p) => [p.key, p]));

  const sectionDocs = SECTIONS.map((s) => {
    const pageTags = SECTION_PAGE_TAGS[s.key] || [];
    const catalog = getSectionCatalogMeta(s.key);
    return {
      ...s,
      category: catalog?.category || s.category || "",
      tags: catalog?.tags || s.tags || [],
      pages: pageTags.map((t) => {
        const page = pageByKey[t.page_key];
        if (!page) {
          throw new Error(`Unknown page_key in tags: ${t.page_key}`);
        }
        return {
          page: page._id,
          page_key: page.key,
          sort_order: t.sort_order,
          section_title: t.section_title ?? null,
          sub_title: t.sub_title ?? null,
          in_page_nav_title: t.in_page_nav_title ?? null,
          section_bg_img: t.section_bg_img ?? null,
          section_img_url: t.section_img_url ?? null,
          section_preview_img: s.section_preview_img || null,
          data: t.data ?? null,
          status: t.status !== false,
        };
      }),
    };
  });

  const sections = await Section.insertMany(sectionDocs);

  console.log(`Seeded ${pages.length} pages`);
  console.log(`Seeded ${sections.length} body sections (no banner)`);

  for (const section of sections) {
    const keys = section.pages.map((p) => `${p.page_key}#${p.sort_order}`);
    console.log(`  ${section.key} → [${keys.join(", ") || "untagged"}]`);
  }

  await mongoose.disconnect();
  console.log("Done. Disconnected.");
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
