import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Page from "../modules/cms/page.model.js";
import Section from "../modules/cms/section.model.js";

/**
 * Upserts Partners — Logo Marquee as a GLOBAL section catalog entry
 * and tags it onto the Home page template.
 *
 * content_scope: global → edit logos once under Content sections;
 * page editors only control placement / on-off.
 *
 * Usage:
 *   npm run seed:partners
 */

const PARTNER_LOGOS = [
  {
    name: "Amazon",
    image_url:
      "https://images.netcomlearning.com/cms/logos/amazon-logo-training-partner.png",
  },
  {
    name: "BAE SYSTEMS",
    image_url:
      "https://images.netcomlearning.com/cms/logos/bae-systems-logo-training-partner.png",
  },
  {
    name: "Bank of America",
    image_url:
      "https://images.netcomlearning.com/cms/logos/bank-of-america-logo-training-partner.png",
  },
  {
    name: "BlueCross BlueShield of Tennessee",
    image_url:
      "https://images.netcomlearning.com/cms/logos/bluecross-blueshield-of-tennessee-logo-training-partner.png",
  },
  {
    name: "BMO",
    image_url:
      "https://images.netcomlearning.com/cms/logos/bmo-logo-training-partner.png",
  },
  {
    name: "Comcast",
    image_url:
      "https://images.netcomlearning.com/cms/logos/comcast-logo-training-partner.png",
  },
  {
    name: "Dell Technologies",
    image_url:
      "https://images.netcomlearning.com/cms/logos/dell-technologies-logo-training-partner.png",
  },
  {
    name: "Deloitte",
    image_url:
      "https://images.netcomlearning.com/cms/logos/deloitte-logo-training-partner.png",
  },
  {
    name: "HP",
    image_url:
      "https://images.netcomlearning.com/cms/logos/hp-logo-training-partner.png",
  },
  {
    name: "IRS",
    image_url:
      "https://images.netcomlearning.com/cms/logos/irs-logo-training-partner.png",
  },
  {
    name: "JP Morgan Chase & Co.",
    image_url:
      "https://images.netcomlearning.com/cms/logos/jp-morgan-chase-co-logo-training-partner.png",
  },
  {
    name: "Kroll",
    image_url:
      "https://images.netcomlearning.com/cms/logos/kroll-logo-training-partner.png",
  },
  {
    name: "New York City Subway",
    image_url:
      "https://images.netcomlearning.com/cms/logos/new-york-city-subway-logo-training-partner.png",
  },
  {
    name: "Northrop Grumman",
    image_url:
      "https://images.netcomlearning.com/cms/logos/northrop-grumman-logo-training-partner.png",
  },
  {
    name: "NYCDCAS",
    image_url:
      "https://images.netcomlearning.com/cms/logos/nycdcas-logo-training-partner.png",
  },
  {
    name: "Optum",
    image_url:
      "https://images.netcomlearning.com/cms/logos/optum-logo-training-partner.png",
  },
  {
    name: "US Army",
    image_url:
      "https://images.netcomlearning.com/cms/logos/us-army-logo-training-partner.png",
  },
];

const TITLE =
  "Trusted Training Partner for Organizations Across the Globe";

function logoItem(logo, i) {
  return {
    title: logo.name,
    subtitle: "",
    body: "",
    label: "",
    value: "",
    image_url: logo.image_url,
    icon: "",
    href: "",
    buttons: [],
    sort_order: i,
    status: true,
  };
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

  const items = PARTNER_LOGOS.map(logoItem);
  const fields = {
    key: "partners_marquee",
    name: "Partners — Logo Marquee",
    description: "Centered title + infinite partner logo strip (global)",
    section_title: TITLE,
    sub_title: "",
    in_page_nav_title: "Trusted Partners",
    button_title: "",
    target_url: "",
    data: {},
    buttons: [],
    items,
    content_scope: "global",
    status: true,
  };

  let section = await Section.findOne({ key: "partners_marquee" });
  if (!section) {
    section = new Section({ ...fields, pages: [] });
  } else {
    section.name = fields.name;
    section.description = fields.description;
    section.section_title = fields.section_title;
    section.sub_title = fields.sub_title;
    section.in_page_nav_title = fields.in_page_nav_title;
    section.button_title = fields.button_title;
    section.target_url = fields.target_url;
    section.data = fields.data;
    section.buttons = fields.buttons;
    section.items = fields.items;
    section.content_scope = "global";
    section.status = true;
  }

  const tagPayload = {
    page: page._id,
    page_key: "home",
    sort_order: 20,
    status: true,
    // Global scope: page tags don't own content; keep empty overrides
    section_title: "",
    sub_title: "",
    in_page_nav_title: "",
    buttons: [],
    items: [],
    data: {},
  };

  const idx = section.pages.findIndex((p) => p.page_key === "home");
  if (idx >= 0) {
    const existing = section.pages[idx].toObject
      ? section.pages[idx].toObject()
      : section.pages[idx];
    section.pages[idx] = {
      ...existing,
      ...tagPayload,
      sort_order: existing.sort_order || tagPayload.sort_order,
      status: existing.status !== false,
    };
  } else {
    section.pages.push(tagPayload);
  }

  await section.save();
  console.log(
    `  partners_marquee → global · home#${tagPayload.sort_order} · ${items.length} logos`
  );

  // Keep legacy `partners` key pointing at same global content if present
  let legacy = await Section.findOne({ key: "partners" });
  if (legacy) {
    legacy.content_scope = "global";
    legacy.section_title = TITLE;
    legacy.items = items;
    legacy.name = "Partners";
    legacy.description = "Alias — prefer partners_marquee";
    await legacy.save();
    console.log("  partners (legacy) updated to global + logos");
  }

  console.log("Seeded partners_marquee (global)");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
