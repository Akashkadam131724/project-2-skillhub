import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Page from "../modules/cms/page.model.js";
import Section from "../modules/cms/section.model.js";

/**
 * Upserts Text + Media section (content_scope: page) on Home with two rows.
 *
 * Usage:
 *   npm run seed:text-media
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

const TEXT_MEDIA = {
  key: "text_media",
  name: "Text + Media",
  description: "Two-column text + image rows (media start or end)",
  section_title: "",
  sub_title: "",
  in_page_nav_title: "Learning Paths",
  content_scope: "page",
  status: true,
  buttons: [],
  data: {},
  items: [
    item(
      {
        title: "Learn step-by-step with the Solutions Architect Learning Plan",
        body: `<p>AWS Learning Plans offer a suggested set of digital courses designed to give beginners a clear path to learn. The Solutions Architect Learning Plan eliminates the guesswork—you don’t have to wonder if you’re starting in the right place or taking the right courses.</p><p>You’ll be guided through a recommended curriculum built by AWS experts that you can take at your own pace. Complete the full plan, or choose the courses that interest you. After you complete this plan, you’ll be better able to build solutions for account security, monitoring, automation, containers, and more. You’ll have gained skills to help you enter careers in Solutions Architecting, Cloud Architecting, or Engineering. You’ll also have a better understanding of AWS services like AWS Lambda, AWS X-Ray, Amazon Virtual Private Cloud, and more.</p><p><a href="https://explore.skillbuilder.aws/learn/public/learning_plan/view/1044/solutions-architect-learning-plan">Beginners start here</a></p>`,
        image_url:
          "https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/training/approved/images/5ec795e2-f357-435b-8840-ddd277349182.f4f62c6102ee5255ec04451c28062b37074e7927.jpeg",
        value: "end",
      },
      0
    ),
    item(
      {
        title: "Dive deep into architecting with the AWS Ramp-Up Guide",
        body: `<p>If you’re looking to dive deeper into the broader range of learning materials available on architecting, including digital courses, blogs, whitepapers, and more, we recommend our Ramp-Up Guide.</p><p>AWS experts have constructed this downloadable guide to help you navigate the broad set of resources and content to help you develop your skills in architecting—all in one place. Whether you prefer to read articles, view PDFs, or take digital courses, you can use this guide at your own pace. It will help you understand all your learning options and determine which are best for you based on your knowledge and skill level.</p><p><a href="https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/training/approved/pdfs/ramp-up-guides/Ramp-Up_Guide_Architect.pdf">Download the Solutions Architect Ramp-Up Guide</a></p>`,
        image_url:
          "https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/architecture/approved/images/b4102477-fb92-444d-9f80-35223b698a6e.80373e706878345b4ff9d76c42ec9e8824d7cf56.png",
        value: "start",
      },
      1
    ),
  ],
  home_tag: { sort_order: 12, status: true },
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
    `  ${fields.key} → home#${home_tag.sort_order} (${home_tag.status ? "on" : "off"}) · ${fields.items.length} rows`
  );
}

async function seed() {
  await connectDB();

  const page = await Page.findOneAndUpdate(
    { key: "home" },
    {
      $setOnInsert: {
        key: "home",
        name: "Home",
        description: "Marketing home page (Content entity)",
        entity_type: "content",
        status: true,
      },
    },
    { upsert: true, new: true }
  );

  await upsertSection(page, TEXT_MEDIA);

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch(async (err) => {
  console.error("Text-media seed failed:", err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
