/**
 * Research-inspired modern sections + pages (2025/26 SaaS / Awwwards patterns):
 *   orbit_hero, metric_rail, feature_tabs, card_stack, pricing_tiers, masonry_quotes
 *
 * Pages (new sections only):
 *   /platform
 *   /pricing
 *   /showcase
 *   /launch
 *
 * Usage:
 *   npm run seed:trend-pages
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

const NEW_SECTIONS = [
  {
    key: "orbit_hero",
    name: "Orbit Hero",
    description: "SaaS hero with badge, dual CTA, and browser product frame",
    content_scope: "page",
    status: true,
  },
  {
    key: "metric_rail",
    name: "Metric Rail",
    description: "Social-proof metric strip",
    content_scope: "page",
    status: true,
  },
  {
    key: "feature_tabs",
    name: "Feature Tabs",
    description: "Tabbed feature list with live preview panel",
    content_scope: "page",
    status: true,
  },
  {
    key: "card_stack",
    name: "Card Stack",
    description: "Sticky stacking cards on scroll",
    content_scope: "page",
    status: true,
  },
  {
    key: "pricing_tiers",
    name: "Pricing Tiers",
    description: "Three-tier pricing with featured plan",
    content_scope: "page",
    status: true,
  },
  {
    key: "masonry_quotes",
    name: "Masonry Quotes",
    description: "Masonry wall of customer quotes",
    content_scope: "page",
    status: true,
  },
];

async function ensureSection(def) {
  const catalog = getSectionCatalogMeta(def.key);
  let section = await Section.findOne({ key: def.key });
  if (!section) {
    section = await Section.create({
      ...def,
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

const PRICING_ITEMS = [
  item(
    {
      title: "Starter",
      value: "$49",
      subtitle: "/seat mo",
      label: "",
      href: "/get-started",
      icon: "Start free",
      body: "Role paths<br>Live labs<br>Email support<br>Basic dashboards",
    },
    0
  ),
  item(
    {
      title: "Growth",
      value: "$99",
      subtitle: "/seat mo",
      label: "popular",
      href: "/get-started",
      icon: "Start trial",
      body: "Everything in Starter<br>Dedicated facilitator<br>Manager readouts<br>SSO<br>Priority support",
    },
    1
  ),
  item(
    {
      title: "Enterprise",
      value: "Custom",
      subtitle: "",
      label: "",
      href: "/enterprise",
      icon: "Talk to sales",
      body: "Multi-region cohorts<br>Custom curricula<br>Success partner<br>Security review<br>SLA",
    },
    2
  ),
];

const QUOTES = [
  item(
    {
      body: "<p>We replaced a year of scattered courses with one coherent path — managers finally see progress.</p>",
      subtitle: "Elena M.",
      value: "VP L&D · Global bank",
      image_url:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    },
    0
  ),
  item(
    {
      body: "<p>The sticky product walkthrough on their site matches how the platform actually feels — clear and fast.</p>",
      subtitle: "James K.",
      value: "Head of Engineering",
      image_url:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    },
    1
  ),
  item(
    {
      body: "<p>Pricing was honest. The Growth plan paid for itself in one pilot cohort.</p>",
      subtitle: "Priya S.",
      value: "Transformation lead",
      image_url:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    },
    2
  ),
  item(
    {
      body: "<p>Feature tabs made it easy to brief executives without a 40-slide deck.</p>",
      subtitle: "Marcus T.",
      value: "CTO",
      image_url:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    },
    3
  ),
  item(
    {
      body: "<p>Our security track went from awareness quizzes to real pipeline habits in six weeks.</p>",
      subtitle: "Aisha R.",
      value: "CISO office",
      image_url:
        "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=200&q=80",
    },
    4
  ),
  item(
    {
      body: "<p>Metric rail on the homepage is what sold finance — numbers we could verify.</p>",
      subtitle: "Noah P.",
      value: "Program owner",
      image_url:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    5
  ),
];

const PLATFORM = [
  {
    section_key: "orbit_hero",
    sort_order: 0,
    section_title: "The learning platform teams actually finish",
    sub_title:
      "Role paths, live labs, and leader dashboards in one product — built like the SaaS tools your engineers already love.",
    section_img_url:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=80",
    data: {
      label: "New · SkillHub Platform 3.0",
      body: "<p>Inspired by Launch UI / modern SaaS heroes — product frame first.</p>",
    },
    buttons: [
      btn("Start free trial", { target_url: "/get-started", sort_order: 0 }),
      btn("View pricing", {
        variant: "secondary",
        target_url: "/pricing",
        sort_order: 1,
      }),
    ],
  },
  {
    section_key: "metric_rail",
    sort_order: 1,
    section_title: "Trusted worldwide",
    items: [
      item({ value: "8.5k+", label: "Learners / year" }, 0),
      item({ value: "120+", label: "Enterprise teams" }, 1),
      item({ value: "99.9%", label: "Lab uptime" }, 2),
      item({ value: "4.9", label: "Facilitator rating" }, 3),
    ],
  },
  {
    section_key: "feature_tabs",
    sort_order: 2,
    section_title: "Everything in one workspace",
    sub_title: "Tab through the product surfaces — no flat screenshots.",
    items: [
      item(
        {
          value: "Paths",
          title: "Role-aligned journeys",
          subtitle: "Mapped to real work",
          body: "<p>Architects, analysts, and defenders each get a path that ends in delivery proof.</p>",
          image_url:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
        },
        0
      ),
      item(
        {
          value: "Labs",
          title: "Hands-on environments",
          subtitle: "Practice that sticks",
          body: "<p>Sandboxed clouds and tooling that mirror Monday morning work.</p>",
          image_url:
            "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
        },
        1
      ),
      item(
        {
          value: "Signals",
          title: "Leader dashboards",
          subtitle: "Not vanity completion",
          body: "<p>Skill signals, adoption, and readiness your executives will open.</p>",
          image_url:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
        },
        2
      ),
      item(
        {
          value: "Coach",
          title: "Facilitator network",
          subtitle: "Practitioners on call",
          body: "<p>Office hours and architecture reviews between live sessions.</p>",
          image_url:
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
        },
        3
      ),
    ],
  },
  {
    section_key: "card_stack",
    sort_order: 3,
    section_title: "Scroll the product story",
    sub_title: "Sticky card stack — an Awwwards-favorite interaction pattern.",
    items: [
      item(
        {
          value: "01",
          title: "Diagnose the gap",
          subtitle: "Roles & milestones",
          body: "<p>Map what people must ship next quarter — not a generic catalog browse.</p>",
          image_url:
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80",
        },
        0
      ),
      item(
        {
          value: "02",
          title: "Assign the path",
          subtitle: "Cohorts that move",
          body: "<p>Launch a pilot in days with labs, coaches, and clear success metrics.</p>",
          image_url:
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80",
        },
        1
      ),
      item(
        {
          value: "03",
          title: "Prove the lift",
          subtitle: "Evidence for scale",
          body: "<p>Readouts leaders trust — then expand to the next wave of teams.</p>",
          image_url:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80",
        },
        2
      ),
      item(
        {
          value: "04",
          title: "Scale globally",
          subtitle: "Multi-hub delivery",
          body: "<p>Same quality across regions with local facilitators and shared ops.</p>",
          image_url:
            "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=80",
        },
        3
      ),
    ],
  },
  {
    section_key: "pricing_tiers",
    sort_order: 4,
    section_title: "Simple pricing that scales",
    sub_title: "Standard SaaS three-tier layout with a featured Growth plan.",
    items: PRICING_ITEMS,
  },
  {
    section_key: "masonry_quotes",
    sort_order: 5,
    section_title: "Teams that shipped with us",
    sub_title: "Masonry quote wall — volume of social proof.",
    items: QUOTES,
  },
];

const PRICING_PAGE = [
  {
    section_key: "orbit_hero",
    sort_order: 0,
    section_title: "Pricing built for pilots and fleets",
    sub_title:
      "Start with a cohort. Scale when the readout proves value — no year-long RFP required.",
    section_img_url:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1800&q=80",
    data: { label: "Transparent plans" },
    buttons: [
      btn("Compare plans", { target_url: "#", sort_order: 0 }),
      btn("Talk to sales", {
        variant: "secondary",
        target_url: "/enterprise",
        sort_order: 1,
      }),
    ],
  },
  {
    section_key: "pricing_tiers",
    sort_order: 1,
    section_title: "Choose your plan",
    sub_title: "Annual billing available — ask us for savings.",
    items: PRICING_ITEMS,
  },
  {
    section_key: "feature_tabs",
    sort_order: 2,
    section_title: "What’s included",
    items: [
      item(
        {
          value: "All",
          title: "Shared foundation",
          subtitle: "Every plan",
          body: "<p>Paths, labs, and basic analytics ship on Starter and above.</p>",
          image_url:
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
        },
        0
      ),
      item(
        {
          value: "Growth",
          title: "Facilitation & SSO",
          subtitle: "Most teams",
          body: "<p>Dedicated coaches, manager reports, and enterprise login.</p>",
          image_url:
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80",
        },
        1
      ),
      item(
        {
          value: "Ent",
          title: "Global & custom",
          subtitle: "Strategic accounts",
          body: "<p>Multi-region ops, custom curricula, and security reviews.</p>",
          image_url:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
        },
        2
      ),
    ],
  },
  {
    section_key: "metric_rail",
    sort_order: 3,
    section_title: "By the numbers",
    items: [
      item({ value: "14d", label: "Typical pilot launch" }, 0),
      item({ value: "3.2×", label: "Faster competency" }, 1),
      item({ value: "92%", label: "Would renew" }, 2),
      item({ value: "0", label: "Vanity metrics" }, 3),
    ],
  },
  {
    section_key: "masonry_quotes",
    sort_order: 4,
    section_title: "What buyers say",
    items: QUOTES.slice(0, 4),
  },
];

const SHOWCASE = [
  {
    section_key: "orbit_hero",
    sort_order: 0,
    section_title: "Interaction patterns that feel premium",
    sub_title:
      "A living showcase of sticky stacks, feature tabs, and metric rails — patterns winning awards in 2025–26.",
    section_img_url:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1800&q=80",
    data: { label: "Design system · Showcase" },
    buttons: [
      btn("Explore platform", { target_url: "/platform", sort_order: 0 }),
    ],
  },
  {
    section_key: "card_stack",
    sort_order: 1,
    section_title: "Sticky card stack",
    sub_title: "Scroll — cards pin, scale, and stack like Awwwards portfolios.",
    items: [
      item(
        {
          value: "Motion",
          title: "Purpose-driven, not noisy",
          body: "<p>One intentional interaction per section — the 2026 motion rule.</p>",
          image_url:
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
        },
        0
      ),
      item(
        {
          value: "Layout",
          title: "Asymmetry with structure",
          body: "<p>Borrowed from bento and sticky-grid research — clarity over clutter.</p>",
          image_url:
            "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1000&q=80",
        },
        1
      ),
      item(
        {
          value: "Proof",
          title: "Social proof that scales",
          body: "<p>Metric rails and masonry quotes replace logo soup alone.</p>",
          image_url:
            "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80",
        },
        2
      ),
    ],
  },
  {
    section_key: "feature_tabs",
    sort_order: 2,
    section_title: "Tabbed product preview",
    items: [
      item(
        {
          value: "UI",
          title: "Browser chrome frame",
          subtitle: "Product credibility",
          body: "<p>Heroes show the product, not abstract gradients.</p>",
          image_url:
            "https://images.unsplash.com/photo-1498050108023-c34155e21af1?auto=format&fit=crop&w=1600&q=80",
        },
        0
      ),
      item(
        {
          value: "UX",
          title: "Clickable feature stories",
          subtitle: "Scan then dive",
          body: "<p>Tabs let buyers self-serve the story that matters to them.</p>",
          image_url:
            "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1600&q=80",
        },
        1
      ),
      item(
        {
          value: "Brand",
          title: "Theme-aware ink & brand",
          subtitle: "No purple defaults",
          body: "<p>Colors follow your CMS theme tokens.</p>",
          image_url:
            "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=1600&q=80",
        },
        2
      ),
    ],
  },
  {
    section_key: "metric_rail",
    sort_order: 3,
    section_title: "Pattern library stats",
    items: [
      item({ value: "6", label: "New section types" }, 0),
      item({ value: "4", label: "Trend pages" }, 1),
      item({ value: "0", label: "GSAP dependency" }, 2),
      item({ value: "100%", label: "CMS editable" }, 3),
    ],
  },
  {
    section_key: "masonry_quotes",
    sort_order: 4,
    section_title: "Reactions",
    items: QUOTES,
  },
];

const LAUNCH = [
  {
    section_key: "orbit_hero",
    sort_order: 0,
    section_title: "Launch week, ready to ship",
    sub_title:
      "A conversion-ready landing composition: hero → metrics → stack → pricing → quotes.",
    section_img_url:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1800&q=80",
    data: { label: "Launch kit" },
    buttons: [
      btn("Get started", { target_url: "/get-started", sort_order: 0 }),
      btn("See platform", {
        variant: "secondary",
        target_url: "/platform",
        sort_order: 1,
      }),
    ],
  },
  {
    section_key: "metric_rail",
    sort_order: 1,
    section_title: "Launch signals",
    items: [
      item({ value: "2w", label: "To first cohort" }, 0),
      item({ value: "40", label: "Pilot seats" }, 1),
      item({ value: "1", label: "Success metric" }, 2),
      item({ value: "∞", label: "Room to scale" }, 3),
    ],
  },
  {
    section_key: "card_stack",
    sort_order: 2,
    section_title: "Your launch sequence",
    items: [
      item(
        {
          value: "Day 1",
          title: "Discovery",
          body: "<p>Align on outcomes and the smallest path that proves them.</p>",
          image_url:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80",
        },
        0
      ),
      item(
        {
          value: "Week 1",
          title: "Pilot live",
          body: "<p>Cohort invites, labs online, facilitators booked.</p>",
          image_url:
            "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80",
        },
        1
      ),
      item(
        {
          value: "Week 6",
          title: "Readout",
          body: "<p>Evidence, decisions, and a scale plan for the board.</p>",
          image_url:
            "https://images.unsplash.com/photo-1542744173-8e2bd2371532?auto=format&fit=crop&w=1000&q=80",
        },
        2
      ),
    ],
  },
  {
    section_key: "pricing_tiers",
    sort_order: 3,
    section_title: "Pick a launch plan",
    items: PRICING_ITEMS,
  },
  {
    section_key: "masonry_quotes",
    sort_order: 4,
    section_title: "Launch partners",
    items: QUOTES.slice(0, 3),
  },
];

async function seed() {
  await connectDB();
  await ensureContentPage();

  console.log("Ensuring trend section types…");
  const sectionByKey = new Map();
  for (const def of NEW_SECTIONS) {
    sectionByKey.set(def.key, await ensureSection(def));
  }

  const pages = [
    {
      doc: await ensureContent({
        name: "Platform",
        slug: "platform",
        path: "/platform",
        description: "SaaS platform landing — orbit hero, tabs, stack, pricing.",
        status: "active",
        sortOrder: 200,
      }),
      label: "Platform",
      placements: PLATFORM,
    },
    {
      doc: await ensureContent({
        name: "Pricing",
        slug: "pricing",
        path: "/pricing",
        description: "Modern pricing page with tiers and social proof.",
        status: "active",
        sortOrder: 210,
      }),
      label: "Pricing",
      placements: PRICING_PAGE,
    },
    {
      doc: await ensureContent({
        name: "Showcase",
        slug: "showcase",
        path: "/showcase",
        description: "UI pattern showcase — stacks, tabs, metrics, quotes.",
        status: "active",
        sortOrder: 220,
      }),
      label: "Showcase",
      placements: SHOWCASE,
    },
    {
      doc: await ensureContent({
        name: "Launch",
        slug: "launch",
        path: "/launch",
        description: "Launch-week landing composition from trend components.",
        status: "active",
        sortOrder: 230,
      }),
      label: "Launch",
      placements: LAUNCH,
    },
  ];

  for (const { doc, label, placements } of pages) {
    console.log(`Mapping ${label}…`);
    await replaceExtras("content", doc._id, placements, sectionByKey);
    console.log(`  ${placements.length} placements`);
  }

  console.log("\nDone.");
  console.log("  http://localhost:3001/platform");
  console.log("  http://localhost:3001/pricing");
  console.log("  http://localhost:3001/showcase");
  console.log("  http://localhost:3001/launch");

  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("trend-pages seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
