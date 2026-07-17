import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Page from "../modules/cms/page.model.js";
import Section from "../modules/cms/section.model.js";
import { getSectionCatalogMeta } from "../modules/cms/section.catalog.js";

/**
 * Upserts homepage hero section catalog entries (content_scope: page)
 * and maps them onto the Home page template.
 * Only hero_classic is enabled by default — others are tagged but off
 * so you can switch layouts in CMS without stacking every hero.
 *
 * Usage:
 *   npm run seed:heroes
 */

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

const HOME_TITLE =
  "Enterprise-Grade Industry Solutions for Workforce Transformation";
const HOME_SUB =
  "SkillHub delivers strategic, industry-aligned technology solutions that help enterprise leaders close capability gaps, accelerate digital initiatives, and achieve measurable business impact at scale.";

const HEROES = [
  {
    key: "hero_classic",
    name: "Hero — Classic",
    description: "Navy gradient hero with atmosphere (default homepage)",
    section_title: HOME_TITLE,
    sub_title: HOME_SUB,
    in_page_nav_title: "",
    data: {},
    buttons: [
      btn("Explore Solutions", {
        target_url: "/courses",
        sort_order: 0,
      }),
    ],
    content_scope: "page",
    status: true,
    home_tag: { sort_order: 1, status: true },
  },
  {
    key: "hero_split",
    name: "Hero — Split",
    description: "Copy left, image right",
    section_title: HOME_TITLE,
    sub_title: HOME_SUB,
    in_page_nav_title: "",
    data: {},
    buttons: [
      btn("Browse catalog", { target_url: "/courses", sort_order: 0 }),
      btn("Talk to us", {
        variant: "outline",
        target_url: "/courses",
        sort_order: 1,
      }),
    ],
    content_scope: "page",
    status: true,
    home_tag: { sort_order: 2, status: false },
  },
  {
    key: "hero_centered",
    name: "Hero — Centered",
    description: "Centered editorial hero",
    section_title: HOME_TITLE,
    sub_title: HOME_SUB,
    in_page_nav_title: "",
    data: {},
    buttons: [
      btn("Explore Solutions", {
        target_url: "/courses",
        sort_order: 0,
      }),
    ],
    content_scope: "page",
    status: true,
    home_tag: { sort_order: 3, status: false },
  },
  {
    key: "hero_minimal",
    name: "Hero — Minimal",
    description: "Light, compact hero with accent rule",
    section_title: HOME_TITLE,
    sub_title: HOME_SUB,
    in_page_nav_title: "",
    data: {},
    buttons: [
      btn("Explore Solutions", {
        target_url: "/courses",
        sort_order: 0,
      }),
    ],
    content_scope: "page",
    status: true,
    home_tag: { sort_order: 4, status: false },
  },
  {
    key: "hero_media",
    name: "Hero — Media Slider",
    description: "Full-bleed banner slider — multiple slides via items",
    section_title: "",
    sub_title: "",
    in_page_nav_title: "",
    data: {},
    buttons: [],
    items: [
      item(
        {
          title: HOME_TITLE,
          subtitle: HOME_SUB,
          buttons: [
            btn("Explore Solutions", {
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
          title: "Authorized training that scales",
          subtitle:
            "Official curricula across cloud, security, data, and AI — delivered worldwide.",
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
          title: "Close skill gaps faster",
          body: "Role-based paths, hands-on labs, and certification-aligned courses for enterprise teams.",
          buttons: [
            btn("View catalog", {
              target_url: "/courses",
              variant: "inverse",
              sort_order: 0,
            }),
          ],
        },
        2
      ),
    ],
    content_scope: "page",
    status: true,
    home_tag: { sort_order: 5, status: false },
  },
  {
    key: "hero_stats",
    name: "Hero — Stats",
    description: "Hero with proof stats row",
    section_title: HOME_TITLE,
    sub_title: HOME_SUB,
    in_page_nav_title: "",
    data: {},
    items: [
      item({ value: "1M+", label: "Learners trained" }, 0),
      item({ value: "200+", label: "Enterprise clients" }, 1),
      item({ value: "50+", label: "Tech vendors" }, 2),
    ],
    buttons: [
      btn("Explore Solutions", {
        target_url: "/courses",
        sort_order: 0,
      }),
    ],
    content_scope: "page",
    status: true,
    home_tag: { sort_order: 6, status: false },
  },
  {
    key: "hero_asymmetric",
    name: "Hero — Asymmetric",
    description: "Oversized title with side CTA rail",
    section_title: HOME_TITLE,
    sub_title: HOME_SUB,
    in_page_nav_title: "",
    data: {},
    buttons: [
      btn("Explore Solutions", {
        target_url: "/courses",
        sort_order: 0,
      }),
      btn("View vendors", {
        variant: "outline",
        target_url: "/vendors",
        sort_order: 1,
      }),
    ],
    content_scope: "page",
    status: true,
    home_tag: { sort_order: 7, status: false },
  },
  {
    key: "hero_dual_cta",
    name: "Hero — Dual CTA",
    description: "Soft wash hero with image and dual CTAs",
    section_title: HOME_TITLE,
    sub_title: HOME_SUB,
    in_page_nav_title: "",
    data: {},
    buttons: [
      btn("Explore Solutions", {
        target_url: "/courses",
        sort_order: 0,
      }),
      btn("Browse vendors", {
        variant: "secondary",
        target_url: "/vendors",
        sort_order: 1,
      }),
    ],
    content_scope: "page",
    status: true,
    home_tag: { sort_order: 8, status: false },
  },
];

async function seed() {
  await connectDB();

  const page = await Page.findOneAndUpdate(
    { key: "home" },
    {
      $set: {
        key: "home",
        name: "Home",
        description: "Marketing home page (Content entity)",
        entity_type: "content",
        status: true,
        is_sort_disabled: true,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`Home page ready: ${page.key} (${page._id})`);

  for (const hero of HEROES) {
    const { home_tag, ...fields } = hero;
    const catalog = getSectionCatalogMeta(hero.key);
    let section = await Section.findOne({ key: hero.key });

    if (!section) {
      section = new Section({
        ...fields,
        category: catalog?.category || "",
        tags: catalog?.tags || [],
        pages: [],
      });
    } else {
      section.name = fields.name;
      section.description = fields.description;
      section.section_title = fields.section_title;
      section.sub_title = fields.sub_title;
      section.in_page_nav_title = fields.in_page_nav_title;
      section.data = fields.data ?? {};
      section.buttons = fields.buttons || [];
      if (fields.items) section.items = fields.items;
      section.content_scope = "page";
      section.status = true;
      if (catalog) {
        section.category = catalog.category;
        section.tags = catalog.tags;
      }
    }

    const tagPayload = {
      page: page._id,
      page_key: "home",
      sort_order: home_tag.sort_order,
      status: home_tag.status !== false,
      section_title: fields.section_title,
      sub_title: fields.sub_title,
      in_page_nav_title: "",
      buttons: fields.buttons || [],
      items: fields.items || undefined,
      data: fields.data ?? {},
    };

    const idx = section.pages.findIndex((p) => p.page_key === "home");
    if (idx >= 0) {
      const existing = section.pages[idx].toObject
        ? section.pages[idx].toObject()
        : section.pages[idx];
      section.pages[idx] = { ...existing, ...tagPayload };
    } else {
      section.pages.push(tagPayload);
    }

    await section.save();
    console.log(
      `  ${hero.key} → home#${home_tag.sort_order} (${home_tag.status ? "on" : "off"})`
    );
  }

  console.log(`Seeded ${HEROES.length} hero sections on home`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
