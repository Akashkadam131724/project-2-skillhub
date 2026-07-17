/**
 * Seeds a Content page at /how-it-works —
 * explains what SkillHub is, how the catalog + CMS work, and who it's for.
 *
 * Usage:
 *   npm run seed:how-it-works
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
  { key: "hero_media", name: "Hero Media", description: "Slider hero with side media / video", content_scope: "page" },
  { key: "bento_grid", name: "Bento Grid", description: "Asymmetric mosaic grid", content_scope: "page" },
  { key: "text_media", name: "Text + Media", description: "Alternating text and image rows", content_scope: "page" },
  { key: "feature_tabs", name: "Feature Tabs", description: "Tabbed features with preview", content_scope: "page" },
  { key: "split_narrative", name: "Split Narrative", description: "Sticky media + chapters", content_scope: "page" },
  { key: "horizon_gallery", name: "Horizon Gallery", description: "Horizontal snap gallery", content_scope: "page" },
  { key: "card_stack", name: "Card Stack", description: "Sticky stacking cards", content_scope: "page" },
  { key: "feature_spotlight", name: "Feature Spotlight", description: "Asymmetric spotlight cards", content_scope: "page" },
  { key: "pillar_destinations", name: "Pillar Destinations", description: "Tall destination pillars", content_scope: "page" },
  { key: "overview", name: "Overview", description: "Rich text overview", content_scope: "page" },
  { key: "metric_rail", name: "Metric Rail", description: "Metric strip", content_scope: "page" },
  { key: "masonry_quotes", name: "Masonry Quotes", description: "Masonry testimonial wall", content_scope: "page" },
  { key: "cta_band", name: "CTA Band", description: "Full-bleed call to action", content_scope: "page" },
];

const SLIDE_BG =
  "linear-gradient(125deg, #0b1f4d 0%, #12305f 45%, #0a1740 100%)";

const PLACEMENTS = [
  { section_key: "in_page_nav", sort_order: 0 },
  {
    section_key: "hero_media",
    sort_order: 1,
    in_page_nav_title: "Intro",
    items: [
      item(
        {
          title: "How SkillHub works under the hood",
          subtitle:
            "A deep dive into the catalog graph, page templates, entity placements, and the live CMS loop — for builders and curious operators.",
          image_url:
            "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80",
          icon: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
          href: "",
          bg_color: SLIDE_BG,
          buttons: [
            btn("Back to homepage", {
              target_url: "/",
              variant: "inverse",
              sort_order: 0,
            }),
            btn("Contact us", {
              target_url: "/contact-us",
              variant: "secondary",
              sort_order: 1,
            }),
          ],
        },
        0
      ),
      item(
        {
          title: "Vendors → products → courses",
          subtitle:
            "The catalog is a strict graph. Skill levels, skilling areas, and industries hang off courses so filters stay trustworthy.",
          image_url:
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80",
          icon: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=900&q=80",
          href: "",
          bg_color: SLIDE_BG,
          buttons: [
            btn("Browse vendors", {
              target_url: "/vendors",
              variant: "inverse",
              sort_order: 0,
            }),
          ],
        },
        1
      ),
      item(
        {
          title: "Pages are placements, not hard-coded JSX",
          subtitle:
            "Home and content templates resolve Section tags plus EntityPageSection overrides — same components, different data per URL.",
          image_url:
            "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=2000&q=80",
          icon: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=900&q=80",
          href: "",
          bg_color: SLIDE_BG,
          buttons: [
            btn("Jump to CMS model", {
              target_url: "#cms",
              variant: "inverse",
              sort_order: 0,
            }),
          ],
        },
        2
      ),
    ],
  },
  {
    section_key: "bento_grid",
    sort_order: 2,
    in_page_nav_title: "System",
    section_title: "The three layers of SkillHub",
    sub_title:
      "Everything in this project sits in one of three layers — catalog data, public routes, or CMS composition.",
    items: [
      item(
        {
          value: "01",
          title: "Catalog graph",
          subtitle: "Vendors → Products → Courses",
          body: "<p>Structured marketplace data with skill levels, skilling areas, and industries for filtering and discovery.</p>",
          image_url:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
        },
        0
      ),
      item(
        {
          value: "Web",
          title: "Public site",
          subtitle: "Next.js App Router",
          image_url:
            "https://images.unsplash.com/photo-1467232004584-a241c7c7a7e4?auto=format&fit=crop&w=900&q=80",
        },
        1
      ),
      item(
        {
          value: "API",
          title: "Express + MongoDB",
          subtitle: "Mongoose models",
          image_url:
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
        },
        2
      ),
      item(
        {
          value: "CMS",
          title: "Live sections",
          subtitle: "Compose any page",
          body: "<p>Reusable section types — heroes, grids, galleries, narratives — placed per page or per entity.</p>",
          image_url:
            "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1400&q=80",
        },
        3
      ),
      item(
        {
          value: "Blog",
          title: "Editorial posts",
          subtitle: "Rich TipTap body",
          image_url:
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80",
        },
        4
      ),
      item(
        {
          value: "Theme",
          title: "Site theme",
          subtitle: "Brand tokens",
          image_url:
            "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80",
        },
        5
      ),
    ],
  },
  {
    section_key: "text_media",
    sort_order: 4,
    in_page_nav_title: "Catalog",
    section_title: "How the catalog connects",
    sub_title:
      "A clear hierarchy keeps search, filters, and detail pages honest.",
    items: [
      item(
        {
          title: "Vendors own the brand shelf",
          subtitle: "Partners in the marketplace",
          body: "<p>Each vendor is a training partner with logo, story, and a portfolio of products. Public routes list vendors and open a detail page for every brand.</p>",
          image_url:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
          value: "end",
        },
        0
      ),
      item(
        {
          title: "Products group related courses",
          subtitle: "Offerings under a vendor",
          body: "<p>A product belongs to one vendor and can contain many courses — the natural place for solution families, certifications, or product lines.</p>",
          image_url:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
          value: "start",
        },
        1
      ),
      item(
        {
          title: "Courses carry the learning detail",
          subtitle: "Tagged for discovery",
          body: "<p>Courses link to skill level, skilling areas, and industries so learners and L&amp;D can filter by role, domain, and vertical — not by keyword guesswork alone.</p>",
          image_url:
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1400&q=80",
          value: "end",
        },
        2
      ),
    ],
  },
  {
    section_key: "feature_tabs",
    sort_order: 5,
    in_page_nav_title: "Browse",
    section_title: "What you can browse on the public site",
    sub_title: "Catalog indexes plus free-form content pages — all CMS-aware.",
    items: [
      item(
        {
          title: "Vendors & products",
          subtitle: "Partner marketplace",
          body: "<p>List and detail pages for every vendor and product in the catalog — logos, stories, and linked courses.</p>",
          image_url:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
          label: "Catalog",
          href: "/vendors",
        },
        0
      ),
      item(
        {
          title: "Courses & filters",
          subtitle: "Skill · area · industry",
          body: "<p>Course pages pull tags so discovery stays structured. Skilling areas and industries get their own indexes too.</p>",
          image_url:
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80",
          label: "Courses",
          href: "/courses",
        },
        1
      ),
      item(
        {
          title: "Content pages",
          subtitle: "About, campus, blogs…",
          body: "<p>Any path can be a Content document with a custom section layout — like this page, Learning Campus, or About Us.</p>",
          image_url:
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
          label: "Pages",
          href: "/learning-campus",
        },
        2
      ),
      item(
        {
          title: "Blog & editorial",
          subtitle: "Long-form with TOC",
          body: "<p>Rich TipTap posts with headings, embeds, and a table of contents — seeded and editable from the CMS.</p>",
          image_url:
            "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80",
          label: "Blog",
          href: "/blogs",
        },
        3
      ),
    ],
  },
  {
    section_key: "split_narrative",
    sort_order: 6,
    in_page_nav_title: "CMS",
    section_title: "How the CMS works",
    sub_title:
      "Scroll the chapters — this is the editing loop editors use every day.",
    section_img_url:
      "https://images.unsplash.com/photo-1542744173-8e2bd2371532?auto=format&fit=crop&w=1200&q=80",
    items: [
      item(
        {
          title: "1 · Pick a page template",
          body: "<p>Home, content, product, vendor, and other page keys define which sections can appear. Content pages start blank and fill with placements.</p>",
          image_url:
            "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80",
        },
        0
      ),
      item(
        {
          title: "2 · Place reusable sections",
          body: "<p>Heroes, bento grids, galleries, tabs, narratives, CTAs — each section type is a registered component with its own fields and items.</p>",
          image_url:
            "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1000&q=80",
        },
        1
      ),
      item(
        {
          title: "3 · Override per entity",
          body: "<p>EntityPageSection stores title, body, buttons, and items for one page instance — so the same section looks different on different courses or content paths.</p>",
          image_url:
            "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=1000&q=80",
        },
        2
      ),
      item(
        {
          title: "4 · Edit live with ?cms=1",
          body: "<p>Open any public URL with CMS mode on. Click a section, edit fields or items, save — visitors see the published layout immediately.</p>",
          image_url:
            "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=80",
        },
        3
      ),
    ],
  },
  {
    section_key: "horizon_gallery",
    sort_order: 7,
    in_page_nav_title: "Surfaces",
    section_title: "Surfaces you can compose",
    sub_title: "Swipe through the kinds of layouts SkillHub sections support.",
    items: [
      item(
        {
          title: "Hero banners & media sliders",
          subtitle: "Full-bleed stories with optional video",
          image_url:
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2000&q=80",
        },
        0
      ),
      item(
        {
          title: "Bento & feature grids",
          subtitle: "Asymmetric mosaics for capabilities",
          image_url:
            "https://images.unsplash.com/photo-1558655146-9f40138afdfc?auto=format&fit=crop&w=2000&q=80",
        },
        1
      ),
      item(
        {
          title: "Galleries & destinations",
          subtitle: "Horizon strips and tall pillars",
          image_url:
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=2000&q=80",
        },
        2
      ),
      item(
        {
          title: "Narratives & proof",
          subtitle: "Split stories, quotes, metrics",
          image_url:
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=2000&q=80",
        },
        3
      ),
      item(
        {
          title: "Catalog modules",
          subtitle: "Products, blogs, directories",
          image_url:
            "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=2000&q=80",
        },
        4
      ),
    ],
  },
  {
    section_key: "card_stack",
    sort_order: 8,
    in_page_nav_title: "Journey",
    section_title: "A typical SkillHub journey",
    sub_title: "From first visit to a published page — four steps teams repeat.",
    items: [
      item(
        {
          title: "Discover the catalog",
          subtitle: "Learners & buyers",
          body: "<p>Browse vendors, products, and courses. Filter by industry or skilling area. Open a detail page to evaluate fit.</p>",
          image_url:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
          value: "01",
        },
        0
      ),
      item(
        {
          title: "Seed or sync data",
          subtitle: "Operators",
          body: "<p>Use seed scripts or the API to load vendors, products, courses, blogs, and content documents into MongoDB.</p>",
          image_url:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
          value: "02",
        },
        1
      ),
      item(
        {
          title: "Compose the story",
          subtitle: "Editors",
          body: "<p>Create a Content path, place sections, add images and CTAs, and refine copy in live CMS mode.</p>",
          image_url:
            "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
          value: "03",
        },
        2
      ),
      item(
        {
          title: "Publish & iterate",
          subtitle: "Teams",
          body: "<p>Ship the page. Adjust sections without a redeploy. Theme tokens keep brand consistent across surfaces.</p>",
          image_url:
            "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1200&q=80",
          value: "04",
        },
        3
      ),
    ],
  },
  {
    section_key: "feature_spotlight",
    sort_order: 9,
    in_page_nav_title: "Audience",
    section_title: "Who SkillHub is for",
    sub_title: "Three audiences share one system — different jobs, same data.",
    items: [
      item(
        {
          title: "Learners & managers",
          subtitle: "Find the right path",
          body: "<p>Search courses by skill and industry. Read vendor stories. Use blogs and campus pages to understand how learning shows up at work.</p>",
          image_url:
            "https://images.unsplash.com/photo-1573164713714-d95e4369651d?auto=format&fit=crop&w=1400&q=80",
        },
        0
      ),
      item(
        {
          title: "L&D and marketing",
          subtitle: "Shape the narrative",
          body: "<p>Compose landing pages, solution hubs, and campaigns with sections — heroes, grids, proof, and CTAs — without waiting on engineering for every layout change.</p>",
          image_url:
            "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1400&q=80",
        },
        1
      ),
      item(
        {
          title: "Builders & operators",
          subtitle: "Own the platform",
          body: "<p>Next.js client, Express API, MongoDB models, seed scripts, and a section registry — extend the catalog or add a new section type when the product needs it.</p>",
          image_url:
            "https://images.unsplash.com/photo-1498050108023-c34155e21af1?auto=format&fit=crop&w=1400&q=80",
        },
        2
      ),
    ],
  },
  {
    section_key: "pillar_destinations",
    sort_order: 10,
    in_page_nav_title: "Explore",
    section_title: "Explore SkillHub yourself",
    sub_title: "Jump into the live surfaces this project already ships.",
    items: [
      item(
        {
          title: "Course catalog",
          subtitle: "Browse & filter",
          body: "<p>Courses tagged by skill, area, and industry.</p>",
          image_url:
            "https://images.unsplash.com/photo-1516321497487-e814af6289aa?auto=format&fit=crop&w=900&q=80",
          href: "/courses",
          label: "Open",
        },
        0
      ),
      item(
        {
          title: "Vendors",
          subtitle: "Partner brands",
          body: "<p>Real logos and product portfolios in the marketplace.</p>",
          image_url:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
          href: "/vendors",
          label: "Open",
        },
        1
      ),
      item(
        {
          title: "Catalog guide",
          subtitle: "Data relationships",
          body: "<p>Vendor → product → course, tags, certs, and blogs explained.</p>",
          image_url:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
          href: "/catalog-guide",
          label: "Open",
        },
        2
      ),
      item(
        {
          title: "Contact us",
          subtitle: "Talk with the team",
          body: "<p>Ask about architecture, pilots, or publishing workflows.</p>",
          image_url:
            "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=900&q=80",
          href: "/contact-us",
          label: "Contact",
        },
        3
      ),
    ],
  },
  {
    section_key: "overview",
    sort_order: 11,
    in_page_nav_title: "Stack",
    section_title: "Under the hood — in detail",
    sub_title: "How the repo resolves a page from MongoDB to the browser.",
    data: {
      body: `<p><strong>Client</strong> — Next.js App Router on port 3001. <code>/</code> loads Page key <em>home</em>. Catch-all routes load Page key <em>content</em> for free-form paths. Blog detail, vendor/product/course templates, and <code>/cms</code> all share the section registry in <code>section-registry.js</code>.</p>
<p><strong>Server</strong> — Express 5 on port 3000. Mongoose models for Vendor, Product, Course, SkillLevel, SkillingArea, Industry, Blog, Content, Section, Page, EntityPageSection, and EntityPageTheme. Seed scripts (<code>npm run seed:*</code>) hydrate demo data.</p>
<p><strong>Resolution</strong> — <code>getResolvedSections(pageKey, entityId)</code> merges: (1) Section.pages tags for that page key, (2) EntityPageSection overrides by page_tag_id, (3) entity-only extras with page_tag_id null. Home uses template tags; content pages often rely on extras.</p>
<p><strong>CMS model</strong> — Page templates declare which sections can appear. Each placement stores title, subtitle, body, buttons, items, and media. Live mode (<code>?cms=1</code>) edits those fields in place on the public URL.</p>
<p><strong>Catalog graph</strong> — Vendor 1:* Product 1:* Course; Course optionally refs SkillLevel and many-to-many SkillingArea / Industry. Deletes are not cascaded — operators manage cleanup intentionally.</p>
<p><strong>Homepage vs this page</strong> — Home sells the publishing workflow and roadmap. This page documents how the system is wired so builders can extend it safely.</p>`,
    },
  },
  {
    section_key: "metric_rail",
    sort_order: 12,
    in_page_nav_title: "Facts",
    section_title: "Project at a glance",
    items: [
      item({ value: "3", label: "Catalog layers", title: "Vendor · Product · Course" }, 0),
      item({ value: "2", label: "App layers", title: "Next + Express" }, 1),
      item({ value: "1", label: "Live CMS", title: "Edit on the page" }, 2),
      item({ value: "∞", label: "Content paths", title: "Compose freely" }, 3),
    ],
  },
  {
    section_key: "masonry_quotes",
    sort_order: 13,
    in_page_nav_title: "Voices",
    section_title: "How teams talk about SkillHub",
    sub_title: "The jobs this project is designed to make easier.",
    items: [
      item(
        {
          title: "Asha K.",
          subtitle: "L&D program lead",
          body: "<p>We finally have catalog pages and campaign pages in the same system. Filters stay honest; the story pages stay flexible.</p>",
          image_url:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        },
        0
      ),
      item(
        {
          title: "Jordan M.",
          subtitle: "Frontend engineer",
          body: "<p>Adding a section type is registering a component and a seed. Editors get it instantly — no one-off marketing micro-site.</p>",
          image_url:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
        },
        1
      ),
      item(
        {
          title: "Priya S.",
          subtitle: "Content editor",
          body: "<p>Live CMS mode means I fix copy where the visitor sees it. No guessing from a separate preview tool.</p>",
          image_url:
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
        },
        2
      ),
      item(
        {
          title: "Leo R.",
          subtitle: "Product owner",
          body: "<p>Vendors → products → courses is the spine. Everything else — blogs, campus, how-it-works — hangs off Content pages.</p>",
          image_url:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        },
        3
      ),
      item(
        {
          title: "Nina T.",
          subtitle: "Solutions marketer",
          body: "<p>Bento grids and hero video made our partner story feel like a product, not a PDF.</p>",
          image_url:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
        },
        4
      ),
      item(
        {
          title: "Chris D.",
          subtitle: "Platform ops",
          body: "<p>Seed scripts get a demo environment standing in minutes. Same models we run in development.</p>",
          image_url:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        },
        5
      ),
    ],
  },
  {
    section_key: "cta_band",
    sort_order: 14,
    in_page_nav_title: "Next",
    section_title: "Ready to see SkillHub in action?",
    sub_title:
      "Browse the catalog, tour the Learning Campus, or reach out with your questions.",
    buttons: [
      btn("Browse courses", {
        target_url: "/courses",
        sort_order: 0,
      }),
      btn("Visit Learning Campus", {
        target_url: "/learning-campus",
        variant: "secondary",
        sort_order: 1,
      }),
      btn("Contact us", {
        target_url: "/contact-us",
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

async function seed() {
  await connectDB();
  console.log("Seeding How SkillHub Works content page…");

  await ensureContentPage();

  const sectionByKey = new Map();
  for (const def of SECTION_DEFS) {
    const section = await ensureSection(def);
    sectionByKey.set(def.key, section);
  }

  const content = await Content.findOneAndUpdate(
    { path: "/how-it-works" },
    {
      $set: {
        path: "/how-it-works",
        slug: "how-it-works",
        name: "How SkillHub Works",
        description:
          "Technical deep dive: catalog graph, page templates, EntityPageSection resolution, section registry, and the live CMS loop.",
        status: "active",
        sortOrder: 35,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );

  await replaceExtras("content", content._id, PLACEMENTS, sectionByKey);

  console.log(
    `  ✓ /how-it-works (${PLACEMENTS.length} sections) — ${content._id}`
  );
  console.log("Done. Open http://localhost:3001/how-it-works");
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
