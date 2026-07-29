/**
 * Backfill EntityPageSection for Content URLs that have 0 placements.
 *
 * 1. Company / nav pages (careers, awards, campaign, subscription)
 * 2. /sections/* showcase (same stacks as section library previews)
 * 3. Runs each 07-showcase seed (how-it-works, odyssey, …)
 * 4. Generic hero + overview + CTA for anything still empty (except `/` home)
 *
 *   npm run seed:content-missing-eps
 *   SEED_SAFE=1 npm run seed:content-missing-eps
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import connectDB from "../../../config/db.js";
import Content from "../../../modules/content/content.model.js";
import EntityPageSection from "../../../modules/cms/entity-page-section.model.js";
import {
  SECTION_CATEGORIES,
  CATEGORY_SLUG,
  buildIndexPagePlacements,
  buildCategoryPagePlacements,
  sectionsInCategory,
  SECTION_NAMES,
} from "../../lib/section-showcase-samples.js";
import {
  btn,
  item,
  ensureContentPageTemplate,
  ensureContent,
  applyContentPlacements,
  genericPlacements,
  loadSectionsByKeys,
} from "../../lib/content-page-seed-helpers.js";
import { replaceEntityExtras } from "../../lib/replace-entity-extras.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVER_ROOT = path.resolve(__dirname, "../../../..");

const SHOWCASE_SCRIPTS = [
  "07-showcase/how-it-works.seed.js",
  "07-showcase/catalog-guide.seed.js",
  "07-showcase/learning-campus.seed.js",
  "07-showcase/odyssey.seed.js",
  "07-showcase/cms-preview.seed.js",
  "07-showcase/tabs-showcase.seed.js",
  "07-showcase/modern-pages.seed.js",
  "07-showcase/trend-pages.seed.js",
  "07-showcase/squarespace-inspired.seed.js",
];

const CAREERS_PLACEMENTS = [
  { section_key: "in_page_nav", sort_order: 0 },
  {
    section_key: "hero_centered",
    sort_order: 1,
    section_title: "Build learning programs that ship",
    sub_title:
      "Join SkillHub — design curricula, run cohorts, and help enterprises close skill gaps.",
    in_page_nav_title: "Careers",
    buttons: [
      btn("Open roles", { target_url: "/contact-us", sort_order: 0 }),
      btn("About us", {
        variant: "secondary",
        target_url: "/about-us",
        sort_order: 1,
      }),
    ],
  },
  {
    section_key: "overview",
    sort_order: 2,
    section_title: "How we hire",
    in_page_nav_title: "Culture",
    data: {
      body: "<p>We look for people who blend learning design, technical depth, and program operations. Remote-friendly teams across customer success, facilitation, and engineering.</p>",
    },
  },
  {
    section_key: "why_choose",
    sort_order: 3,
    section_title: "Why SkillHub",
    in_page_nav_title: "Benefits",
    items: [
      item(
        {
          title: "Impact at scale",
          body: "<p>Work on programs that reach thousands of learners across global enterprises.</p>",
        },
        0
      ),
      item(
        {
          title: "Craft & autonomy",
          body: "<p>Own outcomes with a team that values clear writing, sharp facilitation, and measurable delivery.</p>",
        },
        1
      ),
      item(
        {
          title: "Growth paths",
          body: "<p>Certifications, conference budget, and internal learning credits.</p>",
        },
        2
      ),
    ],
  },
  {
    section_key: "faq",
    sort_order: 4,
    section_title: "Hiring FAQ",
    items: [
      item(
        {
          title: "Remote work?",
          body: "<p>Yes — many roles are remote-first with optional hub days.</p>",
        },
        0
      ),
      item(
        {
          title: "How to apply?",
          body: "<p>Reach out via Contact — include your focus area and portfolio or LinkedIn.</p>",
        },
        1
      ),
    ],
  },
  {
    section_key: "cta_band",
    sort_order: 5,
    section_title: "Ready to talk?",
    buttons: [btn("Contact recruiting", { target_url: "/contact-us" })],
  },
];

const AWARDS_PLACEMENTS = [
  { section_key: "in_page_nav", sort_order: 0 },
  {
    section_key: "hero_minimal",
    sort_order: 1,
    section_title: "Awards & recognition",
    sub_title: "Industry recognition for delivery quality and learner outcomes.",
    in_page_nav_title: "Awards",
  },
  {
    section_key: "stats",
    sort_order: 2,
    section_title: "By the numbers",
    items: [
      item({ label: "Enterprise programs", value: "240+" }, 0),
      item({ label: "Learner NPS", value: "72" }, 1),
      item({ label: "Partner awards", value: "18" }, 2),
    ],
  },
  {
    section_key: "partners_marquee",
    sort_order: 3,
    section_title: "Trusted by leading vendors",
  },
  {
    section_key: "customer_testimonials",
    sort_order: 4,
    section_title: "What customers say",
  },
  {
    section_key: "cta_band",
    sort_order: 5,
    section_title: "See our programs in action",
    buttons: [btn("Explore courses", { target_url: "/courses" })],
  },
];

const CAMPAIGN_PLACEMENTS = [
  { section_key: "in_page_nav", sort_order: 0 },
  {
    section_key: "hero_media",
    sort_order: 1,
    section_title: "Microsoft Skill Fest",
    sub_title:
      "Limited-time learning sprint — cloud, security, and AI workshops with Microsoft experts.",
    in_page_nav_title: "Skill Fest",
    items: [
      item({
        title: "Microsoft Skill Fest",
        subtitle: "Hands-on labs · certification prep · office hours",
        image_url:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
      }),
    ],
  },
  {
    section_key: "feature_spotlight",
    sort_order: 2,
    section_title: "What’s included",
    in_page_nav_title: "Tracks",
    items: [
      item(
        {
          title: "Azure fundamentals",
          body: "<p>Architecture, identity, and cost governance labs.</p>",
        },
        0
      ),
      item(
        {
          title: "Security & compliance",
          body: "<p>Zero-trust workshops aligned to Microsoft Secure.</p>",
        },
        1
      ),
      item(
        {
          title: "Copilot & AI",
          body: "<p>Responsible AI patterns for enterprise teams.</p>",
        },
        2
      ),
    ],
  },
  {
    section_key: "cta_band",
    sort_order: 3,
    section_title: "Register your team",
    buttons: [
      btn("Get started", { target_url: "/get-started" }),
      btn("Contact us", {
        variant: "secondary",
        target_url: "/contact-us",
        sort_order: 1,
      }),
    ],
  },
];

const SUBSCRIPTION_PLACEMENTS = [
  { section_key: "in_page_nav", sort_order: 0 },
  {
    section_key: "hero_centered",
    sort_order: 1,
    section_title: "SkillHub subscription",
    sub_title:
      "Flexible access to catalogs, labs, and advisor hours for growing teams.",
    in_page_nav_title: "Plans",
  },
  {
    section_key: "overview",
    sort_order: 2,
    section_title: "What you get",
    data: {
      body: "<p>Roll out learning paths by role, track adoption, and add instructor-led boosts when you need them — without rebuilding your stack each quarter.</p>",
    },
  },
  {
    section_key: "key_benefits",
    sort_order: 3,
    section_title: "Plan highlights",
    items: [
      item({ title: "Catalog access", body: "<p>Thousands of courses across vendors.</p>" }, 0),
      item({ title: "Usage analytics", body: "<p>Team dashboards and skill coverage.</p>" }, 1),
      item({ title: "Advisor hours", body: "<p>Quarterly planning with learning strategists.</p>" }, 2),
    ],
  },
  {
    section_key: "faq",
    sort_order: 4,
    section_title: "Subscription FAQ",
    items: [
      item({
        title: "Can we pilot first?",
        body: "<p>Yes — start with a single business unit and expand after a 90-day review.</p>",
      }),
    ],
  },
  {
    section_key: "cta_band",
    sort_order: 5,
    section_title: "Compare enterprise options",
    buttons: [btn("Talk to sales", { target_url: "/contact-us" })],
  },
];

const COMPANY_PAGES = [
  {
    path: "/company/careers",
    slug: "company-careers",
    name: "Careers",
    description: "Join SkillHub — open roles and life at the company.",
    sortOrder: 32,
    placements: CAREERS_PLACEMENTS,
  },
  {
    path: "/company/awards",
    slug: "company-awards",
    name: "Company Awards",
    description: "Awards and recognition for SkillHub programs.",
    sortOrder: 33,
    placements: AWARDS_PLACEMENTS,
  },
  {
    path: "/campaign/microsoft/skill-fest",
    slug: "campaign-microsoft-skill-fest",
    name: "Microsoft Skill Fest",
    description: "Microsoft Skill Fest campaign landing page.",
    sortOrder: 34,
    placements: CAMPAIGN_PLACEMENTS,
  },
  {
    path: "/subscription",
    slug: "subscription",
    name: "Subscription",
    description: "SkillHub subscription and team access plans.",
    sortOrder: 35,
    placements: SUBSCRIPTION_PLACEMENTS,
  },
];

function runChildSeed(scriptRelative) {
  const scriptPath = path.join(SERVER_ROOT, "src/seed/steps", scriptRelative);
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      ["--env-file=.env", scriptPath],
      {
        cwd: SERVER_ROOT,
        stdio: "inherit",
        env: process.env,
      }
    );
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${scriptRelative} exited ${code}`));
    });
  });
}

async function seedSectionsContentPaths() {
  const keys = new Set(["in_page_nav", "hero_centered", "cta_band"]);
  for (const cat of SECTION_CATEGORIES) {
    for (const k of sectionsInCategory(cat.key)) keys.add(k);
  }
  const sectionByKey = await loadSectionsByKeys([...keys]);

  const index = await ensureContent({
    path: "/sections",
    slug: "sections",
    name: "Section library",
    description: "Index of CMS section categories.",
    status: "active",
    sortOrder: 15,
  });
  const indexPlacements = buildIndexPagePlacements();
  await replaceEntityExtras(EntityPageSection, {
    pageKey: "content",
    entityId: index._id,
    placements: indexPlacements,
    sectionByKey,
    pageTagId: null,
  });
  console.log(`  ✓ /sections (${indexPlacements.length} placements)`);

  for (const cat of SECTION_CATEGORIES) {
    const slug = CATEGORY_SLUG[cat.key] || cat.key;
    const pagePath = `/sections/${slug}`;
    const doc = await ensureContent({
      path: pagePath,
      slug: `sections-${slug}`,
      name: `${cat.name} sections`,
      description: `Live previews of ${cat.name} section layouts.`,
      status: "active",
      sortOrder: 16,
    });
    const placements = buildCategoryPagePlacements(cat.key);
    await replaceEntityExtras(EntityPageSection, {
      pageKey: "content",
      entityId: doc._id,
      placements,
      sectionByKey,
      pageTagId: null,
    });
    console.log(`  ✓ ${pagePath} (${placements.length} placements)`);
  }
}

async function countContentEps(entityId) {
  return EntityPageSection.countDocuments({
    page_key: "content",
    entity_id: entityId,
    page_tag_id: null,
  });
}

async function seed() {
  await connectDB();
  console.log("Backfilling missing Content EntityPageSection rows…\n");

  await ensureContentPageTemplate();

  console.log("— Company & utility pages —");
  for (const def of COMPANY_PAGES) {
    const doc = await ensureContent({
      name: def.name,
      slug: def.slug,
      path: def.path,
      description: def.description,
      status: "active",
      sortOrder: def.sortOrder,
    });
    const n = await applyContentPlacements(doc, def.placements);
    console.log(`  ✓ ${def.path} (${n} placements)`);
  }

  console.log("\n— /sections/* content mirrors —");
  await seedSectionsContentPaths();

  console.log("\n— Showcase demo seeds —");
  for (const script of SHOWCASE_SCRIPTS) {
    console.log(`\n>> ${script}`);
    await runChildSeed(script);
  }

  console.log("\n— Generic fallback for any remaining empty content pages —");
  const all = await Content.find({ path: { $ne: "/" } }).lean();
  let filled = 0;
  for (const c of all) {
    const eps = await countContentEps(c._id);
    if (eps > 0) continue;
    const placements = genericPlacements(c);
    const doc = await Content.findById(c._id);
    await applyContentPlacements(doc, placements);
    console.log(`  ✓ ${c.path} (generic ${placements.length})`);
    filled += 1;
  }
  if (!filled) console.log("  (none — all non-home content pages have sections)");

  console.log("\nDone.");
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("content-missing-eps failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
