/**
 * Seeds Content page /contact-us with enterprise contact form section.
 *
 * Usage:
 *   npm run seed:contact-page
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

const SECTION_DEFS = [
  { key: "in_page_nav", name: "In-page Nav", description: "Sticky section jump links", content_scope: "page" },
  { key: "editorial_banner", name: "Editorial Banner", description: "Full-bleed editorial hero", content_scope: "page" },
  { key: "contact_form", name: "Contact Form", description: "Enterprise inquiry form with channels", content_scope: "page" },
  { key: "metric_rail", name: "Metric Rail", description: "Metric strip", content_scope: "page" },
  { key: "feature_tabs", name: "Feature Tabs", description: "Tabbed features", content_scope: "page" },
  { key: "faq", name: "FAQ", description: "Frequently asked questions", content_scope: "page" },
  { key: "cta_band", name: "CTA Band", description: "Full-bleed call to action", content_scope: "page" },
];

const PLACEMENTS = [
  { section_key: "in_page_nav", sort_order: 0 },
  {
    section_key: "editorial_banner",
    sort_order: 1,
    in_page_nav_title: "Contact",
    section_title: "Let’s build your next learning story",
    sub_title:
      "Whether you need a publishing walkthrough, a catalog pilot, or a partnership conversation — the SkillHub team is ready.",
    section_img_url:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=2000&q=80",
    data: {
      eyebrow: "Contact SkillHub",
      body: "<p>Enterprise response within one business day. Prefer a call? Use the form and pick a time window in your message.</p>",
    },
    buttons: [
      btn("How it works", {
        target_url: "/how-it-works",
        variant: "inverse",
        sort_order: 0,
      }),
      btn("Browse courses", {
        target_url: "/courses",
        variant: "secondary",
        sort_order: 1,
      }),
    ],
  },
  {
    section_key: "contact_form",
    sort_order: 2,
    in_page_nav_title: "Inquiry",
    section_title: "Talk with a SkillHub specialist",
    sub_title:
      "Share a short brief. We will route you to the right person — publishing, catalog, or partnerships.",
    data: {
      body: "<p>Use this form for demos, publishing help, course path questions, and partner inquiries. For urgent support, call the number on the left.</p>",
      success_message:
        "Thanks — your inquiry is in. A SkillHub specialist will follow up within one business day.",
    },
    items: [
      item(
        {
          icon: "email",
          title: "Email",
          subtitle: "hello@skillhub.example",
          href: "mailto:hello@skillhub.example",
          body: "<p>Best for detailed briefs and file attachments.</p>",
        },
        0
      ),
      item(
        {
          icon: "phone",
          title: "Phone",
          subtitle: "+1 (415) 555-0142",
          href: "tel:+14155550142",
          body: "<p>Weekdays 9am–6pm PT · Americas &amp; remote teams.</p>",
        },
        1
      ),
      item(
        {
          icon: "location",
          title: "HQ",
          subtitle: "San Francisco · Remote-first",
          href: "",
          body: "<p>Virtual walkthroughs available worldwide.</p>",
        },
        2
      ),
    ],
  },
  {
    section_key: "metric_rail",
    sort_order: 3,
    in_page_nav_title: "SLA",
    section_title: "How we respond",
    items: [
      item({ value: "1", label: "Business day", title: "Typical reply" }, 0),
      item({ value: "30m", label: "Discovery call", title: "Optional" }, 1),
      item({ value: "Global", label: "Remote coverage", title: "Time zones" }, 2),
      item({ value: "NDA", label: "Ready on request", title: "Enterprise" }, 3),
    ],
  },
  {
    section_key: "feature_tabs",
    sort_order: 4,
    in_page_nav_title: "Topics",
    section_title: "What teams usually contact us about",
    sub_title: "Pick a topic in the form — or start here to frame your ask.",
    items: [
      item(
        {
          title: "Publishing & CMS",
          subtitle: "Pages, sections, campaigns",
          body: "<p>Help composing content pages, section layouts, and live edit workflows without waiting on a redeploy.</p>",
          image_url:
            "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=80",
          label: "Publish",
        },
        0
      ),
      item(
        {
          title: "Catalog & courses",
          subtitle: "Vendors · products · paths",
          body: "<p>Map roles to courses, review vendor portfolios, or plan a filtered academy for your industry.</p>",
          image_url:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
          label: "Catalog",
        },
        1
      ),
      item(
        {
          title: "Partnerships",
          subtitle: "Vendors & channel",
          body: "<p>Join the marketplace shelf, co-brand a solution hub, or align on a joint go-to-market page.</p>",
          image_url:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
          label: "Partners",
        },
        2
      ),
      item(
        {
          title: "Demo & pilot",
          subtitle: "See SkillHub live",
          body: "<p>Book a guided tour of the catalog, CMS, and sample content pages tailored to your audience.</p>",
          image_url:
            "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1400&q=80",
          label: "Demo",
        },
        3
      ),
    ],
  },
  {
    section_key: "faq",
    sort_order: 5,
    in_page_nav_title: "FAQ",
    section_title: "Before you submit",
    sub_title: "Quick answers that help us route your inquiry faster.",
    items: [
      item(
        {
          title: "Who should fill out this form?",
          body: "<p>L&amp;D leads, marketing publishers, learning partners, and vendor teams exploring SkillHub.</p>",
        },
        0
      ),
      item(
        {
          title: "Do you sign NDAs?",
          body: "<p>Yes — mention NDA in your message and we will send our standard agreement before a deeper technical review.</p>",
        },
        1
      ),
      item(
        {
          title: "Can we see a live CMS walkthrough?",
          body: "<p>Absolutely. Choose “Request a demo” as the topic and include preferred time zones.</p>",
        },
        2
      ),
      item(
        {
          title: "Is this the right place for course support?",
          body: "<p>For learner support on a specific course, include the course name in your message. For platform publishing questions, pick “Publishing &amp; CMS”.</p>",
        },
        3
      ),
    ],
  },
  {
    section_key: "cta_band",
    sort_order: 6,
    in_page_nav_title: "Explore",
    section_title: "Prefer to explore first?",
    sub_title:
      "Read how SkillHub works, tour Learning Campus, or browse the course catalog — then come back when you are ready to talk.",
    buttons: [
      btn("How it works", {
        target_url: "/how-it-works",
        sort_order: 0,
      }),
      btn("Learning Campus", {
        target_url: "/learning-campus",
        variant: "secondary",
        sort_order: 1,
      }),
      btn("Browse courses", {
        target_url: "/courses",
        variant: "outline",
        sort_order: 2,
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
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
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
  console.log("Seeding /contact-us page…");

  await ensureContentPage();

  const sectionByKey = new Map();
  for (const def of SECTION_DEFS) {
    sectionByKey.set(def.key, await ensureSection(def));
  }

  const content = await Content.findOneAndUpdate(
    { path: "/contact-us" },
    {
      $set: {
        path: "/contact-us",
        slug: "contact-us",
        name: "Contact Us",
        description:
          "Enterprise contact page — inquiry form, channels, and topics for publishing, catalog, and partnership conversations.",
        status: "active",
        sortOrder: 45,
      },
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true, runValidators: true }
  );

  await replaceExtras("content", content._id, PLACEMENTS, sectionByKey);

  // Unmap global contact_us from home + content — dedicated /contact-us page owns it
  const contactUs = await Section.findOne({ key: "contact_us" });
  if (contactUs) {
    const pages = (contactUs.pages || []).map((p) => {
      const obj = p.toObject ? p.toObject() : { ...p };
      if (obj.page_key === "home" || obj.page_key === "content") {
        return { ...obj, status: false };
      }
      return obj;
    });
    contactUs.pages = pages;
    await contactUs.save();
    console.log("  − disabled global contact_us on home + content");
  }

  console.log(`  ✓ /contact-us (${PLACEMENTS.length} sections) — ${content._id}`);
  console.log("Done. Open http://localhost:3001/contact-us");
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
