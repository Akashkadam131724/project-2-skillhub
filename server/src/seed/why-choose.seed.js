import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Page from "../modules/cms/page.model.js";
import Section from "../modules/cms/section.model.js";

/**
 * Upserts Why Choose feature cards (icon + title + body) and tags Home.
 *
 * Usage:
 *   npm run seed:why-choose
 */

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

const CARDS = [
  item(
    {
      title: "World-class learning experience",
      body: "We are proud to be recognized as a Finalist for the 2025 Microsoft Partner of the Year Awards. We are official training partners for industry leaders like AWS, CompTIA, EC Council, Cisco, & more.",
      image_url:
        "https://images.netcomlearning.com/cms/icons/industry-recognized-partners.jpg",
    },
    0
  ),
  item(
    {
      title: "Global Delivery Capabilities",
      body: "Our training solutions have spanned over 1,300 locations globally, covering five different continents. Our multi-shore presence empowers us to provide training wherever needed.",
      image_url: "https://images.netcomlearning.com/cms/icons/locations.png",
    },
    1
  ),
  item(
    {
      title: "Highest Quality Learning Experience",
      body: "Having trained over a million learners, SkillHub takes pride in consistently receiving stellar ratings, averaging 8.5 out of 9.0.",
      image_url:
        "https://images.netcomlearning.com/cms/icons/world-class-learning-experience.png",
    },
    2
  ),
  item(
    {
      title: "Custom Learning Plan",
      body: "We offer a unique learning framework that can be customized according to the focused business outcomes.",
      image_url:
        "https://images.netcomlearning.com/cms/icons/training-methods.png",
    },
    3
  ),
  item(
    {
      title: "3,200+ Certified Instructors",
      body: "SkillHub ensures that all training sessions are conducted by Certified Instructors.",
      image_url: "https://images.netcomlearning.com/cms/icons/instructors.png",
    },
    4
  ),
  item(
    {
      title: "28+ Years of Business Experience",
      body: "Since 1998, we've dedicated ourselves to deliver comprehensive learning solutions and customized training, prioritizing a seamless learning experience with tangible business outcomes.",
      image_url:
        "https://images.netcomlearning.com/cms/icons/business-experience.png",
    },
    5
  ),
];

const PAGE_TAGS = [
  { page_key: "home", sort_order: 16, status: true },
];

async function seed() {
  await connectDB();

  const fields = {
    key: "why_choose",
    name: "Why Choose",
    description: "Navy band with icon feature cards",
    section_title: "Why Choose SkillHub?",
    sub_title: "",
    in_page_nav_title: "Why Choose",
    button_title: "",
    target_url: "",
    data: {},
    buttons: [],
    items: CARDS,
    content_scope: "page",
    status: true,
  };

  let section = await Section.findOne({ key: "why_choose" });
  if (!section) {
    section = new Section({ ...fields, pages: [] });
  } else {
    section.name = fields.name;
    section.description = fields.description;
    section.section_title = fields.section_title;
    section.sub_title = fields.sub_title;
    section.in_page_nav_title = fields.in_page_nav_title;
    section.data = {};
    section.buttons = [];
    section.items = fields.items;
    section.content_scope = fields.content_scope;
    section.status = true;
  }

  for (const tag of PAGE_TAGS) {
    const page = await Page.findOne({ key: tag.page_key });
    if (!page) {
      console.log(`  skip ${tag.page_key} (page missing)`);
      continue;
    }

    const tagPayload = {
      page: page._id,
      page_key: tag.page_key,
      sort_order: tag.sort_order,
      status: tag.status !== false,
      section_title: fields.section_title,
      sub_title: "",
      in_page_nav_title: fields.in_page_nav_title,
      buttons: [],
      items: fields.items,
      data: {},
    };

    const idx = section.pages.findIndex((p) => p.page_key === tag.page_key);
    if (idx >= 0) {
      const existing = section.pages[idx].toObject
        ? section.pages[idx].toObject()
        : section.pages[idx];
      section.pages[idx] = {
        ...existing,
        ...tagPayload,
        sort_order: existing.sort_order ?? tagPayload.sort_order,
        status: existing.status !== false,
      };
    } else {
      section.pages.push(tagPayload);
    }

    console.log(
      `  why_choose → ${tag.page_key}#${tag.sort_order} (${tag.status ? "on" : "off"})`
    );
  }

  await section.save();
  console.log(`Seeded why_choose · ${CARDS.length} feature cards`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
