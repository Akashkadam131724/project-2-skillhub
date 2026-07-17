/**
 * Seeds 50 additional SkillHub insight blogs (upsert by slug).
 *
 * Usage:
 *   npm run seed:blogs-batch
 */
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Blog from "../modules/blog/blog.model.js";

function img(src, alt) {
  return `<img src="${src}" alt="${alt}" class="cms-rich-img" />`;
}

const AUTHORS = [
  { name: "Maya Chen", role: "Learning Strategy Lead" },
  { name: "Daniel Okafor", role: "Technology Practice Director" },
  { name: "Priya Nair", role: "Workforce Programs Lead" },
  { name: "Jordan Ellis", role: "Catalog & Content Ops" },
  { name: "Sofia Alvarez", role: "L&D Product Manager" },
  { name: "Amir Hassan", role: "Skills Architecture Lead" },
];

const IMAGES = [
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=82",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=82",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=82",
  "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=82",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=82",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=82",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=82",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=82",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=82",
  "https://images.unsplash.com/photo-1573164713714-d95e4369651d?auto=format&fit=crop&w=1600&q=82",
];

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
];

/** 50 unique blog briefs — title, slug, category, tags, focus paragraphs */
const BRIEFS = [
  {
    title: "How to run a skills inventory without drowning in spreadsheets",
    slug: "skills-inventory-without-spreadsheets",
    category: "skills",
    tags: ["skills", "taxonomy", "operations", "data"],
    focus: "practical inventory design, role sampling, and refresh cadences",
  },
  {
    title: "Role-based learning paths that managers actually sponsor",
    slug: "role-based-paths-managers-sponsor",
    category: "learning strategy",
    tags: ["paths", "managers", "sponsorship", "roles"],
    focus: "co-designing paths with business owners and stop criteria",
  },
  {
    title: "Vendor enablement playbooks for channel and partner teams",
    slug: "vendor-enablement-playbooks",
    category: "partners",
    tags: ["vendors", "partners", "enablement", "catalog"],
    focus: "mapping vendor content into reusable partner journeys",
  },
  {
    title: "Designing micro-credentials that signal real capability",
    slug: "micro-credentials-real-capability",
    category: "credentials",
    tags: ["credentials", "assessment", "signals", "career"],
    focus: "assessment design, evidence packs, and employer recognition",
  },
  {
    title: "Cloud fundamentals for non-engineers: a curriculum map",
    slug: "cloud-fundamentals-non-engineers",
    category: "ai and technology",
    tags: ["cloud", "fundamentals", "curriculum", "literacy"],
    focus: "layered outcomes from awareness to informed decision-making",
  },
  {
    title: "Security awareness that survives phishing simulations",
    slug: "security-awareness-beyond-phishing",
    category: "security",
    tags: ["security", "awareness", "habits", "risk"],
    focus: "habit loops, manager cues, and risk-based targeting",
  },
  {
    title: "Building a course catalog people can search and trust",
    slug: "course-catalog-search-trust",
    category: "catalog",
    tags: ["catalog", "search", "metadata", "ux"],
    focus: "metadata standards, synonyms, and quality gates",
  },
  {
    title: "From LMS reports to capability dashboards executives read",
    slug: "lms-reports-to-capability-dashboards",
    category: "learning strategy",
    tags: ["dashboards", "roi", "executives", "measurement"],
    focus: "leading vs lagging indicators and narrative briefs",
  },
  {
    title: "Onboarding cohorts: what to automate and what to keep human",
    slug: "onboarding-cohorts-automate-human",
    category: "onboarding",
    tags: ["onboarding", "cohorts", "automation", "culture"],
    focus: "automation boundaries and community rituals",
  },
  {
    title: "Industry academies: structuring multi-month learning journeys",
    slug: "industry-academies-multi-month-journeys",
    category: "programs",
    tags: ["academies", "journeys", "industry", "cohorts"],
    focus: "milestones, practice blocks, and sponsor reviews",
  },
  {
    title: "Prompt libraries for L&D teams: governance without friction",
    slug: "prompt-libraries-ld-governance",
    category: "ai and technology",
    tags: ["ai", "prompts", "governance", "productivity"],
    focus: "approved prompts, review loops, and safe sharing",
  },
  {
    title: "How skilling areas should mirror your org chart—and when not to",
    slug: "skilling-areas-vs-org-chart",
    category: "skills",
    tags: ["skilling areas", "taxonomy", "organization", "design"],
    focus: "when domain models beat reporting lines",
  },
  {
    title: "Instructor-led vs self-paced: choosing the right modality mix",
    slug: "ilt-vs-self-paced-modality-mix",
    category: "learning design",
    tags: ["ilt", "self-paced", "modality", "design"],
    focus: "decision trees by skill type and risk",
  },
  {
    title: "Certification paths that reduce exam anxiety and drop-off",
    slug: "certification-paths-reduce-drop-off",
    category: "credentials",
    tags: ["certification", "exams", "practice", "retention"],
    focus: "practice exams, peer study, and pacing",
  },
  {
    title: "Content ops for SkillHub: versioning courses without chaos",
    slug: "content-ops-versioning-courses",
    category: "operations",
    tags: ["content ops", "versioning", "catalog", "qa"],
    focus: "change windows, ownership, and deprecation",
  },
  {
    title: "Manager coaching cards for learning reinforcement",
    slug: "manager-coaching-cards",
    category: "learning strategy",
    tags: ["managers", "coaching", "reinforcement", "habits"],
    focus: "two-minute cards tied to performance moments",
  },
  {
    title: "Accessibility checklists for course authors and vendors",
    slug: "accessibility-checklists-course-authors",
    category: "accessibility",
    tags: ["a11y", "authors", "vendors", "quality"],
    focus: "captions, structure, contrast, and keyboard paths",
  },
  {
    title: "Blended learning calendars that respect busy calendars",
    slug: "blended-learning-calendars",
    category: "programs",
    tags: ["blended", "calendar", "time", "design"],
    focus: "time-boxing practice and async prep",
  },
  {
    title: "Tagging products and courses so discovery actually works",
    slug: "tagging-products-courses-discovery",
    category: "catalog",
    tags: ["tags", "products", "courses", "discovery"],
    focus: "controlled vocabularies and synonym maps",
  },
  {
    title: "Pilot programs: how to kill weak experiments fast",
    slug: "pilot-programs-kill-weak-experiments",
    category: "programs",
    tags: ["pilots", "experiments", "governance", "roi"],
    focus: "success criteria, sample size, and stop rules",
  },
  {
    title: "Writing learning outcomes that assessment can verify",
    slug: "learning-outcomes-assessment-can-verify",
    category: "learning design",
    tags: ["outcomes", "assessment", "verbs", "design"],
    focus: "observable verbs and evidence formats",
  },
  {
    title: "Community of practice playbooks for technical guilds",
    slug: "community-of-practice-tech-guilds",
    category: "culture",
    tags: ["community", "guilds", "practice", "knowledge"],
    focus: "cadence, demos, and knowledge capture",
  },
  {
    title: "Compliance learning that doesn’t feel like a checkbox farm",
    slug: "compliance-learning-beyond-checkboxes",
    category: "compliance",
    tags: ["compliance", "ethics", "scenario", "risk"],
    focus: "scenario design and role-relevant cases",
  },
  {
    title: "Data literacy paths for analysts, PMs, and leaders",
    slug: "data-literacy-paths-roles",
    category: "skills",
    tags: ["data", "literacy", "roles", "paths"],
    focus: "tiered fluency by decision type",
  },
  {
    title: "How to brief a vendor for custom academy content",
    slug: "brief-vendor-custom-academy-content",
    category: "partners",
    tags: ["vendors", "briefs", "academy", "procurement"],
    focus: "outcomes, constraints, and acceptance tests",
  },
  {
    title: "Mobile-first microlearning: when short is actually better",
    slug: "mobile-first-microlearning-when-short-wins",
    category: "learning design",
    tags: ["microlearning", "mobile", "design", "habits"],
    focus: "job aids vs courses and trigger design",
  },
  {
    title: "Career lattices: linking courses to mobility conversations",
    slug: "career-lattices-courses-mobility",
    category: "career",
    tags: ["career", "mobility", "lattices", "skills"],
    focus: "transparent skill gates and manager guides",
  },
  {
    title: "Lab environments that scale without breaking the budget",
    slug: "lab-environments-scale-budget",
    category: "ai and technology",
    tags: ["labs", "cloud", "cost", "practice"],
    focus: "shared sandboxes, quotas, and teardown",
  },
  {
    title: "Feedback loops from course ratings to catalog curation",
    slug: "course-ratings-to-catalog-curation",
    category: "catalog",
    tags: ["ratings", "curation", "quality", "ops"],
    focus: "signal thresholds and retire/promote rules",
  },
  {
    title: "Hybrid classroom facilitation for distributed teams",
    slug: "hybrid-classroom-facilitation",
    category: "learning design",
    tags: ["hybrid", "facilitation", "ilt", "remote"],
    focus: "equity between room and remote learners",
  },
  {
    title: "Skills-based hiring: what L&D should prepare for next",
    slug: "skills-based-hiring-ld-prep",
    category: "talent",
    tags: ["hiring", "skills", "assessments", "talent"],
    focus: "shared language between TA and L&D",
  },
  {
    title: "Publishing campaign pages that stay linked to real courses",
    slug: "campaign-pages-linked-to-courses",
    category: "publishing",
    tags: ["cms", "campaigns", "catalog", "publishing"],
    focus: "CTA hygiene and catalog truth",
  },
  {
    title: "Quarterly learning roadmaps that survive leadership changes",
    slug: "quarterly-learning-roadmaps-survive-change",
    category: "learning strategy",
    tags: ["roadmap", "governance", "priorities", "strategy"],
    focus: "portfolio views and decision logs",
  },
  {
    title: "Peer learning circles: structure that keeps energy high",
    slug: "peer-learning-circles-structure",
    category: "culture",
    tags: ["peer learning", "circles", "facilitation", "retention"],
    focus: "roles, prompts, and celebration rituals",
  },
  {
    title: "Localization of learning: what to translate first",
    slug: "localization-learning-translate-first",
    category: "operations",
    tags: ["localization", "translation", "global", "ops"],
    focus: "priority order for UI, assessments, and media",
  },
  {
    title: "Assessment item banks: writing better multiple-choice items",
    slug: "assessment-item-banks-better-mcq",
    category: "learning design",
    tags: ["assessment", "mcq", "item banks", "quality"],
    focus: "distractors, fairness, and review cycles",
  },
  {
    title: "Partner academies vs internal academies: choose deliberately",
    slug: "partner-vs-internal-academies",
    category: "programs",
    tags: ["academies", "partners", "build vs buy", "strategy"],
    focus: "decision criteria and ownership models",
  },
  {
    title: "Time-to-productivity metrics for technical onboarding",
    slug: "time-to-productivity-technical-onboarding",
    category: "onboarding",
    tags: ["onboarding", "productivity", "engineering", "metrics"],
    focus: "milestones, buddy systems, and baselines",
  },
  {
    title: "Storytelling for L&D: briefs that win executive sponsors",
    slug: "storytelling-ld-executive-sponsors",
    category: "learning strategy",
    tags: ["storytelling", "sponsors", "briefs", "influence"],
    focus: "problem framing and evidence sketches",
  },
  {
    title: "Knowledge base vs courses: stop duplicating the same content",
    slug: "knowledge-base-vs-courses",
    category: "operations",
    tags: ["knowledge base", "courses", "duplication", "ops"],
    focus: "single sources of truth and job aids",
  },
  {
    title: "Inclusive facilitation techniques for mixed-experience cohorts",
    slug: "inclusive-facilitation-mixed-cohorts",
    category: "accessibility",
    tags: ["inclusion", "facilitation", "cohorts", "equity"],
    focus: "participation patterns and psychological safety",
  },
  {
    title: "API literacy for product and support teams",
    slug: "api-literacy-product-support",
    category: "ai and technology",
    tags: ["api", "literacy", "product", "support"],
    focus: "concepts without forcing engineership",
  },
  {
    title: "Retirement plans for outdated courses and certifications",
    slug: "retirement-plans-outdated-courses",
    category: "catalog",
    tags: ["retirement", "catalog", "lifecycle", "ops"],
    focus: "sunset notices, redirects, and archives",
  },
  {
    title: "Learning analytics ethics: what you should never track",
    slug: "learning-analytics-ethics-never-track",
    category: "governance",
    tags: ["ethics", "analytics", "privacy", "governance"],
    focus: "red lines, consent, and purpose limitation",
  },
  {
    title: "Scenario-based learning for customer success teams",
    slug: "scenario-based-learning-customer-success",
    category: "learning design",
    tags: ["scenarios", "customer success", "practice", "design"],
    focus: "branching cases and debrief guides",
  },
  {
    title: "How product launches should trigger learning campaigns",
    slug: "product-launches-trigger-learning-campaigns",
    category: "publishing",
    tags: ["product", "launches", "campaigns", "enablement"],
    focus: "trigger maps from release to enablement",
  },
  {
    title: "Mentorship programs that pair well with formal courses",
    slug: "mentorship-with-formal-courses",
    category: "culture",
    tags: ["mentorship", "courses", "pairing", "growth"],
    focus: "pairing criteria and conversation agendas",
  },
  {
    title: "Budgeting learning programs: fixed cost vs consumption models",
    slug: "budgeting-learning-fixed-vs-consumption",
    category: "operations",
    tags: ["budget", "vendors", "consumption", "finance"],
    focus: "unit economics and utilization forecasts",
  },
  {
    title: "Office hours formats that increase course completion",
    slug: "office-hours-increase-completion",
    category: "programs",
    tags: ["office hours", "completion", "support", "cohorts"],
    focus: "scheduling, themes, and async follow-up",
  },
  {
    title: "Building a SkillHub editorial calendar that compounds",
    slug: "skillhub-editorial-calendar-compounds",
    category: "publishing",
    tags: ["editorial", "calendar", "insights", "publishing"],
    focus: "themes, reuse, and catalog cross-links",
  },
];

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function buildContent(brief, imageUrl) {
  const title = brief.title;
  return `<p>${title} is a practical SkillHub insight for teams building workforce capability at scale. This piece focuses on ${brief.focus}.</p>
${img(imageUrl, title)}
<h2>Why this matters now</h2>
<p>Learning teams are asked to move faster while proving impact. Without a clear operating pattern for ${brief.focus}, programs stall in activity metrics and never reach performance.</p>
<blockquote>Design for the work moment first—then select content, vendors, and measurement.</blockquote>
<h2>A working approach</h2>
<ol>
<li><p><strong>Define the performance moment</strong> — who must do what differently, under what constraints.</p></li>
<li><p><strong>Map evidence</strong> — participation, practice, performance, and outcomes.</p></li>
<li><p><strong>Choose modalities</strong> — courses, labs, coaching, and job aids that produce practice.</p></li>
<li><p><strong>Assign owners</strong> — L&amp;D, managers, and business sponsors with clear stop criteria.</p></li>
</ol>
<h2>Practical checklist</h2>
<ul>
<li><p>Write a one-page brief before buying or building content.</p></li>
<li><p>Pilot with a small cohort and publish leading indicators weekly.</p></li>
<li><p>Retire weak paths quickly; double down where performance lifts.</p></li>
<li><p>Keep catalog metadata honest so campaign pages stay linked to real courses.</p></li>
</ul>
<h2>Common traps</h2>
<ul>
<li><p>Launching content without a manager reinforcement loop.</p></li>
<li><p>Measuring only completions and satisfaction.</p></li>
<li><p>Duplicating the same topic across vendors without a taxonomy.</p></li>
<li><p>Skipping accessibility and localization until after launch.</p></li>
</ul>
<h2>Putting it together</h2>
<p>Use this article as a shared language with sponsors. Start small, instrument the work, and let ${brief.focus} guide the next iteration—not vanity volume.</p>
<p>SkillHub’s catalog and CMS are built so stories, courses, and vendor content stay connected as you scale this pattern across roles and regions.</p>`;
}

function buildBlog(brief, index) {
  const author = AUTHORS[index % AUTHORS.length];
  const featuredImage = IMAGES[index % IMAGES.length];
  const avatar = AVATARS[index % AVATARS.length];
  const publishedAt = new Date(
    Date.UTC(2026, 0, 5 + index, 9, 0, 0)
  );
  const content = buildContent(brief, featuredImage);
  const words = content
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(words / 220));
  const excerpt = `A practical SkillHub guide to ${brief.focus}. Use it to brief sponsors, design pilots, and keep catalog truth connected to publishing.`;

  return {
    title: brief.title,
    slug: brief.slug || slugify(brief.title),
    excerpt: excerpt.slice(0, 500),
    category: brief.category,
    tags: brief.tags.slice(0, 12),
    featuredImage,
    imageAlt: brief.title.slice(0, 180),
    author: {
      name: author.name,
      role: author.role,
      avatar,
    },
    status: "active",
    featured: index < 5,
    publishedAt,
    seoTitle: `${brief.title.slice(0, 50)} | SkillHub Insights`.slice(0, 70),
    metaDescription: excerpt.slice(0, 180),
    content,
    readingTime,
  };
}

async function seed() {
  if (BRIEFS.length !== 50) {
    throw new Error(`Expected 50 briefs, got ${BRIEFS.length}`);
  }

  await connectDB();
  console.log(`Seeding ${BRIEFS.length} additional blogs…`);

  let ok = 0;
  for (let i = 0; i < BRIEFS.length; i += 1) {
    const blog = buildBlog(BRIEFS[i], i);
    await Blog.findOneAndUpdate(
      { slug: blog.slug },
      { $set: blog },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ ${blog.slug}`);
    ok += 1;
  }

  const total = await Blog.countDocuments({ status: "active" });
  console.log(`Done. Upserted ${ok}. Active blogs in DB: ${total}`);
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
