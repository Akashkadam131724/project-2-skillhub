/**
 * Content page at /tabs-showcase — all tab section variants with nested items.
 * Used for section preview screenshots (run capture:tabs-previews after seeding).
 *
 * Usage:
 *   npm run seed:tabs-showcase
 *   npm run capture:tabs-previews
 */
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Content from "../modules/content/content.model.js";
import Page from "../modules/cms/page.model.js";
import Section from "../modules/cms/section.model.js";
import EntityPageSection from "../modules/cms/entity-page-section.model.js";
import { getSectionCatalogMeta } from "../modules/cms/section.catalog.js";
import { btn, item } from "./lib/cms-seed-shared.js";

const IMAGES = {
  discover:
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
  evaluate:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80",
  enroll:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
  measure:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
  selfPaced:
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80",
  liveVirtual:
    "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=1600&q=80",
  blended:
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80",
  cohort:
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
  lnd:
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80",
  practitioner:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=80",
  partner:
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80",
  executive:
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=1600&q=80",
  cloud:
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
  data:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
  security:
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1600&q=80",
  product:
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=80",
};

function buildNestedTabItems(tabsConfig) {
  let order = 0;
  const next = () => order++;
  const items = [];

  for (const tab of tabsConfig) {
    const tabId = new mongoose.Types.ObjectId().toString();
    items.push(
      item(
        {
          _id: tabId,
          item_type: "tab",
          label: tab.label || "",
          value: tab.value || "",
          title: tab.title,
          subtitle: tab.subtitle || "",
          body: tab.body || "",
          image_url: tab.image_url || "",
          href: tab.href || "",
          buttons: tab.buttons || [],
        },
        next()
      )
    );

    for (const child of tab.children || []) {
      items.push(
        item(
          {
            item_type: "item",
            parent_id: tabId,
            title: child.title,
            subtitle: child.subtitle || "",
            body: child.body || "",
            href: child.href || "",
            icon: child.icon || "",
          },
          next()
        )
      );
    }
  }

  return items;
}

const CATALOG_JOURNEY_TABS = buildNestedTabItems([
  {
    label: "Discover",
    value: "Step 1",
    title: "Map vendors and skilling areas",
    subtitle: "Start with structured catalog browsing",
    body: "<p>Filter by industry, vendor, or skill level to find authorized training paths your team can trust.</p>",
    image_url: IMAGES.discover,
    href: "/vendors",
    buttons: [btn("Browse vendors", { variant: "inverse", target_url: "/vendors" })],
    children: [
      {
        title: "Vendor ecosystems",
        subtitle: "Official partner catalogs",
        body: "<p>Each vendor page links products, courses, and certification tracks.</p>",
        href: "/vendors",
      },
      {
        title: "Skilling area filters",
        subtitle: "Cloud, data, security…",
        body: "<p>Narrow discovery by capability area before comparing options.</p>",
        href: "/courses",
      },
    ],
  },
  {
    label: "Evaluate",
    value: "Step 2",
    title: "Compare products and course bundles",
    subtitle: "Outcome-focused learning paths",
    body: "<p>Products group courses, labs, and exam prep so teams evaluate full paths—not isolated classes.</p>",
    image_url: IMAGES.evaluate,
    href: "/products",
    buttons: [btn("View products", { variant: "inverse", target_url: "/products" })],
    children: [
      {
        title: "Role-aligned bundles",
        subtitle: "Paths for job families",
        body: "<p>Compare what each product covers before committing budget.</p>",
        href: "/products",
      },
      {
        title: "Course deep-dives",
        subtitle: "Syllabus and prerequisites",
        body: "<p>Open any course detail page to review objectives and linked vendors.</p>",
        href: "/courses",
      },
    ],
  },
  {
    label: "Enroll",
    value: "Step 3",
    title: "Launch learning with clear next steps",
    subtitle: "From selection to schedule",
    body: "<p>Share catalog links with stakeholders, then track enrollment against the paths you selected.</p>",
    image_url: IMAGES.enroll,
    href: "/courses",
    buttons: [btn("Find a course", { variant: "inverse", target_url: "/courses" })],
    children: [
      {
        title: "Team rollout",
        subtitle: "Assign paths by role",
        body: "<p>Bundle vendor + product links for each cohort before enrollment opens.</p>",
        href: "/courses",
      },
      {
        title: "Live CMS updates",
        subtitle: "Keep pages current",
        body: "<p>Marketing can refresh course copy on live pages without a deploy.</p>",
        href: "/?cms=true",
      },
    ],
  },
  {
    label: "Measure",
    value: "Step 4",
    title: "Report on capability growth",
    subtitle: "Connect training to outcomes",
    body: "<p>Use catalog structure to align completions with skilling areas and certification goals.</p>",
    image_url: IMAGES.measure,
    href: "/blogs",
    buttons: [btn("Read playbooks", { variant: "inverse", target_url: "/blogs" })],
    children: [
      {
        title: "Completion tracking",
        subtitle: "Tie courses to goals",
        body: "<p>Tag paths by skilling area so reporting stays consistent across vendors.</p>",
        href: "/blogs",
      },
      {
        title: "Enablement insights",
        subtitle: "Editorial best practices",
        body: "<p>SkillHub articles cover catalog hygiene and L&amp;D operations.</p>",
        href: "/blogs",
      },
    ],
  },
]);

const DELIVERY_FORMAT_TABS = buildNestedTabItems([
  {
    label: "Self-paced",
    value: "Flexible",
    title: "Learn on your schedule",
    subtitle: "On-demand modules and labs",
    body: "<p>Ideal for practitioners who need to fit training around delivery work and can progress asynchronously.</p>",
    image_url: IMAGES.selfPaced,
    href: "/courses",
    children: [
      {
        title: "Micro-modules",
        subtitle: "15–30 minute units",
        body: "<p>Break complex topics into digestible sessions with clear checkpoints.</p>",
      },
      {
        title: "Hands-on labs",
        subtitle: "Practice environments included",
        body: "<p>Apply concepts in sandbox labs tied to vendor curricula.</p>",
      },
    ],
  },
  {
    label: "Live virtual",
    value: "Instructor-led",
    title: "Real-time classes with experts",
    subtitle: "Scheduled cohort sessions",
    body: "<p>Best when teams need live Q&amp;A, accountability, and a fixed calendar for certification prep.</p>",
    image_url: IMAGES.liveVirtual,
    href: "/courses",
    children: [
      {
        title: "Fixed cohort dates",
        subtitle: "Plan around sprints",
        body: "<p>Block team calendars for multi-day virtual intensives.</p>",
      },
      {
        title: "Certification focus",
        subtitle: "Exam-ready outcomes",
        body: "<p>Pair live instruction with official practice exams.</p>",
      },
    ],
  },
  {
    label: "Blended",
    value: "Hybrid",
    title: "Combine async prep with live labs",
    subtitle: "Flipped classroom model",
    body: "<p>Learners complete fundamentals online, then join live workshops for complex scenarios and review.</p>",
    image_url: IMAGES.blended,
    href: "/products",
    children: [
      {
        title: "Pre-work modules",
        subtitle: "Shared baseline",
        body: "<p>Ensure everyone arrives at live sessions with the same foundation.</p>",
      },
      {
        title: "Workshop deep-dives",
        subtitle: "Expert facilitation",
        body: "<p>Use live time for architecture reviews and troubleshooting.</p>",
      },
    ],
  },
  {
    label: "Enterprise cohort",
    value: "Custom",
    title: "Private programs for your org",
    subtitle: "Tailored paths at scale",
    body: "<p>Design multi-quarter programs mapped to your roles, vendors, and internal certification targets.</p>",
    image_url: IMAGES.cohort,
    href: "/contact-us",
    buttons: [btn("Talk to us", { variant: "inverse", target_url: "/contact-us" })],
    children: [
      {
        title: "Role-based curricula",
        subtitle: "Mapped to job families",
        body: "<p>Align modules to platform, data, and security career ladders.</p>",
      },
      {
        title: "Executive reporting",
        subtitle: "Progress dashboards",
        body: "<p>Share completion and skilling coverage with leadership.</p>",
      },
    ],
  },
]);

const AUDIENCE_TABS = buildNestedTabItems([
  {
    label: "L&D leaders",
    value: "Strategy",
    title: "Curate a trustworthy catalog",
    subtitle: "Governance without bottlenecks",
    body: "<p>Keep vendor relationships, product bundles, and course metadata aligned so teams self-serve with confidence.</p>",
    image_url: IMAGES.lnd,
    href: "/cms",
    children: [
      {
        title: "Catalog governance",
        subtitle: "Retire stale offerings",
        body: "<p>Maintain one source of truth across vendors and skilling areas.</p>",
      },
      {
        title: "Live CMS editing",
        subtitle: "Ship pages without engineering",
        body: "<p>Update marketing copy on entity pages in context.</p>",
        href: "/?cms=true",
      },
    ],
  },
  {
    label: "Practitioners",
    value: "Hands-on",
    title: "Find the next course fast",
    subtitle: "Search by skill and vendor",
    body: "<p>Jump from vendor ecosystems to products and courses with filters that match how you actually learn.</p>",
    image_url: IMAGES.practitioner,
    href: "/courses",
    children: [
      {
        title: "Skill-area browse",
        subtitle: "Cloud, data, security",
        body: "<p>Filter the catalog by the capability you are building next.</p>",
        href: "/courses",
      },
      {
        title: "Certification paths",
        subtitle: "Vendor-authorized tracks",
        body: "<p>Follow official prep sequences instead of one-off classes.</p>",
        href: "/products",
      },
    ],
  },
  {
    label: "Partners",
    value: "Enablement",
    title: "Showcase your training portfolio",
    subtitle: "Vendor-branded pages",
    body: "<p>Each vendor gets a live CMS page to highlight products, courses, and certification paths.</p>",
    image_url: IMAGES.partner,
    href: "/vendors",
    children: [
      {
        title: "Product storytelling",
        subtitle: "Bundle narratives",
        body: "<p>Connect courses to products so buyers see full learning outcomes.</p>",
        href: "/products",
      },
      {
        title: "Co-marketing pages",
        subtitle: "Editable in live mode",
        body: "<p>Refresh campaigns on vendor pages without waiting on dev.</p>",
        href: "/vendor/aws?cms=true",
      },
    ],
  },
  {
    label: "Executives",
    value: "ROI",
    title: "See training as capability investment",
    subtitle: "Structured reporting",
    body: "<p>Align skilling areas to business priorities and track progress against defined career paths.</p>",
    image_url: IMAGES.executive,
    href: "/blogs",
    children: [
      {
        title: "Outcome framing",
        subtitle: "Paths, not classes",
        body: "<p>Report on product and certification completion—not seat counts alone.</p>",
      },
      {
        title: "Industry alignment",
        subtitle: "Sector-specific catalogs",
        body: "<p>Filter training by industry to match regulatory and market needs.</p>",
        href: "/industries",
      },
    ],
  },
]);

const CAREER_PATH_TABS = buildNestedTabItems([
  {
    label: "Cloud engineer",
    value: "Infrastructure",
    title: "Build and operate cloud platforms",
    subtitle: "AWS, Azure, GCP paths",
    body: "<p>Progress from fundamentals through architect-level design patterns and vendor certifications.</p>",
    image_url: IMAGES.cloud,
    href: "/courses",
    children: [
      {
        title: "Foundations",
        subtitle: "Networking + compute basics",
        body: "<p>Start with core services before advanced automation.</p>",
      },
      {
        title: "Architect track",
        subtitle: "Design at scale",
        body: "<p>Multi-region, security, and cost optimization modules.</p>",
      },
    ],
  },
  {
    label: "Data analyst",
    value: "Analytics",
    title: "Turn data into decisions",
    subtitle: "SQL, BI, and ML basics",
    body: "<p>Combine querying, visualization, and introductory machine learning for analytics roles.</p>",
    image_url: IMAGES.data,
    href: "/courses",
    children: [
      {
        title: "Query & model",
        subtitle: "SQL and warehousing",
        body: "<p>Build the data literacy every analyst needs first.</p>",
      },
      {
        title: "Insights delivery",
        subtitle: "Dashboards and storytelling",
        body: "<p>Present findings stakeholders can act on.</p>",
      },
    ],
  },
  {
    label: "Security pro",
    value: "Defense",
    title: "Protect systems and data",
    subtitle: "Zero trust and compliance",
    body: "<p>Cover identity, detection, incident response, and vendor-specific security certifications.</p>",
    image_url: IMAGES.security,
    href: "/courses",
    children: [
      {
        title: "Identity & access",
        subtitle: "IAM fundamentals",
        body: "<p>Modern auth patterns for cloud and hybrid environments.</p>",
      },
      {
        title: "Threat response",
        subtitle: "Detect and contain",
        body: "<p>Runbooks and hands-on blue-team exercises.</p>",
      },
    ],
  },
  {
    label: "Product leader",
    value: "Strategy",
    title: "Lead product with technical depth",
    subtitle: "Platform and delivery skills",
    body: "<p>Blend product strategy with enough technical literacy to partner effectively with engineering.</p>",
    image_url: IMAGES.product,
    href: "/blogs",
    children: [
      {
        title: "Discovery skills",
        subtitle: "Research and prioritization",
        body: "<p>Frameworks for outcome-driven roadmaps.</p>",
      },
      {
        title: "Delivery literacy",
        subtitle: "Agile and platform basics",
        body: "<p>Speak the language of the teams you lead.</p>",
      },
    ],
  },
]);

const SUCCESS_STORY_IMAGES = {
  federal:
    "https://images.unsplash.com/photo-1564760055775-dcfcb245faf2?auto=format&fit=crop&w=1600&q=80",
  healthcare:
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80",
  finance:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
  local:
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1600&q=80",
  technology:
    "https://images.unsplash.com/photo-1518770660439-463619266a5d?auto=format&fit=crop&w=1600&q=80",
};

const SUCCESS_STORIES_ITEMS = [
  item(
    {
      icon: "government",
      label: "Federal Government",
      subtitle: "AWS",
      title:
        "Federal agency upskilled 2,400 engineers on cloud-native architecture with authorized vendor training paths",
      image_url: SUCCESS_STORY_IMAGES.federal,
      href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      bg_color: "linear-gradient(135deg, #2e1064 0%, #4c1d95 50%, #312e81 100%)",
      buttons: [
        btn("Read the story", {
          variant: "outline",
          target_url: "/blogs",
        }),
      ],
    },
    0
  ),
  item(
    {
      icon: "healthcare",
      label: "Healthcare",
      subtitle: "Microsoft",
      title:
        "Regional health system trained clinical IT teams on secure cloud compliance and data platform skills",
      image_url: SUCCESS_STORY_IMAGES.healthcare,
      href: "",
      bg_color: "linear-gradient(135deg, #1e3a5f 0%, #3730a3 55%, #312e81 100%)",
      buttons: [
        btn("Read the story", {
          variant: "outline",
          target_url: "/blogs",
        }),
      ],
    },
    1
  ),
  item(
    {
      icon: "finance",
      label: "Financial Services",
      subtitle: "Cisco",
      title:
        "Global bank upskilled network operations teams on latest routing, security, and automation capabilities",
      image_url: SUCCESS_STORY_IMAGES.finance,
      href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      bg_color: "linear-gradient(135deg, #312e81 0%, #5b21b6 45%, #1e1b4b 100%)",
      buttons: [
        btn("Read the story", {
          variant: "outline",
          target_url: "/blogs",
        }),
      ],
    },
    2
  ),
  item(
    {
      icon: "local",
      label: "State & Local Government",
      subtitle: "Google Cloud",
      title:
        "State IT department launched a unified training catalog for 18 agencies across cloud and cybersecurity",
      image_url: SUCCESS_STORY_IMAGES.local,
      href: "",
      bg_color: "linear-gradient(135deg, #1e40af 0%, #4338ca 50%, #312e81 100%)",
      buttons: [
        btn("Read the story", {
          variant: "outline",
          target_url: "/blogs",
        }),
      ],
    },
    3
  ),
  item(
    {
      icon: "technology",
      label: "Technology",
      subtitle: "SkillHub",
      title:
        "SaaS vendor consolidated 12 partner catalogs into one live CMS with role-based learning paths",
      image_url: SUCCESS_STORY_IMAGES.technology,
      href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      bg_color: "linear-gradient(135deg, #4c1d95 0%, #6366f1 50%, #312e81 100%)",
      buttons: [
        btn("Read the story", {
          variant: "outline",
          target_url: "/cms-preview",
        }),
      ],
    },
    4
  ),
];

const PLACEMENTS = [
  { section_key: "in_page_nav", sort_order: 0 },
  {
    section_key: "hero_centered",
    sort_order: 1,
    in_page_nav_title: "Overview",
    section_title: "Tabs section showcase",
    sub_title:
      "Five tab layout variants — vertical, horizontal, underline, and success stories — each with meaningful sample content for CMS preview screenshots.",
    buttons: [
      btn("Edit in CMS mode", { target_url: "/tabs-showcase?cms=true" }),
      btn("Section library", {
        variant: "secondary",
        target_url: "/cms/sections",
      }),
    ],
  },
  {
    section_key: "feature_tabs",
    sort_order: 2,
    in_page_nav_title: "Vertical",
    section_title: "Catalog journey — vertical tabs",
    sub_title:
      "The classic sidebar layout: each tab shows a preview panel plus optional child cards underneath.",
    items: CATALOG_JOURNEY_TABS,
  },
  {
    section_key: "tabs_vertical",
    sort_order: 3,
    in_page_nav_title: "Vertical alt",
    section_title: "Training delivery formats",
    sub_title:
      "Same vertical interaction pattern — useful when you want delivery-mode or program-type grouping.",
    items: DELIVERY_FORMAT_TABS,
  },
  {
    section_key: "tabs_horizontal",
    sort_order: 4,
    in_page_nav_title: "Horizontal",
    section_title: "Who SkillHub serves",
    sub_title:
      "Horizontal pill tabs keep category labels visible in a compact row — ideal for audience or persona switching.",
    items: AUDIENCE_TABS,
  },
  {
    section_key: "tabs_underline",
    sort_order: 5,
    in_page_nav_title: "Underline",
    section_title: "Popular career paths",
    sub_title:
      "Underline tabs suit editorial pages where a lighter tab chrome keeps focus on narrative content.",
    items: CAREER_PATH_TABS,
  },
  {
    section_key: "tabs_success_stories",
    sort_order: 6,
    in_page_nav_title: "Success stories",
    section_title: "Client Success Stories: How We Empower Teams",
    sub_title: "",
    items: SUCCESS_STORIES_ITEMS,
  },
  {
    section_key: "cta_band",
    sort_order: 7,
    in_page_nav_title: "Try it",
    section_title: "Add tabs to any content page",
    sub_title:
      "Pick a tab variant from the section library, map it on a template or content page, then nest child cards under each tab in the CMS editor.",
    buttons: [
      btn("Open section library", { target_url: "/cms/sections?category=tabs" }),
      btn("Homepage tabs", {
        variant: "secondary",
        target_url: "/",
      }),
    ],
  },
];

const SECTION_KEYS = [
  "in_page_nav",
  "hero_centered",
  "feature_tabs",
  "tabs_vertical",
  "tabs_horizontal",
  "tabs_underline",
  "tabs_success_stories",
  "cta_band",
];

async function ensureSection(key) {
  const catalog = getSectionCatalogMeta(key) || {};
  let section = await Section.findOne({ key });
  if (!section) {
    section = await Section.create({
      key,
      name: key
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      description: "",
      status: true,
      category: catalog.category || "",
      tags: catalog.tags || [],
      content_scope: "page",
    });
    console.log(`  + section ${key}`);
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
  console.log("Seeding tabs showcase content page…");

  await ensureContentPage();

  const sectionByKey = new Map();
  for (const key of SECTION_KEYS) {
    sectionByKey.set(key, await ensureSection(key));
  }

  const content = await Content.findOneAndUpdate(
    { path: "/tabs-showcase" },
    {
      $set: {
        path: "/tabs-showcase",
        slug: "tabs-showcase",
        name: "Tabs Showcase",
        description:
          "Demonstrates all tab section variants with nested child items — used for CMS section preview screenshots.",
        status: "active",
        sortOrder: 6,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );

  await replaceExtras("content", content._id, PLACEMENTS, sectionByKey);

  const tabSections = PLACEMENTS.filter((p) =>
    ["feature_tabs", "tabs_vertical", "tabs_horizontal", "tabs_underline", "tabs_success_stories"].includes(
      p.section_key
    )
  );
  console.log(
    `  ✓ /tabs-showcase (${PLACEMENTS.length} sections, ${tabSections.length} tab variants) — ${content._id}`
  );
  console.log("Done. Open http://localhost:3001/tabs-showcase");
  console.log("Capture previews: npm run capture:tabs-previews");
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("Tabs showcase seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
