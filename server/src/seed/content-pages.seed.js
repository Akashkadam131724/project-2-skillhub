/**
 * Seeds dummy CMS layouts for Content pages:
 *   /about-us
 *   /our-team
 *   /solutions
 *   /get-started
 *   /cloud-academy
 *   /security-lab
 *   /data-academy
 *   /enterprise
 *
 * Uses entity-only extras (page_tag_id: null) on Page key `content`,
 * reuses global sections where useful, and ensures modern section types exist.
 *
 * Usage:
 *   npm run seed:content-pages
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

const MANAGED_SECTIONS = [
  {
    key: "team",
    name: "Team",
    description: "Team member photo cards with role and short bio",
    section_title: "Meet the team",
    sub_title: "Leaders and practitioners behind SkillHub.",
    in_page_nav_title: "Team",
    content_scope: "page",
    status: true,
    buttons: [],
    items: [],
    data: {},
  },
  {
    key: "editorial_banner",
    name: "Editorial Banner",
    description: "Full-bleed editorial hero with display type over imagery",
    section_title: "Capability that compounds",
    sub_title: "Modern learning programs for teams that ship.",
    in_page_nav_title: "Banner",
    content_scope: "page",
    status: true,
    buttons: [],
    items: [],
    data: {},
  },
  {
    key: "feature_spotlight",
    name: "Feature Spotlight",
    description: "Asymmetric image spotlight cards with metrics",
    section_title: "What we deliver",
    sub_title: "Programs designed for real delivery outcomes.",
    in_page_nav_title: "Spotlight",
    content_scope: "page",
    status: true,
    buttons: [],
    items: [],
    data: {},
  },
  {
    key: "process_steps",
    name: "Process Steps",
    description: "Numbered process steps for journeys and playbooks",
    section_title: "How it works",
    sub_title: "A clear path from discovery to measurable impact.",
    in_page_nav_title: "Process",
    content_scope: "page",
    status: true,
    buttons: [],
    items: [],
    data: {},
  },
  {
    key: "cta_band",
    name: "CTA Band",
    description: "Full-bleed ink CTA band with strong call to action",
    section_title: "Ready when you are",
    sub_title: "Start a pilot or talk through your roadmap with us.",
    in_page_nav_title: "CTA",
    content_scope: "page",
    status: true,
    buttons: [],
    items: [],
    data: {},
  },
];

const MANAGED_KEYS = new Set(MANAGED_SECTIONS.map((s) => s.key));

/** Ensure a section catalog doc exists (create or light-touch update). */
async function ensureSection(def) {
  const catalog = getSectionCatalogMeta(def.key);
  let section = await Section.findOne({ key: def.key });
  if (!section) {
    section = await Section.create({
      ...def,
      category: catalog?.category || def.category || "",
      tags: catalog?.tags || def.tags || [],
      pages: [],
    });
    console.log(`  + created section ${def.key}`);
  } else if (MANAGED_KEYS.has(def.key)) {
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
          "Free-form content pages (about-us, careers, …). No predefined sections.",
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

const ABOUT_PLACEMENTS = [
  {
    section_key: "in_page_nav",
    sort_order: 0,
    section_title: "",
    in_page_nav_title: "",
  },
  {
    section_key: "hero_centered",
    sort_order: 1,
    section_title: "Building capability that moves the business",
    sub_title:
      "SkillHub partners with enterprises to close skill gaps, accelerate digital programs, and create measurable workforce impact.",
    in_page_nav_title: "About",
    data: {
      body: "<p>From strategy to scaled learning programs, we help leaders align people, process, and technology.</p>",
    },
    buttons: [
      btn("Talk to us", { target_url: "/company/careers", sort_order: 0 }),
      btn("Explore courses", {
        variant: "secondary",
        target_url: "/courses",
        sort_order: 1,
      }),
    ],
  },
  {
    section_key: "overview",
    sort_order: 2,
    section_title: "Our story",
    sub_title: "Enterprise learning, designed for outcomes.",
    in_page_nav_title: "Our story",
    data: {
      body: `<p>SkillHub started with a simple belief: training only works when it is tied to the work people actually do. We build industry-aligned learning experiences that help organizations move faster — without leaving capability behind.</p><p>Today we support enterprises across cloud, security, data, and digital transformation with curated programs, expert practitioners, and measurable delivery.</p>`,
    },
  },
  {
    section_key: "stats",
    sort_order: 3,
    section_title: "Impact in numbers",
    in_page_nav_title: "Impact",
    items: [
      item({ value: "120+", label: "Enterprise clients" }, 0),
      item({ value: "8,500+", label: "Learners trained yearly" }, 1),
      item({ value: "40+", label: "Countries served" }, 2),
      item({ value: "92%", label: "Program satisfaction" }, 3),
    ],
  },
  {
    section_key: "text_media",
    sort_order: 4,
    section_title: "",
    in_page_nav_title: "Mission",
    items: [
      item(
        {
          title: "Mission-led. Outcome-focused.",
          body: `<p>We help organizations translate strategy into workforce capability — with learning paths that map to roles, certifications, and real delivery milestones.</p><p>Every engagement is built around clarity: what people need to know, how they will practice it, and how leaders will measure progress.</p>`,
          image_url:
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
          value: "end",
        },
        0
      ),
      item(
        {
          title: "Learning that sticks on the job",
          body: `<p>Our programs blend instructor-led depth, labs, and coaching so teams leave with skills they can apply the same week — not just certificates on a wall.</p>`,
          image_url:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
          value: "start",
        },
        1
      ),
    ],
  },
  {
    section_key: "why_choose",
    sort_order: 5,
    section_title: "What we stand for",
    sub_title: "Principles that shape every SkillHub engagement.",
    in_page_nav_title: "Values",
    items: [
      item(
        {
          title: "Clarity first",
          body: "<p>We design programs around business outcomes — not generic course catalogs.</p>",
          icon: "",
        },
        0
      ),
      item(
        {
          title: "Practitioner depth",
          body: "<p>Facilitators and coaches bring real delivery experience from enterprise programs.</p>",
        },
        1
      ),
      item(
        {
          title: "Measurable progress",
          body: "<p>Leaders get visibility into completion, skill signals, and readiness — not vanity metrics.</p>",
        },
        2
      ),
      item(
        {
          title: "Partnership mindset",
          body: "<p>We stay close after launch to refine paths, content, and adoption with your teams.</p>",
        },
        3
      ),
    ],
  },
  {
    section_key: "partners_marquee",
    sort_order: 6,
    // Global section — placement only; content stays on Section catalog
    section_title: null,
    in_page_nav_title: "Partners",
  },
  {
    section_key: "customer_testimonials",
    sort_order: 7,
    section_title: null,
    in_page_nav_title: "Stories",
  },
  {
    section_key: "faq",
    sort_order: 8,
    section_title: "About SkillHub — FAQs",
    sub_title: "Common questions from enterprise buyers and L&D leaders.",
    in_page_nav_title: "FAQ",
    items: [
      item(
        {
          title: "Who is SkillHub for?",
          body: "<p>Enterprise L&D, transformation, and technology leaders who need role-aligned upskilling at scale.</p>",
        },
        0
      ),
      item(
        {
          title: "Do you customize programs?",
          body: "<p>Yes. We tailor paths, labs, and coaching to your stack, roles, and delivery calendar.</p>",
        },
        1
      ),
      item(
        {
          title: "How do we get started?",
          body: "<p>Start with a discovery call. We’ll map priorities, recommend a pilot path, and define success metrics together.</p>",
        },
        2
      ),
    ],
  },
];

const TEAM_PLACEMENTS = [
  {
    section_key: "in_page_nav",
    sort_order: 0,
  },
  {
    section_key: "hero_minimal",
    sort_order: 1,
    section_title: "People who build capability with you",
    sub_title:
      "Meet the leaders, facilitators, and operators behind SkillHub programs worldwide.",
    in_page_nav_title: "Our team",
    buttons: [
      btn("Join the team", { target_url: "/company/careers", sort_order: 0 }),
    ],
  },
  {
    section_key: "overview",
    sort_order: 2,
    section_title: "A team built for enterprise delivery",
    sub_title: "Strategy, facilitation, and customer success — one crew.",
    in_page_nav_title: "How we work",
    data: {
      body: `<p>Our team combines learning design, technical depth, and program operations. That mix lets us run complex enterprise rollouts while keeping the learner experience sharp and human.</p>`,
    },
  },
  {
    section_key: "team",
    sort_order: 3,
    section_title: "Leadership & delivery",
    sub_title: "A cross-functional crew focused on outcomes.",
    in_page_nav_title: "People",
    items: [
      item(
        {
          title: "Aisha Rahman",
          subtitle: "CEO & Co-founder",
          body: "<p>Previously led enterprise enablement at a global cloud consultancy. Obsessed with tying learning to delivery KPIs.</p>",
          image_url:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
        },
        0
      ),
      item(
        {
          title: "Marcus Chen",
          subtitle: "Chief Learning Officer",
          body: "<p>Designs role-based curricula across cloud, security, and data. Former enterprise architect and certified trainer.</p>",
          image_url:
            "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
        },
        1
      ),
      item(
        {
          title: "Priya Nair",
          subtitle: "Head of Customer Success",
          body: "<p>Owns post-sale outcomes — adoption dashboards, coaching loops, and executive readouts for strategic accounts.</p>",
          image_url:
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
        },
        2
      ),
      item(
        {
          title: "Daniel Okonkwo",
          subtitle: "Director of Programs",
          body: "<p>Runs multi-region cohort operations, instructor networks, and quality reviews for high-stakes deployments.</p>",
          image_url:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
        },
        3
      ),
      item(
        {
          title: "Elena Vargas",
          subtitle: "Lead Facilitator — Security",
          body: "<p>Delivers hands-on security and zero-trust workshops for Fortune 500 engineering and risk teams.</p>",
          image_url:
            "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&q=80",
        },
        4
      ),
      item(
        {
          title: "James Whitfield",
          subtitle: "Lead Facilitator — Cloud",
          body: "<p>Specializes in cloud architecture labs and certification-aligned pathways for platform teams.</p>",
          image_url:
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80",
        },
        5
      ),
      item(
        {
          title: "Sofia Almeida",
          subtitle: "Product Design Lead",
          body: "<p>Shapes the SkillHub learner experience — from catalog discovery to in-path coaching moments.</p>",
          image_url:
            "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=80",
        },
        6
      ),
      item(
        {
          title: "Noah Patel",
          subtitle: "Partnerships Manager",
          body: "<p>Builds alliances with vendors and training partners so clients get curated, current content.</p>",
          image_url:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
        },
        7
      ),
    ],
  },
  {
    section_key: "stats",
    sort_order: 4,
    section_title: "The team behind the numbers",
    in_page_nav_title: "Facts",
    items: [
      item({ value: "65+", label: "Practitioners & coaches" }, 0),
      item({ value: "18", label: "Languages supported" }, 1),
      item({ value: "12", label: "Delivery hubs" }, 2),
      item({ value: "4.8/5", label: "Facilitator rating" }, 3),
    ],
  },
  {
    section_key: "text_media",
    sort_order: 5,
    in_page_nav_title: "Culture",
    items: [
      item(
        {
          title: "Curious, practical, accountable",
          body: `<p>We hire for people who can teach and ship. That means deep domain skills, clear communication, and a bias toward helping customers see progress quickly.</p>`,
          image_url:
            "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80",
          value: "end",
        },
        0
      ),
    ],
  },
  {
    section_key: "partners_marquee",
    sort_order: 6,
    in_page_nav_title: "Partners",
  },
  {
    section_key: "faq",
    sort_order: 7,
    section_title: "Working with our team",
    in_page_nav_title: "FAQ",
    items: [
      item(
        {
          title: "Can we meet facilitators before a program?",
          body: "<p>Yes — discovery and pilot sessions usually include the delivery lead who will run your cohort.</p>",
        },
        0
      ),
      item(
        {
          title: "Are you hiring?",
          body: "<p>We’re always looking for practitioners and program operators. See open roles on Careers.</p>",
        },
        1
      ),
    ],
  },
];

const SOLUTIONS_PLACEMENTS = [
  {
    section_key: "in_page_nav",
    sort_order: 0,
  },
  {
    section_key: "editorial_banner",
    sort_order: 1,
    section_title: "Solutions built for the work ahead",
    sub_title:
      "Role-aligned learning programs that close skill gaps across cloud, security, data, and digital delivery.",
    in_page_nav_title: "Solutions",
    section_img_url:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=80",
    data: {
      body: "<p>From pilot cohorts to enterprise rollouts — clarity, practice, and measurable readiness in one system.</p>",
    },
    buttons: [
      btn("Explore pathways", { target_url: "/get-started", sort_order: 0 }),
      btn("Talk to an expert", {
        variant: "secondary",
        target_url: "/company/careers",
        sort_order: 1,
      }),
    ],
  },
  {
    section_key: "feature_spotlight",
    sort_order: 2,
    section_title: "Where teams gain leverage",
    sub_title: "Programs designed around outcomes — not generic catalogs.",
    in_page_nav_title: "Focus",
    items: [
      item(
        {
          value: "Cloud",
          title: "Platform & architecture",
          subtitle: "Ship faster on modern stacks",
          body: "<p>Architecture labs, certification paths, and coaching for platform and SRE teams.</p>",
          image_url:
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
        },
        0
      ),
      item(
        {
          value: "Security",
          title: "Zero-trust readiness",
          subtitle: "Risk teams that can operate",
          body: "<p>Hands-on workshops that connect policy, tooling, and day-to-day engineering practice.</p>",
          image_url:
            "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
        },
        1
      ),
      item(
        {
          value: "Data",
          title: "Analytics & AI literacy",
          subtitle: "Decisions with confidence",
          body: "<p>Role paths for analysts, engineers, and product leaders working with modern data stacks.</p>",
          image_url:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        },
        2
      ),
      item(
        {
          value: "Lead",
          title: "Transformation enablement",
          subtitle: "Programs that stick",
          body: "<p>Executive alignment, cohort design, and adoption loops so capability compounds after launch.</p>",
          image_url:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
        },
        3
      ),
    ],
  },
  {
    section_key: "stats",
    sort_order: 3,
    section_title: "Proof in the delivery",
    in_page_nav_title: "Impact",
    items: [
      item({ value: "3.2×", label: "Faster time-to-competency" }, 0),
      item({ value: "87%", label: "Managers reporting skill lift" }, 1),
      item({ value: "50+", label: "Curated enterprise paths" }, 2),
      item({ value: "14d", label: "Typical pilot launch" }, 3),
    ],
  },
  {
    section_key: "process_steps",
    sort_order: 4,
    section_title: "How a SkillHub engagement runs",
    sub_title: "A tight loop from diagnosis to measurable readiness.",
    in_page_nav_title: "Process",
    items: [
      item(
        {
          title: "Diagnose the gap",
          subtitle: "Week 1",
          body: "<p>Map roles, priorities, and delivery milestones with your L&D and technology leads.</p>",
        },
        0
      ),
      item(
        {
          title: "Design the path",
          subtitle: "Week 2",
          body: "<p>Assemble labs, coaching, and success metrics tailored to your stack and calendar.</p>",
        },
        1
      ),
      item(
        {
          title: "Run the cohort",
          subtitle: "Weeks 3–8",
          body: "<p>Facilitators deliver practice-first sessions while leaders see live adoption signals.</p>",
        },
        2
      ),
      item(
        {
          title: "Measure & scale",
          subtitle: "Ongoing",
          body: "<p>Refine content, expand paths, and roll out to additional teams with confidence.</p>",
        },
        3
      ),
    ],
  },
  {
    section_key: "why_choose",
    sort_order: 5,
    section_title: "Why enterprises choose SkillHub",
    sub_title: "Built for leaders who need capability — not just content.",
    in_page_nav_title: "Why us",
    items: [
      item(
        {
          title: "Role-aligned by default",
          body: "<p>Every path maps to the work people do — certifications included when they matter.</p>",
        },
        0
      ),
      item(
        {
          title: "Practitioner-led",
          body: "<p>Facilitators bring real delivery experience from enterprise programs and product teams.</p>",
        },
        1
      ),
      item(
        {
          title: "Visible progress",
          body: "<p>Dashboards and coaching loops keep executives and managers aligned on readiness.</p>",
        },
        2
      ),
    ],
  },
  {
    section_key: "customer_testimonials",
    sort_order: 6,
    section_title: null,
    in_page_nav_title: "Stories",
  },
  {
    section_key: "cta_band",
    sort_order: 7,
    section_title: "See which solution fits your roadmap",
    sub_title:
      "Book a short discovery call — we’ll map a pilot path and success metrics together.",
    in_page_nav_title: "Next",
    buttons: [
      btn("Get started", { target_url: "/get-started", sort_order: 0 }),
      btn("Browse catalog", {
        variant: "secondary",
        target_url: "/courses",
        sort_order: 1,
      }),
    ],
  },
];

const GET_STARTED_PLACEMENTS = [
  {
    section_key: "in_page_nav",
    sort_order: 0,
  },
  {
    section_key: "editorial_banner",
    sort_order: 1,
    section_title: "Start with a pilot that proves value",
    sub_title:
      "A focused cohort, clear success metrics, and a path to scale — without a year-long RFP.",
    in_page_nav_title: "Start",
    section_img_url:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1800&q=80",
    data: {
      body: "<p>Most clients launch a 4–8 week pilot within two weeks of the first conversation.</p>",
    },
    buttons: [
      btn("Book discovery", { target_url: "/company/careers", sort_order: 0 }),
      btn("View solutions", {
        variant: "secondary",
        target_url: "/solutions",
        sort_order: 1,
      }),
    ],
  },
  {
    section_key: "process_steps",
    sort_order: 2,
    section_title: "Your first 30 days with SkillHub",
    sub_title: "Simple steps. Serious momentum.",
    in_page_nav_title: "Timeline",
    items: [
      item(
        {
          title: "Discovery call",
          subtitle: "Day 1–3",
          body: "<p>Share priorities, constraints, and the roles you need ready. We’ll recommend a pilot shape.</p>",
        },
        0
      ),
      item(
        {
          title: "Pilot design",
          subtitle: "Day 4–10",
          body: "<p>Agree on path, facilitators, cohort size, and the metrics that prove success.</p>",
        },
        1
      ),
      item(
        {
          title: "Kickoff & delivery",
          subtitle: "Day 11–30",
          body: "<p>Learners start practicing. Leaders get visibility. We adjust content as signals come in.</p>",
        },
        2
      ),
      item(
        {
          title: "Scale decision",
          subtitle: "End of pilot",
          body: "<p>Review outcomes together and expand to the next teams — or refine and re-run.</p>",
        },
        3
      ),
    ],
  },
  {
    section_key: "feature_spotlight",
    sort_order: 3,
    section_title: "What you walk away with",
    sub_title: "Concrete artifacts — not a slide deck of intentions.",
    in_page_nav_title: "Outcomes",
    items: [
      item(
        {
          value: "01",
          title: "Role-ready path",
          subtitle: "Curated for your stack",
          body: "<p>A learning path mapped to roles, tools, and delivery milestones.</p>",
          image_url:
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
        },
        0
      ),
      item(
        {
          value: "02",
          title: "Live practice",
          subtitle: "Labs & coaching",
          body: "<p>Hands-on sessions so skills transfer to the work, not just the quiz.</p>",
          image_url:
            "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
        },
        1
      ),
      item(
        {
          value: "03",
          title: "Leader readout",
          subtitle: "Signals that matter",
          body: "<p>Completion, skill signals, and recommendations for the next wave of teams.</p>",
          image_url:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        },
        2
      ),
    ],
  },
  {
    section_key: "text_media",
    sort_order: 4,
    in_page_nav_title: "Fit",
    items: [
      item(
        {
          title: "Built for L&D and transformation leads",
          body: `<p>If you need a partner who can move from conversation to cohort without drowning in process, you’re in the right place. We keep the paperwork light and the delivery sharp.</p>`,
          image_url:
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80",
          value: "end",
        },
        0
      ),
    ],
  },
  {
    section_key: "faq",
    sort_order: 5,
    section_title: "Before you book",
    sub_title: "Straight answers for buyers and program owners.",
    in_page_nav_title: "FAQ",
    items: [
      item(
        {
          title: "How big should a pilot be?",
          body: "<p>Most pilots run 12–40 learners in one role family. Enough to prove value, small enough to move fast.</p>",
        },
        0
      ),
      item(
        {
          title: "Do we need a long contract?",
          body: "<p>No. Start with a pilot SOW. Scale only when the readout shows the outcomes you care about.</p>",
        },
        1
      ),
      item(
        {
          title: "Can you work with our existing LMS?",
          body: "<p>Yes — we integrate with common LMS platforms or run SkillHub-hosted cohorts when that’s simpler.</p>",
        },
        2
      ),
    ],
  },
  {
    section_key: "cta_band",
    sort_order: 6,
    section_title: "Let’s design your pilot",
    sub_title:
      "Tell us your priorities — we’ll come back with a path, timeline, and success metrics.",
    in_page_nav_title: "Book",
    buttons: [
      btn("Book discovery", { target_url: "/company/careers", sort_order: 0 }),
      btn("Meet the team", {
        variant: "secondary",
        target_url: "/our-team",
        sort_order: 1,
      }),
    ],
  },
];

/** Dark overlay so slide copy stays readable on busy photos */
const SLIDE_BG = "linear-gradient(120deg, #0b1f4d 0%, #102a5c 55%, #0a1740 100%)";

const CLOUD_ACADEMY_PLACEMENTS = [
  { section_key: "in_page_nav", sort_order: 0 },
  {
    section_key: "hero_media",
    sort_order: 1,
    in_page_nav_title: "Cloud",
    items: [
      item(
        {
          title: "Cloud Academy for teams that ship",
          subtitle:
            "Architecture labs, certification paths, and coaching for platform, SRE, and product engineers.",
          image_url:
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=80",
          icon: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
          bg_color: SLIDE_BG,
          buttons: [
            btn("Browse cloud paths", {
              target_url: "/courses",
              variant: "inverse",
              sort_order: 0,
            }),
            btn("Start a pilot", {
              target_url: "/get-started",
              variant: "secondary",
              sort_order: 1,
            }),
          ],
        },
        0
      ),
      item(
        {
          title: "From landing zone to production readiness",
          subtitle:
            "Hands-on environments that mirror your stack — AWS, Azure, and Google Cloud.",
          image_url:
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=2000&q=80",
          icon: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=900&q=80",
          bg_color: SLIDE_BG,
          buttons: [
            btn("Talk to a cloud lead", {
              target_url: "/company/careers",
              variant: "inverse",
              sort_order: 0,
            }),
          ],
        },
        1
      ),
      item(
        {
          title: "Certification that maps to delivery",
          subtitle:
            "Role paths for architects, DevOps, and security engineers — measured by readiness, not quiz scores.",
          image_url:
            "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80",
          icon: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80",
          bg_color: SLIDE_BG,
          buttons: [
            btn("View solutions", {
              target_url: "/solutions",
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
    section_key: "feature_spotlight",
    sort_order: 2,
    section_title: "What cloud cohorts practice",
    sub_title: "Real workloads. Real environments. Measurable skill lift.",
    in_page_nav_title: "Practice",
    items: [
      item(
        {
          value: "01",
          title: "Landing zones & governance",
          subtitle: "Secure foundations",
          body: "<p>Design multi-account structures, identity, and guardrails your platform team can operate.</p>",
          image_url:
            "https://images.unsplash.com/photo-1544197150-b99a580bb7a2?auto=format&fit=crop&w=1200&q=80",
        },
        0
      ),
      item(
        {
          value: "02",
          title: "Containers & Kubernetes",
          subtitle: "Ship with confidence",
          body: "<p>Clusters, CI/CD, and observability patterns used in production enterprise fleets.</p>",
          image_url:
            "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=1200&q=80",
        },
        1
      ),
      item(
        {
          value: "03",
          title: "FinOps & reliability",
          subtitle: "Cost meets uptime",
          body: "<p>Budgets, SLOs, and runbooks so scale doesn’t surprise finance or on-call.</p>",
          image_url:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        },
        2
      ),
    ],
  },
  {
    section_key: "text_media",
    sort_order: 3,
    in_page_nav_title: "Labs",
    items: [
      item(
        {
          title: "Labs that feel like your cloud",
          body: `<p>Every Cloud Academy path includes guided labs in sandboxed environments — so engineers practice the same consoles, CLIs, and IaC patterns they’ll use Monday morning.</p>`,
          image_url:
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80",
          value: "end",
        },
        0
      ),
      item(
        {
          title: "Coaching between sessions",
          body: `<p>Facilitators stay available for office hours and architecture reviews so cohorts don’t stall between workshops.</p>`,
          image_url:
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=80",
          value: "start",
        },
        1
      ),
    ],
  },
  {
    section_key: "process_steps",
    sort_order: 4,
    section_title: "How a cloud cohort runs",
    in_page_nav_title: "Path",
    items: [
      item(
        {
          title: "Role map",
          subtitle: "Week 0",
          body: "<p>Align paths to architect, DevOps, and app roles on your stack.</p>",
        },
        0
      ),
      item(
        {
          title: "Intensive labs",
          subtitle: "Weeks 1–4",
          body: "<p>Live facilitation plus async practice with scored checkpoints.</p>",
        },
        1
      ),
      item(
        {
          title: "Capstone delivery",
          subtitle: "Week 5–6",
          body: "<p>Teams present a production-shaped design with cost and risk notes.</p>",
        },
        2
      ),
      item(
        {
          title: "Leader readout",
          subtitle: "Close",
          body: "<p>Skill signals, certification progress, and scale recommendations.</p>",
        },
        3
      ),
    ],
  },
  {
    section_key: "stats",
    sort_order: 5,
    section_title: "Cloud Academy impact",
    in_page_nav_title: "Impact",
    items: [
      item({ value: "18k+", label: "Cloud learners yearly" }, 0),
      item({ value: "92%", label: "Lab completion rate" }, 1),
      item({ value: "3", label: "Major cloud platforms" }, 2),
      item({ value: "4.9", label: "Facilitator rating" }, 3),
    ],
  },
  {
    section_key: "cta_band",
    sort_order: 6,
    section_title: "Launch your Cloud Academy cohort",
    sub_title: "We’ll map a pilot path to your landing zone and delivery calendar.",
    in_page_nav_title: "Next",
    buttons: [
      btn("Get started", { target_url: "/get-started", sort_order: 0 }),
      btn("See all solutions", {
        variant: "secondary",
        target_url: "/solutions",
        sort_order: 1,
      }),
    ],
  },
];

const SECURITY_LAB_PLACEMENTS = [
  { section_key: "in_page_nav", sort_order: 0 },
  {
    section_key: "hero_media",
    sort_order: 1,
    in_page_nav_title: "Security",
    items: [
      item(
        {
          title: "Security Lab — practice that holds under pressure",
          subtitle:
            "Zero-trust workshops, detection drills, and secure-by-design paths for engineering and risk teams.",
          image_url:
            "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=2000&q=80",
          icon: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=900&q=80",
          bg_color: SLIDE_BG,
          buttons: [
            btn("Explore security paths", {
              target_url: "/courses",
              variant: "inverse",
              sort_order: 0,
            }),
          ],
        },
        0
      ),
      item(
        {
          title: "From policy to pipeline",
          subtitle:
            "Connect governance, identity, and DevSecOps so controls travel with the code.",
          image_url:
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2000&q=80",
          icon: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80",
          bg_color: SLIDE_BG,
          buttons: [
            btn("Book a lab demo", {
              target_url: "/get-started",
              variant: "inverse",
              sort_order: 0,
            }),
          ],
        },
        1
      ),
      item(
        {
          title: "Incident drills your teams will remember",
          subtitle:
            "Tabletops and live-fire scenarios that sharpen detection, response, and communication.",
          image_url:
            "https://images.unsplash.com/photo-1510511459019-5dda7724ec77?auto=format&fit=crop&w=2000&q=80",
          icon: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=900&q=80",
          bg_color: SLIDE_BG,
          buttons: [
            btn("Talk to security leads", {
              target_url: "/our-team",
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
    section_key: "editorial_banner",
    sort_order: 2,
    section_title: "Security skill that shows up on the job",
    sub_title:
      "Not another awareness quiz — practitioner depth for builders and defenders.",
    in_page_nav_title: "Why",
    section_img_url:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1800&q=80",
    data: {
      body: "<p>Programs blend threat modeling, secure coding, cloud posture, and response playbooks.</p>",
    },
    buttons: [
      btn("Start a security pilot", { target_url: "/get-started", sort_order: 0 }),
    ],
  },
  {
    section_key: "feature_spotlight",
    sort_order: 3,
    section_title: "Lab tracks",
    sub_title: "Pick the pressure point your organization cares about most.",
    in_page_nav_title: "Tracks",
    items: [
      item(
        {
          value: "ZT",
          title: "Zero-trust foundations",
          subtitle: "Identity-first design",
          body: "<p>Map trust boundaries, MFA, and continuous verification across apps and networks.</p>",
          image_url:
            "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=1200&q=80",
        },
        0
      ),
      item(
        {
          value: "App",
          title: "Secure software delivery",
          subtitle: "Shift-left that sticks",
          body: "<p>Threat modeling, SAST/DAST habits, and pipeline gates developers actually use.</p>",
          image_url:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
        },
        1
      ),
      item(
        {
          value: "SOC",
          title: "Detection & response",
          subtitle: "Operate under fire",
          body: "<p>SIEM patterns, playbooks, and cross-team communication under time pressure.</p>",
          image_url:
            "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=80",
        },
        2
      ),
      item(
        {
          value: "Cloud",
          title: "Cloud security posture",
          subtitle: "Misconfig to hardened",
          body: "<p>CSPM, IAM hygiene, and shared-responsibility drills for multi-cloud estates.</p>",
          image_url:
            "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?auto=format&fit=crop&w=1200&q=80",
        },
        3
      ),
    ],
  },
  {
    section_key: "why_choose",
    sort_order: 4,
    section_title: "Built for security & engineering together",
    in_page_nav_title: "Approach",
    items: [
      item(
        {
          title: "Shared language",
          body: "<p>Risk and engineering leave with the same models — not competing slide decks.</p>",
        },
        0
      ),
      item(
        {
          title: "Safe sandboxes",
          body: "<p>Break things in the lab so production stays boring.</p>",
        },
        1
      ),
      item(
        {
          title: "Executive-ready signals",
          body: "<p>Readouts tie skill progress to risk reduction themes leaders track.</p>",
        },
        2
      ),
    ],
  },
  {
    section_key: "cta_band",
    sort_order: 5,
    section_title: "Run a Security Lab with your next cohort",
    sub_title: "We’ll scope a track to your threat model and delivery cadence.",
    in_page_nav_title: "Book",
    buttons: [
      btn("Book discovery", { target_url: "/get-started", sort_order: 0 }),
      btn("Meet facilitators", {
        variant: "secondary",
        target_url: "/our-team",
        sort_order: 1,
      }),
    ],
  },
];

const DATA_ACADEMY_PLACEMENTS = [
  { section_key: "in_page_nav", sort_order: 0 },
  {
    section_key: "hero_media",
    sort_order: 1,
    in_page_nav_title: "Data",
    items: [
      item(
        {
          title: "Data Academy — analytics & AI literacy that ships",
          subtitle:
            "Role paths for analysts, engineers, and product leaders working with modern data stacks.",
          image_url:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80",
          icon: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
          bg_color: SLIDE_BG,
          buttons: [
            btn("Browse data paths", {
              target_url: "/courses",
              variant: "inverse",
              sort_order: 0,
            }),
          ],
        },
        0
      ),
      item(
        {
          title: "From warehouse to decision",
          subtitle:
            "SQL depth, modeling craft, and storytelling that executives can act on.",
          image_url:
            "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=2000&q=80",
          icon: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=900&q=80",
          bg_color: SLIDE_BG,
          buttons: [
            btn("Design a pilot", {
              target_url: "/get-started",
              variant: "inverse",
              sort_order: 0,
            }),
          ],
        },
        1
      ),
      item(
        {
          title: "Responsible AI for product teams",
          subtitle:
            "Prompt craft, evaluation habits, and governance without slowing delivery.",
          image_url:
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=2000&q=80",
          icon: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=900&q=80",
          bg_color: SLIDE_BG,
          buttons: [
            btn("See solutions", {
              target_url: "/solutions",
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
    section_key: "hero_split",
    sort_order: 2,
    section_title: "One academy. Three learner personas.",
    sub_title:
      "Analysts deepen craft. Engineers harden pipelines. Product leaders ask better questions of the data.",
    in_page_nav_title: "Personas",
    section_img_url:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1400&q=80",
    buttons: [
      btn("Map your roles", { target_url: "/get-started", sort_order: 0 }),
    ],
  },
  {
    section_key: "feature_spotlight",
    sort_order: 3,
    section_title: "Studio modules",
    sub_title: "Image-forward modules that feel like a modern learning studio.",
    in_page_nav_title: "Modules",
    items: [
      item(
        {
          value: "SQL",
          title: "Analytical SQL fluency",
          subtitle: "Queries that answer business questions",
          body: "<p>Window functions, modeling patterns, and performance habits for warehouse work.</p>",
          image_url:
            "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=1200&q=80",
        },
        0
      ),
      item(
        {
          value: "ML",
          title: "Applied ML literacy",
          subtitle: "Know when models help",
          body: "<p>Feature sense, evaluation basics, and how to partner with ML engineers.</p>",
          image_url:
            "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=1200&q=80",
        },
        1
      ),
      item(
        {
          value: "Viz",
          title: "Decision-ready storytelling",
          subtitle: "Dashboards that drive action",
          body: "<p>Design narratives, annotate uncertainty, and brief executives with clarity.</p>",
          image_url:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        },
        2
      ),
    ],
  },
  {
    section_key: "text_media",
    sort_order: 4,
    in_page_nav_title: "Studio",
    items: [
      item(
        {
          title: "Datasets from real business scenarios",
          body: `<p>Learners work with anonymized enterprise-shaped datasets — revenue, ops, and product funnels — so skills transfer without waiting for a perfect internal sandbox.</p>`,
          image_url:
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80",
          value: "end",
        },
        0
      ),
    ],
  },
  {
    section_key: "process_steps",
    sort_order: 5,
    section_title: "Academy rhythm",
    in_page_nav_title: "Rhythm",
    items: [
      item(
        {
          title: "Baseline & goals",
          subtitle: "Day 1",
          body: "<p>Skill check and success metrics with managers.</p>",
        },
        0
      ),
      item(
        {
          title: "Studio sprints",
          subtitle: "Weeks 1–5",
          body: "<p>Facilitated labs, peer reviews, and async challenges.</p>",
        },
        1
      ),
      item(
        {
          title: "Business brief",
          subtitle: "Week 6",
          body: "<p>Present findings to a stakeholder panel with clear asks.</p>",
        },
        2
      ),
    ],
  },
  {
    section_key: "cta_band",
    sort_order: 6,
    section_title: "Bring Data Academy to your teams",
    sub_title: "We’ll recommend a persona mix and pilot size for your roadmap.",
    in_page_nav_title: "Next",
    buttons: [
      btn("Get started", { target_url: "/get-started", sort_order: 0 }),
      btn("Cloud Academy", {
        variant: "secondary",
        target_url: "/cloud-academy",
        sort_order: 1,
      }),
    ],
  },
];

const ENTERPRISE_PLACEMENTS = [
  { section_key: "in_page_nav", sort_order: 0 },
  {
    section_key: "hero_media",
    sort_order: 1,
    in_page_nav_title: "Enterprise",
    items: [
      item(
        {
          title: "Enterprise learning that moves with the business",
          subtitle:
            "Multi-region cohorts, executive visibility, and programs tied to transformation milestones.",
          image_url:
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80",
          icon: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
          bg_color: SLIDE_BG,
          buttons: [
            btn("Plan an engagement", {
              target_url: "/get-started",
              variant: "inverse",
              sort_order: 0,
            }),
            btn("View solutions", {
              target_url: "/solutions",
              variant: "secondary",
              sort_order: 1,
            }),
          ],
        },
        0
      ),
      item(
        {
          title: "Global delivery. Local facilitators.",
          subtitle:
            "12 delivery hubs, 18 languages, and practitioners who’ve run complex rollouts.",
          image_url:
            "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=80",
          icon: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
          bg_color: SLIDE_BG,
          buttons: [
            btn("Meet the team", {
              target_url: "/our-team",
              variant: "inverse",
              sort_order: 0,
            }),
          ],
        },
        1
      ),
      item(
        {
          title: "Visibility leaders actually use",
          subtitle:
            "Adoption dashboards, skill signals, and executive readouts — not vanity completion charts.",
          image_url:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2000&q=80",
          icon: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
          bg_color: SLIDE_BG,
          buttons: [
            btn("See how it works", {
              target_url: "/get-started",
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
    section_key: "hero_dual_cta",
    sort_order: 2,
    section_title: "Two ways to engage",
    sub_title: "Pilot fast — or design a multi-year capability program.",
    in_page_nav_title: "Engage",
    section_img_url:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1400&q=80",
    buttons: [
      btn("Start a pilot", { target_url: "/get-started", sort_order: 0 }),
      btn("Talk strategy", {
        variant: "secondary",
        target_url: "/company/careers",
        sort_order: 1,
      }),
    ],
  },
  {
    section_key: "stats",
    sort_order: 3,
    section_title: "Trusted at enterprise scale",
    in_page_nav_title: "Scale",
    items: [
      item({ value: "120+", label: "Enterprise clients" }, 0),
      item({ value: "40+", label: "Countries served" }, 1),
      item({ value: "8.5k+", label: "Learners / year" }, 2),
      item({ value: "92%", label: "Program satisfaction" }, 3),
    ],
  },
  {
    section_key: "feature_spotlight",
    sort_order: 4,
    section_title: "What enterprise programs include",
    in_page_nav_title: "Include",
    items: [
      item(
        {
          value: "Ops",
          title: "Program operations",
          subtitle: "Cohorts without chaos",
          body: "<p>Scheduling, instructor networks, and quality reviews across regions.</p>",
          image_url:
            "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80",
        },
        0
      ),
      item(
        {
          value: "CS",
          title: "Customer success",
          subtitle: "Outcomes after launch",
          body: "<p>Adoption loops, coaching, and executive readouts for strategic accounts.</p>",
          image_url:
            "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1200&q=80",
        },
        1
      ),
      item(
        {
          value: "Partner",
          title: "Vendor alliances",
          subtitle: "Curated & current",
          body: "<p>Official curricula and co-branded pathways when they advance your roadmap.</p>",
          image_url:
            "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
        },
        2
      ),
    ],
  },
  {
    section_key: "partners_marquee",
    sort_order: 5,
    in_page_nav_title: "Partners",
  },
  {
    section_key: "customer_testimonials",
    sort_order: 6,
    in_page_nav_title: "Stories",
  },
  {
    section_key: "cta_band",
    sort_order: 7,
    section_title: "Let’s scope your enterprise program",
    sub_title:
      "Share your transformation milestones — we’ll propose a pilot and a scale plan.",
    in_page_nav_title: "Contact",
    buttons: [
      btn("Book discovery", { target_url: "/get-started", sort_order: 0 }),
      btn("About SkillHub", {
        variant: "secondary",
        target_url: "/about-us",
        sort_order: 1,
      }),
    ],
  },
];

async function seed() {
  await connectDB();

  console.log("Ensuring content template + Content docs…");
  await ensureContentPage();
  const about = await ensureContent({
    name: "About Us",
    slug: "about-us",
    path: "/about-us",
    description: "Learn about SkillHub — mission, story, and approach.",
    status: "active",
    sortOrder: 10,
  });
  const team = await ensureContent({
    name: "Our Team",
    slug: "our-team",
    path: "/our-team",
    description: "Meet the people behind SkillHub.",
    status: "active",
    sortOrder: 20,
  });
  const solutions = await ensureContent({
    name: "Solutions",
    slug: "solutions",
    path: "/solutions",
    description:
      "Enterprise learning solutions across cloud, security, data, and transformation.",
    status: "active",
    sortOrder: 30,
  });
  const getStarted = await ensureContent({
    name: "Get Started",
    slug: "get-started",
    path: "/get-started",
    description: "Launch a SkillHub pilot — discovery to measurable outcomes.",
    status: "active",
    sortOrder: 40,
  });
  const cloudAcademy = await ensureContent({
    name: "Cloud Academy",
    slug: "cloud-academy",
    path: "/cloud-academy",
    description:
      "Cloud training academy — architecture labs, certifications, and coaching.",
    status: "active",
    sortOrder: 50,
  });
  const securityLab = await ensureContent({
    name: "Security Lab",
    slug: "security-lab",
    path: "/security-lab",
    description:
      "Hands-on security labs — zero-trust, DevSecOps, and incident drills.",
    status: "active",
    sortOrder: 60,
  });
  const dataAcademy = await ensureContent({
    name: "Data Academy",
    slug: "data-academy",
    path: "/data-academy",
    description:
      "Data & AI literacy academy for analysts, engineers, and product leaders.",
    status: "active",
    sortOrder: 70,
  });
  const enterprise = await ensureContent({
    name: "Enterprise",
    slug: "enterprise",
    path: "/enterprise",
    description:
      "Enterprise learning programs — multi-region cohorts and executive visibility.",
    status: "active",
    sortOrder: 80,
  });

  console.log("Ensuring section catalog entries…");
  const pageLayouts = [
    ABOUT_PLACEMENTS,
    TEAM_PLACEMENTS,
    SOLUTIONS_PLACEMENTS,
    GET_STARTED_PLACEMENTS,
    CLOUD_ACADEMY_PLACEMENTS,
    SECURITY_LAB_PLACEMENTS,
    DATA_ACADEMY_PLACEMENTS,
    ENTERPRISE_PLACEMENTS,
  ];
  const neededKeys = [
    ...new Set(pageLayouts.flatMap((list) => list.map((p) => p.section_key))),
  ];

  for (const def of MANAGED_SECTIONS) {
    await ensureSection(def);
  }

  const sectionByKey = new Map();
  for (const key of neededKeys) {
    let section = await Section.findOne({ key });
    if (!section && MANAGED_KEYS.has(key)) {
      const def = MANAGED_SECTIONS.find((s) => s.key === key);
      section = def ? await ensureSection(def) : null;
    }
    if (!section) {
      console.warn(
        `  ! Section "${key}" not in DB — run seed:pages / related seeds first`
      );
      continue;
    }
    sectionByKey.set(key, section);
  }

  const mappings = [
    ["About Us", about, ABOUT_PLACEMENTS],
    ["Our Team", team, TEAM_PLACEMENTS],
    ["Solutions", solutions, SOLUTIONS_PLACEMENTS],
    ["Get Started", getStarted, GET_STARTED_PLACEMENTS],
    ["Cloud Academy", cloudAcademy, CLOUD_ACADEMY_PLACEMENTS],
    ["Security Lab", securityLab, SECURITY_LAB_PLACEMENTS],
    ["Data Academy", dataAcademy, DATA_ACADEMY_PLACEMENTS],
    ["Enterprise", enterprise, ENTERPRISE_PLACEMENTS],
  ];

  for (const [label, doc, placements] of mappings) {
    console.log(`Mapping ${label} (${doc._id})…`);
    await replaceExtras("content", doc._id, placements, sectionByKey);
    console.log(`  ${placements.length} placements`);
  }

  console.log("\nDone.");
  console.log("  http://localhost:3001/about-us");
  console.log("  http://localhost:3001/our-team");
  console.log("  http://localhost:3001/solutions");
  console.log("  http://localhost:3001/get-started");
  console.log("  http://localhost:3001/cloud-academy");
  console.log("  http://localhost:3001/security-lab");
  console.log("  http://localhost:3001/data-academy");
  console.log("  http://localhost:3001/enterprise");
  console.log("  CMS: append ?cms=1");

  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("content-pages seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
