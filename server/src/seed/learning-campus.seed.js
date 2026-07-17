/**
 * Seeds a visual Content page at /learning-campus —
 * many image/video grids telling a meaningful SkillHub campus story.
 *
 * Sections used:
 *   in_page_nav, hero_media, statement_band, bento_grid, horizon_gallery,
 *   overview (rich HTML + video embeds), feature_tabs, card_stack,
 *   feature_spotlight, pillar_destinations, split_narrative,
 *   masonry_quotes, metric_rail, cta_band
 *
 * Usage:
 *   npm run seed:learning-campus
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

function videoEmbed(youtubeId) {
  const src = `https://www.youtube.com/embed/${youtubeId}`;
  return `<div data-video-embed="true" data-provider="youtube" data-src="${src}" class="cms-rich-video"><iframe src="${src}" title="Embedded video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="true" frameborder="0" class="cms-rich-video-el"></iframe></div>`;
}

const SECTION_DEFS = [
  { key: "in_page_nav", name: "In-page Nav", description: "Sticky section jump links", content_scope: "page" },
  { key: "hero_media", name: "Hero Media", description: "Slider hero with side media / video", content_scope: "page" },
  { key: "statement_band", name: "Statement Band", description: "Oversized typographic band", content_scope: "page" },
  { key: "bento_grid", name: "Bento Grid", description: "Asymmetric mosaic grid", content_scope: "page" },
  { key: "horizon_gallery", name: "Horizon Gallery", description: "Horizontal snap gallery", content_scope: "page" },
  { key: "overview", name: "Overview", description: "Rich text overview with media", content_scope: "page" },
  { key: "feature_tabs", name: "Feature Tabs", description: "Tabbed features with preview", content_scope: "page" },
  { key: "card_stack", name: "Card Stack", description: "Sticky stacking cards", content_scope: "page" },
  { key: "feature_spotlight", name: "Feature Spotlight", description: "Asymmetric spotlight cards", content_scope: "page" },
  { key: "pillar_destinations", name: "Pillar Destinations", description: "Tall destination pillars", content_scope: "page" },
  { key: "split_narrative", name: "Split Narrative", description: "Sticky media + chapters", content_scope: "page" },
  { key: "masonry_quotes", name: "Masonry Quotes", description: "Masonry testimonial wall", content_scope: "page" },
  { key: "metric_rail", name: "Metric Rail", description: "Metric strip", content_scope: "page" },
  { key: "cta_band", name: "CTA Band", description: "Full-bleed call to action", content_scope: "page" },
];

const SLIDE_BG =
  "linear-gradient(125deg, #0b1f4d 0%, #12305f 45%, #0a1740 100%)";

const CAMPUS_PLACEMENTS = [
  { section_key: "in_page_nav", sort_order: 0 },
  {
    section_key: "hero_media",
    sort_order: 1,
    in_page_nav_title: "Campus",
    items: [
      item(
        {
          title: "Welcome to the Learning Campus",
          subtitle:
            "A living map of studios, labs, and cohort spaces where SkillHub teams practice real work — not just watch slides.",
          image_url:
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80",
          icon: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
          href: "https://www.youtube.com/watch?v=u4ZoJKF_VuA",
          bg_color: SLIDE_BG,
          buttons: [
            btn("Tour the campus", {
              target_url: "#spaces",
              variant: "inverse",
              sort_order: 0,
            }),
            btn("Start a cohort", {
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
          title: "From classroom energy to production habits",
          subtitle:
            "Watch how facilitators, peers, and managers keep learning alive after the session ends.",
          image_url:
            "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=2000&q=80",
          icon: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
          href: "https://www.youtube.com/watch?v=aircAruvnKk",
          bg_color: SLIDE_BG,
          buttons: [
            btn("See learning modes", {
              target_url: "#modes",
              variant: "inverse",
              sort_order: 0,
            }),
          ],
        },
        1
      ),
      item(
        {
          title: "Outcomes you can show a sponsor",
          subtitle:
            "Evidence walls, demo days, and role readiness — capability the business can feel.",
          image_url:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=2000&q=80",
          icon: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=80",
          href: "https://www.youtube.com/watch?v=hVimVzgtD6w",
          bg_color: SLIDE_BG,
          buttons: [
            btn("Browse courses", {
              target_url: "/courses",
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
    section_key: "statement_band",
    sort_order: 2,
    in_page_nav_title: "Promise",
    section_title: "Learning that looks like the work",
    sub_title:
      "The campus is designed so every path ends in a artifact, a conversation, or a system that ships.",
    section_img_url:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=2000&q=80",
    data: {
      eyebrow: "SkillHub Campus",
      body: "<p>Studios for craft. Labs for risk. Circles for coaching. Galleries for proof.</p>",
    },
    buttons: [
      btn("Book a campus walkthrough", {
        target_url: "/get-started",
        variant: "inverse",
        sort_order: 0,
      }),
    ],
  },
  {
    section_key: "bento_grid",
    sort_order: 3,
    in_page_nav_title: "Spaces",
    section_title: "Campus spaces at a glance",
    sub_title:
      "Six environments teams move through during a typical SkillHub engagement.",
    items: [
      item(
        {
          value: "01",
          title: "Signal atrium",
          subtitle: "Orientation & kickoff",
          body: "<p>Cohorts meet sponsors, map outcomes, and pick the first performance moment to improve.</p>",
          image_url:
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80",
        },
        0
      ),
      item(
        {
          value: "Labs",
          title: "Cloud forge",
          subtitle: "Hands-on sandboxes",
          image_url:
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
        },
        1
      ),
      item(
        {
          value: "Pods",
          title: "Coach circles",
          subtitle: "Manager practice",
          image_url:
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=80",
        },
        2
      ),
      item(
        {
          value: "AI",
          title: "Model courtyard",
          subtitle: "Governed AI practice",
          body: "<p>Prompt clinics, red-team Fridays, and approved tool sandboxes.</p>",
          image_url:
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80",
        },
        3
      ),
      item(
        {
          value: "Demo",
          title: "Showcase gallery",
          subtitle: "Evidence on walls",
          image_url:
            "https://images.unsplash.com/photo-1542744173-8e2bd2371532?auto=format&fit=crop&w=900&q=80",
        },
        4
      ),
      item(
        {
          value: "Deep",
          title: "Quiet forge",
          subtitle: "Focus rooms",
          image_url:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
        },
        5
      ),
    ],
  },
  {
    section_key: "horizon_gallery",
    sort_order: 4,
    in_page_nav_title: "Tour",
    section_title: "A walk through the campus",
    sub_title: "Swipe the gallery — each frame is a real learning moment.",
    items: [
      item(
        {
          title: "Morning stand-up in the atrium",
          subtitle: "Cohorts share blockers before labs open",
          image_url:
            "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=2000&q=80",
        },
        0
      ),
      item(
        {
          title: "Pairing in the cloud forge",
          subtitle: "Architects and SREs debug landing zones together",
          image_url:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=2000&q=80",
        },
        1
      ),
      item(
        {
          title: "Coach circle after a tough 1:1",
          subtitle: "Managers rehearse conversations with live feedback",
          image_url:
            "https://images.unsplash.com/photo-1573164713714-d95e4369651d?auto=format&fit=crop&w=2000&q=80",
        },
        2
      ),
      item(
        {
          title: "Demo day under the gallery lights",
          subtitle: "Sponsors see artifacts, not slide decks alone",
          image_url:
            "https://images.unsplash.com/photo-1475724017902-d9bdbdfe130a?auto=format&fit=crop&w=2000&q=80",
        },
        3
      ),
      item(
        {
          title: "Night brief on the signal wall",
          subtitle: "Metrics update as practice turns into performance",
          image_url:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80",
        },
        4
      ),
    ],
  },
  {
    section_key: "overview",
    sort_order: 5,
    in_page_nav_title: "Film",
    section_title: "See the campus in motion",
    sub_title:
      "Short films that capture how SkillHub turns attendance into capability.",
    data: {
      body: `<p>These clips are the same language we use with sponsors: practice under real constraints, manager loops, and evidence you can put on a wall.</p>
${videoEmbed("u4ZoJKF_VuA")}
<p><strong>Why start with purpose.</strong> Teams that name the performance moment first choose better labs and better metrics.</p>
${videoEmbed("W3I3kAg2J7w")}
<p><strong>Habits after the workshop.</strong> Coaching sticks when it fits the calendar — short drills, peer practice, visible sponsorship.</p>
${videoEmbed("aircAruvnKk")}
<p><strong>Building AI literacy responsibly.</strong> The model courtyard is where governed practice meets role-based decisions.</p>`,
    },
  },
  {
    section_key: "feature_tabs",
    sort_order: 6,
    in_page_nav_title: "Modes",
    section_title: "Four ways teams learn on campus",
    sub_title: "Pick a mode — each one maps to a different kind of work.",
    items: [
      item(
        {
          title: "Studio intensives",
          subtitle: "48–72 hour build windows",
          body: "<p>Facilitated sprints with product and engineering coaches. Leave with a working prototype and a backlog of next experiments.</p>",
          image_url:
            "https://images.unsplash.com/photo-1498050108023-c34155e21af1?auto=format&fit=crop&w=1400&q=80",
          label: "Studio",
        },
        0
      ),
      item(
        {
          title: "Lab rotations",
          subtitle: "Weekly hands-on practice",
          body: "<p>Sandboxes that mirror production. Learners ship small, review with peers, and collect evidence for role readiness.</p>",
          image_url:
            "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
          label: "Labs",
        },
        1
      ),
      item(
        {
          title: "Coach circles",
          subtitle: "Manager & peer habits",
          body: "<p>Conversation maps, micro-drills, and skip-level sponsorship so skills survive Monday morning.</p>",
          image_url:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80",
          label: "Coaching",
        },
        2
      ),
      item(
        {
          title: "Showcase galleries",
          subtitle: "Proof for sponsors",
          body: "<p>Demo days and evidence walls that make capability visible — artifacts, metrics, and stories in one place.</p>",
          image_url:
            "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=80",
          label: "Showcase",
        },
        3
      ),
    ],
  },
  {
    section_key: "card_stack",
    sort_order: 7,
    in_page_nav_title: "Journey",
    section_title: "A 90-day campus journey",
    sub_title: "Scroll the stack — each card is a phase sponsors recognize.",
    items: [
      item(
        {
          title: "Days 1–14 · Align",
          subtitle: "Name the performance moment",
          body: "<p>Sponsors and L&amp;D agree outcomes, baselines, and the first role to improve. Orientation in the atrium sets the shared brief.</p>",
          image_url:
            "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
          value: "01",
        },
        0
      ),
      item(
        {
          title: "Days 15–45 · Practice",
          subtitle: "Labs + coach circles",
          body: "<p>Weekly labs build skill under constraints. Managers run short rehearsal loops so habits stick outside the session.</p>",
          image_url:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
          value: "02",
        },
        1
      ),
      item(
        {
          title: "Days 46–75 · Apply",
          subtitle: "Real work artifacts",
          body: "<p>Learners ship into live projects. Reviews score quality, not just attendance. The signal wall starts to move.</p>",
          image_url:
            "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1200&q=80",
          value: "03",
        },
        2
      ),
      item(
        {
          title: "Days 76–90 · Prove",
          subtitle: "Showcase & next path",
          body: "<p>Demo day for sponsors. Retire weak paths. Double down on what lifted performance. Plan the next role cohort.</p>",
          image_url:
            "https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=1200&q=80",
          value: "04",
        },
        3
      ),
    ],
  },
  {
    section_key: "feature_spotlight",
    sort_order: 8,
    in_page_nav_title: "Highlights",
    section_title: "Moments worth pausing for",
    sub_title: "Signature campus experiences learners remember — and sponsors fund again.",
    items: [
      item(
        {
          title: "Evidence walls",
          subtitle: "Make capability visible",
          body: "<p>Before/after artifacts, lab scores, and manager notes hung where leaders walk. Learning stops being invisible work.</p>",
          image_url:
            "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1400&q=80",
        },
        0
      ),
      item(
        {
          title: "Red-team Fridays",
          subtitle: "Break it safely",
          body: "<p>AI and security cohorts deliberately stress-test assistants and controls — then publish what failed.</p>",
          image_url:
            "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1400&q=80",
        },
        1
      ),
      item(
        {
          title: "Sponsor office hours",
          subtitle: "Close the loop",
          body: "<p>Business owners sit with cohorts monthly to recalibrate outcomes and unblock real projects.</p>",
          image_url:
            "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1400&q=80",
        },
        2
      ),
    ],
  },
  {
    section_key: "pillar_destinations",
    sort_order: 9,
    in_page_nav_title: "Paths",
    section_title: "Choose a campus path",
    sub_title: "Each pillar is a destination — pick where your team starts.",
    items: [
      item(
        {
          title: "Cloud & platform",
          subtitle: "Architect · SRE · DevOps",
          body: "<p>Landing zones, reliability drills, and certification that maps to delivery.</p>",
          image_url:
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
          href: "/courses",
          label: "Explore",
        },
        0
      ),
      item(
        {
          title: "AI & data",
          subtitle: "Builders · analysts · leaders",
          body: "<p>Governed practice, lakehouse skills, and decisions that stay accountable.</p>",
          image_url:
            "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=900&q=80",
          href: "/vendors",
          label: "Explore",
        },
        1
      ),
      item(
        {
          title: "Leadership habits",
          subtitle: "Managers · coaches",
          body: "<p>Conversation maps, peer practice, and sponsorship that survives the calendar.</p>",
          image_url:
            "https://images.unsplash.com/photo-1542744173-8e2bd585f281?auto=format&fit=crop&w=900&q=80",
          href: "/blogs",
          label: "Explore",
        },
        2
      ),
      item(
        {
          title: "Security & risk",
          subtitle: "Defenders · auditors",
          body: "<p>Threat labs, policy clinics, and drills that mirror your edge.</p>",
          image_url:
            "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80",
          href: "/get-started",
          label: "Explore",
        },
        3
      ),
    ],
  },
  {
    section_key: "split_narrative",
    sort_order: 10,
    in_page_nav_title: "Story",
    section_title: "One team’s week on campus",
    sub_title: "Scroll the chapters — the media stays with you.",
    section_img_url:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    items: [
      item(
        {
          title: "Monday · Brief",
          body: "<p>The platform squad meets sponsors in the atrium. They pick one reliability incident type to improve this month.</p>",
          image_url:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=80",
        },
        0
      ),
      item(
        {
          title: "Wednesday · Lab",
          body: "<p>In the cloud forge they rehearse runbooks on a sandbox that looks like production — failures included.</p>",
          image_url:
            "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1000&q=80",
        },
        1
      ),
      item(
        {
          title: "Thursday · Coach",
          body: "<p>Managers practice escalation conversations in coach circles, then use the same map in live 1:1s.</p>",
          image_url:
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1000&q=80",
        },
        2
      ),
      item(
        {
          title: "Friday · Prove",
          body: "<p>Demo day: a shorter MTTR story, a cleaner dashboard, and a request to fund the next cohort.</p>",
          image_url:
            "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1000&q=80",
        },
        3
      ),
    ],
  },
  {
    section_key: "masonry_quotes",
    sort_order: 11,
    in_page_nav_title: "Voices",
    section_title: "Voices from the campus",
    sub_title: "Learners, managers, and sponsors on what changed.",
    items: [
      item(
        {
          title: "Priya R.",
          subtitle: "Platform engineering lead",
          body: "<p>We stopped measuring course completions. The evidence wall made it obvious which labs actually changed our incident response.</p>",
          image_url:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        },
        0
      ),
      item(
        {
          title: "Marcus T.",
          subtitle: "Engineering manager",
          body: "<p>Coach circles gave me language I could use the same afternoon. That was the difference between a workshop and a habit.</p>",
          image_url:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
        },
        1
      ),
      item(
        {
          title: "Elena V.",
          subtitle: "Learning partner",
          body: "<p>Demo day is when finance finally understood the investment. Artifacts beat NPS every time.</p>",
          image_url:
            "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
        },
        2
      ),
      item(
        {
          title: "Daniel O.",
          subtitle: "AI practice lead",
          body: "<p>The model courtyard let us move fast without pretending risk does not exist. That balance is the product.</p>",
          image_url:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        },
        3
      ),
      item(
        {
          title: "Samir P.",
          subtitle: "Curriculum architect",
          body: "<p>We retired half the catalog after one campus cycle. Focus beat volume — and learners thanked us.</p>",
          image_url:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        },
        4
      ),
      item(
        {
          title: "Maya C.",
          subtitle: "Strategy sponsor",
          body: "<p>I finally got a dashboard that told a story: practice → performance → outcome. That is what I fund.</p>",
          image_url:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
        },
        5
      ),
    ],
  },
  {
    section_key: "metric_rail",
    sort_order: 12,
    in_page_nav_title: "Impact",
    section_title: "Campus by the numbers",
    items: [
      item({ value: "90", label: "Day journey length", title: "Days" }, 0),
      item({ value: "6", label: "Signature spaces", title: "Studios" }, 1),
      item({ value: "4", label: "Learning modes", title: "Modes" }, 2),
      item({ value: "12+", label: "Vendor paths on campus", title: "Paths" }, 3),
    ],
  },
  {
    section_key: "cta_band",
    sort_order: 13,
    in_page_nav_title: "Visit",
    section_title: "Bring your team to campus",
    sub_title:
      "Start with a walkthrough, a pilot cohort, or a single role path — we will help you pick the first performance moment.",
    buttons: [
      btn("Plan a pilot", {
        target_url: "/get-started",
        sort_order: 0,
      }),
      btn("Browse courses", {
        target_url: "/courses",
        variant: "secondary",
        sort_order: 1,
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
  console.log("Seeding Learning Campus content page…");

  await ensureContentPage();

  const sectionByKey = new Map();
  for (const def of SECTION_DEFS) {
    const section = await ensureSection(def);
    sectionByKey.set(def.key, section);
  }

  const content = await Content.findOneAndUpdate(
    { path: "/learning-campus" },
    {
      $set: {
        path: "/learning-campus",
        slug: "learning-campus",
        name: "Learning Campus",
        description:
          "A visual tour of SkillHub’s learning campus — studios, labs, coach circles, and showcase galleries where capability is practiced and proven.",
        status: "active",
        sortOrder: 40,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );

  await replaceExtras(
    "content",
    content._id,
    CAMPUS_PLACEMENTS,
    sectionByKey
  );

  console.log(
    `  ✓ /learning-campus (${CAMPUS_PLACEMENTS.length} sections) — ${content._id}`
  );
  console.log("Done. Open http://localhost:3001/learning-campus");
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
