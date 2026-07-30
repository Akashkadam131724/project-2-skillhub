import { btn, item } from "./content-page-seed-helpers.js";
import { loadUploadsManifest, pickFolderImage, pickFolderImages } from "./upload-manifest.js";

/** @typedef {{ path: string, slug: string, name: string, description: string, sortOrder: number, placements: () => object[] }} ShowcasePageDef */

export const SHOWCASE_CHILD_PAGES = [
  {
    path: "/showcase/cms-live-editing",
    slug: "showcase-cms-live-editing",
    name: "CMS Live Editing",
    description: "Inline CMS editing on any page — sections, themes, and overrides without redeploying.",
    sortOrder: 110,
    eyebrow: "CMS",
    folderId: "business-tech",
    headline: "Edit pages where they ship",
    subhead: "Live section editor with template, page, and entity-level overrides.",
    highlights: [
      {
        title: "Section placements",
        body: "Reorder bands, edit copy, images, and buttons per page or per vendor/product/course.",
        cta: { label: "Try on a vendor page", url: "/vendors" },
      },
      {
        title: "Override guide",
        body: "Built-in priority guide — site theme → template → section tag → entity placement.",
        cta: { label: "Open CMS", url: "/cms" },
      },
      {
        title: "Safe replenish",
        body: "Seed pipeline supports SEED_SAFE so editors keep custom rows while catalog refreshes.",
        cta: { label: "View catalog", url: "/courses" },
      },
    ],
  },
  {
    path: "/showcase/section-library",
    slug: "showcase-section-library",
    name: "Section Library",
    description: "40+ composable section types — heroes, catalogs, tabs, forms, and social proof.",
    sortOrder: 120,
    eyebrow: "Sections",
    folderId: "business-architecture-design",
    headline: "A full section design system",
    subhead: "Every marketing and catalog surface is built from reusable CMS sections.",
    highlights: [
      {
        title: "Hero variants",
        body: "Classic, split, media carousel, stats, dual CTA — pick per page template.",
        cta: { label: "Section catalog", url: "/cms/sections-catalog" },
      },
      {
        title: "Catalog blocks",
        body: "Course catalog, entity directory, related courses, and blog directory wired to MongoDB.",
        cta: { label: "Browse courses", url: "/courses" },
      },
      {
        title: "Preview images",
        body: "Each section has a catalog thumbnail from uploads/section-previews.",
        cta: { label: "CMS sections", url: "/cms/sections" },
      },
    ],
  },
  {
    path: "/showcase/themes-and-surfaces",
    slug: "showcase-themes-and-surfaces",
    name: "Themes & Surfaces",
    description: "Global site theme with custom surface band patterns — no code changes for new palettes.",
    sortOrder: 130,
    eyebrow: "Theme",
    folderId: "business-ai",
    headline: "Brand and band colors in one place",
    subhead: "Site-wide theme with optional template overrides and custom surface sequences.",
    highlights: [
      {
        title: "Surface patterns",
        body: "Define any band color cycle — not limited to preset alternating modes.",
        cta: { label: "Site theme", url: "/cms/site-theme" },
      },
      {
        title: "Inherit by default",
        body: "Page templates inherit the global theme unless you explicitly override.",
        cta: { label: "About SkillHub", url: "/about-us" },
      },
      {
        title: "Per-section bands",
        body: "Section-level surface overrides resolve against the active page pattern.",
        cta: { label: "Solutions hub", url: "/solutions" },
      },
    ],
  },
  {
    path: "/showcase/entity-pages",
    slug: "showcase-entity-pages",
    name: "Entity Detail Pages",
    description: "Vendor, product, course, industry, and skilling area pages fed from catalog + CMS.",
    sortOrder: 140,
    eyebrow: "Catalog",
    folderId: "business-cloud",
    headline: "Thousands of entity pages, one system",
    subhead: "Catalog seeds data; entity-cms seeds unique copy and images per record.",
    highlights: [
      {
        title: "24 vendors",
        body: "Each vendor page gets overview, delivery options, stats, FAQ, and course catalog.",
        cta: { label: "Microsoft", url: "/vendor/microsoft" },
      },
      {
        title: "Products & courses",
        body: "241 products and 2,000+ courses with distinct upload images per slug.",
        cta: { label: "Products", url: "/products" },
      },
      {
        title: "Skilling & industries",
        body: "Expertise hubs plus per-entity CMS overrides from the uploads manifest.",
        cta: { label: "Skilling areas", url: "/skilling-areas" },
      },
    ],
  },
  {
    path: "/showcase/content-feed",
    slug: "showcase-content-feed",
    name: "Content Feed Pipeline",
    description: "Seed pipeline builds business pages from server/uploads with real copy per domain.",
    sortOrder: 150,
    eyebrow: "Data feed",
    folderId: "business-security",
    headline: "From uploads manifest to live pages",
    subhead: "Automated content pages for solutions, marketing, and entity CMS.",
    highlights: [
      {
        title: "Upload manifest",
        body: "2,800+ local assets mapped to solution folders — JPG heroes, PNG accents.",
        cta: { label: "Cloud solution", url: "/solutions/cloud" },
      },
      {
        title: "37-step pipeline",
        body: "Catalog → CMS foundation → entity overrides → layouts → navigation.",
        cta: { label: "Get started", url: "/get-started" },
      },
      {
        title: "Business-only purge",
        body: "Content purge keeps the site map tight — showcase and solutions stay curated.",
        cta: { label: "All solutions", url: "/solutions" },
      },
    ],
  },
  {
    path: "/showcase/navigation",
    slug: "showcase-navigation",
    name: "Navigation System",
    description: "Mega-menu built from live catalog — Catalog, Expertise, Explore, Company.",
    sortOrder: 160,
    eyebrow: "Navigation",
    folderId: "business-leadership",
    headline: "Header menu from your data",
    subhead: "MongoDB navigation tree — vendors, products, skilling areas, and content routes.",
    highlights: [
      {
        title: "Catalog columns",
        body: "Vendors bucketed into Cloud, Security, Business, and Featured Programs.",
        cta: { label: "All vendors", url: "/vendors" },
      },
      {
        title: "Validated links",
        body: "Every header URL is checked against Content and entity slugs on seed.",
        cta: { label: "Industries", url: "/industries" },
      },
      {
        title: "API ready",
        body: "GET /navigation returns the full tree for the Next.js header.",
        cta: { label: "Contact us", url: "/contact-us" },
      },
    ],
  },
];

function childPlacements(def) {
  const m = loadUploadsManifest();
  const hero = pickFolderImage(def.folderId, m, 0);
  const imgs = pickFolderImages(def.folderId, m, 3, 2);

  return [
    { section_key: "in_page_nav", sort_order: 0 },
    {
      section_key: "editorial_banner",
      sort_order: 1,
      section_title: def.headline,
      sub_title: def.subhead,
      in_page_nav_title: def.eyebrow,
      section_img_url: hero,
      data: { body: `<p>${def.description}</p>` },
      buttons: [
        btn("Back to showcase", { target_url: "/showcase", sort_order: 0 }),
        btn("See it live", { variant: "secondary", target_url: def.highlights[0]?.cta?.url || "/courses", sort_order: 1 }),
      ],
    },
    {
      section_key: "feature_spotlight",
      sort_order: 2,
      section_title: "What we built",
      sub_title: "Highlights from this capability area.",
      in_page_nav_title: "Highlights",
      items: def.highlights.map((h, i) =>
        item(
          {
            value: String(i + 1).padStart(2, "0"),
            title: h.title,
            subtitle: def.eyebrow,
            body: `<p>${h.body}</p>`,
            image_url: imgs[i] || hero,
            buttons: h.cta ? [btn(h.cta.label, { target_url: h.cta.url, variant: "link" })] : [],
          },
          i
        )
      ),
    },
    {
      section_key: "text_media",
      sort_order: 3,
      in_page_nav_title: "Details",
      items: [
        item(
          {
            title: "Try it yourself",
            body: "<p>Open any linked page with <code>?cms=1</code> to edit sections in context.</p>",
            image_url: imgs[1] || hero,
            value: "end",
          },
          0
        ),
      ],
    },
    {
      section_key: "cta_band",
      sort_order: 4,
      section_title: "Explore more of SkillHub",
      buttons: [
        btn("Full showcase", { target_url: "/showcase", sort_order: 0 }),
        btn("Contact us", { variant: "secondary", target_url: "/contact-us", sort_order: 1 }),
      ],
    },
  ];
}

export function showcaseHubPlacements() {
  const m = loadUploadsManifest();
  const hero = pickFolderImage("business-ai", m, 0);
  const imgs = pickFolderImages("business-tech", m, 6, 0);

  const cards = SHOWCASE_CHILD_PAGES.map((child, i) =>
    item(
      {
        value: child.eyebrow,
        title: child.name,
        subtitle: child.path,
        body: `<p>${child.description}</p>`,
        image_url: imgs[i % imgs.length] || hero,
        href: child.path,
        buttons: [btn("View showcase", { target_url: child.path, variant: "link" })],
      },
      i
    )
  );

  return [
    { section_key: "in_page_nav", sort_order: 0 },
    {
      section_key: "editorial_banner",
      sort_order: 1,
      section_title: "What we built on SkillHub",
      sub_title: "CMS, catalog, themes, content feed, and navigation — a full EdTech platform stack.",
      in_page_nav_title: "Showcase",
      section_img_url: hero,
      data: {
        body: "<p>These pages document the major systems shipped in this project — each with live links you can open, edit in CMS, and extend.</p>",
      },
      buttons: [
        btn("Open CMS", { target_url: "/cms", sort_order: 0 }),
        btn("Browse catalog", { variant: "secondary", target_url: "/courses", sort_order: 1 }),
      ],
    },
    {
      section_key: "stats",
      sort_order: 2,
      section_title: "Platform at a glance",
      in_page_nav_title: "Stats",
      items: [
        item({ value: "43+", label: "Section types" }, 0),
        item({ value: "2,800+", label: "Upload assets" }, 1),
        item({ value: "2,022", label: "Courses seeded" }, 2),
        item({ value: "37", label: "Pipeline steps" }, 3),
      ],
    },
    {
      section_key: "feature_spotlight",
      sort_order: 3,
      section_title: "Capability showcases",
      sub_title: "Pick a topic to see what we built and where to try it live.",
      in_page_nav_title: "Topics",
      items: cards,
    },
    {
      section_key: "process_steps",
      sort_order: 4,
      section_title: "How the stack fits together",
      in_page_nav_title: "Stack",
      items: [
        item({ title: "Catalog", body: "<p>Vendors, products, courses, blogs — MongoDB models and seeds.</p>" }, 0),
        item({ title: "CMS", body: "<p>Page templates, sections, EntityPageSection placements, live editor.</p>" }, 1),
        item({ title: "Content feed", body: "<p>Uploads manifest → solution pages → entity overrides → navigation.</p>" }, 2),
        item({ title: "Frontend", body: "<p>Next.js App Router, ISR nav, catch-all content routes, entity detail pages.</p>" }, 3),
      ],
    },
    {
      section_key: "faq",
      sort_order: 5,
      section_title: "Showcase FAQ",
      in_page_nav_title: "FAQ",
      items: [
        item(
          {
            title: "Can I edit these pages?",
            body: "<p>Yes — append <code>?cms=1</code> to any URL or use the CMS admin.</p>",
          },
          0
        ),
        item(
          {
            title: "Where is the section library?",
            body: "<p>Admin UI at <code>/cms/sections-catalog</code> and public previews under <code>/cms/section</code>.</p>",
          },
          1
        ),
      ],
    },
    {
      section_key: "cta_band",
      sort_order: 6,
      section_title: "Want a walkthrough?",
      sub_title: "We can demo CMS editing, seed pipeline, and catalog on a call.",
      buttons: [
        btn("Contact us", { target_url: "/contact-us", sort_order: 0 }),
        btn("Get started", { variant: "secondary", target_url: "/get-started", sort_order: 1 }),
      ],
    },
  ];
}

/** @returns {ShowcasePageDef[]} */
export function allShowcasePageDefs() {
  const hub = {
    path: "/showcase",
    slug: "showcase",
    name: "Platform Showcase",
    description: "What we built — CMS, sections, themes, catalog, content feed, and navigation.",
    sortOrder: 100,
    placements: showcaseHubPlacements,
  };

  const children = SHOWCASE_CHILD_PAGES.map((child) => ({
    ...child,
    placements: () => childPlacements(child),
  }));

  return [hub, ...children];
}
