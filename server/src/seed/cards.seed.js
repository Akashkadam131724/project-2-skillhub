import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Page from "../modules/cms/page.model.js";
import Section from "../modules/cms/section.model.js";

/**
 * Upserts Training Options + Awards sections on the Home page.
 *
 * Usage:
 *   npm run seed:cards
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

const TRAINING_OPTIONS = {
  key: "training_options",
  name: "Training Options",
  description: "Flexible training modality cards (image + title + body)",
  section_title: "Flexible Training Options to Fit Every Learning Style",
  sub_title: "",
  in_page_nav_title: "Training Options",
  content_scope: "page",
  status: true,
  buttons: [],
  items: [
    item(
      {
        title: "Virtual Instructor-Led Training (vILT)",
        body: "Live, interactive online classes led by certified instructors — learn from anywhere without losing the classroom experience.",
      },
      0
    ),
    item(
      {
        title: "eLearning",
        body: "Self-paced digital courses you can start anytime, with structured modules designed for busy professionals.",
      },
      1
    ),
    item(
      {
        title: "Instructor-Led Training (ILT)",
        body: "Traditional in-person classroom sessions with hands-on labs and direct access to expert trainers.",
      },
      2
    ),
    item(
      {
        title: "Blended Learning",
        body: "Combine live instruction with online modules for a flexible path that balances depth, pace, and collaboration.",
      },
      3
    ),
  ],
  home_tag: { sort_order: 22, status: true },
};

const AWARDS = {
  key: "awards",
  name: "Awards & Recognition",
  description: "Award badge cards with optional CTA",
  section_title: "Globally Recognized for Excellence in Learning & Innovation",
  sub_title: "",
  in_page_nav_title: "Awards",
  content_scope: "page",
  status: true,
  buttons: [
    btn("View All Awards", {
      variant: "outline",
      target_url: "/awards",
      sort_order: 0,
    }),
  ],
  items: [
    item(
      {
        title: "Microsoft Learning Partner of the Year",
        body: "Recognized for delivering outstanding Microsoft learning solutions and helping organizations build cloud-ready teams.",
      },
      0
    ),
    item(
      {
        title: "AWS Partner Award Finalist",
        body: "Honored as a Partner of the Year Finalist for excellence in AWS training and enablement programs.",
      },
      1
    ),
    item(
      {
        title: "Top 20 IT & Technical Training Company",
        body: "Named among Training Industry’s Top 20 IT & Technical Training Companies for quality and innovation.",
      },
      2
    ),
  ],
  home_tag: { sort_order: 24, status: true },
};

async function upsertSection(page, def) {
  const { home_tag, ...fields } = def;
  let section = await Section.findOne({ key: fields.key });

  if (!section) {
    section = new Section({ ...fields, pages: [] });
  } else {
    section.name = fields.name;
    section.description = fields.description;
    section.section_title = fields.section_title;
    section.sub_title = fields.sub_title;
    section.in_page_nav_title = fields.in_page_nav_title;
    section.data = fields.data ?? {};
    section.buttons = fields.buttons || [];
    section.items = fields.items || [];
    section.content_scope = fields.content_scope || "page";
    section.status = true;
  }

  const tagPayload = {
    page: page._id,
    page_key: "home",
    sort_order: home_tag.sort_order,
    status: home_tag.status !== false,
    section_title: fields.section_title,
    sub_title: fields.sub_title,
    in_page_nav_title: fields.in_page_nav_title || "",
    buttons: fields.buttons || [],
    items: fields.items || [],
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
    `  ${fields.key} → home#${home_tag.sort_order} (${home_tag.status ? "on" : "off"}) · ${fields.items.length} cards`
  );
}

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

  await upsertSection(page, TRAINING_OPTIONS);
  await upsertSection(page, AWARDS);

  console.log("Seeded training_options + awards");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
