/**
 * Redesigns the homepage (Page key `home`, Content path `/`)
 * around the How SkillHub Works narrative.
 *
 * Usage:
 *   npm run seed:home-how-it-works
 */
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Content from "../modules/content/content.model.js";
import Page from "../modules/cms/page.model.js";
import Section from "../modules/cms/section.model.js";
import { getSectionCatalogMeta } from "../modules/cms/section.catalog.js";

const HOME_KEY = "home";

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
  { key: "statement_band", name: "Statement Band", description: "Oversized typographic band", content_scope: "page" },
  { key: "bento_grid", name: "Bento Grid", description: "Asymmetric mosaic grid", content_scope: "page" },
  { key: "text_media", name: "Text + Media", description: "Alternating text and image rows", content_scope: "page" },
  { key: "feature_tabs", name: "Feature Tabs", description: "Tabbed features with preview", content_scope: "page" },
  { key: "feature_spotlight", name: "Feature Spotlight", description: "Asymmetric spotlight cards", content_scope: "page" },
  { key: "card_stack", name: "Card Stack", description: "Sticky stacking cards", content_scope: "page" },
  { key: "split_narrative", name: "Split Narrative", description: "Sticky media + chapters", content_scope: "page" },
  { key: "latest_blogs", name: "Latest Blogs", description: "Recent blog posts grid", content_scope: "global" },
  { key: "pillar_destinations", name: "Pillar Destinations", description: "Tall destination pillars", content_scope: "page" },
  { key: "metric_rail", name: "Metric Rail", description: "Metric strip", content_scope: "page" },
  { key: "masonry_quotes", name: "Masonry Quotes", description: "Masonry testimonial wall", content_scope: "page" },
  { key: "cta_band", name: "CTA Band", description: "Full-bleed call to action", content_scope: "page" },
];

const DISABLE_ON_HOME = [
  "hero_classic",
  "hero_split",
  "hero_centered",
  "hero_minimal",
  "hero_media",
  "hero_stats",
  "hero_asymmetric",
  "hero_dual_cta",
  "why_choose",
  "stats",
  "partners_marquee",
  "training_options",
  "awards",
  "customer_testimonials",
];

const HOME_SECTIONS = [
  { section_key: "in_page_nav", sort_order: 0, status: true },
  {
    section_key: "statement_band",
    sort_order: 1,
    status: true,
    in_page_nav_title: "Why",
    section_title: "Stop waiting on engineering to publish a page",
    sub_title:
      "When learning stories change weekly, your site needs a publishing loop — not another static rebuild.",
    section_img_url:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=80",
    data: {
      eyebrow: "For publishers",
      body: "<p>Compose once. Reuse sections. Ship campaigns while the catalog stays clean.</p>",
    },
    buttons: [
      btn("How it works", {
        target_url: "/how-it-works",
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
  {
    section_key: "bento_grid",
    sort_order: 2,
    status: true,
    in_page_nav_title: "Value",
    section_title: "Why publishing on SkillHub is useful",
    sub_title: "Practical wins for editors, marketers, and L&D — not just developers.",
    items: [
      item(
        {
          value: "Fast",
          title: "Ship without redeploy",
          subtitle: "Change copy & layout live",
          body: "<p>Publishers update pages in CMS mode. Engineering owns section types — not every headline.</p>",
          image_url:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
        },
        0
      ),
      item(
        {
          value: "Reuse",
          title: "Section library",
          subtitle: "Heroes · grids · CTAs",
          image_url:
            "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=900&q=80",
        },
        1
      ),
      item(
        {
          value: "Brand",
          title: "Theme tokens",
          subtitle: "One look, every page",
          image_url:
            "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=900&q=80",
        },
        2
      ),
      item(
        {
          value: "True",
          title: "Catalog stays honest",
          subtitle: "Stories wrap real data",
          body: "<p>Campaign pages link to the same vendors and courses learners already browse.</p>",
          image_url:
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80",
        },
        3
      ),
      item(
        {
          value: "Nav",
          title: "In-page guides",
          subtitle: "Jump links built in",
          image_url:
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
        },
        4
      ),
      item(
        {
          value: "Edit",
          title: "Live CMS mode",
          subtitle: "Fix what you see",
          image_url:
            "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=900&q=80",
        },
        5
      ),
    ],
  },
  {
    section_key: "text_media",
    sort_order: 3,
    status: true,
    in_page_nav_title: "Publish",
    section_title: "How publishing works day to day",
    sub_title: "A simple loop your content team can run every week.",
    items: [
      item(
        {
          title: "Create a path, then compose sections",
          subtitle: "Content pages are blank canvases",
          body: "<p>Add a Content document with a public path like <em>/partners/aws-academy</em>. Open it with CMS mode on, place heroes, grids, galleries, and CTAs, then fill copy and images. Visitors hit that URL immediately — no app release required.</p>",
          image_url:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
          value: "end",
        },
        0
      ),
      item(
        {
          title: "Reuse the same building blocks everywhere",
          subtitle: "One section type, many stories",
          body: "<p>A bento grid on Home can look completely different on Learning Campus. Each placement stores its own titles, media, buttons, and items — so marketing can clone a pattern without cloning code.</p>",
          image_url:
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80",
          value: "start",
        },
        1
      ),
      item(
        {
          title: "Keep product pages and stories in sync",
          subtitle: "Catalog + narrative together",
          body: "<p>Link CTAs into courses and vendors. When the catalog updates, your campaign pages still point at real offerings — not orphaned marketing PDFs.</p>",
          image_url:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
          value: "end",
        },
        2
      ),
    ],
  },
  {
    section_key: "feature_tabs",
    sort_order: 4,
    status: true,
    in_page_nav_title: "Use cases",
    section_title: "Pages teams actually publish",
    sub_title: "Common SkillHub publishing jobs — beyond the homepage.",
    items: [
      item(
        {
          title: "Campaign landing pages",
          subtitle: "Launch week stories",
          body: "<p>Hero + proof + CTA for a new academy, partner promo, or certification drive. Swap imagery and outcomes without touching the catalog schema.</p>",
          image_url:
            "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=80",
          label: "Campaigns",
        },
        0
      ),
      item(
        {
          title: "Solution hubs",
          subtitle: "Industry or role stories",
          body: "<p>Compose pillars for cloud, AI, or leadership — then deep-link into filtered courses. One narrative layer over structured data.</p>",
          image_url:
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
          label: "Solutions",
        },
        1
      ),
      item(
        {
          title: "Partner & campus pages",
          subtitle: "Immersive showcases",
          body: "<p>Use galleries, bento mosaics, and narratives for Learning Campus–style tours that feel premium — still fully CMS-owned.</p>",
          image_url:
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80",
          label: "Showcases",
        },
        2
      ),
      item(
        {
          title: "Editorial & blogs",
          subtitle: "Long-form with TOC",
          body: "<p>Publish insights with rich text, embeds, and a table of contents — then feature them on Home via Latest Blogs.</p>",
          image_url:
            "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80",
          label: "Editorial",
        },
        3
      ),
    ],
  },
  {
    section_key: "card_stack",
    sort_order: 5,
    status: true,
    in_page_nav_title: "Workflow",
    section_title: "From idea to published URL",
    sub_title: "The publishing workflow SkillHub is designed around.",
    items: [
      item(
        {
          title: "1 · Decide the job of the page",
          subtitle: "Campaign, hub, or tour",
          body: "<p>Name the audience and the one action you want — enroll, request a pilot, or explore a path.</p>",
          image_url:
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
          value: "01",
        },
        0
      ),
      item(
        {
          title: "2 · Create the Content path",
          subtitle: "CMS → Contents",
          body: "<p>Pick a slug and path. SkillHub treats it as a first-class public route with its own section layout.</p>",
          image_url:
            "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=1200&q=80",
          value: "02",
        },
        1
      ),
      item(
        {
          title: "3 · Place sections & fill media",
          subtitle: "Compose in live mode",
          body: "<p>Drop heroes, grids, narratives, and CTAs. Upload images, write copy, wire buttons to courses or forms.</p>",
          image_url:
            "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=80",
          value: "03",
        },
        2
      ),
      item(
        {
          title: "4 · Publish & iterate weekly",
          subtitle: "No redeploy required",
          body: "<p>Share the URL. Next week, retarget the hero and CTA without waiting on a release train.</p>",
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
    sort_order: 6,
    status: true,
    in_page_nav_title: "Roadmap",
    section_title: "Coming next on the publishing roadmap",
    sub_title:
      "Useful capabilities we are designing for — not all shipped yet. This is the direction of the CMS.",
    items: [
      item(
        {
          title: "Scheduled publish & drafts",
          subtitle: "Plan launches ahead",
          body: "<p>Save draft layouts, schedule go-live times, and keep a working copy while the live page stays stable. Ideal for launch-week campaigns.</p>",
          image_url:
            "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1400&q=80",
        },
        0
      ),
      item(
        {
          title: "Role-based CMS permissions",
          subtitle: "Editors vs admins",
          body: "<p>Let marketers edit copy and media while only admins add new section types or change site theme tokens.</p>",
          image_url:
            "https://images.unsplash.com/photo-1573164713714-d95e4369651d?auto=format&fit=crop&w=1400&q=80",
        },
        1
      ),
      item(
        {
          title: "Preview links & version history",
          subtitle: "Review before go-live",
          body: "<p>Share private preview URLs with stakeholders and roll back to a previous placement snapshot when a campaign underperforms.</p>",
          image_url:
            "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80",
        },
        2
      ),
      item(
        {
          title: "Form builder & lead capture",
          subtitle: "CTAs that collect demand",
          body: "<p>Wire buttons to configurable forms — pilot requests, newsletter signup, partner inquiry — without a separate marketing stack.</p>",
          image_url:
            "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1400&q=80",
        },
        3
      ),
      item(
        {
          title: "Localization & multi-brand themes",
          subtitle: "Regions and partners",
          body: "<p>Duplicate a page layout for locales, swap language packs, and apply partner brand themes while keeping the same section structure.</p>",
          image_url:
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=80",
        },
        4
      ),
      item(
        {
          title: "Page analytics on sections",
          subtitle: "See what converts",
          body: "<p>Track which heroes and CTAs earn clicks, then promote winning layouts across other content paths.</p>",
          image_url:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
        },
        5
      ),
    ],
  },
  {
    section_key: "split_narrative",
    sort_order: 7,
    status: true,
    in_page_nav_title: "Today",
    section_title: "What you can publish today",
    sub_title: "Already live in this SkillHub build — start here while the roadmap lands.",
    section_img_url:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
    items: [
      item(
        {
          title: "Free-form content pages",
          body: "<p>Any public path with a full section layout — How It Works, Learning Campus, About, and pages you create next.</p>",
          image_url:
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80",
        },
        0
      ),
      item(
        {
          title: "Live in-place editing",
          body: "<p>CMS mode on the public URL. Edit titles, bodies, items, and buttons where visitors see them.</p>",
          image_url:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
        },
        1
      ),
      item(
        {
          title: "Rich blogs with TOC",
          body: "<p>TipTap posts with headings, embeds, and a reading experience built for long-form enablement content.</p>",
          image_url:
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80",
        },
        2
      ),
      item(
        {
          title: "Catalog detail layouts",
          body: "<p>Vendor, product, and course templates with sections that can be overridden per entity.</p>",
          image_url:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
        },
        3
      ),
    ],
  },
  {
    section_key: "latest_blogs",
    sort_order: 8,
    status: true,
    in_page_nav_title: "Insights",
    section_title: "Latest from the blog",
    sub_title: "Editorial posts you can feature on any published page.",
    buttons: [
      btn("View all posts", {
        target_url: "/blogs",
        variant: "secondary",
        sort_order: 0,
      }),
    ],
  },
  {
    section_key: "pillar_destinations",
    sort_order: 9,
    status: true,
    in_page_nav_title: "Explore",
    section_title: "Continue exploring",
    sub_title: "Homepage is for publishing value — these paths go deeper.",
    items: [
      item(
        {
          title: "How it works",
          subtitle: "Architecture deep dive",
          body: "<p>Catalog graph, CMS model, stack, and system detail.</p>",
          image_url:
            "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=900&q=80",
          href: "/how-it-works",
          label: "Read",
        },
        0
      ),
      item(
        {
          title: "Catalog guide",
          subtitle: "Vendors · products · courses",
          body: "<p>How the catalog graph, tags, cert paths, and blogs relate.</p>",
          image_url:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
          href: "/catalog-guide",
          label: "Read",
        },
        1
      ),
      item(
        {
          title: "Course catalog",
          subtitle: "Browse & filter",
          body: "<p>The structured data your published pages link into.</p>",
          image_url:
            "https://images.unsplash.com/photo-1516321497487-e814af6289aa?auto=format&fit=crop&w=900&q=80",
          href: "/courses",
          label: "Browse",
        },
        2
      ),
      item(
        {
          title: "Contact us",
          subtitle: "Talk with the team",
          body: "<p>Ask about publishing, pilots, or the right next course path.</p>",
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
    section_key: "metric_rail",
    sort_order: 10,
    status: true,
    in_page_nav_title: "Facts",
    section_title: "Publishing at a glance",
    items: [
      item({ value: "0", label: "Deploys to change copy", title: "Redeploys" }, 0),
      item({ value: "1", label: "Live edit mode", title: "CMS on URL" }, 1),
      item({ value: "∞", label: "Content paths you can add", title: "Pages" }, 2),
      item({ value: "Soon", label: "Drafts · schedule · roles", title: "Roadmap" }, 3),
    ],
  },
  {
    section_key: "masonry_quotes",
    sort_order: 11,
    status: true,
    in_page_nav_title: "Voices",
    section_title: "Why teams want a publish loop",
    sub_title: "The pain SkillHub’s CMS is built to remove.",
    items: [
      item(
        {
          title: "Maya C.",
          subtitle: "Campaign marketer",
          body: "<p>We used to wait two sprints for a landing page. Now we compose sections and ship the same afternoon.</p>",
          image_url:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
        },
        0
      ),
      item(
        {
          title: "Priya S.",
          subtitle: "Content editor",
          body: "<p>Editing on the live page means I stop guessing. What I save is what the visitor gets.</p>",
          image_url:
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
        },
        1
      ),
      item(
        {
          title: "Asha K.",
          subtitle: "L&D program lead",
          body: "<p>Our solution hubs stay linked to real courses. The story changes; the catalog stays the source of truth.</p>",
          image_url:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        },
        2
      ),
      item(
        {
          title: "Jordan M.",
          subtitle: "Platform engineer",
          body: "<p>I add section types once. Publishers reuse them. That is the only scalable way to support marketing velocity.</p>",
          image_url:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
        },
        3
      ),
    ],
  },
  {
    section_key: "cta_band",
    sort_order: 12,
    status: true,
    in_page_nav_title: "Start",
    section_title: "Ready to publish your next page?",
    sub_title:
      "Read how SkillHub works, browse the catalog, or reach out — we will help you pick the first path.",
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

async function ensureHomePage() {
  return Page.findOneAndUpdate(
    { key: HOME_KEY },
    {
      $set: {
        key: HOME_KEY,
        name: "Home",
        description: "SkillHub homepage — catalog + CMS platform",
        entity_type: "content",
        status: true,
        is_sort_disabled: true,
      },
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );
}

function applyHomeTag(section, homePage, placement) {
  const idx = (section.pages || []).findIndex((p) => p.page_key === HOME_KEY);
  const existing =
    idx >= 0 && section.pages[idx]?.toObject
      ? section.pages[idx].toObject()
      : idx >= 0
        ? section.pages[idx]
        : {};

  const tag = {
    ...existing,
    page: homePage._id,
    page_key: HOME_KEY,
    sort_order: placement.sort_order,
    status: placement.status !== false,
    section_title: placement.section_title ?? "",
    sub_title: placement.sub_title ?? "",
    in_page_nav_title: placement.in_page_nav_title ?? "",
    section_img_url: placement.section_img_url ?? "",
    section_bg_img: placement.section_bg_img ?? "",
    section_bg_color: placement.section_bg_color ?? null,
    data: placement.data ?? {},
    buttons: placement.buttons ?? [],
    items: placement.items ?? [],
  };

  if (idx >= 0) section.pages[idx] = tag;
  else section.pages.push(tag);
}

async function disableOnHome(homePage, key) {
  const section = await Section.findOne({ key });
  if (!section) return;
  const idx = (section.pages || []).findIndex((p) => p.page_key === HOME_KEY);
  if (idx < 0) return;
  const existing = section.pages[idx].toObject
    ? section.pages[idx].toObject()
    : section.pages[idx];
  section.pages[idx] = {
    ...existing,
    page: homePage._id,
    page_key: HOME_KEY,
    status: false,
  };
  await section.save();
  console.log(`  − disabled ${key} on home`);
}

async function seed() {
  await connectDB();
  console.log("Redesigning homepage around How It Works…");

  const homePage = await ensureHomePage();

  for (const def of SECTION_DEFS) {
    await ensureSection(def);
  }

  await Content.findOneAndUpdate(
    { $or: [{ path: "/" }, { slug: "home" }] },
    {
      $set: {
        name: "SkillHub — Publish pages your team can own",
        title: "SkillHub — Publish pages your team can own",
        path: "/",
        slug: "home",
        description:
          "Publish campaign pages, solution hubs, and showcases from a live CMS — without redeploying. Catalog stays structured; stories stay flexible.",
        status: "active",
        sortOrder: 0,
      },
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );

  for (const key of DISABLE_ON_HOME) {
    await disableOnHome(homePage, key);
  }

  for (const placement of HOME_SECTIONS) {
    const section = await Section.findOne({ key: placement.section_key });
    if (!section) {
      console.warn(`  ! missing ${placement.section_key}`);
      continue;
    }
    applyHomeTag(section, homePage, placement);
    await section.save();
    console.log(`  ✓ ${placement.section_key} (sort ${placement.sort_order})`);
  }

  console.log("Done. Open http://localhost:3001/");
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
