import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Page from "../modules/cms/page.model.js";
import Section from "../modules/cms/section.model.js";

/**
 * Upserts Customer Testimonials as a GLOBAL section with carousel items,
 * and tags it onto the Home page (and optionally other templates).
 *
 * Usage:
 *   npm run seed:testimonials
 */

function item(fields, i = 0) {
  return {
    title: "",
    subtitle: "",
    body: "",
    label: "",
    value: "5",
    image_url: "",
    icon: "",
    href: "",
    buttons: [],
    sort_order: i,
    status: true,
    ...fields,
  };
}

const TESTIMONIALS = [
  item(
    {
      title: "Murali S.",
      body: "Quite an insightful training; tons of real time examples to co-relate with what we are learning and helps with real time projects.  The training has opened doors to countless opportunities.",
      image_url:
        "https://images.netcomlearning.com/cms/logos/bank-of-america.png?1697714410830",
      value: "5",
    },
    0
  ),
  item(
    {
      title: "Mark G.",
      body: "The instructor was absolutely outstanding, very patient, knowledgeable, and consistently kept the class interesting. I would like to thank NetCom Learning for this educational opportunity.",
      image_url:
        "https://images.netcomlearning.com/cms/logos/optum.png?1697714884430",
      value: "5",
    },
    1
  ),
  item(
    {
      title: "Andrew Y.",
      body: "The team was very happy with the overall training. The content, reading material and training resources were very useful. The training instructor was knowledgeable, engaging and had a clear teaching style.",
      image_url:
        "https://images.netcomlearning.com/cms/logos/deloitte-logo.png?1697715092298",
      value: "5",
    },
    2
  ),
  item(
    {
      title: "Ian R.",
      body: "The private training was incredibly helpful to learn how to approach the test on top of covering the material. This class was a wonderful experience in every aspect; would love to do more classes.",
      image_url:
        "https://images.netcomlearning.com/cms/logos/boeing-logo.png?1697715264340",
      value: "5",
    },
    3
  ),
];

const PAGE_TAGS = [
  { page_key: "home", sort_order: 26, status: true },
  { page_key: "product", sort_order: 5, status: true },
  { page_key: "vendor", sort_order: 5, status: true },
];

async function seed() {
  await connectDB();

  const fields = {
    key: "customer_testimonials",
    name: "Customer Testimonials",
    description:
      "Carousel with star rating, quote, author, and company logo (global)",
    section_title: "Customer Testimonials",
    sub_title: "",
    in_page_nav_title: "Testimonials",
    button_title: "",
    target_url: "",
    data: {},
    buttons: [],
    items: TESTIMONIALS,
    content_scope: "global",
    status: true,
  };

  let section = await Section.findOne({ key: "customer_testimonials" });
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
    section.content_scope = "global";
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
      section_title: "",
      sub_title: "",
      in_page_nav_title: "",
      buttons: [],
      items: [],
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
      `  customer_testimonials → ${tag.page_key}#${tag.sort_order} (${tag.status ? "on" : "off"})`
    );
  }

  await section.save();
  console.log(`Seeded customer_testimonials (global) · ${TESTIMONIALS.length} quotes`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
