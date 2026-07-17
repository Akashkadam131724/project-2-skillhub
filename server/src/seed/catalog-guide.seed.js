/**
 * Seeds Content page at /catalog-guide —
 * explains Vendor → Product → Course relationships, tags, catalogs, and blogs.
 *
 * Usage:
 *   npm run seed:catalog-guide
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

const SECTION_DEFS = [
  { key: "in_page_nav", name: "In-page Nav", description: "Sticky section jump links", content_scope: "page" },
  { key: "editorial_banner", name: "Editorial Banner", description: "Full-bleed editorial hero", content_scope: "page" },
  { key: "bento_grid", name: "Bento Grid", description: "Asymmetric mosaic grid", content_scope: "page" },
  { key: "text_media", name: "Text + Media", description: "Alternating text and image rows", content_scope: "page" },
  { key: "split_narrative", name: "Split Narrative", description: "Sticky media + chapters", content_scope: "page" },
  { key: "feature_tabs", name: "Feature Tabs", description: "Tabbed features with preview", content_scope: "page" },
  { key: "process_steps", name: "Process Steps", description: "Numbered process steps", content_scope: "page" },
  { key: "card_stack", name: "Card Stack", description: "Sticky stacking cards", content_scope: "page" },
  { key: "pillar_destinations", name: "Pillar Destinations", description: "Tall destination pillars", content_scope: "page" },
  { key: "overview", name: "Overview", description: "Rich text overview", content_scope: "page" },
  { key: "metric_rail", name: "Metric Rail", description: "Metric strip", content_scope: "page" },
  { key: "cta_band", name: "CTA Band", description: "Full-bleed call to action", content_scope: "page" },
];

const PLACEMENTS = [
  { section_key: "in_page_nav", sort_order: 0 },
  {
    section_key: "editorial_banner",
    sort_order: 1,
    in_page_nav_title: "Map",
    section_title: "How the SkillHub catalog fits together",
    sub_title:
      "Vendors, products, courses, certification paths, industry catalogs, and blogs — one graph, many public pages.",
    section_img_url:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80",
    data: {
      eyebrow: "Catalog guide",
      body: "<p>Use this page as the map of relationships. Then open any live catalog URL to see the same model in the product.</p>",
    },
    buttons: [
      btn("Browse vendors", {
        target_url: "/vendors",
        variant: "inverse",
        sort_order: 0,
      }),
      btn("Browse courses", {
        target_url: "/courses",
        variant: "secondary",
        sort_order: 1,
      }),
    ],
  },
  {
    section_key: "bento_grid",
    sort_order: 2,
    in_page_nav_title: "Graph",
    section_title: "The catalog graph at a glance",
    sub_title: "Everything learners browse hangs off this hierarchy.",
    items: [
      item(
        {
          value: "1",
          title: "Vendor",
          subtitle: "Brand / partner",
          body: "<p>Owns the shelf. One vendor has many products.</p>",
          image_url:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
        },
        0
      ),
      item(
        {
          value: "N",
          title: "Product",
          subtitle: "Offering family",
          body: "<p>Belongs to one vendor. Groups related courses.</p>",
          image_url:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
        },
        1
      ),
      item(
        {
          value: "∞",
          title: "Course",
          subtitle: "Learning unit",
          body: "<p>Belongs to one product. Tagged for discovery.</p>",
          image_url:
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80",
        },
        2
      ),
      item(
        {
          value: "Tag",
          title: "Skill level",
          subtitle: "0…1 on course",
          image_url:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
        },
        3
      ),
      item(
        {
          value: "Tag",
          title: "Skilling areas",
          subtitle: "Many-to-many",
          image_url:
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
        },
        4
      ),
      item(
        {
          value: "Tag",
          title: "Industries",
          subtitle: "Many-to-many",
          image_url:
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
        },
        5
      ),
    ],
  },
  {
    section_key: "text_media",
    sort_order: 3,
    in_page_nav_title: "Spine",
    section_title: "Vendor → Product → Course",
    sub_title: "The required spine. Nothing optional here.",
    items: [
      item(
        {
          title: "Vendor is the brand shelf",
          subtitle: "Public: /vendors and /vendor/:slug",
          body: "<p>A vendor is a training partner — logo, story, and portfolio. Products must reference a vendor. On the public site, vendor list and detail pages surface every brand, then link down into products and courses.</p>",
          image_url:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
          value: "end",
        },
        0
      ),
      item(
        {
          title: "Product groups related courses",
          subtitle: "Public: /products and /product/:slug",
          body: "<p>A product belongs to exactly one vendor. Think certification track, solution family, or product line. Courses hang under products — so when you open a product page, you see the courses that belong to that offering.</p>",
          image_url:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
          value: "start",
        },
        1
      ),
      item(
        {
          title: "Course is the learning unit",
          subtitle: "Public: /courses and /course/:slug",
          body: "<p>A course must belong to a product (and therefore to a vendor). This is where duration, outcomes, curriculum, and tags live. Certification-style paths are usually a product with several courses underneath — not a separate model.</p>",
          image_url:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
          value: "end",
        },
        2
      ),
    ],
  },
  {
    section_key: "split_narrative",
    sort_order: 4,
    in_page_nav_title: "Tags",
    section_title: "How discovery tags attach",
    sub_title: "Tags hang off courses — never replace the vendor → product → course spine.",
    section_img_url:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
    items: [
      item(
        {
          title: "Skill level (optional, one)",
          body: "<p>A course may reference zero or one skill level (beginner → advanced). Skill-level pages list courses at that depth.</p>",
          image_url:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
        },
        0
      ),
      item(
        {
          title: "Skilling areas (many)",
          body: "<p>Cloud, data, security, leadership — a course can belong to several areas. Area indexes (/skilling-areas) filter the catalog by domain.</p>",
          image_url:
            "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=80",
        },
        1
      ),
      item(
        {
          title: "Industries (many)",
          body: "<p>Healthcare, finance, retail — industries let L&amp;D browse by vertical. Same course can serve multiple industries.</p>",
          image_url:
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80",
        },
        2
      ),
      item(
        {
          title: "Why tags matter",
          body: "<p>Filters stay honest because they query real refs — not free-text keywords alone. Marketing pages can deep-link into filtered catalogs without breaking the graph.</p>",
          image_url:
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80",
        },
        3
      ),
    ],
  },
  {
    section_key: "feature_tabs",
    sort_order: 5,
    in_page_nav_title: "Catalogs",
    section_title: "Public catalog surfaces",
    sub_title: "Each index is a Content or hard-coded route that reads the same models.",
    items: [
      item(
        {
          title: "Vendors catalog",
          subtitle: "/vendors",
          body: "<p>List of partner brands. Detail pages show products and linked courses for that vendor.</p>",
          image_url:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
          label: "Vendors",
          href: "/vendors",
        },
        0
      ),
      item(
        {
          title: "Products catalog",
          subtitle: "/products",
          body: "<p>Offering families under vendors — the natural place for certification tracks and solution lines.</p>",
          image_url:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
          label: "Products",
          href: "/products",
        },
        1
      ),
      item(
        {
          title: "Courses catalog",
          subtitle: "/courses",
          body: "<p>Filterable learning units. Course detail pulls product, vendor, and tags into one page.</p>",
          image_url:
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1400&q=80",
          label: "Courses",
          href: "/courses",
        },
        2
      ),
      item(
        {
          title: "Industry & area catalogs",
          subtitle: "/industries · /skilling-areas",
          body: "<p>Vertical and domain indexes that query courses by tag — great for solution hubs and role paths.</p>",
          image_url:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
          label: "Filters",
          href: "/industries",
        },
        3
      ),
    ],
  },
  {
    section_key: "process_steps",
    sort_order: 6,
    in_page_nav_title: "Certs",
    section_title: "Where certifications fit",
    sub_title:
      "SkillHub does not need a separate “certification” table — paths are modeled with products and courses.",
    items: [
      item(
        {
          title: "Vendor publishes a certification product",
          subtitle: "Step 1",
          body: "<p>Example: “Cloud Architect Professional” as a product under AWS or Azure.</p>",
        },
        0
      ),
      item(
        {
          title: "Courses form the path",
          subtitle: "Step 2",
          body: "<p>Foundation → associate → professional courses hang under that product in order.</p>",
        },
        1
      ),
      item(
        {
          title: "Tags make the path discoverable",
          subtitle: "Step 3",
          body: "<p>Skill level + skilling area + industry tags surface the path in the right filters.</p>",
        },
        2
      ),
      item(
        {
          title: "Content pages tell the story",
          subtitle: "Step 4",
          body: "<p>Marketing composes a /cloud-academy style page that links into the same product and courses.</p>",
        },
        3
      ),
    ],
  },
  {
    section_key: "card_stack",
    sort_order: 7,
    in_page_nav_title: "Blogs",
    section_title: "How blogs relate to the catalog",
    sub_title: "Blogs are editorial — they do not own courses, but they deep-link into them.",
    items: [
      item(
        {
          title: "Blog is its own model",
          subtitle: "Not in the vendor graph",
          body: "<p>Posts have slug, title, rich body, TOC, and embeds. They are not children of vendors or products.</p>",
          image_url:
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
          value: "01",
        },
        0
      ),
      item(
        {
          title: "Public surfaces",
          subtitle: "/blogs and /blog/:slug",
          body: "<p>The blogs index is often a Content page; detail routes render each post with TOC and rich text.</p>",
          image_url:
            "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
          value: "02",
        },
        1
      ),
      item(
        {
          title: "Linked from pages & home",
          subtitle: "latest_blogs section",
          body: "<p>Home and content pages can feature recent posts. CTAs inside posts can link to courses, vendors, or contact.</p>",
          image_url:
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
          value: "03",
        },
        2
      ),
      item(
        {
          title: "Why separate from catalog",
          subtitle: "Editorial velocity",
          body: "<p>Publishing a blog should not require creating a product. The catalog stays structured; blogs stay flexible.</p>",
          image_url:
            "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
          value: "04",
        },
        3
      ),
    ],
  },
  {
    section_key: "overview",
    sort_order: 8,
    in_page_nav_title: "Rules",
    section_title: "Relationship rules (quick reference)",
    sub_title: "Keep these in mind when seeding data or composing pages.",
    data: {
      body: `<p><strong>Required spine</strong> — Vendor 1:* Product 1:* Course. A course always has a product; a product always has a vendor.</p>
<p><strong>Optional tags on courses</strong> — SkillLevel (0…1), SkillingArea[] (many), Industry[] (many). Tags never replace the spine.</p>
<p><strong>Certifications</strong> — Model as products (or product + ordered courses). Use tags and content pages for the marketing story.</p>
<p><strong>Catalog indexes</strong> — /vendors, /products, /courses, /industries, /skilling-areas read the same Mongo models. Singular routes (/vendor/:slug, …) are detail pages.</p>
<p><strong>Blogs</strong> — Separate Blog model. Link out to catalog entities; do not nest blogs under vendors.</p>
<p><strong>Deletes</strong> — Not cascaded. Removing a vendor does not auto-delete its products/courses — clean up intentionally.</p>
<p><strong>CMS content pages</strong> — Free-form paths (like this one) compose sections and deep-link into catalog URLs without changing the graph.</p>`,
    },
  },
  {
    section_key: "metric_rail",
    sort_order: 9,
    in_page_nav_title: "Facts",
    section_title: "Model counts that matter",
    items: [
      item({ value: "3", label: "Spine layers", title: "Vendor · Product · Course" }, 0),
      item({ value: "3", label: "Course tag types", title: "Level · Area · Industry" }, 1),
      item({ value: "1", label: "Blog model", title: "Editorial, separate" }, 2),
      item({ value: "0", label: "Cascade deletes", title: "Clean up by design" }, 3),
    ],
  },
  {
    section_key: "pillar_destinations",
    sort_order: 10,
    in_page_nav_title: "Open",
    section_title: "Open the live catalogs",
    sub_title: "See the relationships in the running product.",
    items: [
      item(
        {
          title: "Vendors",
          subtitle: "Partner brands",
          body: "<p>Browse the brand shelf and open a vendor detail.</p>",
          image_url:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
          href: "/vendors",
          label: "Open",
        },
        0
      ),
      item(
        {
          title: "Products",
          subtitle: "Offerings & cert paths",
          body: "<p>Product families that group courses.</p>",
          image_url:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
          href: "/products",
          label: "Open",
        },
        1
      ),
      item(
        {
          title: "Courses",
          subtitle: "Filter & learn",
          body: "<p>Tagged learning units under products.</p>",
          image_url:
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80",
          href: "/courses",
          label: "Open",
        },
        2
      ),
      item(
        {
          title: "Blogs",
          subtitle: "Editorial layer",
          body: "<p>Stories that deep-link into the catalog.</p>",
          image_url:
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80",
          href: "/blogs",
          label: "Open",
        },
        3
      ),
    ],
  },
  {
    section_key: "cta_band",
    sort_order: 11,
    in_page_nav_title: "Next",
    section_title: "Want the platform story too?",
    sub_title:
      "This page is the catalog map. How It Works covers CMS publishing. Contact us if you want a live walkthrough.",
    buttons: [
      btn("How it works", {
        target_url: "/how-it-works",
        sort_order: 0,
      }),
      btn("Contact us", {
        target_url: "/contact-us",
        variant: "secondary",
        sort_order: 1,
      }),
      btn("Browse courses", {
        target_url: "/courses",
        variant: "outline",
        sort_order: 2,
      }),
    ],
  },
];

async function ensureSection(def) {
  const catalog = getSectionCatalogMeta(def.key);
  let section = await Section.findOne({ key: def.key });
  if (!section) {
    section = await Section.create({
      ...def,
      status: true,
      section_title: "",
      sub_title: "",
      in_page_nav_title: "",
      buttons: [],
      items: [],
      data: {},
      category: catalog?.category || "",
      tags: catalog?.tags || [],
      pages: [],
    });
    console.log(`  + created section ${def.key}`);
  } else {
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
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
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
      console.warn(`  ! missing ${p.section_key}`);
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

async function seed() {
  await connectDB();
  console.log("Seeding Catalog Guide content page…");

  await ensureContentPage();
  const sectionByKey = new Map();
  for (const def of SECTION_DEFS) {
    sectionByKey.set(def.key, await ensureSection(def));
  }

  const content = await Content.findOneAndUpdate(
    { path: "/catalog-guide" },
    {
      $set: {
        path: "/catalog-guide",
        slug: "catalog-guide",
        name: "Catalog Guide",
        description:
          "How vendors, products, courses, certification paths, industry catalogs, and blogs relate in SkillHub.",
        status: "active",
        sortOrder: 38,
      },
    },
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
      runValidators: true,
    }
  );

  await replaceExtras("content", content._id, PLACEMENTS, sectionByKey);

  console.log(`  ✓ /catalog-guide (${PLACEMENTS.length} sections) — ${content._id}`);
  console.log("Done. Open http://localhost:3001/catalog-guide");
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
