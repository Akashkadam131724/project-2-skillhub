/**
 * Seeds a promotional Content page at /odyssey —
 * Christopher Nolan’s The Odyssey (in theaters July 17, 2026).
 * Heavy on hero video, trailer embeds, cast imagery, and IMAX story.
 *
 * Usage:
 *   npm run seed:odyssey
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

const TRAILER_NEW = "f_bKjZeJBBI";

/** Official Universal / promo stills from The Odyssey only */
const STILL = {
  damon:
    "https://cdn.moviefone.com/admin-uploads/highlights/images/the-odyssey-matt-damon_1778006855.webp",
  holland:
    "https://cdn.moviefone.com/admin-uploads/highlights/images/the-odyssey-tom-holland_1778004418.webp",
  hathawayHolland:
    "https://cdn.moviefone.com/admin-uploads/highlights/images/the-odyssey-anne-hathaway-tom-holland_1778004724.webp",
  pattinson:
    "https://cdn.moviefone.com/admin-uploads/highlights/images/the-odyssey-robert-pattinson_1778004287.webp",
  leguizamo:
    "https://cdn.moviefone.com/admin-uploads/highlights/images/the-odyssey-john-leguizamo_1778004160.webp",
  damonZendaya:
    "https://cdn.moviefone.com/admin-uploads/highlights/images/the-odyssey-matt-damon-zendaya_1778004819.webp",
  gothHathaway:
    "https://cdn.moviefone.com/admin-uploads/highlights/images/the-odyssey-mia-goth-anne-hathaway_1778004540.webp",
  crew:
    "https://cdn.moviefone.com/admin-uploads/highlights/images/the-odyssey-jimmy-gonzales-matt-damon-himesh-patel_1778005013.webp",
  poster:
    "https://cdn.moviefone.com/admin-uploads/highlights/images/the-odyssey-official-poster_1782585601.webp",
  epic:
    "https://www.motionpictures.org/wp-content/uploads/2026/05/CT-K020-18_CROP.jpg",
  odysseus:
    "https://www.motionpictures.org/wp-content/uploads/2026/05/CT-03414-1.jpg",
  antinous:
    "https://www.motionpictures.org/wp-content/uploads/2026/05/CT-32577CC_MSG.jpg",
  eumaeus:
    "https://www.motionpictures.org/wp-content/uploads/2026/05/CT-33116CC.jpg",
  ithaca:
    "https://www.motionpictures.org/wp-content/uploads/2026/05/CT-19534.jpg",
  melantho:
    "https://www.motionpictures.org/wp-content/uploads/2026/05/CT-38345CC_MSG.jpg",
  voyage:
    "https://www.motionpictures.org/wp-content/uploads/2026/05/CT-02725_MSGR.jpg",
  set:
    "https://www.motionpictures.org/wp-content/uploads/2026/05/CT-06136_MSG.jpg",
  bow:
    "https://www.motionpictures.org/wp-content/uploads/2026/05/CT-44304_MSG.jpg",
  telemachus:
    "https://www.motionpictures.org/wp-content/uploads/2026/05/CT-54129_MSG.jpg",
  onset:
    "https://www.motionpictures.org/wp-content/uploads/2026/05/CT-47787.jpg",
  giants:
    "https://dx35vtwkllhj9.cloudfront.net/universalstudios/the-odyssey/images/gallery/image_giants.jpg",
};

const SECTION_DEFS = [
  { key: "in_page_nav", name: "In-page Nav", description: "Sticky section jump links", content_scope: "page" },
  { key: "video_banner", name: "Video Banner", description: "Full-width autoplay video banner", content_scope: "page" },
  { key: "metric_rail", name: "Metric Rail", description: "Metric strip", content_scope: "page" },
  { key: "horizon_gallery", name: "Horizon Gallery", description: "Horizontal snap gallery", content_scope: "page" },
  { key: "cast_profiles", name: "Cast Profiles", description: "Circular cast profile portraits", content_scope: "page" },
  { key: "feature_tabs", name: "Feature Tabs", description: "Tabbed features with preview", content_scope: "page" },
  { key: "feature_spotlight", name: "Feature Spotlight", description: "Asymmetric spotlight cards", content_scope: "page" },
  { key: "card_stack", name: "Card Stack", description: "Sticky stacking cards", content_scope: "page" },
  { key: "split_narrative", name: "Split Narrative", description: "Sticky media + chapters", content_scope: "page" },
  { key: "masonry_quotes", name: "Masonry Quotes", description: "Masonry testimonial wall", content_scope: "page" },
  { key: "pillar_destinations", name: "Pillar Destinations", description: "Tall destination pillars", content_scope: "page" },
  { key: "cta_band", name: "CTA Band", description: "Full-bleed call to action", content_scope: "page" },
];

const PLACEMENTS = [
  { section_key: "in_page_nav", sort_order: 0 },
  {
    section_key: "video_banner",
    sort_order: 1,
    in_page_nav_title: "Now",
    items: [
      item(
        {
          title: "The Odyssey",
          subtitle:
            "Christopher Nolan’s mythic action epic — Homer’s foundational saga, shot entirely on IMAX® film. In theaters July 17, 2026.",
          image_url: STILL.poster,
          href: `https://www.youtube.com/watch?v=${TRAILER_NEW}`,
          buttons: [
            btn("Watch trailer", {
              target_url: `https://www.youtube.com/watch?v=${TRAILER_NEW}`,
              variant: "inverse",
              open_in_new_tab: true,
              sort_order: 0,
            }),
            btn("Get tickets", {
              target_url: "https://www.odysseymovie.com",
              variant: "secondary",
              open_in_new_tab: true,
              sort_order: 1,
            }),
          ],
        },
        0
      ),
    ],
  },
  {
    section_key: "cast_profiles",
    sort_order: 2,
    in_page_nav_title: "Cast",
    section_title: "Meet the cast",
    sub_title:
      "The faces of Ithaca, Troy, and the mythic world beyond — Nolan’s ensemble for The Odyssey.",
    items: [
      item(
        {
          value: "Lead",
          title: "Matt Damon",
          subtitle: "Odysseus",
          body: "<p>King of Ithaca — warrior, husband, father — fighting gods and men to reclaim home.</p>",
          image_url: STILL.damon,
        },
        0
      ),
      item(
        {
          value: "Son",
          title: "Tom Holland",
          subtitle: "Telemachus",
          image_url: STILL.holland,
        },
        1
      ),
      item(
        {
          value: "Queen",
          title: "Anne Hathaway",
          subtitle: "Penelope",
          image_url: STILL.bow,
        },
        2
      ),
      item(
        {
          value: "Rival",
          title: "Robert Pattinson",
          subtitle: "Antinous",
          body: "<p>Chief among the suitors — refusing to believe Ithaca’s king will ever return.</p>",
          image_url: STILL.pattinson,
        },
        3
      ),
      item(
        {
          value: "Goddess",
          title: "Zendaya",
          subtitle: "Athena",
          image_url: STILL.damonZendaya,
        },
        4
      ),
      item(
        {
          value: "Ithaca",
          title: "Mia Goth",
          subtitle: "Melantho",
          image_url: STILL.gothHathaway,
        },
        5
      ),
      item(
        {
          value: "Ally",
          title: "John Leguizamo",
          subtitle: "Eumaeus",
          image_url: STILL.leguizamo,
        },
        6
      ),
      item(
        {
          value: "Crew",
          title: "Himesh Patel",
          subtitle: "Eurylochus",
          image_url: STILL.crew,
        },
        7
      ),
    ],
  },
  {
    section_key: "metric_rail",
    sort_order: 3,
    in_page_nav_title: "Facts",
    section_title: "Event cinema, by the numbers",
    items: [
      item({ value: "7.17.26", title: "Worldwide release", subtitle: "Theaters & IMAX" }, 0),
      item({ value: "100%", title: "Shot on IMAX®", subtitle: "First feature ever" }, 1),
      item({ value: "Homer", title: "Source saga", subtitle: "Foundational epic poem" }, 2),
      item({ value: "172", title: "Minutes", subtitle: "Runtime" }, 3),
    ],
  },
  {
    section_key: "horizon_gallery",
    sort_order: 4,
    in_page_nav_title: "World",
    section_title: "Stills from The Odyssey",
    sub_title:
      "Official Universal Pictures frames — armies, Ithaca, gods, and the road home.",
    items: [
      item(
        {
          title: "Odysseus leads",
          subtitle: "Matt Damon as the King of Ithaca",
          image_url: STILL.epic,
        },
        0
      ),
      item(
        {
          title: "Father & son",
          subtitle: "Penelope and Telemachus",
          image_url: STILL.ithaca,
        },
        1
      ),
      item(
        {
          title: "The voyage",
          subtitle: "Crew on the long road home",
          image_url: STILL.voyage,
        },
        2
      ),
      item(
        {
          title: "Athena & Odysseus",
          subtitle: "Zendaya and Matt Damon",
          image_url: STILL.damonZendaya,
        },
        3
      ),
      item(
        {
          title: "Antinous",
          subtitle: "Robert Pattinson among the suitors",
          image_url: STILL.antinous,
        },
        4
      ),
      item(
        {
          title: "Defy the gods",
          subtitle: "Official theatrical poster",
          image_url: STILL.poster,
        },
        5
      ),
    ],
  },
  {
    section_key: "feature_tabs",
    sort_order: 5,
    in_page_nav_title: "Story",
    section_title: "The journey home",
    sub_title: "War won. Home unfinished. Four threads of Nolan’s epic.",
    items: [
      item(
        {
          title: "Ithaca waits",
          subtitle: "A household without its king",
          body: "<p>Penelope holds the line against suitors. Telemachus grows into a man who still believes: <em>my dad is coming home.</em></p>",
          image_url: STILL.hathawayHolland,
          label: "Home",
        },
        0
      ),
      item(
        {
          title: "After Troy",
          subtitle: "Victory that costs everything",
          body: "<p>The war is over. Odysseus and his men begin the longest road — across seas that answer to gods, not kings.</p>",
          image_url: STILL.crew,
          label: "War",
        },
        1
      ),
      item(
        {
          title: "Monsters & myths",
          subtitle: "Gods, giants, and trials",
          body: "<p>Practical scale and IMAX immersion bring Homer’s wonders — and horrors — into the room with you.</p>",
          image_url: STILL.giants,
          label: "Myth",
        },
        2
      ),
      item(
        {
          title: "Vengeance & return",
          subtitle: "Bringing it all",
          body: "<p>Not even the gods can stand between Odysseus and home — when he returns, Ithaca will remember.</p>",
          image_url: STILL.bow,
          label: "Return",
        },
        3
      ),
    ],
  },
  {
    section_key: "feature_spotlight",
    sort_order: 6,
    in_page_nav_title: "IMAX",
    section_title: "Built for IMAX®",
    sub_title:
      "Nolan’s longest-held ambition — the first feature filmed entirely with IMAX cameras.",
    items: [
      item(
        {
          title: "Every frame, giant format",
          subtitle: "Intimate and epic on the same stock",
          body: "<p>From whispered vows to armies and open ocean — the entire film was captured for the largest screens in the world.</p>",
          image_url: STILL.epic,
          href: "https://www.odysseymovie.com",
        },
        0
      ),
      item(
        {
          title: "Practical scale",
          subtitle: "Thousands of soldiers. Real locations.",
          body: "<p>Shot across the world — including sequences that put the Trojan Horse and massed armies in camera, not only in pixels.</p>",
          image_url: STILL.onset,
        },
        1
      ),
      item(
        {
          title: "Theatrical only",
          subtitle: "July 17, 2026",
          body: "<p>Open in IMAX theaters worldwide. This is an event film meant to be seen together, loud, and large.</p>",
          image_url: STILL.poster,
          href: "https://www.odysseymovie.com",
        },
        2
      ),
    ],
  },
  {
    section_key: "card_stack",
    sort_order: 7,
    in_page_nav_title: "Why",
    section_title: "Why this is the cinema event of 2026",
    sub_title: "Scroll the stack — reasons to claim a seat on opening weekend.",
    items: [
      item(
        {
          title: "Nolan after Oppenheimer",
          subtitle: "Oscar-winning director’s next chapter",
          body: "<p>After Best Picture and Best Director, Nolan returns with his most expensive and ambitious film yet — a mythic action epic.</p>",
          image_url: STILL.odysseus,
          value: "01",
        },
        0
      ),
      item(
        {
          title: "A story everyone half-knows",
          subtitle: "Told so you can meet it fresh",
          body: "<p>Homer’s Odyssey is foundational — Nolan adapts it so audiences can come to the voyage new, not as homework.</p>",
          image_url: STILL.voyage,
          value: "02",
        },
        1
      ),
      item(
        {
          title: "Cast for the ages",
          subtitle: "Damon, Holland, Hathaway, Pattinson & more",
          body: "<p>A Syncopy / Universal event with a roster built for both intimate drama and blockbuster spectacle.</p>",
          image_url: STILL.damonZendaya,
          value: "03",
        },
        2
      ),
      item(
        {
          title: "Opening day is today",
          subtitle: "July 17, 2026",
          body: "<p>Same-day release alongside Spider-Man: Brand New Day — pick your screen, then stay for the myth.</p>",
          image_url: STILL.poster,
          value: "04",
        },
        3
      ),
    ],
  },
  {
    section_key: "split_narrative",
    sort_order: 8,
    in_page_nav_title: "Saga",
    section_title: "From Troy to Ithaca",
    sub_title: "Chapters of the voyage — sticky media, scrolling story.",
    section_img_url: STILL.epic,
    items: [
      item(
        {
          title: "The war ends",
          subtitle: "Chapter I",
          body: "<p>Victory at Troy. Odysseus turns toward home — and the gods begin their tests.</p>",
          image_url: STILL.crew,
        },
        0
      ),
      item(
        {
          title: "Seas & monsters",
          subtitle: "Chapter II",
          body: "<p>Storms, islands, and creatures that should not exist — filmed for IMAX immersion.</p>",
          image_url: STILL.giants,
        },
        1
      ),
      item(
        {
          title: "Ithaca under siege",
          subtitle: "Chapter III",
          body: "<p>Suitors fill the hall. Penelope weaves and waits. Telemachus learns what a king’s return means.</p>",
          image_url: STILL.ithaca,
        },
        2
      ),
      item(
        {
          title: "The king returns",
          subtitle: "Chapter IV",
          body: "<p>Home is not a harbor — it is a reckoning. Vengeance, reunion, and the end of the long road.</p>",
          image_url: STILL.bow,
        },
        3
      ),
    ],
  },
  {
    section_key: "masonry_quotes",
    sort_order: 9,
    in_page_nav_title: "Lines",
    section_title: "Lines from the trailers",
    sub_title: "Dialogue already echoing through opening week.",
    items: [
      item(
        {
          body: "<p>Help me go home.</p>",
          title: "Odysseus",
          subtitle: "Matt Damon",
          image_url: STILL.damon,
        },
        0
      ),
      item(
        {
          body: "<p>Ithaca’s king is coming back.</p>",
          title: "Penelope",
          subtitle: "Anne Hathaway",
          image_url: STILL.bow,
        },
        1
      ),
      item(
        {
          body: "<p>My dad is coming home.</p>",
          title: "Telemachus",
          subtitle: "Tom Holland",
          image_url: STILL.holland,
        },
        2
      ),
      item(
        {
          body: "<p>No one can stand between me and home. Not even the gods.</p>",
          title: "Odysseus",
          subtitle: "Matt Damon",
          image_url: STILL.odysseus,
        },
        3
      ),
      item(
        {
          body: "<p>You’re a man who needs to control his fate. But you cannot control this.</p>",
          title: "Athena",
          subtitle: "Zendaya",
          image_url: STILL.damonZendaya,
        },
        4
      ),
      item(
        {
          body: "<p>Bringing vengeance? Bringing it all.</p>",
          title: "The return",
          subtitle: "Official New Trailer",
          image_url: STILL.poster,
        },
        5
      ),
    ],
  },
  {
    section_key: "pillar_destinations",
    sort_order: 10,
    in_page_nav_title: "Go",
    section_title: "Keep the voyage going",
    sub_title: "Official destinations for tickets, trailers, and social.",
    items: [
      item(
        {
          title: "Official site",
          subtitle: "Tickets & showtimes",
          body: "<p>Find theaters, IMAX listings, and the latest from Universal.</p>",
          image_url: STILL.poster,
          href: "https://www.odysseymovie.com",
          buttons: [
            btn("OdysseyMovie.com", {
              target_url: "https://www.odysseymovie.com",
              open_in_new_tab: true,
              sort_order: 0,
            }),
          ],
        },
        0
      ),
      item(
        {
          title: "New trailer",
          subtitle: "YouTube · Universal Pictures",
          body: "<p>The full Official New Trailer — best with headphones or theater sound.</p>",
          image_url: STILL.epic,
          href: `https://www.youtube.com/watch?v=${TRAILER_NEW}`,
          buttons: [
            btn("Play trailer", {
              target_url: `https://www.youtube.com/watch?v=${TRAILER_NEW}`,
              open_in_new_tab: true,
              sort_order: 0,
            }),
          ],
        },
        1
      ),
      item(
        {
          title: "Follow the film",
          subtitle: "Instagram · X · TikTok",
          body: "<p>Stills, clips, and opening-week moments from the official channels.</p>",
          image_url: STILL.damonZendaya,
          href: "https://www.instagram.com/theodysseymovie",
          buttons: [
            btn("Instagram", {
              target_url: "https://www.instagram.com/theodysseymovie",
              open_in_new_tab: true,
              sort_order: 0,
            }),
          ],
        },
        2
      ),
    ],
  },
  {
    section_key: "cta_band",
    sort_order: 11,
    in_page_nav_title: "Tickets",
    section_title: "See it on the biggest screen you can find",
    sub_title:
      "The Odyssey opens everywhere July 17, 2026 — including IMAX theaters worldwide.",
    section_bg_img: STILL.epic,
    section_img_url: STILL.poster,
    buttons: [
      btn("Get tickets", {
        target_url: "https://www.odysseymovie.com",
        open_in_new_tab: true,
        sort_order: 0,
      }),
      btn("Watch trailer", {
        target_url: `https://www.youtube.com/watch?v=${TRAILER_NEW}`,
        variant: "secondary",
        open_in_new_tab: true,
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
  console.log("Seeding The Odyssey promotional content page…");

  await ensureContentPage();

  const sectionByKey = new Map();
  for (const def of SECTION_DEFS) {
    const section = await ensureSection(def);
    sectionByKey.set(def.key, section);
  }

  const content = await Content.findOneAndUpdate(
    { path: "/odyssey" },
    {
      $set: {
        path: "/odyssey",
        slug: "odyssey",
        name: "The Odyssey",
        description:
          "Promotional page for Christopher Nolan’s The Odyssey — mythic action epic starring Matt Damon, in theaters July 17, 2026. Trailers, cast, IMAX story, and ticket links.",
        status: "active",
        sortOrder: 50,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );

  await replaceExtras("content", content._id, PLACEMENTS, sectionByKey);

  console.log(`  ✓ /odyssey (${PLACEMENTS.length} sections) — ${content._id}`);
  console.log("Done. Open http://localhost:3001/odyssey");
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
