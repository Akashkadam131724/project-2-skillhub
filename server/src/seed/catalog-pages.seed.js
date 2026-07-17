/**
 * Seeds CMS Content listing pages served by app/[...slug]:
 *   /courses          → hero + course catalog + shared globals
 *   /vendors          → hero + entity directory + course catalog + shared globals
 *   /products         → hero + entity directory + course catalog + shared globals
 *   /industries       → hero + entity directory + course catalog + shared globals
 *   /skilling-areas   → hero + entity directory + course catalog + shared globals
 *
 * Shared “global strip” on every catalog page (after the core catalog blocks):
 *   partners_marquee, stats, customer_testimonials, cta_band
 * Plus sticky in_page_nav at the top.
 *
 * Global-scoped sections reuse Section catalog content (logos, quotes…).
 *
 * Usage:
 *   npm run seed:catalog-pages
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

const MANAGED_SECTIONS = [
  {
    key: "catalog",
    name: "Course Catalog",
    description: "Filterable course catalog block",
    section_title: "",
    sub_title: "",
    content_scope: "page",
    status: true,
    buttons: [],
    items: [],
    data: {},
  },
  {
    key: "entity_directory",
    name: "Entity Directory",
    description:
      "Searchable directory of vendors, products, industries, or skilling areas",
    section_title: "",
    sub_title: "",
    content_scope: "page",
    status: true,
    buttons: [],
    items: [],
    data: { directory_type: "vendor" },
  },
  {
    key: "cta_band",
    name: "CTA Band",
    description: "Full-bleed ink CTA band with strong call to action",
    section_title: "Ready to build capability that ships?",
    sub_title:
      "Talk with our team about a pilot, a catalog path, or an enterprise learning roadmap.",
    in_page_nav_title: "Get started",
    content_scope: "page",
    status: true,
    buttons: [
      btn("Talk to us", { target_url: "/get-started", sort_order: 0 }),
      btn("Browse courses", {
        variant: "secondary",
        target_url: "/courses",
        sort_order: 1,
      }),
    ],
    items: [],
    data: {},
  },
];

/** Sections we place but do not overwrite (already seeded elsewhere). */
const REQUIRED_EXISTING_KEYS = [
  "hero_classic",
  "in_page_nav",
  "partners_marquee",
  "stats",
  "customer_testimonials",
  "cta_band",
];

async function ensureSection(def) {
  const catalog = getSectionCatalogMeta(def.key);
  let section = await Section.findOne({ key: def.key });
  if (!section) {
    section = await Section.create({
      ...def,
      category: catalog?.category || "",
      tags: catalog?.tags || [],
      pages: [],
    });
    console.log(`  + created section ${def.key}`);
  } else {
    section.name = def.name;
    section.description = def.description;
    section.content_scope = def.content_scope;
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
        description:
          "Free-form content pages (about-us, catalogs, …). No predefined sections.",
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

/**
 * Shared strip on every catalog listing page.
 * Global sections (partners, testimonials) pull content from Section docs.
 */
function catalogGlobalPlacements(startOrder = 10) {
  return [
    {
      section_key: "partners_marquee",
      sort_order: startOrder,
      // null titles → inherit global Section content
      section_title: null,
      sub_title: null,
      in_page_nav_title: "Partners",
    },
    {
      section_key: "stats",
      sort_order: startOrder + 1,
      section_title: null,
      sub_title: null,
      in_page_nav_title: "By the numbers",
    },
    {
      section_key: "customer_testimonials",
      sort_order: startOrder + 2,
      section_title: null,
      sub_title: null,
      in_page_nav_title: "Testimonials",
    },
    {
      section_key: "cta_band",
      sort_order: startOrder + 3,
      section_title: "Ready to build capability that ships?",
      sub_title:
        "Talk with our team about a pilot, a catalog path, or an enterprise learning roadmap.",
      in_page_nav_title: "Get started",
      buttons: [
        btn("Talk to us", { target_url: "/get-started", sort_order: 0 }),
        btn("Browse courses", {
          variant: "secondary",
          target_url: "/courses",
          sort_order: 1,
        }),
      ],
    },
  ];
}

/** Prepend nav + append shared globals around page-specific core placements. */
function withCatalogShell(corePlacements) {
  const core = corePlacements.map((p, i) => ({
    ...p,
    sort_order: i + 1,
  }));
  return [
    {
      section_key: "in_page_nav",
      sort_order: 0,
      section_title: "",
      in_page_nav_title: "",
    },
    ...core,
    ...catalogGlobalPlacements(core.length + 1),
  ];
}

function directoryPlacements({
  heroTitle,
  heroSubtitle,
  directoryType,
  directoryTitle,
  directorySubtitle,
  catalogTitle,
  catalogSubtitle,
}) {
  return withCatalogShell([
    {
      section_key: "hero_classic",
      section_title: heroTitle,
      sub_title: heroSubtitle,
      in_page_nav_title: "Overview",
      buttons: [
        btn("Browse directory", {
          target_url: "#directory",
          sort_order: 0,
        }),
        btn("Browse courses", {
          variant: "secondary",
          target_url: "#catalog",
          sort_order: 1,
        }),
      ],
    },
    {
      section_key: "entity_directory",
      section_title: directoryTitle,
      sub_title: directorySubtitle,
      in_page_nav_title: "Directory",
      data: { directory_type: directoryType },
    },
    {
      section_key: "catalog",
      section_title: catalogTitle,
      sub_title: catalogSubtitle,
      in_page_nav_title: "Courses",
      data: {},
    },
  ]);
}

const LISTING_PAGES = [
  {
    path: "/courses",
    slug: "courses",
    name: "Course Catalog",
    description:
      "Browse courses filtered by vendor, product, skilling area, and industry.",
    placements: withCatalogShell([
      {
        section_key: "hero_classic",
        section_title:
          "Enterprise-Grade Industry Solutions for Workforce Transformation",
        sub_title:
          "Browse role-based courses mapped to vendors, products, skilling areas, and industries — built for measurable workforce impact.",
        in_page_nav_title: "Overview",
        buttons: [
          btn("Explore courses", {
            target_url: "#catalog",
            sort_order: 0,
          }),
        ],
      },
      {
        section_key: "catalog",
        section_title: "Course Catalog",
        sub_title:
          "Filter by vendor, product, skilling area, and industry to find the right program.",
        in_page_nav_title: "Catalog",
        data: {},
      },
    ]),
  },
  {
    path: "/vendors",
    slug: "vendors",
    name: "Vendors",
    description: "Browse training vendors and technology partners.",
    placements: directoryPlacements({
      heroTitle: "Training Vendors & Technology Partners",
      heroSubtitle:
        "Explore enterprise vendors and partners — from cloud and security to business and specialty certifications.",
      directoryType: "vendor",
      directoryTitle: "Vendor Catalog",
      directorySubtitle:
        "Find technology partners and browse their training portfolios.",
      catalogTitle: "Courses across vendors",
      catalogSubtitle:
        "Search the full course catalog, then open a vendor for a focused path.",
    }),
  },
  {
    path: "/products",
    slug: "products",
    name: "Products",
    description: "Browse training products and learning paths.",
    placements: directoryPlacements({
      heroTitle: "Training Products & Learning Paths",
      heroSubtitle:
        "Browse product catalogs mapped to vendors — find the right learning track for your teams.",
      directoryType: "product",
      directoryTitle: "Product Catalog",
      directorySubtitle:
        "Explore training products and learning paths across vendors.",
      catalogTitle: "Courses by product",
      catalogSubtitle:
        "Filter the full catalog, or open a product for a dedicated track.",
    }),
  },
  {
    path: "/industries",
    slug: "industries",
    name: "Industries",
    description: "Browse industry-aligned learning solutions.",
    placements: directoryPlacements({
      heroTitle: "Industry-Aligned Workforce Solutions",
      heroSubtitle:
        "Explore industries and the learning programs that help teams deliver in context.",
      directoryType: "industry",
      directoryTitle: "Industry Catalog",
      directorySubtitle: "Find industries and jump into related courses.",
      catalogTitle: "Courses across industries",
      catalogSubtitle:
        "Browse the full catalog or open an industry for a focused set.",
    }),
  },
  {
    path: "/skilling-areas",
    slug: "skilling-areas",
    name: "Skilling Areas",
    description: "Browse skilling areas and capability domains.",
    placements: directoryPlacements({
      heroTitle: "Skilling Areas & Capability Domains",
      heroSubtitle:
        "Explore capability domains — cloud, security, data, and more — then dive into related courses.",
      directoryType: "skilling_area",
      directoryTitle: "Skilling Area Catalog",
      directorySubtitle: "Find skilling areas and related learning paths.",
      catalogTitle: "Courses across skilling areas",
      catalogSubtitle:
        "Browse the full catalog or open a skilling area for a focused set.",
    }),
  },
];

async function seed() {
  await connectDB();
  console.log("Seeding catalog listing Content pages…");

  await ensureContentPage();

  // Preserve existing CMS entity ids and placements while pluralizing paths.
  const pathMigrations = [
    ["/vendor", "/vendors", "vendors"],
    ["/product", "/products", "products"],
    ["/industry", "/industries", "industries"],
    ["/skilling-area", "/skilling-areas", "skilling-areas"],
  ];
  for (const [from, to, slug] of pathMigrations) {
    const existingTarget = await Content.findOne({ path: to });
    if (!existingTarget) {
      await Content.updateOne({ path: from }, { $set: { path: to, slug } });
    }
  }

  const sectionByKey = new Map();
  for (const def of MANAGED_SECTIONS) {
    const section = await ensureSection(def);
    sectionByKey.set(section.key, section);
  }

  for (const key of REQUIRED_EXISTING_KEYS) {
    if (sectionByKey.has(key)) continue;
    const existing = await Section.findOne({ key });
    if (existing) sectionByKey.set(key, existing);
    else
      console.warn(
        `  ! missing section ${key} — run seed:pages / seed:partners / seed:stats / seed:testimonials first`
      );
  }

  for (const page of LISTING_PAGES) {
    const doc = await ensureContent({
      path: page.path,
      slug: page.slug,
      name: page.name,
      description: page.description,
      status: "active",
    });
    await replaceExtras("content", doc._id, page.placements, sectionByKey);
    console.log(`  ✓ ${page.path} (${page.placements.length} sections)`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
