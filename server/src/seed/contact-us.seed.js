/**
 * Seeds global Contact Us section and maps it onto home + content pages.
 *
 * Usage:
 *   npm run seed:contact-us
 */
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Page from "../modules/cms/page.model.js";
import Section from "../modules/cms/section.model.js";
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

const CONTACT_CONTENT = {
  section_title: "Talk with the SkillHub team",
  sub_title:
    "Questions about publishing pages, catalog paths, or a pilot for your org — we are happy to help.",
  in_page_nav_title: "Contact",
  data: {
    body: "<p>Share a brief about your audience and goals. We will point you to the right next step — whether that is a content page, a course path, or a deeper platform walkthrough.</p>",
  },
  buttons: [
    btn("How it works", {
      target_url: "/how-it-works",
      sort_order: 0,
    }),
    btn("Browse courses", {
      target_url: "/courses",
      variant: "secondary",
      sort_order: 1,
    }),
  ],
  items: [
    item(
      {
        icon: "email",
        title: "Email",
        subtitle: "hello@skillhub.example",
        href: "mailto:hello@skillhub.example",
        body: "<p>Best for publishing and partnership questions.</p>",
      },
      0
    ),
    item(
      {
        icon: "phone",
        title: "Phone",
        subtitle: "+1 (415) 555-0142",
        href: "tel:+14155550142",
        body: "<p>Weekdays, 9am–6pm PT.</p>",
      },
      1
    ),
    item(
      {
        icon: "location",
        title: "Office",
        subtitle: "San Francisco · Remote-friendly",
        href: "",
        body: "<p>Book a virtual walkthrough of the live CMS.</p>",
      },
      2
    ),
  ],
};

async function ensureContactSection() {
  const catalog = getSectionCatalogMeta("contact_us");
  let section = await Section.findOne({ key: "contact_us" });
  if (!section) {
    section = await Section.create({
      key: "contact_us",
      name: "Contact Us",
      description: "Global contact band — email, phone, location, CTAs",
      content_scope: "global",
      status: true,
      category: catalog?.category || "content",
      tags: catalog?.tags || ["contact", "global"],
      pages: [],
      ...CONTACT_CONTENT,
    });
    console.log("  + created contact_us");
  } else {
    section.name = "Contact Us";
    section.description = "Global contact band — email, phone, location, CTAs";
    section.content_scope = "global";
    section.status = true;
    section.section_title = CONTACT_CONTENT.section_title;
    section.sub_title = CONTACT_CONTENT.sub_title;
    section.in_page_nav_title = CONTACT_CONTENT.in_page_nav_title;
    section.data = CONTACT_CONTENT.data;
    section.buttons = CONTACT_CONTENT.buttons;
    section.items = CONTACT_CONTENT.items;
    if (catalog) {
      section.category = catalog.category;
      section.tags = catalog.tags;
    }
    await section.save();
    console.log("  ✓ updated contact_us global content");
  }
  return section;
}

function upsertPageTag(section, page, sortOrder) {
  const idx = (section.pages || []).findIndex((p) => p.page_key === page.key);
  const existing =
    idx >= 0 && section.pages[idx]?.toObject
      ? section.pages[idx].toObject()
      : idx >= 0
        ? section.pages[idx]
        : {};

  const tag = {
    ...existing,
    page: page._id,
    page_key: page.key,
    sort_order: sortOrder,
    status: true,
    // Global section: placement does not own copy — leave overrides empty
    section_title: null,
    sub_title: null,
    in_page_nav_title: null,
    data: null,
    buttons: undefined,
    items: undefined,
  };

  if (idx >= 0) section.pages[idx] = tag;
  else section.pages.push(tag);
}

async function seed() {
  await connectDB();
  console.log("Seeding global Contact Us…");

  const section = await ensureContactSection();

  const homePage = await Page.findOneAndUpdate(
    { key: "home" },
    {
      $setOnInsert: {
        key: "home",
        name: "Home",
        entity_type: "content",
        status: true,
        is_sort_disabled: true,
      },
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );

  const contentPage = await Page.findOneAndUpdate(
    { key: "content" },
    {
      $setOnInsert: {
        key: "content",
        name: "Content page",
        entity_type: "content",
        status: true,
        is_sort_disabled: false,
      },
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );

  // Home + content templates — global section content lives on Section doc
  upsertPageTag(section, homePage, 90);
  upsertPageTag(section, contentPage, 99);
  await section.save();
  console.log("  ✓ tagged on home + content templates");

  console.log("Done. Contact Us appears on Home and content pages.");
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
