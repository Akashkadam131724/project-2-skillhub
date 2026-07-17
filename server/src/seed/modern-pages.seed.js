/**
 * Seeds 4 Content pages that use ONLY new modern sections:
 *   /innovation-lab
 *   /learning-studio
 *   /capability
 *   /immersive
 *
 * Sections: statement_band, bento_grid, horizon_gallery,
 *           split_narrative, pillar_destinations
 *
 * Usage:
 *   npm run seed:modern-pages
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
    key: "statement_band",
    name: "Statement Band",
    description: "Oversized typographic manifesto over a soft image wash",
    content_scope: "page",
    status: true,
  },
  {
    key: "bento_grid",
    name: "Bento Grid",
    description: "Asymmetric bento mosaic with image cells and metrics",
    content_scope: "page",
    status: true,
  },
  {
    key: "horizon_gallery",
    name: "Horizon Gallery",
    description: "Cinematic horizontal snap gallery with captions",
    content_scope: "page",
    status: true,
  },
  {
    key: "split_narrative",
    name: "Split Narrative",
    description: "Sticky media with scrolling story chapters",
    content_scope: "page",
    status: true,
  },
  {
    key: "pillar_destinations",
    name: "Pillar Destinations",
    description: "Tall destination pillars with hover image lift",
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

const INNOVATION_LAB = [
  {
    section_key: "statement_band",
    sort_order: 0,
    section_title: "Build the next capability layer",
    sub_title:
      "Innovation Lab is where strategy, craft, and delivery meet — programs shaped for teams that invent in public.",
    section_img_url:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=2000&q=80",
    data: {
      eyebrow: "Innovation Lab",
      body: "<p>Immersive studios, rapid experiments, and practitioner coaching in one continuous loop.</p>",
    },
    buttons: [
      btn("Enter the lab", { target_url: "/get-started", variant: "inverse", sort_order: 0 }),
    ],
  },
  {
    section_key: "bento_grid",
    sort_order: 1,
    section_title: "A mosaic of momentum",
    sub_title: "Spaces designed for focus, friction, and breakthrough.",
    items: [
      item(
        {
          value: "01",
          title: "Prototype studio",
          subtitle: "Ship ideas in days",
          body: "<p>Facilitated sprints with live feedback from product and engineering leads.</p>",
          image_url:
            "https://images.unsplash.com/photo-1498050108023-c34155e21af1?auto=format&fit=crop&w=1400&q=80",
        },
        0
      ),
      item(
        {
          value: "48h",
          title: "Build windows",
          subtitle: "Timeboxed intensity",
          image_url:
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
        },
        1
      ),
      item(
        {
          value: "12",
          title: "Coach pods",
          subtitle: "Always nearby",
          image_url:
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
        },
        2
      ),
      item(
        {
          value: "AI",
          title: "Model playground",
          subtitle: "Safe experimentation",
          body: "<p>Evaluate prompts, agents, and guardrails without risking production.</p>",
          image_url:
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80",
        },
        3
      ),
      item(
        {
          value: "Ops",
          title: "Runway reviews",
          image_url:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
        },
        4
      ),
      item(
        {
          value: "UX",
          title: "Experience crits",
          image_url:
            "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=900&q=80",
        },
        5
      ),
    ],
  },
  {
    section_key: "horizon_gallery",
    sort_order: 2,
    section_title: "Inside the lab",
    sub_title: "Swipe through the environments teams work in.",
    items: [
      item(
        {
          title: "Signal wall",
          subtitle: "Live metrics and experiment status across cohorts",
          image_url:
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2000&q=80",
        },
        0
      ),
      item(
        {
          title: "Maker bay",
          subtitle: "Hardware, sensors, and edge prototypes side by side",
          image_url:
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=80",
        },
        1
      ),
      item(
        {
          title: "Quiet forge",
          subtitle: "Deep-work rooms for architecture and writing",
          image_url:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=80",
        },
        2
      ),
      item(
        {
          title: "Night brief",
          subtitle: "End-of-sprint showcases with stakeholder panels",
          image_url:
            "https://images.unsplash.com/photo-1542744173-8e2bd2371532?auto=format&fit=crop&w=2000&q=80",
        },
        3
      ),
    ],
  },
  {
    section_key: "split_narrative",
    sort_order: 3,
    section_title: "How a lab engagement unfolds",
    sub_title: "Scroll the chapters — the image tracks with you.",
    section_img_url:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    items: [
      item(
        {
          value: "Chapter 01",
          title: "Frame the bet",
          subtitle: "What must be true in 90 days",
          body: "<p>We align on outcomes, constraints, and the smallest experiment that can change the roadmap.</p>",
          image_url:
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
        },
        0
      ),
      item(
        {
          value: "Chapter 02",
          title: "Assemble the pod",
          subtitle: "Cross-functional by design",
          body: "<p>Product, engineering, design, and data sit in the same room with a named facilitator.</p>",
          image_url:
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80",
        },
        1
      ),
      item(
        {
          value: "Chapter 03",
          title: "Ship evidence",
          subtitle: "Not decks — demos",
          body: "<p>Every sprint ends with something runnable, measurable, and ready for a go/no-go call.</p>",
          image_url:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
        },
        2
      ),
    ],
  },
  {
    section_key: "pillar_destinations",
    sort_order: 4,
    section_title: "Continue exploring",
    sub_title: "Jump into adjacent modern experiences.",
    items: [
      item(
        {
          title: "Learning Studio",
          subtitle: "Immersive craft spaces",
          body: "<p>Studios built for deep practice and critique.</p>",
          href: "/learning-studio",
          image_url:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
        },
        0
      ),
      item(
        {
          title: "Capability Map",
          subtitle: "See the whole system",
          body: "<p>Role paths visualized as destinations, not catalogs.</p>",
          href: "/capability",
          image_url:
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
        },
        1
      ),
      item(
        {
          title: "Immersive",
          subtitle: "Full sensory storytelling",
          body: "<p>Galleries and narratives that feel cinematic.</p>",
          href: "/immersive",
          image_url:
            "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
        },
        2
      ),
    ],
  },
];

const LEARNING_STUDIO = [
  {
    section_key: "statement_band",
    sort_order: 0,
    section_title: "Where craft gets louder",
    sub_title:
      "Learning Studio is a sequence of spaces — critique rooms, quiet floors, and live stages — designed for people who learn by making.",
    section_img_url:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=2000&q=80",
    data: {
      eyebrow: "Learning Studio",
      body: "<p>Less lecture. More reps. Visible progress every week.</p>",
    },
    buttons: [
      btn("Book a studio tour", {
        target_url: "/get-started",
        variant: "inverse",
        sort_order: 0,
      }),
    ],
  },
  {
    section_key: "horizon_gallery",
    sort_order: 1,
    section_title: "Walk the floors",
    sub_title: "A cinematic tour of the studio environments.",
    items: [
      item(
        {
          title: "Critique loft",
          subtitle: "Work pinned, discussed, improved in the open",
          image_url:
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80",
        },
        0
      ),
      item(
        {
          title: "Focus floor",
          subtitle: "Soft light, deep work, no status theater",
          image_url:
            "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=2000&q=80",
        },
        1
      ),
      item(
        {
          title: "Stage hall",
          subtitle: "Present to peers, then to stakeholders",
          image_url:
            "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=2000&q=80",
        },
        2
      ),
      item(
        {
          title: "Material library",
          subtitle: "Patterns, kits, and references for every craft",
          image_url:
            "https://images.unsplash.com/photo-1481627834876-b7833e1bd29f?auto=format&fit=crop&w=2000&q=80",
        },
        3
      ),
    ],
  },
  {
    section_key: "bento_grid",
    sort_order: 2,
    section_title: "Studio ingredients",
    sub_title: "Everything you need to raise the quality of practice.",
    items: [
      item(
        {
          value: "Live",
          title: "Facilitated sessions",
          body: "<p>Practitioners who teach from recent delivery, not slides from 2019.</p>",
          image_url:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80",
        },
        0
      ),
      item(
        {
          value: "Async",
          title: "Practice packs",
          image_url:
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80",
        },
        1
      ),
      item(
        {
          value: "Peer",
          title: "Review circles",
          image_url:
            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
        },
        2
      ),
      item(
        {
          value: "Show",
          title: "Weekly demos",
          subtitle: "Evidence over attendance",
          body: "<p>Managers see what changed — not just who logged in.</p>",
          image_url:
            "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1400&q=80",
        },
        3
      ),
    ],
  },
  {
    section_key: "split_narrative",
    sort_order: 3,
    section_title: "A week in the studio",
    items: [
      item(
        {
          value: "Mon",
          title: "Frame & friction",
          subtitle: "Name the hard problem",
          body: "<p>Cohorts surface blockers and pick the week’s craft focus with a coach.</p>",
          image_url:
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
        },
        0
      ),
      item(
        {
          value: "Wed",
          title: "Make & critique",
          subtitle: "Ship drafts early",
          body: "<p>Work gets reviewed mid-week so Friday isn’t a scramble.</p>",
          image_url:
            "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
        },
        1
      ),
      item(
        {
          value: "Fri",
          title: "Show & decide",
          subtitle: "Close the loop",
          body: "<p>Demos, decisions, and a clear ask for the next sprint of learning.</p>",
          image_url:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
        },
        2
      ),
    ],
  },
  {
    section_key: "pillar_destinations",
    sort_order: 4,
    section_title: "Where to go next",
    items: [
      item(
        {
          title: "Innovation Lab",
          subtitle: "Experiment hard",
          href: "/innovation-lab",
          image_url:
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
        },
        0
      ),
      item(
        {
          title: "Immersive",
          subtitle: "Story-first journeys",
          href: "/immersive",
          image_url:
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
        },
        1
      ),
      item(
        {
          title: "Capability",
          subtitle: "Map the system",
          href: "/capability",
          image_url:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
        },
        2
      ),
    ],
  },
];

const CAPABILITY = [
  {
    section_key: "statement_band",
    sort_order: 0,
    section_title: "See capability as a landscape",
    sub_title:
      "Not a spreadsheet of courses — a map of destinations your people can actually reach.",
    section_img_url:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=2000&q=80",
    data: {
      eyebrow: "Capability Map",
      body: "<p>Roles, skills, and proof points arranged like places on a journey.</p>",
    },
    buttons: [
      btn("Chart a path", {
        target_url: "/get-started",
        variant: "inverse",
        sort_order: 0,
      }),
    ],
  },
  {
    section_key: "pillar_destinations",
    sort_order: 1,
    section_title: "Primary destinations",
    sub_title: "Pick a horizon — each pillar opens a different depth of practice.",
    items: [
      item(
        {
          title: "Cloud craft",
          subtitle: "Platform & reliability",
          body: "<p>Landing zones, Kubernetes, FinOps — readiness you can measure.</p>",
          href: "/cloud-academy",
          image_url:
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
        },
        0
      ),
      item(
        {
          title: "Security depth",
          subtitle: "Defend & deliver",
          body: "<p>Zero-trust, secure delivery, and response under pressure.</p>",
          href: "/security-lab",
          image_url:
            "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
        },
        1
      ),
      item(
        {
          title: "Data fluency",
          subtitle: "Decide with evidence",
          body: "<p>Analytics, modeling, and AI literacy for builders and leaders.</p>",
          href: "/data-academy",
          image_url:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
        },
        2
      ),
    ],
  },
  {
    section_key: "bento_grid",
    sort_order: 2,
    section_title: "Signals on the map",
    sub_title: "What leaders watch while teams travel the path.",
    items: [
      item(
        {
          value: "3.2×",
          title: "Faster competency",
          subtitle: "vs ad-hoc training",
          image_url:
            "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1400&q=80",
        },
        0
      ),
      item(
        {
          value: "87%",
          title: "Manager confidence",
          image_url:
            "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80",
        },
        1
      ),
      item(
        {
          value: "14d",
          title: "Pilot launch",
          image_url:
            "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=900&q=80",
        },
        2
      ),
      item(
        {
          value: "Roles",
          title: "Aligned to work",
          subtitle: "Not generic catalogs",
          body: "<p>Every destination maps to a job family and delivery milestone.</p>",
          image_url:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
        },
        3
      ),
    ],
  },
  {
    section_key: "horizon_gallery",
    sort_order: 3,
    section_title: "Landscapes of practice",
    items: [
      item(
        {
          title: "Architecture ridgeline",
          subtitle: "From foundations to multi-region design",
          image_url:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80",
        },
        0
      ),
      item(
        {
          title: "Security coastline",
          subtitle: "Controls that travel with the code",
          image_url:
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2000&q=80",
        },
        1
      ),
      item(
        {
          title: "Data delta",
          subtitle: "Warehouses, models, and decision rituals",
          image_url:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2000&q=80",
        },
        2
      ),
    ],
  },
  {
    section_key: "split_narrative",
    sort_order: 4,
    section_title: "How we draw the map with you",
    items: [
      item(
        {
          value: "01",
          title: "Audit the terrain",
          subtitle: "Roles, tools, and gaps",
          body: "<p>We inventory what people actually do — not what the org chart claims.</p>",
          image_url:
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
        },
        0
      ),
      item(
        {
          value: "02",
          title: "Place the destinations",
          subtitle: "Prioritized horizons",
          body: "<p>Together we pick 3–5 destinations that unlock the next business milestone.</p>",
          image_url:
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
        },
        1
      ),
      item(
        {
          value: "03",
          title: "Open the trails",
          subtitle: "Cohorts + proof",
          body: "<p>Paths go live with labs, coaches, and signals leaders can trust.</p>",
          image_url:
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
        },
        2
      ),
    ],
  },
];

const IMMERSIVE = [
  {
    section_key: "statement_band",
    sort_order: 0,
    section_title: "Feel the story before you study it",
    sub_title:
      "Immersive is a cinematic learning journey — galleries, narratives, and pillars that pull people in.",
    section_img_url:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=2000&q=80",
    data: {
      eyebrow: "Immersive",
      body: "<p>Designed for brand moments, launch weeks, and transformation kickoffs.</p>",
    },
    buttons: [
      btn("Start immersive", {
        target_url: "/get-started",
        variant: "inverse",
        sort_order: 0,
      }),
    ],
  },
  {
    section_key: "horizon_gallery",
    sort_order: 1,
    section_title: "Scenes from the journey",
    sub_title: "Full-bleed panels — scroll or click through.",
    items: [
      item(
        {
          title: "Opening night",
          subtitle: "Kickoff energy without the conference cliché",
          image_url:
            "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=2000&q=80",
        },
        0
      ),
      item(
        {
          title: "Deep corridor",
          subtitle: "Quiet passages between high-energy rooms",
          image_url:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2000&q=80",
        },
        1
      ),
      item(
        {
          title: "Light room",
          subtitle: "Where demos land and decisions stick",
          image_url:
            "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=2000&q=80",
        },
        2
      ),
      item(
        {
          title: "Afterglow",
          subtitle: "Reflection, notes, and the next commitment",
          image_url:
            "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2000&q=80",
        },
        3
      ),
    ],
  },
  {
    section_key: "split_narrative",
    sort_order: 2,
    section_title: "Act by act",
    sub_title: "A narrative arc leaders and learners share.",
    items: [
      item(
        {
          value: "Act I",
          title: "Tension",
          subtitle: "Name the gap",
          body: "<p>We surface the business pressure and the human cost of standing still.</p>",
          image_url:
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
        },
        0
      ),
      item(
        {
          value: "Act II",
          title: "Practice",
          subtitle: "Change the muscle",
          body: "<p>Galleries give way to guided practice — still beautiful, now deliberate.</p>",
          image_url:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
        },
        1
      ),
      item(
        {
          value: "Act III",
          title: "Proof",
          subtitle: "Show the shift",
          body: "<p>Stakeholders see demos, skill signals, and a clear scale plan.</p>",
          image_url:
            "https://images.unsplash.com/photo-1542744173-8e2bd2371532?auto=format&fit=crop&w=1200&q=80",
        },
        2
      ),
    ],
  },
  {
    section_key: "bento_grid",
    sort_order: 3,
    section_title: "Moments that stick",
    items: [
      item(
        {
          value: "Sound",
          title: "Spatial audio briefs",
          image_url:
            "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1400&q=80",
        },
        0
      ),
      item(
        {
          value: "Light",
          title: "Projection rooms",
          image_url:
            "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=80",
        },
        1
      ),
      item(
        {
          value: "Touch",
          title: "Hands-on kits",
          image_url:
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80",
        },
        2
      ),
      item(
        {
          value: "Share",
          title: "Collective demos",
          subtitle: "Everyone on stage once",
          body: "<p>Confidence compounds when the whole cohort presents.</p>",
          image_url:
            "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1400&q=80",
        },
        3
      ),
    ],
  },
  {
    section_key: "pillar_destinations",
    sort_order: 4,
    section_title: "Carry the energy forward",
    items: [
      item(
        {
          title: "Innovation Lab",
          subtitle: "Keep experimenting",
          href: "/innovation-lab",
          image_url:
            "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
        },
        0
      ),
      item(
        {
          title: "Learning Studio",
          subtitle: "Deepen the craft",
          href: "/learning-studio",
          image_url:
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
        },
        1
      ),
      item(
        {
          title: "Capability Map",
          subtitle: "Scale the path",
          href: "/capability",
          image_url:
            "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80",
        },
        2
      ),
    ],
  },
];

async function seed() {
  await connectDB();

  console.log("Ensuring content template…");
  await ensureContentPage();

  const pages = [
    {
      content: await ensureContent({
        name: "Innovation Lab",
        slug: "innovation-lab",
        path: "/innovation-lab",
        description: "Modern innovation lab — statement, bento, gallery, narrative.",
        status: "active",
        sortOrder: 100,
      }),
      label: "Innovation Lab",
      placements: INNOVATION_LAB,
    },
    {
      content: await ensureContent({
        name: "Learning Studio",
        slug: "learning-studio",
        path: "/learning-studio",
        description: "Immersive learning studio with cinematic galleries.",
        status: "active",
        sortOrder: 110,
      }),
      label: "Learning Studio",
      placements: LEARNING_STUDIO,
    },
    {
      content: await ensureContent({
        name: "Capability Map",
        slug: "capability",
        path: "/capability",
        description: "Capability destinations mapped as modern pillars and galleries.",
        status: "active",
        sortOrder: 120,
      }),
      label: "Capability Map",
      placements: CAPABILITY,
    },
    {
      content: await ensureContent({
        name: "Immersive",
        slug: "immersive",
        path: "/immersive",
        description: "Cinematic immersive learning journey — new sections only.",
        status: "active",
        sortOrder: 130,
      }),
      label: "Immersive",
      placements: IMMERSIVE,
    },
  ];

  console.log("Ensuring new section types…");
  const sectionByKey = new Map();
  for (const def of NEW_SECTIONS) {
    const section = await ensureSection(def);
    sectionByKey.set(def.key, section);
  }

  for (const { content, label, placements } of pages) {
    console.log(`Mapping ${label} (${content._id})…`);
    await replaceExtras("content", content._id, placements, sectionByKey);
    console.log(`  ${placements.length} placements (new sections only)`);
  }

  console.log("\nDone.");
  console.log("  http://localhost:3001/innovation-lab");
  console.log("  http://localhost:3001/learning-studio");
  console.log("  http://localhost:3001/capability");
  console.log("  http://localhost:3001/immersive");
  console.log("  CMS: append ?cms=1");

  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("modern-pages seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
